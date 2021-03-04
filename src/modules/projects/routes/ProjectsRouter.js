import { Router } from 'express'
import ProjectsController from '../controllers/ProjectsController'

const projectsController = new ProjectsController()

const routes = Router()

routes.get('/list', projectsController.index)
routes.get('/:projectId', projectsController.show)
routes.post('/', projectsController.store)
routes.delete('/:projectId', projectsController.delete)
routes.put('/:projectId', projectsController.update)

export default routes
