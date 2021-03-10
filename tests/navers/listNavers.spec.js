import request from 'supertest'
import connection from '../../src/database/connection'
import app from '../../src/app'

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

let token = ''

describe('List Navers', () => {
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

  it('should be able to list navers', async () => {
    return request(app)
      .get('/navers/list')
      .set('Authorization', `bearer ${token}`)
      .then(result => {
        expect(result.status).toEqual(200)
        expect(result.body).toEqual(
          expect.arrayContaining(
            navers.map(naver => expect.objectContaining(naver)),
          ),
        )
      })
  })

  it('should be able to list navers with filtered by name', async () => {
    return request(app)
      .get('/navers/list')
      .set('Authorization', `bearer ${token}`)
      .query({
        name: 'triss',
      })
      .then(result => {
        expect(result.status).toEqual(200)
        expect(result.body).toEqual([expect.objectContaining(navers[0])])
      })
  })
  it('should be able to list navers with filtered by job_role', async () => {
    return request(app)
      .get('/navers/list')
      .set('Authorization', `bearer ${token}`)
      .query({
        job_role: 'witcher',
      })
      .then(result => {
        expect(result.status).toEqual(200)
        expect(result.body).toEqual([expect.objectContaining(navers[1])])
      })
  })
  it('should be able to list navers with filtered by company_time', async () => {
    return request(app)
      .get('/navers/list')
      .set('Authorization', `bearer ${token}`)
      .query({
        company_time: 2,
      })
      .then(result => {
        expect(result.status).toEqual(200)
        expect(result.body).toEqual([
          expect.objectContaining(navers[0]),
          expect.objectContaining(navers[1]),
        ])
      })
  })
})
