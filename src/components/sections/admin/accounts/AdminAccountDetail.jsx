import { debug } from '../../../../utils/debug.js';
import {
  AboutCard,
  BadgesCard,
  ExperienceCard,
  PortfolioCard,
  SkillsCard,
} from '../../talentProfile/ProfileOverviewTab.jsx';
import ProfileTabBar from '../../talentProfile/ProfileTabBar.jsx';
import { TabLayout } from '../../talentProfile/ProfileTabsUi.jsx';
import AdminAccountBar from './AdminAccountBar.jsx';
import AdminAccountHero from './AdminAccountHero.jsx';
import AdminAccountRail from './AdminAccountRail.jsx';
import { VIEWS } from './data/adminAccountDetailData.js';

const log = debug('AdminAccountDetail');

/*
 * AdminAccountDetail — the account detail body (Figma 7.1.2a-c Talent / Minor / Super Admin 8623:1242 / 8623:2039 / 8640:418285 and every dialog frame on top of it):
 * dark account bar · profile hero · the talent profile's tab bar · Overview with the read-only talent cards (About, Top skills, Experience, Portfolio) and the admin
 * right rail (Admin actions card, Account record, Badges). The profile cards are the talent profile components in their read-only form, fed by the talent demo
 * content; ⚠️ ASSUMPTION: only the Overview is drawn for staff, the other tabs only log.
 * Props: view ('talent' | 'minor' | 'suspended'), onActions(), onMessage(), onReactivate().
 */

const noop = (patch) => log('profile link (inert here):', patch);

const AdminAccountDetail = ({ view = 'talent', onActions, onMessage, onReactivate }) => {
  const v = VIEWS[view] ?? VIEWS.talent;
  const suspended = view === 'suspended';
  const primary = suspended
    ? { label: 'Reactivate', onClick: onReactivate }
    : { label: 'Admin actions', onClick: onActions };
  return (
    <div className="flex flex-col gap-[20px] pt-[12px]">
      <AdminAccountBar bar={v.bar} onMessage={onMessage} onActions={onActions} />
      <div className="flex flex-col gap-[clamp(12px,0.926vw,16px)]">
        <AdminAccountHero cover={v.cover} primary={primary} onMessage={onMessage} />
        <ProfileTabBar
          profile={{
            tab: 'overview',
            update: (patch) => log('profile tab (only Overview is drawn for staff):', patch),
          }}
        />
        <TabLayout
          tab="overview"
          left={
            <>
              <AboutCard go={noop} readOnly />
              <SkillsCard go={noop} readOnly />
              <ExperienceCard go={noop} readOnly />
              <PortfolioCard go={noop} readOnly />
            </>
          }
          right={
            <>
              <AdminAccountRail
                text={v.railText}
                primary={primary}
                onActivity={() => log('view full activity (no screen drawn)')}
              />
              <BadgesCard preview />
            </>
          }
        />
      </div>
    </div>
  );
};

export default AdminAccountDetail;
