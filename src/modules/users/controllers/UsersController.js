import AppError from '../../../error/AppError'
import UsersServices from '../services/UsersServices'

const userService = new UsersServices()

class UserController {
  async store(req, res) {
    const { email, password } = req.body

    let user = await userService.findUserByEmail(email)

    if (user) {
      throw new AppError('Email already used!')
    }

    user = await userService.createUser({ email, password })

    return res.json(user)
  }
}

export default UserController
