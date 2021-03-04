import { Router } from 'express'
import NaversController from '../controllers/NaversController'

const naversController = new NaversController()

const routes = Router()

routes.get('/list', naversController.index)
routes.get('/:naverId', naversController.show)
routes.post('/', naversController.store)

export default routes
