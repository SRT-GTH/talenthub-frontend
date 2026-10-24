import { DATA_BASE } from '../../publicDataNav.js';
import {
  NATIONAL_PARTNERS,
  NATIONAL_PLACEMENTS,
  NATIONAL_TALENTS,
  QUARTER_CHANGE_PCT,
} from '../../overview/data/overviewData.js';
import { REGIONS } from '../../regionsList.js';
import { formatChange } from '../../publicDataFormat.js';
import regionsPhoto from '../../../../../assets/public-data/landing/explore-regions-notes-on-map.webp';
import showcasePhoto from '../../../../../assets/public-data/landing/explore-talent-showcase-portrait.webp';
import outcomesPhoto from '../../../../../assets/public-data/landing/explore-outcomes-team-laptop.webp';
import directoryPhoto from '../../../../../assets/public-data/landing/explore-directory-portrait-red-light.webp';

/*
 * landingData.js — API-shaped mock data of the landing page (Figma 8.1.1a-c, mobile 8.1.1a-m). SAMPLE CONTENT ONLY.
 * The headline numbers come from the SAME constants as the national overview (overview/data/overviewData.js), so the two pages never disagree.
 * Future endpoint: GET /public/summary → { talents, placements, partners, regions, quarterChangePct }.
 */

/* ===== BLOCK 1 · the stats row ======================================================================================== */

export const getLandingSummary = () => ({
  talents: NATIONAL_TALENTS,
  placements: NATIONAL_PLACEMENTS,
  partners: NATIONAL_PARTNERS,
  regions: REGIONS.length,
  quarterChangePct: QUARTER_CHANGE_PCT,
});

/** The four stat cards: desktop draws the first three (8514:216…), the phone draws all four in a 2x2 grid (8515:2703). */
export const buildStatCards = (summary) => [
  {
    key: 'talents',
    eyebrow: 'Talents registered',
    eyebrowShort: 'Talents',
    count: summary.talents,
    sub: `Across all ${summary.regions} regions · ${formatChange(summary.quarterChangePct)} this quarter`,
    subShort: `${summary.regions} regions`,
  },
  {
    key: 'placements',
    eyebrow: 'Placements made',
    eyebrowShort: 'Placements',
    count: summary.placements,
    sub: 'Jobs, internships and training through GTH',
    subShort: 'Last 12 months',
  },
  {
    key: 'partners',
    eyebrow: 'Active partners',
    eyebrowShort: 'Partners',
    count: summary.partners,
    sub: 'Schools, universities, NGOs and agencies',
    subShort: 'Active',
  },
  {
    key: 'regions',
    eyebrow: 'Regions',
    value: String(summary.regions),
    sub: 'All covered',
    phoneOnly: true,
  },
];

/* ===== BLOCK 2 · "Explore the data" cards ============================================================================= */

export const EXPLORE_CARDS = [
  {
    key: 'regions',
    title: 'Regions',
    text: '16 regions and their districts, side by side.',
    cta: 'Explore regions →',
    to: `${DATA_BASE}/regions`,
    image: regionsPhoto,
  },
  {
    key: 'showcase',
    title: 'Talent showcase',
    text: 'Five real profiles, shared with consent.',
    cta: 'Meet the talents →',
    to: `${DATA_BASE}/showcase`,
    image: showcasePhoto,
  },
  {
    key: 'outcomes',
    title: 'Outcomes',
    text: 'Placements, scholarships and proven skills.',
    cta: 'See outcomes →',
    to: `${DATA_BASE}/outcomes`,
    image: outcomesPhoto,
  },
  {
    key: 'directory',
    title: 'Directory',
    text: 'Partners and open opportunities.',
    cta: 'Browse directory →',
    to: `${DATA_BASE}/partners`,
    image: directoryPhoto,
  },
];

/* ===== BLOCK 3 · trust strip ========================================================================================== */

export const TRUST_ITEMS = [
  { key: 'no-personal-data', icon: 'shield', text: 'No personal data on public pages' },
  { key: 'under-five', icon: 'eyeoff', text: 'Counts under 5 hidden as “<5”' },
  { key: 'refresh', icon: 'refresh', text: 'Live data, refreshed every 5 minutes' },
  { key: 'methodology', icon: 'info', text: 'Open methodology', to: `${DATA_BASE}/methodology` },
];

/* ===== BLOCK 4 · returning visitor ==================================================================================== */

/** The section the "Continue where you left off" chip points at when ?state=returning forces the frame (Figma 8.1.1b: "Partners"). */
export const RETURNING_SAMPLE = { label: 'Partners', to: `${DATA_BASE}/partners` };

/** Where each section id of the sidebar leads and how the chip names it. */
export const SECTION_TARGETS = {
  overview: { label: 'National overview', to: `${DATA_BASE}/overview` },
  regions: { label: 'Regions', to: `${DATA_BASE}/regions` },
  showcase: { label: 'Talent showcase', to: `${DATA_BASE}/showcase` },
  outcomes: { label: 'Outcomes', to: `${DATA_BASE}/outcomes` },
  directory: { label: 'Partners', to: `${DATA_BASE}/partners` },
};
