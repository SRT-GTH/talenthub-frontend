import { isCopyLive } from '../live/copyLive.js';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { debug } from '../../../../../utils/debug.js';
import { COPY_PATHS, copyUrl } from '../copyUrl.js';
import { useCopyKv } from '../useCopyKv.js';
import SiteCopyEmailPreview from '../browse/SiteCopyEmailPreview.jsx';
import SiteCopyFilterChips from '../browse/SiteCopyFilterChips.jsx';
import SiteCopyInfoCard from '../browse/SiteCopyInfoCard.jsx';
import SiteCopyLegendCard from '../browse/SiteCopyLegendCard.jsx';
import SiteCopyPageGroup from '../browse/SiteCopyPageGroup.jsx';
import SiteCopyPagePreview from '../browse/SiteCopyPagePreview.jsx';
import SiteCopyPagesCard, { SiteCopySharedHead } from '../browse/SiteCopyPagesCard.jsx';
import SiteCopyPortalTabs from '../browse/SiteCopyPortalTabs.jsx';
import SiteCopySearchBox from '../browse/SiteCopySearchBox.jsx';
import SiteCopySectionRow from '../browse/SiteCopySectionRow.jsx';
import SiteCopyShelfButton from '../browse/SiteCopyShelfButton.jsx';
import SiteCopySkeleton from '../browse/SiteCopySkeleton.jsx';
import SiteCopyStateCard from '../browse/SiteCopyStateCard.jsx';
import SiteCopyTour from '../home/SiteCopyTour.jsx';
import { BrowseInfoIcon } from '../browse/SiteCopyBrowseIcons.jsx';
import {
  EMAIL_PREVIEW,
  PORTALS,
  sitePages,
  portalById,
  previewOf,
} from '../browse/siteCopyBrowseData.js';
import {
  FILTERS,
  comingSoonPages,
  editedGroups,
  listedPages,
  pageChip,
  liveSectionCount,
  pageDraftCount,
  searchGroups,
  sectionChip,
  subtitleFor,
  tabCounts,
  unpublishedGroups,
} from '../browse/siteCopyBrowseModel.js';

const log = debug('SiteCopyBrowse');

/*
 * SiteCopyBrowse — `/admin/site-copy` (Platform Admin 7.8.1a-l "Site copy": every page of the platform grouped by portal). Area `site-copy`, matches when no
 * path segment follows. URL keys (all optional; `role=` is kept by data.update):
 *   portal=public|talent|parent|recruiter|institution|emails   the open tab (default public; the older `tab=emails` also opens Emails)
 *   find=<text>          (`q=` still works) search over every portal: 2+ characters search (7.8.1c, "nothing found" 7.8.1d), 1 character shows "Type at least 2 characters" (7.8.1e)
 *   filter=edited|unpublished|soon   the filter chips: live changes (7.8.1i), unpublished changes (7.8.1f / empty 7.8.1l), not editable yet (7.8.1g)
 *   state=loading|error  edge states (7.8.1j / 7.8.1k; "Try again" reloads after a short fake load)   state=caught-up  the unpublished view with the drawn drafts gone (7.8.1l)
 *   tour=1|2|3           the first-visit tour over this screen (7.8.0b; step 1 of 3 is the drawn one)
 * Frame URLs: 7.8.1a `/admin/site-copy?role=editor` · 1b `?portal=talent` · 1c `?portal=talent&find=journey starts` · 1d `?find=xyz` · 1e `?find=j` · 1f `?filter=unpublished` ·
 * 1g `?filter=soon` · 1h `?portal=emails` · 1i `?filter=edited` · 1j `?state=loading` · 1k `?state=error` · 1l `?filter=unpublished&state=caught-up` · 7.8.0b `?tour=1`.
 * Drafts saved in the section editor (`site-copy.drafts`) and what was published (`site-copy.published`) show here: a section with a draft gets "Draft changes (n)" and
 * lists under Has unpublished changes; a published one gets "Edited". Search looks at the seeded section text and at the saved drafts.
 * ⚠️ ASSUMPTION: the draft count chips on the portal tabs (drawn in 7.8.1b and 7.8.1f only) show for the portals other than Public site / Emails and in the unpublished view.
 */

const LIST_TITLES = {
  browse: 'Pages',
  search: 'RESULTS',
  unpublished: 'UNPUBLISHED CHANGES',
  edited: 'EDITED',
  soon: 'NOT EDITABLE YET',
};

