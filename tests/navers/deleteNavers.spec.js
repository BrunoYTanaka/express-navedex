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
  name: 'Triss Merigold',
  birthdate: '1992-03-15',
  admission_date: '2019-03-04',
  job_role: 'Sorcerer',
}

let token
let naverId

describe('Delete Naver', () => {
  beforeAll(async () => {
    await connection.migrate.rollback()
    await connection.migrate.latest()

    await request(app).post('/users').send(user)

    token = (await request(app).post('/session').send(user)).body.token

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

  it('should be able to delete a naver', async () => {
    return request(app)
      .delete(`/navers/${naverId}`)
      .set('Authorization', `bearer ${token}`)
      .then(result => {
        expect(result.status).toEqual(204)
      })
  })

  it('should not be able to delete a naver with invalid naverId', async () => {
    return request(app)
      .delete('/navers/2')
      .set('Authorization', `bearer ${token}`)
      .then(result => {
        const error = new AppError('Naver not founded!', 404)
        expect(result.status).toEqual(404)
        expect(result.body).toEqual(error)
      })
  })
})
