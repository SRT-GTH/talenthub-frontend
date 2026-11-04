import { debug } from '../../../../utils/debug.js';

const log = debug('siteCopyScreens');

/*
 * siteCopyScreens — the registry of every Platform Admin 7.8 screen (Site copy, Product names, Media library, Content Editor home).
 * Every file in `./screens/*.jsx` exports
 *
 *   export const COPY_SCREENS = [
 *     { id: '7.8.1a', area: 'site-copy', priority: 10, match: (ctx) => ctx.segments.length === 0, Component: SiteCopyBrowse },
 *     …
 *   ];
 *
 * and is merged here by `import.meta.glob`, so builders never edit shared files. AdminCopyArea picks the FIRST screen of the route's
 * area (highest `priority` first, default 0) whose `match(ctx)` is true and renders `<Component ctx data session />` inside AdminFrame.
 *
 *   area     'home'          `/admin` (Content Editor `?role=editor`, Super Admin name-change home `?role=super&copy=1`)
 *            'site-copy'     `/admin/site-copy/*`        'product-names'  `/admin/product-names/*`        'media'  `/admin/media/*`
 *            'noaccess'      shown by AdminCopyArea when the role cannot read site copy (7.8.7d); match is ignored, priority picks
 *   ctx      { area, segments: string[] (path after the area base), params: URLSearchParams, role, session, pathname, search }
 *   Component props: { ctx, data (useAdminState()), session (useAdminSession()) } — `data.update(patch)` merges into the query string.
 *
 * URL contract (the lead's skeleton; builders add their own keys inside it and document them in the screen file header + the wiki):
 *   /admin?role=editor                           7.8.0a Content Editor home        &tour=1 → 7.8.0b first-visit tour
 *   /admin?role=super&copy=1                     7.8.6f Super Admin home with the name change waiting
 *   /admin/site-copy                             7.8.1 browse (?portal= ?q= ?filter= ?tab=emails ?state=loading|error)
 *   /admin/site-copy/section/:sectionId          7.8.2 section editor, 7.8.4 publish flow (?modal=…)
 *   /admin/site-copy/section/:sectionId/preview  7.8.3 preview (?device=desktop|tablet|phone)
 *   /admin/site-copy/section/:sectionId/history  7.8.5 history, compare, restore
 *   /admin/product-names[/:nameId]               7.8.6 product names, rename, review and publish; 7.8.8 release sync lives under ?view=
 *   /admin/media[/:assetId]                      7.8.9 media library, upload, details; 7.8.10 image / video fields live in the editor
 *   NOTE: the admin top bar mirrors `?q=` into its own search box, so the Site copy search uses `?find=` (`q=` still works as an alias).
 *   NOTE: `/admin?role=editor` shows the first-visit tour (7.8.0b) in a fresh browser (localStorage `gth:copy-tour-seen`); `?tour=0` keeps it closed.
 *   Shared mock "server" shapes (useCopyKv): drafts `{ [sectionId]: { fields: { [key]: { draft } }, savedAt } }`, published `{ [sectionId]: { [key]: text } }`,
 *   history `[{ version, who, when, why, fields: { [key]: { before, after } } }]` (oldest first), product-name renames `{ [nameId]: { draft, status, reason, by, at } }`.
 *   role override: `?role=editor|super|senior|support|moderator|dpo` (mock; see useAdminSession.mockCopyRole)
 */
const FOUND = import.meta.glob('./screens/*.jsx', { eager: true });
const ALL = Object.values(FOUND).flatMap((m) => m.COPY_SCREENS ?? []);

log('registered', ALL.length, 'screens');

export const listCopyScreens = () => ALL;

/** The screen of `area` that matches `ctx`, or null (highest priority first). */
export const resolveScreen = (area, ctx) =>
  ALL.filter((s) => s.area === area)
    .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0))
    .find((s) => (area === 'noaccess' ? true : s.match(ctx))) ?? null;
