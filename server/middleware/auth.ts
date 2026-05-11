import { requireAuthenticatedUser } from '../utils/auth-event'

export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname

  // 仅保护 /api/* 路由
  if (!path.startsWith('/api/')) return

  // /api/auth/me 允许通过（用于探测 session 状态）
  if (path === '/api/auth/me') return

  // 统一做身份认证，角色权限由具体 endpoint 决定
  requireAuthenticatedUser(event)
})
