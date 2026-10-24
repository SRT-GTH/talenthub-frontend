import { REGIONS } from '../../regionsList.js';

/*
 * uiData.js — API-shaped mock data of the shared Theme 8 UI primitives (sample content only: every figure is sample data).
 * One marked block per concern; later work packages may import FILTER_DEFINITIONS (the five overview filters) and the helpers below.
 */

/* ===== BLOCK 1 · filter definitions =====================================================================================
 * The five overview filters (Figma filter bar 8487:345985, mobile sheet 8515:498). `key` is the URL query key of publicDataState.js
 * (region= edu= interest= age= gender=); option `id` is the URL value; absent = all.
 *   label       desktop chip label ("Education level"), shortLabel = mobile chip label ("Education")
 *   allLabel    ⚠️ ASSUMPTION: Figma draws no open menu; the "clear this filter" row reads "All <plural>" (not drawn copy, kept minimal)
 *   sheet       false = the Figma bottom sheet draws no group for it (Gender is missing from 8515:498; kept as drawn)
 *   options[].sheetLabel  the shorter label the sheet draws ("Business", "Health", "Creative")
 */
export const FILTER_DEFINITIONS = [
  {
    key: 'region',
    label: 'Region',
    shortLabel: 'Region',
    allLabel: 'All regions',
    sheet: true,
    sheetVisible: 4,
    /* Figma 8515:498 draws the region pills as Greater Accra · Ashanti · Volta · Northern (+12 more) */
    sheetFirst: ['greater-accra', 'ashanti', 'volta', 'northern'],
    options: REGIONS.map((r) => ({ id: r.id, label: r.name })),
  },
  {
    key: 'edu',
    label: 'Education level',
    shortLabel: 'Education',
    allLabel: 'All levels',
    sheet: true,
    sheetVisible: 3,
    options: [
      { id: 'pre-tertiary', label: 'Pre-tertiary' },
      { id: 'in-tertiary', label: 'In-tertiary' },
      { id: 'post-tertiary', label: 'Post-tertiary' },
    ],
  },
  {
    key: 'interest',
    label: 'Interest',
    shortLabel: 'Interest',
    allLabel: 'All interests',
    sheet: true,
    sheetVisible: 4,
    options: [
      { id: 'technology', label: 'Technology' },
      { id: 'business-finance', label: 'Business & Finance', sheetLabel: 'Business' },
      { id: 'health-medical', label: 'Health & Medical', sheetLabel: 'Health' },
      { id: 'creative-media', label: 'Creative & Media', sheetLabel: 'Creative' },
      { id: 'education-training', label: 'Education & Training' },
      { id: 'agriculture-agribusiness', label: 'Agriculture & Agribusiness' },
      { id: 'engineering-construction', label: 'Engineering & Construction' },
      { id: 'hospitality-tourism', label: 'Hospitality & Tourism' },
      { id: 'entrepreneurship', label: 'Entrepreneurship' },
      { id: 'public-service-policy', label: 'Public Service & Policy' },
    ],
  },
  {
    key: 'age',
    label: 'Age range',
    shortLabel: 'Age',
    allLabel: 'All ages',
    sheet: true,
    sheetVisible: 4,
    options: [
      { id: '14-17', label: '14–17' },
      { id: '18-24', label: '18–24' },
      { id: '25-29', label: '25–29' },
      { id: '30-35', label: '30–35' },
    ],
  },
  {
    key: 'gender',
    label: 'Gender',
    shortLabel: 'Gender',
    allLabel: 'All genders',
    sheet: false,
    sheetVisible: 3,
    options: [
      { id: 'female', label: 'Female' },
      { id: 'male', label: 'Male' },
      { id: 'not-shared', label: 'Not shared' },
    ],
  },
];

/** The label of an option id inside one filter ("ashanti" -> "Ashanti"), or null. */
export const filterOptionLabel = (key, id) =>
  FILTER_DEFINITIONS.find((d) => d.key === key)?.options.find((o) => o.id === id)?.label ?? null;

/* ===== BLOCK 2 · hero sparkline sample ===================================================================================
 * 22 points read from the Figma sparkline vector (8485:37): registrations over the last 90 days, oldest first.
 */
export const SAMPLE_SPARKLINE = [
  6, 8, 7, 11, 10, 13, 12, 16, 15, 19, 18, 21, 24, 22, 26, 29, 28, 32, 35, 34, 39, 42,
];
