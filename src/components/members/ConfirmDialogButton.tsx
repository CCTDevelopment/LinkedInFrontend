import React from "react";

import { useState, ReactNode } from 'react'
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

interface ConfirmDialogButtonProps {
  /** Element to render as the trigger for the dialog (e.g. a button or link). */
  children: ReactNode
  /** Title displayed in the confirmation dialog. */
  title: string
  /** Description explaining the consequences of the action. */
  description: string
  /** Called when the user confirms the action. */
  onConfirm: () => void
}

/**
 * Wrap an arbitrary trigger element in a confirmation dialog. When
 * clicked a modal appears asking the user to confirm the action. If
 * confirmed the provided callback is invoked. Useful for destructive
 * operations like deleting or disabling a member.
 */
export default function ConfirmDialogButton({ children, title, description, onConfirm }: ConfirmDialogButtonProps) {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <span onClick={() => setOpen(true)}>{children}</span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end space-x-2 pt-4">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              onConfirm()
              setOpen(false)
            }}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}