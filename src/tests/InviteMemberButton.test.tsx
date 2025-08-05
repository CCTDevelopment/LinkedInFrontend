import React from "react";
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import InviteMemberButton from '../components/members/InviteMemberButton'

// ---- MOCKS ----
jest.mock('../hooks/useMembers', () => {
  const mockMutate = jest.fn((_payload, options) => {
    if (options && typeof options.onSuccess === "function") {
      options.onSuccess();
    }
  });
  return {
    useMembers: () => ({
      invite: {
        mutate: mockMutate,
        isLoading: false,
        isError: false,
      },
    }),
    __esModule: true,
    mockMutate,
  }
});

jest.mock('@/hooks/useMembers', () => {
  const mockMutate = jest.fn((_payload, options) => {
    if (options && typeof options.onSuccess === "function") {
      options.onSuccess();
    }
  });
  return {
    useMembers: () => ({
      invite: {
        mutate: mockMutate,
        isLoading: false,
        isError: false,
      },
    }),
    __esModule: true,
    mockMutate,
  }
});

describe('InviteMemberButton', () => {
  it('opens a dialog and submits invite data', async () => {
    const queryClient = new QueryClient()
    render(
      <QueryClientProvider client={queryClient}>
        <InviteMemberButton />
      </QueryClientProvider>,
    )
    // click the invite button to open modal
    const inviteButton = screen.getByRole('button', { name: /invite member/i })
    await userEvent.click(inviteButton)
    // email input should be present
    const emailInput = await screen.findByLabelText(/email address/i)
    await userEvent.type(emailInput, 'jane.doe@example.com')
    // role select should be present; choose Manager
    const roleSelect = screen.getByLabelText(/role/i)
    await userEvent.selectOptions(roleSelect, 'manager')
    // submit the form
    const submit = screen.getByRole('button', { name: /send invite/i })
    await userEvent.click(submit)
    // expect mutate called with correct payload
    const { mockMutate } = require('../hooks/useMembers')
    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        { email: 'jane.doe@example.com', role: 'manager' },
        expect.any(Object),
      )
    })
  })
})
