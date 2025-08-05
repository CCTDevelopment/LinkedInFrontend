import type { Status } from '@/types'
import React from "react";

/**
 * Display a coloured badge representing a member’s current status. Colours
 * are derived from the Tailwind palette and adjust automatically in dark
 * mode. Capitalises the first letter of the status label.
 */
export default function StatusBadge({ status }: { status: Status }) {
  const classes: Record<Status, string> = {
    active: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    suspended: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    disabled: 'bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  }
  const label = status.charAt(0).toUpperCase() + status.slice(1)
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${classes[status]}`}
    >
      {label}
    </span>
  )
}