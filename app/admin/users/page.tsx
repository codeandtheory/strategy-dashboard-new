'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { usePermissions } from '@/contexts/permissions-context'
import { BaseRole, SpecialAccess, UserPermissions } from '@/lib/permissions'
import { Save, Shield, Crown, UserPlus, Trash2 } from 'lucide-react'
import { getRoleDisplayName, getSpecialAccessDisplayName } from '@/lib/permissions'

export default function UsersAdmin() {
  const { permissions } = usePermissions()
  const [users, setUsers] = useState<UserPermissions[]>([
    {
      baseRole: 'admin',
      specialAccess: [],
    },
    {
      baseRole: 'leader',
      specialAccess: ['curator'],
    },
    {
      baseRole: 'contributor',
      specialAccess: ['beast_babe'],
    },
  ])

  const [selectedUser, setSelectedUser] = useState<UserPermissions | null>(null)
  const [editingUser, setEditingUser] = useState<UserPermissions | null>(null)

  if (!permissions?.canManageUsers) {
    return (
      <div>
        <Card className="p-6">
          <p className="text-destructive">You don't have permission to manage users.</p>
        </Card>
      </div>
    )
  }

  const handleEdit = (user: UserPermissions) => {
    setEditingUser({ ...user })
    setSelectedUser(user)
  }

  const handleSave = () => {
    if (!editingUser) return
    
    // TODO: Save to database/API
    console.log('Saving user:', editingUser)
    setUsers(users.map(u => u === selectedUser ? editingUser : u))
    setEditingUser(null)
    setSelectedUser(null)
    alert('User updated! (This will connect to your backend)')
  }

  const handleAddUser = () => {
    const newUser: UserPermissions = {
      baseRole: 'user',
      specialAccess: [],
    }
    setUsers([...users, newUser])
    setEditingUser(newUser)
    setSelectedUser(newUser)
  }

  const handleRemoveSpecialAccess = (access: SpecialAccess) => {
    if (!editingUser) return
    setEditingUser({
      ...editingUser,
      specialAccess: editingUser.specialAccess.filter(a => a !== access),
    })
  }

  const handleAddSpecialAccess = (access: SpecialAccess) => {
    if (!editingUser) return
    if (!editingUser.specialAccess.includes(access)) {
      setEditingUser({
        ...editingUser,
        specialAccess: [...editingUser.specialAccess, access],
      })
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">User Management</h1>
        <p className="text-muted-foreground">Manage user roles and special access permissions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User List */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">Users</h2>
            <Button onClick={handleAddUser} size="sm">
              <UserPlus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </div>
          <div className="space-y-2">
            {users.map((user, index) => (
              <div
                key={index}
                onClick={() => handleEdit(user)}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedUser === user
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:bg-muted'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Shield className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium text-foreground">
                        {getRoleDisplayName(user.baseRole)}
                      </span>
                    </div>
                    {user.specialAccess.length > 0 && (
                      <div className="flex items-center gap-2 flex-wrap mt-2">
                        {user.specialAccess.map((access) => (
                          <span
                            key={access}
                            className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 rounded flex items-center gap-1"
                          >
                            <Crown className="w-3 h-3" />
                            {getSpecialAccessDisplayName(access)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Edit User */}
        {editingUser && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Edit User</h2>
            <div className="space-y-6">
              {/* Base Role */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Base Role</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['user', 'contributor', 'leader', 'admin'] as BaseRole[]).map((role) => (
                    <button
                      key={role}
                      onClick={() => setEditingUser({ ...editingUser, baseRole: role })}
                      className={`p-3 border rounded-lg text-left transition-colors ${
                        editingUser.baseRole === role
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:bg-muted'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        <span className="font-medium">{getRoleDisplayName(role)}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Special Access */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Special Access
                </label>
                <div className="space-y-2">
                  {/* Curator */}
                  <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Crown className="w-4 h-4 text-yellow-500" />
                      <span className="font-medium">{getSpecialAccessDisplayName('curator')}</span>
                      <span className="text-xs text-muted-foreground">
                        (Can manage playlists and content)
                      </span>
                    </div>
                    {editingUser.specialAccess.includes('curator') ? (
                      <Button
                        onClick={() => handleRemoveSpecialAccess('curator')}
                        variant="outline"
                        size="sm"
                      >
                        Remove
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleAddSpecialAccess('curator')}
                        variant="outline"
                        size="sm"
                      >
                        Add
                      </Button>
                    )}
                  </div>

                  {/* Beast Babe */}
                  <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Crown className="w-4 h-4 text-yellow-500" />
                      <span className="font-medium">{getSpecialAccessDisplayName('beast_babe')}</span>
                      <span className="text-xs text-muted-foreground">
                        (Can pass the beast babe torch)
                      </span>
                    </div>
                    {editingUser.specialAccess.includes('beast_babe') ? (
                      <Button
                        onClick={() => handleRemoveSpecialAccess('beast_babe')}
                        variant="outline"
                        size="sm"
                      >
                        Remove
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleAddSpecialAccess('beast_babe')}
                        variant="outline"
                        size="sm"
                      >
                        Add
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-border">
                <Button onClick={handleSave} size="lg">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

