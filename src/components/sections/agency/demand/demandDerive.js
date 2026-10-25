import { DISTRICTS_BY_REGION } from '../../../../constants/ghanaDistricts.js';
import { regionById } from '../../publicData/regionsList.js';
import {
  EMERGING_SKILLS,
  NATIONAL_KPIS,
  NORTHERN,
  PROGRAMME_PLACED_RATES,
  PROGRAMME_ROWS,
  SKILL_FOCUS,
  SKILLS,
  SUPPLY_DEMAND,
} from './data/demandData.js';

/*
 * demandDerive.js — pure helpers that turn the few frames Figma draws into every state the URL can ask for. Everything derived here is
 * ⚠️ ASSUMPTION (sample content): only National, Northern, Data analysis and Drone crop spraying are drawn; other regions / skills scale those.
 */

/** Opportunities per region, last quarter (the top five are drawn in 11.4.5a; the rest is sample data summing to ~3,912). */
export const REGION_OPPS = {
  'greater-accra': 1486,
  ashanti: 842,
  western: 356,
  eastern: 298,
  northern: 214,
  central: 160,
  volta: 146,
  'upper-east': 92,
  bono: 78,
  'north-east': 52,
  savannah: 49,
  'bono-east': 44,
  'upper-west': 38,
  'western-north': 36,
  ahafo: 9,
  oti: 12,
};

const TOTAL = 3912;

export const findSkill = (id) =>
  SKILLS.find((s) => s.id === id) ?? EMERGING_SKILLS.find((s) => s.id === id) ?? null;

/** Everything the page needs to show one skill: hero copy, tiles, map counts, top-5 list. */
export const skillFocus = (id) => {
  if (!id) return null;
  if (SKILL_FOCUS[id]) return { id, name: findSkill(id)?.name ?? id, ...SKILL_FOCUS[id] };
  const skill = findSkill(id);
  if (!skill) return null;
  const share = skill.share ?? Math.round((skill.count / TOTAL) * 1000) / 10;
  const f = skill.count / TOTAL;
  const supply = SUPPLY_DEMAND.find((s) => s.id === id);
  const talents = Math.round(skill.count * (supply?.ratio ?? 9.4));
  return {
    id,
    name: skill.name,
    heroLabel: `${share}% of all opportunities last quarter.`,
    count: skill.count,
    change:
      typeof skill.growth === 'number' ? { pct: skill.growth, suffix: 'vs last quarter' } : null,
    note: `+${Math.round(skill.count * 0.27)} in the last 30 days`,
    badge: typeof skill.growth === 'number' ? null : 'New this quarter',
    tiles: [
      {
        eyebrow: 'Talents with this skill',
        value: talents.toLocaleString('en-GB'),
        sub: 'Verified through an assessment or certificate.',
      },
      {
        eyebrow: 'Talents per opportunity',
        value: String(supply?.ratio ?? '9.4'),
        sub:
          supply && supply.ratio < 3.5
            ? '▼ Shortage · national average is 9.4.'
            : 'National average is 9.4.',
      },
      {
        eyebrow: 'Top hiring region',
        value: 'Greater Accra',
        sub: `38% of ${skill.name} opportunities · ${Math.round(skill.count * 0.38)} roles.`,
      },
    ],
    topRegions: NATIONAL_KPIS.topRegions.map((r) => ({ id: r.id, count: Math.round(r.count * f) })),
    topNote: `${skill.name} is selected. The whole page is filtered to it.`,
  };
};

/** Opportunities per region for the map (skill-filtered counts under 5 become the "<5" state). */
export const regionOpps = (focus) => {
  if (!focus) return REGION_OPPS;
  const f = focus.count / TOTAL;
  const out = {};
  Object.entries(REGION_OPPS).forEach(([id, n]) => {
    out[id] = focus.id === 'drone-crop-spraying' ? 0 : Math.round(n * f);
  });
  focus.topRegions.forEach((r) => {
    out[r.id] = r.count;
  });
  return out;
};

const nameOf = (id) => regionById(id)?.name ?? id;

