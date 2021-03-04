import UsersServices from '../services/UsersServices'

const userService = new UsersServices()

class UserController {
  async store(req, res) {
    const { email, password } = req.body

    const id = await userService.createUser({ email, password })

    return res.json({
      id,
      email,
    })
  }
}

export default UserController
