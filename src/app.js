import express from 'express'
import 'express-async-errors'
import { errors } from 'celebrate'
import AppError from './error/AppError'
import routes from './routes'

const app = express()

app.use(express.json())
app.use(routes)
app.use(errors())
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      statusCode: err.statusCode,
      message: err.message,
    })
  }
  console.error(err)
  return res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  })
})
export default app
