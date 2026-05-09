// 用户角色类型
export type Role = 'admin' | 'editor' | 'viewer'

// 权限定义
export interface Permission {
  id: string
  name: string
  description: string
  roles: Role[]
}

// 用户信息
export interface User {
  id: number
  name: string
  email: string
  avatar?: string
  role: Role
}

// 认证状态
export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface Stat {
  title: string
  icon: string
  value: number | string
  variation: number
  formatter?: (value: number) => string
}

export interface Notification {
  id: number
  unread?: boolean
  sender: User
  body: string
  date: string
}
