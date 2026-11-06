import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import DashboardShell from '../dashboard/DashboardShell.jsx';
import TalentSearchHeader from './TalentSearchHeader.jsx';
import TalentSearchFilterBar from './TalentSearchFilterBar.jsx';
import TalentSearchFilterSheet from './TalentSearchFilterSheet.jsx';
import CandidateCard from './CandidateCard.jsx';
import TalentPoolInsightBanner from './TalentPoolInsightBanner.jsx';
import {
  CANDIDATES,
  FILTER_CHIPS,
  NO_RESULTS_LABEL,
  RESULT_TABS,
  TOP_MATCH_THRESHOLD_PERCENT,
} from './talentSearchData.js';
import { debug } from '../../../utils/debug.js';
import avatarKofiAmankwah from '../../../assets/recruiter/talent-search/candidate-avatar-kofi-amankwah.webp';
import avatarAmaBoateng from '../../../assets/recruiter/talent-search/candidate-avatar-ama-boateng.webp';
import avatarGodfredAnsah from '../../../assets/recruiter/talent-search/candidate-avatar-godfred-ansah.webp';

const log = debug('TalentSearchSection');

/*
 * TalentSearchSection — the recruiter talent-search results screen.
 * Source: Figma 7249:74283 "Recruiter Talent Search", canvas 7249:74314
 * (VERTICAL, gap 40, py 32, width 1329).
 *
 * User story: Theme 6 / Epic 6.1.2 — Talent Discovery & Matching. A recruiter
 * reviews AI-ranked candidates for an open role, narrows them with filters,
 * and moves the strongest matches into a conversation.
 *
 * Chrome is DashboardShell (top nav, rail, background), same as every other
 * recruiter screen — this section contributes only the content column.
 *
 * LAYOUT NOTE — the filter bar is deliberately NOT inside the padded content
 * wrappers. Figma annotates it "This section becomes fixed on scroll", and a
 * `sticky` element sticks to its container's padding edge, so it is rendered
 * as a full-bleed sibling that carries its own horizontal padding. The header
 * and results columns keep theirs.
 *
 * GRID — Figma draws two grids of three cards (7249:74363 and 7249:74602)
 * separated by the insight banner. The second grid's text is byte-identical to
 * the first, so the same three records render twice, exactly as designed.
 *
 * URL STATE (query string on /recruiter/talent-search)
 *   (none)                7249:74283  "All Matches" tab, both grids + insight banner (the frame)
 *   ?tab=top-matches      "Top Matches" tab active (matchPercent >= 80)       ⚠️ ASSUMPTION filter rule
 *   ?tab=available-now    "Available now" tab active (available candidates)   ⚠️ ASSUMPTION filter rule
 *   ?q=<text>             search-by-name-or-keyword field filled + results filtered
 *   ?filters=open         the phone filter sheet open (design of our own, not in Figma)
 * Clicking a tab / typing / opening the sheet writes the same keys.
 *
 * NOT BUILT — hidden in Figma: the trust bar (7249:74289) and the Ask Buddy
 * FAB (7249:74311, already supplied by DashboardShell). 7249:74936 is a Safari
 * browser-chrome mockup and 7249:75042 a stray avatar showcase.
 */
const AVATARS = {
  'kofi-amankwah': avatarKofiAmankwah,
  'ama-boateng': avatarAmaBoateng,
  'godfred-ansah': avatarGodfredAnsah,
};

const CandidateGrid = ({ keyPrefix, candidates, onViewProfile, onStartConversation }) => (
  // Figma lm=GRID: 3 x 432.33 + 2 x 16 = 1329
  <div className="grid w-full grid-cols-1 gap-[16px] max-md:gap-[10px] md:grid-cols-2 xl:grid-cols-3">
    {candidates.map((candidate) => (
      <CandidateCard
        key={`${keyPrefix}-${candidate.id}`}
        candidate={candidate}
        avatarSrc={AVATARS[candidate.id]}
        onViewProfile={onViewProfile}
        onStartConversation={onStartConversation}
      />
    ))}
  </div>
);

