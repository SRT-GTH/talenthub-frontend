import photoAmaBoateng from '../../../assets/recruiter-messages/photo-ama-boateng.png';
import photoAkosuaQuansah from '../../../assets/recruiter-messages/photo-akosua-quansah.png';
import photoJulianReed from '../../../assets/recruiter-messages/photo-julian-reed.png';

/*
 * Mock data + verbatim copy of the recruiter inbox (Figma "Recruiter - Messages" 10124:23474, R-MSG-01 … R-MSG-11).
 * ⚠️ ASSUMPTION: every value is mock; no API, nothing persisted (state lives in the URL, archiving is local).
 * Figma quirks kept as drawn: the tab counts differ per frame ("All (06)" / "Unread (03)" on the Unread frame), the auto-message note names "Eleanor"
 * while the thread is with Ama, and the match meter is drawn ~95 % full under an "84 % match" label.
 */
export const PAGE = {
  title: 'Messages',
  subtitle: 'Your conversations with candidates and applicants, in one place.',
  newBadge: '2 new',
};

export const SEARCH_PLACEHOLDER = 'Search by name, job or message';
export const ARCHIVE_SEARCH_PLACEHOLDER = 'Search archive...';
export const COMPOSER = { placeholder: 'Write a message…', help: 'Help me reply' };

/* Stage chips: icon is the Figma export baked in that chip's colour (assets/recruiter-messages/icon-*.svg). */
export const STAGES = {
  applicant: { label: 'Applicant', face: 'bg-[#ebf1ec] text-[#2a5730]', icon: 'inbox' },
  screening: { label: 'Screening', face: 'bg-[#eaeffb] text-[#244a9f]', icon: 'pipeline' },
  invited: { label: 'Invited', face: 'bg-[#f5f3ff] text-[#6d28d9]', icon: 'send' },
  shortlisted: { label: 'Shortlisted', face: 'bg-[#ebf1ec] text-[#2a5730]', icon: 'check' },
  interview: { label: 'Interview', face: 'bg-[#faf4e8] text-[#463409]', icon: 'calendar' },
  'not-progressed': {
    label: 'Not progressed',
    face: 'bg-[#f8f8f4] text-[#575755]',
    icon: 'x-circle',
  },
};

export const CONVERSATIONS = [
  {
    id: 'ama-boateng',
    name: 'Ama Boateng',
    meta: 'Product Lead · Accra',
    photo: photoAmaBoateng,
    online: true,
    time: '9:32 AM',
    preview: 'Thank you! Happy to share my portfolio. Here’s the link…',
    stage: 'applicant',
    job: 'Senior UX Designer',
    unread: 0,
    applicant: true,
    thread: 'ama',
  },
  {
    id: 'akosua-quansah',
    name: 'Akosua Quansah',
    meta: 'Senior UX Designer · Remote',
    photo: photoAkosuaQuansah,
    time: '8:40 AM',
    preview: 'Tuesday at 14:00 works for me.',
    stage: 'screening',
    job: 'Senior UX Designer',
    unread: 1,
    thread: 'akosua',
  },
  {
    id: 'julian-reed',
    name: 'Julian Reed',
    meta: 'Senior UX Designer · Remote',
    photo: photoJulianReed,
    time: '8:12 AM',
    preview: 'New application · Senior UX Designer',
    stage: 'applicant',
    job: 'Senior UX Designer',
    unread: 1,
    applicant: true,
    thread: 'ama',
  },
  {
    id: 'kofi-amankwah',
    name: 'Kofi Amankwah',
    meta: 'Senior Product Engineer · Accra',
    initials: 'KA',
    time: 'Mon',
    preview: 'Thanks for the invite! I’ll apply today.',
    stage: 'invited',
    job: 'Senior Product Engineer',
    unread: 2,
    thread: 'akosua',
  },
  {
    id: 'ella-mensah',
    name: 'Ella Mensah',
    meta: 'Senior UX Designer · Kumasi',
    initials: 'EM',
    time: 'Yesterday',
    preview: 'Here’s my portfolio and two case studies.',
    stage: 'shortlisted',
    job: 'Senior UX Designer',
    unread: 0,
    thread: 'akosua',
  },
  {
    id: 'sarah-jenkins',
    name: 'Sarah Jenkins',
    meta: 'Senior UX Designer · London',
    initials: 'SJ',
    time: '12 Oct',
    preview: 'See you at the interview!',
    stage: 'interview',
    job: 'Senior UX Designer',
    unread: 0,
    thread: 'akosua',
  },
];

/* R-MSG-05: the archived list. Ama is the one open in the frame. */
export const ARCHIVED = [
  { ...CONVERSATIONS[0], restoreLabel: 'Move back to inbox' },
  {
    id: 'marcus-thorne',
    name: 'Marcus Thorne',
    meta: 'Data Analyst Intern · Accra',
    initials: 'MT',
    time: '8:12 AM',
    preview: 'Okay, thank you for the update.',
    stage: 'not-progressed',
    job: 'Data Analyst Intern',
    thread: 'akosua',
  },
  {
    id: 'godfred-ansah',
    name: 'Godfred Ansah',
    meta: 'Data Analyst Intern · Accra',
    initials: 'GA',
    time: '8:12 AM',
    preview: 'Thanks for letting me know, Joel.',
    stage: 'not-progressed',
    job: 'Data Analyst Intern',
    thread: 'akosua',
  },
];

