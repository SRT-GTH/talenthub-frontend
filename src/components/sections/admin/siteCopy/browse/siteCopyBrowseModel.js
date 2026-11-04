import { debug } from '../../../../../utils/debug.js';
import {
  EDITED_VIEW,
  PORTALS,
  sitePages,
  UNPUBLISHED_SEED,
  allPages,
  draftCountOf,
  isPublishedSection,
  portalById,
  previewOf,
  searchSections,
} from './siteCopyBrowseData.js';
import { isCopyLive } from '../live/copyLive.js';

const log = debug('siteCopyBrowseModel');

// Live mode (live/copyLive.js): only the store counts; the drawn 'edited' statuses and seeded draft counts are mock data.
const drawn = () => !isCopyLive();

/*
 * siteCopyBrowseModel — pure functions that turn the seed data (siteCopyBrowseData.js) plus the shared mock "server" (`site-copy.drafts`,
 * `site-copy.published`) into what the browse screen draws: chips, the list of every view (all / search / unpublished / edited / not editable yet),
 * the subtitle under the title and the draft counts of the portal tabs. `seeds` is false for the "all caught up" frame (7.8.1l), where the drawn drafts
 * do not exist.
 */

/** Live mode: how many sections of a portal the pages declare (shared ones included). */
export const liveSectionCount = (portalId) => {
  const { pages = [], shared = [] } = sitePages()[portalId] ?? {};
  return [...pages, ...shared].reduce((n, p) => n + p.sections.length, 0);
};

export const FILTERS = ['edited', 'unpublished', 'soon'];

/** Draft changes of a section: what the editor saved (a saved draft replaces the seeded count). */
export const sectionDraftCount = (section, { drafts }) => draftCountOf(drafts, section.id);

/** The chip of a section row: { kind, count? }. A draft wins over shared, shared over edited / default. */
export const sectionChip = (section, { drafts, published }) => {
  const n = sectionDraftCount(section, { drafts });
  if (n > 0) return { kind: 'draft', count: n };
  if (section.shared) return { kind: 'shared' };
  if ((drawn() && section.status === 'edited') || isPublishedSection(published, section.id)) {
    return { kind: 'edited' };
  }
  return { kind: 'default' };
};

/** Draft changes of a page: the drafts saved for its sections, else the drawn seed (7.8.1a: Home 1, 7.8.1b: Dashboard 1). */
export const pageDraftCount = (page, { drafts, seeds = true }) => {
  const saved = page.sections.reduce((n, s) => n + draftCountOf(drafts, s.id), 0);
  if (saved > 0) return saved;
  return seeds && drawn() ? (page.draftSeed ?? 0) : 0;
};

/** The chip of a page row. */
export const pageChip = (page, ctx) => {
  if (page.status === 'soon') return { kind: 'soon' };
  const n = pageDraftCount(page, ctx);
  if (n > 0) return { kind: 'draft', count: n };
  if (
    (drawn() && page.status === 'edited') ||
    page.sections.some((s) => isPublishedSection(ctx.published, s.id))
  ) {
    return { kind: 'edited' };
  }
  return { kind: 'default' };
};

/** Pages drawn in the "All" list of a portal (listed !== false). */
export const listedPages = (portalId) =>
  (sitePages()[portalId]?.pages ?? []).filter((p) => p.listed !== false);

/** Draft groups of the "Has unpublished changes" view: [{ key, portal, label, count, sections: [{ id, label, summary, count }] }]. */
export const unpublishedGroups = ({ drafts, seeds = true }) => {
  const groups = [];
  if (seeds && drawn()) {
    UNPUBLISHED_SEED.forEach((g) =>
      groups.push({
        key: `${g.portal}/${g.pageId}`,
        portal: g.portal,
        label: g.label,
        count: g.count,
        sections: g.sections.map((s) => ({ ...s })),
      })
    );
  }
  Object.keys(drafts ?? {}).forEach((sectionId) => {
    const n = draftCountOf(drafts, sectionId);
    if (n <= 0) return;
    const pg = allPages().find((p) => p.sections.some((s) => s.id === sectionId));
    if (!pg) return;
    const sec = pg.sections.find((s) => s.id === sectionId);
    const key = `${pg.portal}/${pg.id}`;
    let group = groups.find((g) => g.key === key);
    if (!group) {
      group = {
        key,
        portal: pg.portal,
        label: `${portalById(pg.portal).label} › ${pg.label}`,
        count: 0,
        sections: [],
      };
      groups.push(group);
    }
    const saved = previewOf(drafts, sectionId);
    const existing = group.sections.find((s) => s.id === sectionId);
    if (existing) {
      existing.count = n;
      if (saved) existing.summary = saved;
    } else {
      group.sections.push({
        id: sectionId,
        label: sec.label,
        summary: saved || sec.summary,
        count: n,
      });
    }
    group.count = group.sections.reduce((t, s) => t + s.count, 0);
  });
  return groups;
};

