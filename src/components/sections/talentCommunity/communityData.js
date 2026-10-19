/* ---- posts ---- */
/*
 * Posts block — C-07 post + comments (Playful 7628:5877 / Focused 8110:461719), C-08 create post (7628:6479 / 8110:462216),
 * C-10 report post (7628:6979 / 8110:462663), C-13 pending review (7629:8158 / 8110:464198), C-17 leave confirm
 * (7628:7443 / 8110:463098), C-09 milestone share (7631:7835 / 8110:465607), HP help pop-over. Text is verbatim Figma.
 * API shape: GET /communities/:id/posts/:postId -> POST_DETAIL · POST /communities/:id/posts -> CREATE_POST body
 * { type, text, tags, link } · POST /posts/:id/report { reason, note } · DELETE /communities/:id/membership.
 * Playful and Focused draw identical copy; only "+50 XP" -> "+50 pts" (milestone sticker) differs.
 *
 * ⚠️ ASSUMPTIONS (the frames imply, do not draw):
 *   - The frames draw the dialogs FILLED (create: update + 3 lines of text + tags + link; report: "Spam or scam" + a note).
 *     `?modal=create|report` boots exactly that state (CREATE_POST.seed / REPORT_POST.seed); the empty form (placeholder,
 *     nothing picked) is not drawn and shows an empty field with no placeholder text. Submit needs a non-empty text / a reason.
 *   - Create -> Post closes the dialog, sets `?pending=1` and shows the TOAST_POSTED toast (C-13); the toast hides after 6s.
 *   - Report -> Submit report closes the dialog (no confirmation is drawn).
 *   - Leave -> "Leave community" closes the dialog and drops `joined` (back to the C-04 preview). "Mute" only logs.
 *   - Milestone: the "A community" chip is a plain toggle (the picker menu is not drawn); preview meta follows the chip
 *     ("Just now · My connections" / "A community" / "Public"). "Share" and "No thanks, keep it private" close the dialog.
 *   - Post detail ids: only the first post (Yaa Asantewaa) is drawn with comments, id `yaa-first-pr`. Other ids resolve to it.
 *   - Comment like / reply / "View 4 replies" / "View 10 more comments" are local: like toggles +1, reply focuses the reply
 *     input, "Post" appends a comment by Kofi. The 4 replies / 10 more comments are not drawn: those links only log.
 *   - HP help pop-over frames (8376:504261 / 8376:504381) do not exist in the file (the Figma API returns null for both ids):
 *     COMMUNITY_HELP_COPY mirrors the sibling pages (SKILLS_LAB / ASSESSMENT) with community questions invented.
 */
export const CREATE_POST = {
  title: 'Create a post',
  postingTo: 'Posting to',
  types: [
    { id: 'update', label: 'Update', icon: 'info' },
    { id: 'achievement', label: 'Achievement', icon: 'star' },
    { id: 'question', label: 'Question', icon: 'help' },
    { id: 'resource', label: 'Resource', icon: 'link' },
  ],
  fieldLabel: 'What’s happening?',
  assist: 'Help me write it',
  addTag: '+ tag',
  upload: {
    title: 'Add photos or a screen recording',
    sub: 'Drag & drop or browse · PNG, JPG, MP4 · up to 10 MB',
  },
  addLink: '+ Add link',
  note: 'Your first 2 posts are checked by a moderator',
  cancel: 'Cancel',
  post: 'Post',
  seed: {
    type: 'update',
    text: 'Shipped the dark mode toggle on my portfolio this weekend. Took 3 tries to get the system preference + manual override working together. Happy to share the hook if anyone needs it.',
    tags: ['#PortfolioWeekend', '#ReactGh'],
    link: 'github.com/kofi-a/portfolio',
  },
};

export const REPORT_POST = {
  title: 'Report this post',
  subtitle: 'Help us keep {community} safe. Reports are anonymous.',
  reasons: [
    { id: 'spam', label: 'Spam or scam', sub: 'Fake jobs, pay-to-apply, phishing links' },
    { id: 'harassment', label: 'Harassment or hate', sub: 'Targeting a person or group' },
    { id: 'misleading', label: 'Misleading or false', sub: 'Fake credentials or claims' },
    { id: 'inappropriate', label: 'Inappropriate content', sub: 'Not safe for a career community' },
    { id: 'other', label: 'Something else', sub: 'Tell us more below' },
  ],
  fieldLabel: 'Anything else we should know?',
  note: '{author} won’t know who reported',
  cancel: 'Cancel',
  submit: 'Submit report',
  /* The reported post in the frames is Samuel Boateng's (the second post). */
  author: 'Samuel',
  seed: {
    reason: 'spam',
    note: 'The link asks for a GHS 200 “registration fee” before the interview.',
  },
};

