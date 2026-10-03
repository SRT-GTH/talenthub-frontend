import { useEffect, useState } from 'react';
import DashboardShell from '../dashboard/DashboardShell.jsx';
import TalentSearchHeader from './TalentSearchHeader.jsx';
import TalentSearchFilterBar from './TalentSearchFilterBar.jsx';
import CandidateCard from './CandidateCard.jsx';
import TalentPoolInsightBanner from './TalentPoolInsightBanner.jsx';
import { CANDIDATES, RESULT_TABS } from './talentSearchData.js';
import { debug } from '../../../utils/debug.js';
// PLACEHOLDER AVATARS — Figma embeds its own image fills for the three
// candidates and no matching assets exist in the project yet. Existing
// community portraits stand in so the layout is honest about its shape; swap
// these three imports for src/assets/talentSearch/avatar-<name>.png when the
// real photography lands. Flagged in the delivery report.
import avatarKofi from '../../../assets/community/avatar-samuel-boateng.png';
import avatarAma from '../../../assets/community/avatar-akosua-mansa.png';
import avatarGodfred from '../../../assets/community/avatar-michael-asante.png';

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
 * NOT BUILT — hidden in Figma: the trust bar (7249:74289) and the Ask Buddy
 * FAB (7249:74311, already supplied by DashboardShell). 7249:74936 is a Safari
 * browser-chrome mockup and 7249:75042 a stray avatar showcase.
 */
const AVATARS = {
  'kofi-amankwah': avatarKofi,
  'ama-boateng': avatarAma,
  'godfred-ansah': avatarGodfred,
};

const CandidateGrid = ({ keyPrefix, onViewProfile, onStartConversation }) => (
  // Figma lm=GRID: 3 x 432.33 + 2 x 16 = 1329
  <div className="grid w-full grid-cols-1 gap-[16px] md:grid-cols-2 xl:grid-cols-3">
    {CANDIDATES.map((candidate) => (
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
  const [activeTabId, setActiveTabId] = useState(RESULT_TABS[0].id);

  useEffect(() => {
    log('mount', { route: '/recruiter/talent-search', candidateCount: CANDIDATES.length });
  }, []);

  const handleViewProfile = (id) => {
    // No candidate-profile frame exists in this Figma set yet.
    log('branch', { viewProfile: id, destination: 'none-in-figma' });
  };

  const handleStartConversation = (id) => {
    log('branch', { startConversation: id, destination: 'none-in-figma' });
  };

  return (
    <DashboardShell>
      <div className="flex w-full flex-col pb-[32px] pt-[32px]">
        {/* Header — padded column. Figma gap to the filter row is 20. */}
        <div className="w-full pb-[20px] pl-[clamp(16px,2.3vw,40px)] pr-[clamp(16px,3.24vw,56px)]">
          <TalentSearchHeader onSearch={(value) => log('search', { length: value.length })} />
        </div>

        {/* Full-bleed sticky bar — see LAYOUT NOTE above. */}
        <TalentSearchFilterBar
          activeTabId={activeTabId}
          onSelectTab={setActiveTabId}
          onOpenMoreFilters={() => log('branch', { moreFilters: true, wired: false })}
        />

        {/* Results — Figma 7249:74362: VERTICAL gap 16, pb 48, after a 40 gap. */}
        <div className="flex w-full flex-col gap-[16px] pb-[48px] pl-[clamp(16px,2.3vw,40px)] pr-[clamp(16px,3.24vw,56px)] pt-[40px]">
          <CandidateGrid
            keyPrefix="a"
            onViewProfile={handleViewProfile}
            onStartConversation={handleStartConversation}
          />
          <TalentPoolInsightBanner
            onViewReport={() => log('branch', { viewMarketReport: true, wired: false })}
          />
          <CandidateGrid
            keyPrefix="b"
            onViewProfile={handleViewProfile}
            onStartConversation={handleStartConversation}
          />
        </div>
      </div>
    </DashboardShell>
  );
};

export default TalentSearchSection;
