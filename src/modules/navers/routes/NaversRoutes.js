import { Router } from 'express'
import { celebrate, Joi, Segments } from 'celebrate'
import NaversController from '../controllers/NaversController'
import ensureAuthenticated from '../../../middleware/ensureAuthenticated'

const naversController = new NaversController()

const routes = Router()
routes.use(ensureAuthenticated)
routes.get(
  '/list',
  celebrate({
    [Segments.QUERY]: {
      name: Joi.string(),
      job_role: Joi.string(),
      company_time: Joi.number(),
    },
  }),
  naversController.index,
)

routes.get(
  '/:naverId',
  celebrate({
    [Segments.PARAMS]: {
      naverId: Joi.number().required(),
    },
  }),
  naversController.show,
)

routes.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      birthdate: Joi.string().required(),
      admission_date: Joi.string().required(),
      job_role: Joi.string().required(),
      projects: Joi.array().items(Joi.number()),
    },
  }),
  naversController.store,
)

routes.delete(
  '/:naverId',
  celebrate({
    [Segments.PARAMS]: {
      naverId: Joi.number().required(),
    },
  }),
  naversController.delete,
)

routes.put(
  '/:naverId',
  celebrate({
    [Segments.PARAMS]: {
      naverId: Joi.number().required(),
    },
    [Segments.BODY]: {
      name: Joi.string().required(),
      birthdate: Joi.string().required(),
      admission_date: Joi.string().required(),
      job_role: Joi.string().required(),
      projects: Joi.array().items(Joi.number()),
    },
  }),
  naversController.update,
)

export default routes
