/**
 * 认证路由中间件
 * 检查用户登录状态，未认证则重定向到 403 页面
 */
export default defineNuxtRouteMiddleware(async () => {
  const store = useAuthStore()

  // 未认证时尝试通过 session cookie 恢复用户信息
  if (!store.isAuthenticated) {
    try {
      await store.fetchUser()
    } catch {
      // session 无效或已过期
    }
  }

  // 仍未认证则跳转 403 页面（无登录页）
  if (!store.isAuthenticated) {
    return navigateTo('/403')
  }
})
