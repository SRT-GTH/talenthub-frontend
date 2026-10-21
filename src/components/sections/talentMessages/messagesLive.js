import { JOB_CARD_PENDING, JOB_REASON_CHIPS } from './cards/messageCardsData.js';
import { MESSAGE_CONVERSATIONS } from './messagesData.js';

/*
 * Talent Messages — live adapter (no React). Turns the /talent-messages API (services/messages.api.js) into the same
 * conversation records the drawn mock uses (messagesData.js), so the inbox list, thread, cards and request bar render
 * real conversations unchanged. Times are shown in the viewer's clock (Ghana = UTC).
 */
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAY_MS = 24 * 60 * 60 * 1000;

const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
const daysAgo = (at, now) => Math.round((startOfDay(now) - startOfDay(at)) / DAY_MS);

export const clockLabel = (iso) => {
  const d = new Date(iso);
  const h = d.getHours();
  return `${h % 12 || 12}:${String(d.getMinutes()).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
};

/** Inbox row time: 9:05 AM today, Yesterday, a weekday this week, else 10 Oct. */
export const rowTimeLabel = (iso, now = new Date()) => {
  if (!iso) return '';
  const d = new Date(iso);
  const ago = daysAgo(d, now);
  if (ago <= 0) return clockLabel(iso);
  if (ago === 1) return 'Yesterday';
  if (ago < 7) return WEEKDAYS[d.getDay()];
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
};

/** Date pill: Today, Yesterday, else 14 Oct. */
export const dayLabel = (iso, now = new Date()) => {
  const d = new Date(iso);
  const ago = daysAgo(d, now);
  if (ago <= 0) return 'Today';
  if (ago === 1) return 'Yesterday';
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
};

const firstName = (name) =>
  String(name || '')
    .replace(/^(Mr|Mrs|Ms|Dr)\.\s+/, '')
    .split(' ')[0];

// Request notices / safety copy from the drawn request (T-MSG-03/04), with the recruiter's own name and role.
const DRAWN_REQUEST = MESSAGE_CONVERSATIONS.find((c) => c.id === 'request');

const requestNotices = (row) => {
  const who = firstName(row.name) || 'This recruiter';
  const about = row.jobTitle ? ` about ${row.jobTitle}` : '';
  return {
    pending: {
      tone: 'yellow',
      bold: `${who} wants to message you${about}.`,
      text: ' They can see your public profile. Your email and phone stay hidden, and they won’t know you’ve read this until you accept.',
    },
    accepted: DRAWN_REQUEST.notices.accepted,
  };
};

/** One API row -> the record shape MessagesInboxList / MessagesThread read. */
export const recordFromRow = (row, now = new Date()) => ({
  id: row.id,
  listId: row.id,
  live: true,
  name: row.name || 'Recruiter',
  role: row.role || '',
  avatar: row.avatarUrl || null,
  initials: row.initials || '',
  verified: Boolean(row.verified),
  label: row.label || '',
  reChip: row.reChip || null,
  jobTitle: row.jobTitle || null,
  time: rowTimeLabel(row.lastMessageAt, now),
  preview: row.preview ? `${row.previewFromMe ? 'You: ' : ''}${row.preview}` : '',
  unread: row.unread || 0,
  request: Boolean(row.request),
  muted: Boolean(row.muted),
  confidential: Boolean(row.confidential),
  gap: 12,
  notices: row.request ? requestNotices(row) : null,
  footnote: row.request
    ? `If you decline, ${firstName(row.name) || 'they'} won’t be told why. Requests you ignore close after 30 days.`
    : null,
  thread: [],
});

/** A job (API) -> the JobProposalCard data, from the drawn card templates. */
export const jobCardFromApi = (job) => {
  if (!job) return null;
  const base = {
    ...JOB_CARD_PENDING,
    id: job.id,
    company: job.company || '',
    role: job.role || '',
    tags: job.tags || [],
    matchPercent: job.matchPercent ?? null,
    skillsLabel: job.skillsLabel || '',
    pickedForYou: false,
    badge: 'New',
  };
  switch (job.state) {
    case 'passing':
      return {
        ...base,
        state: 'passing',
        statusLabel: 'Passing',
        reasonsPrompt: 'Want to tell us why? (optional)',
        reasons: JOB_REASON_CHIPS,
        selectedReason: job.reason || null,
        reasonsNote: 'Your reason stays private. It only helps us improve your matches.',
        passLabel: 'Pass on this role',
        cancelLabel: 'Cancel',
      };
    case 'passed':
      return {
        ...base,
        state: 'passed',
        statusLabel: 'Passed',
        passedNote: `You passed on this role. ${base.company || 'The employer'} only sees that you passed.`,
      };
    case 'applied':
      return {
        ...base,
        state: 'applied',
        statusLabel: 'Applied',
        applied: { label: job.appliedLabel || 'You applied', action: 'Track' },
      };
    case 'closed':
      return {
        ...base,
        state: 'closed',
        statusLabel: 'Closed',
        closedNote: job.closedOn ? `This role closed on ${job.closedOn}.` : 'This role has closed.',
        closedAction: 'See similar roles',
      };
    default:
      return base;
  }
};

/** API messages (+ job) -> thread items with date pills; the job card sits after the recruiter's first message. */
export const threadFromApi = ({ messages = [], job = null }, now = new Date()) => {
  const items = [];
  let lastDay = null;
  let cardPlaced = !job;
  messages.forEach((m) => {
    const day = dayLabel(m.at, now);
    if (day !== lastDay) {
      items.push({ kind: 'date', label: day });
      lastDay = day;
    }
    const time = clockLabel(m.at);
    if (m.from === 'me') {
      items.push({ kind: 'sent', id: m.id, text: m.text, time, status: m.status || 'delivered' });
    } else {
      items.push({ kind: 'received', id: m.id, text: m.text, time });
      if (!cardPlaced) {
        items.push({ kind: 'jobCard', id: `job-${job.id}`, card: jobCardFromApi(job) });
        cardPlaced = true;
      }
    }
  });
  if (!cardPlaced) items.push({ kind: 'jobCard', id: `job-${job.id}`, card: jobCardFromApi(job) });
  return items;
};
