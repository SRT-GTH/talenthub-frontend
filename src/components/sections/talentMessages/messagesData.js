import owuraPhoto from '../../../assets/talent-messages/inbox/recruiter-owura-asante.jpg';
import akosuaPhoto from '../../../assets/talent-messages/inbox/recruiter-akosua-quansah.jpg';
import roselynPhoto from '../../../assets/talent-messages/inbox/recruiter-roselyn-awinnor.jpg';
import abigailPhoto from '../../../assets/talent-messages/inbox/recruiter-abigail-mensah.jpg';
import amaPhoto from '../../../assets/talent-messages/inbox/recruiter-ama-darko.jpg';
import {
  INTERVIEW_CARD_INVITE,
  JOB_CARD_APPLIED,
  JOB_CARD_CLOSED,
  JOB_CARD_PENDING,
} from './cards/messageCardsData.js';

/*
 * Talent Messages (package A) — mock data, shaped like the future API:
 *   GET /messages/conversations        -> MESSAGE_CONVERSATIONS (list rows: id, name, role, preview, time, unread, request…)
 *   GET /messages/conversations/:id    -> the same record incl. `thread`
 * Text is VERBATIM from the Figma node `characters` (frames T-MSG-01…14, read through the Figma MCP).
 *
 * Thread item kinds:
 *   { kind:'date', label }
 *   { kind:'received', id, text, time, reaction?:{ count }, extraBefore?, extraAfter? }
 *   { kind:'sent', id, text, time, status:'read'|'delivered'|'failed'|'sending' }
 *   { kind:'jobCard', card, picked? }       rendered through ./cards/JobProposalCard.jsx
 *   { kind:'interview', card }              rendered through ./cards/InterviewCard.jsx
 *   { kind:'roleSummary', match, title, meta }
 *   `when: 'confirmed' | 'accepted'` -> the item only exists once the interview is confirmed / the request accepted.
 *
 * Not drawn in Figma and therefore NOT built: Roselyn Awinnor's conversation (only her inbox row is drawn), accepting the
 * confidential company's request, and every menu action beyond the drawn menu itself.
 * Conversation keys: owura (drawn default, T-MSG-01/02/05/06), applied (T-MSG-07), closed (T-MSG-12), interview (T-MSG-08/09),
 * roselyn, abigail (T-MSG-10), request (T-MSG-03/04), confidential (T-MSG-11). `listId` = which inbox row a record belongs to
 * (applied / closed are the SAME Owura row shown in another state).
 */
/* A record's `avatar` is a drawn key (below) or, in the live inbox, the person's photo URL (null = initials). */
export const avatarSrc = (avatar) => (avatar ? (AVATARS[avatar] ?? avatar) : null);

export const AVATARS = {
  owura: owuraPhoto,
  akosua: akosuaPhoto,
  roselyn: roselynPhoto,
  abigail: abigailPhoto,
  ama: amaPhoto,
};

const HI_KOFI =
  "Hi Kofi, I came across your profile and think you'd be a great fit for one of our open roles.";
const NO_PRESSURE =
  "No pressure at all. Happy to answer any questions about the role first if that's easier.";
const GREAT_QUESTION = 'Great question: a short skills task, then a 30-minute call with the team.';

const owuraBase = {
  listId: 'owura',
  name: 'Mr. Owura Asante',
  role: 'HR Lead · Farmerline',
  avatar: 'owura',
  label: 'Verified employer',
  unread: 0,
  request: false,
};

