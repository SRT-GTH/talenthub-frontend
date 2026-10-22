/*
 * Interests (stage 2) static data + profile mappers. Copy verbatim from Figma IN-01..IN-05 (Playful 7706:*, Focused 8285:*).
 * SEED_DRAFT is the signed-out demo only; signed-in talents load / save the profile `interests` list through
 * interestsFromProfile / interestsToProfile (bottom of this file). Rails / role matches are still static copy.
 */
export const MAX_AREAS = 6;
export const MIN_AREAS = 2;
export const UNLOCK_SPECIFICS = 6;

/* id, label, icon key (interestsIcons), short name used in the stage-complete sentence */
export const AREAS = [
  { id: 'technology', label: 'Technology & Engineering', icon: 'Function', short: 'Technology' },
  { id: 'business', label: 'Business & Finance', icon: 'Wallet', short: 'Business' },
  { id: 'creative', label: 'Creative Arts & Design', icon: 'Image', short: 'Creative Arts' },
  { id: 'health', label: 'Health Sciences', icon: 'Heart', short: 'Health' },
  { id: 'education', label: 'Education', icon: 'Mortar', short: 'Education' },
  { id: 'agriculture', label: 'Agriculture & Environment', icon: 'Globe', short: 'Agriculture' },
  { id: 'law', label: 'Law & Policy', icon: 'Shield', short: 'Law' },
  { id: 'media', label: 'Media & Communication', icon: 'Mic', short: 'Media' },
  { id: 'development', label: 'Development & NGOs', icon: 'Users', short: 'Development' },
];
export const AREA_BY_ID = Object.fromEntries(AREAS.map((a) => [a.id, a]));

/* Draft as drawn in IN-02..IN-05: 3 areas, 5 specifics (Technology is Primary). */
export const SEED_DRAFT = {
  areas: [
    {
      id: 'technology',
      specifics: ['Software development', 'Data science', 'AI and machine learning'],
    },
    { id: 'creative', specifics: ['UI/UX design', 'Brand design'] },
    { id: 'business', specifics: [] },
  ],
};
export const EMPTY_DRAFT = { areas: [] };

/* "Suggested for you" is drawn for Technology only (IN-03). */
export const SUGGESTIONS = {
  technology: [
    'Mobile development',
    'Cloud and infrastructure',
    'Cybersecurity',
    'UI engineering',
    'Fintech',
  ],
};

export const HERO_DEFINITIONS = [
  { icon: 'Heart', text: 'Things you’d do without pay' },
  { icon: 'Book', text: 'Topics you read about for fun' },
  { icon: 'Bolt', text: 'Skills you’re building on the side' },
  { icon: 'Company', text: 'Industries you want to work in' },
];

export const WHY_RAIL = [
  {
    icon: 'Target',
    title: 'Role matches from day one',
    body: 'You’re matched to roles before anything else is filled in.',
  },
  {
    icon: 'Users',
    title: 'Mentor suggestions',
    body: 'Specifics connect you with people in the same niche.',
  },
  { icon: 'Chat', title: 'Communities', body: 'We suggest groups that share your interests.' },
];

export const SWEET_SPOT_RAIL = [
  { icon: 'Target', title: '3–5 areas', body: 'Enough range without diluting your matches.' },
  {
    icon: 'Label',
    title: '6–10 specifics',
    body: 'Specific beats vague: “UI/UX design” over “design”.',
  },
];

export const POPULAR_RAIL = [
  {
    icon: 'TrendUp',
    title: 'Tech, Business and Creative',
    body: 'The top three areas on GTH right now.',
  },
  { icon: 'Heart', title: 'Health and Education', body: 'Growing fastest this year.' },
];

export const ROLE_MATCHES = [
  { id: 'r1', title: 'Data Scientist', company: 'Zeepay · Accra', match: '94%' },
  { id: 'r2', title: 'Product Designer', company: 'mPharma · Accra', match: '88%' },
  { id: 'r3', title: 'Growth Analyst', company: 'Farmerline · Kumasi', match: '82%' },
];
export const ROLE_MATCH_TOTAL = 142;

export const STAGE_DONE_XP = 30;
/* Stage bar behind every frame (incl. IN-05) is drawn "1 of 9 done"; the dialog stats read 2/9 and 22%. */
export const PAGE_DONE_IDS = ['avatar'];
export const COMPLETE_DONE_COUNT = 2;

/* Stage-complete sentence. The drawn string reads "6 specifics" for the 3-area / 5-specific mock (a Figma inconsistency kept as drawn). */
export const completeSummary = (areas, specificsCount) => {
  const live = areas.filter((a) => a.specifics.length > 0).map((a) => AREA_BY_ID[a.id].short);
  const names = live.length ? live.join(' and ') : null;
  const drawn = areas.length === 3 && specificsCount === 5;
  const n = drawn ? 6 : specificsCount;
  return `${areas.length} areas and ${n} specifics. You’re already matched to roles${
    names ? `, and mentor matching is live for ${names}` : ''
  }.`;
};

