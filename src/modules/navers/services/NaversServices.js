import { differenceInCalendarDays } from 'date-fns'
import connection from '../../../database/connection'

class NaversService {
  async createNaver(userId, naver) {
    const { name, birthdate, admission_date, job_role, projects } = naver

    const [id] = await connection('navers').insert({
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
      const [project] = await connection('projects').where('id', projectId)
      if (!project) return null
      addedIds.push(project)
      return connection('navers_projects').insert({
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
    const navers = connection('navers')
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
    await connection('navers')
      .where({
        id: naverId,
        userId,
      })
      .del()
  }

  async updateNaver(userId, naver) {
    const trx = await connection.transaction()

    try {
      const {
        naverId,
        name,
        birthdate,
        admission_date,
        job_role,
        projects,
      } = naver

      const [hasNaver] = await trx('navers').where({
        id: naverId,
        userId,
      })

      if (!hasNaver) {
        throw new Error('Error update naver')
      }

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
    } catch (error) {
      trx.rollback()
      return error
    }
  }
}

export default NaversService