export const MESSAGE_CONVERSATIONS = [
  {
    ...owuraBase,
    id: 'owura',
    reChip: 'Re: Data Science Intern · 88% match',
    time: '9:05 AM',
    preview: "Great question. It's a short skills task…",
    typing: 'Owura is typing…',
    gap: 8,
    thread: [
      { kind: 'date', label: 'Yesterday' },
      { kind: 'received', id: 'o1', text: HI_KOFI, time: '2:18 PM' },
      { kind: 'jobCard', id: 'o-card', card: JOB_CARD_PENDING, picked: true, extraBefore: 8 },
      {
        kind: 'received',
        id: 'o2',
        text: NO_PRESSURE,
        time: '2:20 PM',
        reaction: { count: 1 },
        extraBefore: 8,
        extraAfter: 10,
      },
      {
        kind: 'sent',
        id: 'o3',
        text: 'What are the stages of the process?',
        time: '3:38 PM',
        status: 'read',
      },
      { kind: 'date', label: 'Today' },
      { kind: 'received', id: 'o4', text: GREAT_QUESTION, time: '9:05 AM' },
    ],
  },
  {
    ...owuraBase,
    id: 'applied',
    reChip: 'Re: Data Science Intern · Applied',
    time: '9:20 AM',
    preview: 'You: Thank you! I’ve just applied…',
    gap: 8,
    thread: [
      { kind: 'date', label: 'Yesterday' },
      { kind: 'received', id: 'a1', text: HI_KOFI, time: '2:18 PM' },
      { kind: 'jobCard', id: 'a-card', card: JOB_CARD_APPLIED },
      { kind: 'received', id: 'a2', text: NO_PRESSURE, time: '2:20 PM' },
      { kind: 'date', label: 'Today' },
      { kind: 'received', id: 'a3', text: GREAT_QUESTION, time: '9:05 AM' },
      {
        kind: 'sent',
        id: 'a4',
        text: 'Thank you! I’ve just applied. Looking forward to the skills task.',
        time: '9:20 AM',
        status: 'delivered',
      },
    ],
  },
  {
    ...owuraBase,
    id: 'closed',
    reChip: 'Re: Data Science Intern · Closed',
    time: '20 Oct',
    preview: 'Thanks for your interest, Kofi. This role…',
    gap: 12,
    thread: [
      { kind: 'date', label: '14 Oct' },
      { kind: 'received', id: 'c1', text: HI_KOFI, time: '2:18 PM' },
      { kind: 'jobCard', id: 'c-card', card: JOB_CARD_CLOSED },
      { kind: 'received', id: 'c2', text: NO_PRESSURE, time: '2:20 PM' },
      { kind: 'date', label: '20 Oct' },
      {
        kind: 'received',
        id: 'c3',
        text: 'Thanks for your interest, Kofi. This role has now closed, but we’ll keep you in mind for the next intake.',
        time: '11:00 AM',
      },
    ],
  },
  {
    id: 'interview',
    listId: 'interview',
    name: 'Akosua Quansah',
    role: 'Talent Partner · Hubtel',
    avatar: 'akosua',
    label: 'Verified employer',
    reChip: 'Re: Junior Product Designer · 81% match',
    time: 'Yesterday',
    preview: 'Interview invite · Thu 16 Oct',
    unread: 1,
    request: false,
    gap: 12,
    thread: [
      { kind: 'date', label: 'Yesterday' },
      {
        kind: 'received',
        id: 'i1',
        text: 'Hi Kofi! Thanks for applying for Junior Product Designer. The team loved your portfolio and would like to meet you.',
        time: '4:12 PM',
      },
      { kind: 'interview', id: 'i-card', card: INTERVIEW_CARD_INVITE },
      {
        kind: 'received',
        id: 'i2',
        text: 'Let me know if this time works. Happy to move it if not.',
        time: '4:13 PM',
      },
      {
        kind: 'sent',
        id: 'i3',
        text: 'Thursday at 10 works for me. Is there anything I should prepare?',
        time: '4:30 PM',
        status: 'read',
        when: 'confirmed',
      },
      {
        kind: 'received',
        id: 'i4',
        text: 'Great! Just bring examples of your recent work. See you Thursday.',
        time: '4:41 PM',
        when: 'confirmed',
      },
    ],
  },
  {
    id: 'roselyn',
    listId: 'roselyn',
    name: 'Roselyn Awinnor',
    // Only her inbox row is drawn in Figma: no header, no thread (the row is not selectable, see UNDRAWN_CONVERSATIONS).
    role: '',
    avatar: 'roselyn',
    label: 'Verified employer',
    reChip: null,
    time: 'Fri',
    preview: "We'll send the final-round details by…",
    unread: 2,
    request: false,
    gap: 12,
    thread: [],
  },
  {
    id: 'abigail',
    listId: 'abigail',
    name: 'Abigail Mensah',
    role: 'Recruiting Manager · mPharma',
    avatar: 'abigail',
    label: 'Verified employer',
    reChip: 'Re: Operations Associate · 74% match',
    time: '10 Oct',
    preview: "Not sent: Yes I am! I'd love to hear more.",
    previewTone: 'error',
    unread: 0,
    request: false,
    gap: 12,
    thread: [
      { kind: 'date', label: '10 Oct' },
      {
        kind: 'received',
        id: 'b1',
        text: 'How are you doing? Are you still open to operations roles?',
        time: '10:15 AM',
      },
      {
        kind: 'sent',
        id: 'b2',
        text: "Yes I am! I'd love to hear more.",
        time: '10:40 AM',
        status: 'failed',
      },
      {
        kind: 'sent',
        id: 'b3',
        text: 'Is the role based in Kumasi?',
        time: 'Now',
        status: 'sending',
      },
    ],
  },
  {
    id: 'request',
    listId: 'request',
    name: 'Ama Darko',
    role: 'Talent Acquisition · MTN Ghana',
    avatar: 'ama',
    label: 'Verified employer',
    reChip: 'Re: Business Analyst · 85% match',
    time: '9:41 AM',
    preview: 'Hello Kofi, I’m hiring a Business Analyst…',
    unread: 0,
    request: true,
    gap: 12,
    notices: {
      pending: {
        tone: 'yellow',
        bold: 'Ama wants to message you about Business Analyst.',
        text: ' She can see your public profile. Your email and phone stay hidden, and she won’t know you’ve read this until you accept.',
      },
      accepted: {
        tone: 'green',
        bold: 'Stay safe:',
        text: ' real employers on GTH never ask you to pay to apply, train or get a job. Never share your Ghana Card PIN or Mobile Money PIN.',
      },
    },
    footnote: 'If you decline, Ama won’t be told why. Requests you ignore close after 30 days.',
    acceptedRow: { time: 'Now', preview: 'You: Hello Ama, thank you for reaching out…' },
    thread: [
      { kind: 'date', label: 'Today' },
      {
        kind: 'received',
        id: 'q1',
        text: 'Hello Kofi, I’m hiring a Business Analyst for our Accra office and your SQL and Power BI work stood out. Would you be open to a quick chat this week?',
        time: '9:41 AM',
      },
      {
        kind: 'roleSummary',
        id: 'q-role',
        match: '85%',
        title: 'Business Analyst',
        meta: 'MTN Ghana · Accra · On-site · GHS 7,000–9,500 / month',
      },
      {
        // "Accept and reply" sends the first reply drawn in T-MSG-04.
        kind: 'sent',
        id: 'q2',
        text: 'Hello Ama, thank you for reaching out. I’d be happy to chat. I’m free Wednesday or Thursday afternoon.',
        time: '9:52 AM',
        status: 'delivered',
        when: 'accepted',
      },
    ],
  },
  {
    id: 'confidential',
    listId: 'confidential',
    name: 'Confidential company',
    role: 'Hiring team · name shared once you reply',
    avatar: null,
    confidential: true,
    label: 'GTH-checked business',
    reChip: 'Re: Product Analyst · 79% match',
    time: '8:12 AM',
    preview: 'Hi Kofi, we’re a fintech company in Accra…',
    unread: 0,
    request: true,
    gap: 12,
    notices: {
      pending: [
        {
          tone: 'yellow',
          bold: 'A confidential company wants to message you about Product Analyst.',
          text: ' They can see your public profile. Your email and phone stay hidden until you accept.',
        },
        {
          tone: 'blue',
          text: 'This employer is keeping its name private for now. GTH has checked that it’s a registered business. They’ll share their name if you start talking.',
        },
      ],
      accepted: {
        tone: 'green',
        bold: 'Stay safe:',
        text: ' real employers on GTH never ask you to pay to apply, train or get a job. Never share your Ghana Card PIN or Mobile Money PIN.',
      },
    },
    footnote: 'If you decline, they won’t be told why. Requests you ignore close after 30 days.',
    acceptedRow: { time: 'Now', preview: null },
    thread: [
      { kind: 'date', label: 'Today' },
      {
        kind: 'received',
        id: 'k1',
        text: 'Hi Kofi, we’re a fintech company in Accra hiring a Product Analyst. We keep our name private at this early stage. Your verified Data Analysis badge caught our eye.',
        time: '8:12 AM',
      },
      {
        kind: 'roleSummary',
        id: 'k-role',
        match: '79%',
        title: 'Product Analyst',
        meta: 'Confidential company · Accra · Fintech · Pay shared on request',
      },
    ],
  },
];

