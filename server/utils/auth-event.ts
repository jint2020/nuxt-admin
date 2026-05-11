import type { H3Event } from 'h3'
import type { User, Role } from '~/types'
import { getUserByToken } from './auth'

export function getTokenFromEvent(event: H3Event): string | undefined {
  const bearer = getHeader(event, 'authorization') || getHeader(event, 'Authorization')
  if (bearer?.startsWith('Bearer ')) {
    return bearer.slice(7)
  }

  return getCookie(event, 'auth_token')
}

export function resolveUserFromEvent(event: H3Event): User | undefined {
  if (event.context.user) {
    return event.context.user as User
  }

  const token = getTokenFromEvent(event)
  if (!token) return undefined

  return getUserByToken(token)
}

export function requireAuthenticatedUser(event: H3Event): User {
  const user = resolveUserFromEvent(event)

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: '未登录'
    })
  }

  event.context.user = user
  event.context.role = user.role
  return user
}

export function requireRole(event: H3Event, role: Role): User {
  const user = requireAuthenticatedUser(event)

  if (user.role !== role) {
    throw createError({
      statusCode: 403,
      statusMessage: '权限不足'
    })
  }

  return user
}
