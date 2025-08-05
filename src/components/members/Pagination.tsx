interface PaginationProps {
  current: number
  total: number
  onChange: (page: number) => void
}

/**
 * Render a simple pagination control with previous/next buttons and a
 * page indicator. When there are many pages you may wish to augment this
 * component to show numbered links. Disabled buttons are styled to appear
 * inert.
 */
export default function Pagination({ current, total, onChange }: PaginationProps) {
  const prevDisabled = current <= 1
  const nextDisabled = current >= total
  return (
    <div className="mt-4 flex items-center justify-end space-x-2">
      <button
        onClick={() => !prevDisabled && onChange(current - 1)}
        disabled={prevDisabled}
        className="rounded-md px-3 py-1 text-sm font-medium shadow-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 bg-gray-100 text-gray-700 hover:bg-gray-200"
      >
        Previous
      </button>
      <span className="text-sm font-medium dark:text-gray-300">
        Page {current} of {total}
      </span>
      <button
        onClick={() => !nextDisabled && onChange(current + 1)}
        disabled={nextDisabled}
        className="rounded-md px-3 py-1 text-sm font-medium shadow-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 bg-gray-100 text-gray-700 hover:bg-gray-200"
      >
        Next
      </button>
    </div>
  )
}