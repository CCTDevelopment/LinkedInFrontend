/*
 * Button and modal for inviting new members. Presents a form where an
 * administrator can enter an email address and select a role. On submit
 * an invitation will be sent via the backend API. Optimistic UI and
 * error handling are provided by the `useMembers` hook.
 */
import React from "react";
import { useState } from 'react'
import { useMembers } from '@/hooks/useMembers'
import type { Role } from '@/types'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
// import RoleDropdown from './RoleDropdown' // Don't use for native label/test support

export default function InviteMemberButton() {
  const { invite } = useMembers(1, 10)
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<Role>('member')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    invite.mutate(
      { email, role },
      {
        onSuccess: () => {
          setEmail('')
          setRole('member')
          setOpen(false)
        },
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Invite Member</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <DialogHeader>
            <DialogTitle>Invite new member</DialogTitle>
            <DialogDescription>
              Enter the user’s email and assign a role. An invitation email
              will be sent automatically.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="invite-email">Email address</Label>
              <Input
                id="invite-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="invite-role">Role</Label>
              <select
                id="invite-role"
                value={role}
                onChange={e => setRole(e.target.value as Role)}
                className="rounded-md border-none bg-transparent text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-200 cursor-pointer"
              >
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="member">Member</option>
              </select>
            </div>
          </div>
          <DialogFooter className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={invite.isPending}>
              {invite.isPending ? 'Sending…' : 'Send Invite'}
            </Button>
          </DialogFooter>
          {invite.isError && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {String(invite.error)}
            </p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
}
