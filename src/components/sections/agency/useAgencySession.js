import { useMemo } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { MOU_STATUSES } from './agencyState.js';
import { quotaPercent } from './agencyFormat.js';
import { useAgencySessionState } from './agencySessionStore.js';

/*
 * useAgencySession: the signed-in agency (GET /api/agency/me via AgencySessionContext) in the shape the pages use:
 *   { analyst, agency, mou: {status, approved, label, reference, categories, signed, expires},
 *     quota: {used, limit, pct, resets, nearlyUsed}, limits, stats: {regions, requests, programmes}, badges }
 * In development only, ?mou=none|pending|needs-info|not-approved|approved and ?quota=<0-100> still force a gate so every
 * designed frame can be checked inside the real chrome.
 */

const STATUS_LABEL = {
  approved: (n) => `MoU active · ${n} data ${n === 1 ? 'category' : 'categories'}`,
  pending: () => 'MoU in review',
  'needs-info': () => 'MoU · action needed',
  'not-approved': () => 'MoU not approved',
  expired: () => 'MoU expired',
  none: () => 'No MoU on file',
};
const REQUEST_STATUS_LINE = {
  pending: 'Request in review',
  rejected: 'Request not approved',
  ended: 'Access ended',
  'needs-detail': 'Request · action needed',
};
const ymd = (d) => (d ? new Date(d).toISOString().slice(0, 10) : '');
const slug = (s) =>
  String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
const resetsLabel = (d) =>
  d
    ? new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', timeZone: 'UTC' }).format(
        new Date(d)
      )
    : '';

export const useAgencySession = () => {
  const ctx = useAgencySessionState();
  const me = ctx?.me;
  const [params] = useSearchParams();
  const { pathname } = useLocation();
  const dev = import.meta.env.DEV;
  const rawMou = dev ? params.get('mou') : null;
  const rawQuota = dev ? params.get('quota') : null;
  const requestState = /\/data-requests\/(?!new)[^/]+/.test(pathname) ? params.get('state') : null;
  const requestLine = REQUEST_STATUS_LINE[requestState] ?? null;

  return useMemo(() => {
    if (!me) return null;
    const realStatus = me.mou?.status === 'expired' ? 'not-approved' : me.mou?.status || 'none';
    const status = MOU_STATUSES.includes(rawMou) ? rawMou : realStatus;
    const approved = status === 'approved';
    const categories = (me.mou?.categories || []).length;
    const limits = me.limits || {};
    const usage = me.usage || {};
    const queryLimit = limits.queriesPerMonth ?? 0;
    const realPct = quotaPercent(usage.queries || 0, queryLimit || 1);
    const override = rawQuota !== null && rawQuota !== '' ? Number(rawQuota) : NaN;
    const pct =
      approved && !requestLine
        ? Number.isFinite(override)
          ? Math.max(0, Math.min(100, Math.round(override)))
          : realPct
        : 0;
    const used = Number.isFinite(override)
      ? Math.round((pct / 100) * queryLimit)
      : usage.queries || 0;
    const agencySlug = slug(me.agency?.short || me.agency?.name);
    return {
      analyst: me.analyst,
      agency: {
        id: me.agency?.id,
        name: me.agency?.name,
        short: me.agency?.short,
        publicUrl: `gth.com/agencies/${agencySlug}`,
        publicPath: `/agencies/${agencySlug}`,
      },
      mou: {
        status,
        approved,
        label:
          requestLine ??
          (me.mou?.status === 'expired' && !rawMou
            ? STATUS_LABEL.expired()
            : (STATUS_LABEL[status] || STATUS_LABEL.none)(categories)),
        reference: me.mou?.reference || '',
        categories,
        categoryNames: me.mou?.categories || [],
        signed: ymd(me.mou?.signedAt),
        expires: ymd(me.mou?.expiresAt),
      },
      quota: {
        used: approved && !requestLine ? used : 0,
        limit: queryLimit,
        pct,
        resets: resetsLabel(usage.monthResetsAt),
        nearlyUsed: pct >= 90,
      },
      limits: {
        queries: {
          label: 'Queries run',
          used: usage.queries || 0,
          limit: limits.queriesPerMonth ?? 0,
          period: 'month',
        },
        csvExports: {
          label: 'CSV exports',
          used: usage.csvExports || 0,
          limit: limits.csvExportsPerMonth ?? 0,
          period: 'month',
        },
        dataRequests: {
          label: 'Data requests',
          used: usage.dataRequests || 0,
          limit: limits.dataRequestsPerQuarter ?? 0,
          period: 'quarter',
        },
      },
      stats: { regions: me.stats?.regions ?? 0, requests: usage.dataRequests || 0, programmes: 0 },
      badges: { notifications: 0, messages: 0 },
      mustChangePassword: Boolean(me.mustChangePassword),
    };
  }, [me, rawMou, rawQuota, requestLine]);
};
