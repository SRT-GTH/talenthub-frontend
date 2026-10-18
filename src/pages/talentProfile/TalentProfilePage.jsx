import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import '../../styles/talentA11y.css';
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
import ProfileAccessibilityPanel from '../../components/sections/talentProfile/ProfileAccessibilityPanel.jsx';
import { applyProfileData } from '../../components/sections/talentProfile/talentProfileTabsData.js';
import { buildProfileData } from '../../components/sections/talentProfile/talentProfileLive.js';
import { fetchTalentProfile } from '../../services/talentProfile.api.js';
import { isLoggedIn } from '../../services/auth.api.js';

const log = debug('TalentProfilePage');

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
/*
 * Live data (2026-10-18): a logged-in talent sees their real profile (talentProfileLive.js maps it
 * onto the same shapes as the Figma demo). `?demo=1` or a logged-out visit keeps the demo data.
 */
const useLiveProfileData = () => {
  const [params] = useSearchParams();
  const live = params.get('demo') !== '1' && isLoggedIn();
  const [state, setState] = useState({ status: live ? 'loading' : 'demo', version: 0 });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!live) {
      applyProfileData(null);
      setState((s) => ({ status: 'demo', version: s.version + 1 }));
      return undefined;
    }
    let cancelled = false;
    setState((s) => ({ ...s, status: 'loading' }));
    fetchTalentProfile()
      .then((raw) => {
        if (cancelled) return;
        applyProfileData(buildProfileData(raw));
        setState((s) => ({ status: 'live', version: s.version + 1 }));
      })
      .catch((err) => {
        if (cancelled) return;
        log.error('profile load failed:', err?.code || err?.message);
        setState((s) => ({ ...s, status: 'error' }));
      });
    return () => {
      cancelled = true;
    };
  }, [live, attempt]);
  return { ...state, retry: () => setAttempt((n) => n + 1) };
};

const TalentProfilePage = () => {
  const profile = useTalentProfileState();
  const data = useLiveProfileData();

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

  const Body = TAB_BODIES[profile.tab] ?? ProfileOverviewTab;

  return (
    <DashboardShell role="talent" activeNav="profile" talentHome={profile}>
      <UiStyleScope enabled />
      <div className="flex flex-col gap-[clamp(12px,0.926vw,16px)] px-[clamp(12px,1.4vw,24px)] py-[clamp(12px,1.2vw,20px)]">
        {profile.view ? <ProfilePreviewBanner profile={profile} /> : null}
        {data.status === 'loading' ? (
          <p role="status" className="px-[8px] py-[40px] text-center text-[15px] text-[#737373]">
            Loading your profile…
          </p>
        ) : data.status === 'error' ? (
          <div role="alert" className="flex flex-col items-center gap-[12px] py-[40px] text-center">
            <p className="text-[15px] text-[#1c2a21]">We couldn’t load your profile.</p>
            <button
              type="button"
              onClick={data.retry}
              className="rounded-full border border-[#1c2a21] px-[16px] py-[8px] text-[14px] font-semibold"
            >
              Try again
            </button>
          </div>
        ) : profile.view ? (
          // P-07 / PR-02 / PR-04: recruiter + public-link previews live INSIDE the talent shell (Figma frames
          // carry the sidebar + nav); `PublicProfileView` renders the previewed profile.
          <PublicProfileView profile={profile} />
        ) : profile.empty ? (
          <ProfileEmptyState profile={profile} />
        ) : (
          <>
            <ProfileHeader key={`h-${data.version}`} profile={profile} />
            <ProfileTabBar key={`t-${data.version}`} profile={profile} />
            {profile.edit === 'about' ? (
              <ProfileEditAbout profile={profile} />
            ) : (
              <Body key={`b-${data.version}`} profile={profile} />
            )}
          </>
        )}
      </div>
      {profile.modal === 'experience' && <AddExperienceModal profile={profile} />}
      {profile.manage && <ManageVisibilityDrawer profile={profile} />}
      {profile.share && profile.share !== 'whatsapp' && <ShareProfileModal profile={profile} />}
      {profile.share === 'whatsapp' && <WhatsAppStatusSheet profile={profile} />}
      {profile.card && <ShareCardBuilder profile={profile} />}
      {profile.ax && <ProfileAccessibilityPanel profile={profile} />}
    </DashboardShell>
  );
};

export default TalentProfilePage;
