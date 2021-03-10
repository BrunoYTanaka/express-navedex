import request from 'supertest'
import connection from '../../src/database/connection'
import app from '../../src/app'
import AppError from '../../src/error/AppError'

jest.mock('../../src/lib/mail')

const user = {
  email: 'gerald@email.com',
  password: '1234',
}

describe('Create Session', () => {
  beforeAll(async () => {
    await connection.migrate.rollback()
    await connection.migrate.latest()

    await request(app).post('/users').send(user)
  })

  afterAll(async () => {
    await connection.destroy()
  })

  it('should be able to create a session', async () => {
    return request(app)
      .post('/session')
      .send(user)
      .then(result => {
        expect(result.body).toHaveProperty('token')
        expect(result.body).toHaveProperty('user')
        expect(result.body.user.email).toBe(user.email)
      })
  })

  it('should not be able to create a session with invalid email', async () => {
    return request(app)
      .post('/session')
      .send({
        email: 'invalid-email@email.com',
        password: '1234',
      })
      .then(result => {
        const error = new AppError('Invalid credentials!')
        expect(result.status).toBe(400)
        expect(result.body).toEqual(error)
      })
  })
  it('should not be able to create a session with invalid password', async () => {
    return request(app)
      .post('/session')
      .send({
        email: user.email,
        password: '123456',
      })
      .then(result => {
        const error = new AppError('Password does not match!')
        expect(result.status).toBe(400)
        expect(result.body).toEqual(error)
      })
  })
})
