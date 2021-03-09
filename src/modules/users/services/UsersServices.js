import bcrypt from 'bcryptjs'
import Mailer from '../../../lib/mail'
import connection from '../../../database/connection'

class UsersService {
  async findUserByEmail(email) {
    const [user] = await connection('users').where({
      email,
    })
    return user
  }

  async createUser({ email, password }) {
    const password_hash = bcrypt.hashSync(password, 10)

    const [id] = await connection('users').insert({
      email,
      password: password_hash,
    })

    await Mailer.sendMail({
      to: email,
      subject: '[TeamNave] Conta criada',
      template: 'userCreatedTemplate',
    })

    return {
      id,
      email,
    }
  }
}

export default UsersService
