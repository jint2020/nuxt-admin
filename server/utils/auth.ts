import type { User, Role, Permission } from '~/types'

// 模拟用户数据库
const users: User[] = [
  {
    id: 1,
    name: '管理员',
    email: 'admin@example.com',
    avatar: 'https://i.pravatar.cc/128?u=admin',
    role: 'admin'
  },
  {
    id: 2,
    name: '编辑者',
    email: 'editor@example.com',
    avatar: 'https://i.pravatar.cc/128?u=editor',
    role: 'editor'
  },
  {
    id: 3,
    name: '访客',
    email: 'viewer@example.com',
    avatar: 'https://i.pravatar.cc/128?u=viewer',
    role: 'viewer'
  }
]

// 权限列表定义
const permissions: Permission[] = [
  {
    id: 'user:read',
    name: '查看用户',
    description: '查看用户列表和详情',
    roles: ['admin', 'editor', 'viewer']
  },
  {
    id: 'user:write',
    name: '编辑用户',
    description: '创建和编辑用户信息',
    roles: ['admin', 'editor']
  },
  {
    id: 'user:delete',
    name: '删除用户',
    description: '删除用户账号',
    roles: ['admin']
  },
  {
    id: 'settings:read',
    name: '查看设置',
    description: '查看系统设置',
    roles: ['admin', 'editor', 'viewer']
  },
  {
    id: 'settings:write',
    name: '修改设置',
    description: '修改系统设置',
    roles: ['admin']
  },
  {
    id: 'roles:manage',
    name: '管理角色',
    description: '管理用户角色和权限',
    roles: ['admin']
  }
]

// 演示用静态 token 映射（实际项目中 token 由 SSO/后端颁发）
const demoTokens = new Map<string, number>([
  ['demo-admin-token', 1],
  ['demo-editor-token', 2],
  ['demo-viewer-token', 3]
])

// 获取全部用户
export function getUsers(): User[] {
  return users
}

// 通过邮箱查找用户
export function findUserByEmail(email: string): User | undefined {
  return users.find((u) => u.email === email)
}

// 通过 ID 查找用户
export function findUserById(id: number): User | undefined {
  return users.find((u) => u.id === id)
}

// 通过 Token 获取用户（供 server middleware 验证 session cookie 使用）
export function getUserByToken(token: string): User | undefined {
  const userId = demoTokens.get(token)
  if (userId === undefined) return undefined
  return findUserById(userId)
}

// 获取全部权限定义
export function getPermissions(): Permission[] {
  return permissions
}

// 检查指定角色是否拥有某权限
export function hasPermission(role: Role, permissionId: string): boolean {
  const perm = permissions.find((p) => p.id === permissionId)
  if (!perm) return false
  return perm.roles.includes(role)
}

// 获取指定角色的所有权限
export function getRolePermissions(role: Role): Permission[] {
  return permissions.filter((p) => p.roles.includes(role))
}
