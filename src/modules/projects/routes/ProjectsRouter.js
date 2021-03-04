import { Router } from 'express'
import ProjectsController from '../controllers/ProjectsController'
import ensureAuthenticated from '../../../middleware/ensureAuthenticated'

const projectsController = new ProjectsController()

const routes = Router()
routes.use(ensureAuthenticated)
routes.get('/list', projectsController.index)
routes.get('/:projectId', projectsController.show)
routes.post('/', projectsController.store)
routes.delete('/:projectId', projectsController.delete)
routes.put('/:projectId', projectsController.update)

export default routes
