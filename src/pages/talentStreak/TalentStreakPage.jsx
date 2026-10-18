import { useEffect } from 'react';
import '../../styles/talentA11y.css';
import { debug } from '../../utils/debug.js';
import { ensurePlayfulFont } from '../../utils/ensurePlayfulFont.js';
import DashboardShell from '../../components/sections/dashboard/DashboardShell.jsx';
import UiStyleScope from '../../components/shared/UiStyleScope.jsx';
import AskBuddyFab from '../../components/sections/talentHome/AskBuddyFab.jsx';
import StreakPageHeader from '../../components/sections/talentStreak/StreakPageHeader.jsx';
import StreakPageHero from '../../components/sections/talentStreak/StreakPageHero.jsx';
import StreakPageCalendar from '../../components/sections/talentStreak/StreakPageCalendar.jsx';
import StreakMilestoneModal from '../../components/sections/talentStreak/StreakMilestoneModal.jsx';
import {
  StreakCountsCard,
  StreakLeaderboardCard,
  StreakMilestonesCard,
  StreakRemindersCard,
} from '../../components/sections/talentStreak/StreakPageCards.jsx';
import { useStreakPageState } from '../../components/sections/talentStreak/streakPageState.js';

const log = debug('TalentStreakPage');

/*
 * TalentStreakPage — `/streak`, Figma "Talent Streaks" S-07 (Playful 7534:1027 / Focused 8110:24742) and
 * S-08 `?milestone=15` (7534:1615 / 8110:25229: the 15-day modal over the page). Expanded sidebar by default,
 * no rail item highlighted (activeNav="streak"); `?rail=collapsed` shows the icon rail. Mock data only
 * (talentStreakData.js), shaped like a streak API payload.
 */
const TalentStreakPage = () => {
  const streak = useStreakPageState();
  const { data } = streak;
  const current = data.summary.current;

  useEffect(() => {
    ensurePlayfulFont();
  }, []);

  // Same marker as /home so talentA11y.css (focus ring, reduced motion) covers the portaled modal.
  useEffect(() => {
    document.documentElement.setAttribute('data-talent-home', '');
    return () => document.documentElement.removeAttribute('data-talent-home');
  }, []);

  useEffect(() => {
    log('mount', { milestone: streak.milestone, rail: streak.rail, current });
  }, [streak.milestone, streak.rail, current]);

  return (
    <DashboardShell
      role="talent"
      activeNav="streak"
      talentHome={streak}
      rail={streak.rail}
      onToggleRail={() => streak.update({ rail: streak.rail === 'collapsed' ? null : 'collapsed' })}
    >
      <UiStyleScope enabled />
      <div className="mx-auto flex w-full max-w-[1433px] flex-col gap-[24px] px-[clamp(12px,3vw,52px)] pb-[24px] pt-[clamp(16px,1.85vw,32px)] max-sm:gap-[18px]">
        <StreakPageHeader sticker={data.summary.headerSticker} />
        <div className="grid grid-cols-1 items-start gap-[24px] lg:grid-cols-[minmax(0,1fr)_minmax(300px,22.2vw)] max-lg:gap-[18px] 2xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="flex min-w-0 flex-col gap-[18px]">
            <StreakPageHero summary={data.summary} />
            <StreakPageCalendar month={data.month} />
            <StreakCountsCard />
          </div>
          <div className="flex min-w-0 flex-col gap-[16px]">
            <StreakMilestonesCard milestones={data.milestones} />
            <StreakRemindersCard reminders={data.reminders} />
            <StreakLeaderboardCard rows={data.leaderboard} />
          </div>
        </div>
      </div>
      {streak.milestone ? (
        <StreakMilestoneModal onClose={() => streak.update({ milestone: null })} />
      ) : null}
      <AskBuddyFab home={streak} />
    </DashboardShell>
  );
};

export default TalentStreakPage;
