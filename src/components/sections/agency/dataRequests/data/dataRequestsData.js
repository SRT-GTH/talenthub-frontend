/*
 * dataRequestsData.js â€” copy of the privileged-data request flow (Figma 11.4.3aâ€“i) and the builders that turn the live API
 * (GET /agency/data-requests, GET /agency/data-requests/:id) into what the list rows and the request page draw.
 * A request is approved by a GTH programme manager AND the data protection officer (DPO); access then lasts 30 days.
 */

export const ACCESS_WINDOW_DAYS = 30;
const DAY = 86_400_000;

const fmtDay = (d) =>
  d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '';
const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : '';
const fmtDateTime = (d) =>
  d
    ? `${fmtDate(d)}, ${new Date(d).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`
    : '';
const fmtLong = (d) =>
  d
    ? new Date(d).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
    : '';
const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

/** Adds n working days (Monâ€“Fri) to a date. */
const addWorkingDays = (from, n) => {
  const d = new Date(from);
  let left = n;
  while (left > 0) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0 && d.getDay() !== 6) left -= 1;
  }
  return d;
};

/* ---- list (11.4.3a) ---- */
export const REQUEST_STATUS_LABEL = {
  approved: 'Approved',
  pending: 'Pending',
  rejected: 'Rejected',
  'needs-detail': 'Needs detail',
  ended: 'Ended',
  withdrawn: 'Withdrawn',
};

export const SORTS = ['Newest first', 'Oldest first'];
export const LIST_COPY = {
  title: 'Data requests',
  subtitle:
    'Ask for data beyond your standard view. A GTH programme manager and the data protection officer approve every request.',
};

const ICON_FOR = { readiness: 'chart', outcomes: 'map', skills: 'chart' };

/** One row of the list from a request summary. */
export const toRow = (s) => {
  const days = s.daysLeft ?? 0;
  const notes = {
    approved: `Access ends in ${plural(days, 'day')}`,
    pending: `In review Â· day ${Math.min(s.reviewDay, 10)} of 10`,
    'needs-detail': 'Detail needed from you',
    rejected:
      s.appealBy && new Date(s.appealBy) > Date.now()
        ? `Appeal by ${fmtDay(s.appealBy)}`
        : 'Appeal window closed',
    ended: `Access ended ${fmtDay(s.accessEndsAt)}`,
    withdrawn: 'Withdrawn',
  };
  const actions = {
    approved: 'Open data',
    pending: s.appealOpen ? 'Appeal in review' : 'Pending',
    'needs-detail': 'Add detail',
    rejected: 'View reason',
    ended: 'Ended',
    withdrawn: 'Withdrawn',
  };
  return {
    id: s.id,
    title: s.title,
    status: s.status,
    detail:
      s.status === 'rejected' && s.rejectionReason
        ? s.rejectionReason
        : `Aggregates Â· ${s.regionsLabel} Â· requested ${fmtDay(s.createdAt)}`,
    icon: ICON_FOR[s.category] || 'map',
    note: { tone: 'access', label: notes[s.status] || '' },
    chips: [s.categoryLabel],
    more: 0,
    action: actions[s.status] || '',
    muted: s.status === 'rejected' || s.status === 'withdrawn',
    createdAt: s.createdAt,
  };
};

export const bannerFor = (ending) =>
  ending
    ? `Access to â€œ${ending.title}â€ ends in ${plural(
        Math.max(0, Math.ceil((new Date(ending.accessEndsAt) - Date.now()) / DAY)),
        'day'
      )}. Download what you need before then.`
    : null;

/* ---- new request form (11.4.3b) ---- */
export const CATEGORY_OPTIONS = [
  { key: 'readiness', label: 'Readiness Â· in your MoU' },
  { key: 'skills', label: 'Skills Â· in your MoU' },
  { key: 'outcomes', label: 'Programme outcomes Â· in your MoU' },
];

export const NEW_REQUEST = {
  title: ['Tell us ', 'what you need and why.'],
  intro:
    'A GTH programme manager and the data protection officer review every request within 10 working days. Approved access lasts 30 days and every download is logged.',
  attachTitle: 'Attach a research brief',
  attachHint: 'PDF Â· optional Â· helps the reviewers decide faster',
  attachButton: 'Attach brief',
  divider: 'request details',
  categories: CATEGORY_OPTIONS.map((c) => c.label),
  levelOfDetail: 'Aggregates only Â· groups under 5 hidden',
  accessFor: '30 days',
  confirm: 'I confirm this follows MoU clause 4.2 and wonâ€™t be shared outside my agency',
  cancel: 'Cancel',
  submit: 'Send for approval',
};

/** The POST body of a new request from the form. */
export const toCreatePayload = (form, briefName) => ({
  title: form.what.trim(),
  why: form.why.trim(),
  category: (CATEGORY_OPTIONS.find((c) => c.label === form.category) || CATEGORY_OPTIONS[0]).key,
  range: form.range.trim(),
  regions: form.regions.trim(),
  viewers: form.viewers.trim(),
  briefName: briefName || undefined,
  confirm: true,
});

