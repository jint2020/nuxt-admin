import { defineStore } from 'pinia'
import type { Permission, Role } from '~/types'

// 权限模块定义
interface PermissionModule {
  id: string
  name: string
  description: string
  permissions: Permission[]
}

// 角色权限映射
const rolePermissionMap: Record<Role, string[]> = {
  admin: [
    'users.view', 'users.create', 'users.edit', 'users.delete',
    'roles.view', 'roles.assign',
    'content.view', 'content.create', 'content.edit', 'content.delete', 'content.publish',
    'settings.view', 'settings.edit',
    'reports.view', 'reports.export'
  ],
  editor: [
    'users.view',
    'content.view', 'content.create', 'content.edit', 'content.publish',
    'reports.view'
  ],
  viewer: [
    'users.view',
    'content.view',
    'reports.view'
  ]
}

// 权限模块分组
const permissionModules: PermissionModule[] = [
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

// 角色元数据
const roleMetadata: Record<Role, { label: string, description: string, color: string }> = {
  admin: {
    label: '管理员',
    description: '拥有系统所有权限',
    color: 'red'
  },
  editor: {
    label: '编辑者',
    description: '可以管理内容和查看基础数据',
    color: 'blue'
  },
  viewer: {
    label: '查看者',
    description: '只能查看数据，不能编辑',
    color: 'gray'
  }
}

export const usePermissionsStore = defineStore('permissions', {
  state: () => ({
    // 缓存的权限数据
    cachedPermissions: [] as Permission[],
    isLoading: false
  }),

  getters: {
    // 获取所有权限模块
    allModules: (): PermissionModule[] => permissionModules,

    // 获取所有角色
    allRoles: (): Role[] => ['admin', 'editor', 'viewer'],

    // 获取角色元数据
    roleMeta: () => roleMetadata,

    // 获取角色权限映射
    rolePermissions: () => rolePermissionMap,

    // 获取权限矩阵数据（用于表格展示）
    permissionMatrix: () => {
      return permissionModules.flatMap(module =>
        module.permissions.map(permission => ({
          module: module.name,
          name: permission.name,
          description: permission.description,
          admin: permission.roles.includes('admin'),
          editor: permission.roles.includes('editor'),
          viewer: permission.roles.includes('viewer')
        }))
      )
    },

    // 获取指定角色的所有权限
    getPermissionsByRole: () => {
      return (role: Role): string[] => {
        return rolePermissionMap[role] ?? []
      }
    }
  },

  actions: {
    // 从服务器获取权限列表
    async fetchPermissions() {
      this.isLoading = true
      try {
        const permissions = await $fetch<Permission[]>('/api/auth/permissions')
        this.cachedPermissions = permissions
      } catch (err) {
        console.error('获取权限列表失败:', err)
      } finally {
        this.isLoading = false
      }
    },

    // 检查角色是否拥有指定权限
    hasPermission(role: Role, permissionId: string): boolean {
      const permissions = rolePermissionMap[role] ?? []
      return permissions.includes(permissionId)
    },

    // 检查角色是否拥有指定模块的任意权限
    hasModuleAccess(role: Role, moduleId: string): boolean {
      const permissions = rolePermissionMap[role] ?? []
      return permissions.some(p => p.startsWith(`${moduleId}.`))
    },

    // 获取指定模块的权限列表（标记当前角色是否拥有）
    getModulePermissions(moduleId: string, currentRole: Role) {
      const module = permissionModules.find(m => m.id === moduleId)
      if (!module) return []

      return module.permissions.map(permission => ({
        ...permission,
        granted: permission.roles.includes(currentRole)
      }))
    },

    // 获取角色在权限矩阵中的列定义（用于UTable）
    getRoleColumns() {
      return (['admin', 'editor', 'viewer'] as Role[]).map(role => ({
        key: role,
        label: roleMetadata[role].label,
        description: roleMetadata[role].description
      }))
    }
  }
})