export const LEAVE_COMMUNITY = {
  title: 'Leave {community}?',
  rows: [
    'You’ll stop seeing posts and event invites from this community',
    'Your posts and comments stay, with your name on them',
    'You can rejoin any time, no approval needed',
  ],
  alt: 'Just too many notifications? Mute it instead.',
  mute: 'Mute',
  stay: 'Stay',
  leave: 'Leave community',
};

export const MILESTONE_SHARE = {
  title: 'Milestone unlocked!',
  sticker: '+50 {xp}',
  body: 'You finished your {stage}. Want to share it? Posts like this get you noticed by people in your field.',
  stage: 'Personality Assessment',
  fieldLabel: 'Your message',
  message: 'Just completed my {stage} on GTH. One step closer to finding the right career fit!',
  shareWith: 'Share with',
  audiences: [
    { id: 'connections', label: 'My connections', icon: 'users' },
    { id: 'community', label: 'A community', icon: 'message', caret: true },
    { id: 'public', label: 'Public', icon: 'globe' },
  ],
  preview: 'Preview',
  previewName: 'Kofi Agyekum',
  previewTag: 'Achievement',
  previewMeta: 'Just now · {audience}',
  banner: 'Kofi completed the {stage}',
  keepPrivate: 'No thanks, keep it private',
  share: 'Share',
};

export const TOAST_POSTED = 'Posted! It’ll go live after a quick check';

export const PENDING_POST = {
  id: 'kofi-pending',
  author: 'Kofi Agyekum',
  tag: 'Update',
  time: 'Just now',
  banner:
    'Only you can see this for now. A moderator usually checks new members’ posts within an hour.',
  edit: 'Edit',
  likes: '124',
  comments: '18',
  save: 'Save',
  share: 'Share',
};

export const POST_DETAIL = {
  id: 'yaa-first-pr',
  author: 'Yaa Asantewaa',
  tag: 'Achievement',
  time: '5 hours ago',
  text: 'Just merged my first PR into a production codebase at work today. Small change, huge feeling. Thank you to everyone here who reviewed my code over the past few months, you made this possible.',
  hashtags: ['#FirstPRMerged', '#FrontendJobsGh', '#ShipItFriday'],
  likes: 86,
  comments: 12,
  save: 'Save',
  share: 'Share',
  composer: { value: 'Congrats Yaa! What was the PR about?', post: 'Post' },
  thread: [
    {
      id: 'akosua',
      author: 'Akosua Mansa',
      time: '11h',
      text: 'Well done Yaa! First of many.',
      likes: 20,
      replies: 'View 4 replies',
    },
    {
      id: 'kingd',
      author: 'King D',
      time: '11h',
      text: 'Congrats sis. What stack is the team on?',
      likes: 3,
      replyPlaceholder: 'Reply to King D…',
    },
  ],
  more: 'View 10 more comments',
  reply: 'Reply',
};

/* HP — Help pop-over for the Community pages (see the HP assumption above: frames not found). Same shape as
 * SKILLS_LAB_HELP_COPY. HelpPopover would pick it via `home.helpPage === 'community'` (the lead wires that). */
export const COMMUNITY_HELP_COPY = {
  title: 'Help',
  subtitle: 'Quick answers for the page you are on',
  search: 'Search help, e.g. verify a skill',
  pageLabel: 'FOR THIS PAGE · COMMUNITY',
  page: [
    { label: 'How do I join a community?', icon: 'help' },
    { label: 'Why is my post waiting for review?', icon: 'help' },
    { label: 'How do I report a post?', icon: 'help' },
  ],
  popularLabel: 'POPULAR',
  popular: [
    { label: 'A recruiter asked me to pay a fee. What do I do?', icon: 'shield' },
    { label: 'Can I use GTH without data?', icon: 'info' },
    { label: 'How do I verify a skill?', icon: 'verified' },
  ],
  buddy: 'Ask Career Buddy',
  whatsapp: 'WhatsApp us',
  replay: 'Replay the tour',
  shortcuts: 'Shortcuts',
  help: 'Help centre',
};
/* ---- end posts ---- */

