# Role-Based Access Control (RBAC) System

## Overview

The admin panel uses a role-based access control system with base roles and special access permissions.

## Base Roles

1. **User** - No admin access
2. **Contributor** - Can view admin panel (read-only)
3. **Leader** - Can manage playlists and content cards
4. **Admin** - Full access to all admin features

## Special Access

1. **Curator** - Can manage playlists and content cards (grants permissions regardless of base role)
2. **Beast Babe** - Can pass the "beast babe torch" to the next person

## Permission Matrix

| Feature | User | Contributor | Leader | Admin | Curator | Beast Babe |
|---------|------|-------------|--------|-------|---------|------------|
| View Admin | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Manage Playlists | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ |
| Manage Content | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ |
| Manage Horoscopes | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Manage Weather | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Manage Settings | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Manage Users | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Pass Beast Babe Torch | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

## Implementation

### Files

- `lib/permissions.ts` - Permission logic and types
- `contexts/permissions-context.tsx` - React context for permissions
- `app/admin/layout.tsx` - Admin layout with permission checks
- `app/admin/users/page.tsx` - User management page
- `app/admin/beast-babe/page.tsx` - Beast Babe torch passing page

### Usage

```typescript
import { usePermissions } from '@/contexts/permissions-context'

function MyComponent() {
  const { user, permissions } = usePermissions()
  
  if (!permissions?.canManagePlaylists) {
    return <div>No access</div>
  }
  
  // Component content
}
```

## Current User Setup

Currently, the system uses localStorage for demo purposes. In production, you should:

1. Connect to your authentication system
2. Fetch user roles from your database
3. Store user permissions in the context

## Testing Different Roles

To test different roles, you can modify the default user in `contexts/permissions-context.tsx`:

```typescript
// Example: Set as Beast Babe
setUser({
  baseRole: 'contributor',
  specialAccess: ['beast_babe'],
})

// Example: Set as Curator
setUser({
  baseRole: 'user',
  specialAccess: ['curator'],
})
```

## Future Enhancements

- Connect to Supabase/auth for real user management
- Add role assignment UI for admins
- Add audit logging for permission changes
- Add role-based UI customization

