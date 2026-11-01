/*
 * parentLiveView — maps the parent API (services/parent.api.js) onto the exact shapes the drawn parent screens already
 * read from their mock data files, so each component swaps its source without changing its markup:
 *   parentChrome(me)      -> PARENT (parentCoreData)            name, short, verified, photo
 *   sidebarState(me)      -> SIDEBAR_STATES[x] (parentCoreData) role, done, doneText, note, stats, badges
 *   homeVariant(me)       -> HOME_VARIANTS.busy (parentHomeData) greeting, stats, showWaiting
 *   homeWardCards(me)     -> WARDS (parentHomeData)             the Overview's ward cards
 *   waitingItems(me)      -> WAITING_ITEMS (parentHomeData)
 *   homeActivity(me)      -> ACTIVITY (parentHomeData)
 *   wardView(summary, d)  -> WARDS[id] (wards/data/wardsData)  list rows + the ward page header, KPIs, activity
 *   profileGroups(d)      -> PROFILE_GROUPS (flags/data/flagsData)
 *   flagRows(d)           -> INITIAL_FLAGS (flags/data/flagsData)
 * Copy follows the mock files' wording; where the backend has nothing yet (wallets, payments, certificates to approve,
 * who viewed) the live screens leave that piece out rather than show invented numbers.
 */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY = 864e5;

const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

/** "today" | "yesterday" | "14 Oct" — the flag rows' wording. */
export const shortDay = (iso, now = new Date()) => {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const days = Math.round((startOfDay(now) - startOfDay(d)) / DAY);
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
};

