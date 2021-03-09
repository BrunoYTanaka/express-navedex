import { differenceInCalendarYears } from 'date-fns'
import connection from '../../../database/connection'
import AppError from '../../../error/AppError'

class NaversService {
  async findNaverById(userId, naverId) {
    const [naver] = await connection('navers').where({
      id: naverId,
      userId,
    })
    return naver
  }

  async createNaver(userId, naver) {
    const { name, birthdate, admission_date, job_role, projects } = naver

    const trx = await connection.transaction()

    const [id] = await trx('navers').insert({
      userId,
      name,
      birthdate,
      admission_date,
      job_role,
    })

    if (!projects || !projects.length) {
      await trx.commit()
      return {
        id,
        name,
        birthdate,
        admission_date,
        job_role,
      }
    }

    const checkIfEachProjectExists = projects.map(async projectId => {
      const [project] = await trx('projects').where('id', projectId)
      if (!project) {
        return projectId
      }
      return null
    })

    const projectsDoestNotExists = (
      await Promise.all(checkIfEachProjectExists)
    ).filter(Boolean)

    if (projectsDoestNotExists.length) {
      trx.rollback()
      throw new AppError(
        `The following projects does not exists: ${projectsDoestNotExists.join(
          ', ',
        )}`,
      )
    }

    const promises = projects.map(async projectId => {
      return trx('navers_projects').insert({
        naverId: id,
        projectId,
      })
    })

    Promise.all(promises).then(trx.commit).catch(trx.rollback)

    return {
      id,
      name,
      birthdate,
      admission_date,
      job_role,
      projects,
    }
  }

  async showNaverById(naverId) {
    const [hasNaver] = await connection('navers').where('id', naverId)

    if (!hasNaver) {
      throw new AppError('Naver not founded!', 404)
    }

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
            const companyTimeTotal = differenceInCalendarYears(today, start)
            return companyTimeTotal >= company_time
          })
        }
        return res
      })

    return navers
  }

  async deleteNaver(userId, naverId) {
    return connection('navers')
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

    let trx = await connection.transaction()

    trx('navers')
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
      .then(async () => {
        trx('navers_projects')
          .where('naverId', naverId)
          .del()
          .then(trx.commit)
          .catch(trx.rollback)
      })
      .then(trx.commit)
      .catch(trx.rollback)

    if (!projects || !projects.length) {
      return {
        id: naverId,
        name,
        birthdate,
        admission_date,
        job_role,
      }
    }

    const checkIfEachProjectExists = projects.map(async projectId => {
      const [project] = await trx('projects').where('id', projectId)
      if (!project) {
        return projectId
      }
      return null
    })

    const projectsDoestNotExists = (
      await Promise.all(checkIfEachProjectExists)
    ).filter(Boolean)
    if (projectsDoestNotExists.length) {
      await trx.rollback()
      throw new AppError(
        `The following projects does not exists: ${projectsDoestNotExists.join(
          ', ',
        )}`,
      )
    }

    trx = await connection.transaction()

    const promises = projects.map(async projectId => {
      return trx('navers_projects').insert({
        naverId,
        projectId,
      })
    })

    Promise.all(promises).then(trx.commit).catch(trx.rollback)

    return {
      id: naverId,
      name,
      birthdate,
      admission_date,
      job_role,
      projects,
    }
  }
}

export default NaversService
