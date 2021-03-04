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
}

export default ProjectsServices
