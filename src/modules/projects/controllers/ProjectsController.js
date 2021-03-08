import AppError from '../../../error/AppError'
import ProjectsServices from '../services/ProjectsServices'

const projectsServices = new ProjectsServices()

class ProjectsController {
  async index(req, res) {
    const { userId } = req
    const { name } = req.query

    const projects = await projectsServices.listProjects(userId, {
      name,
    })

    return res.json(projects)
  }

  async store(req, res) {
    const { userId } = req
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
    const { userId } = req
    const { projectId } = req.params

    const project = await projectsServices.findProjectById(userId, projectId)

    if (!project) {
      throw new AppError('Project not founded!', 404)
    }

    await projectsServices.deleteProject(userId, projectId)

    return res.status(204).json()
  }

  async update(req, res) {
    const { userId } = req
    const { projectId } = req.params
    const { name, navers } = req.body

    const project = await projectsServices.findProjectById(userId, projectId)

    if (!project) {
      throw new AppError('Project not founded!', 404)
    }

    const projectUpdated = await projectsServices.updateProject(userId, {
      projectId,
      name,
      navers,
    })

    return res.json(projectUpdated)
  }
}

export default ProjectsController
