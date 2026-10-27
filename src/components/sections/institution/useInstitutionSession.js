import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { VERIFY_STATUSES } from './institutionState.js';
import { clampPercent } from './institutionFormat.js';
import { useInstitutionSessionState } from './institutionSessionStore.js';

/*
 * useInstitutionSession — the signed-in institution session, from GET /api/institution/me (InstitutionSessionContext.jsx).
 * In development only, ?verify=none|under-review|approved|needs-info|not-approved still overrides the accreditation status to look at a gate.
 * Returns { admin, institution, head, verify: {status, approved, label, reference, submitted, reviewStarted, decided, renewalDue, note},
 *           readiness: {pct}, stats: {students, pending, credentials}, counts: {scholarshipsLive}, badges, roster, reload }.
 */

const LABEL = {
  approved: 'Verified institution · GES accredited',
  'under-review': 'Verification in review',
  'needs-info': 'Verification · action needed',
  'not-approved': 'Verification not approved',
  none: 'Not yet verified',
};
const ymd = (d) => (d ? String(d).slice(0, 10) : '');
const EMPTY_INSTITUTION = {
  id: '',
  name: '',
  short: '',
  type: '',
  region: '',
  accreditationNumber: '',
  publicUrl: '',
  publicPath: '',
};
const EMPTY_ADMIN = {
  id: '',
  name: '',
  firstName: '',
  shortName: '',
  monogram: '',
  role: '',
  title: '',
};

export const useInstitutionSession = () => {
  const ctx = useInstitutionSessionState();
  const me = ctx?.me;
  const [params] = useSearchParams();
  const rawVerify = import.meta.env.DEV ? params.get('verify') : null;

  return useMemo(() => {
    const v = me?.verify || {};
    const status = VERIFY_STATUSES.includes(rawVerify) ? rawVerify : v.status || 'none';
    const approved = status === 'approved';
    return {
      admin: { ...EMPTY_ADMIN, ...(me?.admin || {}) },
      institution: { ...EMPTY_INSTITUTION, ...(me?.institution || {}) },
      head: me?.head || { name: '', title: 'Head' },
      verify: {
        status,
        approved,
        label: LABEL[status],
        reference: v.reference || '',
        submitted: ymd(v.submittedAt),
        reviewStarted: ymd(v.reviewStartedAt),
        decided: ymd(v.decidedAt),
        renewalDue: ymd(v.renewalDue),
        note: v.note || '',
      },
      readiness: { pct: approved ? clampPercent(me?.readiness?.pct || 0) : 0 },
      stats: approved
        ? me?.stats || { students: 0, pending: 0, credentials: 0 }
        : { students: 0, pending: 0, credentials: 0 },
      counts: me?.counts || { scholarshipsLive: 0 },
      badges: me?.badges || { notifications: 0, messages: 0 },
      roster: me?.roster || { total: 0, linked: 0, notLinked: 0, consentNeeded: 0 },
      reload: ctx?.reload,
    };
  }, [me, rawVerify, ctx?.reload]);
};