/* ---- browse ---- */
/*
 * Community catalogue — `GET /communities` (C-01 Find your people, C-02 filtered, C-03 all, C-15 loading, C-16 no results).
 * Figma: Playful 7625:4354 / 7625:4994 / 7625:5501 / 7629:9453 / 7629:10123, Focused 8110:460141 / 8110:460413 /
 * 8110:460690 / 8110:464979 / 8110:465331, component set "GTH · Community card" 7624:4401.
 * Copy is VERBATIM from the node `characters`; anything not drawn is tagged ⚠️ ASSUMPTION.
 *
 * ⚠️ ASSUMPTION: category membership (`categories`). Figma only draws "Software engineering" (C-02): SE Ghana, Frontend Devs Ghana,
 *    Hackathons Ghana. The other chips (Data science, Design, Entrepreneurship, STEM, Hackathons, Trades) are mapped by name;
 *    First-Gen Scholars sits in no category; "Cybersecurity" has no community yet (drawn chip, empty result is invented).
 * ⚠️ ASSUMPTION: member counts / activity beyond the drawn cards do not exist; every community of the catalogue is drawn once.
 */
import coverSoftwareEngineering from '../../../assets/talent-community/browse/cover-software-engineering-ghana.webp';
// Figma uses the SAME bitmap for Data Science Ghana and Hackathons Ghana (imageRef 9b9c75ce…).
import coverDataScience from '../../../assets/talent-community/browse/cover-data-science-ghana.webp';
import coverFrontend from '../../../assets/talent-community/browse/cover-frontend-devs-ghana.webp';
import coverStemGirls from '../../../assets/talent-community/browse/cover-stem-girls-ghana.webp';
import coverYoungEntrepreneurs from '../../../assets/talent-community/browse/cover-young-entrepreneurs-network.webp';
import coverCreatives from '../../../assets/talent-community/browse/cover-creatives-designers-hub.webp';
import coverFirstGen from '../../../assets/talent-community/browse/cover-first-gen-scholars.webp';
import coverTrades from '../../../assets/talent-community/browse/cover-trades-vocational-skills.webp';
import coverYoungFounders from '../../../assets/talent-community/browse/cover-young-founders-hub.webp';
import face1 from '../../../assets/talent-community/browse/face-1.webp';
import face2 from '../../../assets/talent-community/browse/face-2.webp';
import face3 from '../../../assets/talent-community/browse/face-3.webp';
import face4 from '../../../assets/talent-community/browse/face-4.webp';
import faceHeader3 from '../../../assets/talent-community/browse/face-header-3.webp';

export const COMMUNITY_BROWSE_COPY = {
  title: 'Find your people',
  subtitle:
    'Learn with people on the same path, get feedback on your work, and get noticed by recruiters.',
  searchPlaceholder: 'Search communities…',
  pickedTitle: 'Picked for you',
  pickedNote: (basedOn) => `Based on your skills: ${basedOn}`,
  loadingNote: 'Finding communities that fit your skills…',
  yourCommunities: 'Your communities',
  allCommunities: 'All communities',
  closest: 'Closest communities',
  friendsHere: '+ friends here',
  join: 'Join',
  joined: 'Joined',
  tiles: {
    discoverTitle: 'Can’t find your people?',
    discoverBody: 'Ask for a new community. 25 requests and we open it.',
    discoverLink: 'Request a community',
  },
  noResults: {
    title: (term) => `No community for “${term}” yet`,
    body: 'Ask us to start one. When 25 people ask, we open it and you become a founding member.',
    progress: (asked, needed) => `${asked} of ${needed} people have asked`,
    request: 'Request this community',
    clear: 'Clear search',
  },
  results: {
    showing: (count) => `Showing ${count} ${count === 1 ? 'community' : 'communities'} in`,
    clear: '· Clear',
  },
  menu: { open: 'Open community', mute: 'Mute notifications', leave: 'Leave community' },
  header: {
    friends: '9 friends are here',
    ask: 'Ask, share, get seen',
    xp: '+20 XP per helpful answer',
  },
};

// Header art faces (Playful only): the 4 "Recruiter faces" of the Messages-header component.
export const COMMUNITY_HEADER_FACES = [face1, face3, faceHeader3, face4];
// Card footer faces: always the same three bitmaps in Figma.
export const COMMUNITY_CARD_FACES = [face1, face2, face3];