const TalentSearchSection = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const activeTabId = RESULT_TABS.some((tab) => tab.id === tabParam) ? tabParam : RESULT_TABS[0].id;
  const searchText = searchParams.get('q') ?? '';
  const filterSheetOpen = searchParams.get('filters') === 'open';

  const updateParams = (changes) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(changes).forEach(([key, value]) => {
      if (value === null || value === '') next.delete(key);
      else next.set(key, value);
    });
    setSearchParams(next, { replace: true });
  };

  useEffect(() => {
    log('mount', { route: '/recruiter/talent-search', candidateCount: CANDIDATES.length });
  }, []);

  useEffect(() => {
    log('state', { activeTabId, searchLength: searchText.length, filterSheetOpen });
  }, [activeTabId, searchText, filterSheetOpen]);

  const visibleCandidates = useMemo(() => {
    const needle = searchText.trim().toLowerCase();
    const result = CANDIDATES.filter((candidate) => {
      if (activeTabId === 'top-matches' && candidate.matchPercent < TOP_MATCH_THRESHOLD_PERCENT)
        return false;
      if (activeTabId === 'available-now' && !candidate.available) return false;
      if (!needle) return true;
      return [candidate.name, candidate.role, ...candidate.tags, ...candidate.topSkills]
        .join(' ')
        .toLowerCase()
        .includes(needle);
    });
    log('branch: visible candidates', { activeTabId, needle, count: result.length });
    return result;
  }, [activeTabId, searchText]);

  const handleViewProfile = (id) => {
    // No candidate-profile frame exists in this Figma set yet.
    log('branch', { viewProfile: id, destination: 'none-in-figma' });
  };

  const handleStartConversation = (id) => {
    log('branch', { startConversation: id, destination: 'none-in-figma' });
  };

  return (
    <DashboardShell>
      <div className="flex w-full flex-col pb-[32px] pt-[32px] max-md:pb-[16px] max-md:pt-[12px]">
        {/* Header — padded column. Figma gap to the filter row is 20. */}
        <div className="w-full pb-[20px] max-md:pb-[10px] pl-[clamp(16px,2.3vw,40px)] pr-[clamp(16px,3.24vw,56px)]">
          <TalentSearchHeader
            searchValue={searchText}
            onSearch={(value) => updateParams({ q: value })}
            filterCount={FILTER_CHIPS.length}
            onOpenFilters={() => updateParams({ filters: 'open' })}
          />
        </div>

        {/* Full-bleed sticky bar — see LAYOUT NOTE above. */}
        <TalentSearchFilterBar
          activeTabId={activeTabId}
          onSelectTab={(id) => updateParams({ tab: id === RESULT_TABS[0].id ? null : id })}
          onOpenMoreFilters={() => log('branch', { moreFilters: true, wired: false })}
        />

        {/* Results — Figma 7249:74362: VERTICAL gap 16, pb 48, after a 40 gap. */}
        <div className="flex w-full flex-col gap-[16px] pb-[48px] pl-[clamp(16px,2.3vw,40px)] pr-[clamp(16px,3.24vw,56px)] pt-[40px] max-md:gap-[10px] max-md:pb-[8px] max-md:pt-[10px]">
          {visibleCandidates.length === 0 && (
            <p className="py-[24px] text-center font-sans text-[14px] text-content-helper">
              {NO_RESULTS_LABEL}
            </p>
          )}
          <CandidateGrid
            keyPrefix="a"
            candidates={visibleCandidates}
            onViewProfile={handleViewProfile}
            onStartConversation={handleStartConversation}
          />
          <TalentPoolInsightBanner
            onViewReport={() => log('branch', { viewMarketReport: true, wired: false })}
          />
          <CandidateGrid
            keyPrefix="b"
            candidates={visibleCandidates}
            onViewProfile={handleViewProfile}
            onStartConversation={handleStartConversation}
          />
        </div>
      </div>
      <TalentSearchFilterSheet
        isOpen={filterSheetOpen}
        onClose={() => updateParams({ filters: null })}
      />
    </DashboardShell>
  );
};

export default TalentSearchSection;
