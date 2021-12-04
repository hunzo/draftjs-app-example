import { UserSession } from '../models/models'

const handleTokenHeader = () => {
  const storage = localStorage.getItem('user_session')
  if (!storage) {
    console.log('no storage')
    return
  }

  const t = JSON.parse(storage) as UserSession

  if (storage && t.token) {
    return t.token
  }

  return ''
}

export default handleTokenHeader
