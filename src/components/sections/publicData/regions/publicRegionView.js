import { buildRegionView } from './regionsView.js';

/*
 * publicRegionView.js — the view-model of /data/regions/:regionId from the live record (GET /api/public-data/regions/:id).
 * It wraps buildRegionView (the same template) and replaces what that builder takes from sample constants: the "data as of"
 * stamp, the national assessment average and the national education split. District figures are not public (they stay
 * with partner agencies), so the view has no district map, table or phone "Top districts" list. Pure function, no React.
 */

const segments = (talents, sharesList) => {
  const [pre, mid, post] = (sharesList || [0, 0, 0]).map((p) => Math.round((talents * p) / 100));
  return [
    { key: 'pre', label: 'Pre-tertiary', count: pre, tone: 'dark' },
    { key: 'in', label: 'In-tertiary', count: mid, tone: 'mid' },
    { key: 'post', label: 'Post-tertiary', count: post, tone: 'light' },
  ];
};

export const buildPublicRegionView = (region) => {
  const v = buildRegionView({ ...region, districts: [] });
  const asOf = region.asOf?.label?.replace(/^Data as of /, '') ?? v.dataAsOf;
  const kpis = v.kpis.map((k) =>
    k.eyebrow === 'Assessment completion'
      ? {
          ...k,
          sub: `#${region.ranks.assessment} nationally · national average ${region.nationalAssessmentPct}%.`,
        }
      : k.eyebrow === 'Placements made'
        ? {
            ...k,
            sub: `#${region.ranks.placements} nationally · ${region.placementsSharePct}% of all placements. Accepted offers through GTH.`,
          }
        : k
  );
  return {
    ...v,
    dataAsOf: asOf,
    hero: { ...v.hero, seriesLabel: `Talents in ${v.name} over the last 12 weeks` },
    kpis,
    map: null,
    table: null,
    education: { ...v.education, compareSegments: segments(1000, region.nationalEducation) },
    mobile: { ...v.mobile, rows: null, viewAll: null },
  };
};
