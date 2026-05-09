import { getUserByToken } from '../utils/auth'

export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname

  // 仅保护 /api/* 路由
  if (!path.startsWith('/api/')) return

  // /api/auth/me 允许通过（用于探测 session 状态）
  if (path === '/api/auth/me') return

  // 从 cookie 中读取 session token
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

  // 将用户信息挂载到 event.context 供下游使用
  event.context.user = user
  event.context.role = user.role
})
