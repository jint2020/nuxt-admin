import { defineStore } from 'pinia'
import { PERMISSION_MODULES, ROLE_PERMISSION_MAP, ROLES } from '~/app/utils/permissions'
import type { Permission, Role } from '~/types'

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
    cachedPermissions: [] as Permission[],
    isLoading: false
  }),

  getters: {
    allModules: () => PERMISSION_MODULES,
    allRoles: (): Role[] => [...ROLES],
    roleMeta: () => roleMetadata,
    rolePermissions: () => ROLE_PERMISSION_MAP,

    permissionMatrix: () => {
      return PERMISSION_MODULES.flatMap(module =>
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

    getPermissionsByRole: () => {
      return (role: Role): string[] => ROLE_PERMISSION_MAP[role] ?? []
    }
  },

  actions: {
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

    hasPermission(role: Role, permissionId: string): boolean {
      const permissions = ROLE_PERMISSION_MAP[role] ?? []
      return permissions.includes(permissionId)
    },

    hasModuleAccess(role: Role, moduleId: string): boolean {
      const permissions = ROLE_PERMISSION_MAP[role] ?? []
      return permissions.some(p => p.startsWith(`${moduleId}.`))
    },

    getModulePermissions(moduleId: string, currentRole: Role) {
      const module = PERMISSION_MODULES.find(m => m.id === moduleId)
      if (!module) return []

      return module.permissions.map(permission => ({
        ...permission,
        granted: permission.roles.includes(currentRole)
      }))
    },

    getRoleColumns() {
      return ROLES.map(role => ({
        key: role,
        label: roleMetadata[role].label,
        description: roleMetadata[role].description
      }))
    }
  }
})