export const COMMUNITY_CATEGORIES = [
  { id: 'software-engineering', label: 'Software engineering' },
  { id: 'data-science', label: 'Data science' },
  { id: 'design', label: 'Design' },
  { id: 'entrepreneurship', label: 'Entrepreneurship' },
  { id: 'stem', label: 'STEM' },
  { id: 'hackathons', label: 'Hackathons' },
  { id: 'trades', label: 'Trades' },
  { id: 'cybersecurity', label: 'Cybersecurity' },
];

/*
 * `tag`: the cover pill. kind 'joined' = "You’re in" (green-tinted, only on joined cards), 'highlight' = yellow pill
 * ("Top match for you" / "Fits your skills" / "Event this week"). `friends` is just the avatar stack (the copy "+ friends here"
 * carries no number in Figma).
 */
export const COMMUNITIES_RESPONSE = {
  total: 10,
  picked: {
    basedOn: 'Data analytics, SQL, Python',
    ids: [
      'software-engineering-ghana',
      'data-science-ghana',
      'frontend-devs-ghana',
      'stem-girls-ghana',
      'young-entrepreneurs-network',
      'creatives-designers-hub',
      'hackathons-ghana',
      'first-gen-scholars',
    ],
  },
  // C-16 draws these three for "blockchain"; ⚠️ ASSUMPTION: the same three for every term with no match.
  closest: {
    ids: ['software-engineering-ghana', 'young-founders-hub', 'hackathons-ghana'],
    // Figma draws the closest cards as plain "Join" cards (no tag, even for Software Engineering Ghana) and Hackathons Ghana
    // with "Active daily" (C-01 says "New event Sat"): kept verbatim, flip `verbatim` to use the live catalogue state instead.
    verbatim: true,
    activity: { 'hackathons-ghana': 'Active daily' },
  },
  // C-16: how many people already asked for the missing community (⚠️ constant for every term).
  request: { asked: 14, needed: 25 },
  communities: [
    {
      id: 'software-engineering-ghana',
      name: 'Software Engineering Ghana',
      members: 2400,
      activity: 'Active daily',
      description: 'Learn, build, and get code-reviewed by peers across Ghana.',
      cover: coverSoftwareEngineering,
      categories: ['software-engineering'],
      joined: true,
      tag: { kind: 'joined', label: 'You’re in' },
    },
    {
      id: 'data-science-ghana',
      name: 'Data Science Ghana',
      members: 890,
      activity: 'Active daily',
      description: 'Share datasets, discuss models, and grow your analytics skills.',
      cover: coverDataScience,
      categories: ['data-science'],
      joined: false,
      tag: { kind: 'highlight', label: 'Top match for you' },
    },
    {
      id: 'frontend-devs-ghana',
      name: 'Frontend Devs Ghana',
      members: 1240,
      activity: 'Active daily',
      description: 'Swap tips on React, CSS tricks, and shipping faster.',
      cover: coverFrontend,
      categories: ['software-engineering'],
      joined: false,
      tag: { kind: 'highlight', label: 'Fits your skills' },
    },
    {
      id: 'stem-girls-ghana',
      name: 'STEM Girls Ghana',
      members: 650,
      activity: 'Active this week',
      description: 'A space for girls in STEM to mentor and be mentored.',
      cover: coverStemGirls,
      categories: ['stem'],
      joined: false,
      tag: null,
    },
    {
      id: 'young-entrepreneurs-network',
      name: 'Young Entrepreneurs Network',
      members: 890,
      activity: 'Active daily',
      description: 'Pitch ideas, find co-founders, and swap startup lessons.',
      cover: coverYoungEntrepreneurs,
      categories: ['entrepreneurship'],
      joined: false,
      tag: null,
    },
    {
      id: 'creatives-designers-hub',
      name: 'Creatives & Designers Hub',
      members: 1200,
      activity: 'Active daily',
      description: 'Portfolio feedback, briefs, and creative collabs.',
      cover: coverCreatives,
      categories: ['design'],
      joined: false,
      tag: null,
    },
    {
      id: 'hackathons-ghana',
      name: 'Hackathons Ghana',
      members: 380,
      activity: 'New event Sat',
      description: 'Team up for hackathons and build events across Ghana.',
      cover: coverDataScience,
      categories: ['software-engineering', 'hackathons'],
      joined: false,
      tag: { kind: 'highlight', label: 'Event this week' },
    },
    {
      id: 'first-gen-scholars',
      name: 'First-Gen Scholars',
      members: 780,
      activity: 'Active this week',
      description: 'Navigating university as the first in your family.',
      cover: coverFirstGen,
      categories: [],
      joined: false,
      tag: null,
    },
    {
      id: 'trades-vocational-skills',
      name: 'Trades & Vocational Skills',
      members: 430,
      activity: 'Active this week',
      description: 'Apprenticeships, certifications, and hands-on skill sharing.',
      cover: coverTrades,
      categories: ['trades'],
      joined: false,
      tag: null,
    },
    {
      id: 'young-founders-hub',
      name: 'Young Founders Hub',
      members: 512,
      activity: 'Active daily',
      description: 'Trade startup lessons and find your next co-founder.',
      cover: coverYoungFounders,
      categories: ['entrepreneurship'],
      joined: false,
      tag: null,
    },
  ],
};

