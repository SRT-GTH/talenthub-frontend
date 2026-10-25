/*
 * adminLiveOpsData — copy of Live ops (Figma canvas 8520:12): 7.3.3a dashboard, 7.3.3b "Alert: sign-ups 4× normal in Volta", 7.3.3c "Live ops isn't available for your role".
 * ⚠️ ASSUMPTION: frontend only; the 30-second refresh is not simulated (Pause updates only toggles the label). Region tiles are a schematic, not a geographic map.
 */

export const LIVE = {
  title: 'Live ops',
  subtitle:
    'Updates every 30 seconds. Aggregated by region, no individual tracking. Last update 09:42:30.',
  pause: 'Pause updates',
  resume: 'Resume updates',
  filters: ['Filter', 'Region', 'Platform', 'User type', 'Feature', 'Status'],
  online: '1,842 online',
  clear: 'Clear all',
  mute: 'Mute alerts',
  hero: {
    eyebrow: 'People online now',
    count: 1842,
    label: 'across web and mobile',
    change: { pct: 12, suffix: 'vs this time last week' },
    note: 'Peak today 2,310 at 10:40',
    series: [980, 1120, 1260, 1190, 1420, 1580, 1510, 1730, 1960, 2310, 2050, 1842],
  },
  kpis: [
    { id: 'signups', eyebrow: 'Sign-ups today', value: '328', sub: 'Normal for a Sunday morning.' },
    { id: 'errors', eyebrow: 'Error rate', value: '0.4%', sub: 'Below the 1% alert line.' },
    { id: 'flags', eyebrow: 'Pending flags', value: '6', sub: '2 high priority · oldest 2h 10m.' },
  ],
  map: {
    title: 'Active users by region',
    hint: 'Right now',
    bins: [
      { id: 'u20', label: 'Under 20', color: '#ebf1ec' },
      { id: 'b50', label: '20–49', color: '#c1d4c4' },
      { id: 'b100', label: '50–99', color: '#6ca271' },
      { id: 'b300', label: '100–299', color: '#387440' },
      { id: 'o300', label: '300+', color: '#224626' },
      { id: 'hid', label: 'Hidden', color: '#f2f2ee' },
    ],
    regions: [
      { id: 'greater-accra', name: 'Greater Accra', count: 612, bin: 'o300' },
      { id: 'ashanti', name: 'Ashanti', count: 388, bin: 'o300' },
      { id: 'western', name: 'Western', count: 142, bin: 'b300' },
      { id: 'central', name: 'Central', count: 118, bin: 'b300' },
      { id: 'eastern', name: 'Eastern', count: 96, bin: 'b100' },
      { id: 'northern', name: 'Northern', count: 74, bin: 'b100' },
      { id: 'volta', name: 'Volta', count: 61, bin: 'b100' },
      { id: 'bono', name: 'Bono', count: 38, bin: 'b50' },
      { id: 'upper-east', name: 'Upper East', count: 27, bin: 'b50' },
      { id: 'oti', name: 'Oti', count: 14, bin: 'u20' },
      { id: 'savannah', name: 'Savannah', count: 3, bin: 'hid' },
    ],
  },
  activity: {
    title: 'What people are doing',
    hint: 'Last 15 minutes',
    rows: [
      ['Browsing jobs', 640],
      ['Skills Lab', 402],
      ['Assessments', 188],
      ['Messages', 171],
      ['Community', 144],
      ['Profiles', 120],
      ['Applications', 88],
      ['Partner search', 51],
      ['Agency queries', 24],
      ['Admin tools', 38],
    ],
  },
  devices: {
    title: 'Devices',
    hint: 'Right now',
    platforms: [
      { key: 'web', label: 'Web', count: 1102, tone: 'dark' },
      { key: 'android', label: 'Android', count: 520, tone: 'mid' },
      { key: 'ios', label: 'iOS', count: 220, tone: 'light' },
    ],
    responseTitle: 'Response time',
    responseAside: 'p95 640 ms',
    response: [
      { key: 'api', label: 'API', count: 18 },
      { key: 'search', label: 'Search', count: 42 },
      { key: 'uploads', label: 'Uploads', count: 28 },
      { key: 'pdf', label: 'PDF', count: 12 },
    ],
  },
  alerts: {
    title: 'Alerts',
    hint: 'Last 24 hours',
    rows: [
      ['Sign-up spike', 41],
      ['Login failures', 22],
      ['Error rate', 18],
      ['Queue backlog', 13],
      ['Payments', 6],
    ],
    statusTitle: 'Status',
    status: [
      { key: 'resolved', label: 'Resolved', count: 480, tone: 'dark' },
      { key: 'open', label: 'Open', count: 510, tone: 'mid' },
      { key: 'muted', label: 'Muted', count: 10, tone: 'light' },
    ],
  },
  today: {
    eyebrow: 'LIVE · NOW',
    stats: [
      { key: 'signups', value: 328, prefix: '+', label: 'Sign-ups' },
      { key: 'assess', value: 1247, label: 'Assessments' },
      { key: 'flags', value: 82, label: 'Flags raised' },
      { key: 'alerts', value: 14, label: 'Alerts' },
    ],
  },
};

export const ALERT = {
  title: 'Alert: sign-ups 4× normal in Volta',
  body: '412 sign-ups in 20 minutes from 3 devices. Possible bot activity. Unacknowledged alerts go to every Senior Admin after 30 minutes.',
  primary: 'Acknowledge and investigate',
  secondary: 'Mute 1 hour',
};

export const RESTRICTED = {
  title: 'Live ops isn’t available for your role',
  body: 'Live ops is for Senior Admins and Super Admins. Ask one of them if you need to see it.',
  action: 'Back to home',
};

export const LIVE_ROLES = ['senior', 'super'];