/* ---- request page (11.4.3câ€“g, i) ---- */
const cardsFor = (title, open, endsAt) =>
  [
    {
      id: 'dataset',
      title: 'Dataset',
      text: `${title}, aggregates only.`,
      icon: 'dataset',
      fill: 34,
    },
    {
      id: 'window',
      title: 'Access window',
      text: '30 days from approval. Every download is logged.',
      icon: 'shield',
      fill: 34,
    },
    {
      id: 'audit',
      title: 'Audit log',
      text: 'You, the reviewers and your agencyâ€™s DPO can see who opened it.',
      icon: 'audit',
      fill: 45,
    },
  ].map((c) =>
    open
      ? { ...c, badge: 'Open', foot: `Until ${fmtDay(endsAt)}`, live: true }
      : { ...c, badge: 'Locked', value: '30 days', foot: 'Starts at approval' }
  );

const quickFor = (r, open) => [
  {
    id: 'dataset',
    label: 'Open dataset',
    hint: open ? r.title : 'Opens after approval',
    icon: 'map',
    tone: 'green',
  },
  { id: 'query', label: 'Run a query', hint: r.regionsLabel, icon: 'search', tone: 'blue' },
  {
    id: 'viewer',
    label: 'Add a viewer',
    hint: 'Share access with a colleague',
    icon: 'user-plus',
    tone: 'green',
  },
  { id: 'new', label: 'New request', hint: 'Ask for more data', icon: 'suitcase', tone: 'purple' },
];

const stepRows = (r) => {
  const by = Object.fromEntries((r.steps || []).map((s) => [s.key, s]));
  const pm = by.pm || {};
  const dpo = by.dpo || {};
  const appealOpen = r.appealBy && new Date(r.appealBy) > Date.now();
  const detailAction =
    r.status === 'needs-detail'
      ? 'Add detail'
      : r.status === 'rejected' && appealOpen
        ? 'Start an appeal'
        : r.status === 'ended'
          ? 'Ask to extend'
          : 'View request';
  const pmRow = {
    name: 'Programme manager review',
    done: pm.status === 'approved',
    sub:
      pm.status === 'approved'
        ? `Approved Â· ${fmtDay(pm.at)}${pm.by ? ` Â· ${pm.by}` : ''}`
        : pm.status === 'rejected'
          ? `Not approved Â· ${pm.note || ''}`
          : `${r.appealOpen ? 'Appeal in review' : 'In review'} Â· started ${fmtDateTime(pm.at)}`,
    right:
      pm.status === 'approved'
        ? 'Done'
        : pm.status === 'rejected'
          ? appealOpen
            ? `Appeal by ${fmtDay(r.appealBy)}`
            : 'Closed'
          : 'Now',
  };
  const dpoRow = {
    name: 'Data protection officer',
    done: dpo.status === 'approved',
    sub:
      dpo.status === 'approved'
        ? `Approved by the GTH DPO Â· ${fmtDay(dpo.at)}`
        : dpo.status === 'rejected'
          ? `Not approved Â· ${dpo.note || ''}`
          : dpo.status === 'needs-detail'
            ? `Asked: ${dpo.note || r.question || ''}`
            : dpo.status === 'in-review'
              ? `In review Â· since ${fmtDateTime(dpo.at)}`
              : pm.status === 'rejected'
                ? 'Not needed unless you appeal'
                : 'The GTH DPO checks it follows your MoU',
    right:
      dpo.status === 'approved'
        ? 'Done'
        : dpo.status === 'needs-detail'
          ? 'Fix now'
          : dpo.status === 'in-review'
            ? 'Now'
            : dpo.status === 'rejected'
              ? appealOpen
                ? `Appeal by ${fmtDay(r.appealBy)}`
                : 'Closed'
              : pm.status === 'rejected'
                ? 'â€”'
                : 'Next',
  };
  return [
    { name: 'Request sent', done: true, right: 'Done', plain: true },
    {
      name: 'Request details',
      done: r.status !== 'needs-detail',
      sub:
        r.status === 'needs-detail'
          ? 'More detail needed'
          : `${r.details?.length ? `Detail added ${fmtDay(r.details[r.details.length - 1].at)}` : `Sent Â· ${fmtDay(r.createdAt)}`}`,
      action: detailAction,
    },
    pmRow,
    dpoRow,
  ];
};