/** District drill-down of one region. Northern is drawn; other regions scale it with their real district names. */
export const regionDrill = (regionId) => {
  if (regionId === 'northern') return NORTHERN;
  const name = nameOf(regionId);
  const total = REGION_OPPS[regionId] ?? 60;
  const f = total / NORTHERN.hero.count;
  const names = DISTRICTS_BY_REGION[name] ?? [];
  const shares = [0.5, 0.12, 0.08, 0.06, 0.05, 0.02, 0.015, 0.01];
  const districts = names.slice(0, 8).map((n, i) => {
    const count = Math.max(1, Math.round(total * shares[i]));
    return {
      id: n.toLowerCase().replace(/[^a-z]+/g, '-'),
      name: n,
      count,
      share: Math.round((count / total) * 100),
      growth: [11, 4, -2, 6, 1][i % 5],
    };
  });
  const hidden = districts.filter((d) => d.count < 5).reduce((a, d) => a + d.count, 0);
  const pct = Math.round((total / TOTAL) * 1000) / 10;
  return {
    ...NORTHERN,
    regionId,
    hero: {
      eyebrow: `Opportunities posted · ${name}`,
      count: total,
      label: `${pct}% of national opportunities last quarter.`,
      change: { pct: 9, suffix: 'vs last quarter' },
      note: `+${Math.round(total * 0.145)} in the last 30 days`,
    },
    tiles: [
      { ...NORTHERN.tiles[0], value: String(Math.max(12, Math.round(96 * Math.sqrt(f)))) },
      NORTHERN.tiles[1],
      {
        eyebrow: 'Top category',
        value: 'Agriculture',
        sub: `27% of ${name} opportunities · ${Math.round(total * 0.27)} roles and places.`,
      },
    ],
    result: `${total} opportunities · ${Math.max(12, Math.round(96 * Math.sqrt(f)))} skills`,
    districts,
    moreDistricts: Math.max(0, names.length - 8),
    hiddenTotal: hidden,
    districtsHint: `${names.length} districts · opportunities last quarter`,
    districtsNote: `Districts with fewer than 5 opportunities are hidden so no single employer or person can be identified. Together they hold ${hidden} opportunities.`,
    topSkills: NORTHERN.topSkills.map((s) => ({ ...s, count: Math.round(s.count * f) })),
    breakdown: NORTHERN.breakdown.map((s) => {
      const count = Math.round(s.count * f);
      return { ...s, count, share: Math.round((count / total) * 1000) / 10 };
    }),
    supplyHint: `${name} · talents with the skill for every open opportunity · regional average 7.8`,
  };
};

/** One of the agency's own programmes selected on Success rates (the small one is drawn in 11.4.5n; the others are derived from their table row). */
export const programmeFocus = (id) => {
  const row = PROGRAMME_ROWS.find((r) => r.id === id);
  if (!row) return null;
  const done = Math.round((row.completed / row.enrolled) * 100);
  const f = row.rate ? row.rate / 28.5 : 0;
  return {
    row,
    result: `${row.enrolled.toLocaleString('en-GB')} enrolments · 1 programme`,
    hero: {
      eyebrow: 'Programme success rate',
      value: `${row.rate}%`,
      label: 'Placed within 6 months, out of everyone who enrolled.',
      badge: `Placed ÷ enrolled · ${row.placed} placed`,
      note: `${row.completed.toLocaleString('en-GB')} of ${row.enrolled.toLocaleString('en-GB')} finished`,
    },
    tiles: [
      {
        eyebrow: 'Completion rate',
        value: `${done}%`,
        sub: `${row.completed.toLocaleString('en-GB')} of ${row.enrolled.toLocaleString('en-GB')} enrolled finished.`,
      },
      {
        eyebrow: 'Avg time to placement',
        value: '52 days',
        sub: '▼ 9 days faster, from finishing to starting a role.',
      },
      { eyebrow: 'Enrolments', value: row.enrolled.toLocaleString('en-GB'), sub: row.name },
    ],
    funnel: {
      title: row.name,
      stages: [
        { label: 'Enrolled', count: row.enrolled },
        {
          label: 'Completed',
          count: row.completed,
          drop: Math.round(100 - (row.completed / row.enrolled) * 100),
        },
        {
          label: 'Placed',
          count: row.placed,
          drop: Math.round(100 - (row.placed / row.completed) * 100),
        },
      ],
    },
    regionValues: PROGRAMME_PLACED_RATES.map((v) => Math.round(v * f * 10) / 10),
  };
};
