import type { Member, Invite, Role } from '@/types'

/**
 * Mock: Return hardcoded members for frontend development.
 */
export function getMembers(params: { page?: number; limit?: number } = {}): Promise<{ members: Member[]; total: number }> {
  return Promise.resolve({
    members: [
      {
        id: '1',
        fullName: 'Jane Doe',
        email: 'jane@example.com',
        status: 'active',
        role: 'admin',
        joinedAt: '2024-01-10T08:00:00.000Z',
        department: 'Engineering'
      },
      {
        id: '2',
        fullName: 'John Smith',
        email: 'john@example.com',
        status: 'pending',
        role: 'member',
        joinedAt: '2024-02-12T08:00:00.000Z',
        department: 'Support'
      },
    ],
    total: 2,
  });
}

/**
 * Mock: Return one member by ID.
 */
export function getMember(id: string): Promise<Member> {
  return getMembers().then(res => {
    const found = res.members.find(m => m.id === id);
    if (!found) throw new Error('Member not found');
    return found;
  });
}

/**
 * Mock: Invite member always succeeds.
 */
export function inviteMember(data: { email: string; role: Role }): Promise<Invite> {
  return Promise.resolve({
    id: Math.random().toString(36).substring(2),
    email: data.email,
    role: data.role,
    status: 'pending',
    invitedAt: new Date().toISOString(),
  });
}

/**
 * Mock: Update member (no-op, returns fake).
 */
export function updateMember(id: string, data: Partial<Member>): Promise<Member> {
  return getMember(id).then(m => ({ ...m, ...data }));
}

/**
 * Mock: Delete member (no-op).
 */
export function deleteMember(id: string): Promise<void> {
  return Promise.resolve();
}

/**
 * Mock: Pending invites.
 */
export function getInvites(): Promise<{ invites: Invite[] }> {
  return Promise.resolve({
    invites: [
      {
        id: '101',
        email: 'invited@example.com',
        role: 'manager',
        status: 'pending',
        invitedAt: new Date().toISOString(),
      }
    ]
  });
}

/**
 * Mock: Resend invite.
 */
export function resendInvite(id: string): Promise<Invite> {
  return getInvites().then(res => {
    const inv = res.invites.find(i => i.id === id);
    if (!inv) throw new Error('Invite not found');
    return { ...inv, invitedAt: new Date().toISOString() };
  });
}

/**
 * Mock: Revoke invite (no-op).
 */
export function revokeInvite(id: string): Promise<void> {
  return Promise.resolve();
}
