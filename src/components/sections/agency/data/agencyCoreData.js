/*
 * agencyCoreData.js — MOCK core data of the Theme 11 agency portal (Figma 11.4.0a "Agency home"; shaped like the future
 * /agency/me + /agency/mou + /agency/quota API responses). ⚠️ ASSUMPTION: no real auth, this "signed-in" session is a mock.
 * Packages read it through useAgencySession() (../useAgencySession.js), so the MoU gate stays overridable with ?mou=.
 */

/* ---- agency + analyst ---- */
export const AGENCY = {
  id: 'national-youth-authority',
  name: 'National Youth Authority',
  short: 'NYA',
  publicUrl: 'gth.com/agencies/national-youth-authority',
  publicPath: '/agencies/national-youth-authority',
};

export const ANALYST = {
  id: 'efua-owusu',
  name: 'Efua Owusu',
  firstName: 'Efua',
  shortName: 'Efua O.',
  monogram: 'EO',
  role: 'Admin',
  title: 'Director, Research & Data',
};

/* ---- MoU (status is overridable with ?mou=) ---- */
export const MOU = {
  reference: 'GTH-MOU-2026-004',
  categories: 3,
  signed: '2026-09-02',
  expires: '2027-10-31',
  // Persona-card status line per gate, verbatim from frames 11.4.0a / 11.4.1c / c2 / c3.
  statusLabel: {
    approved: 'MoU active · 3 data categories',
    pending: 'MoU in review',
    'needs-info': 'MoU · action needed',
    'not-approved': 'MoU not approved',
    // ⚠️ ASSUMPTION: Figma draws no persona card before an MoU is uploaded.
    none: 'No MoU on file',
  },
};

/* ---- quota (Figma 11.4.0a "Query quota this month 64%") ---- */
export const QUOTA = {
  used: 142,
  limit: 220,
  pct: 64,
  resets: '1 November',
};

/* ---- MoU limits (Figma 11.4.0a "Your MoU this month") ---- */
export const MOU_LIMITS = {
  queries: { label: 'Queries run', used: 142, limit: 220, period: 'month' },
  csvExports: { label: 'CSV exports', used: 18, limit: 40, period: 'month' },
  dataRequests: { label: 'Data requests', used: 3, limit: 6, period: 'quarter' },
};

/* ---- persona-card stats (Figma 16 Regions · 3 Requests · 2 Programmes) ---- */
export const STATS = { regions: 16, requests: 3, programmes: 2 };
// Drawn as zeros while the MoU is in review (11.4.1c); the other gates keep 16 / 3 / 2 in their frames (kept as drawn).
export const STATS_PENDING = { regions: 0, requests: 0, programmes: 0 };

/* ---- top-bar badges (Figma: bell 5, messages 5) ---- */
export const BADGES = { notifications: 5, messages: 5 };
