import { useEffect } from 'react';
import DashboardShell from '../dashboard/DashboardShell.jsx';
import RecruiterWelcomeHero from './RecruiterWelcomeHero.jsx';
import RecruiterQuickActions from './RecruiterQuickActions.jsx';
import RecruiterGetReadyCard from './RecruiterGetReadyCard.jsx';
import RecruiterUnlockCards from './RecruiterUnlockCards.jsx';
import RecruiterHiringOverview from './RecruiterHiringOverview.jsx';
import RecruiterApplicantsTable from './RecruiterApplicantsTable.jsx';
import { useRecruiterHomeState } from './recruiterHomeState.js';
import { debug } from '../../../utils/debug.js';

const log = debug('RecruiterHomeSection');

/*
 * RecruiterHomeSection — the recruiter dashboard home, two layouts chosen by the URL (?user=new | existing, see recruiterHomeState.js for
 * every key and the Figma frame each URL reproduces):
 *   new user      — hero, quick actions, "Let's get you ready" checklist, unlock cards   (Figma 7249:73882, content column 7249:73913)
 *   existing user — hero, quick actions, stats + recommendation, applicants table + pagination, unlock cards (Figma 8063:45341 and
 *                   8193:78567 / 8193:79434 / 8193:80078, which differ only in which row-action menu is open)
 * Content column: VERTICAL, gap 30, pad T28 B28, width 1329.
 *
 * User story: Theme 6 / Epic 6.1.1 (Opportunity Posting & Creation) seen from
 * the recruiter side — an existing recruiter lands here, reads their hiring
 * status at a glance, and is nudged through the profile-completion steps that
 * unlock matching features.
 *
 * CHROME IS REUSED, NOT REBUILT. The top nav (7249:74197), sidebar
 * (7249:74069) and the grid+ellipse background on this frame are the same
 * components already shipped for /community — wiki/components.md records that
 * all of those were themselves built from frames titled "Recruiter Home-
 * Existing user". So this screen only contributes the content column and
 * mounts it inside DashboardShell.
 *
 * `⚠️ ASSUMPTION` — DashboardShell is named for the first screens that used
 * it, but it is really the recruiter dashboard shell. Renaming it to
 * DashboardShell would touch both shipped community pages, so it is left
 * alone here and flagged as a follow-up instead.
 *
 * NOT BUILT — hidden in Figma, so deliberately absent: the trust/ratings bar
 * (7249:73888) and the "Ask Buddy" FAB (7249:73910, already provided by
 * DashboardShell's CareerBuddyFloatingButton). The Safari toolbar
 * (7249:74173) is a browser-chrome mockup, and 7249:74279 is a stray avatar
 * showcase sitting outside the layout.
 */
const RecruiterHomeSection = () => {
  const { userKind, actionsMenuApplicantId, hoveredActionId, setActionsMenuApplicantId } =
    useRecruiterHomeState();

  useEffect(() => {
    log('mount', { route: '/recruiter/home' });
  }, []);

  useEffect(() => {
    log('layout', { userKind, actionsMenuApplicantId, hoveredActionId });
  }, [userKind, actionsMenuApplicantId, hoveredActionId]);

  const handleQuickAction = (id) => {
    // None of the four shortcuts have destination frames in this Figma set,
    // so intent is logged rather than navigating somewhere invented.
    log('branch', { quickAction: id, destination: 'none-in-figma' });
  };

  const handleChecklistAction = (id) => {
    log('branch', { checklistAction: id, destination: 'none-in-figma' });
  };

  const handleCustomize = () => {
    log('branch', { customize: true, destination: 'none-in-figma' });
  };

  return (
    <DashboardShell>
      {/* Figma: column starts 40px after the rail and ends 56px from the screen
          edge (x343 → 1672 on a 1728 frame), 28px top/bottom, 30px row gap.
          Side padding is clamped so it compresses on narrower viewports. */}
      <div className="flex w-full flex-col gap-[30px] py-[28px] pl-[clamp(16px,2.3vw,40px)] pr-[clamp(16px,3.24vw,56px)] max-md:gap-[12px] max-md:py-[12px]">
        <RecruiterWelcomeHero onCustomize={handleCustomize} />
        <RecruiterQuickActions onSelect={handleQuickAction} />
        {userKind === 'existing' ? (
          <>
            <RecruiterHiringOverview />
            <RecruiterApplicantsTable
              actionsMenuApplicantId={actionsMenuApplicantId}
              hoveredActionId={hoveredActionId}
              onActionsMenuChange={setActionsMenuApplicantId}
            />
          </>
        ) : (
          <RecruiterGetReadyCard onItemAction={handleChecklistAction} />
        )}
        <RecruiterUnlockCards />
      </div>
    </DashboardShell>
  );
};

export default RecruiterHomeSection;
