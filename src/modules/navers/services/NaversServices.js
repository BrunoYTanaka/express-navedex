import { differenceInCalendarDays } from 'date-fns'
import connection from '../../../database/connection'
import AppError from '../../../error/AppError'

class NaversService {
  constructor() {
    this.navers = connection('navers')
    this.projects = connection('projects')
    this.navers_projects = connection('navers_projects')
  }

  async createNaver(userId, naver) {
    const { name, birthdate, admission_date, job_role, projects } = naver

    const [id] = await this.navers.insert({
      userId,
      name,
      birthdate,
      admission_date,
      job_role,
    })

    if (!projects || !projects.length) {
      return {
        id,
        name,
        userId,
        birthdate,
        admission_date,
        job_role,
      }
    }
    const addedIds = []
    const promises = projects.map(async projectId => {
      const [project] = await this.projects.where('id', projectId)
      if (!project) return null
      addedIds.push(project)
      return this.navers_projects.insert({
        naverId: id,
        projectId,
      })
    })

    await Promise.all(promises)

    return {
      id,
      name,
      userId,
      birthdate,
      admission_date,
      job_role,
      projects: [...addedIds],
    }
  }

  async showNaverById(naverId) {
    const navers = connection
      .select([
        'navers.id as id',
        'navers.name as name',
        'birthdate',
        'admission_date',
        'job_role',
        'projects.name as projectsName',
        'projects.id as projectId',
      ])
      .table('navers')
      .where('navers.id', naverId)
      .leftJoin('navers_projects', 'navers.id', '=', 'navers_projects.naverId')
      .leftJoin('projects', 'navers_projects.projectId', '=', 'projects.id')
      .then(res => {
        return res.reduce((result, naver) => {
          const newProjects = [...(result.projects || [])]
          if (naver.projectId) {
            newProjects.push({
              id: naver.projectId,
              name: naver.projectsName,
            })
          }
          return {
            id: naver.id,
            name: naver.name,
            birthdate: naver.birthdate,
            admission_date: naver.admission_date,
            job_role: naver.job_role,
            projects: newProjects,
          }
        }, {})
      })
    return navers
  }

  async listNavers(userId, filters) {
    const { name, job_role, company_time } = filters
    const navers = this.navers
      .where('userId', userId)
      .where(query => {
        if (name) {
          query.where('name', 'like', `%${name}%`)
        }
        if (job_role) {
          query.where('job_role', 'like', `%${job_role}%`)
        }
      })
      .then(res => {
        if (company_time) {
          return res.filter(naver => {
            const today = new Date()
            const start = new Date(naver.admission_date)
            const companyTimeTotal = differenceInCalendarDays(today, start)
            return companyTimeTotal <= company_time
          })
        }
        return res
      })

    return navers
  }

  async deleteNaver(userId, naverId) {
    const [naver] = await this.navers.where({
      id: naverId,
      userId,
    })

    if (!naver) {
      throw new AppError('Naver not founded!', 404)
    }

    await this.navers
      .where({
        id: naverId,
        userId,
      })
      .del()
  }

  async updateNaver(userId, data) {
    const {
      naverId,
      name,
      birthdate,
      admission_date,
      job_role,
      projects,
    } = data

    const [naver] = await this.navers.where({
      id: naverId,
      userId,
    })

    if (!naver) {
      throw new AppError('Naver not founded!', 404)
    }

    const trx = await connection.transaction()
    const updatedNaver = await trx('navers')
      .where({
        id: naverId,
        userId,
      })
      .update({
        name,
        birthdate,
        admission_date,
        job_role,
      })

    if (!updatedNaver || !projects || !projects.length) {
      trx.commit()
      return {
        id: naverId,
        name,
        userId,
        birthdate,
        admission_date,
        job_role,
      }
    }

    await trx('navers_projects').where('id', 'naverId').del()

    const addedIds = []
    const promises = projects.map(async projectId => {
      const [project] = await trx('projects').where('id', projectId)
      if (!project) return null
      addedIds.push(project)
      return trx('navers_projects').insert({
        naverId,
        projectId,
      })
    })

    await Promise.all(promises)

    trx.commit()

    return {
      id: naverId,
      name,
      userId,
      birthdate,
      admission_date,
      job_role,
      projects: [...addedIds],
    }
  }
}

export default NaversService
