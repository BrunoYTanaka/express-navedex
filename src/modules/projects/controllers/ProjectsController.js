import ProjectsServices from '../services/ProjectsServices'

const projectsServices = new ProjectsServices()

class ProjectsController {
  async store(req, res) {
    const { userId } = req.query
    const { name, navers } = req.body
    const projects = await projectsServices.createProject(userId, {
      name,
      navers,
    })

    return res.json(projects)
  }
}

export default ProjectsController
