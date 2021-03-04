import connection from '../../../database/connection'

class NaversService {
  async createNaver(userId, naver) {
    const { name, birthdate, admission_date, job_role, projects } = naver

    const [id] = await connection('navers').insert({
      userId,
      name,
      birthdate,
      admission_date,
      job_role,
    })

    if (!projects || !projects.length) {
      return {
        id,
        name,
        userId,
        birthdate,
        admission_date,
        job_role,
      }
    }
    const promises = projects.map(async projectId => {
      const project = await connection('projects').where('id', projectId)
      if (!project.length) return null

      return connection('navers_projects').insert({
        naverId: id,
        projectId,
      })
    })

    await Promise.all(promises)

    return {
      id,
      name,
      userId,
      birthdate,
      admission_date,
      job_role,
      projects,
    }
  }

  async showNaverById(naverId) {
    const navers = connection
      .select([
        'navers.id as id',
        'navers.name as name',
        'birthdate',
        'admission_date',
        'job_role',
        'projects.name as projectsName',
        'projects.id as projectId',
      ])
      .table('navers')
      .where('navers.id', naverId)
      .leftJoin('navers_projects', 'navers.id', '=', 'navers_projects.naverId')
      .leftJoin('projects', 'navers_projects.projectId', '=', 'projects.id')
      .then(res => {
        return res.reduce(
          (result, naver) => {
            const newProjects = [...result.projects]
            if (naver.projectId) {
              newProjects.push({
                id: naver.projectId,
                name: naver.projectsName,
              })
            }
            return {
              id: naver.id,
              name: naver.name,
              birthdate: naver.birthdate,
              admission_date: naver.admission_date,
              job_role: naver.job_role,
              projects: newProjects,
            }
          },
          {
            projects: [],
          },
        )
      })
      .catch(() => [])
    return navers
  }

  async listNavers(userId, filters) {
    const { name, job_role } = filters
    const navers = await connection('navers')
      .where('userId', userId)
      .where(query => {
        if (name) {
          query.where('name', 'like', `%${name}%`)
        }
        if (job_role) {
          query.where('job_role', 'like', `%${job_role}%`)
        }
      })

    return navers
  }
}

export default NaversService
