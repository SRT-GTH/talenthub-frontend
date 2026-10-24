/*
 * methodologyData.js — the copy of the methodology page (Figma 8.7.1a 8499:9, phone 8508:503, tablet 8516:356171), verbatim from the frames.
 * Shaped like the future `GET /public/methodology` (a versioned CMS document): { version, reviewed, sections[], definitions[] }.
 * The phone frame uses shorter sentences for three sections (`short`), kept next to the long ones.
 */

// BLOCK document meta
export const METHODOLOGY_META = {
  version: '1.3',
  reviewed: '1 October 2026',
  title: 'How we count',
  intro:
    'Everything on the public Ghana Talent Hub pages is computed live from the GTH database, using the same rules every time. This page explains those rules in plain language.',
  introShort: 'Plain-language rules behind every number on GTH.',
  lastReviewed: 'Last reviewed 1 October 2026 · Version 1.3',
};
// END BLOCK document meta

// BLOCK table of contents (Figma 8499:76; "Changes to this page" anchors on the "Last reviewed … Version" line, the frame draws no section for it)
export const METHODOLOGY_TOC = [
  { id: 'sources', label: 'Where the data comes from' },
  { id: 'count', label: 'How we count' },
  { id: 'privacy', label: 'Privacy protections' },
  { id: 'fresh', label: 'How fresh the data is' },
  { id: 'definitions', label: 'Definitions' },
  { id: 'limits', label: 'Known limitations' },
  { id: 'changes', label: 'Changes to this page' },
];
// END BLOCK table of contents

// BLOCK sections
export const METHODOLOGY_SECTIONS = {
  sources: {
    title: 'Where the data comes from',
    body: 'Talents create their own profiles on GTH. Schools, universities and verified partners add records such as enrolments, certificates and placements. We never buy or scrape data.',
    short:
      'Talents create their own profiles. Schools and partners add enrolments, certificates and placements. We never buy or scrape data.',
  },
  count: {
    title: 'How we count',
    body: 'A “talent” is a person with a confirmed account who has finished onboarding. Duplicate accounts are merged using Ghana Card verification. Regions follow the 16 regions created in 2019.',
  },
  privacy: {
    title: 'Privacy protections',
    short:
      'No names, photos or contacts. Numbers under 5 show as “<5” and small groups hide their breakdowns.',
    points: [
      {
        title: 'No personal data',
        body: 'Public pages never show names, photos, phone numbers, emails or Ghana Card numbers. Showcase profiles are the only exception, and only with written consent.',
      },
      {
        title: 'Small groups are hidden',
        body: 'Any number below 5 is shown as “<5”, and breakdowns are hidden if a filtered group is that small, so no one can be singled out.',
      },
      {
        title: 'No bulk downloads',
        body: 'Exports are summaries only. Requests are rate-limited to stop scraping.',
      },
    ],
  },
  fresh: {
    title: 'How fresh the data is',
    body: 'Headline numbers refresh every 5 minutes. Charts and breakdowns refresh hourly. Every page shows when it was last updated next to the green “Live” marker.',
    short: 'Headline numbers refresh every 5 minutes; charts every hour.',
  },
  definitions: { title: 'Definitions' },
  limits: {
    title: 'Known limitations',
    body: 'Interests and some education details are self-reported. Rural areas with weaker internet are under-represented, especially in Upper West and Oti. District boundaries shown on maps are approximate until official boundary files are integrated.',
  },
};
// END BLOCK sections

// BLOCK definitions
export const METHODOLOGY_DEFINITIONS = [
  {
    id: 'placement',
    term: 'Placement',
    body: 'A talent who starts a job, internship, apprenticeship or training programme found through GTH, confirmed by the partner.',
  },
  {
    id: 'scholarship-surfaced',
    term: 'Scholarship surfaced',
    body: 'Funding a talent was matched to and applied for through GTH, counted in Ghana cedis at the advertised value.',
  },
  {
    id: 'validated-skill',
    term: 'Validated skill',
    body: 'A skill backed by an assessment score, a passed Skills Lab game, or a verified certificate.',
  },
  {
    id: 'active-partner',
    term: 'Active partner',
    body: 'An organisation with a signed agreement that used GTH in the last 90 days.',
  },
];
// END BLOCK definitions

// BLOCK contact card
export const METHODOLOGY_QUESTIONS = {
  title: 'Questions about the numbers?',
  note: 'We reply within 3 working days.',
  action: 'Ask the data team',
};
// END BLOCK contact card

// BLOCK tooltip frames (8.7.2a / 8.7.2b component frames, 900x576)
export const TIP_FRAMES = {
  freshness: {
    title: '8.7.2a · Freshness tooltip',
    hint: 'Hover or focus the Live pill (top bar) to see exact refresh times. On touch, tap opens it; tap outside closes.',
    otherStates: 'Other states: stale (refresh delayed > 1 h) and offline (cached copy).',
    pillLabel: 'Updated 2 min ago · Live',
    stale: { label: 'Updated 3 h ago · Refreshing', dot: '#c98500' },
    offline: { label: 'Offline · showing cached data from 09:12', dot: '#9a9a96' },
  },
  suppression: {
    title: '8.7.2b · Suppression explanation popover',
    hint: 'Any “<5” value is a button. Hover, focus or tap explains why the number is hidden and links to the privacy rules.',
    rowLabel: 'Aviation',
  },
};
// END BLOCK tooltip frames
