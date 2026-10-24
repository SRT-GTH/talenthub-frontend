import { formatCount } from '../publicDataFormat.js';
import {
  AGE_BANDS,
  DATA_AS_OF,
  NATIONAL_ASSESSMENT,
  NATIONAL_EDUCATION,
} from './data/regionsData.js';
import { shareSentence } from './regionsFormat.js';

/*
 * regionsView.js — view-models of the region and the district page (Theme 8, Figma 8.3.1a / 8.3.2a). Both pages are the same template ("One template,
 * 16 regions", 8495:347797), so one shape feeds the shared components: copy is assembled from the Figma strings with the entity's values.
 * Pure functions, no React. Every count printed later goes through formatCount() in the components; text assembled here uses it too.
 */

const REGION_BASE = '/data/regions';

const pctCounts = (talents, shares) => shares.map((p) => Math.round((talents * p) / 100));

const segments = (talents, shares) => {
  const [pre, mid, post] = pctCounts(talents, shares);
  return [
    { key: 'pre', label: 'Pre-tertiary', count: pre, tone: 'dark' },
    { key: 'in', label: 'In-tertiary', count: mid, tone: 'mid' },
    { key: 'post', label: 'Post-tertiary', count: post, tone: 'light' },
  ];
};

const ageItems = (talents, shares) =>
  AGE_BANDS.map((label, i) => ({
    key: label,
    label,
    count: Math.round((talents * shares[i]) / 100),
  }));

const CAPABILITIES = ['Technical', 'Creative', 'Analytical', 'Social / caring', 'Still exploring'];

const capabilityRows = (shares) =>
  CAPABILITIES.map((label, i) => ({
    label,
    valueText: `${shares[i]}%`,
    ratio: shares[i] / Math.max(...shares),
  }));

const genderSegments = (talents, [female, male, other]) => ({
  line: `Gender · Female ${female}% · Male ${male}% · Not shared ${other}%`,
  segments: [
    { key: 'f', label: 'Female', count: Math.round((talents * female) / 100), tone: 'green' },
    { key: 'm', label: 'Male', count: Math.round((talents * male) / 100), tone: 'blue' },
    { key: 'o', label: 'Not shared', count: Math.round((talents * other) / 100), tone: 'neutral' },
  ],
});

const partnerTiles = (counts) =>
  ['Schools', 'Universities', 'NGOs', 'Gov. agencies', 'Employers'].map((label, i) => ({
    label,
    count: counts[i],
  }));

