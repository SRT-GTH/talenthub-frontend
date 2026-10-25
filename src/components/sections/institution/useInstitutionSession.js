import { useMemo } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { VERIFY_STATUSES } from './institutionState.js';
import { clampPercent } from './institutionFormat.js';
import {
  ADMIN,
  BADGES,
  COUNTS,
  HEAD,
  INSTITUTION,
  READINESS,
  STATS,
  STATS_EMPTY,
  VERIFICATION,
} from './data/institutionCoreData.js';

/*
 * useInstitutionSession — the mock "signed-in" institution session (⚠️ ASSUMPTION: no real auth).
 * ?verify=none|under-review|approved|needs-info|not-approved overrides the accreditation status (default approved); the persona card
 * line, the readiness bar and the stats follow it exactly as the frames 11.2.1a / 11.1.2b-e draw them (zeros until approved).
 * ?state=new (home 11.2.1b) and ?state=empty on the roster (11.2.2l) draw the new institution: verified, but 0 % and 0 · 0 · 0.
 * Readiness is 64 % on every screen (and on the welcome / tour overlays) and 61 % on the plain home page (as drawn).
 * Returns { admin, institution, head, verify: {status, approved, label, reference, ...dates}, readiness: {pct},
 *           stats: {students, pending, credentials}, counts: {scholarshipsLive}, badges }.
 */

export const useInstitutionSession = () => {
  const [params] = useSearchParams();
  const { pathname } = useLocation();
  const rawVerify = params.get('verify');
  const state = params.get('state');
  // the welcome modal and tour frames (11.1.3a-d) sit on the 64 % chrome, not on the 61 % home
  const onHome =
    /^\/institution\/?$/.test(pathname) && params.get('modal') !== 'welcome' && !params.has('tour');
  const onHomePath = /^\/institution\/?$/.test(pathname);
  const onRoster = /^\/institution\/students\/?$/.test(pathname);
  const newInstitution = (onHomePath && state === 'new') || (onRoster && state === 'empty');

  return useMemo(() => {
    const status = VERIFY_STATUSES.includes(rawVerify) ? rawVerify : 'approved';
    const approved = status === 'approved';
    const locked = !approved || newInstitution;
    return {
      admin: ADMIN,
      institution: INSTITUTION,
      head: HEAD,
      verify: { ...VERIFICATION, status, approved, label: VERIFICATION.statusLabel[status] },
      readiness: { pct: locked ? 0 : clampPercent(onHome ? READINESS.homePct : READINESS.pct) },
      stats: locked ? STATS_EMPTY : STATS,
      counts: COUNTS,
      badges: BADGES,
    };
  }, [rawVerify, newInstitution, onHome]);
};
