import { lazy, Suspense } from 'react';
import { debug } from '../../../utils/debug.js';
import ProfileMenu from './ProfileMenu.jsx';
import LogoutConfirm from './LogoutConfirm.jsx';
import { useTalentSettingsState } from './talentSettingsState.js';

const log = debug('TalentShellOverlays');

// The feedback / invite dialogs are built by the Help agent; they load lazily so the shell works before and after.
const SendFeedbackDialog = lazy(() => import('./SendFeedbackDialog.jsx'));
const InviteFriendDialog = lazy(() => import('./InviteFriendDialog.jsx'));

/*
 * TalentShellOverlays — the shell-level overlays of "Talent Settings & Account" (wiki/talent-settings.md),
 * mounted by TalentDashboardShell so every talent page (/home, /profile, /learning, /notifications,
 * /settings…) can open them from the URL:
 *   ?menu=open|language  ProfileMenu   ?logout=confirm  LogoutConfirm
 *   ?dialog=feedback|invite  SendFeedbackDialog / InviteFriendDialog
 * The `?help=…` pop-over states stay inside the existing HelpPopover (mounted by DashboardTopNav).
 * State comes from useTalentSettingsState(): `update(patch)` edits the URL (null removes a key).
 */
const TalentShellOverlays = () => {
  const settings = useTalentSettingsState();
  if (settings.menu || settings.logout || settings.dialog) {
    log('overlays', {
      menu: settings.menu,
      logout: settings.logout,
      dialog: settings.dialog,
    });
  }
  return (
    <>
      {settings.menu && <ProfileMenu settings={settings} />}
      {settings.logout && <LogoutConfirm settings={settings} />}
      {settings.dialog && (
        <Suspense fallback={null}>
          {settings.dialog === 'feedback' && <SendFeedbackDialog settings={settings} />}
          {settings.dialog === 'invite' && <InviteFriendDialog settings={settings} />}
        </Suspense>
      )}
    </>
  );
};

export default TalentShellOverlays;
