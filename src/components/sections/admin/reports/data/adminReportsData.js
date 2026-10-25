/*
 * adminReportsData — copy of the Reports screens (Figma canvas 8520:12): 7.3.1a "Platform health" 8635:8, 7.3.1b "Choose a report" 8635:547, 7.3.1c "Large report queued" 8635:1290,
 * 7.3.2a "External data export request" 8635:2057, 7.3.2b "Identifiable export blocked" 8635:2854, 7.3.2c "Export ready" 8636:8199. ⚠️ ASSUMPTION: frontend only. The chart series are
 * read off the Figma vector paths and bar heights (the frames carry no numbers): W1 → W13, the last point is "this week".
 */

const W = (values) => values.map((value, i) => ({ label: `W${i + 1}`, value }));

export const HEALTH = {
  title: 'Platform health report',
  subtitle: 'Last 30 days compared with the 30 days before. Aggregated, no personal data.',
  note: 'Each chart has its own scale. Reports are cached for 1 hour. CSV exports contain counts only.',
  charts: [
    {
      id: 'total',
      title: 'Total accounts',
      aside: 'Cumulative',
      kind: 'line',
      series: W([
        155300, 159700, 164100, 168900, 173400, 178500, 183100, 188300, 193000, 198600, 204200,
        211500, 219428,
      ]),
      headline: '219,428',
      delta: '▲ +64,120 in 90 days',
      yMax: 240000,
      yStep: 60000,
      showEndLabel: false,
    },
    {
      id: 'signups',
      title: 'New sign-ups',
      aside: 'Per week',
      kind: 'column',
      series: W([4230, 4506, 4322, 4782, 4598, 5104, 4598, 5196, 4690, 5610, 5610, 7311, 4932]),
      headline: '4,932',
      delta: 'this week · ▲ 12%',
      yMax: 8000,
      yStep: 2000,
      current: true,
      showEndLabel: false,
    },
    {
      id: 'flags',
      title: 'Flags resolved',
      aside: 'Per week',
      kind: 'line',
      series: W([244, 252, 250, 272, 284, 276, 292, 304, 296, 316, 324, 325, 344]),
      headline: '412',
      delta: 'this week · ▲ 9%',
      yMax: 400,
      yStep: 100,
      hoverIndex: 9,
      showEndLabel: false,
    },
    {
      id: 'verification',
      title: 'Verification decisions',
      aside: 'Per week',
      kind: 'line',
      series: W([71, 74, 69, 80, 82, 85, 79, 88, 92, 90, 97, 95, 104]),
      headline: '46',
      delta: 'this week · ▲ 4%',
      yMax: 120,
      yStep: 30,
      showEndLabel: false,
    },
  ],
};

export const REPORTS = {
  title: 'Reports',
  subtitle: 'Aggregated platform reports. No personal data. Cached for 1 hour.',
  action: 'Generate report',
};

export const CHOOSE = {
  title: 'Choose a report',
  sub: 'Every report is aggregated. Support Agents never see individual accounts in reports.',
  options: [
    { id: 'health', title: 'Platform health', sub: 'Sign-ups, activity, errors · PDF or CSV' },
    { id: 'trust', title: 'Trust & Safety', sub: 'Flags, removals, warnings and appeals' },
    {
      id: 'verification',
      title: 'Verification',
      sub: 'KYB, accreditation and MoU decisions and times',
    },
  ],
  rangeLabel: 'Date range',
  range: '18 Sep – 18 Oct 2026',
  rangeNote: '30 days',
  cancel: 'Cancel',
  primary: 'Generate report',
};

export const BUILDING = {
  title: 'Building this report in the background',
  sub: 'It covers 12 months, so we’ll email it to you within 15 minutes. Keep working.',
  progress: 0.6,
  progressText: 'Step 2 of 4 · Counting flags and decisions',
  steps: [
    { label: 'Collecting figures', state: 'done' },
    { label: 'Counting flags and decisions', state: 'done' },
    { label: 'Drawing charts', state: 'active' },
    { label: 'Adding the method note', state: 'next' },
  ],
  cancel: 'Cancel',
};

export const EXPORT_REQUEST = {
  chip: 'External data export',
  title: 'For a formal request from an authorised organisation.',
  sub: 'External exports need a second Super Admin. Pseudonymised data needs a second approval, and identifiable data also needs talent consent and a legal mandate.',
  upload: {
    title: 'Attach the formal request letter',
    sub: 'PDF · required for every external export',
    action: 'Attach letter',
  },
  divider: 'export details',
  fields: {
    organisation: {
      label: 'Requesting organisation',
      value: 'Ghana Statistical Service',
      required: true,
    },
    dataset: { label: 'Dataset', value: 'Youth sign-ups by district, 2025–26', required: true },
    level: {
      label: 'Anonymisation level',
      required: true,
      options: ['Aggregated (counts only)', 'Pseudonymised', 'Identifiable'],
    },
    reference: { label: 'Request reference', value: 'GSS/DR/2026/031' },
    from: { label: 'From', value: '01 / 2025', required: true },
    to: { label: 'To', value: '01 / 2025', optional: true },
    approver: { label: 'Second approver', value: 'Kwame Owusu · Super Admin', optional: true },
    purpose: { label: 'Purpose', value: 'National youth labour survey', optional: true },
  },
  check: 'No individual data. Groups under 5 are hidden.',
  cancel: 'Cancel',
  primary: 'Send for approval',
};

export const BLOCKED = {
  title: 'Identifiable export blocked',
  body: 'Identifiable data needs documented talent consent for this sharing purpose. Add the consent record ID, or choose Aggregated instead.',
  primary: 'Use aggregated data',
  secondary: 'Close',
};

export const READY = {
  sticker: 'Approved',
  title: 'Export ready',
  sub: 'Approved by Kwame Owusu. You can download the file for 24 hours.',
  items: [
    { id: 'clock', text: 'Counts only · 261 districts · 2 years' },
    { id: 'chat', text: 'File hash recorded in the audit log' },
    { id: 'spark', text: 'Link expires 19 Oct, 09:40' },
  ],
  back: 'Back to reports',
  primary: 'Download CSV',
};
