import { Router } from 'express'
import { celebrate, Joi, Segments } from 'celebrate'
import ProjectsController from '../controllers/ProjectsController'
import ensureAuthenticated from '../../../middleware/ensureAuthenticated'

const projectsController = new ProjectsController()

const routes = Router()
routes.use(ensureAuthenticated)
routes.get(
  '/list',
  celebrate({
    [Segments.QUERY]: {
      name: Joi.string(),
    },
  }),
  projectsController.index,
)

routes.get(
  '/:projectId',
  celebrate({
    [Segments.PARAMS]: {
      projectId: Joi.number().required(),
    },
  }),
  projectsController.show,
)

routes.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      navers: Joi.array().items(Joi.number()),
    },
  }),
  projectsController.store,
)

routes.delete(
  '/:projectId',
  celebrate({
    [Segments.PARAMS]: {
      projectId: Joi.number().required(),
    },
  }),
  projectsController.delete,
)

routes.put(
  '/:projectId',
  celebrate({
    [Segments.PARAMS]: {
      projectId: Joi.number().required(),
    },
    [Segments.BODY]: {
      name: Joi.string().required(),
      navers: Joi.array().items(Joi.number()),
    },
  }),
  projectsController.update,
)

export default routes
