/*
 * regionsList.js — Ghana's 16 regions as the Theme 8 screens name them (Figma overview map 8.2.1a, region switcher 8.3.1d, data sheet 8.3.1e).
 * `id` is the URL slug (/data/regions/:regionId). Names are the 16 regions after the 2019 splits; the mock numbers live in the data modules
 * of the work packages (data/<area>Data.js), never here.
 */
export const REGIONS = [
  { id: 'greater-accra', name: 'Greater Accra', short: 'G. Accra' },
  { id: 'ashanti', name: 'Ashanti' },
  { id: 'eastern', name: 'Eastern' },
  { id: 'northern', name: 'Northern' },
  { id: 'western', name: 'Western' },
  { id: 'central', name: 'Central' },
  { id: 'volta', name: 'Volta' },
  { id: 'upper-east', name: 'Upper East' },
  { id: 'upper-west', name: 'Upper West' },
  { id: 'bono', name: 'Bono' },
  { id: 'bono-east', name: 'Bono East' },
  { id: 'ahafo', name: 'Ahafo' },
  { id: 'savannah', name: 'Savannah' },
  { id: 'north-east', name: 'North East' },
  { id: 'oti', name: 'Oti' },
  { id: 'western-north', name: 'Western North' },
];

export const regionById = (id) => REGIONS.find((r) => r.id === id) ?? null;