/* Inbox rows are the primary records; applied / closed are the Owura row in another state. */
export const PRIMARY_IDS = ['owura', 'interview', 'roselyn', 'abigail', 'request', 'confidential'];
/* Rows with the hairline under them (Figma `Frame 1618870151/2` after Akosua and Roselyn). */
export const SEPARATOR_AFTER = ['interview', 'roselyn'];

export const MESSAGES_COPY = {
  title: 'Messages',
  subtitle: 'Your conversations with recruiters, in one place.',
  searchPlaceholder: 'Search by name or message...',
  tabs: { all: 'All', unread: 'Unread', requests: 'Requests' },
  requestsNotice:
    'Recruiters you haven’t talked to yet land here first. They can’t see your contact details until you accept.',
  composerPlaceholder: 'Write a message…',
  helpMeReply: 'Help me reply',
  verified: 'Verified employer',
  accept: 'Accept and reply',
  notNow: 'Not now',
  decline: 'Decline',
  spam: 'Report as spam',
  offline: "You're offline. Messages will send when you're back online.",
  notSent: 'Not sent',
  retry: 'Tap to retry',
  sending: 'Sending…',
  empty: {
    listTitle: 'No messages yet',
    listText:
      'Recruiters can message you once your profile is visible. A complete profile is found more often.',
    cta: 'Check my visibility',
    link: 'Browse your matches',
    threadTitle: 'Your recruiter conversations will show up here',
    threadText:
      'When a recruiter reaches out about a role, you decide whether to reply. Your email and phone stay hidden until you do.',
  },
  menu: [
    { id: 'profile', label: 'View recruiter’s profile', icon: 'user', w: 164, gap: 12 },
    { id: 'mute', label: 'Mute notifications', icon: 'mute', w: 152, gap: 12 },
    { id: 'archive', label: 'Archive conversation', icon: 'archive', w: 158, gap: 8 },
    { id: 'report', label: 'Report conversation', icon: 'flag', w: 157, gap: 8 },
    { id: 'block', label: 'Block this recruiter', icon: 'ban', w: 157, gap: 5 },
    { id: 'delete', label: 'Delete Conversation', icon: 'trash', w: 157, gap: 5, danger: true },
  ],
  headerArt: {
    default: {
      label: '4 recruiters in your inbox',
      sticker: 'Fast replies get noticed',
      week: '3 replies this week',
    },
    empty: {
      label: 'Your inbox is warming up',
      sticker: 'First recruiter chat loading…',
      week: 'Be visible, get found',
    },
    loading: {
      label: 'Checking your inbox…',
      sticker: 'Fast replies get noticed',
      week: '3 replies this week',
    },
  },
};

/* The title sticker is static per tab in the frames ("2 new" / "2 requests"), counted from the seed. */
export const SEED_COUNTS = {
  all: MESSAGE_CONVERSATIONS.filter((c) => PRIMARY_IDS.includes(c.id) && !c.request).length,
  unread: MESSAGE_CONVERSATIONS.filter((c) => PRIMARY_IDS.includes(c.id) && c.unread > 0).length,
  requests: MESSAGE_CONVERSATIONS.filter((c) => c.request).length,
};

/* Inbox rows whose conversation is not drawn in Figma: shown in the list, not selectable. */
export const UNDRAWN_CONVERSATIONS = ['roselyn'];
