import request from 'supertest'
import connection from '../../src/database/connection'
import app from '../../src/app'
import AppError from '../../src/error/AppError'

jest.mock('../../src/lib/mail')

const user = {
  email: 'gerald@email.com',
  password: '1234',
}

const naver = {
  name: 'Triss',
  birthdate: '1999-05-15',
  admission_date: '2021-03-04',
  job_role: 'Sorcerer',
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

let token

describe('Create Naver', () => {
  beforeAll(async () => {
    await connection.migrate.rollback()
    await connection.migrate.latest()

    await request(app).post('/users').send(user)

    token = (await request(app).post('/session').send(user)).body.token

    await Promise.all(
      projects.map(project =>
        request(app)
          .post('/projects')
          .set('Authorization', `bearer ${token}`)
          .send(project),
      ),
    )
  })

  afterAll(async () => {
    await connection.destroy()
  })

  it('should be able to create a naver', async () => {
    return request(app)
      .post('/navers')
      .set('Authorization', `bearer ${token}`)
      .send(naver)
      .then(result => {
        expect(result.status).toEqual(200)
        expect(result.body).toEqual(expect.objectContaining(naver))
      })
  })

  it('should be able to create a naver with projects', async () => {
    return request(app)
      .post('/navers')
      .set('Authorization', `bearer ${token}`)
      .send({
        ...naver,
        projects: [1, 2, 3],
      })
      .then(result => {
        expect(result.status).toEqual(200)
        expect(result.body).toEqual(
          expect.objectContaining({
            ...naver,
            projects: [1, 2, 3],
          }),
        )
        expect(result.body.projects).toEqual([1, 2, 3])
      })
  })

  it('should be not to able to create with unregistered projects', async () => {
    return request(app)
      .post('/navers')
      .set('Authorization', `bearer ${token}`)
      .send({
        ...naver,
        projects: [1, 2, 4],
      })
      .then(result => {
        const error = new AppError(`The following projects does not exists: 4`)
        expect(result.status).toEqual(400)
        expect(result.body).toEqual(error)
      })
  })
})
