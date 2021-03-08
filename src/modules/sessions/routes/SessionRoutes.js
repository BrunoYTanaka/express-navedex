import { Router } from 'express'
import { celebrate, Joi, Segments } from 'celebrate'
import SessionController from '../controllers/SessionController'

const sessionController = new SessionController()

const routes = Router()

routes.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  sessionController.store,
)

export default routes
