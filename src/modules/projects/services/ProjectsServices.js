import connection from '../../../database/connection'
import AppError from '../../../error/AppError'

class ProjectsServices {
  async findProjectById(userId, projectId) {
    const [project] = await connection('projects').where({
      id: projectId,
      userId,
    })
    return project
  }

  async createProject(userId, { name, navers }) {
    const trx = await connection.transaction()

    const [id] = await trx('projects').insert({
      name,
      userId,
    })

    if (!navers || !navers.length) {
      trx.commit()
      return { id, name }
    }

    const checkIfEachNaverExists = navers.map(async naverId => {
      const [naver] = await trx('navers').where('id', naverId)
      if (!naver) {
        return naverId
      }
      return null
    })

    const naversDoestNotExists = (
      await Promise.all(checkIfEachNaverExists)
    ).filter(Boolean)

    if (naversDoestNotExists.length) {
      trx.rollback()
      throw new AppError(
        `The following navers does not exists: ${naversDoestNotExists.join(
          ', ',
        )}`,
      )
    }

    const promises = navers.map(async naverId => {
      return trx('navers_projects').insert({
        naverId,
        projectId: id,
      })
    })

    Promise.all(promises).then(trx.commit).catch(trx.rollback)

    return { id, name, navers }
  }

  async showProjectById(projectId) {
    const [hasProject] = await connection('projects').where('id', projectId)

    if (!hasProject) {
      throw new AppError('Project not founded!', 404)
    }

    const projects = connection
      .select([
        'projects.id as id',
        'projects.name as name',
        'navers.birthdate',
        'navers.admission_date',
        'navers.job_role',
        'navers.name as naverName',
        'navers.id as naverId',
      ])
      .table('projects')
      .where('projects.id', projectId)
      .leftJoin(
        'navers_projects',
        'projects.id',
        '=',
        'navers_projects.projectId',
      )
      .leftJoin('navers', 'navers_projects.naverId', '=', 'navers.id')
      .then(res => {
        return res.reduce((result, project) => {
          const newNavers = [...(result.navers || [])]
          if (project.naverId) {
            newNavers.push({
              id: project.naverId,
              name: project.naverName,
              birthdate: project.birthdate,
              admission_date: project.admission_date,
              job_role: project.job_role,
            })
          }
          return {
            id: project.id,
            name: project.name,
            navers: newNavers,
          }
        }, {})
      })
    return projects
  }

  async listProjects(userId, filters) {
    const { name } = filters
    const projects = connection('projects')
      .where('userId', userId)
      .where(query => {
        if (name) {
          query.where('name', 'like', `%${name}%`)
        }
      })
    return projects
  }

  async deleteProject(userId, projectId) {
    return connection('projects')
      .where({
        id: projectId,
        userId,
      })
      .del()
  }

  async updateProject(userId, data) {
    const { projectId, name, navers } = data

    const trx = await connection.transaction()

    if (name) {
      await trx('projects')
        .where({
          id: projectId,
          userId,
        })
        .update({
          name,
        })
    }
    await trx('navers_projects').where('projectId', projectId).del()

    if (!navers || !navers.length) {
      trx.commit()
      return {
        id: projectId,
        name,
      }
    }

    const checkIfEachNaverExists = navers.map(async naverId => {
      const [naver] = await trx('navers').where('id', naverId)
      if (!naver) {
        return naverId
      }
      return null
    })

    const naversDoestNotExists = (
      await Promise.all(checkIfEachNaverExists)
    ).filter(Boolean)

    if (naversDoestNotExists.length) {
      trx.rollback()
      throw new AppError(
        `The following navers does not exists: ${naversDoestNotExists.join(
          ', ',
        )}`,
      )
    }

    const promises = navers.map(async naverId => {
      return trx('navers_projects').insert({
        naverId,
        projectId,
      })
    })

    Promise.all(promises).then(trx.commit).catch(trx.rollback)

    return {
      id: projectId,
      name,
      navers,
    }
  }
}

export default ProjectsServices
