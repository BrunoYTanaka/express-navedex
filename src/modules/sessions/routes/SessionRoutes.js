import { Router } from 'express'
import SessionController from '../controllers/SessionController'

const sessionController = new SessionController()

const routes = Router()

routes.post('/', sessionController.store)

export default routes
