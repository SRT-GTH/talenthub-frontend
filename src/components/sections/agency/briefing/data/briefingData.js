/*
 * briefingData.js — MOCK data of the briefing-pack dialogs (Figma 11.4.4a–e, h; frames 8605:404019 … 8605:407727). Shaped like the future
 * POST /agency/briefing-packs (job) + GET /agency/briefing-packs/:id (status) responses. Texts verbatim from the frames.
 */

/* ---- BLOCK 1 · download options (11.4.4a) ---- */
export const BRIEFING_NOTE_MAX = 200;
export const BRIEFING_DEFAULT_NOTE =
  'Prepared for the Hon. Minister for Youth Development · Cabinet brief · 21 Oct 2026';
export const BRIEFING_REGIONAL_MAX = 3;
export const BRIEFING_PAGES_PER_REGION = 4;

export const BRIEFING_OPTIONS = [
  { id: 'view', label: 'This view + MoU slices', detail: 'National briefing · 6 pages', pages: 6 },
  {
    id: 'full',
    label: 'Full briefing',
    detail: 'Overview, districts, 24-month trends and methodology · 12 pages',
    pages: 12,
  },
  {
    id: 'regional',
    label: 'Regional pack',
    detail: 'Choose up to 3 regions · district tables · 4 pages each',
    pages: null,
  },
];

/* ---- BLOCK 2 · mock build job (11.4.4b, 11.4.4h) ---- */
export const BRIEFING_STEPS = [
  'Collecting live figures',
  'Laying out pages',
  'Drawing district tables',
  'Adding methodology and data-protection note',
];
// ⚠️ Figma draws "Step 3 of 5" over a four-row list; the label is kept as drawn (step 3 of 5, "Drawing district tables").
export const BRIEFING_STEP_TOTAL = 5;
export const BRIEFING_BUILD_MS = 7000;
export const BRIEFING_RESUME_PROGRESS = 0.55;
export const BRIEFING_ERROR_CODE = 'PDF-504';

export const requestBriefingBuild = ({ shouldFail = false, option, regions, note }) =>
  new Promise((resolve, reject) => {
    window.setTimeout(() => {
      if (shouldFail) reject(new Error(BRIEFING_ERROR_CODE));
      else resolve({ id: 'bp-2026-10-21', option, regions, note, status: 'ready' });
    }, BRIEFING_BUILD_MS);
  });

/* ---- BLOCK 3 · share with a colleague (11.4.4c / d) ---- */
export const BRIEFING_SHARE = {
  url: 'gth.com/agency/nya/national?view=mou-412',
  message: 'For the Thursday cabinet brief: district readiness for YouthStart 2027.',
  messageMax: 280,
  card: {
    brand: 'Ghana Talent Hub',
    title: 'NYA · National data (MoU view)',
    headline: '219,428 talents',
    sub: 'Aggregates · 16 regions · 261 districts · updated 18 Oct 2026',
  },
  channels: [
    { id: 'copy', label: 'Copy link' },
    { id: 'email', label: 'Email' },
    { id: 'email-2', label: 'Email' },
    { id: 'teams', label: 'Teams' },
    { id: 'image', label: 'Copy as image' },
  ],
  footer: 'Filters included: none · MoU view · access logged',
  toast: 'Link copied. Only NYA staff with GTH access can open it.',
};

/* ---- BLOCK 4 · monthly digest (11.4.4e) ---- */
export const BRIEFING_DIGEST = {
  email: 'efua.owusu@nya.gov.gh',
  name: 'Efua Owusu',
  roles: ['Government agency · NYA'],
  regions: ['National + all 16 regions', 'National only', 'Greater Accra', 'Ashanti', 'Northern'],
  analystsLabel:
    'Send the digest to my analysts too (3 people). Each send is logged under the MoU.',
};

export const subscribeToBriefingDigest = (payload) =>
  new Promise((resolve) => {
    window.setTimeout(() => resolve({ ok: true, payload }), 600);
  });