/** The view-model of /data/regions/:regionId. */
export const buildRegionView = (r) => ({
  kind: 'region',
  id: r.id,
  name: r.name,
  topTitle: r.name,
  to: `${REGION_BASE}/${r.id}`,
  crumbs: [{ label: 'National', to: '/data/overview' }, { label: r.name }],
  subtitle: `1 of ${r.ofRegions} regions · regional capital ${r.capital} · ${r.districtsTotal} districts`,
  compareLabel: 'Compare with another region',
  dataAsOf: DATA_AS_OF,
  hero: {
    eyebrow: `Talents in ${r.name}`,
    count: r.talents,
    label: `Ranked #${r.rank} of ${r.ofRegions} regions`,
    pct: r.trendPct,
    note: `+${formatCount(r.deltaLast30)} in the last 30 days`,
    noteShort: `Ranked #${r.rank} of ${r.ofRegions}`,
    series: r.series,
    seriesLabel: `Talents in ${r.name} over the last 12 weeks, rising`,
  },
  kpis: [
    {
      eyebrow: 'Share of national total',
      eyebrowShort: 'Share of national',
      value: r.sharePctLabel,
      sub: shareSentence(r.sharePct, r.name),
      subShort: '',
    },
    {
      eyebrow: 'Assessment completion',
      value: `${r.assessmentPct}%`,
      sub: `#${r.ranks.assessment} nationally · national average ${NATIONAL_ASSESSMENT}%.`,
      subShort: `#${r.ranks.assessment} nationally`,
    },
    {
      eyebrow: 'Placements made',
      eyebrowShort: 'Placements',
      count: r.placements,
      sub: `#${r.ranks.placements} nationally · ${r.placementsSharePct}% of all placements.`,
      subShort: `#${r.ranks.placements} nationally`,
    },
  ],
  partnersKpi: { eyebrow: 'Partners active', value: String(r.partners) },
  chipsLabel: `How ${r.name} ranks`,
  chips: [
    { rank: r.ranks.registrations, text: 'for registrations' },
    { rank: r.ranks.assessment, text: 'for assessment completion' },
    { rank: r.ranks.placements, text: 'for placements' },
    { rank: r.ranks.growth, text: 'for 30-day growth' },
  ],
  map: {
    title: `Districts in ${r.name}`,
    aside: 'Bubble size = talents',
    markers: r.districts,
    highlightId: null,
    districtTo: (id) => `${REGION_BASE}/${r.id}/districts/${id}`,
  },
  table: {
    title: 'District breakdown',
    aside: `Top ${Math.min(10, r.districts.length)} of ${r.districtsTotal} districts`,
    firstCol: 'District',
    rows: r.districts.map((d) => ({
      id: d.id,
      rank: d.rank,
      name: d.name,
      talents: d.talents,
      trendPct: d.trendPct,
      to: `${REGION_BASE}/${r.id}/districts/${d.id}`,
    })),
    viewAll: r.districts.length > 10 ? `View all ${r.districts.length} districts` : null,
    emptyText: null,
  },
  education: {
    aside: 'vs national',
    label: r.name,
    segments: segments(r.talents, r.education),
    compareLabel: 'National',
    compareSegments: segments(1000, NATIONAL_EDUCATION),
  },
  age: ageItems(r.talents, r.ageShares),
  ageTotal: undefined,
  capabilities: capabilityRows(r.capabilityShares),
  gender: genderSegments(r.talents, r.genderShares),
  partners: {
    aside: `Organisations active in ${r.name}`,
    tiles: partnerTiles(r.partnerCounts),
  },
  cta: {
    title: `Find talent in ${r.name}`,
    body: 'Verified partners can search consented profiles in this region. Names and contacts are never shown publicly.',
    button: `View talents in ${r.name} →`,
    mobileBody: 'Verified partners can search consented profiles.',
    mobileButton: 'Become a partner →',
  },
  mobile: {
    listTitle: 'Top districts',
    listAside: `of ${r.districtsTotal}`,
    listAria: `Top districts in ${r.name} by talents`,
    rows: r.districts.slice(0, 5).map((d) => ({ label: d.name, count: d.talents })),
    viewAll: `View all ${r.districtsTotal} districts →`,
    mapTitle: `Where in ${r.name}`,
    mapAside: 'Bubble = talents',
    subtitle: `1 of ${r.ofRegions} regions · capital ${r.capital}`,
  },
  lowData: {
    title: `${r.name} is just getting started`,
    body: (n) =>
      `${formatCount(n)} talents and growing. We show detailed breakdowns once a region passes 50 talents, so no one can be singled out. Check back soon.`,
    talents: r.lowData.talents,
    joined: r.lowData.joined,
    partners: r.lowData.partners,
    stats: ['Talents so far', 'Joined this month', 'Partners active'],
    subscribe: `Subscribe to updates for ${r.name}`,
  },
  isLowCount: r.talents < 50,
});

