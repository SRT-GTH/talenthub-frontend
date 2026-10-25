import markMinor from '../../../../../assets/admin/account-mark-minor.svg';
import markRecruiter from '../../../../../assets/admin/account-mark-recruiter.svg';
import markTalent from '../../../../../assets/admin/account-mark-talent.svg';

/*
 * adminAccountsData — mock data and copy of the Accounts section (Figma canvas 8520:12, frames 7.1.1a "Accounts · Search results" 8623:725 and 7.1.1b
 * "Accounts · No results" 8640:417819). ⚠️ ASSUMPTION: frontend only, a handful of fixed sample accounts. Contact details are drawn already masked.
 */

export const ACCOUNT_TOTAL = '219,428';
export const DEFAULT_QUERY = 'Kwame';
export const SUBTITLE =
  'Search every account on GTH: talents, parents, recruiters, partners, institutions and agencies. Contact details stay masked.';
export const SUBTITLE_EMPTY =
  'Search every account on GTH. Contact details stay masked for your role';

/** The one account the detail screens (7.1.2-7.1.6) draw. */
export const DETAIL_ID = 'TAL-204-8812';

export const TABS_RESULTS = [
  { id: 'talents', label: 'Talents', count: '201,334' },
  { id: 'orgs', label: 'Organisations', count: '1,218' },
  { id: 'all', label: 'All', count: ACCOUNT_TOTAL },
  { id: 'staff', label: 'Staff', count: '14' },
];
/* The no-results frame draws its tabs in a different order (Staff before All) with zero counts, Talents selected. */
export const TABS_EMPTY = [
  { id: 'talents', label: 'Talents', count: '0' },
  { id: 'orgs', label: 'Organisations', count: '0' },
  { id: 'staff', label: 'Staff', count: '0' },
  { id: 'all', label: 'All', count: '0' },
];

export const CHIPS_RESULTS = [
  { id: 'all', label: 'All 47' },
  { id: 'active', label: 'Active 44' },
  { id: 'suspended', label: 'Suspended 3' },
];
export const CHIPS_EMPTY = [
  { id: 'all', label: 'All' },
  { id: 'q', label: '“Kwamme”' },
  { id: 'suspended', label: 'Suspended' },
  { id: 'region', label: 'Upper West' },
  { id: 'week', label: 'Joined this week' },
];

export const BANNER =
  'Showing 47 of 312 results for “Kwame”. Ghana Card numbers stay masked for your role.';

/* tone of a row chip: 'amber' (status / age flag, with an eye), 'green' (check), 'grey' (plain) */
export const ACCOUNT_ROWS = [
  {
    id: 'a1',
    name: 'Kwame Asante',
    kind: 'Talent',
    mark: 'talent',
    sub: 'k•••@gmail.com · +233 •• ••• 4471 · joined 12 Mar 2025',
    chips: [
      { label: 'Active', tone: 'amber' },
      { label: 'Greater Accra', tone: 'green' },
      { label: 'Tema', tone: 'grey' },
    ],
    open: 'strong',
    age: '2h',
    to: '/admin/accounts/TAL-204-8812',
  },
  {
    id: 'a2',
    name: 'Kwame Boateng',
    kind: null,
    mark: 'minor',
    sub: 'k•••@yahoo.com · joined 2 Sep 2026 · under 18',
    chips: [
      { label: 'Minor · parent-linked', tone: 'amber' },
      { label: 'Ashanti', tone: 'green' },
      { label: 'Tema', tone: 'grey' },
    ],
    open: 'soft',
    age: '1d',
    to: '/admin/accounts/TAL-204-8812?view=minor',
  },
  {
    id: 'a3',
    name: 'Kwame Mensah',
    kind: 'Recruiter',
    mark: 'recruiter',
    sub: 'k•••@mtn.com.gh · MTN Ghana · suspended 14 Oct',
    chips: [
      { label: 'Suspended', tone: 'green' },
      { label: 'Ashanti', tone: 'green' },
      { label: '14 Oct', tone: 'grey' },
    ],
    open: 'soft',
    age: '9d',
    suspended: true,
    to: '/admin/accounts/TAL-204-8812',
  },
];

export const EMPTY = {
  title: 'No accounts found',
  text: 'Try adjusting your search or filters.',
  steps: [
    { id: 's1', icon: 'plus', title: 'Search “Kwame” instead', meta: '312 accounts' },
    { id: 's2', icon: 'spark', title: 'Remove “Suspended”', meta: '41 accounts' },
    { id: 's3', icon: 'user', title: 'Search all regions', meta: '7 accounts' },
  ],
  reset: 'Reset filters',
  byId: 'Search by account ID',
};

/* The queue configuration of the two Accounts frames (consumed by queue/AdminQueueView). `onReactivate` is wired by the page. */
const MARKS = { talent: markTalent, minor: markMinor, recruiter: markRecruiter };

export const accountsConfig = (empty) =>
  empty
    ? {
        title: 'Accounts',
        sticker: '0 results',
        subtitle: SUBTITLE_EMPTY,
        tabs: TABS_EMPTY,
        tabTone: 'green',
        defaultTab: 'talents',
        chips: CHIPS_EMPTY,
        chipsDim: true,
        defaultView: 'cards',
        sort: 'Last active',
        action: 'Filters · 3',
        empty: {
          title: EMPTY.title,
          text: EMPTY.text,
          steps: EMPTY.steps.map((st) => ({ ...st, to: '/admin/accounts' })),
          primary: EMPTY.reset,
          onPrimary: '/admin/accounts',
          secondary: EMPTY.byId,
        },
      }
    : {
        title: 'Accounts',
        sticker: `${ACCOUNT_TOTAL} accounts`,
        subtitle: SUBTITLE,
        tabs: TABS_RESULTS,
        tabTone: 'ink',
        defaultTab: 'all',
        chips: CHIPS_RESULTS,
        defaultView: 'list',
        sort: 'Last active',
        action: 'Filters · 3',
        banner: BANNER,
        rows: ACCOUNT_ROWS.map((r) => ({
          id: r.id,
          lead: { src: MARKS[r.mark] },
          title: r.name,
          sticker: r.kind,
          sub: r.sub,
          chips: r.chips,
          pill: { label: 'Open', strong: r.open === 'strong' },
          age: r.age,
          muted: r.suspended,
          button: r.suspended ? 'Reactivate' : null,
          to: r.to,
        })),
      };
