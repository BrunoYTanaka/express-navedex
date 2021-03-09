import request from 'supertest'
import connection from '../../src/database/connection'
import app from '../../src/app'
import AppError from '../../src/error/AppError'

jest.mock('../../src/lib/mail')

describe('Create USER', () => {
  beforeAll(async () => {
    await connection.migrate.rollback()
    await connection.migrate.latest()
  })

  afterAll(async () => {
    await connection.destroy()
  })

  it('should not to be able to create a new user missing password', async () => {
    const user = {
      email: 'gerald@email.com',
    }
    return request(app)
      .post('/users')
      .send(user)
      .then(result => {
        expect(result.status).toBe(400)
      })
  })

  it('should be able to create a new user', async () => {
    const user = {
      email: 'gerald@email.com',
      password: '1234',
    }
    return request(app)
      .post('/users')
      .send(user)
      .then(result => {
        expect(result.body).toHaveProperty('id')
        expect(result.body.email).toBe(user.email)
      })
  })

  it('should not be able to create a new user with duplicate email', async () => {
    const user = {
      email: 'gerald@email.com',
      password: '1234',
    }
    await request(app).post('/users').send(user)
    const error = new AppError('Email already used!')

    return request(app)
      .post('/users')
      .send(user)
      .then(result => {
        expect(result.status).toBe(400)
        expect(result.body).toEqual(error)
      })
  })
})
