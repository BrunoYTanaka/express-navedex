import ProjectsServices from '../services/ProjectsServices'

const projectsServices = new ProjectsServices()

class ProjectsController {
  async index(req, res) {
    const { userId, name } = req.query

    const projects = await projectsServices.listProjects(userId, {
      name,
    })

    return res.json(projects)
  }

  async store(req, res) {
    const { userId } = req.query
    const { name, navers } = req.body
    const projects = await projectsServices.createProject(userId, {
      name,
      navers,
    })

    return res.json(projects)
  }

  async show(req, res) {
    const { projectId } = req.params

    const project = await projectsServices.showProjectById(projectId)

    return res.json(project)
  }

  async delete(req, res) {
    const { userId } = req.query
    const { projectId } = req.params

    await projectsServices.deleteProject(userId, projectId)

    return res.status(204).json()
  }

  async update(req, res) {
    const { userId } = req.query
    const { projectId } = req.params
    const { name, navers } = req.body

    const project = await projectsServices.updateProject(userId, {
      projectId,
      name,
      navers,
    })

    return res.json(project)
  }
}

export default ProjectsController
