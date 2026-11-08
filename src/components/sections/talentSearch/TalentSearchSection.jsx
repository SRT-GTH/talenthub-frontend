import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardShell from '../dashboard/DashboardShell.jsx';
import WorkspaceSidebar from '../recruiterDashboard/WorkspaceSidebar.jsx';
import useScopedRoundedFont from '../../../hooks/useScopedRoundedFont.js';
import { useMediaQuery } from '../../../hooks/useMediaQuery.js';
import TalentSearchHeader from './TalentSearchHeader.jsx';
import TalentSearchFilterBar from './TalentSearchFilterBar.jsx';
import TalentSearchMoreFilters, {
  TalentSearchMoreFiltersSheet,
} from './TalentSearchMoreFilters.jsx';
import TalentSearchSuggestions from './TalentSearchSuggestions.jsx';
import { TalentFirstVisit, TalentNoResults, TalentResultsLoading } from './TalentSearchStates.jsx';
import CandidateCard from './CandidateCard.jsx';
import TalentPoolInsightBanner from './TalentPoolInsightBanner.jsx';
import { useTalentSearchState } from './useTalentSearchState.js';
import { useLiveTalentSearch } from './useLiveTalentSearch.js';
import LiveTalentDrawer from './LiveTalentDrawer.jsx';
import { isRecruiterSession, jobBucket } from '../../../services/recruiterShell.api.js';
import { useRecruiterShell } from '../../../hooks/useRecruiterShell.js';
import {
  CANDIDATES,
  PAGE_HEADING,
  PAGE_SUBHEADING,
  RESULT_TABS,
  TOP_MATCH_THRESHOLD_PERCENT,
} from './talentSearchData.js';
import {
  FIRST_VISIT,
  LOADING_SUBTITLE,
  NO_RESULTS,
  SORT_FIELDS,
} from './talentSearchFilterData.js';
import { debug } from '../../../utils/debug.js';
import avatarKofiAmankwah from '../../../assets/recruiter/talent-search/candidate-avatar-kofi-amankwah.webp';
import avatarAmaBoateng from '../../../assets/recruiter/talent-search/candidate-avatar-ama-boateng.webp';
import avatarGodfredAnsah from '../../../assets/recruiter/talent-search/candidate-avatar-godfred-ansah.webp';

const log = debug('TalentSearchSection');

/*
 * TalentSearchSection — the recruiter talent-search screen (/recruiter/talent-search).
 * Source: Figma file OHG2xsfCCskT8xEn356njv, page 10102 "Recruiter - Talent Search", frames TS-01 … TS-10 (the earlier build came from 7249:74283).
 *
 * User story: Theme 6 / Epic 6.1.2 — Talent Discovery & Matching. A recruiter reviews AI-ranked candidates for an open role, narrows them with filters,
 * sorts them and opens a profile (route /recruiter/talent-search/:candidateId, built by another section) or invites a candidate to apply.
 *
 * Chrome is DashboardShell with the recruiter workspace rail (`renderSidebar` → WorkspaceSidebar, "Talent Search" lit from the route); this section only
 * contributes the content column. The filter bar is a full-bleed sticky sibling (see TalentSearchFilterBar); the header and the results keep their padding.
 *
 * GRID — Figma draws two grids of three cards separated by the insight banner; the second grid's text is byte-identical to the first, so the same
 * records render twice, exactly as designed.
 *
 * URL STATE (query string; every key is written by the control that owns it, defaults are omitted — see useTalentSearchState.js for the full list):
 *   (none)                                  TS-01  All Matches, both grids + insight banner
 *   ?typed=react%20nat&menu=search          TS-02  typing "react nat", suggestions open
 *   ?menu=skills                            TS-03  skills dropdown open (multi-select)
 *   ?menu=experience                        TS-04  experience dropdown open
 *   ?menu=location                          TS-05  location dropdown open
 *   ?menu=more-filters                      TS-06  More filters drawer (popover at xl+, sheet below; the phone "Filters" button writes the same key; ?filters=open still works)
 *   ?menu=sort                              TS-07  sort dropdown open
 *   ?state=loading                          TS-08  skeleton cards while matches load
 *   ?state=empty&exp=10-plus&remote=0       TS-09  no talent matches all filters (also reached on its own when exp=10-plus with remote off, or the search leaves nobody)
 *   ?state=first-visit                      TS-10  no search yet: open roles + popular searches
 *   ?tab=top-matches | available-now        result tab                                 ?q=<text> committed search (Enter, a suggestion, a popular search)
 *   ?sort=…  ?skills=…  ?exp=…  ?location=…  ?remote=0  ?radius=1  ?availability=…  ?setup=…  ?education=…  ?score=…  ?pay=…  ?verified=0  ?adult=0  ?hidePipeline=1  ?job=<roleId>
 *
 * ⚠️ ASSUMPTIONS (not drawn in Figma): the skills / location / More-filters values are stored in the URL and shown on the chips but do not change which of the
 * three mock candidates appear (only the tab, the search text and experience 10+ do, the last returning nobody); Sort reorders the three records by mock
 * ranking fields (talentSearchFilterData.js SORT_FIELDS); View profile → /recruiter/talent-search/<id>?job=…; Invite to apply →
 * /recruiter/talent-search/<id>?modal=invite&job=… ; a role's "See matches" sets ?job=<role> and leaves the first-visit screen; a popular search commits ?q=.
 */
