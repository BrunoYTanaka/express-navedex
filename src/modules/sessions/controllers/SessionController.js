import SessionService from '../services/SessionService'

const sessionService = new SessionService()
class SessionController {
  async store(req, res) {
    const { email, password } = req.body

    const user = await sessionService.createSession(email, password)

    return res.json(user)
  }
}

export default SessionController
