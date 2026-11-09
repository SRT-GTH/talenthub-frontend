import { useCallback, useEffect, useState } from 'react';
import api from '../../../../services/api.js';
import { isRecruiterSession } from '../../../../services/recruiterShell.api.js';
import { debug } from '../../../../utils/debug.js';

const log = debug('useLiveTeam');

/*
 * useLiveTeam - Settings > Team and roles for a signed-in recruiter.
 *   GET  /recruiter/team                              { organisation, members, invites, canManage }
 *   POST /recruiter/team/invites                      { email, role }  invite (same email again = resend)
 *   POST /recruiter/team/invites/cancel               { email }
 *   PUT  /recruiter/team/members/:entityId/role       { role: admin | recruiter }
 *   POST /recruiter/team/members/:entityId/remove
 *   POST /recruiter/team/requests/:entityId           { approve, role? }  someone asking to join
 * members[].status: active | request (asked to join). Open invites come back as rows with status "pending".
 * Only admins (canManage) can change anything; the backend checks it too, and keeps at least one admin.
 */

const unwrap = (res) => (res?.data?.data !== undefined ? res.data.data : res?.data);

const TINTS = [
  'bg-[#ebf1ec] text-[#2a5730]',
  'bg-[#f5f3ff] text-[#6d28d9]',
  'bg-[#eaeffb] text-[#244a9f]',
  'bg-[#faf4e8] text-[#463409]',
];

const initialsOf = (name = '', email = '') => {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (parts.length > 1) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return (parts[0] || email || '?').slice(0, 2).toUpperCase();
};

// An invite has no name yet: the address' local part ("ama.k" -> "Ama K").
const inviteName = (email) =>
  email
    .split('@')[0]
    .split(/[._-]+/)
    .filter(Boolean)
    .map((p) => p[0].toUpperCase() + p.slice(1))
    .join(' ') || email;

export const toTeamRows = (members = [], invites = []) => [
  ...members.map((m, i) => ({
    ...m,
    initials: initialsOf(m.name, m.email),
    avatar: m.status === 'request' ? 'bg-[#faf4e8] text-[#463409]' : TINTS[i % TINTS.length],
  })),
  ...invites.map((inv) => ({
    id: `invite-${inv.email}`,
    name: inviteName(inv.email),
    email: inv.email,
    role: inv.role,
    status: 'pending',
    initials: initialsOf(inviteName(inv.email), inv.email),
    avatar: 'bg-[#bcb7a8] text-[#575755]',
  })),
];

export const teamError = (err, fallback = 'That didn’t work. Try again.') =>
  err?.response?.data?.message || err?.response?.data?.error?.message || fallback;

export const useLiveTeam = () => {
  const live = isRecruiterSession();
  const [state, setState] = useState({
    status: live ? 'loading' : 'demo',
    organisation: null,
    members: [],
    canManage: false,
  });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!live) return undefined;
    let alive = true;
    api
      .get('/recruiter/team')
      .then((res) => {
        const out = unwrap(res) || {};
        log('loaded', { members: (out.members || []).length, invites: (out.invites || []).length });
        if (alive)
          setState({
            status: 'live',
            organisation: out.organisation || null,
            members: toTeamRows(out.members || [], out.invites || []),
            canManage: Boolean(out.canManage),
            // Asked to join and still waiting for an admin: no team list yet.
            waiting: Boolean(out.waiting),
          });
      })
      .catch((err) => {
        log.error('load failed:', err?.response?.status);
        if (alive) setState((s) => ({ ...s, status: 'error' }));
      });
    return () => {
      alive = false;
    };
  }, [live, attempt]);

  const reload = useCallback(() => setAttempt((n) => n + 1), []);
  const after = useCallback(
    async (promise) => {
      const out = unwrap(await promise);
      reload();
      return out;
    },
    [reload]
  );

  return {
    ...state,
    reload,
    invite: (email, role) => after(api.post('/recruiter/team/invites', { email, role })),
    cancelInvite: (email) => after(api.post('/recruiter/team/invites/cancel', { email })),
    setRole: (entityId, role) =>
      after(api.put(`/recruiter/team/members/${entityId}/role`, { role })),
    remove: (entityId) => after(api.post(`/recruiter/team/members/${entityId}/remove`)),
    decide: (entityId, approve) =>
      after(api.post(`/recruiter/team/requests/${entityId}`, { approve })),
  };
};
