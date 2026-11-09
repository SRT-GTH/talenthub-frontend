import { useEffect, useState } from 'react';
import api from '../../../../services/api.js';
import { isRecruiterSession } from '../../../../services/recruiterShell.api.js';
import { debug } from '../../../../utils/debug.js';

const log = debug('useLiveTeam');

/*
 * useLiveTeam - Settings > Team and roles for a signed-in recruiter.
 *   GET /recruiter/team  { organisation: { id, name }, members: [{ id, name, email, role, status, isYou }], canManage }
 * Read-only for now: inviting, removing and changing roles need backend work that is not built yet, so the
 * tab shows the real people at the organisation and says how teammates join.
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

export const toTeamRows = (members = []) =>
  members.map((m, i) => ({
    ...m,
    initials: initialsOf(m.name, m.email),
    avatar: m.status === 'pending' ? 'bg-[#bcb7a8] text-[#575755]' : TINTS[i % TINTS.length],
  }));

export const useLiveTeam = () => {
  const live = isRecruiterSession();
  const [state, setState] = useState({
    status: live ? 'loading' : 'demo',
    organisation: null,
    members: [],
    canManage: false,
  });

  useEffect(() => {
    if (!live) return undefined;
    let alive = true;
    api
      .get('/recruiter/team')
      .then((res) => {
        const out = unwrap(res) || {};
        log('loaded', { members: (out.members || []).length });
        if (alive)
          setState({
            status: 'live',
            organisation: out.organisation || null,
            members: toTeamRows(out.members || []),
            canManage: Boolean(out.canManage),
          });
      })
      .catch((err) => {
        log.error('load failed:', err?.response?.status);
        if (alive) setState((s) => ({ ...s, status: 'error' }));
      });
    return () => {
      alive = false;
    };
  }, [live]);

  return state;
};
