import { isLoggedIn } from '../../../services/auth.api.js';
import { dash, useRecruiterShell } from '../../../hooks/useRecruiterShell.js';
import { SIDEBAR_PROFILE, SIDEBAR_PUBLIC_PROFILE } from './dashboardData.js';

const DASH = '\u2014';

/*
 * useSidebarProfile — the profile card of the recruiter rail (DashboardSidebar), the phone More sheet and the public-profile card.
 * ADR-15: the drawn "Joel Adade Kofie · HR Lead · Silver Rock Technology" card and its counts are sample data. A signed-in recruiter
 * sees their own name, organisation, company-profile progress and counts (the recruiter shell, as on the workspace rail); any other
 * signed-in session gets an empty card; demo and preview pages keep the drawn one.
 * Returns { live, initials, profile (SIDEBAR_PROFILE shape), publicProfile (SIDEBAR_PUBLIC_PROFILE shape) }.
 */
export const useSidebarProfile = () => {
  const shell = useRecruiterShell();
  if (shell) {
    const completion = shell.companyCompletion;
    const known = typeof completion === 'number';
    return {
      live: true,
      initials: shell.initials || '',
      profile: {
        ...SIDEBAR_PROFILE,
        name: shell.fullName || '\u00a0',
        badge: shell.plan?.badge || 'Free',
        meta: ['Recruiter', shell.orgName, shell.place].filter(Boolean).join(' · '),
        progressNote: known ? `Company profile ${completion}% complete` : '',
        gettingStartedLabel: 'Company profile',
        gettingStartedCount: known ? `${completion}%` : DASH,
        gettingStartedPercent: known ? Math.min(100, completion) : 0,
        continueLabel: known && completion >= 100 ? 'Company profile complete' : 'Continue setup →',
        stats: [
          {
            id: 'active-jobs',
            value: dash(shell.jobs ? shell.jobs.active : null),
            label: 'Active Jobs',
          },
          { id: 'applicants', value: dash(shell.applicants), label: 'Applicants' },
          { id: 'messages', value: dash(shell.conversations), label: 'Messages' },
        ],
      },
      publicProfile: {
        ...SIDEBAR_PUBLIC_PROFILE,
        url: shell.publicSlug ? `gth.com/recruiter/${shell.publicSlug}` : '',
      },
    };
  }
  if (isLoggedIn()) {
    return {
      live: true,
      initials: '',
      profile: {
        ...SIDEBAR_PROFILE,
        name: '\u00a0',
        badge: '',
        meta: '',
        progressNote: '',
        gettingStartedCount: DASH,
        gettingStartedPercent: 0,
        stats: SIDEBAR_PROFILE.stats.map((s) => ({ ...s, value: DASH })),
      },
      publicProfile: { ...SIDEBAR_PUBLIC_PROFILE, url: '' },
    };
  }
  return {
    live: false,
    initials: '',
    profile: SIDEBAR_PROFILE,
    publicProfile: SIDEBAR_PUBLIC_PROFILE,
  };
};
