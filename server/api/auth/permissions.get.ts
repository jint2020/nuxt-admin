import { getPermissions, getRolePermissions } from '../../utils/auth'
import { requireAuthenticatedUser } from '../../utils/auth-event'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth_token')

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: '未登录'
    })
  }

  const user = getUserByToken(token)

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Session 已过期'
    })
  }

  return {
    all: getPermissions(),
    userPermissions: getRolePermissions(user.role)
  }
})