/* Tab counts as each frame draws them. */
export const TAB_COUNTS = {
  default: { all: '(14)', unread: '(4)', applicants: 2 },
  unread: { all: '(06)', unread: '(03)', applicants: 2 },
  none: { all: '(14)', unread: '(4)', applicants: 0 },
  empty: { all: '(0)', unread: '(0)', applicants: 0 },
};

export const TABS = [
  { id: 'all', label: 'All' },
  { id: 'unread', label: 'Unread' },
  { id: 'applicants', label: 'Applicants' },
];

export const APPLICATION_CARD = {
  role: 'Product Lead · Accra · 8 yrs experience',
  jobPill: 'Senior UX Designer · Applied',
  facts: ['Meets 5 of 5 screening rules', 'Available in 1 month', 'Applied with GTH profile'],
  match: '84% match',
  skills: '4 of 5 key skills',
  meter: 94.9,
  primary: 'View in Pipeline',
  secondary: 'View profile',
};

export const AUTO_NOTE =
  'Eleanor can’t see this card. They received “Thanks for applying to Senior UX Designer at Silver Rock Technology.”';

export const THREAD_HEADER = { match: '84% match', re: 'Re: Senior UX Designer · Applied' };

export const THREADS = {
  ama: {
    groups: [
      {
        day: 'Today',
        items: [
          { kind: 'application' },
          { kind: 'note' },
          {
            kind: 'message',
            own: true,
            text: 'Hi Ama, thanks for applying! Your profile looks like a strong fit. Could you share 2–3 portfolio pieces you’re proudest of?',
            time: '3:38 PM',
            receipt: 'Read',
          },
          {
            kind: 'message',
            text: 'Thank you! Happy to share my portfolio. Here’s the link: ama.design/work',
            time: '9:32 AM',
          },
        ],
      },
    ],
  },
  akosua: {
    groups: [
      {
        day: 'Yesterday',
        items: [
          {
            kind: 'message',
            own: true,
            text: 'Hi Julian, we’d love to do a 30-minute intro call. Would Tuesday at 14:00 work?',
            time: '3:38 PM',
            receipt: 'Read',
          },
        ],
      },
      {
        day: 'Today',
        items: [{ kind: 'message', text: 'Tuesday at 14:00 works for me.', time: '9:32 AM' }],
      },
    ],
  },
};

export const EMPTY = {
  inbox: {
    title: 'No conversations yet',
    body: 'Messages from applicants and talent you invite will show up here.',
    icon: 'message-tile',
  },
  applicants: {
    title: 'No applications yet',
    body: 'When someone applies to one of your jobs, a message card lands here and they’re added to your pipeline.',
    icon: 'inbox-tile',
    action: 'Invite matching talent',
  },
  archive: {
    title: 'Nothing archived',
    body: 'Archive finished conversations to keep your inbox focused. You can bring them back any time.',
    icon: 'archive-tile',
  },
  startRight: {
    title: 'Start your first conversation',
    body: 'Find talent that matches your open roles and invite them to apply. Their reply lands here.',
    primary: 'Post a job',
    secondary: 'Search talent',
  },
  liveRight: {
    title: 'Your 2 active jobs are live',
    body: 'Product Designer went live today. Share the link or invite talent to get applicants faster.',
    action: 'Go to Job Postings',
    icon: 'briefcase-tile',
  },
  selectRight: {
    title: 'Select a conversation',
    body: 'Open a conversation to reply, review an application or schedule an interview.',
  },
  selectArchived: { title: 'Select a conversation', body: 'Archived conversations open here.' },
};

export const ARCHIVE_VIEW = {
  banner: {
    title: 'This conversation is archived',
    body: 'It moves back to your inbox automatically if Ama replies.',
    action: 'Unarchive',
  },
};

export const TOASTS = {
  archived: {
    tone: 'success',
    title: 'Success - Conversation with Ama Boateng archived',
    message: 'Find it with the archive button next to search',
    actionLabel: 'Undo',
  },
  unarchived: {
    tone: 'success',
    title: 'Success - Moved back to your inbox',
    message: 'Ama Boateng',
    actionLabel: 'Undo',
  },
};

export const MENU_ITEMS = [
  { id: 'view-profile', label: 'View candidate profile' },
  { id: 'mute', label: 'Mute notifications' },
  { id: 'archive', label: 'Archive conversation' },
  { id: 'report', label: 'Report conversation' },
  { id: 'block', label: 'Block this candidate' },
  { id: 'delete', label: 'Delete Conversation', destructive: true },
];
