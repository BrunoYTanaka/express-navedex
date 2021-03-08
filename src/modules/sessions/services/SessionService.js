import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import auth from '../../../config/auth'
import connection from '../../../database/connection'
import AppError from '../../../error/AppError'

class SessionService {
  async createSession(email, password) {
    const [user] = await connection('users').where({
      email,
    })

    if (!user) {
      throw new AppError('Invalid credentials!')
    }

    const valid = await bcrypt.compare(password, user.password)

    if (!valid) {
      throw new AppError('Password does not match!')
    }

    return {
      user: {
        id: user.id,
        email: user.email,
      },
      token: jwt.sign({ id: user.id }, auth.secret, {
        expiresIn: auth.expiresIn,
      }),
    }
  }
}

export default SessionService