const AVATARS = {
  'kofi-amankwah': avatarKofiAmankwah,
  'ama-boateng': avatarAmaBoateng,
  'godfred-ansah': avatarGodfredAnsah,
};

const DEFAULT_JOB_ID = 'senior-product-engineer';

const SORTERS = {
  'best-match': (a, b) => b.matchPercent - a.matchPercent,
  'recently-active': (a, b) =>
    SORT_FIELDS[a.id].lastActiveDaysAgo - SORT_FIELDS[b.id].lastActiveDaysAgo,
  'assessment-score': (a, b) =>
    SORT_FIELDS[b.id].assessmentScore - SORT_FIELDS[a.id].assessmentScore,
  'available-soonest': (a, b) =>
    (SORT_FIELDS[a.id].availableInDays ?? Infinity) -
    (SORT_FIELDS[b.id].availableInDays ?? Infinity),
  'open-to-work-first': (a, b) =>
    Number(SORT_FIELDS[b.id].openToWork) - Number(SORT_FIELDS[a.id].openToWork) ||
    b.matchPercent - a.matchPercent,
};

const CandidateGrid = ({ keyPrefix, candidates, onViewProfile, onInviteToApply }) => (
  // Figma lm=GRID: 3 x 432.33 + 2 x 16 = 1329
  <div className="grid w-full grid-cols-1 gap-[16px] max-md:gap-[10px] md:grid-cols-2 xl:grid-cols-3">
    {candidates.map((candidate) => (
      <CandidateCard
        key={`${keyPrefix}-${candidate.id}`}
        candidate={candidate}
        avatarSrc={AVATARS[candidate.id]}
        onViewProfile={onViewProfile}
        onInviteToApply={onInviteToApply}
      />
    ))}
  </div>
);

