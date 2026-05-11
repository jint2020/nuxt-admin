import { getPermissions, getRolePermissions } from '../../utils/auth'
import { requireAuthenticatedUser } from '../../utils/auth-event'

export default defineEventHandler((event) => {
  const user = requireAuthenticatedUser(event)

  return {
    all: getPermissions(),
    userPermissions: getRolePermissions(user.role)
  }
})
