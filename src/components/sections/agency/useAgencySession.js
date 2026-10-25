import { useMemo } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { MOU_STATUSES } from './agencyState.js';
import { quotaPercent } from './agencyFormat.js';
import {
  AGENCY,
  ANALYST,
  BADGES,
  MOU,
  MOU_LIMITS,
  QUOTA,
  STATS,
  STATS_PENDING,
} from './data/agencyCoreData.js';

/*
 * useAgencySession — the mock "signed-in" agency session (⚠️ ASSUMPTION: no real auth).
 * ?mou=none|pending|needs-info|not-approved|approved overrides the MoU status (default approved) and ?quota=<0-100> the
 * query-quota percentage, so every gated frame renders inside the real chrome.
 * Returns { analyst, agency, mou: {status, approved, label, reference, categories, signed, expires},
 *           quota: {used, limit, pct, resets, nearlyUsed}, limits, stats: {regions, requests, programmes}, badges }.
 */
// the data-request frames (11.4.3c-g) draw the persona card's status line and a 0 % quota per request state
const REQUEST_STATUS_LINE = {
  pending: 'Request in review',
  rejected: 'Request not approved',
  ended: 'Access ended',
  'needs-detail': 'Request · action needed',
};

export const useAgencySession = () => {
  const [params] = useSearchParams();
  const { pathname } = useLocation();
  const rawMou = params.get('mou');
  const rawQuota = params.get('quota');
  // the first-login frames (11.4.0b and the welcome / tour overlays on top of it) draw quota 0 % and stats 16 / 0 / 0
  const requestState = /\/data-requests\/(?!new)[^/]+/.test(pathname) ? params.get('state') : null;
  const requestLine = REQUEST_STATUS_LINE[requestState] ?? null;
  const firstLogin =
    params.get('state') === 'first-login' ||
    params.get('modal') === 'welcome' ||
    params.has('tour');

  return useMemo(() => {
    const status = MOU_STATUSES.includes(rawMou) ? rawMou : 'approved';
    const approved = status === 'approved';
    const override = rawQuota !== null && rawQuota !== '' ? Number(rawQuota) : NaN;
    const defaultPct = firstLogin ? 0 : quotaPercent(QUOTA.used, QUOTA.limit);
    let pct = 0;
    if (approved && !requestLine) {
      pct = Number.isFinite(override)
        ? Math.max(0, Math.min(100, Math.round(override)))
        : defaultPct;
    }
    const used =
      pct === defaultPct && !firstLogin ? QUOTA.used : Math.round((pct / 100) * QUOTA.limit);
    return {
      analyst: ANALYST,
      agency: AGENCY,
      mou: { ...MOU, status, approved, label: requestLine ?? MOU.statusLabel[status] },
      quota: { ...QUOTA, used: approved && !requestLine ? used : 0, pct, nearlyUsed: pct >= 90 },
      limits: MOU_LIMITS,
      stats:
        status === 'pending' || status === 'none'
          ? STATS_PENDING
          : firstLogin
            ? { ...STATS, requests: 0, programmes: 0 }
            : STATS,
      badges: BADGES,
    };
  }, [rawMou, rawQuota, firstLogin, requestLine]);
};
