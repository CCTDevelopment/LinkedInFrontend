/*
 * Detailed member profile page. Displays individual member data and
 * provides controls for editing fields and viewing audit logs. The page
 * loads member data via a React Query hook using the dynamic route
 * parameter. Editing uses the same modal component as the list page.
 */
'use client'
import React from "react";

import { useParams } from 'next/navigation'
import { useMember, useMembers } from '@/hooks/useMembers'
import EditMemberModal from '@/components/members/EditMemberModal'
import StatusBadge from '@/components/members/StatusBadge'
import RoleDropdown from '@/components/members/RoleDropdown'
import ConfirmDialogButton from '@/components/members/ConfirmDialogButton'

export default function MemberProfile() {
  const params = useParams() as { id?: string | string[] }
  let id: string = "";
  if (Array.isArray(params?.id)) {
    id = params.id[0];
  } else if (typeof params?.id === "string") {
    id = params.id;
  }

  const { data: member, isLoading, isError, error } = useMember(id)
  const { update, remove } = useMembers(1, 10)
  const isAdmin = true

  if (isLoading) {
    return <div className="p-6">Loading member…</div>
  }
  if (isError || !member) {
    return (
      <div className="p-6 text-red-600 dark:text-red-400">
        Failed to load member: {String(error)}
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{member.fullName}</h1>
        <div className="space-x-3">
          <EditMemberModal member={member} isAdmin={isAdmin} onUpdate={update.mutate} />
          <ConfirmDialogButton
            title="Remove member"
            description="This will disable the member’s account and revoke access."
            onConfirm={() => remove.mutate(member.id)}
          >
            <span className="text-red-600 hover:underline dark:text-red-400">Remove</span>
          </ConfirmDialogButton>
        </div>
      </div>
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div>
          <h2 className="mb-2 text-lg font-medium">Contact</h2>
          <p className="text-sm text-gray-700 dark:text-gray-300">Email: {member.email}</p>
          {member.department && (
            <p className="text-sm text-gray-700 dark:text-gray-300">Department: {member.department}</p>
          )}
        </div>
        <div>
          <h2 className="mb-2 text-lg font-medium">Status</h2>
          <StatusBadge status={member.status} />
        </div>
        <div>
          <h2 className="mb-2 text-lg font-medium">Role</h2>
          {isAdmin ? (
            <RoleDropdown
              role={member.role}
              onChange={(role) => update.mutate({ id: member.id, data: { role } })}
            />
          ) : (
            <span className="text-sm">
              {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
            </span>
          )}
        </div>
        <div>
          <h2 className="mb-2 text-lg font-medium">Joined</h2>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {new Date(member.joinedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="mb-2 text-lg font-medium">Audit log</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          An audit log for this member will appear here once integrated with your logging backend.
        </p>
      </div>
    </div>
  )
}
