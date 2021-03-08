import request from 'supertest'
import connection from '../../src/database/connection'
import app from '../../src/app'

jest.mock('../../src/lib/mail')

describe('ONG', () => {
  beforeEach(async () => {
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
})
