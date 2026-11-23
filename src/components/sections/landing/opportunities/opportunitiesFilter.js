import { JOBS } from './OpportunitiesData.js';

/*
 * Which roles the Opportunities page shows for the URL state, in which order, and the counts it prints.
 * ⚠️ Mock: filters the sample JOBS in the browser. There is no public jobs endpoint yet (see wiki/backend-integration-gaps.md);
 * when one exists, send the same state to the API and use its results and totals instead.
 *
 * A role matches when it passes every filter:
 *   type chip, ?q (title / company / place / chip), ?loc (company / place line)
 *   LEVEL / WORK STYLE / REGION: a group with nothing ticked does not restrict; otherwise the role must have one of the ticked
 *   options (a role with no value for the group, e.g. a nationwide scholarship's region, always passes)
 *   PAY: the role's pay range overlaps the chosen range (roles without a figure, "Paid internship" / "Full grant", always pass)
 */
const inGroup = (selected, value) => {
  if (!selected || !selected.length || value === null || value === undefined) return true;
  const values = Array.isArray(value) ? value : [value];
  return values.some((v) => selected.includes(v));
};

export const jobMatches = (job, { type, q, loc, level, style, region, pay }) => {
  if (type !== 'all' && !job.kinds.includes(type)) return false;
  const hay = `${job.title} ${job.meta} ${job.chip}`.toLowerCase();
  if (q.trim() && !hay.includes(q.trim().toLowerCase())) return false;
  if (loc.trim() && !job.meta.toLowerCase().includes(loc.trim().toLowerCase())) return false;
  if (!inGroup(level, job.level) || !inGroup(style, job.style) || !inGroup(region, job.regions))
    return false;
  if (
    pay &&
    job.payMax !== null &&
    job.payMin !== null &&
    (job.payMax < pay[0] || job.payMin > pay[1])
  )
    return false;
  return true;
};

/*
 * ?sort= options (Figma draws only the "Sort: Best fit" chip, no menu: ⚠️ ASSUMPTION, product owner asked for a working sort 2026-11-13).
 * best    = the drawn order, featured first (visitors have no profile, so there is no real fit score yet)
 * pay     = highest top-of-range first, roles without a figure last
 * company = company name A–Z
 * No "Newest": every sample role says "Posted 2d ago" (see wiki/backend-integration-gaps.md).
 */
export const SORTS = [
  { value: 'best', label: 'Best fit', description: 'Featured roles first' },
  { value: 'pay', label: 'Highest pay', description: 'Top of the pay range' },
  { value: 'company', label: 'Company A–Z', description: 'By company name' },
];

const company = (job) => job.meta.split('·')[0].trim();

export const sortJobs = (jobs, sort) => {
  const list = [...jobs];
  if (sort === 'pay') return list.sort((a, b) => (b.payMax ?? -1) - (a.payMax ?? -1));
  if (sort === 'company') return list.sort((a, b) => company(a).localeCompare(company(b)));
  return list.sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
};

export const filterJobs = (state) =>
  sortJobs(
    JOBS.filter((j) => jobMatches(j, state)),
    state.sort
  );

/* Count per type chip for the current search and filters (a chip shows how many roles you'd get if you picked it). */
export const countByType = (state, typeIds) =>
  Object.fromEntries(
    typeIds.map((id) => [id, JOBS.filter((j) => jobMatches(j, { ...state, type: id })).length])
  );

export const rolesLabel = (n) => (n === 1 ? '1 role' : `${n} roles`);

/* "GH₵ 2,000 – 8,000" style label for the pay slider. */
export const payLabel = ([lo, hi], max) =>
  `${lo.toLocaleString('en-GH')} – ${hi.toLocaleString('en-GH')}${hi >= max ? '+' : ''}`;
