import type { Role } from '@/types'
import React from "react";

interface RoleDropdownProps {
  role: Role
  onChange?: (role: Role) => void
  disabled?: boolean
}

/**
 * A lightweight dropdown for selecting user roles. When disabled the select
 * appears muted and cannot be interacted with. Values map directly to the
 * `Role` union type; call `onChange` with the new role when a selection
 * changes.
 */
export default function RoleDropdown({ role, onChange, disabled }: RoleDropdownProps) {
  const roles: Role[] = ['admin', 'manager', 'member']
  return (
    <select
      value={role}
      onChange={(e) => onChange?.(e.target.value as Role)}
      disabled={disabled}
      className={`rounded-md border-none bg-transparent text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-200 ${
        disabled ? 'text-gray-400 dark:text-gray-500' : 'cursor-pointer'
      }`}
    >
      {roles.map((r) => (
        <option key={r} value={r} className="dark:bg-gray-900 dark:text-gray-200">
          {r.charAt(0).toUpperCase() + r.slice(1)}
        </option>
      ))}
    </select>
  )
}