/** Everything the request page draws, from GET /agency/data-requests/:id. */
export const buildDetail = (r) => {
  const due = addWorkingDays(r.createdAt, 10);
  const steps = stepRows(r);
  const doneCount = steps.filter((s) => s.done).length;
  const locked = r.status !== 'approved';
  const base = {
    subject: r.title,
    quick: quickFor(r, !locked),
    steps,
    progress: Math.round((doneCount / 4) * 100),
    sectionTitle: locked ? 'Opens when approved' : 'Your access',
    sectionSub: locked
      ? 'Everything below opens the moment both reviewers approve.'
      : `Open until ${fmtDateTime(r.accessEndsAt)}.`,
    cards: cardsFor(r.title, !locked, r.accessEndsAt),
    locked,
    stepsSub: 'Both a programme manager and the data protection officer must approve.',
  };
  const appealOpen = r.appealBy && new Date(r.appealBy) > Date.now();
  const pmStep = (r.steps || []).find((s) => s.key === 'pm') || {};
  const rejectStep = (r.steps || []).find((s) => s.status === 'rejected') || {};
  switch (r.status) {
    case 'approved':
      return {
        ...base,
        tone: 'green',
        heroTitle: 'Request approved',
        heroText: `â€œ${r.title}â€ is approved. You can open it until ${fmtDate(r.accessEndsAt)}. Every view and download is logged.`,
        heroAction: { id: 'dataset', label: 'Open dataset' },
        stepsSub: `Both reviewers signed off on ${fmtDay(r.approvedAt)}.`,
        stepsBadge: '4 of 4 Â· approved',
      };
    case 'rejected':
      return {
        ...base,
        tone: 'red',
        heroTitle: 'We couldnâ€™t approve this request',
        heroText: `â€œ${r.title}â€: ${r.rejectionReason || 'not approved'}. ${
          appealOpen
            ? `You can appeal by ${fmtDate(r.appealBy)}; a different reviewer looks at appeals. Or send a narrower request.`
            : 'The 14-day appeal window has closed. You can send a new, narrower request.'
        }`,
        heroAction: appealOpen
          ? { id: 'appeal', label: 'Start an appeal' }
          : { id: 'new', label: 'New request' },
        stepsSub: `${rejectStep.key === 'dpo' ? 'The data protection officer' : 'The programme manager'} stopped the request.`,
        stepsBadge: `Not approved Â· ${fmtDay(rejectStep.at)}`,
      };
    case 'ended':
      return {
        ...base,
        tone: 'red',
        heroTitle: 'Your access has ended',
        heroText: `Access to â€œ${r.title}â€ ended on ${fmtDate(r.accessEndsAt)}. Views and downloads you made stay logged. Ask to extend for up to 30 more days, with a reason.`,
        heroAction: { id: 'extend', label: 'Ask to extend' },
        stepsSub: `Approved ${fmtDay(r.approvedAt)} Â· access closed ${fmtDay(r.accessEndsAt)}.`,
        stepsBadge: 'Access ended',
        progress: 100,
      };
    case 'needs-detail':
      return {
        ...base,
        tone: 'green',
        heroTitle: 'We need more detail on your request',
        heroText: `The data protection officer asked about â€œ${r.title}â€: â€œ${r.question || ''}â€. Add the detail and it goes straight back to them.`,
        heroAction: { id: 'detail', label: 'Add detail' },
        stepsBadge: '3 of 4 Â· action needed',
      };
    case 'withdrawn':
      return {
        ...base,
        tone: 'red',
        heroTitle: 'You withdrew this request',
        heroText: `â€œ${r.title}â€ was withdrawn and wonâ€™t be reviewed. You can send a new request at any time.`,
        heroAction: { id: 'new', label: 'New request' },
        stepsSub: 'Withdrawn by your agency.',
        stepsBadge: 'Withdrawn',
      };
    default: {
      const atDpo = pmStep.status === 'approved';
      return {
        ...base,
        tone: 'green',
        heroTitle: r.appealOpen ? 'Your appeal is in review' : 'Your request is in review',
        heroText: atDpo
          ? `The programme manager approved â€œ${r.title}â€. The data protection officer is checking it follows your MoU.`
          : `${r.appealOpen ? 'A different programme manager is reviewing your appeal on' : 'A programme manager is reviewing'} â€œ${r.title}â€. Youâ€™ll hear from us by ${fmtLong(due)}.`,
        heroAction: { id: 'support', label: 'Contact support' },
        stepsBadge: atDpo ? '4 of 4 Â· in review' : '3 of 4 Â· in review',
      };
    }
  }
};

/* ---- appeal (11.4.3i) ---- */
export const APPEAL = {
  chip: 'Appeal this decision',
  title: ['Appeal this ', 'decision'],
  intro: 'A different reviewer looks at appeals. Most decisions come within 10 working days.',
  viewButton: 'View decision',
  levels: ['District totals', 'Regional totals only', 'National totals only'],
  verified: 'Aggregated totals are inside your MoU',
  confirm: 'I confirm results will only be shared as aggregates',
  withdraw: 'Withdraw request',
  cancel: 'Cancel',
  submit: 'Send appeal',
};

/* ---- approved dataset (11.4.3h) ---- */
export const DATASET = {
  download: 'Download CSV (logged)',
  loggedEyebrow: 'For your agency',
  loggedTitle: 'Logged view',
  loggedAction: 'View access log',
};

export const SUPPORT_EMAIL = 'info@ghanatalenthub.com';
export { fmtDate, fmtDateTime, fmtDay, plural };
