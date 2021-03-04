import { Router } from 'express'
import NaversController from '../controllers/NaversController'
import ensureAuthenticated from '../../../middleware/ensureAuthenticated'

const naversController = new NaversController()

const routes = Router()
routes.use(ensureAuthenticated)
routes.get('/list', naversController.index)
routes.get('/:naverId', naversController.show)
routes.post('/', naversController.store)
routes.delete('/:naverId', naversController.delete)
routes.put('/:naverId', naversController.update)

export default routes
