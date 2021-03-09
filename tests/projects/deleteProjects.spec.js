import request from 'supertest'
import connection from '../../src/database/connection'
import app from '../../src/app'
import AppError from '../../src/error/AppError'

jest.mock('../../src/lib/mail')

const user = {
  email: 'gerald@email.com',
  password: '1234',
}

const project = {
  name: 'Project incrível',
}

let token
let projectId

describe('Delete Project', () => {
  beforeAll(async () => {
    await connection.migrate.rollback()
    await connection.migrate.latest()

    await request(app).post('/users').send(user)

    token = (await request(app).post('/session').send(user)).body.token

    projectId = (
      await request(app)
        .post('/projects')
        .set('Authorization', `bearer ${token}`)
        .send(project)
    ).body.id
  })

  afterAll(async () => {
    await connection.destroy()
  })

  it('should be able to delete a project', async () => {
    return request(app)
      .delete(`/projects/${projectId}`)
      .set('Authorization', `bearer ${token}`)
      .then(result => {
        expect(result.status).toEqual(204)
      })
  })

  it('should not be able to delete a naver with invalid projectId', async () => {
    return request(app)
      .delete('/projects/2')
      .set('Authorization', `bearer ${token}`)
      .then(result => {
        const error = new AppError('Project not founded!', 404)
        expect(result.status).toEqual(404)
        expect(result.body).toEqual(error)
      })
  })
})
