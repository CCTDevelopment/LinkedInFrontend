import { useRouter } from 'next/navigation'
import type { Member, Role } from '@/types'
import StatusBadge from './StatusBadge'
import RoleDropdown from './RoleDropdown'
import EditMemberModal from './EditMemberModal'
import ConfirmDialogButton from './ConfirmDialogButton'
import React from "react";

interface MemberRowProps {
  member: Member
  /**
   * Called when a role or other field is updated. Should perform a
   * mutation and handle optimistic updates. Receives an object
   * containing the member ID and the partial data to update.
   */
  onUpdate: (args: { id: string; data: Partial<Member> }) => void
  /**
   * Called when the user requests to remove a member. Implement
   * confirmation logic outside this component.
   */
  onRemove: (id: string) => void
  /**
   * True when the current user has administrative privileges and may
   * modify roles. When false the role is shown as read‑only text.
   */
  isAdmin: boolean
}

/**
 * Render a single row within the members table. Each row displays the
 * member’s avatar, name, email, role, status, join date and actions. The
 * row is not clickable; instead a separate link/button is used to view
 * the profile to avoid conflicting with interactive controls.
 */
export default function MemberRow({ member, onUpdate, onRemove, isAdmin }: MemberRowProps) {
  const router = useRouter()
  const formattedDate = new Date(member.joinedAt).toLocaleDateString()
  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="flex items-center space-x-3">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {member.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={member.avatarUrl}
                alt={member.fullName}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-700" />
            )}
          </div>
          {/* Name & Email */}
          <div className="min-w-0">
            <button
              type="button"
              onClick={() => router.push(`/members/${member.id}`)}
              className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
            >
              {member.fullName}
            </button>
            <p className="truncate text-xs text-gray-500 dark:text-gray-400">{member.email}</p>
          </div>
        </div>
      </td>
      {/* Role */}
      <td className="px-4 py-3 whitespace-nowrap">
        {isAdmin ? (
          <RoleDropdown
            role={member.role}
            onChange={(role: Role) => onUpdate({ id: member.id, data: { role } })}
          />
        ) : (
          <span className="text-sm">
            {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
          </span>
        )}
      </td>
      {/* Status */}
      <td className="px-4 py-3 whitespace-nowrap">
        <StatusBadge status={member.status} />
      </td>
      {/* Joined */}
      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
        {formattedDate}
      </td>
      {/* Actions */}
      <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
        <div className="flex justify-end space-x-2">
          <EditMemberModal member={member} isAdmin={isAdmin} onUpdate={onUpdate} />
          <ConfirmDialogButton
            title="Remove member"
            description="This will disable the member’s account and revoke access."
            onConfirm={() => onRemove(member.id)}
          >
            <span className="text-red-600 hover:underline dark:text-red-400">Remove</span>
          </ConfirmDialogButton>
        </div>
      </td>
    </tr>
  )
}