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

let token
let naverId
let projectsAdded
describe('Show Naver', () => {
  beforeAll(async () => {
    await connection.migrate.rollback()
    await connection.migrate.latest()

    await request(app).post('/users').send(user)

    token = (await request(app).post('/session').send(user)).body.token
    projectsAdded = await Promise.all(
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

  it('should be able to show a naver', async () => {
    return request(app)
      .get(`/navers/${naverId}`)
      .set('Authorization', `bearer ${token}`)
      .then(result => {
        expect(result.status).toEqual(200)
        const expectedNaver = {
          id: naverId,
          ...naver,
          projects: projectsAdded.filter(project =>
            naver.projects.includes(project.id),
          ),
        }
        expect(result.body).toEqual(expectedNaver)
      })
  })

  it('should not to be able to show with invalid naverId', async () => {
    return request(app)
      .get(`/navers/2`)
      .set('Authorization', `bearer ${token}`)
      .then(result => {
        expect(result.status).toEqual(404)
        const error = new AppError('Naver not founded!', 404)
        expect(result.body).toEqual(error)
      })
  })
})
