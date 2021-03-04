import connection from '../../../database/connection'

class ProjectsServices {
  async createProject(userId, { name, navers }) {
    const [id] = await connection('projects').insert({
      name,
      userId,
    })

    if (!navers || !navers.length) {
      return { id, name }
    }

    const promises = navers.map(naverId => {
      return connection('navers_projects').insert({
        naverId,
        projectId: id,
      })
    })

    await Promise.all(promises)

    return { id, name, navers }
  }

  async showProjectById(projectId) {
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
    await connection('projects')
      .where({
        id: projectId,
        userId,
      })
      .del()
  }
}

export default ProjectsServices