/** "2 hours ago" | "Yesterday" | "14 Oct" — the activity feeds' wording. */
export const whenText = (iso, now = new Date()) => {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const mins = Math.round((now - d) / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} minute${mins === 1 ? '' : 's'} ago`;
  const days = Math.round((startOfDay(now) - startOfDay(d)) / DAY);
  if (days === 0) {
    const h = Math.round(mins / 60);
    return `${h} hour${h === 1 ? '' : 's'} ago`;
  }
  if (days === 1) return 'Yesterday';
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
};

const initials = (name) =>
  String(name || '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('') || '?';

/** A round initials avatar (data URI) for people with no photo, so every <img> keeps working. */
export const initialsAvatar = (name, bg = '#e8f2ed', fg = '#2f6b47') => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="${bg}"/><text x="32" y="33" text-anchor="middle" dominant-baseline="middle" font-family="Inter,Arial,sans-serif" font-size="24" font-weight="600" fill="${fg}">${initials(name)}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

const plural = (n, one, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

const RELATIONSHIP_LABEL = {
  mother: 'Mother',
  father: 'Father',
  guardian: 'Guardian',
  older_sibling: 'Older sibling',
  other: 'Guardian',
};

/* ── Parent chrome ─────────────────────────────────────────────────────────────── */

export const parentChrome = (me) => {
  const p = me?.parent || {};
  const name = p.name || p.email || 'Parent';
  const firstName = p.firstName || name.split(' ')[0];
  const short = p.lastName ? `${firstName} ${p.lastName[0]}.` : firstName;
  return {
    firstName,
    name,
    short,
    verified: Boolean(p.verified),
    photo: initialsAvatar(name),
    hasCareerProfile: Boolean(p.hasCareerProfile),
    relationship: p.relationship || null,
    // The talent card line needs the parent's own career profile; none is read here yet.
    talentLine: p.hasCareerProfile ? 'My career' : null,
  };
};

export const sidebarState = (me) => {
  const c = me?.counts || {};
  const n = c.wards || 0;
  const rel = RELATIONSHIP_LABEL[me?.parent?.relationship] || 'Parent';
  // "This week" checklist (3 steps): account verified, a ward linked, nothing left to check.
  const done = [Boolean(me?.parent?.verified), n > 0, n > 0 && !c.toReview].filter(Boolean).length;
  let note = '';
  if (n === 0) note = 'Link your child to get started →';
  else if (c.flagsToCheck) note = `${plural(c.flagsToCheck, 'fix')} to check →`;
  return {
    role: n ? `${rel} · ${plural(n, 'ward')} linked` : `${rel} · no ward linked yet`,
    done,
    doneText: `${done} of 3 done`,
    note,
    noteTo:
      n === 0 ? '/parent/link-ward' : c.flagsToCheck ? '/parent/review?tab=corrections' : null,
    stats: [
      { value: String(n), label: n === 1 ? 'Ward' : 'Wards' },
      { value: String(c.toReview || 0), label: 'To review' },
      { value: String(c.flagsOpen || 0), label: c.flagsOpen === 1 ? 'Flag open' : 'Flags open' },
      { value: String(c.optedOut || 0), label: 'Opted out' },
    ],
    badges: c.toReview ? { review: String(c.toReview) } : {},
  };
};

/* ── Wards ─────────────────────────────────────────────────────────────────────── */

const pronouns = (gender) => {
  const g = String(gender || '').toLowerCase();
  if (g.startsWith('f')) return { pronoun: 'she', possessive: 'her' };
  if (g.startsWith('m')) return { pronoun: 'he', possessive: 'his' };
  return { pronoun: 'they', possessive: 'their' };
};

/** The child as the parent sees them: "Daughter", "Son", "Brother", "Ward"… */
export const childLabel = (relationship, gender) => {
  const g = String(gender || '').toLowerCase();
  const female = g.startsWith('f');
  const male = g.startsWith('m');
  if (relationship === 'older_sibling') return female ? 'Sister' : male ? 'Brother' : 'Sibling';
  if (relationship === 'mother' || relationship === 'father')
    return female ? 'Daughter' : male ? 'Son' : 'Child';
  return 'Ward';
};

const wardChips = (w) => {
  const chips = [];
  if (w.status === 'opted_out') chips.push({ label: 'Opted out', tone: 'amber' });
  else chips.push({ label: w.discoverable ? 'Discoverable' : 'Building profile', tone: 'green' });
  if (w.flags?.toCheck)
    chips.push({ label: `${plural(w.flags.toCheck, 'fix', 'fixes')} to check`, tone: 'amber' });
  else if (w.flags?.open)
    chips.push({ label: `${plural(w.flags.open, 'flag')} open`, tone: 'grey' });
  else chips.push({ label: `Profile ${w.profileCompletion || 0}%`, tone: 'grey' });
  return chips;
};

const schoolLine = (w) => [w.grade, w.programme, w.school].filter(Boolean).join(' · ');

export const homeWardCards = (me) =>
  (me?.wards || []).map((w, i) => ({
    id: w.id,
    name: w.name,
    age: w.age,
    photo: w.photo || initialsAvatar(w.name),
    relation: [childLabel(w.relationship, w.gender), schoolLine(w)].filter(Boolean).join(' · '),
    chips: wardChips(w),
    cta: `Open ${w.firstName}`,
    primary: i === 0,
  }));

const ACTIVITY_ICON = { assessment: 'star', skill: 'star', certificate: 'file', fix: 'book' };
const ASSESSMENT_LABEL = {
  big_five: 'personality',
  mbti: 'personality type',
  riasec: 'career interests',
  numerical: 'numerical reasoning',
  verbal: 'verbal reasoning',
  logical: 'logical reasoning',
};
const prettyKey = (k) =>
  String(k || '')
    .replace(/[_-]+/g, ' ')
    .trim();

const activityTitle = (a, first) => {
  switch (a.kind) {
    case 'assessment':
      return `${first} finished the ${ASSESSMENT_LABEL[a.type] || prettyKey(a.type)} assessment`;
    case 'skill':
      return `${first} verified ${prettyKey(a.skill)}${a.level ? ` (${a.level})` : ''}`;
    case 'certificate':
      return `${first} added a certificate${a.title ? ` · ${a.title}` : ''}`;
    case 'fix':
      return `${first} corrected ${String(a.label || 'a field').toLowerCase()} after your flag`;
    default:
      return `${first} was active`;
  }
};

export const homeActivity = (me) =>
  (me?.activity || []).map((a) => ({
    id: a.id,
    kind: a.kind === 'fix' ? 'check' : 'star',
    text: activityTitle(a, a.wardFirstName || 'Your ward'),
    when: whenText(a.at),
  }));

export const waitingItems = (me) =>
  (me?.wards || [])
    .filter((w) => w.flags?.toCheck)
    .map((w) => ({
      id: `fix-${w.id}`,
      icon: 'telecom',
      title: `${plural(w.flags.toCheck, 'correction')} · ${w.firstName}`,
      sub: `${w.firstName} changed what you flagged · check the fix`,
      action: 'Check',
      actionLook: 'white',
      to: `/parent/wards/${w.id}?tab=flags`,
    }));

export const homeVariant = (me) => {
  const c = me?.counts || {};
  const wards = me?.wards || [];
  const names = wards.map((w) => w.firstName);
  const who =
    names.length > 1 ? `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}` : names[0];
  const greeting = c.toReview
    ? `${plural(c.toReview, 'thing')} ${c.toReview === 1 ? 'waits' : 'wait'} for your OK.`
    : wards.length
      ? `Nothing needs your OK right now. Here’s what ${who} did lately.`
      : 'Link your child to see how they are doing.';
  const avg = wards.length
    ? Math.round(wards.reduce((n, w) => n + (w.profileCompletion || 0), 0) / wards.length)
    : 0;
  return {
    greeting,
    stats: [
      {
        value: String(c.wards || 0),
        label: c.wards === 1 ? 'Ward' : 'Wards',
        note: [`${c.active || 0} active`, c.optedOut ? `${c.optedOut} opted out` : null]
          .filter(Boolean)
          .join(' · '),
        tone: 'plain',
      },
      {
        value: String(c.toReview || 0),
        label: 'To review',
        note: c.toReview ? 'Corrections to check' : 'All caught up',
        tone: 'plain',
      },
      {
        value: String(c.flagsOpen || 0),
        label: c.flagsOpen === 1 ? 'Flag open' : 'Flags open',
        note: c.flagsToCheck
          ? `${plural(c.flagsToCheck, 'fix', 'fixes')} to check`
          : c.flagsOpen
            ? 'Waiting for your ward'
            : 'Nothing open',
        tone: 'amber',
      },
      {
        value: `${avg}%`,
        label: 'Profile complete',
        note: wards.length > 1 ? 'Average of your wards' : who || '—',
        tone: 'green',
      },
    ],
    showWaiting: Boolean(c.toReview),
  };
};

const WEEKDAYS = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
const MONTHS_LONG = [
  'JANUARY',
  'FEBRUARY',
  'MARCH',
  'APRIL',
  'MAY',
  'JUNE',
  'JULY',
  'AUGUST',
  'SEPTEMBER',
  'OCTOBER',
  'NOVEMBER',
  'DECEMBER',
];

/** "FRIDAY 30 OCTOBER" and "Good morning" for the hero. */
export const heroDate = (now = new Date()) =>
  `${WEEKDAYS[now.getDay()]} ${now.getDate()} ${MONTHS_LONG[now.getMonth()]}`;
export const salutation = (now = new Date()) =>
  now.getHours() < 12 ? 'Good morning' : now.getHours() < 17 ? 'Good afternoon' : 'Good evening';

/** Overview + one tab per ward (the ward tab opens the ward page; its Flags tab when a fix waits). */
export const homeTabs = (me) => [
  { id: 'overview', label: 'Overview', icon: 'home' },
  ...(me?.wards || []).map((w) => ({
    id: w.id,
    label: w.firstName,
    icon: w.flags?.open ? 'flag' : 'eye',
    chip: w.flags?.toCheck
      ? `${plural(w.flags.toCheck, 'fix', 'fixes')} to check`
      : w.flags?.open
        ? `${plural(w.flags.open, 'flag')}`
        : undefined,
    to: `/parent/wards/${w.id}${w.flags?.toCheck ? '?tab=flags' : ''}`,
  })),
];

/** The green Parent guide card: one concrete next step, from what is actually waiting. */
export const homeGuide = (me) => {
  const wards = me?.wards || [];
  const base = { title: 'Parent guide', sub: 'What to do next', eyebrow: 'WHAT TO DO NEXT' };
  if (!wards.length) {
    return {
      ...base,
      body: 'Ask your child for the 6-character link code in their GTH Settings, then link them here.',
      cta: 'Link a ward',
      to: '/parent/link-ward',
    };
  }
  const fix = wards.find((w) => w.flags?.toCheck);
  if (fix) {
    return {
      ...base,
      body: `${fix.firstName} changed something you flagged. Check it, then approve the fix or flag it again.`,
      cta: `Check ${fix.firstName}’s fix`,
      to: `/parent/wards/${fix.id}?tab=flags`,
    };
  }
  const low = [...wards].sort((a, b) => (a.profileCompletion || 0) - (b.profileCompletion || 0))[0];
  return {
    ...base,
    body: `${low.firstName}’s profile is ${low.profileCompletion || 0}% complete. Look through it together and flag anything that isn’t right.`,
    cta: `Open ${low.firstName}`,
    to: `/parent/wards/${low.id}?tab=profile`,
  };
};

/** The readiness card, as the first ward's journey progress (no readiness score for wards yet). */
export const homeReadiness = (me) => {
  const w = (me?.wards || [])[0];
  if (!w) return null;
  const pct = w.profileCompletion || 0;
  return {
    title: `${w.firstName}’s profile`,
    link: `Open ${w.firstName}`,
    to: `/parent/wards/${w.id}`,
    score: pct,
    headline: w.discoverable ? 'Discoverable to recruiters' : 'Still building the profile',
    sub: `${pct}% of the profile journey done`,
  };
};

/* ── One ward (list row + ward page) ───────────────────────────────────────────── */

const linkedLine = (w) => {
  const since = w.linkedAt ? shortDay(w.linkedAt) : '';
  const how = w.linkedVia === 'link_code' ? 'linked with a code' : 'linked';
  return since ? `${how} ${since}` : how;
};

const kpiCards = (w, k) => {
  if (!k) return [];
  return [
    {
      value: `${k.profileCompletion || 0}%`,
      label: 'Profile complete',
      note: k.stagesTotal ? `${k.stagesDone} of ${k.stagesTotal} stages` : '',
    },
    {
      value: String(k.assessmentsDone || 0),
      label: k.assessmentsDone === 1 ? 'Assessment' : 'Assessments',
      note:
        (k.assessmentTypes || []).map((t) => ASSESSMENT_LABEL[t] || prettyKey(t)).join(', ') ||
        'None yet',
    },
    {
      value: String(k.verifiedSkills || 0),
      label: 'Verified skills',
      note: (k.verifiedSkillNames || []).map(prettyKey).join(', ') || 'None yet',
    },
    {
      value: String(w.flags?.open || 0),
      label: w.flags?.open === 1 ? 'Flag open' : 'Flags open',
      note: w.flags?.toCheck
        ? `${plural(w.flags.toCheck, 'fix', 'fixes')} to check`
        : 'Nothing waiting',
    },
  ];
};

const wardActivityRows = (activity, w) =>
  (activity || []).map((a) => ({
    id: a.id,
    icon: ACTIVITY_ICON[a.kind] || 'star',
    title: activityTitle(a, w.firstName)
      .replace(`${w.firstName} `, '')
      .replace(/^./, (c) => c.toUpperCase()),
    sub: [whenText(a.at), a.kind === 'certificate' ? a.issuer : null].filter(Boolean).join(' · '),
    chip: a.kind === 'fix' ? 'Your review' : undefined,
  }));

const turning18 = (w) => {
  if (!w.turning18On || w.age !== 17) return null;
  const days = Math.round((new Date(w.turning18On) - new Date()) / DAY);
  if (days < 0 || days > 60) return null;
  const { pronoun, possessive } = pronouns(w.gender);
  const d = new Date(w.turning18On);
  const P = pronoun[0].toUpperCase() + pronoun.slice(1);
  return {
    title: `${w.firstName} turns 18 on ${d.getDate()} ${MONTHS[d.getMonth()]}`,
    intro: `In ${days} days ${possessive} account becomes a full talent account. Here’s what changes for you.`,
    points: [
      {
        icon: 'user',
        text: `${P} ${pronoun === 'they' ? 'manage' : 'manages'} ${possessive} own profile and settings.`,
      },
      { icon: 'shield', text: 'Opt-out and flags end. Your past evaluations stay on the profile.' },
      {
        icon: 'users',
        text: `${P} can keep you as a trusted contact, so you still get milestone news.`,
      },
    ],
    cta: `Send ${w.firstName} a note`,
  };
};

/** WARDS[id] shape (wards/data/wardsData.js) from a ward summary, plus the page detail when loaded. */
export const wardView = (w, detail) => {
  const { pronoun, possessive } = pronouns(w.gender);
  const flags = detail?.ward?.flags || w.flags || {};
  return {
    id: w.id,
    name: w.name,
    firstName: w.firstName,
    relation: childLabel(w.relationship, w.gender),
    pronoun,
    possessive,
    age: w.age,
    grade: [w.grade, w.programme].filter(Boolean).join(' ') || null,
    school: w.school || null,
    since: shortDay(w.linkedAt),
    photo: w.photo || initialsAvatar(w.name),
    status: 'active',
    optedOut: w.status === 'opted_out',
    listLine: [w.age != null ? String(w.age) : null, schoolLine(w) || null, linkedLine(w)]
      .filter(Boolean)
      .join(' · '),
    action: 'Open →',
    tabCounts: { ...(flags.open ? { flags: flags.open } : {}) },
    kpis: kpiCards({ ...w, flags }, detail?.kpis),
    activity: wardActivityRows(detail?.activity, w),
    turning18: turning18(w),
    live: true,
  };
};

export const profileGroups = (detail) =>
  (detail?.profile || []).map((g) => ({
    id: g.id,
    label: g.label,
    fields: g.fields.map((f) => ({
      id: f.id,
      label: f.label,
      value: f.value || 'Not added yet',
      empty: !f.value,
    })),
  }));

/* ── Activity tab (PW-13 shape: { filters, groups: [{ id, label, rows }] }, icons from tabsData ICONS) ────── */

const TAB_ICON = {
  assessment: 'clipboard',
  skill: 'star',
  certificate: 'fileCheck',
  fix: 'refresh',
};

export const activityTab = (detail, w) => {
  const weekAgo = Date.now() - 7 * DAY;
  const rows = (detail?.activity || []).map((a) => ({
    id: a.id,
    icon: TAB_ICON[a.kind] || 'star',
    title: activityTitle(a, w.firstName),
    sub: [whenText(a.at), a.kind === 'certificate' ? a.issuer : null].filter(Boolean).join(' · '),
    at: a.at,
  }));
  const week = rows.filter((r) => new Date(r.at).getTime() >= weekAgo);
  const earlier = rows.filter((r) => new Date(r.at).getTime() < weekAgo);
  return {
    filters: ['All'],
    groups: [
      week.length ? { id: 'week', label: 'This week', rows: week } : null,
      earlier.length ? { id: 'earlier', label: 'Earlier', rows: earlier } : null,
    ].filter(Boolean),
  };
};

/* ── Opt out ──────────────────────────────────────────────────────────────────── */

// The dialog's reasons (optOutData OPT_OUT_REASONS ids) -> the backend's reasonCategory.
const OPT_OUT_CATEGORY = {
  privacy: 'parental_withdrawal',
  safety: 'safety_concern',
  young: 'parental_withdrawal',
  other: 'other',
};
const CATEGORY_LABEL = {
  parental_withdrawal: 'Parental decision',
  safety_concern: 'Safety concerns',
  profile_inaccuracy: 'Details are wrong',
  account_misuse: 'Account misuse',
  other: null,
};

/** OptOutDialog values -> POST /parent-ward/opt-out body (the backend wants a reason of 10+ characters). */
export const optOutPayload = ({ reasonId, reasonLabel, note }) => {
  const text = [reasonLabel, note].filter(Boolean).join(': ');
  return {
    reason: text.length >= 10 ? text : `Opted out by parent${text ? `: ${text}` : ''}`,
    reasonCategory: OPT_OUT_CATEGORY[reasonId] || 'other',
  };
};

/** The paused page's { reasonLabel, at } from the ward page's optOut. */
export const accessFromDetail = (detail) => {
  const o = detail?.optOut;
  if (!o) return undefined;
  const d = o.since ? new Date(o.since) : null;
  const sameDay = d && startOfDay(d) === startOfDay(new Date());
  const at = d
    ? sameDay
      ? `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
      : `${d.getDate()} ${MONTHS[d.getMonth()]}`
    : undefined;
  return { status: 'opted-out', reasonLabel: CATEGORY_LABEL[o.reasonCategory] ?? undefined, at };
};

const FLAG_ICON = { corrected: 'refresh', approved: 'check', pending: 'flag', reflagged: 'flag' };

export const flagRows = (detail) =>
  (detail?.flags || []).map((f) => ({
    id: f.id,
    fieldId: f.fieldId,
    label: f.label,
    icon: FLAG_ICON[f.status] || 'flag',
    status: f.status,
    flaggedOn: shortDay(f.flaggedAt),
    severity: f.severity || 'correcting',
    note: f.note || '',
    againNote: f.againNote || undefined,
    before: f.before ?? '—',
    now: f.now ?? '—',
    approvedOn: f.approvedAt ? shortDay(f.approvedAt) : undefined,
  }));
