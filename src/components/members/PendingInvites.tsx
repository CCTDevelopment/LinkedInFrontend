import { useInvites } from '@/hooks/useMembers'
import StatusBadge from './StatusBadge'
import React from "react";

/**
 * Display a list of pending invitations. Administrators can resend or
 * revoke invites from this table. Only shows invites with a `pending`
 * status. For brevity we reuse the `StatusBadge` to display invite
 * statuses, although the invite status type differs slightly.
 */
export default function PendingInvites() {
  const { invitesQuery, resend, revoke } = useInvites()
  if (invitesQuery.isLoading) return null
  if (invitesQuery.isError) return null
  const invites = invitesQuery.data?.invites ?? []
  const pending = invites.filter((inv) => inv.status === 'pending')
  if (pending.length === 0) return null
  return (
    <div className="mt-8">
      <h2 className="mb-3 text-lg font-semibold">Pending Invitations</h2>
      <div className="overflow-x-auto rounded-2xl shadow-lg bg-white dark:bg-gray-900">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">Email</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Role</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Invited</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {pending.map((inv) => (
              <tr key={inv.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="px-4 py-3 whitespace-nowrap text-sm">{inv.email}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  {inv.role.charAt(0).toUpperCase() + inv.role.slice(1)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  {new Date(inv.invitedAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <StatusBadge status={inv.status as any} />
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                  <button
                    type="button"
                    onClick={() => resend.mutate(inv.id)}
                    className="mr-3 text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Resend
                  </button>
                  <button
                    type="button"
                    onClick={() => revoke.mutate(inv.id)}
                    className="text-red-600 hover:underline dark:text-red-400"
                  >
                    Revoke
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}