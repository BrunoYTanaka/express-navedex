import UsersServices from '../services/UsersServices'

const userService = new UsersServices()

class UserController {
  async store(req, res) {
    const { email, password } = req.body

    const user = await userService.createUser({ email, password })

    return res.json(user)
  }
}

export default UserController