/* GET /communities/:id (catalogue entry only; the community page agent adds its own detail blocks). */
export const getCommunityById = (id) =>
  COMMUNITIES_RESPONSE.communities.find((c) => c.id === id) ?? null;

/* "2,400 members" — thousands separator like Figma. */
export const formatMembers = (count) => `${count.toLocaleString('en-US')} members`;
/* ---- /browse ---- */

/* ---- page ---- */
/*
 * Community page block — C-04 preview (Playful 7626:5230 / Focused 8110:460975), C-05 just joined + guidelines (7626:6030 /
 * 8110:461314), C-06 feed (7626:6896 / 8110:466316), C-11 About tab (7629:6784 / 8110:463503), C-12 Members tab (7629:7423 /
 * 8110:463834), C-14 empty feed (7629:8836 / 8110:464653). Copy is VERBATIM from the node `characters`; Playful and Focused draw
 * identical copy except the "+10 XP" / "+10 pts" toast sticker ({xp} token, resolved by the page).
 * API shape: GET /communities/:id -> COMMUNITY_DETAILS[id] · GET /communities/:id/posts -> .posts · GET /communities/:id/members.
 *
 * ⚠️ ASSUMPTIONS (the frames imply, do not draw):
 *   - The drawn page is "#Frontend Devs Ghana" but the lead's URL table (wiki/talent-community.md) puts it on
 *     `/community/software-engineering-ghana`: both ids resolve to the same detail (COMMUNITY_DETAIL_ALIASES); the related card
 *     "Software Engineering Ghana" (2,400 members) is a different community that falls back to the catalogue below.
 *   - Communities that are not drawn (every other catalogue id) render the same page from their catalogue entry: `#<name>`, member
 *     count, activity, description, an empty feed (the C-14 card), and the Frontend About / Members content (generic house rules).
 *   - Preview vs joined: `?joined=1` (or a real Join click) = joined; Join -> `?joined=1&welcome=1` + the "You're in!" toast;
 *     "Joined" opens the leave confirmation (`?modal=leave`); "Got it" / "Read full guidelines" are drawn on C-05 only.
 *   - Feed filters (Achievements/Updates/Questions/Resources) filter by post kind; an empty result shows the C-14 empty card.
 *     The "Newest" select has no other option drawn (it is a one-option select). Trending/suggested topic chips link to the
 *     community search (`/community?q=<tag>`). The "Events" tab is drawn without a screen: it is inert.
 *   - Members tab: "Near you" = lives in Accra, search matches name / role / skills, Follow toggles Follow / Following,
 *     "Show more members" hides itself (only the six drawn members exist). The message button is inert (no talent messages route).
 *   - The hero "You + 1,239 others" on C-14 (24 members) and the per-frame card gaps (24 / 20 / 14) are Figma inconsistencies kept
 *     as drawn: see `COMMUNITY_PAGE_RHYTHM` below.
 */
import avatarMichael from '../../../assets/talent-community/page/michael-asante.jpg';
import avatarAbigail from '../../../assets/talent-community/page/abigail-mensah.jpg';
import avatarRansford from '../../../assets/talent-community/page/ransford-kudjoe.jpg';
import avatarAkosua from '../../../assets/talent-community/page/akosua-quansah.jpg';
import avatarSamuel from '../../../assets/talent-community/page/samuel-boateng.jpg';
import avatarYaa from '../../../assets/talent-community/page/yaa-asantewaa.jpg';
import thumbSoftwareEngineering from '../../../assets/talent-community/page/thumb-software-engineering.jpg';
import thumbHackathons from '../../../assets/talent-community/page/thumb-hackathons.jpg';
import collageFrontend1 from '../../../assets/talent-community/page/collage-frontend-1.jpg';
import collageFrontend2 from '../../../assets/talent-community/page/collage-frontend-2.jpg';
import collageFrontend3 from '../../../assets/talent-community/page/collage-frontend-3.jpg';
import collageAgritech1 from '../../../assets/talent-community/page/collage-agritech-1.jpg';
import collageAgritech2 from '../../../assets/talent-community/page/collage-agritech-2.jpg';
import collageAgritech3 from '../../../assets/talent-community/page/collage-agritech-3.jpg';
import postImageA from '../../../assets/talent-community/page/post-image-a.jpg';
import postImageB from '../../../assets/talent-community/page/post-image-b.jpg';
import postImageC from '../../../assets/talent-community/page/post-image-c.jpg';
import emptyFeedSpot from '../../../assets/talent-community/page/empty-feed-spot.svg';

