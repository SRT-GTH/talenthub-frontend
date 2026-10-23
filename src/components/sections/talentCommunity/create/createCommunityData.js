/*
 * Create-your-own-community — copy + mock API data (frontend-only; shaped like the future API so the swap is mechanical).
 * Figma canvas "Talent - community Engagement" 5456:19207: Playful section 8947:2928, Focused twin 8944:2672
 * (CC-02 … CC-17b, 19 frames each). Copy is VERBATIM from Figma (texts.py): curly quotes, middle dots, the en dash in "14–17".
 * Both styles carry identical copy (only the chrome differs), so there is one copy block for both.
 *
 * Blocks:
 *   ---- wizard ----    copy, options, drawn draft (CC-02 … CC-05), eligibility (CC-12), name conflicts (CC-02b)
 *   ---- owner page ---- status copy (banner / sticker / hero meta / actions), fixtures per status (CC-06 … CC-17b)
 *   ---- dialogs ----   invite, mentor, manage, transfer, archive, toast
 *
 * API shape of an owned community (`GET /communities/mine/:id`), see `buildOwnedCommunity`:
 *   { id, name, about, topic, cover, joinPolicy: 'public'|'request'|'invite', ageRule: 'adults'|'fourteen-plus',
 *     regions[], ownRules[{ id, title, detail }], checkFirstPosts, allowEvents,
 *     status: 'draft'|'under-review'|'waiting-mentor'|'needs-change'|'live'|'archived',
 *     feedback (needs-change reason), submittedOn, approvedOn, archivedOn, restoreUntil,
 *     members[{ id, name, role, activity, avatar, online }], moderators[{ id, name, title, note, state }],
 *     joinRequests[{ id, name, note, age }], reports[{ id, reason, reportedBy, quote, note }],
 *     inviteLink, invitedMentor { name, sentAgo }, transfer { toId, toName, sentOn, expiresOn } | null }
 */
import avatarMichael from '../../../../assets/talent-community/page/michael-asante.jpg';
import avatarAbigail from '../../../../assets/talent-community/page/abigail-mensah.jpg';
import avatarRansford from '../../../../assets/talent-community/page/ransford-kudjoe.jpg';
import avatarAkosua from '../../../../assets/talent-community/page/akosua-quansah.jpg';
import coverDraft from '../../../../assets/talent-community/browse/cover-young-entrepreneurs-network.webp';
import coverThumb from '../../../../assets/talent-community/create/cover-upload-thumbnail.png';
import { COMMUNITIES_RESPONSE, COMMUNITY_DETAILS } from '../communityData.js';

/* ---- wizard ---- */

export const CREATE_COPY = {
  title: 'Start a community',
  reviewTitle: 'Check and submit',
  close: 'Close',
  steps: [
    { id: 'basics', label: 'Basics' },
    { id: 'who', label: 'Who can join' },
    { id: 'rules', label: 'House rules' },
    { id: 'review', label: 'Review' },
  ],
  basics: {
    name: 'Community name',
    nameFree: 'Name is free. People will find it as #{tag}.',
    nameTaken: 'That name is taken. Pick another name, or join the one that exists.',
    about: 'What’s it about?',
    aboutCount: '{count} of 160 characters',
    topic: 'Topic',
    cover: 'Add a cover photo',
    coverHint: 'A real photo of your people works best · JPG or PNG · up to 5 MB',
    draftNote: 'Your draft saves as you go',
    cancel: 'Cancel',
    next: 'Next: who can join',
    noCompany: 'No company names',
    suggest: 'Free names you could use',
    existsTitle: '{name} already exists',
    existsBody:
      '{members}, active daily. Joining could be quicker than starting from zero. Try a narrower name, like “{example}”.',
    view: 'View {name}',
  },
  who: {
    joinTitle: 'Who can join?',
    ageTitle: 'Who it’s for',
    regionTitle: 'Where are your people?',
    note: 'You can change this later in Settings',
    back: 'Back',
    next: 'Next: house rules',
  },
  rules: {
    gthTitle: 'GTH rules · always on',
    alwaysOn: 'Always on',
    ownTitle: 'Your rules · {count} of 5',
    edit: 'Edit',
    add: 'Add a rule',
    moderation: 'Moderation',
    note: 'Rules show to everyone before they join',
    back: 'Back',
    next: 'Next: review',
  },
  review: {
    draft: 'Draft',
    memberOne: '1 member',
    underReview: 'Under review',
    justYou: 'Just you so far',
    nextTitle: 'What happens next',
    nextBody:
      'GTH checks new communities within 24 hours. While you wait, invite your co-moderators. A mentor or teacher must join before it opens to under-18s.',
    agree:
      'I agree to the GTH community guidelines. I’ll moderate this community and act on reports within 48 hours.',
    back: 'Back',
    submit: 'Submit for review',
  },
  notReady: {
    title: 'Almost ready to start a community',
    intro: 'Communities need a real person behind them. Two more things and you’re set.',
    finishProfile: 'Finish profile',
    underTitle: 'Under 18?',
    underBody:
      'You can draft a community and invite friends. It opens once a verified mentor or teacher co-moderates it, and your parent is told.',
    note: 'You can run up to 3 communities at a time',
    notNow: 'Not now',
    finishMine: 'Finish my profile',
  },
};

