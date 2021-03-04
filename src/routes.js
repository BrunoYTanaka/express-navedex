import { Router } from 'express'
import userRouter from './modules/users/routes/UsersRouter'
import naversRoutes from './modules/navers/routes/NaversRoutes'
import projectsRouter from './modules/projects/routes/ProjectsRouter'
import pessionRoutes from './modules/sessions/routes/SessionRoutes'

const routes = Router()

routes.use('/users', userRouter)
routes.use('/session', pessionRoutes)
routes.use('/navers', naversRoutes)
routes.use('/projects', projectsRouter)

export default routes