/* Hero face stack (Figma `faces`: the same three bitmaps on every frame). */
export const COMMUNITY_PAGE_FACES = [avatarMichael, avatarAbigail, avatarRansford];

export const COMMUNITY_PAGE_COPY = {
  back: 'All communities',
  join: 'Join community',
  joined: 'Joined',
  invite: 'Invite friends',
  share: 'Share',
  tabs: { feed: 'Feed', about: 'About', members: 'Members', events: 'Events' },
  filters: ['All', 'Achievements', 'Updates', 'Questions', 'Resources'],
  sort: 'Newest',
  composer: {
    placeholder: 'Share a win, ask a question or drop a resource…',
    photo: 'Photo',
    win: 'Win',
    link: 'Link',
  },
  preview: {
    title: 'You’re previewing this community',
    sub: 'Join to post, react, comment and see member-only resources.',
    join: 'Join',
  },
  guidelines: {
    title: 'Before you post: 3 house rules',
    rules: [
      'Be kind and respectful. Disagree with ideas, not people.',
      'Keep it relevant to frontend, careers and learning.',
      'Credit other people’s work, code and images.',
    ],
    note: 'New members’ first 2 posts are checked by a moderator before everyone sees them.',
    gotIt: 'Got it',
    readAll: 'Read full guidelines',
  },
  welcomeToast: 'You’re in! Say hi to 1,239 frontend devs',
  welcomeBonus: '+10 {xp}',
  card: {
    about: 'About this community',
    members: 'Members',
    activity: 'Activity',
    visibility: 'Visibility',
    moderatedBy: 'Moderated by',
    related: 'Related communities',
  },
  empty: {
    title: 'No posts yet. Be the first!',
    body: 'The first post sets the tone. Founding members who post this week get a Founding Voice badge.',
    ideas: [
      { id: 'question', label: 'Ask a question', icon: 'help' },
      { id: 'building', label: 'Share what you’re building', icon: 'star' },
      { id: 'intro', label: 'Introduce yourself', icon: 'users' },
    ],
    cta: 'Write the first post',
    art: emptyFeedSpot,
  },
  about: {
    forTitle: 'What this community is for',
    rulesTitle: 'House rules',
    moderatorsTitle: 'Moderators',
    moderator: 'Moderator',
  },
  members: {
    search: 'Search 1,240 members',
    filters: ['All', 'Moderators', 'Near you', 'Open to work', 'Mentors'],
    follow: 'Follow',
    following: 'Following',
    more: 'Show more members',
  },
};

/* Per-frame vertical rhythm of the side cards (Figma draws 24 / 20 / 14 for the same card on different frames). */
export const COMMUNITY_PAGE_RHYTHM = {
  default: { infoGap: 24, trendGap: 14, tagGap: 16, relatedGap: 24 },
  preview: { infoGap: 20, trendGap: 20, tagGap: 8, relatedGap: 20 },
  welcome: { infoGap: 14, trendGap: 14, tagGap: 20, relatedGap: 20 },
};

const CONTRIBUTORS = [
  { name: 'Michael Asante', active: 'Active 30 mins ago', online: true, avatar: avatarMichael },
  { name: 'Abigail Mensah', active: 'Active 2 days ago', online: false, avatar: avatarAbigail },
  { name: 'Ransford Kudjoe', active: 'Active Monday', online: false, avatar: avatarRansford },
  { name: 'Akosua Quansah', active: 'Active now', online: true, avatar: avatarAkosua },
];

