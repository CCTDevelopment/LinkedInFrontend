/**
 * React hooks wrapping TanStack Query for loading and mutating member data.
 * Each hook encapsulates a specific API call and caches the result under a
 * stable query key. Mutations invalidate the relevant queries to keep the
 * UI in sync with the backend.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Member } from '@/types'
import {
  getMembers,
  getInvites,
  getMember,
  inviteMember,
  updateMember,
  deleteMember,
  resendInvite,
  revokeInvite,
} from '@/lib/api'

/**
 * Load a paginated list of members. Pass the current page and page size to
 * scope the query key; this avoids mixing results from different pages. The
 * returned object contains the query state (`data`, `isLoading`, etc.)
 * alongside mutation helpers for invites and member updates.
 */
export function useMembers(page = 1, limit = 10) {
  const queryClient = useQueryClient()

  // Typed for correct type-checking and v5 compatibility
  const membersQuery = useQuery<{
    members: Member[];
    total: number;
  }>({
    queryKey: ['members', page, limit],
    queryFn: () => getMembers({ page, limit }),
    staleTime: 1000, // (optional) 1s, adjust for your UX. Remove if not needed.
  })

  // invitation mutation
  const invite = useMutation({
    mutationFn: inviteMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] })
      queryClient.invalidateQueries({ queryKey: ['invites'] })
    },
  })

  // update mutation
  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Member> }) => updateMember(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] })
    },
  })

  // delete mutation
  const remove = useMutation({
    mutationFn: (id: string) => deleteMember(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] })
    },
  })

  return { membersQuery, invite, update, remove }
}

/**
 * Load a single member by ID. This hook caches the result and will be
 * invalidated when any member list mutation occurs.
 */
export function useMember(id: string) {
  return useQuery({
    queryKey: ['member', id],
    queryFn: () => getMember(id),
  })
}

/**
 * Load pending invitations. Useful for displaying the invites table.
 */
export function useInvites() {
  const queryClient = useQueryClient()
  const invitesQuery = useQuery({
    queryKey: ['invites'],
    queryFn: getInvites,
  })

  const resend = useMutation({
    mutationFn: (id: string) => resendInvite(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invites'] })
    },
  })

  const revoke = useMutation({
    mutationFn: (id: string) => revokeInvite(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invites'] })
    },
  })

  return { invitesQuery, resend, revoke }
}
