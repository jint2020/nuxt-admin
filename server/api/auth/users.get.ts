import { getUsers } from '../../utils/auth'
import { requireRole } from '../../utils/auth-event'

export default defineEventHandler((event) => {
  requireRole(event, 'admin')
  return getUsers()
})
