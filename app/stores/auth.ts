import { defineStore } from 'pinia'
import type { Role, User } from '~/types'

// 认证状态接口（auth state读自后端session cookie，无需前端管理token）
interface AuthStoreState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthStoreState => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null
  }),

  getters: {
    // 当前用户角色
    currentRole: (state): Role | null => state.user?.role ?? null,

    // 是否为管理员
    isAdmin: (state): boolean => state.user?.role === 'admin',

    // 是否为编辑者或以上权限
    isEditorOrAbove: (state): boolean => {
      return state.user?.role === 'admin' || state.user?.role === 'editor'
    },

    // 用户显示名称
    displayName: (state): string => state.user?.name ?? '未登录',

    // 用户头像
    userAvatar: (state): string => state.user?.avatar ?? ''
  },

  actions: {
    // 通过后端session cookie获取当前用户（credentials:'include'自动携带cookie）
    async fetchUser(): Promise<boolean> {
      const { public: { apiBase } } = useRuntimeConfig()
      this.isLoading = true
      try {
        const user = await $fetch<User>(apiBase + '/api/auth/me', {
          credentials: 'include'
        })
        this.user = user
        this.isAuthenticated = true
        return true
      } catch (err) {
        console.error('会话获取失败:', err)
        this.user = null
        this.isAuthenticated = false
        return false
      } finally {
        this.isLoading = false
      }
    },

    // 检查是否拥有指定角色
    hasRole(role: Role): boolean {
      return this.user?.role === role
    },

    // 检查是否拥有指定角色列表中的任意一个
    hasAnyRole(roles: Role[]): boolean {
      if (!this.user) return false
      return roles.includes(this.user.role)
    },

    // 更新用户信息
    updateUser(userData: Partial<User>) {
      if (this.user) {
        this.user = { ...this.user, ...userData }
      }
    }
  }
})

// 统一的useAuth入口，供全局使用
export const useAuth = () => useAuthStore()
