import { buildDistrictView, buildRegionView } from '../../publicData/regions/regionsView.js';

/*
 * agencyRegionView.js — the agency view-model of a region / district page (Figma 11.4.2b district, 11.4.2k region, 11.4.2m low-data).
 * It wraps Theme 8's buildRegionView / buildDistrictView (same numbers, same template) and re-points every link at /agency, then overrides the copy the
 * agency frames change: hero title + subtitle, the placements tile sentence, the query-builder card. Pure functions, no React.
 */

const PLACEMENTS_SUB =
  '23.4% success rate · ▲ +2.1 pts. Talents matched into jobs, internships and training.';

const rebase = (to) =>
  typeof to === 'string'
    ? to.replace('/data/overview', '/agency/national').replace('/data/regions', '/agency/regions')
    : to;

export const buildAgencyView = (region, district) => {
  const v = district ? buildDistrictView(district) : buildRegionView(region);
  const districtTo = v.map.districtTo;
  const talentsLine = district
    ? 'District in ' + district.regionName + '. Counts under 5 are hidden.'
    : `Region drill-down · ${new Intl.NumberFormat('en-US').format(region.talents)} talents across ${region.districtsTotal} districts. Pick a district on the map or compare regions.`;
  return {
    ...v,
    to: rebase(v.to),
    crumbs: v.crumbs.map((c) => ({ ...c, to: rebase(c.to) })),
    heroSubtitle: talentsLine,
    kpis: v.kpis.map((k) => (k.eyebrow === 'Placements made' ? { ...k, sub: PLACEMENTS_SUB } : k)),
    map: { ...v.map, districtTo: (id) => rebase(districtTo(id)) },
    table: { ...v.table, rows: v.table.rows.map((r) => ({ ...r, to: rebase(r.to) })) },
    queryCta: {
      title: `Query ${v.name}`,
      body: `Build a query for this ${district ? 'district' : 'region'}. Results under 5 stay hidden and every export is logged.`,
      to: `/agency/queries?region=${district ? district.regionId : region.id}`,
    },
  };
};
