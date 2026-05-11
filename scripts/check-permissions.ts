import { PERMISSIONS, ROLE_PERMISSION_MAP, ROLES } from '../app/utils/permissions.ts'

const permissionIds = PERMISSIONS.map(permission => permission.id)
const uniqueIds = new Set(permissionIds)

if (uniqueIds.size !== permissionIds.length) {
  throw new Error('Duplicate permission IDs found in shared/permissions.ts')
}

for (const role of ROLES) {
  const derivedIds = PERMISSIONS
    .filter(permission => permission.roles.includes(role))
    .map(permission => permission.id)
    .sort()

  const mappedIds = [...(ROLE_PERMISSION_MAP[role] ?? [])].sort()

  if (derivedIds.join(',') !== mappedIds.join(',')) {
    throw new Error(`ROLE_PERMISSION_MAP drift detected for role: ${role}`)
  }
}

console.log('Permission consistency check passed.')
