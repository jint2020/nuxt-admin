import { getPermissions, getUserByToken, getRolePermissions } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const token = getHeader(event, 'Authorization')?.replace('Bearer ', '')

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: '未提供认证令牌'
    })
  }

  const user = getUserByToken(token)

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: '令牌无效或已过期'
    })
  }

  return {
    all: getPermissions(),
    userPermissions: getRolePermissions(user.role)
  }
})
