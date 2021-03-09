import request from 'supertest'
import connection from '../../src/database/connection'
import app from '../../src/app'
import AppError from '../../src/error/AppError'

jest.mock('../../src/lib/mail')

const user = {
  email: 'gerald@email.com',
  password: '1234',
}

const projects = [
  {
    name: 'Projeto incrível',
  },
  {
    name: 'Projeto extraordinário',
  },
  { name: 'Projeto legal' },
]

const naver = {
  name: 'Triss Merigold',
  birthdate: '1992-03-15',
  admission_date: '2019-03-04',
  job_role: 'Sorcerer',
  projects: [1, 2],
}

const naverToUpdate = {
  name: 'Geral the Rivia',
  birthdate: '1992-05-20',
  admission_date: '2019-03-04',
  job_role: 'Witcher',
  projects: [3],
}

const naverToUpdateWithoutProjects = {
  name: 'Jennifer of Vengerberg',
  birthdate: '1890-01-46',
  admission_date: '2021-02-01',
  job_role: 'Sorcerer',
}

let token
let naverId

describe('Update Naver', () => {
  beforeAll(async () => {
    await connection.migrate.rollback()
    await connection.migrate.latest()

    await request(app).post('/users').send(user)

    token = (await request(app).post('/session').send(user)).body.token
    await Promise.all(
      projects.map(async project => {
        const { body } = await request(app)
          .post('/projects')
          .set('Authorization', `bearer ${token}`)
          .send(project)
        return body
      }),
    )

    naverId = (
      await request(app)
        .post('/navers')
        .set('Authorization', `bearer ${token}`)
        .send(naver)
    ).body.id
  })

  afterAll(async () => {
    await connection.destroy()
  })

  it('should be able to update a naver', async () => {
    return request(app)
      .put(`/navers/${naverId}`)
      .set('Authorization', `bearer ${token}`)
      .send(naverToUpdate)
      .then(result => {
        expect(result.status).toEqual(200)
        expect(result.body).toEqual(expect.objectContaining(naverToUpdate))
      })
  })

  it('should be able to update a naver without projects', async () => {
    return request(app)
      .put(`/navers/${naverId}`)
      .set('Authorization', `bearer ${token}`)
      .send(naverToUpdateWithoutProjects)
      .then(result => {
        expect(result.status).toEqual(200)
        expect(result.body).toEqual(
          expect.objectContaining(naverToUpdateWithoutProjects),
        )
      })
  })

  it('should not to be able to update with invalid naverId', async () => {
    return request(app)
      .put('/navers/2')
      .set('Authorization', `bearer ${token}`)
      .send(naverToUpdate)
      .then(result => {
        expect(result.status).toEqual(404)
        const error = new AppError('Naver not founded!', 404)
        expect(result.body).toEqual(error)
      })
  })

  it('should not to be able to update with unregistered projects', async () => {
    return request(app)
      .put(`/navers/${naverId}`)
      .set('Authorization', `bearer ${token}`)
      .send({
        ...naverToUpdate,
        projects: [1, 2, 4],
      })
      .then(result => {
        const error = new AppError(`The following projects does not exists: 4`)
        expect(result.status).toEqual(400)
        expect(result.body).toEqual(error)
      })
  })
})
