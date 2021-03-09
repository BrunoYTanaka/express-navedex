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
  name: 'Projeto incrível',
  navers: [1],
}

const projectToUpdate = {
  name: 'Projeto extrarondinário',
  navers: [2, 3],
}
const projectWithoutNavers = {
  name: 'Project legal',
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

let token
let projectId

describe('Update Project', () => {
  beforeAll(async () => {
    await connection.migrate.rollback()
    await connection.migrate.latest()

    await request(app).post('/users').send(user)

    token = (await request(app).post('/session').send(user)).body.token
    await Promise.all(
      navers.map(async naver => {
        const { body } = await request(app)
          .post('/navers')
          .set('Authorization', `bearer ${token}`)
          .send(naver)
        return body
      }),
    )

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

  it('should be able to update a project', async () => {
    return request(app)
      .put(`/projects/${projectId}`)
      .set('Authorization', `bearer ${token}`)
      .send(projectToUpdate)
      .then(result => {
        expect(result.status).toEqual(200)
        expect(result.body).toEqual(expect.objectContaining(projectToUpdate))
      })
  })

  it('should be able to update a project without navers', async () => {
    return request(app)
      .put(`/projects/${projectId}`)
      .set('Authorization', `bearer ${token}`)
      .send(projectWithoutNavers)
      .then(result => {
        expect(result.status).toEqual(200)
        expect(result.body).toEqual(
          expect.objectContaining(projectWithoutNavers),
        )
      })
  })

  it('should not to be able to update a project with invalid projectId', async () => {
    return request(app)
      .put('/projects/2')
      .set('Authorization', `bearer ${token}`)
      .send(projectToUpdate)
      .then(result => {
        expect(result.status).toEqual(404)
        const error = new AppError('Project not founded!', 404)
        expect(result.body).toEqual(error)
      })
  })
})
