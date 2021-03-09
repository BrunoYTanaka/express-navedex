import request from 'supertest'
import connection from '../../src/database/connection'
import app from '../../src/app'
import AppError from '../../src/error/AppError'

jest.mock('../../src/lib/mail')

const user = {
  email: 'gerald@email.com',
  password: '1234',
}
const navers = [
  {
    name: 'Triss Merigold',
    birthdate: '1992-03-15',
    admission_date: '2019-03-04',
    job_role: 'Sorcerer',
  },
  {
    name: 'Geral the Rivia',
    birthdate: '1992-05-20',
    admission_date: '2019-03-04',
    job_role: 'Witcher',
  },
  {
    name: 'Dandelion',
    birthdate: '1999-05-15',
    admission_date: '2020-03-04',
    job_role: 'Bard',
  },
]

const project = {
  name: 'Project incrível',
}

let token

describe('Create Project', () => {
  beforeAll(async () => {
    await connection.migrate.rollback()
    await connection.migrate.latest()

    await request(app).post('/users').send(user)

    token = (await request(app).post('/session').send(user)).body.token

    await Promise.all(
      navers.map(naver =>
        request(app)
          .post('/navers')
          .set('Authorization', `bearer ${token}`)
          .send(naver),
      ),
    )
  })

  afterAll(async () => {
    await connection.destroy()
  })

  it('should be able to create a project', async () => {
    return request(app)
      .post('/projects')
      .set('Authorization', `bearer ${token}`)
      .send(project)
      .then(result => {
        expect(result.status).toEqual(200)
        expect(result.body).toEqual(expect.objectContaining(project))
      })
  })

  it('should be able to create a project with navers', async () => {
    return request(app)
      .post('/projects')
      .set('Authorization', `bearer ${token}`)
      .send({
        ...project,
        navers: [1, 2, 3],
      })
      .then(result => {
        expect(result.status).toEqual(200)
        expect(result.body).toEqual(
          expect.objectContaining({
            ...project,
            navers: [1, 2, 3],
          }),
        )
        expect(result.body.navers).toEqual([1, 2, 3])
      })
  })

  it('should be not to able to create a project with unregistered navers', async () => {
    return request(app)
      .post('/projects')
      .set('Authorization', `bearer ${token}`)
      .send({
        ...project,
        navers: [1, 2, 4],
      })
      .then(result => {
        const error = new AppError(`The following navers does not exists: 4`)
        expect(result.status).toEqual(400)
        expect(result.body).toEqual(error)
      })
  })
})