const RELATED = [
  {
    id: 'software-engineering-ghana',
    name: 'Software Engineering Ghana',
    members: '2,400 members',
    thumb: thumbSoftwareEngineering,
  },
  {
    id: 'hackathons-ghana',
    name: 'Hackathons Ghana',
    members: '380 members',
    thumb: thumbHackathons,
  },
  {
    id: 'data-science-ghana',
    name: 'Data Science Ghana',
    members: '890 members',
    thumb: thumbHackathons,
  },
];

/* Collage photos: Focused = straight 130x150 at (x,y); Playful = tilted (deg) around the same photo, top-left (px,py). */
const FRONTEND_COLLAGE = [
  { src: collageFrontend1, x: 0, y: 20, px: -7.5, py: 26.4, tilt: 6 },
  { src: collageFrontend2, x: 110, y: 0, px: 115, py: -5.6, tilt: -4 },
  { src: collageFrontend3, x: 200, y: 40, px: 197, py: 43.5, tilt: 3 },
];
const AGRITECH_COLLAGE = [
  { src: collageAgritech1, x: 0, y: 20, px: -7.5, py: 26.4, tilt: 6 },
  { src: collageAgritech2, x: 110, y: 0, px: 115, py: -5.6, tilt: -4 },
  { src: collageAgritech3, x: 200, y: 40, px: 197, py: 43.5, tilt: 3 },
];

const FRONTEND_POSTS = [
  {
    id: 'samuel-hydration-bug',
    author: { name: 'Samuel Boateng', avatar: avatarSamuel },
    kind: 'Achievement',
    time: '2 hours ago',
    body: 'Finally fixed that hydration bug that’s been haunting me for two days. Turns out a Date.now() call was rendering differently on server vs client. Lesson learned. #ReactGh #WhyIsMyDivBroken #NextJS',
    images: [postImageA, postImageB, postImageC],
    moreCount: 1,
    likes: 124,
    comments: 18,
  },
  {
    id: 'yaa-first-pr',
    author: { name: 'Yaa Asantewaa', avatar: avatarYaa },
    kind: 'Achievement',
    time: '5 hours ago',
    body: 'Just merged my first PR into a production codebase at work today. Small change, huge feeling. Thank you to everyone here who reviewed my code over the past few months, you made this possible. #FirstPRMerged #FrontendJobsGh #ShipItFriday',
    likes: 86,
    comments: 12,
  },
];

const FRONTEND_MEMBERS = [
  {
    id: 'michael-asante',
    name: 'Michael Asante',
    avatar: avatarMichael,
    badge: { kind: 'moderator', label: 'Moderator' },
    role: 'Frontend Lead · Hubtel · Accra',
    city: 'Accra',
    skills: ['React', 'TypeScript'],
    following: false,
  },
  {
    id: 'yaa-asantewaa',
    name: 'Yaa Asantewaa',
    avatar: avatarYaa,
    badge: null,
    role: 'Junior Frontend Dev · Accra',
    city: 'Accra',
    skills: ['React', 'CSS'],
    following: true,
  },
  {
    id: 'samuel-boateng',
    name: 'Samuel Boateng',
    avatar: avatarSamuel,
    badge: { kind: 'open', label: 'Open to work' },
    role: 'Student · KNUST · Kumasi',
    city: 'Kumasi',
    skills: ['Next.js', 'Node'],
    following: false,
  },
  {
    id: 'abigail-mensah',
    name: 'Abigail Mensah',
    avatar: avatarAbigail,
    badge: { kind: 'mentor', label: 'Mentor' },
    role: 'UI Engineer · Accra',
    city: 'Accra',
    skills: ['Figma', 'Vue'],
    following: false,
  },
  {
    id: 'ransford-kudjoe',
    name: 'Ransford Kudjoe',
    avatar: avatarRansford,
    badge: { kind: 'open', label: 'Open to work' },
    role: 'Bootcamp grad · Tema',
    city: 'Tema',
    skills: ['JavaScript', 'Tailwind'],
    following: false,
  },
  {
    id: 'akosua-quansah',
    name: 'Akosua Quansah',
    avatar: avatarAkosua,
    badge: { kind: 'moderator', label: 'Moderator' },
    role: 'Senior Engineer · mPharma',
    city: 'Accra',
    skills: ['React Native', 'Testing'],
    following: false,
  },
];

