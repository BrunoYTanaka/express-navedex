import bcrypt from 'bcryptjs'
import connection from '../../../database/connection'
import AppError from '../../../error/AppError'

class UsersService {
  async createUser({ email, password }) {
    const [user] = await connection('users').where({
      email,
    })

    if (user) {
      throw new AppError('Email already used!')
    }

    const password_hash = bcrypt.hashSync(password, 10)

    const [id] = await connection('users').insert({
      email,
      password: password_hash,
    })
    return id
  }
}

export default UsersService