/** Edited view: [{ id, label, status: 'edited', sections: [section] }] + the number of edited sections, for one portal. */
export const editedGroups = (portalId, { published }) => {
  const portal = portalById(portalId);
  const pool = sitePages()[portalId]?.pages ?? [];
  const seed = drawn() ? EDITED_VIEW[portalId] : null;
  const extraIds = (pg) =>
    pg.sections.filter((s) => isPublishedSection(published, s.id) && s.status !== 'edited');
  let pages;
  let total;
  if (seed) {
    pages = seed.map((sp) => {
      const pg = pool.find((p) => p.id === sp.id);
      const base = sp.sections.map((id) => pg?.sections.find((s) => s.id === id)).filter(Boolean);
      const more = pg ? extraIds(pg).filter((s) => !sp.sections.includes(s.id)) : [];
      return {
        id: sp.id,
        label: sp.label,
        status: 'edited',
        sections: [...base, ...more],
        extra: more.length,
      };
    });
    total = EDITED_VIEW.sectionsTotal;
  } else {
    pages = pool
      .filter(
        (p) => p.listed !== false && ((drawn() && p.status === 'edited') || extraIds(p).length)
      )
      .map((p) => ({
        id: p.id,
        label: p.label,
        status: 'edited',
        sections: p.sections.filter(
          (s) => (drawn() && s.status === 'edited') || isPublishedSection(published, s.id)
        ),
        extra: 0,
      }));
    total = drawn() ? portal.edited : pages.reduce((n, p) => n + p.sections.length, 0);
  }
  // pages that are only edited through the editor (not in the seed view) join the list
  pool.forEach((p) => {
    const more = extraIds(p);
    if (more.length && !pages.some((x) => x.id === p.id)) {
      pages.push({
        id: p.id,
        label: p.label,
        status: 'edited',
        sections: more,
        extra: more.length,
      });
    }
  });
  const extraAll = pages.reduce((n, p) => n + (p.extra ?? 0), 0);
  log('editedGroups', { portalId, pages: pages.length, total: total + extraAll });
  return { pages, total: total + extraAll };
};

/** "Not editable yet" view: the pages of the portal still marked Coming soon. */
export const comingSoonPages = (portalId) =>
  (sitePages()[portalId]?.pages ?? []).filter((p) => p.status === 'soon');

/** Search results: [{ key, label, page, sections }]; label "Talent › Home". */
export const searchGroups = (term, { drafts }) =>
  searchSections(term, drafts).map((g) => ({
    key: `${g.portal}/${g.page.id}`,
    label: `${portalById(g.portal).label} › ${g.page.label}`,
    page: g.page,
    sections: g.sections,
  }));

/** The small count chips on the portal tabs: pages with drafts (All view) or changes (unpublished view). */
export const tabCounts = ({ drafts, seeds = true, byChanges }) => {
  const out = {};
  PORTALS.forEach((p) => {
    if (byChanges) {
      const n = unpublishedGroups({ drafts, seeds })
        .filter((g) => g.portal === p.id)
        .reduce((t, g) => t + g.count, 0);
      out[p.id] = n;
    } else {
      out[p.id] = listedPages(p.id).filter(
        (pg) => pageDraftCount(pg, { drafts, seeds }) > 0
      ).length;
    }
  });
  return out;
};

/** The subtitle under the title for the current view (frames 7.8.1a-l). */
export const subtitleFor = ({ state, searching, filter, portal, drafts, seeds }) => {
  if (state === 'loading') return 'Loading…';
  if (state === 'error') return 'Something went wrong';
  if (searching) return 'Searching every portal';
  if (filter === 'unpublished') return 'All portals · showing sections with unpublished changes';
  if (filter === 'edited') return `${portal.subtitle} · showing sections with live changes`;
  if (filter === 'soon') {
    const n = comingSoonPages(portal.id).length;
    return `${portal.subtitle} · ${n} ${n === 1 ? 'page' : 'pages'} not editable yet`;
  }
  if (portal.id === 'emails' && !drawn()) {
    return `Emails · ${liveSectionCount('emails')} designed emails · subject and the main lines of each`;
  }
  if (portal.id === 'emails') {
    return 'Emails · 38 templates · subject, heading, body and button for each';
  }
  const withDrafts = listedPages(portal.id).filter(
    (pg) => pageDraftCount(pg, { drafts, seeds }) > 0
  ).length;
  const base = drawn()
    ? `${portal.subtitle} · ${portal.pages} pages · ${portal.edited} edited`
    : `${portal.subtitle} · ${liveSectionCount(portal.id)} editable sections`;
  // ⚠️ ASSUMPTION: the "· N with draft changes" part is dropped when no page has drafts (only the "1 with draft changes" wording is drawn).
  return withDrafts > 0 ? `${base} · ${withDrafts} with draft changes` : base;
};