const FRONTEND_ABOUT = {
  text: 'A home for frontend developers in Ghana, from first “Hello World” to senior engineers. Share what you’re building, ask for code reviews, find study buddies and hear about frontend roles first.',
  audience: ['Students', 'Bootcamp grads', 'Junior devs', 'Career switchers', 'Senior mentors'],
  rules: [
    {
      title: 'Be kind and respectful',
      text: 'Disagree with ideas, not people. No harassment or hate.',
    },
    {
      title: 'Keep it relevant',
      text: 'Frontend, careers and learning. Off-topic posts are removed.',
    },
    { title: 'Credit others', text: 'Link the original when you share someone’s work or code.' },
    { title: 'No paid job ads', text: 'Real employers post on Job Postings. Never pay to apply.' },
  ],
  moderators: [
    { name: 'Michael Asante', role: 'Frontend Lead · Hubtel', avatar: avatarMichael },
    { name: 'Akosua Quansah', role: 'Senior Engineer · mPharma', avatar: avatarAkosua },
    { name: 'GTH Community Team', role: 'Ghana Talent Hub', avatar: thumbSoftwareEngineering },
  ],
  facts: [
    { id: 'created', icon: 'calendar', label: 'Created', value: 'March 2025' },
    { id: 'language', icon: 'globe', label: 'Language', value: 'English · Twi welcome' },
    { id: 'joined', icon: 'users', label: 'Joined this week', value: '+86 members' },
  ],
};

export const COMMUNITY_DETAILS = {
  'frontend-devs-ghana': {
    id: 'frontend-devs-ghana',
    name: '#Frontend Devs Ghana',
    sticker: 'Software · Public',
    members: 1240,
    membersLabel: '1,240 members',
    activity: 'Active daily',
    events: '2 events this month',
    eventsCount: '2',
    description:
      'Swap tips on React, CSS tricks and shipping faster. Get feedback on your builds and learn from other frontend developers solving the same problems.',
    faces: 'You + 1,239 others',
    previewFaces: 'Michael, Abigail + 3 people you know',
    collage: FRONTEND_COLLAGE,
    info: {
      members: '1,240',
      activity: 'Active daily',
      visibility: 'Public',
      moderatedBy: 'GTH + 3 members',
    },
    contributorsTitle: 'Top contributors',
    contributors: CONTRIBUTORS,
    topicsTitle: 'Trending this week',
    topics: [
      '#ReactGh',
      '#FrontendJobsGh',
      '#NextJS',
      '#PortfolioWeekend',
      '#ShipItFriday',
      '#TypeScriptWins',
      '#CSSIsHard',
      '#InterviewPrepGh',
    ],
    related: RELATED,
    posts: FRONTEND_POSTS,
    about: FRONTEND_ABOUT,
    people: FRONTEND_MEMBERS,
  },
  'agritech-innovators-ghana': {
    id: 'agritech-innovators-ghana',
    name: '#Agritech Innovators Ghana',
    sticker: 'Founding member',
    members: 24,
    membersLabel: '24 members',
    activity: 'New this week',
    events: '2 events this month',
    eventsCount: '2',
    description:
      'For students and builders working on tech for Ghanaian farms: drones, market prices, cold chain and more.',
    faces: 'You + 1,239 others',
    previewFaces: 'Michael, Abigail + 3 people you know',
    collage: AGRITECH_COLLAGE,
    info: {
      members: '24',
      activity: 'Active daily',
      visibility: 'Public',
      moderatedBy: 'GTH + 3 members',
    },
    contributorsTitle: 'Founding members',
    contributors: CONTRIBUTORS,
    topicsTitle: 'Suggested topics',
    topics: ['#AgriTechGh', '#DronesForFarms', '#ColdChain'],
    related: RELATED,
    posts: [],
    about: FRONTEND_ABOUT,
    people: FRONTEND_MEMBERS,
  },
};

/* The drawn page answers to the planned URL id too (see the assumptions above). */
export const COMMUNITY_DETAIL_ALIASES = { 'software-engineering-ghana': 'frontend-devs-ghana' };

/* Catalogue entry -> detail for communities that are not drawn (⚠️ ASSUMPTION: Frontend content, empty feed). */
export const buildFallbackDetail = (entry) => ({
  ...COMMUNITY_DETAILS['frontend-devs-ghana'],
  id: entry.id,
  name: `#${entry.name}`,
  members: entry.members,
  membersLabel: `${entry.members.toLocaleString('en-US')} members`,
  activity: entry.activity,
  description: entry.description,
  info: {
    ...COMMUNITY_DETAILS['frontend-devs-ghana'].info,
    members: entry.members.toLocaleString('en-US'),
    activity: entry.activity,
  },
  posts: [],
});
/* ---- /page ---- */