const TalentSearchSection = () => {
  useScopedRoundedFont('data-recruiter-ui');
  const navigate = useNavigate();
  const state = useTalentSearchState({ live: isRecruiterSession() });
  const { update, menu, pageState, query, typed, tabId, expId } = state;
  const isXlUp = useMediaQuery('(min-width: 1280px) and (min-height: 960px)');
  const jobId = state.jobId ?? DEFAULT_JOB_ID;
  const jobQuery = `job=${jobId}`;

  useEffect(() => {
    log('mount', { route: '/recruiter/talent-search', candidateCount: CANDIDATES.length });
  }, []);

  // Signed-in recruiter: the real (adult) talent pool from the search index; demo people otherwise.
  const live = useLiveTalentSearch({
    query,
    tabId,
    sortId: state.sortId,
    skills: state.skills,
    expId,
    locationId: state.locationId,
    availability: state.availability,
    jobId: state.jobId,
  });
  const isLive = live.status !== 'demo';
  // The recruiter's open postings: "Searching for" (lets minors appear for internships / training) and invites.
  const shell = useRecruiterShell();
  const postings = useMemo(
    () =>
      (shell?.jobList || [])
        .filter((j) => jobBucket(j) === 'active')
        .map((j) => ({ id: String(j._id || j.id), title: j.title || 'Untitled', type: j.type })),
    [shell]
  );
  const [drawer, setDrawer] = useState(null); // { id, invite }

  const demoCandidates = useMemo(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const result = CANDIDATES.filter((candidate) => {
      if (tabId === 'top-matches' && candidate.matchPercent < TOP_MATCH_THRESHOLD_PERCENT)
        return false;
      if (tabId === 'available-now' && !candidate.available) return false;
      if (expId === '10-plus' && !state.remote) return false; // ⚠️ ASSUMPTION: nobody on site in the mock pool has 10+ years
      if (terms.length === 0) return true;
      const haystack = [candidate.name, candidate.role, ...candidate.tags, ...candidate.topSkills]
        .join(' ')
        .toLowerCase();
      return terms.some((term) => haystack.includes(term)); // ⚠️ ASSUMPTION: any word of the search matches
    }).sort(SORTERS[state.sortId] ?? SORTERS['best-match']);
    log('branch: visible candidates', {
      tabId,
      query,
      expId,
      sort: state.sortId,
      count: result.length,
    });
    return result;
  }, [tabId, query, expId, state.remote, state.sortId]);
  const visibleCandidates = isLive ? live.candidates : demoCandidates;

  // The page state: an explicit ?state= wins, otherwise "no results" appears on its own.
  const view = isLive
    ? live.status === 'loading'
      ? 'loading'
      : visibleCandidates.length === 0
        ? 'empty'
        : 'results'
    : (pageState ?? (visibleCandidates.length === 0 ? 'empty' : 'results'));
  useEffect(() => {
    log('state', { view, menu, tabId });
  }, [view, menu, tabId]);

  const job = FIRST_VISIT.roles.find((role) => role.id === state.jobId);
  const subtitleByView = {
    loading: LOADING_SUBTITLE,
    empty: NO_RESULTS.subtitle,
    'first-visit': FIRST_VISIT.subtitle,
    results: isLive
      ? `${live.total} talent${live.total === 1 ? '' : 's'} ${query.trim() ? `match \u201c${query.trim()}\u201d` : 'in the GTH talent pool'}`
      : job
        ? `Found 12 highly compatible matches for ${job.title}`
        : PAGE_SUBHEADING, // ⚠️ ASSUMPTION for roles other than Senior Product Engineer
  };
  const heading =
    view === 'first-visit'
      ? { lead: FIRST_VISIT.title.lead, accent: FIRST_VISIT.title.accent, titleStyle: 'sans' }
      : {
          lead: PAGE_HEADING.lead,
          accent: PAGE_HEADING.accent,
          accentClassName: 'text-brand-green',
        };

  const filterChanges = (changes) => update(changes);
  const closeMenu = () => update({ menu: null, filters: null });
  const openMenu = (id) => update({ menu: id, filters: null });

  const commitSearch = (text) => {
    log('branch: search committed', { length: text.trim().length });
    update({ q: text.trim(), typed: null, menu: null, state: null });
  };

  const goToProfile = (id) =>
    isLive
      ? setDrawer({ id, invite: false })
      : navigate(`/recruiter/talent-search/${id}?${jobQuery}`);
  const goToInvite = (id) =>
    isLive
      ? setDrawer({ id, invite: true })
      : navigate(`/recruiter/talent-search/${id}?modal=invite&${jobQuery}`);

  const applySuggestion = (suggestion) => {
    log('branch: apply no-results suggestion', suggestion.id);
    update({ ...suggestion.apply, state: null });
  };
  const clearAllFilters = () => {
    log('branch: clear all filters');
    update({
      skills: 'none',
      exp: 'any',
      location: 'any',
      remote: null,
      radius: null,
      availability: null,
      setup: null,
      education: null,
      score: null,
      pay: null,
      verified: null,
      adult: null,
      hidePipeline: null,
      q: null,
      tab: null,
      state: null,
    });
  };

  const filterCount = [state.skills.length > 0, expId !== 'any', state.locationId !== 'any'].filter(
    Boolean
  ).length;

  return (
    <DashboardShell
      renderSidebar={({ collapsed, onToggle }) =>
        collapsed ? null : <WorkspaceSidebar onToggle={onToggle} />
      }
    >
      <div className="flex w-full flex-col pt-[32px] pb-[32px] max-md:pt-[12px] max-md:pb-[16px]">
        {/* Header — padded column. Figma gap to the filter row is 20. Sits above the sticky bar so the search suggestions overlay it. */}
        <div className="relative z-30 w-full pr-[clamp(16px,3.24vw,56px)] pb-[20px] pl-[clamp(16px,2.3vw,40px)] max-md:pb-[10px]">
          <TalentSearchHeader
            heading={heading}
            subtitle={subtitleByView[view]}
            searchValue={typed ?? query}
            onSearch={(value) =>
              update({ typed: value, menu: 'search', ...(value === '' ? { q: null } : {}) })
            }
            onSearchFocus={() => {
              if (menu !== 'search') openMenu('search');
            }}
            onSearchSubmit={commitSearch}
            searchDropdown={
              menu === 'search' ? (
                <TalentSearchSuggestions
                  typed={typed ?? query}
                  onPick={commitSearch}
                  onAskAssistant={(prompt) => {
                    log('branch', { askAssistant: prompt, destination: 'none-in-figma' });
                    closeMenu();
                  }}
                />
              ) : null
            }
            filterCount={filterCount}
            onOpenFilters={() => openMenu('more-filters')}
          />
        </div>

        {/* Full-bleed sticky bar — see TalentSearchFilterBar. */}
        <TalentSearchFilterBar
          filters={state}
          tabId={tabId}
          menu={menu}
          hideChips={view === 'first-visit'}
          onMenuChange={(id) => (id ? openMenu(id) : closeMenu())}
          onChange={filterChanges}
          onSelectTab={(id) => update({ tab: id === RESULT_TABS[0].id ? null : id })}
          moreFilters={
            <TalentSearchMoreFilters filters={state} onChange={filterChanges} onClose={closeMenu} />
          }
        />

        {/* Results — Figma: VERTICAL gap 16, pb 48, after a 40 gap. */}
        <div className="flex w-full flex-col gap-[16px] pt-[40px] pr-[clamp(16px,3.24vw,56px)] pb-[48px] pl-[clamp(16px,2.3vw,40px)] max-md:gap-[10px] max-md:pt-[10px] max-md:pb-[8px]">
          {view === 'loading' ? <TalentResultsLoading /> : null}
          {isLive ? (
            <label className="flex w-fit flex-wrap items-center gap-[8px] font-sans text-[14px] text-[#575755]">
              Searching for
              <select
                value={postings.some((p) => p.id === state.jobId) ? state.jobId : ''}
                onChange={(e) => update({ job: e.target.value || null })}
                className="h-[36px] rounded-[10px] border border-[#dbded9] bg-white px-[10px] font-sans text-[14px] text-[#1c2a21]"
              >
                <option value="">Any role (adults only)</option>
                {postings.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                    {p.type === 'internship' || p.type === 'training-program'
                      ? ' (under-18s included)'
                      : ''}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          {view === 'empty' && isLive ? (
            <div className="flex flex-col items-start gap-[10px] rounded-[16px] border border-[#e1eae2] bg-white p-[24px]">
              <h2 className="m-0 font-heading text-[20px] font-semibold text-[#1c2a21]">
                No talents match yet
              </h2>
              <p className="m-0 max-w-[560px] font-sans text-[14px] leading-[21px] text-[#575755]">
                {query.trim()
                  ? `Nobody matches \u201c${query.trim()}\u201d with these filters. Try a shorter search or another skill.`
                  : 'Nobody matches these filters. Try removing one.'}{' '}
                Talents who hide their profile, under-18s (except for internship and training
                postings) and people who blocked your company never appear.
              </p>
              <button
                type="button"
                onClick={clearAllFilters}
                className="h-[40px] cursor-pointer rounded-[10px] border-2 border-[#2a5730] bg-[#387440] px-[16px] font-sans text-[14px] font-semibold text-white"
              >
                Clear search and filters
              </button>
            </div>
          ) : null}
          {view === 'empty' && !isLive ? (
            <TalentNoResults
              onApply={applySuggestion}
              onClearAll={clearAllFilters}
              onAskAssistant={() =>
                log('branch', { askAssistant: true, destination: 'none-in-figma' })
              }
            />
          ) : null}
          {view === 'first-visit' ? (
            <TalentFirstVisit
              onSeeMatches={(role) => update({ state: null, job: role.id })}
              onPickPopular={(text) => commitSearch(text)}
            />
          ) : null}
          {view === 'results' ? (
            <>
              <CandidateGrid
                keyPrefix="a"
                candidates={visibleCandidates}
                onViewProfile={goToProfile}
                onInviteToApply={goToInvite}
              />
              {/* Signed in: one grid of real results; the insight banner and the repeated grid are Figma demo. */}
              {isLive ? null : (
                <>
                  <TalentPoolInsightBanner
                    onViewReport={() => log('branch', { viewMarketReport: true, wired: false })}
                  />
                  <CandidateGrid
                    keyPrefix="b"
                    candidates={visibleCandidates}
                    onViewProfile={goToProfile}
                    onInviteToApply={goToInvite}
                  />
                </>
              )}
            </>
          ) : null}
        </div>
      </div>
      {drawer ? (
        <LiveTalentDrawer
          key={drawer.id}
          profileId={drawer.id}
          postings={postings}
          jobId={state.jobId}
          startWithInvite={drawer.invite}
          onClose={() => setDrawer(null)}
        />
      ) : null}
      <TalentSearchMoreFiltersSheet
        open={menu === 'more-filters' && !isXlUp}
        filters={state}
        onChange={filterChanges}
        onClose={closeMenu}
      />
    </DashboardShell>
  );
};

export default TalentSearchSection;
