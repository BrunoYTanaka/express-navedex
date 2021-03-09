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

let token = ''

describe('List Projects', () => {
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

  it('should be able to list projects', async () => {
    return request(app)
      .get('/projects/list')
      .set('Authorization', `bearer ${token}`)
      .then(result => {
        expect(result.status).toEqual(200)
        expect(result.body).toEqual(
          expect.arrayContaining(
            projects.map(project => expect.objectContaining(project)),
          ),
        )
      })
  })

  it('should be able to list projects with filtered by name', async () => {
    return request(app)
      .get('/projects/list')
      .set('Authorization', `bearer ${token}`)
      .query({
        name: 'legal',
      })
      .then(result => {
        expect(result.status).toEqual(200)
        expect(result.body).toEqual([expect.objectContaining(projects[2])])
      })
  })
})