export const CREATE_TOPICS = [
  'Software engineering',
  'Data science',
  'Design',
  'Agriculture',
  'Entrepreneurship',
  'STEM',
  'Trades',
  'Health',
];

export const CREATE_JOIN_OPTIONS = [
  { id: 'public', icon: 'globe', title: 'Public', body: 'Anyone on GTH can find it and join.' },
  {
    id: 'request',
    icon: 'users',
    title: 'Request to join',
    body: 'Anyone can find it. You approve each new member.',
  },
  {
    id: 'invite',
    icon: 'lock',
    title: 'Invite only',
    body: 'Hidden from search. People join with your link.',
  },
];

export const CREATE_AGE_OPTIONS = [
  { id: 'adults', icon: 'user', title: '18 and over', body: 'Members must be 18 or older.' },
  {
    id: 'fourteen-plus',
    icon: 'users',
    title: 'All ages, 14 and up',
    body: 'Needs a verified mentor or teacher as co-moderator. Adults can’t message under-18 members.',
  },
];

export const CREATE_REGIONS = [
  'All of Ghana',
  'Greater Accra',
  'Ashanti',
  'Northern',
  'Volta',
  '+ More regions',
];

export const GTH_RULES = [
  'Be kind and respectful',
  'No paid job ads or pay-to-apply',
  'Keep phone numbers and addresses private',
];

export const MAX_OWN_RULES = 5;

/* The drawn draft (CC-02 … CC-05): shown by every frame URL (`?demo=1`). */
export const DEMO_DRAFT = {
  name: 'Agritech Innovators Ghana',
  about:
    'For students and builders working on tech for Ghanaian farms: drones, market prices, cold chain and more.',
  topic: 'Agriculture',
  cover: { src: coverThumb, name: 'cover-photo.jpg' },
  joinPolicy: 'public',
  ageRule: 'fourteen-plus',
  regions: ['All of Ghana'],
  ownRules: [
    {
      id: 'sources',
      title: 'Share sources for prices and data',
      detail: 'Link the market report or the photo you took.',
    },
    {
      id: 'intro',
      title: 'Introduce yourself in your first week',
      detail: 'Say what you grow, build or study.',
    },
  ],
  checkFirstPosts: true,
  allowEvents: true,
  agreed: true,
};

/* A fresh draft (the real flow). ⚠️ ASSUMPTION: Figma only draws the filled state, so a new draft starts empty with the safest
 * choices (public, adults only, all of Ghana, both moderation checks on as drawn). */
export const EMPTY_DRAFT = {
  name: '',
  about: '',
  topic: null,
  cover: null,
  joinPolicy: 'public',
  ageRule: 'adults',
  regions: ['All of Ghana'],
  ownRules: [],
  checkFirstPosts: true,
  allowEvents: true,
  agreed: false,
};

/* The one-line blurb the review card shows (Figma CC-05 draws "For students and builders working on tech for Ghanaian farms.", the
 * about text up to its colon). ⚠️ ASSUMPTION: that cut is the rule — the text before the first colon (if it is long enough),
 * else the whole about text. */
export const toCardBlurb = (about) => {
  const head = about.split(':')[0].trim();
  return about.includes(':') && head.length >= 20 ? `${head}.` : about;
};

/* The cover the review card falls back to when no photo was added (⚠️ ASSUMPTION; Figma only draws a photo). */
export const DEFAULT_COVER = coverDraft;

/* GET /me/community-eligibility — the real flow passes (⚠️ ASSUMPTION: there is no profile-completion backend yet);
 * `?state=not-ready` shows the drawn failing state. */
