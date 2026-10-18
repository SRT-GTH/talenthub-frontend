import { useEffect } from 'react';
import '../../styles/talentA11y.css';
import '../../styles/profileA11y.css';
import { debug } from '../../utils/debug.js';
import { ensurePlayfulFont } from '../../utils/ensurePlayfulFont.js';
import DashboardShell from '../../components/sections/dashboard/DashboardShell.jsx';
import UiStyleScope from '../../components/shared/UiStyleScope.jsx';
import { useTalentProfileState } from '../../components/sections/talentProfile/talentProfileState.js';
import ProfileHeader from '../../components/sections/talentProfile/ProfileHeader.jsx';
import ProfileTabBar from '../../components/sections/talentProfile/ProfileTabBar.jsx';
import ProfileOverviewTab from '../../components/sections/talentProfile/ProfileOverviewTab.jsx';
import ProfileSkillsTab from '../../components/sections/talentProfile/ProfileSkillsTab.jsx';
import ProfileExperienceTab from '../../components/sections/talentProfile/ProfileExperienceTab.jsx';
import ProfilePortfolioTab from '../../components/sections/talentProfile/ProfilePortfolioTab.jsx';
import ProfileCertsTab from '../../components/sections/talentProfile/ProfileCertsTab.jsx';
import ProfileAboutTab from '../../components/sections/talentProfile/ProfileAboutTab.jsx';
import ProfileEditAbout from '../../components/sections/talentProfile/ProfileEditAbout.jsx';
import AddExperienceModal from '../../components/sections/talentProfile/AddExperienceModal.jsx';
import ProfileEmptyState from '../../components/sections/talentProfile/ProfileEmptyState.jsx';
import ProfilePreviewBanner from '../../components/sections/talentProfile/ProfilePreviewBanner.jsx';
import PublicProfileView from '../../components/sections/talentProfile/PublicProfileView.jsx';
import ManageVisibilityDrawer from '../../components/sections/talentProfile/ManageVisibilityDrawer.jsx';
import ShareProfileModal from '../../components/sections/talentProfile/ShareProfileModal.jsx';
import WhatsAppStatusSheet from '../../components/sections/talentProfile/WhatsAppStatusSheet.jsx';
import ShareCardBuilder from '../../components/sections/talentProfile/ShareCardBuilder.jsx';
import ProfileA11yPills from '../../components/sections/talentProfile/ProfileA11yPills.jsx';
import { useProfileA11y } from '../../components/sections/talentProfile/useProfileA11y.js';
import ProfileAccessibilityPanel from '../../components/sections/talentProfile/ProfileAccessibilityPanel.jsx';

const log = debug('TalentProfilePage');

// AX frames that are drawn on a specific tab / with the share modal open (wiki/talent-profile.md).
const AX_TAB = { pitch: 'about', images: 'portfolio', alt: 'portfolio' };

const TAB_BODIES = {
  overview: ProfileOverviewTab,
  skills: ProfileSkillsTab,
  experience: ProfileExperienceTab,
  portfolio: ProfilePortfolioTab,
  certs: ProfileCertsTab,
  about: ProfileAboutTab,
};

/*
 * TalentProfilePage — `/profile`, Figma "Talent – Profile" (7500:92566), Focused + Playful in one build.
 * Frame <-> URL table and file ownership: wiki/talent-profile.md. State is chosen from the URL
 * (talentProfileState.js). `?view=recruiter|public` (P-07 / PR-02 / PR-04) render inside the talent shell.
 */
const TalentProfilePage = () => {
  const profile = useTalentProfileState();

  useEffect(() => {
    ensurePlayfulFont();
  }, []);

  // Marks <html> while mounted so talentA11y.css (focus ring, reduced motion) covers portaled dialogs.
  useEffect(() => {
    document.documentElement.setAttribute('data-talent-home', '');
    return () => document.documentElement.removeAttribute('data-talent-home');
  }, []);

  useEffect(() => {
    log('mount', {
      tab: profile.tab,
      view: profile.view,
      share: profile.share,
      card: profile.card,
    });
  }, [profile.tab, profile.view, profile.share, profile.card]);

  const { prefs, setPref, effective } = useProfileA11y(profile);

  // What the page renders: the AX frames force the tab / the share modal they show.
  const forcedTab = AX_TAB[profile.ax];
  const page =
    forcedTab || profile.ax === 'share-modal'
      ? {
          ...profile,
          tab: forcedTab ?? profile.tab,
          share: profile.ax === 'share-modal' ? 'open' : profile.share,
        }
      : profile;

  useEffect(() => {
    log('a11y', effective);
  }, [effective]);

  const Body = TAB_BODIES[page.tab] ?? ProfileOverviewTab;
  const openPanel = (scope) => {
    setPref('scope', scope);
    profile.update({ ax: 'panel' });
  };

  return (
    <DashboardShell role="talent" activeNav="profile" talentHome={profile}>
      <UiStyleScope enabled />
      <div className="flex flex-col gap-[clamp(12px,0.926vw,16px)] px-[clamp(12px,1.4vw,24px)] py-[clamp(12px,1.2vw,20px)]">
        <ProfileA11yPills effective={effective} onOpenPanel={openPanel} />
        <div
          className="flex flex-col gap-[clamp(12px,0.926vw,16px)]"
          data-profile-calm={effective.calm ? '' : undefined}
          data-profile-text={effective.size !== 'medium' ? effective.size : undefined}
          data-profile-onecol={effective.oneColumn ? '' : undefined}
          data-profile-contrast={effective.contrast ? '' : undefined}
          data-profile-links={effective.links ? '' : undefined}
        >
          {profile.view ? <ProfilePreviewBanner profile={profile} /> : null}
          {profile.view ? (
            // P-07 / PR-02 / PR-04: recruiter + public-link previews live INSIDE the talent shell (Figma frames
            // carry the sidebar + nav); `PublicProfileView` renders the previewed profile.
            <PublicProfileView profile={profile} />
          ) : profile.empty ? (
            <ProfileEmptyState profile={profile} />
          ) : (
            <>
              <ProfileHeader profile={page} />
              <ProfileTabBar profile={page} />
              {profile.edit === 'about' ? (
                <ProfileEditAbout profile={profile} />
              ) : (
                <Body profile={page} />
              )}
            </>
          )}
        </div>
      </div>
      {profile.modal === 'experience' && <AddExperienceModal profile={profile} />}
      {profile.manage && <ManageVisibilityDrawer profile={profile} />}
      {page.share && page.share !== 'whatsapp' && <ShareProfileModal profile={page} />}
      {profile.share === 'whatsapp' && <WhatsAppStatusSheet profile={profile} />}
      {profile.card && <ShareCardBuilder profile={profile} />}
      {profile.ax && (
        <ProfileAccessibilityPanel
          profile={page}
          prefs={prefs}
          setPref={setPref}
          effective={effective}
        />
      )}
    </DashboardShell>
  );
};

export default TalentProfilePage;
