'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { usePermissions } from '@/contexts/permissions-context'
import { Crown, ShieldOff, Users, ArrowRight } from 'lucide-react'

export default function BeastBabeAdmin() {
  const { permissions, user } = usePermissions()
  const [selectedUser, setSelectedUser] = useState<string>('')

  if (!permissions?.canPassBeastBabe) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Beast Babe Torch</h1>
        </div>
        <Card className="p-6">
          <div className="flex items-center gap-3 text-destructive">
            <ShieldOff className="w-5 h-5" />
            <p>You don't have permission to pass the beast babe torch. Only the current Beast Babe can pass it to the next person.</p>
          </div>
        </Card>
      </div>
    )
  }

  const handlePassTorch = () => {
    if (!selectedUser) {
      alert('Please select a user to pass the torch to')
      return
    }

    // TODO: Update database - remove beast_babe from current user, add to selected user
    console.log('Passing beast babe torch from', user, 'to', selectedUser)
    alert(`Beast Babe torch passed to ${selectedUser}! (This will connect to your backend)`)
  }

  // TODO: Fetch actual users from API
  const availableUsers = [
    'Alice Johnson',
    'Bob Smith',
    'Charlie Brown',
    'Diana Prince',
  ]

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Crown className="w-8 h-8 text-yellow-500" />
          <h1 className="text-4xl font-bold text-foreground">Beast Babe Torch</h1>
        </div>
        <p className="text-muted-foreground">
          Pass the Beast Babe torch to the next deserving person
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          <div className="p-6 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <Crown className="w-6 h-6 text-yellow-500" />
              <h2 className="text-xl font-semibold text-foreground">Current Beast Babe</h2>
            </div>
            <p className="text-foreground">
              You are the current Beast Babe! Select someone to pass the torch to.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Select Next Beast Babe
            </label>
            <div className="space-y-2">
              {availableUsers.map((userName) => (
                <button
                  key={userName}
                  onClick={() => setSelectedUser(userName)}
                  className={`w-full p-4 border rounded-lg text-left transition-colors ${
                    selectedUser === userName
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:bg-muted'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium text-foreground">{userName}</span>
                    </div>
                    {selectedUser === userName && (
                      <Crown className="w-5 h-5 text-yellow-500" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-4 border-t border-border">
            <Button
              onClick={handlePassTorch}
              disabled={!selectedUser}
              size="lg"
              className="bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              <Crown className="w-4 h-4 mr-2" />
              Pass the Torch
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

