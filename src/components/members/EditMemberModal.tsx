/*
 * Modal dialog for editing a member’s details. Uses the shadcn/ui Dialog
 * component for accessibility and keyboard navigation. Supports updating
 * the member’s full name, role and status. Role selection is hidden when
 * the current user lacks administrative privileges.
 */
import React from "react";

import { useState } from 'react'
import type { Member, Role, Status } from '@/types'
import RoleDropdown from './RoleDropdown'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Props {
  member: Member
  isAdmin: boolean
  onUpdate: (args: { id: string; data: Partial<Member> }) => void
}

export default function EditMemberModal({ member, isAdmin, onUpdate }: Props) {
  const [open, setOpen] = useState(false)
  const [fullName, setFullName] = useState(member.fullName)
  const [role, setRole] = useState<Role>(member.role)
  const [status, setStatus] = useState<Status>(member.status)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdate({ id: member.id, data: { fullName, role, status } })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button type="button" className="text-blue-600 hover:underline dark:text-blue-400">
          Edit
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <DialogHeader>
            <DialogTitle>Edit Member</DialogTitle>
            <DialogDescription>
              Update the member’s details and click save when you’re done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="full-name">Full name</Label>
              <Input
                id="full-name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            {isAdmin && (
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <RoleDropdown role={role} onChange={(r) => setRole(r)} />
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as Status)}
                className="rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:text-gray-200 dark:focus:border-blue-500"
              >
                {(['active', 'pending', 'suspended', 'disabled'] as Status[]).map((s) => (
                  <option key={s} value={s} className="dark:bg-gray-900 dark:text-gray-200">
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter className="flex justify-end space-x-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}