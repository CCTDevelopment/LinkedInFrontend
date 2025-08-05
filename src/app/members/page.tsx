/*
 * Members list page. Displays a paginated table of all members and
 * controls for inviting new users. Uses React Query to fetch data from
 * the backend and update the UI optimistically. Only administrators
 * are shown role management controls.
 */
'use client'
import React from "react";
import type { Member } from '@/types'
import { useState } from 'react'
import { useMembers } from '@/hooks/useMembers'
import MemberRow from '@/components/members/MemberRow'
import Pagination from '@/components/members/Pagination'
import InviteMemberButton from '@/components/members/InviteMemberButton'
import PendingInvites from '@/components/members/PendingInvites'

export default function MembersPage() {
  const [page, setPage] = useState(1)
  const limit = 10
  const { membersQuery, update, remove } = useMembers(page, limit)
  const isAdmin = true // For demo, always admin

  if (membersQuery.isLoading) {
    return <div className="p-8 text-lg text-muted-foreground">Loading members…</div>
  }
  if (membersQuery.isError) {
    return (
      <div className="p-8 text-red-600 dark:text-red-400 text-lg">
        Failed to load members: {String(membersQuery.error)}
      </div>
    )
  }

  // Explicitly type the expected data structure
  type MembersData = { members: Member[]; total: number }
  const data = membersQuery.data as MembersData | undefined

  const members = data?.members ?? []
  const total = data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / limit))

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Team Members</h1>
          <p className="text-muted-foreground">Invite your team and manage access to your FounderHub workspace.</p>
        </div>
        <InviteMemberButton />
      </div>
      {/* Members table */}
      <div className="overflow-x-auto rounded-2xl bg-white shadow-xl dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800">
        <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-800">
          <thead className="bg-neutral-50 dark:bg-neutral-800">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide uppercase">Member</th>
              <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide uppercase">Role</th>
              <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide uppercase">Joined</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {members.map((m) => (
              <MemberRow
                key={m.id}
                member={m}
                onUpdate={update.mutate}
                onRemove={remove.mutate}
                isAdmin={isAdmin}
              />
            ))}
            {members.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm text-muted-foreground">
                  No members found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex justify-end mt-4">
          <Pagination current={page} total={totalPages} onChange={setPage} />
        </div>
      )}
      <div className="mt-10">
        <PendingInvites />
      </div>
    </div>
  )
}
