/**
 * 管理员路由中间件
 * 非 admin 角色用户重定向到 403 页面
 */
export default defineNuxtRouteMiddleware(() => {
  const store = useAuthStore()

  // 未登录也跳转 403（无登录页）
  if (!store.isAuthenticated) {
    return navigateTo('/403')
  }

  // 非管理员重定向 403
  if (!store.isAdmin) {
    return navigateTo('/403')
  }
})
