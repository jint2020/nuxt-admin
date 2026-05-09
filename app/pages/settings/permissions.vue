<script setup lang="ts">
import type { Role, User, Permission } from '~/types'

// 仅管理员可访问
definePageMeta({
  middleware: ['admin']
})

const { isAdmin } = storeToRefs(useAuth())

// 角色配置信息
const roleConfig = {
  admin: { label: '管理员', color: 'error' as const, description: '拥有所有权限，可管理系统设置和用户' },
  editor: { label: '编辑者', color: 'warning' as const, description: '可创建和编辑内容，无法管理用户' },
  viewer: { label: '查看者', color: 'info' as const, description: '仅可查看内容，无法编辑或管理' }
}

// 从API获取用户列表和权限定义
const { data: usersData } = await useFetch<User[]>('/api/auth/users')
const { data: permissionsData } = await useFetch<{ all: Permission[] }>('/api/auth/permissions')

const users = ref<User[]>(usersData.value ?? [])
const permissions = ref<Permission[]>(permissionsData.value?.all ?? [])

// 角色选项
const roleOptions = Object.entries(roleConfig).map(([value, config]) => ({
  value: value as Role,
  label: config.label
}))

// 用户表格列定义
const userColumns = [
  { accessorKey: 'name', header: '用户' },
  { accessorKey: 'email', header: '邮箱' },
  { accessorKey: 'role', header: '角色' },
  { id: 'actions', header: '操作' }
]

// 权限矩阵表格列定义
const matrixColumns = [
  { accessorKey: 'name', header: '权限名称' },
  { accessorKey: 'description', header: '描述' },
  { accessorKey: 'admin', header: '管理员' },
  { accessorKey: 'editor', header: '编辑者' },
  { accessorKey: 'viewer', header: '查看者' }
]

// 变更用户角色
const toast = useToast()
function changeUserRole(user: User, newRole: Role) {
  const oldRole = user.role
  user.role = newRole
  toast.add({
    title: '角色已更新',
    description: `${user.name} 的角色已从 ${roleConfig[oldRole].label} 更改为 ${roleConfig[newRole].label}`,
    color: 'success',
    icon: 'i-lucide-check'
  })
}

// 切换权限矩阵中的角色权限
function togglePermissionRole(permission: Permission, role: Role) {
  const index = permission.roles.indexOf(role)
  if (index >= 0) {
    // 至少保留一个角色拥有该权限
    if (permission.roles.length <= 1) {
      toast.add({
        title: '无法移除',
        description: '每个权限至少需要一个角色拥有',
        color: 'warning',
        icon: 'i-lucide-alert-triangle'
      })
      return
    }
    permission.roles.splice(index, 1)
  } else {
    permission.roles.push(role)
  }
}
</script>

<template>
  <div v-if="!isAdmin" class="flex flex-col items-center justify-center py-20 gap-4">
    <UIcon name="i-lucide-shield-alert" class="size-12 text-muted" />
    <p class="text-lg text-muted">
      您没有权限访问此页面
    </p>
    <UButton label="返回设置" to="/settings" color="neutral" />
  </div>

  <div v-else class="flex flex-col gap-6">
    <!-- 角色概览 -->
    <UPageCard
      title="角色概览"
      description="系统中定义的角色及其权限范围"
      variant="naked"
    >
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          v-for="(config, role) in roleConfig"
          :key="role"
          class="border border-default rounded-lg p-4 flex flex-col gap-2"
        >
          <div class="flex items-center gap-2">
            <UBadge :label="config.label" :color="config.color" variant="subtle" />
            <span class="text-xs text-muted">
              {{ users.filter(u => u.role === role).length }} 位用户
            </span>
          </div>
          <p class="text-sm text-muted">
            {{ config.description }}
          </p>
        </div>
      </div>
    </UPageCard>

    <!-- 用户角色分配 -->
    <UPageCard
      title="用户角色分配"
      description="为系统用户分配不同的角色"
      variant="naked"
    >
      <UTable :data="users" :columns="userColumns">
        <template #name-cell="{ row }">
          <div class="flex items-center gap-3">
            <UAvatar
              :alt="row.original.name"
              size="sm"
            />
            <span class="font-medium">{{ row.original.name }}</span>
          </div>
        </template>

        <template #email-cell="{ row }">
          <span class="text-muted">{{ row.original.email }}</span>
        </template>

        <template #role-cell="{ row }">
          <UBadge
            :label="roleConfig[row.original.role].label"
            :color="roleConfig[row.original.role].color"
            variant="subtle"
          />
        </template>

        <template #actions-cell="{ row }">
          <USelect
            :model-value="row.original.role"
            :items="roleOptions"
            option-attribute="label"
            value-attribute="value"
            class="w-32"
            @update:model-value="(val: Role) => changeUserRole(row.original, val)"
          />
        </template>
      </UTable>
    </UPageCard>

    <!-- 权限矩阵 -->
    <UPageCard
      title="权限矩阵"
      description="各角色的权限配置矩阵，点击可切换权限状态"
      variant="naked"
    >
      <UTable :data="permissions" :columns="matrixColumns">
        <template #name-cell="{ row }">
          <span class="font-medium">{{ row.original.name }}</span>
        </template>

        <template #description-cell="{ row }">
          <span class="text-muted text-sm">{{ row.original.description }}</span>
        </template>

        <template #admin-cell="{ row }">
          <UButton
            :icon="row.original.roles.includes('admin') ? 'i-lucide-check-circle' : 'i-lucide-x-circle'"
            :color="row.original.roles.includes('admin') ? 'success' : 'neutral'"
            variant="ghost"
            size="sm"
            @click="togglePermissionRole(row.original, 'admin')"
          />
        </template>

        <template #editor-cell="{ row }">
          <UButton
            :icon="row.original.roles.includes('editor') ? 'i-lucide-check-circle' : 'i-lucide-x-circle'"
            :color="row.original.roles.includes('editor') ? 'success' : 'neutral'"
            variant="ghost"
            size="sm"
            @click="togglePermissionRole(row.original, 'editor')"
          />
        </template>

        <template #viewer-cell="{ row }">
          <UButton
            :icon="row.original.roles.includes('viewer') ? 'i-lucide-check-circle' : 'i-lucide-x-circle'"
            :color="row.original.roles.includes('viewer') ? 'success' : 'neutral'"
            variant="ghost"
            size="sm"
            @click="togglePermissionRole(row.original, 'viewer')"
          />
        </template>
      </UTable>
    </UPageCard>
  </div>
</template>
