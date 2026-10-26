/*
 * districtsData.js — constants of the agency Districts list (Figma 11.4.2s, frame 9394:19326). The data is live:
 *   GET  /agency/districts?region=&sort=&q=&page=&pageSize=  ->  { scope, summary, items, total, page, pages, pageSize, hidden, from, to,
 *                                                                regions: { total, regions[] }, regionTotals[], asOf }
 *   POST /agency/districts/export                           ->  { fileName, csv, rows }  (every matching row; 1 CSV export of the MoU quota)
 * Districts under 5 talents are never rows (only their number is sent); placements under 5 come back as 0 + placementsSuppressed.
 */

export const PAGE_SIZE = 12;

export const SORTS = [
  { id: 'talents', label: 'Most talents' },
  { id: 'growth', label: 'Fastest growing' },
  { id: 'assessment', label: 'Best assessment' },
  { id: 'placements', label: 'Most placements' },
  { id: 'name', label: 'Name A–Z' },
];
export const DEFAULT_SORT = 'talents';

export const VIEWS = [
  { id: 'table', label: 'Table' },
  { id: 'map', label: 'Map' },
];

// The ten region chips Figma draws, in its order. The other six regions are reachable from the "All regions" select.
export const CHIP_REGION_IDS = [
  'greater-accra',
  'ashanti',
  'northern',
  'eastern',
  'central',
  'western',
  'volta',
  'bono',
  'upper-east',
  'upper-west',
];
