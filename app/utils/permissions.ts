export const ROLES = ['admin', 'editor', 'viewer'] as const

export type Role = (typeof ROLES)[number]

export interface PermissionDefinition {
  id: string
  name: string
  description: string
  roles: Role[]
}

export interface PermissionModule {
  id: string
  name: string
  description: string
  permissions: PermissionDefinition[]
}

export const PERMISSION_MODULES: PermissionModule[] = [
  {
    id: 'users',
    name: '用户管理',
    description: '管理系统用户',
    permissions: [
      { id: 'users.view', name: '查看用户', description: '查看用户列表和详情', roles: ['admin', 'editor', 'viewer'] },
      { id: 'users.create', name: '创建用户', description: '创建新用户', roles: ['admin'] },
      { id: 'users.edit', name: '编辑用户', description: '修改用户信息', roles: ['admin'] },
      { id: 'users.delete', name: '删除用户', description: '删除系统用户', roles: ['admin'] }
    ]
  },
  {
    id: 'roles',
    name: '角色管理',
    description: '管理系统角色和权限',
    permissions: [
      { id: 'roles.view', name: '查看角色', description: '查看角色列表和权限', roles: ['admin'] },
      { id: 'roles.assign', name: '分配角色', description: '为用户分配角色', roles: ['admin'] }
    ]
  },
  {
    id: 'content',
    name: '内容管理',
    description: '管理系统内容',
    permissions: [
      { id: 'content.view', name: '查看内容', description: '查看所有内容', roles: ['admin', 'editor', 'viewer'] },
      { id: 'content.create', name: '创建内容', description: '创建新内容', roles: ['admin', 'editor'] },
      { id: 'content.edit', name: '编辑内容', description: '修改已有内容', roles: ['admin', 'editor'] },
      { id: 'content.delete', name: '删除内容', description: '删除系统内容', roles: ['admin'] },
      { id: 'content.publish', name: '发布内容', description: '发布或下线内容', roles: ['admin', 'editor'] }
    ]
  },
  {
    id: 'settings',
    name: '系统设置',
    description: '管理系统配置',
    permissions: [
      { id: 'settings.view', name: '查看设置', description: '查看系统设置', roles: ['admin'] },
      { id: 'settings.edit', name: '修改设置', description: '修改系统设置', roles: ['admin'] }
    ]
  },
  {
    id: 'reports',
    name: '数据报表',
    description: '查看和导出数据报表',
    permissions: [
      { id: 'reports.view', name: '查看报表', description: '查看数据报表', roles: ['admin', 'editor', 'viewer'] },
      { id: 'reports.export', name: '导出报表', description: '导出数据报表', roles: ['admin'] }
    ]
  }
]

export const PERMISSIONS = PERMISSION_MODULES.flatMap(module => module.permissions)

export const ROLE_PERMISSION_MAP = ROLES.reduce((acc, role) => {
  acc[role] = PERMISSIONS.filter(permission => permission.roles.includes(role)).map(permission => permission.id)
  return acc
}, {} as Record<Role, string[]>)