const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

const SectionNote = () => (
  // ⚠️ ASSUMPTION: only some pages have their sections drawn; the others say so when opened.
  <p className="m-0 px-[10px] py-[8px] font-sans text-[12.5px] leading-[15px] text-[#575755]">
    Sections for this page aren’t listed yet.
  </p>
);

const SiteCopyBrowse = ({ ctx, data }) => {
  const navigate = useNavigate();
  const [drafts] = useCopyKv('site-copy.drafts', {});
  const [published] = useCopyKv('site-copy.published', {});
  const { params } = data;
  const inputRef = useRef(null);
  const [retrying, setRetrying] = useState(false);

  const portalParam = params.get('portal') ?? (params.get('tab') === 'emails' ? 'emails' : null);
  const portal = portalById(PORTALS.some((p) => p.id === portalParam) ? portalParam : 'public');
  // the search text lives in `find` (not the shared `q`: the admin top bar mirrors `q` into its own search box, which the frames leave on its placeholder)
  const q = params.get('find') ?? params.get('q') ?? '';
  const term = q.trim();
  const searching = term.length >= 2;
  const tooShort = term.length === 1;
  const filterParam = params.get('filter');
  const filter = !searching && FILTERS.includes(filterParam) ? filterParam : null;
  const rawState = params.get('state');
  const state = retrying
    ? 'loading'
    : rawState === 'loading' || rawState === 'error'
      ? rawState
      : null;
  const seeds = rawState !== 'caught-up';
  const m = { drafts, published, seeds };
  const mode = searching ? 'search' : (filter ?? 'browse');
  // 7.8.0b: under the first-visit tour the list is the plain first look (no filters, "Pick a section" card instead of the page overview)
  const firstTour = (Number(params.get('tour')) || 0) >= 1 && mode === 'browse' && !rawState;

  const groupsSearch = searching ? searchGroups(term, m) : [];
  const groupsUnpublished = mode === 'unpublished' ? unpublishedGroups(m) : [];
  const edited = mode === 'edited' ? editedGroups(portal.id, m) : null;
  const soon = mode === 'soon' ? comingSoonPages(portal.id) : [];
  const pages = listedPages(portal.id);
  const sharedPages = sitePages()[portal.id]?.shared ?? [];

  /* ── per-view UI state (open pages, selected section) resets when the view changes ── */
  const viewKey = `${mode}|${portal.id}|${tooShort ? 'short' : ''}`;
  const computeInitial = () => {
    let open = [];
    let selected = null;
    if (mode === 'browse') {
      if (portal.id === 'public') open = tooShort ? [] : ['home'];
      if (portal.id === 'emails') {
        open = ['welcome-email'];
        selected = 'emails.welcome-email.subject-line';
      }
    } else if (mode === 'search') {
      open = groupsSearch.map((g) => g.key);
      selected = groupsSearch[0]?.sections[0]?.id ?? null;
    } else if (mode === 'unpublished') {
      open = groupsUnpublished.map((g) => g.key);
    } else if (mode === 'edited') {
      open = edited.pages
        .filter((p) => p.sections.length)
        .slice(0, 1)
        .map((p) => p.id);
    }
    return { key: viewKey, open, selected };
  };
  const [stored, setStored] = useState(null);
  const ui = stored && stored.key === viewKey ? stored : computeInitial();
  const patchUi = (patch) => setStored({ ...ui, ...patch, key: viewKey });
  const toggle = (id) =>
    patchUi({ open: ui.open.includes(id) ? ui.open.filter((x) => x !== id) : [...ui.open, id] });

  useEffect(() => {
    log('mount/view', {
      mode,
      portal: portal.id,
      filter,
      q: term,
      state,
      seeds,
      drafts: Object.keys(drafts).length,
    });
  }, [mode, portal.id, filter, term, state, seeds]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!retrying) return undefined;
    log('retry: fake reload');
    const t = setTimeout(() => {
      setRetrying(false);
      data.update({ state: null }, { replace: true });
    }, 700);
    return () => clearTimeout(t);
  }, [retrying]); // eslint-disable-line react-hooks/exhaustive-deps

  const sectionLink = (id) => copyUrl(ctx, COPY_PATHS.section(id));
  const setQuery = (value) => data.update({ find: value, q: null }, { replace: true });
  const clearSearch = () => {
    log('clear search');
    setQuery('');
    inputRef.current?.focus();
  };
  const setFilter = (f) => {
    log('filter', f);
    data.update({ filter: f });
  };
  const selectPortal = (id) => {
    log('portal', id);
    data.update({ portal: id === 'public' ? null : id, tab: null });
  };

  /* ── tab counts ── */
  const showCounts =
    !state && !searching && (filter === 'unpublished' || !['public', 'emails'].includes(portal.id));
  const counts = showCounts
    ? tabCounts({ drafts, seeds, byChanges: filter === 'unpublished' })
    : null;

  /* ── the lists ── */
  const sectionRows = (g, withHighlight) =>
    g.sections.map((sec) => (
      <SiteCopySectionRow
        key={sec.id}
        label={sec.label}
        summary={previewOf(drafts, sec.id) || sec.summary}
        chip={sectionChip(sec, m)}
        selected={ui.selected === sec.id}
        highlight={withHighlight ? term : undefined}
        to={sectionLink(sec.id)}
        onSelect={
          mode === 'browse' && portal.id === 'emails'
            ? () => {
                if (ui.selected === sec.id) {
                  log('open section (second click)', sec.id);
                  navigate(sectionLink(sec.id));
                } else {
                  patchUi({ selected: sec.id });
                }
              }
            : undefined
        }
      />
    ));

  const pageGroup = (pg, extra = {}) => (
    <SiteCopyPageGroup
      key={pg.id}
      id={`site-copy-page-${portal.id}-${pg.id}`}
      label={pg.label}
      chip={pageChip(pg, m)}
      open={ui.open.includes(pg.id)}
      onToggle={() => toggle(pg.id)}
      disabled={pg.status === 'soon'}
      {...extra}
    >
      {pg.sections.length ? sectionRows(pg) : <SectionNote />}
    </SiteCopyPageGroup>
  );

  let listCard = null;
  let right = null;
  let fullState = null;

  if (state === 'loading') {
    fullState = <SiteCopySkeleton />;
  } else if (state === 'error') {
    fullState = (
      <SiteCopyStateCard
        variant="error"
        title="We couldn’t load the pages"
        text="Check your connection and try again. Your drafts are safe on the server."
        actions={
          <SiteCopyShelfButton
            tone="green"
            onClick={() => {
              log('try again');
              setRetrying(true);
            }}
          >
            Try again
          </SiteCopyShelfButton>
        }
      />
    );
  } else if (mode === 'search') {
    if (groupsSearch.length === 0) {
      fullState = (
        <SiteCopyStateCard
          variant="search"
          title={`No text matches “${term}”`}
          text="Try fewer words, or check the spelling. You can also browse by portal and page."
          actions={
            <>
              <SiteCopyShelfButton onClick={clearSearch}>Clear search</SiteCopyShelfButton>
              <SiteCopyShelfButton tone="green" onClick={clearSearch}>
                Browse {portal.label}
              </SiteCopyShelfButton>
            </>
          }
        />
      );
    } else {
      const matches = groupsSearch.reduce((n, g) => n + g.sections.length, 0);
      listCard = (
        <SiteCopyPagesCard
          title={LIST_TITLES.search}
          meta={`${plural(matches, 'match', 'matches')} in ${plural(groupsSearch.length, 'page', 'pages')}`}
        >
          {groupsSearch.map((g) => (
            <SiteCopyPageGroup
              key={g.key}
              label={g.label}
              chip={pageChip(g.page, m)}
              open={ui.open.includes(g.key)}
              onToggle={() => toggle(g.key)}
            >
              {sectionRows(g, true)}
            </SiteCopyPageGroup>
          ))}
        </SiteCopyPagesCard>
      );
      right = (
        <SiteCopyInfoCard
          title={plural(matches, 'match', 'matches')}
          text="Click a match to open that section. Words inside sections, page names and section names are all searched."
          banner={{ tone: 'blue', text: 'Search looks at the published text and your drafts.' }}
        />
      );
    }
  } else if (mode === 'unpublished') {
    if (groupsUnpublished.length === 0) {
      fullState = (
        <SiteCopyStateCard
          variant="done"
          title="All caught up"
          text="There are no unpublished changes. Everything you’ve changed is live."
          actions={
            <SiteCopyShelfButton onClick={() => setFilter(null)}>
              Show all pages
            </SiteCopyShelfButton>
          }
        />
      );
    } else {
      const total = groupsUnpublished.reduce((n, g) => n + g.count, 0);
      const first = groupsUnpublished[0].sections[0]?.id;
      listCard = (
        <SiteCopyPagesCard
          title={LIST_TITLES.unpublished}
          meta={plural(groupsUnpublished.length, 'page', 'pages')}
        >
          {groupsUnpublished.map((g) => (
            <SiteCopyPageGroup
              key={g.key}
              label={g.label}
              chip={{ kind: 'draft', count: g.count }}
              open={ui.open.includes(g.key)}
              onToggle={() => toggle(g.key)}
            >
              {g.sections.map((sec) => (
                <SiteCopySectionRow
                  key={sec.id}
                  label={sec.label}
                  summary={sec.summary}
                  chip={{ kind: 'draft', count: sec.count }}
                  to={sectionLink(sec.id)}
                />
              ))}
            </SiteCopyPageGroup>
          ))}
        </SiteCopyPagesCard>
      );
      right = (
        <SiteCopyInfoCard
          title={`${plural(total, 'change', 'changes')} waiting to be published`}
          text="Drafts are saved for you and stay private until you publish them. Open a section to preview or publish it."
          action={
            // ⚠️ ASSUMPTION: no "all drafts" screen is drawn; the button opens the preview of the first draft section.
            <SiteCopyShelfButton size="md" to={copyUrl(ctx, COPY_PATHS.preview(first))}>
              Preview all drafts
            </SiteCopyShelfButton>
          }
        />
      );
    }
  } else if (mode === 'edited') {
    if (edited.pages.length === 0) {
      fullState = (
        // ⚠️ ASSUMPTION: the empty Edited view is not drawn.
        <SiteCopyStateCard
          variant="search"
          title="Nothing edited yet"
          text="Sections you publish show up here."
          actions={
            <SiteCopyShelfButton onClick={() => setFilter(null)}>
              Show all pages
            </SiteCopyShelfButton>
          }
        />
      );
    } else {
      const firstId = edited.pages.find((p) => p.sections.length)?.sections[0]?.id;
      listCard = (
        <SiteCopyPagesCard
          title={LIST_TITLES.edited}
          meta={`${plural(edited.pages.length, 'page', 'pages')} · ${plural(edited.total, 'section', 'sections')}`}
        >
          {edited.pages.map((pg) => (
            <SiteCopyPageGroup
              key={pg.id}
              label={pg.label}
              chip={{ kind: 'edited' }}
              open={ui.open.includes(pg.id)}
              onToggle={() => toggle(pg.id)}
            >
              {pg.sections.length ? (
                pg.sections.map((sec) => (
                  <SiteCopySectionRow
                    key={sec.id}
                    label={sec.label}
                    summary={sec.summary}
                    chip={{ kind: 'edited' }}
                    to={sectionLink(sec.id)}
                  />
                ))
              ) : (
                <SectionNote />
              )}
            </SiteCopyPageGroup>
          ))}
        </SiteCopyPagesCard>
      );
      right = (
        <SiteCopyInfoCard
          title={`${plural(edited.total, 'section', 'sections')} show${edited.total === 1 ? 's' : ''} your words`}
          text="These are live. Each one keeps its history, so you can see who changed it and restore an older version."
          action={
            firstId ? (
              <SiteCopyShelfButton size="md" to={copyUrl(ctx, COPY_PATHS.history(firstId))}>
                Open history
              </SiteCopyShelfButton>
            ) : null
          }
        />
      );
    }
  } else if (mode === 'soon') {
    if (soon.length === 0) {
      fullState = (
        // ⚠️ ASSUMPTION: a portal without Coming soon pages is not drawn.
        <SiteCopyStateCard
          variant="done"
          title="Nothing waiting"
          text="Every page of this portal can be edited."
          actions={
            <SiteCopyShelfButton onClick={() => setFilter(null)}>
              Show all pages
            </SiteCopyShelfButton>
          }
        />
      );
    } else {
      listCard = (
        <SiteCopyPagesCard title={LIST_TITLES.soon} meta={plural(soon.length, 'page', 'pages')}>
          {soon.map((pg) => (
            <SiteCopyPageGroup
              key={pg.id}
              label={pg.label}
              chip={{ kind: 'soon' }}
              disabled
              open={false}
              onToggle={() => {}}
            />
          ))}
        </SiteCopyPagesCard>
      );
      right = (
        <SiteCopyInfoCard
          title="These pages arrive with a later release"
          text="When developers release them, their sections appear here automatically with the original text. You don’t need to ask for them."
          banner={{ tone: 'grey', text: 'Greyed pages can’t be opened yet.' }}
        />
      );
    }
  } else {
    const isEmails = portal.id === 'emails';
    listCard = (
      <SiteCopyPagesCard
        title={isEmails ? 'TEMPLATES' : LIST_TITLES.browse}
        meta={
          isEmails
            ? `${portal.pages} templates`
            : isCopyLive()
              ? `${liveSectionCount(portal.id)} sections`
              : `${portal.pages} pages`
        }
      >
        {pages.map((pg) => pageGroup(pg))}
        {sharedPages.length ? (
          <>
            <SiteCopySharedHead />
            {sharedPages.map((pg) => pageGroup(pg))}
          </>
        ) : null}
      </SiteCopyPagesCard>
    );
    const selSection = ui.selected
      ? pages.flatMap((p) => p.sections).find((s) => s.id === ui.selected)
      : null;
    if (isEmails && selSection && ui.open.length) {
      const key = selSection.id.split('.')[1];
      right = EMAIL_PREVIEW[key] ? <SiteCopyEmailPreview preview={EMAIL_PREVIEW[key]} /> : null;
    } else if (!isEmails && !firstTour && portal.id === 'public' && ui.open.includes('home')) {
      const home = pages.find((p) => p.id === 'home');
      right = (
        <SiteCopyPagePreview
          draftCount={pageDraftCount(home, m)}
          heroTo={sectionLink('public.home.hero')}
          howTo={sectionLink('public.home.how-it-works')}
        />
      );
    } else if (portal.id === 'public' || isEmails) {
      right = (
        <SiteCopyInfoCard
          title="Pick a section on the left"
          text="Each page is split into sections, like “Hero” or “FAQ”. Open one to change its words."
        />
      );
    } else {
      right = <SiteCopyLegendCard />;
    }
  }

  const tourStep = Number(params.get('tour')) || 0;
  const firstVisit = tourStep >= 1 && tourStep <= 3 && mode === 'browse' && !state;
  const subtitle = firstVisit
    ? 'Every page of the platform, grouped by portal.'
    : subtitleFor({ state, searching, filter, portal, drafts, seeds });

  return (
    <div className="flex min-w-0 flex-col gap-[24px] pt-[4px] font-sans">
      <div className="flex flex-col gap-[3px]">
        <h1 className="m-0 text-[clamp(28px,3vw,34px)] leading-[1.2] font-semibold tracking-[-0.68px] text-[#1c2a21]">
          Site copy
        </h1>
        <p
          className="m-0 text-[16px] leading-[24px] tracking-[0.2px] text-[#595959]"
          aria-live="polite"
        >
          {subtitle}
        </p>
      </div>

      <div className="flex flex-col gap-[24px]">
        <div className="flex flex-wrap items-start gap-[12px]">
          <SiteCopyPortalTabs
            portals={PORTALS}
            active={portal.id}
            onSelect={selectPortal}
            counts={counts}
          />
          <span className="hidden flex-1 lg:block" />
          <div className="flex w-full flex-col gap-[6px] lg:w-[380px]">
            <SiteCopySearchBox
              value={q}
              onChange={setQuery}
              onClear={clearSearch}
              inputRef={inputRef}
            />
            {tooShort ? (
              <p
                role="status"
                className="m-0 flex items-center gap-[6px] font-sans text-[13px] leading-[16px] font-medium text-[#575755]"
              >
                <BrowseInfoIcon className="size-[14px] shrink-0 text-[#5f6b63]" />
                Type at least 2 characters to search
              </p>
            ) : null}
          </div>
        </div>

        {!searching && !state && !firstVisit && (portal.id !== 'emails' || filter) ? (
          <SiteCopyFilterChips filter={filter} onChange={setFilter} />
        ) : null}

        {fullState ?? (
          <div className="flex flex-col gap-[24px] lg:flex-row lg:items-start">
            {listCard}
            {right}
          </div>
        )}
      </div>

      {tourStep >= 1 && tourStep <= 3 ? (
        <SiteCopyTour
          step={tourStep}
          onStep={(n) => data.update({ tour: n })}
          onClose={() => data.update({ tour: null })}
        />
      ) : null}
    </div>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const COPY_SCREENS = [
  {
    id: '7.8.1',
    area: 'site-copy',
    priority: 10,
    match: (ctx) => ctx.segments.length === 0,
    Component: SiteCopyBrowse,
  },
];

export default SiteCopyBrowse;
