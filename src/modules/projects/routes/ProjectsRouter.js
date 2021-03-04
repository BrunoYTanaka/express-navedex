import { Router } from 'express'
import ProjectsController from '../controllers/ProjectsController'

const projectsController = new ProjectsController()

const routes = Router()

routes.post('/', projectsController.store)

export default routes
