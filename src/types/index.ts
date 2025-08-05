/**
 * Type definitions for the members module.
 *
 * These types describe the shape of objects returned from the backend API.
 */

/**
 * Roles supported by the system. Only users with the `admin` role are
 * allowed to manage other users’ roles or perform destructive actions.
 */
export type Role = 'admin' | 'manager' | 'member'

/**
 * Status values applied to a member account. These values control whether a
 * member can access the system. Use `pending` for invited users who have
 * not yet completed onboarding, `active` for fully onboarded users, and
 * `suspended` or `disabled` to restrict access.
 */
export type Status = 'active' | 'pending' | 'suspended' | 'disabled'

/**
 * Representation of a member record as returned from the API. The
 * `joinedAt` property is an ISO‑8601 timestamp indicating when the user
 * accepted their invite. Optional properties such as `department` or
 * `avatarUrl` may be included by the backend.
 */
export interface Member {
  id: string
  fullName: string
  email: string
  role: Role
  status: Status
  /** ISO‑8601 timestamp of when the user joined. */
  joinedAt: string
  /** Optional department or team name. */
  department?: string
  /** Optional URL to an avatar image. */
  avatarUrl?: string
}

/**
 * Representation of an invitation record. Invites are issued via email and
 * contain a role that will be assigned upon acceptance. Invitations can
 * expire or be revoked; use the `status` field to indicate the current
 * state.
 */
export interface Invite {
  id: string
  email: string
  role: Role
  invitedAt: string
  status: 'pending' | 'accepted' | 'expired' | 'revoked'
}