export const ELIGIBILITY = {
  ready: {
    phoneVerified: true,
    joinedOn: '2 Sep',
    daysOnGth: 51,
    profilePercent: 72,
    minPercent: 60,
  },
  notReady: {
    phoneVerified: true,
    joinedOn: '2 Sep',
    daysOnGth: 51,
    profilePercent: 45,
    minPercent: 60,
  },
};

/* Names that already exist (GET /communities/name-check). The drawn conflict is Data Science Ghana (CC-02b). */
export const NAME_CONFLICT_SUGGESTIONS = {
  'data-science-ghana': [
    'Data Science Ghana · Tamale',
    'Women in Data Ghana',
    'Data Science for Agri',
  ],
};

const normalise = (value) =>
  value
    .replace(/^#/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

export const slugify = (value) => normalise(value).replace(/\s+/g, '-');

/* "#AgritechInnovatorsGhana": the tag people will find the community by. */
export const toHashtag = (value) =>
  value
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');

/* The catalogue community whose name equals `name`, with up to three free alternatives. */
export const findNameConflict = (name) => {
  const key = normalise(name);
  if (!key) return null;
  const hit = COMMUNITIES_RESPONSE.communities.find((c) => normalise(c.name) === key);
  if (!hit) return null;
  const suggestions = NAME_CONFLICT_SUGGESTIONS[hit.id] ?? [
    `${hit.name} · Tamale`,
    `${hit.name} · Kumasi`,
    `${hit.name} · Accra`,
  ];
  return { id: hit.id, name: hit.name, members: hit.members, suggestions };
};

/* ---- owner page ---- */

export const OWNER_STATUSES = [
  'under-review',
  'waiting-mentor',
  'needs-change',
  'live',
  'transfer-pending',
  'archived',
];

/* One entry per owner-view status (CC-06, CC-07, CC-11, CC-08, CC-16b, CC-17b).
 * banner tone: neutral (#f7f8f4 / ink@.25) | amber (#fdf5e0 / #a0700a@.25) | red (#fcece9 / #c0392b@.25). */
export const OWNER_STATUS_COPY = {
  'under-review': {
    sticker: 'Under review',
    metaStatus: 'Submitted today',
    banner: {
      tone: 'neutral',
      icon: 'help',
      title: 'Under review · usually within 24 hours',
      body: 'We check the name, photo and rules, then notify you. Invite your co-moderators now so you’re ready on day one.',
    },
    primary: { id: 'edit', label: 'Edit details' },
    secondary: { id: 'mentor', label: 'Invite co-moderators' },
    hint: 'Only you can see this page until it’s live',
    empty: {
      title: 'Posting opens when it’s live',
      body: 'Draft a welcome post now. It goes out the moment GTH approves your community.',
      cta: 'Draft a welcome post',
    },
  },
  'waiting-mentor': {
    sticker: 'Almost live',
    metaStatus: 'Approved today',
    banner: {
      tone: 'amber',
      icon: 'info',
      title: 'Approved. One step left: a verified mentor',
      body: 'It’s open to ages 14 and up, so a verified mentor or teacher must co-moderate before it opens. Invite sent to Adjoa Boateng 2 hours ago.',
    },
    primary: { id: 'edit', label: 'Edit details' },
    secondary: { id: 'mentor', label: 'Invite another mentor' },
    hint: 'Opens when a verified mentor accepts',
    empty: {
      title: 'Posting opens when it’s live',
      body: 'Your welcome post is saved and goes out when the community opens.',
      cta: 'Edit welcome post',
    },
  },
  'needs-change': {
    sticker: 'Needs a change',
    metaStatus: 'Checked today',
    banner: {
      tone: 'red',
      icon: 'shield',
      title: 'Needs a change before it goes live',
      body: 'Your cover photo shows a company logo. Use a photo of your people instead, then send it again. Everything else looks good.',
    },
    primary: { id: 'ask', label: 'Ask GTH a question' },
    secondary: { id: 'resubmit', label: 'Edit and resubmit' },
    hint: 'Only you can see this page',
    empty: {
      title: 'Posting opens when it’s live',
      body: 'Fix the cover photo and resubmit. Most changes are checked within a few hours.',
      cta: 'Edit and resubmit',
    },
  },
  live: {
    sticker: 'Owner',
    metaStatus: 'Live today',
    primary: { id: 'manage', label: 'Manage' },
    secondary: { id: 'invite', label: 'Invite people' },
    hint: 'You + 2 founding members',
    empty: {
      title: 'No posts yet. Be the first!',
      body: 'The first post sets the tone. Founding members who post this week get a Founding Voice badge.',
      cta: 'Write the first post',
    },
  },
  'transfer-pending': {
    sticker: 'Owner',
    metaStatus: 'Live today',
    banner: {
      tone: 'neutral',
      icon: 'help',
      title: 'Waiting for Adjoa to accept ownership',
      body: 'Sent today. It expires on 27 Oct. You stay the owner until she accepts.',
    },
    primary: { id: 'cancel-transfer', label: 'Cancel transfer' },
    secondary: { id: 'invite', label: 'Invite people' },
    hint: 'You + 2 founding members',
    empty: {
      title: 'No posts yet. Be the first!',
      body: 'The first post sets the tone. Founding members who post this week get a Founding Voice badge.',
      cta: 'Write the first post',
    },
  },
  archived: {
    sticker: 'Archived',
    metaStatus: 'Archived 20 Oct',
    banner: {
      tone: 'amber',
      icon: 'info',
      title: 'Archived on 20 Oct 2026',
      body: 'Read-only and hidden from search. You can restore it until 18 Jan 2027.',
    },
    primary: { id: 'restore', label: 'Restore community' },
    secondary: null,
    hint: 'You + 2 founding members',
    empty: {
      title: 'This community is archived',
      body: 'Old posts stay readable. Restore it to let members post again.',
      cta: null,
    },
  },
};

export const OWNER_COPY = {
  back: 'All communities',
  feedHint: 'Posting opens when it’s live',
  info: {
    members: 'Members',
    activity: 'Activity',
    visibility: 'Visibility',
    moderatedBy: 'Moderated by',
  },
  tabs: { feed: 'Feed', about: 'About', members: 'Members', events: 'Events' },
  moderatorsTitle: 'Moderators',
  foundingTitle: 'Founding members',
  topicsTitle: 'Suggested topics',
  toastLive: '{name} is live · +100 {xp}',
  toastShare: 'Share',
  eventsZero: '0 events',
  newBadge: 'New',
};

const AGRITECH = COMMUNITY_DETAILS['agritech-innovators-ghana'];

export const OWNER_PAGE_ASSETS = {
  collage: AGRITECH.collage,
  topics: AGRITECH.topics,
  related: AGRITECH.related,
  faces: [avatarMichael, avatarAbigail, avatarRansford],
};

const KOFI = {
  id: 'kofi',
  name: 'Kofi Agyekum',
  avatar: avatarMichael,
  online: true,
};
const ABIGAIL = { id: 'abigail', name: 'Abigail Mensah', avatar: avatarAbigail, online: false };
const ADJOA = { id: 'adjoa', name: 'Adjoa Boateng', avatar: avatarRansford, online: false };

const SEED_JOIN_REQUESTS = [
  {
    id: 'michael',
    name: 'Michael Asante',
    note: '“Running a hydroponics pilot in Kumasi.”',
    avatar: avatarMichael,
    minor: false,
  },
  {
    id: 'efua',
    name: 'Efua Mensah',
    note: '“Learning drone mapping for our farm.”',
    avatar: avatarAbigail,
    minor: false,
  },
  {
    id: 'kojo',
    name: 'Kojo Serwaa · 14–17',
    note: '“Our school club is building a soil sensor.”',
    avatar: avatarRansford,
    minor: true,
  },
];

const SEED_REPORT = {
  id: 'report-1',
  reason: 'Spam or scam',
  reportedBy: 'Reported by 3 members · 1 h ago',
  quote:
    '“Cheap fertiliser for members only. Pay GHS 200 to join our WhatsApp group and get the price list.”',
  note: 'Posted by a new member · hidden from the feed until you decide',
};

/*
 * Fixtures behind the `?state=` frame URLs (and what the real flow starts from after "Submit for review").
 * `requests` (URL `?requests=3`) seeds the three join requests CC-14 / CC-15 draw (CC-08 / CC-10 draw none: the "Requests" tab
 * is only listed when there are some — Figma inconsistency, kept).
 */
export const buildOwnedCommunity = (status = 'live', { requests = 0 } = {}) => {
  const isLive = ['live', 'transfer-pending', 'archived'].includes(status);
  const invited = !isLive;
  const moderators = isLive
    ? [
        { ...KOFI, title: 'Owner', note: 'You', state: 'owner' },
        {
          ...ADJOA,
          title: 'Verified teacher',
          note: 'Co-moderator · needed for ages 14+',
          state: 'active',
        },
        {
          id: 'ransford',
          name: 'Ransford Kudjoe',
          avatar: avatarRansford,
          title: null,
          note: 'Invite sent yesterday',
          state: 'invited',
        },
      ]
    : [
        { ...KOFI, title: 'Owner', note: 'Owner · you', state: 'owner' },
        {
          ...ADJOA,
          title: 'Verified teacher',
          note: 'Verified teacher · invite sent',
          state: 'invited',
        },
      ];
  const members = isLive
    ? [
        { ...KOFI, role: 'owner', activity: 'Owner · you' },
        { ...ABIGAIL, role: 'member', activity: 'Active 2 days ago' },
        { ...ADJOA, role: 'moderator', activity: 'Verified teacher · co-moderator' },
      ]
    : [{ ...KOFI, role: 'owner', activity: 'Owner · you' }];
  return {
    id: 'agritech-innovators-ghana',
    name: DEMO_DRAFT.name,
    about: DEMO_DRAFT.about,
    topic: DEMO_DRAFT.topic,
    cover: DEMO_DRAFT.cover,
    joinPolicy: 'public',
    ageRule: 'fourteen-plus',
    regions: ['All of Ghana'],
    ownRules: DEMO_DRAFT.ownRules,
    checkFirstPosts: true,
    allowEvents: true,
    status,
    feedback: status === 'needs-change' ? OWNER_STATUS_COPY['needs-change'].banner.body : null,
    members,
    moderators,
    joinRequests: requests > 0 ? SEED_JOIN_REQUESTS.slice(0, requests) : [],
    reports: isLive ? [SEED_REPORT] : [],
    inviteLink: 'gth.gh/c/agritech-innovators',
    invitedMentor: invited ? { name: 'Adjoa Boateng', sentAgo: '2 hours ago' } : null,
    transfer:
      status === 'transfer-pending'
        ? { toId: 'adjoa', toName: 'Adjoa Boateng', sentOn: 'today', expiresOn: '27 Oct' }
        : null,
  };
};

/* A community made from the wizard (POST /communities): one member (you), under review. */
export const buildSubmittedCommunity = (draft, id) => {
  const base = buildOwnedCommunity('under-review');
  return {
    ...base,
    id,
    name: draft.name.trim(),
    about: draft.about.trim(),
    topic: draft.topic,
    cover: draft.cover,
    joinPolicy: draft.joinPolicy,
    ageRule: draft.ageRule,
    regions: draft.regions,
    ownRules: draft.ownRules,
    checkFirstPosts: draft.checkFirstPosts,
    allowEvents: draft.allowEvents,
    moderators: [base.moderators[0]],
    invitedMentor: null,
    inviteLink: `gth.gh/c/${id}`,
  };
};

/* ---- dialogs ---- */

export const INVITE_COPY = {
  title: 'Invite people to #{name}',
  link: 'Invite link',
  copy: 'Copy link',
  copied: 'Copied',
  people: 'People you may know',
  invite: 'Invite',
  invited: 'Invited',
  calloutTitle: 'Inviting under-18s',
  calloutBody:
    'Talents under 18 only get invites from people they follow, and their parent can see which communities they join.',
  note: 'Founding members who post this week get a badge',
  done: 'Done',
  suggestions: [
    {
      id: 'michael',
      name: 'Michael Asante',
      detail: 'Agribusiness · KNUST · follows you',
      avatar: avatarMichael,
      invited: false,
    },
    {
      id: 'abigail',
      name: 'Abigail Mensah',
      detail: 'Drone pilot · Tamale',
      avatar: avatarAbigail,
      invited: false,
    },
    {
      id: 'ransford',
      name: 'Ransford Kudjoe',
      detail: 'Cold-chain startup · Accra',
      avatar: avatarRansford,
      invited: true,
    },
  ],
};

export const MENTOR_COPY = {
  title: 'Invite a verified mentor',
  whoTitle: 'Who counts as a verified mentor',
  who: [
    '18 or older, with Ghana Card checked on GTH',
    'Staff at a GTH-verified school or institution, or holds the GTH Mentor badge (safeguarding course + 2 references)',
    'No open safety reports',
  ],
  search: 'Search verified mentors',
  placeholder: 'Name, school or skill',
  suggested: 'Suggested for {topic}',
  invite: 'Invite',
  sent: 'Invite sent',
  note: 'Only people who meet all three show here',
  // ⚠️ ASSUMPTION: not drawn — the empty search result.
  noMatch: 'No verified mentors match that search.',
  done: 'Done',
  people: [
    {
      id: 'adjoa',
      name: 'Adjoa Boateng',
      detail: 'Teacher · Tamale SHS · verified by school',
      avatar: avatarRansford,
    },
    {
      id: 'yaw',
      name: 'Yaw Owusu',
      detail: 'Agribusiness mentor · GTH Mentor badge',
      avatar: avatarRansford,
    },
    {
      id: 'akosua',
      name: 'Akosua Quansah',
      detail: 'Lecturer · UDS Nyankpala · verified by institution',
      avatar: avatarAkosua,
    },
  ],
};

export const MANAGE_COPY = {
  title: 'Manage #{name}',
  tabs: {
    reports: 'Reports',
    requests: 'Requests',
    members: 'Members',
    moderators: 'Moderators',
    settings: 'Settings',
  },
  keep: 'Keep post',
  remove: 'Remove and warn',
  noReports: 'No open reports',
  moderators: 'Moderators',
  remind: 'Remind',
  reminded: 'Reminder sent',
  reportsNote: 'Owners act on reports within 48 hours',
  requestsCount: '{count} people want to join',
  requestsNone: 'No one is waiting to join',
  approveAll: 'Approve all',
  decline: 'Decline',
  approve: 'Approve',
  howTitle: 'How requests work',
  howBody:
    'Each request answers one question you set. Age bands show to verified moderators only. Requests expire after 14 days and the person is told kindly.',
  requestsNote: 'Only for “Request to join” communities',
  settingsNote: 'Only the owner sees Settings',
  close: 'Close',
  settings: {
    edit: {
      title: 'Edit details',
      body: 'Name, about, topic and cover photo. Name changes are checked again.',
    },
    who: { title: 'Who can join', body: '{join} · ages {age}' },
    rules: { title: 'House rules', body: '3 GTH rules + {count} of yours' },
    transfer: {
      title: 'Transfer ownership',
      body: 'Hand it to a co-moderator. They must accept.',
      action: 'Transfer',
    },
    archive: {
      title: 'Archive community',
      body: 'Make it read-only and hide it from search. Restore within 90 days.',
      action: 'Archive',
    },
  },
  joinLabels: { public: 'Public', request: 'Request to join', invite: 'Invite only' },
  ageLabels: { adults: '18 and over', 'fourteen-plus': '14 and up' },
};

export const TRANSFER_COPY = {
  title: 'Transfer ownership',
  who: 'Who should own it?',
  adjoaDetail: 'Verified teacher · co-moderator since 20 Oct',
  ransfordDetail: 'Hasn’t accepted the moderator invite yet',
  points: [
    {
      icon: 'clock',
      title: '{name} has 7 days to accept',
      body: 'If she doesn’t, nothing changes.',
    },
    {
      icon: 'user',
      title: 'You become a moderator',
      body: 'You keep posting and moderating. Only the owner can archive or transfer.',
    },
    {
      icon: 'shield',
      title: 'New owners must be 18+ and verified',
      body: 'Because the community is open to ages 14 and up.',
    },
  ],
  confirm: 'I understand I can’t undo this once {name} accepts.',
  cancel: 'Cancel',
  send: 'Send transfer request',
};

export const ARCHIVE_COPY = {
  title: 'Archive #{name}?',
  points: [
    { icon: 'eyeOff', title: 'Hidden from search and recommendations', body: null },
    {
      icon: 'lock',
      title: 'Read-only',
      body: 'Members can read old posts but can’t post or comment.',
    },
    {
      icon: 'calendar',
      title: 'Events are cancelled',
      body: 'Members who said they’d come are told.',
    },
    { icon: 'mail', title: 'Members are told', body: '“{name} is now archived.”' },
    {
      icon: 'clock',
      title: 'Restore within 90 days',
      body: 'After that it stays archived. GTH keeps it for safety reviews.',
    },
  ],
  confirm: 'I understand members will lose the ability to post.',
  note: 'Thinking of leaving? Transfer it instead',
  cancel: 'Cancel',
  archive: 'Archive community',
};

export const COMMUNITY_THUMB = coverThumb;