/** The view-model of /data/regions/:regionId/districts/:districtId. */
export const buildDistrictView = (d) => ({
  kind: 'district',
  id: d.id,
  regionId: d.regionId,
  name: d.name,
  topTitle: d.name,
  to: `${REGION_BASE}/${d.regionId}/districts/${d.id}`,
  crumbs: [
    { label: 'National', to: '/data/overview' },
    { label: d.regionName, to: `${REGION_BASE}/${d.regionId}` },
    { label: d.name },
  ],
  subtitle: d.subtitle,
  compareLabel: 'Compare districts',
  dataAsOf: DATA_AS_OF,
  hero: {
    eyebrow: `Talents in ${d.name}`,
    count: d.talents,
    label: `Ranked #${d.rank} of ${d.districtsTotal} districts in ${d.regionName}`,
    pct: d.trendPct,
    note: `+${formatCount(d.deltaLast30)} in the last 30 days`,
    noteShort: `#${d.rank} of ${d.districtsTotal} districts`,
    series: d.series,
    seriesLabel: `Talents in ${d.name} over the last 12 weeks, rising`,
  },
  kpis: [
    {
      eyebrow: `Share of ${d.regionName}`,
      eyebrowShort: 'Share of region',
      value: `${d.sharePct}%`,
      sub:
        d.rank === 1
          ? 'Largest district in the region by registrations.'
          : `#${d.rank} district in the region by registrations.`,
      subShort: '',
    },
    {
      eyebrow: 'Assessment completion',
      eyebrowShort: 'Assessments',
      value: `${d.assessmentPct}%`,
      sub: `${d.regionName} average ${d.regionAssessmentPct}%.`,
      subShort: `Region avg ${d.regionAssessmentPct}%`,
    },
    {
      eyebrow: 'Placements made',
      eyebrowShort: 'Placements',
      count: d.placements,
      sub: `${d.placementsSharePct}% of the region’s placements.`,
      subShort: '',
    },
  ],
  partnersKpi: { eyebrow: 'Partners', value: String(d.partners) },
  chipsLabel: `How ${d.name} ranks`,
  chips: [
    { rank: d.ranks.registrations, text: `of ${d.districtsTotal} districts for registrations` },
    { rank: d.ranks.assessment, text: 'for assessment completion' },
    { rank: d.ranks.placements, text: 'for placements' },
  ],
  map: {
    title: `Where talents are in ${d.name}`,
    aside: 'Towns & communities',
    markers: d.districts,
    highlightId: d.id,
    districtTo: (id) => `${REGION_BASE}/${d.regionId}/districts/${id}`,
  },
  table: {
    title: 'Sub-metros & communities',
    aside: 'Top 10 by talents',
    firstCol: 'Area',
    rows: d.areas.map((a, i) => ({
      id: a.id,
      rank: i + 1,
      name: a.name,
      talents: a.talents,
      trendPct: a.trendPct,
      to: null,
    })),
    viewAll: d.areas.length > 10 ? `View all ${d.areasTotal} areas` : null,
    // ⚠️ ASSUMPTION: Figma draws the area table only for Accra Metro; other districts have no area data in the mock.
    emptyText: 'No area breakdown yet.',
  },
  education: {
    aside: `vs ${d.regionName}`,
    label: d.name,
    segments: segments(d.talents, d.education),
    compareLabel: d.regionName,
    compareSegments: segments(1000, d.regionEducation),
    compareShowShare: true,
  },
  age: ageItems(d.talents, d.ageShares),
  ageTotal: undefined,
  capabilities: capabilityRows(d.capabilityShares),
  gender: genderSegments(d.talents, d.genderShares),
  partners: {
    aside: `Organisations active in ${d.name}`,
    tiles: partnerTiles(d.partnerCounts),
  },
  cta: {
    title: `Find talent in ${d.name}`,
    body: 'Verified partners can search consented profiles in this district. Names and contacts are never shown publicly.',
    button: `View talents in ${d.name} →`,
    mobileBody: '',
    mobileButton: '',
  },
  mobile: {
    listTitle: 'Top areas',
    listAside: `of ${d.areasTotal}`,
    listAria: `Top areas in ${d.name} by talents`,
    rows: d.areas.slice(0, 5).map((a) => ({ label: a.name, count: a.talents })),
    viewAll: null,
    mapTitle: '',
    mapAside: '',
    subtitle: `${d.regionName} › ${d.name} · district`,
    educationTitle: `Education vs ${d.regionName}`,
  },
  lowData: {
    title: `${d.name} is just getting started`,
    body: (n) =>
      `${formatCount(n)} talents so far. District breakdowns appear once there are 50 talents, so no one can be identified. See the ${d.regionName} view meanwhile.`,
    talents: d.lowData.talents,
    joined: d.lowData.joined,
    partners: d.lowData.partners,
    stats: ['Talents so far', 'Joined this month', 'Schools active'],
    subscribe: `Subscribe to updates for ${d.name}`,
  },
  isLowCount: d.isLowCount,
});
