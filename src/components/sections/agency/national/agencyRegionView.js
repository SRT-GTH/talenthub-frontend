import { buildDistrictView, buildRegionView } from '../../publicData/regions/regionsView.js';
import { formatCount } from '../../publicData/publicDataFormat.js';

/*
 * agencyRegionView.js — the agency view-model of a region / district page (Figma 11.4.2b district, 11.4.2k region, 11.4.2m low-data).
 * It wraps Theme 8's buildRegionView / buildDistrictView (same template) and re-points every link at /agency, then replaces what the
 * Theme 8 builders take from sample constants with the live record from GET /api/agency/regions/... (backend agency.service):
 * the "data as of" stamp, the national assessment average, the national education split, the placements sentence, the district
 * table aside (districts under 5 talents are not listed) and the query-builder card. Pure functions, no React.
 */

const rebase = (to) =>
  typeof to === 'string'
    ? to.replace('/data/overview', '/agency/national').replace('/data/regions', '/agency/regions')
    : to;

const segments = (talents, sharesList) => {
  const [pre, mid, post] = (sharesList || [0, 0, 0]).map((p) => Math.round((talents * p) / 100));
  return [
    { key: 'pre', label: 'Pre-tertiary', count: pre, tone: 'dark' },
    { key: 'in', label: 'In-tertiary', count: mid, tone: 'mid' },
    { key: 'post', label: 'Post-tertiary', count: post, tone: 'light' },
  ];
};

export const buildAgencyView = (region, district) => {
  const rec = district || region;
  const v = district ? buildDistrictView(district) : buildRegionView(region);
  const districtTo = v.map.districtTo;
  const asOf = rec.asOf?.label?.replace(/^Data as of /, '') ?? v.dataAsOf;
  const hidden = region?.districtsHidden;
  const talentsLine = district
    ? `District in ${district.regionName}. Counts under 5 are hidden.`
    : `Region drill-down · ${formatCount(region.talents)} talents across ${region.districtsTotal} districts. Pick a district on the map or compare regions.`;
  const kpis = v.kpis.map((k) => {
    if (k.eyebrow === 'Placements made') {
      return {
        ...k,
        sub: district
          ? `${rec.placementsSharePct}% of the region’s placements.`
          : `#${rec.ranks.placements} nationally · ${rec.placementsSharePct}% of all placements. Accepted offers through GTH.`,
      };
    }
    if (k.eyebrow === 'Assessment completion' && !district) {
      return {
        ...k,
        sub: `#${rec.ranks.assessment} nationally · national average ${rec.nationalAssessmentPct}%.`,
      };
    }
    return k;
  });
  return {
    ...v,
    dataAsOf: asOf,
    to: rebase(v.to),
    crumbs: v.crumbs.map((c) => ({ ...c, to: rebase(c.to) })),
    heroSubtitle: talentsLine,
    hero: { ...v.hero, seriesLabel: `Talents in ${v.name} over the last 12 weeks` },
    kpis,
    map: { ...v.map, geoBounds: rec.geoBounds || null, districtTo: (id) => rebase(districtTo(id)) },
    table: {
      ...v.table,
      aside: district
        ? v.table.aside
        : `${region.districts.length} of ${region.districtsTotal} districts listed${hidden ? ` · ${hidden} talents in smaller districts hidden` : ''}`,
      rows: v.table.rows.map((r) => ({ ...r, to: rebase(r.to) })),
      emptyText: district ? 'No sub-district data yet.' : 'No district has 5 or more talents yet.',
    },
    education: district
      ? v.education
      : { ...v.education, compareSegments: segments(1000, region.nationalEducation) },
    queryCta: {
      title: `Query ${v.name}`,
      body: `Build a query for this ${district ? 'district' : 'region'}. Results under 5 stay hidden and every export is logged.`,
      to: `/agency/queries?region=${district ? district.regionId : region.id}`,
    },
  };
};
