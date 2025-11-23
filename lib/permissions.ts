/**
 * Role-Based Access Control (RBAC) System
 * 
 * Base Roles: user, contributor, leader, admin
 * Special Access: curator, beast_babe
 */

export type BaseRole = 'user' | 'contributor' | 'leader' | 'admin'
export type SpecialAccess = 'curator' | 'beast_babe'

export interface UserPermissions {
  baseRole: BaseRole
  specialAccess: SpecialAccess[]
}

export interface PermissionConfig {
  canViewAdmin: boolean
  canManagePlaylists: boolean
  canManageContent: boolean
  canManageHoroscopes: boolean
  canManageWeather: boolean
  canManageSettings: boolean
  canManageUsers: boolean
  canPassBeastBabe: boolean
  canManageCurators: boolean
}

/**
 * Get permissions based on user role and special access
 */
export function getPermissions(user: UserPermissions): PermissionConfig {
  const { baseRole, specialAccess } = user
  const isCurator = specialAccess.includes('curator')
  const isBeastBabe = specialAccess.includes('beast_babe')

  // Base permissions by role
  const basePermissions: Record<BaseRole, Partial<PermissionConfig>> = {
    user: {
      canViewAdmin: false,
      canManagePlaylists: false,
      canManageContent: false,
      canManageHoroscopes: false,
      canManageWeather: false,
      canManageSettings: false,
      canManageUsers: false,
      canPassBeastBabe: false,
      canManageCurators: false,
    },
    contributor: {
      canViewAdmin: true,
      canManagePlaylists: false,
      canManageContent: false,
      canManageHoroscopes: false,
      canManageWeather: false,
      canManageSettings: false,
      canManageUsers: false,
      canPassBeastBabe: false,
      canManageCurators: false,
    },
    leader: {
      canViewAdmin: true,
      canManagePlaylists: true,
      canManageContent: true,
      canManageHoroscopes: false,
      canManageWeather: false,
      canManageSettings: false,
      canManageUsers: false,
      canPassBeastBabe: false,
      canManageCurators: false,
    },
    admin: {
      canViewAdmin: true,
      canManagePlaylists: true,
      canManageContent: true,
      canManageHoroscopes: true,
      canManageWeather: true,
      canManageSettings: true,
      canManageUsers: true,
      canPassBeastBabe: false,
      canManageCurators: true,
    },
  }

  // Start with base role permissions
  const permissions: PermissionConfig = {
    canViewAdmin: basePermissions[baseRole].canViewAdmin || false,
    canManagePlaylists: basePermissions[baseRole].canManagePlaylists || false,
    canManageContent: basePermissions[baseRole].canManageContent || false,
    canManageHoroscopes: basePermissions[baseRole].canManageHoroscopes || false,
    canManageWeather: basePermissions[baseRole].canManageWeather || false,
    canManageSettings: basePermissions[baseRole].canManageSettings || false,
    canManageUsers: basePermissions[baseRole].canManageUsers || false,
    canPassBeastBabe: false,
    canManageCurators: basePermissions[baseRole].canManageCurators || false,
  }

  // Apply special access permissions
  if (isCurator) {
    permissions.canManagePlaylists = true
    permissions.canManageContent = true
  }

  // Beast babe can pass the torch, and admins can also pass it
  if (isBeastBabe || baseRole === 'admin') {
    permissions.canPassBeastBabe = true
  }

  return permissions
}

/**
 * Check if user has a specific permission
 */
export function hasPermission(
  user: UserPermissions,
  permission: keyof PermissionConfig
): boolean {
  const permissions = getPermissions(user)
  return permissions[permission]
}

/**
 * Get role display name
 */
export function getRoleDisplayName(role: BaseRole): string {
  const names: Record<BaseRole, string> = {
    user: 'User',
    contributor: 'Contributor',
    leader: 'Leader',
    admin: 'Admin',
  }
  return names[role]
}

/**
 * Get special access display name
 */
export function getSpecialAccessDisplayName(access: SpecialAccess): string {
  const names: Record<SpecialAccess, string> = {
    curator: 'Curator',
    beast_babe: 'Beast Babe',
  }
  return names[access]
}

