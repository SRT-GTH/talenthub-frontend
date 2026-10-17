import {
  TalentPageBackgroundBlobBottomRightIllustration,
  TalentPageBackgroundBlobTopLeftIllustration,
  TalentPageBackgroundBlobCenterIllustration,
} from '../../shared/assets.jsx';
import { useEffect } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import DashboardTopNav from '../dashboard/DashboardTopNav.jsx';
import TalentSidebar from './TalentSidebar.jsx';
import TalentMobileNav from './TalentMobileNav.jsx';
import bgGrid from '../../../assets/community/bg-grid.png';

const log = debug('TalentDashboardShell');

/*
 * TalentDashboardShell — the `role="talent"` branch of DashboardShell (it dispatches here, so the
 * recruiter shell is untouched). Same fixed-viewport layout: top nav + rail are chrome, only <main>
 * scrolls. Rail: >= lg full TalentSidebar, md–lg compact icon rail, < md TalentMobileNav.
 * Background (Figma HM-01 grid + `bg blob` x3): grid texture in both styles; the three blobs are
 * Playful only (hidden in the Focused frames). The Ask Buddy FAB belongs to the Flows agent.
 */
const TalentDashboardShell = ({ children, talentHome, contentClassName, mainClassName }) => {
  useEffect(() => {
    log('mount', { stateKey: talentHome?.stateKey, tab: talentHome?.tab });
  }, [talentHome?.stateKey, talentHome?.tab]);

  return (
    <div className="relative flex h-screen max-lg:h-dvh w-full flex-col overflow-hidden max-lg:overflow-clip bg-[#f8f8f4]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage: `url(${bgGrid})`,
            backgroundAttachment: 'fixed',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
          }}
        />
        {/* Figma blobs (900/840/740 px art @1728): positions/sizes as vw so they scale. */}
        <div className="absolute inset-0 hidden playful:block">
          <TalentPageBackgroundBlobBottomRightIllustration className="absolute left-[67.13vw] top-[29.4vw] h-auto w-[52.08vw] max-w-none" />
          <TalentPageBackgroundBlobTopLeftIllustration className="absolute left-[-19.68vw] top-[-19.79vw] h-auto w-[48.61vw] max-w-none" />
          <TalentPageBackgroundBlobCenterIllustration className="absolute left-[32.41vw] top-[-8.8vw] h-auto w-[42.82vw] max-w-none" />
        </div>
      </div>

      <div className="relative z-10 flex min-h-0 w-full flex-1 flex-col">
        <DashboardTopNav className="shrink-0" talentHome={talentHome} />

        <div className={classNames('flex min-h-0 w-full flex-1', contentClassName)}>
          <TalentSidebar home={talentHome} className="hidden h-full lg:flex" />
          <TalentSidebar home={talentHome} compact className="hidden h-full md:flex lg:hidden" />
          <main
            className={classNames(
              'min-h-0 min-w-0 flex-1 overflow-y-auto pb-[64px] max-md:pb-[24px] md:max-lg:pb-[104px]',
              mainClassName
            )}
          >
            {children}
          </main>
        </div>

        <TalentMobileNav home={talentHome} />
      </div>
    </div>
  );
};

export default TalentDashboardShell;
