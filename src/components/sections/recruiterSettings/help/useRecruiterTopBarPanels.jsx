import { Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import { useRecruiterHelpState } from './useRecruiterHelpState.js';
import { RECRUITER_HELP_PAGE_VALUES } from './recruiterHelpData.js';
import { useRecruiterSettingsState } from '../recruiterSettingsState.js';

const log = debug('useRecruiterTopBarPanels');

// Lazy, so the talent pages (which share DashboardShell) do not pull the recruiter menus in.
const RecruiterHelpPopover = lazy(() => import('../RecruiterHelpPopover.jsx'));
const RecruiterProfileMenu = lazy(() => import('../RecruiterProfileMenu.jsx'));
const RecruiterNotificationsPanel = lazy(() =>
  import('../../recruiterDashboard/TopBarPanels.jsx').then((m) => ({
    default: m.RecruiterNotificationsPanel,
  }))
);
const LanguageMenu = lazy(() =>
  import('../../recruiterDashboard/TopBarPanels.jsx').then((m) => ({ default: m.LanguageMenu }))
);

/*
 * Where a notifications pop-up action leads (the Dashboard canvas draws the pop-up but links none of it). App patterns:
 * the pipeline for applicant / interview rows, talent search for the empty state's "Search Talents", Settings > Notifications for the footer.
 * ⚠️ ASSUMPTION: "Shortlist" and "See Details" open the pipeline (the interview stage for the interview row); "See everything", "Mark all as read"
 * and the expand icon have no screen (no recruiter notifications page is drawn) and stay on the page.
 */
export const RECRUITER_NOTIFICATION_TARGETS = {
  shortlist: '/recruiter/application-pipeline',
  pipeline: '/recruiter/application-pipeline',
  details: '/recruiter/application-pipeline?stage=interview',
  'search-talents': '/recruiter/talent-search',
  settings: '/recruiter/settings?tab=notifications',
};

/*
 * useRecruiterTopBarPanels - the default top-bar behaviour of every recruiter page (`/recruiter/*`), merged by DashboardShell under the page's own
 * `panels` (a page that passes its own `onHelp` / `onProfile` / `onMessages` keeps it):
 *   - "?" opens the recruiter Help pop-over (`?help=page`, plus the feedback / invite dialogs `?modal=feedback|invite`), as on Settings and Job Postings;
 *   - the profile chip opens the recruiter Profile menu (`?menu=open`, SR-14); its Settings rows go to `/recruiter/settings?tab=…` off the Settings page;
 *   - the messages icon goes to the recruiter inbox `/recruiter/messages` (the sidebar's Messages item; no messages pop-up is drawn);
 *   - the bell, EN and accessibility buttons open the dashboard's pop-ups (`?panel=notifications|language|a11y`).
 * Returns null when `enabled` is false (non-recruiter pages render exactly as before).
 */
export const useRecruiterTopBarPanels = ({ enabled }) => {
  const navigate = useNavigate();
  const help = useRecruiterHelpState();
  const settings = useRecruiterSettingsState();
  if (!enabled) return null;

  const helpOpen = help.help !== '';
  const ringed = helpOpen && !RECRUITER_HELP_PAGE_VALUES.includes(help.help);
  const profileOpen = settings.get('menu') === 'open';
  const panel = settings.get('panel');

  return {
    onHelp: () => {
      log('help ->', helpOpen ? 'close' : 'open');
      help.update({ help: helpOpen ? null : 'page', q: null });
    },
    helpOpen: ringed ? 'open' : false,
    // Always mounted (it renders nothing while closed) so the "?" key shortcut works, as on Settings.
    help: (
      <Suspense fallback={null}>
        <RecruiterHelpPopover />
      </Suspense>
    ),
    onProfile: () => {
      log('profile menu ->', profileOpen ? 'close' : 'open');
      settings.update({ menu: profileOpen ? null : 'open', help: null });
    },
    profileOpen,
    profileMenu: (
      <Suspense fallback={null}>
        <RecruiterProfileMenu settings={settings} />
      </Suspense>
    ),
    // Notifications, language and accessibility: the same pop-ups as the dashboard (`?panel=notifications|language|a11y`, Figma D10 / D16 / D17).
    onNotifications: () =>
      settings.update({ panel: panel === 'notifications' ? null : 'notifications' }),
    notifications:
      panel === 'notifications' ? (
        <Suspense fallback={null}>
          <RecruiterNotificationsPanel
            onClose={() => settings.update({ panel: null })}
            onNavigate={(action) => {
              const to = RECRUITER_NOTIFICATION_TARGETS[action];
              log('notifications action', { action, to });
              if (to) navigate(to);
              else settings.update({ panel: null });
            }}
          />
        </Suspense>
      ) : null,
    onLanguage: () => settings.update({ panel: panel === 'language' ? null : 'language' }),
    language:
      panel === 'language' ? (
        <Suspense fallback={null}>
          <LanguageMenu
            onClose={() => settings.update({ panel: null })}
            onChange={() => settings.update({ panel: null })}
          />
        </Suspense>
      ) : null,
    a11yOpen: panel === 'a11y',
    onA11y: (open) => settings.update({ panel: open ? 'a11y' : null }),
    onMessages: () => {
      log('messages icon -> /recruiter/messages');
      navigate('/recruiter/messages');
    },
  };
};
