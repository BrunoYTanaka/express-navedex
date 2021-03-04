import connection from '../../../database/connection'

class UsersService {
  async createUser({ email, password }) {
    const [id] = await connection('users').insert({
      email,
      password,
    })
    return id
  }
}

export default UsersService