/*
 * Profile mappers (live talents). UI draft { areas: [{ id, specifics: [string] }] } <-> profile `interests`:
 *   - each specific  -> { name: <specific>, category: <area label>, source, metadata: { areaId, rank, kind: 'specific' } }
 *   - each area      -> { name: <area label>, category: <area label>, source, metadata: { areaId, rank, kind: 'area' } }
 *     (one area row per area, so an area with no specifics yet still counts and keeps its place)
 *   rank = the area's position (0 = the "Primary" area).
 * Ownership: items carrying metadata.areaId were written by this screen ("owned"): their name / category / metadata are kept
 * in step with the UI. Items other surfaces wrote (Career Buddy, onboarding) are shown under an area when their category
 * matches one, but are written back untouched (no category rewrite); they are dropped only when the talent removes that
 * specific / area here. Items that match no area are always written back as-is. Existing items keep `_id` and every field
 * this screen does not show; only exact duplicates (same name AND category AND source) are collapsed.
 */
/* `id` is the read-only virtual copy of `_id`; drop it when writing back. */
const withoutVirtualId = (item) => {
  if (!item || typeof item !== 'object') return item;
  const { id: _virtual, ...rest } = item;
  return rest;
};
const norm = (v) =>
  String(v || '')
    .trim()
    .toLowerCase();

const ownedAreaId = (item) => {
  const meta = item?.metadata?.areaId;
  return meta && AREA_BY_ID[meta] ? meta : null;
};

const areaIdOf = (item) => {
  const owned = ownedAreaId(item);
  if (owned) return owned;
  const cat = norm(item?.category);
  if (!cat) return null;
  const hit = AREAS.find(
    (a) =>
      cat === a.id ||
      cat === norm(a.label) ||
      cat === norm(a.short) ||
      norm(a.label).startsWith(cat)
  );
  return hit ? hit.id : null;
};

const isAreaRow = (item, areaId) =>
  item?.metadata?.kind === 'area' ||
  (item?.metadata?.kind !== 'specific' && norm(item?.name) === norm(AREA_BY_ID[areaId].label));

export const interestsFromProfile = (interests) => {
  const list = Array.isArray(interests) ? interests : [];
  const byArea = new Map();
  const foreign = [];
  list.forEach((item, i) => {
    const areaId = areaIdOf(item);
    if (!areaId) {
      foreign.push(item);
      return;
    }
    const rank = Number.isFinite(item?.metadata?.rank) ? item.metadata.rank : 100 + i;
    const entry = byArea.get(areaId) || { id: areaId, rank, specifics: [] };
    entry.rank = Math.min(entry.rank, rank);
    if (
      !isAreaRow(item, areaId) &&
      item.name &&
      !entry.specifics.some((x) => norm(x) === norm(item.name))
    ) {
      entry.specifics.push(item.name);
    }
    byArea.set(areaId, entry);
  });
  const areas = [...byArea.values()]
    .sort((a, b) => a.rank - b.rank)
    .map(({ id, specifics }) => ({ id, specifics }));
  return { draft: { areas }, foreign };
};

export const interestsToProfile = (draft, original = []) => {
  const list = Array.isArray(original) ? original : [];
  const out = [];
  const keep = (orig, areaId, rank, kind, name) => {
    if (!ownedAreaId(orig)) {
      out.push(withoutVirtualId(orig));
      return;
    }
    const label = AREA_BY_ID[areaId].label;
    out.push({
      ...withoutVirtualId(orig),
      name: kind === 'area' ? label : name,
      category: label,
      source: orig.source || 'user',
      metadata: { ...(orig.metadata || {}), areaId, rank, kind },
    });
  };
  const create = (areaId, rank, kind, name) => {
    const label = AREA_BY_ID[areaId].label;
    out.push({
      name: kind === 'area' ? label : name,
      category: label,
      source: 'user',
      metadata: { areaId, rank, kind },
    });
  };

  draft.areas
    .filter((a) => AREA_BY_ID[a.id])
    .forEach((a, rank) => {
      const inArea = list.filter((it) => areaIdOf(it) === a.id);
      const areaRows = inArea.filter((it) => isAreaRow(it, a.id));
      if (areaRows.length) areaRows.forEach((it) => keep(it, a.id, rank, 'area'));
      else create(a.id, rank, 'area');
      a.specifics.forEach((sp) => {
        const matches = inArea.filter((it) => !isAreaRow(it, a.id) && norm(it.name) === norm(sp));
        if (matches.length) matches.forEach((it) => keep(it, a.id, rank, 'specific', sp));
        else create(a.id, rank, 'specific', sp);
      });
    });
  list.filter((it) => !areaIdOf(it)).forEach((it) => out.push(withoutVirtualId(it)));

  // Collapse exact duplicates only (same name AND category AND source); the first one (with its _id) wins.
  const seen = new Set();
  return out.filter((it) => {
    const key = JSON.stringify([it.name ?? '', it.category ?? '', it.source ?? '']);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};
