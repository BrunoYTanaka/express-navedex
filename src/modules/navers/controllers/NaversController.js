import NaversServices from '../services/NaversServices'

const naversServices = new NaversServices()

class NaversController {
  async index(req, res) {
    const { userId, name, job_role, company_time } = req.query

    const navers = await naversServices.listNavers(userId, {
      name,
      job_role,
      company_time,
    })

    return res.json(navers)
  }

  async store(req, res) {
    const { userId } = req.query

    const { name, birthdate, admission_date, job_role, projects } = req.body

    const navers = await naversServices.createNaver(userId, {
      name,
      birthdate,
      admission_date,
      job_role,
      projects,
    })

    return res.json(navers)
  }

  async show(req, res) {
    const { naverId } = req.params

    const naver = await naversServices.showNaverById(naverId)

    return res.json(naver)
  }

  async delete(req, res) {
    const { userId } = req.query
    const { naverId } = req.params

    await naversServices.deleteNaver(userId, naverId)

    return res.status(204).json()
  }
}

export default NaversController
