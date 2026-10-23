/*
 * My circle (networking) — mock data shaped like the future API. Figma canvas "Talent - community Engagement" 5456:19207,
 * Playful section 9187:27436 / Focused section 9187:30373 ("My circle (networking) · 22 Oct 2026", NW-01 … NW-11) and the
 * flow section 9210:36124 ("HOW TALENTS GET TO MY CIRCLE"). Every string below is copied verbatim from Figma (texts.py).
 *
 * Blocks (swap each for its endpoint later, keep the shapes):
 *   PEOPLE                 GET /circle/people/:id            one person card / profile header
 *   CIRCLE_SUMMARY         GET /circle/summary               128 in your circle · 46 following · 31 profile views · 3 invitations
 *   DISCOVER_RESPONSE      GET /circle/discover              invitation preview + "People to link up with"
 *   INVITATIONS_RESPONSE   GET /circle/invitations           received (3) + sent (2)
 *   CONNECTIONS_RESPONSE   GET /circle/connections           first page of the 128
 *   PROFILE_RESPONSE       GET /circle/people/:id/profile    skills + endorsements, in common, recommendations
 *   FEED_RESPONSE          GET /circle/feed                  "From your circle"
 *   MINOR_RESPONSE         GET /circle/discover (age < 18)   NW-10: classmates + verified mentors only, parent card
 *   EMPTY_RESPONSE         GET /circle/discover (no links)   NW-11 "Start your circle"
 *
 * Relationship status per person: 'none' | 'pending-sent' | 'invited' | 'connected'. The blocks carry the status the API would
 * return in that context; the session store (circleStore.js) overrides it after the talent acts.
 * ⚠️ ASSUMPTION: Figma draws Yaw Darko as a "Link up" suggestion (NW-01) AND as a 1st-degree connection (NW-05 / NW-06) — each
 * block keeps its own status, so both frames render as drawn.
 */

/* ---- BLOCK: PEOPLE ------------------------------------------------------------------------------------------------ */
export const CIRCLE_PEOPLE = {
  'abena-owusu': {
    id: 'abena-owusu',
    name: 'Abena Owusu',
    firstName: 'Abena',
    headline: 'Data analyst intern · mPharma',
    level: 7,
    town: 'Kumasi',
    mutual: 12,
    shares: [
      { kind: 'community', label: 'Data Science Ghana' },
      { kind: 'skill', label: 'Python' },
      { kind: 'region', label: 'Ashanti' },
    ],
    buddy: 'You both build dashboards with Python.',
  },
  'yaw-darko': {
    id: 'yaw-darko',
    name: 'Yaw Darko',
    firstName: 'Yaw',
    headline: 'UX design student · Ashesi',
    level: 5,
    town: 'Berekuso',
    mutual: 8,
    shares: [
      { kind: 'interest', label: 'Product design' },
      { kind: 'community', label: 'Accra Designers' },
    ],
    buddy: 'He loves user research. You asked about it last week.',
  },
  'efua-asante': {
    id: 'efua-asante',
    name: 'Efua Asante',
    firstName: 'Efua',
    headline: 'Junior developer · Hubtel',
    level: 6,
    town: 'Cape Coast',
    mutual: 5,
    shares: [
      { kind: 'school', label: 'UCC' },
      { kind: 'skill', label: 'JavaScript' },
    ],
    buddy: 'Same campus, now a developer at Hubtel.',
  },
  'kwame-boateng': {
    id: 'kwame-boateng',
    name: 'Kwame Boateng',
    firstName: 'Kwame',
    headline: 'Senior product manager · Hubtel',
    level: 8,
    verifiedMentor: true,
    town: 'Accra',
    mutual: 21,
    shares: [
      { kind: 'community', label: 'Data Science Ghana' },
      { kind: 'interest', label: 'Product' },
    ],
    buddy: 'Mentors juniors moving into product.',
  },
  'akosua-mensah': {
    id: 'akosua-mensah',
    name: 'Akosua Mensah',
    firstName: 'Akosua',
    headline: 'Marketing graduate',
    level: 3,
    town: 'Takoradi',
    mutual: 3,
    shares: [
      { kind: 'region', label: 'Western Region' },
      { kind: 'interest', label: 'Marketing' },
    ],
    buddy: 'Lives near you and runs a marketing club.',
  },
  'kojo-annan': {
    id: 'kojo-annan',
    name: 'Kojo Annan',
    firstName: 'Kojo',
    headline: 'Founder · Agritech start-up',
    level: 4,
    town: 'Tamale',
    mutual: 6,
    shares: [
      { kind: 'community', label: 'Agritech Innovators' },
      { kind: 'interest', label: 'Start-ups' },
    ],
    buddy: 'Building an agritech start-up in Tamale.',
  },
  'esi-quaye': {
    id: 'esi-quaye',
    name: 'Esi Quaye',
    firstName: 'Esi',
    headline: 'Graphic designer · freelance',
    degree: '2nd',
    town: 'Accra',
    mutual: 4,
  },
  'nana-yaw-mensah': {
    id: 'nana-yaw-mensah',
    name: 'Nana Yaw Mensah',
    firstName: 'Nana Yaw',
    headline: 'Software engineering student · KNUST',
    degree: '2nd',
    town: 'Kumasi',
    mutual: 9,
  },
  'adwoa-sarpong': {
    id: 'adwoa-sarpong',
    name: 'Adwoa Sarpong',
    firstName: 'Adwoa',
    headline: 'Data lead · MTN Ghana',
    degree: '2nd',
    verifiedMentor: true,
    level: 8,
    town: 'Accra',
    mutual: 15,
    shares: [
      { kind: 'community', label: 'Young Coders GH' },
      { kind: 'skill', label: 'Data' },
    ],
    buddy: 'Teaches data basics in Young Coders GH.',
  },
  'kwesi-ofori': {
    id: 'kwesi-ofori',
    name: 'Kwesi Ofori',
    firstName: 'Kwesi',
    headline: 'Student · Achimota School',
    level: 2,
    town: 'Accra',
    mutual: 7,
    shares: [
      { kind: 'school', label: 'Achimota' },
      { kind: 'community', label: 'Young Coders GH' },
    ],
    buddy: 'In your class at Achimota.',
  },
  'afia-boakye': {
    id: 'afia-boakye',
    name: 'Afia Boakye',
    firstName: 'Afia',
    headline: 'Student · Wesley Girls',
    level: 3,
    town: 'Cape Coast',
    mutual: 3,
    shares: [{ kind: 'community', label: 'Young Coders GH' }],
    buddy: 'Codes in the same club as you.',
  },
  'selorm-agbeko': {
    id: 'selorm-agbeko',
    name: 'Selorm Agbeko',
    firstName: 'Selorm',
    headline: 'Student · Achimota School',
    level: 2,
    town: 'Accra',
    mutual: 5,
    shares: [
      { kind: 'school', label: 'Achimota' },
      { kind: 'skill', label: 'Scratch' },
    ],
    buddy: 'In your class at Achimota.',
  },
};
/* ---- END BLOCK: PEOPLE --------------------------------------------------------------------------------------------- */

/* ---- BLOCK: CIRCLE_SUMMARY ----------------------------------------------------------------------------------------- */
export const CIRCLE_SUMMARY = {
  me: { id: 'kofi-agyekum', name: 'Kofi Agyekum', age: 19 },
  inCircle: 128,
  following: 46,
  profileViewsThisWeek: 31,
  pendingInvitations: 3,
  tip: 'Talents with 50+ people in their circle get 3× more recruiter views. Add a note when you connect.',
};
/* ---- END BLOCK: CIRCLE_SUMMARY ------------------------------------------------------------------------------------- */

/* ---- BLOCK: DISCOVER_RESPONSE -------------------------------------------------------------------------------------- */
export const DISCOVER_RESPONSE = {
  invitationsPreview: { ids: ['esi-quaye', 'nana-yaw-mensah'], total: 3 },
  suggestions: {
    title: 'People to link up with',
    note: 'Based on your communities, school and skills',
    topPickId: 'abena-owusu',
    // cta: 'link-up' = Link up + add-note button, 'learn-from' = follow a verified mentor ("Learn from")
    items: [
      { id: 'abena-owusu', cta: 'link-up', status: 'none' },
      { id: 'yaw-darko', cta: 'link-up', status: 'none' },
      { id: 'efua-asante', cta: 'link-up', status: 'none' },
      { id: 'kwame-boateng', cta: 'learn-from', status: 'none' },
      { id: 'akosua-mensah', cta: 'link-up', status: 'none' },
      { id: 'kojo-annan', cta: 'link-up', status: 'none' },
    ],
  },
};
/* ---- END BLOCK: DISCOVER_RESPONSE ---------------------------------------------------------------------------------- */

/* ---- BLOCK: INVITATIONS_RESPONSE ----------------------------------------------------------------------------------- */
export const INVITATIONS_RESPONSE = {
  received: [
    {
      id: 'esi-quaye',
      ago: '2 days ago',
      note: '“Hi Kofi, I loved your dashboard post in Data Science Ghana. Would be great to connect and swap tips.”',
    },
    { id: 'nana-yaw-mensah', ago: '4 days ago', note: null },
    {
      id: 'adwoa-sarpong',
      ago: '1 week ago',
      note: '“Saw you are learning SQL. Happy to share resources.”',
    },
  ],
  // ⚠️ ASSUMPTION: Figma draws the "Sent · 2" chip but not its list. Two outgoing requests, same row shape as received.
  sent: [
    { id: 'kwesi-ofori', ago: 'sent 3 days ago' },
    { id: 'afia-boakye', ago: 'sent 1 week ago' },
  ],
  footnote: 'Requests you ignore aren’t shown to the sender. They expire after 3 months.',
};
/* ---- END BLOCK: INVITATIONS_RESPONSE ------------------------------------------------------------------------------- */

/* ---- BLOCK: CONNECTIONS_RESPONSE ----------------------------------------------------------------------------------- */
export const CONNECTIONS_RESPONSE = {
  total: 128,
  items: [
    { id: 'yaw-darko', connected: 'Connected 2 days ago', region: 'Eastern Region' },
    { id: 'esi-quaye', connected: 'Connected 5 days ago', region: 'Greater Accra' },
    { id: 'efua-asante', connected: 'Connected 2 weeks ago', region: 'Central Region' },
    { id: 'akosua-mensah', connected: 'Connected 3 weeks ago', region: 'Western Region' },
    { id: 'kojo-annan', connected: 'Connected 1 month ago', region: 'Northern Region' },
  ],
  sorts: ['Recently added', 'Region', 'Skills', 'Community'],
  menu: ['View profile', 'Mute their posts', 'Remove connection', 'Report'],
};
/* ---- END BLOCK: CONNECTIONS_RESPONSE ------------------------------------------------------------------------------- */

/* ---- BLOCK: PROFILE_RESPONSE --------------------------------------------------------------------------------------- */
export const PROFILE_RESPONSE = {
  'yaw-darko': {
    id: 'yaw-darko',
    tagline: 'UX design student at Ashesi · Product design, user research',
    location: 'Berekuso, Eastern Region',
    mutualLine: '8 in your circle know them · Abena, Efua and 6 others',
    circleSize: '214 in his circle',
    openTo: 'OPEN TO INTERNSHIPS',
    skills: [
      {
        id: 'figma',
        label: 'Figma',
        verified: 'Verified · Skills Lab',
        count: 12,
        line: '12 endorsements · including Kwame Boateng (mentor)',
      },
      { id: 'user-research', label: 'User research', count: 5, line: '5 endorsements' },
      { id: 'prototyping', label: 'Prototyping', count: 8, line: '8 endorsements' },
      { id: 'design-thinking', label: 'Design thinking', count: 3, line: '3 endorsements' },
    ],
    endorsePrompt: 'Endorse skills you have seen Yaw use',
    lockedNote: 'Link up with Yaw to endorse his skills',
    inCommon: [
      { kind: 'community', label: 'Data Science Ghana', note: 'Both members' },
      { kind: 'school', label: 'Design track', note: 'Skills Lab' },
      { kind: 'interest', label: 'Product design', note: 'Shared interest' },
    ],
    recommendations: [
      {
        id: 'kwame-boateng',
        author: 'kwame-boateng',
        meta: 'Mentored Yaw in Data Science Ghana · Sep 2026',
        text: '“Yaw asks the right questions before he designs. In our community hackathon he interviewed 12 traders at Makola before drawing a single screen.”',
      },
    ],
    // Dialog copy (NW-07 / NW-08)
    endorseDialog: {
      title: 'Endorse Yaw’s skills',
      subtitle: 'Only endorse skills you have seen him use.',
      howLabel: 'How do you know his skills?',
      ways: ['Same community project', 'Studied together', 'Worked together', 'He mentored me'],
    },
    recommendDialog: {
      title: 'Recommend Yaw',
      subtitle: 'Your words help recruiters trust his profile.',
      howLabel: 'How do you know Yaw?',
      relationships: [
        'We worked on a community project together',
        'We studied together',
        'I mentored him',
        'We are in the same community',
      ],
      whatLabel: 'What should people know about working with him?',
      suggestion:
        'Yaw led the user interviews for our Makola market app. He is patient with people and turns messy notes into clear designs quickly.',
      max: 600,
      approval:
        'Yaw will see it first and choose whether to show it on his profile. You can edit or remove it any time.',
      help: 'Help me make it specific',
    },
  },
};

/*
 * ⚠️ ASSUMPTION: Figma draws one full profile (Yaw Darko). Any other person gets the same layout built from their card:
 * skills = what they share with the talent, endorsement counts start at 0, no recommendations yet.
 */
export const buildGenericProfile = (person) => ({
  id: person.id,
  tagline: `${person.headline}`,
  location: `${person.town}, Ghana`,
  mutualLine: `${person.mutual ?? 0} in your circle know them`,
  circleSize: null,
  openTo: null,
  skills: (person.shares ?? [])
    .filter((s) => s.kind === 'skill' || s.kind === 'interest')
    .map((s) => ({
      id: s.label.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      label: s.label,
      count: 0,
      line: '0 endorsements',
    })),
  endorsePrompt: `Endorse skills you have seen ${person.firstName} use`,
  lockedNote: `Link up with ${person.firstName} to endorse their skills`,
  inCommon: (person.shares ?? []).map((s) => ({ kind: s.kind, label: s.label, note: 'Shared' })),
  recommendations: [],
  endorseDialog: {
    title: `Endorse ${person.firstName}’s skills`,
    subtitle: 'Only endorse skills you have seen them use.',
    howLabel: 'How do you know their skills?',
    ways: PROFILE_RESPONSE['yaw-darko'].endorseDialog.ways,
  },
  recommendDialog: {
    ...PROFILE_RESPONSE['yaw-darko'].recommendDialog,
    title: `Recommend ${person.firstName}`,
    subtitle: 'Your words help recruiters trust their profile.',
    howLabel: `How do you know ${person.firstName}?`,
    whatLabel: 'What should people know about working with them?',
    suggestion: '',
  },
});
/* ---- END BLOCK: PROFILE_RESPONSE ----------------------------------------------------------------------------------- */

/* ---- BLOCK: FEED_RESPONSE ------------------------------------------------------------------------------------------ */
export const FEED_RESPONSE = {
  title: 'From your circle',
  sticker: 'CHEER THEM ON',
  subtitle: 'Wins and updates from people you’re connected to and mentors you follow.',
  items: [
    {
      kind: 'win',
      id: 'abena-verified-python',
      personId: 'abena-owusu',
      degree: '1st',
      meta: 'Data analyst intern · mPharma · 2h',
      title: 'Abena got verified in Python',
      detail: 'Passed the Skills Lab assessment · Top 15% this month',
      badge: 'VERIFIED',
      quick: ['Congrats, Abena!', 'Well deserved', 'What helped you most?'],
      likes: 38,
      liked: true,
      comments: 6,
      cta: 'Congratulate',
    },
    {
      kind: 'update',
      id: 'yaw-ux-internship',
      personId: 'yaw-darko',
      title: 'Yaw Darko started a UX design internship at Hubtel',
      meta: 'Found through GTH Opportunities · Yesterday',
      cta: 'Say congrats',
    },
    {
      kind: 'post',
      id: 'kwame-pm-questions',
      personId: 'kwame-boateng',
      following: true,
      meta: 'Senior product manager · Hubtel · in Data Science Ghana · 1d',
      text: 'Three questions I ask every junior PM candidate. Save this before your next interview: 1) What problem did you choose not to solve? 2) How did you know it worked? 3) What would you do differently?',
      likes: 214,
      comments: 41,
    },
  ],
  sideSuggestions: {
    title: 'People to link up with',
    seeAll: 'See all',
    items: [
      { id: 'efua-asante', note: 'Studied at UCC like you', cta: 'link-up' },
      { id: 'kwame-boateng', note: 'Mentors in Data Science Ghana', cta: 'follow' },
      { id: 'akosua-mensah', note: 'Near you', cta: 'link-up' },
    ],
  },
};
/* ---- END BLOCK: FEED_RESPONSE -------------------------------------------------------------------------------------- */

/* ---- BLOCK: MINOR_RESPONSE ----------------------------------------------------------------------------------------- */
export const MINOR_RESPONSE = {
  me: { name: 'Ama', age: 15, parent: 'Mrs. Abena Owusu' },
  banner: {
    title: 'Your circle is for classmates and verified mentors',
    body: 'Adults can’t send you requests. Your parent can see who you’re connected with. Messages with mentors stay in GTH.',
    learnMore: 'Learn more',
  },
  classmates: {
    title: 'Classmates you may know',
    note: 'From Achimota School and your communities',
    topPickId: 'kwesi-ofori',
    items: [
      { id: 'kwesi-ofori', cta: 'link-up' },
      { id: 'afia-boakye', cta: 'link-up' },
      { id: 'selorm-agbeko', cta: 'link-up' },
    ],
  },
  mentors: {
    title: 'Verified mentors to follow',
    note: 'Checked by GTH: Ghana Card, safeguarding course and references',
    topPickId: 'kwame-boateng',
    items: [
      { id: 'kwame-boateng', cta: 'learn-from' },
      { id: 'adwoa-sarpong', cta: 'learn-from' },
    ],
  },
  parentCard: {
    title: 'Shared with your parent',
    body: 'Mrs. Abena Owusu can see your connections and who you follow. She can’t read your messages.',
  },
};
/* ---- END BLOCK: MINOR_RESPONSE ------------------------------------------------------------------------------------- */

/* ---- BLOCK: EMPTY_RESPONSE ----------------------------------------------------------------------------------------- */
export const EMPTY_RESPONSE = {
  title: 'Start your circle',
  sticker: 'DAY 1 OF YOUR NETWORK',
  body: 'Connect with classmates, teammates and mentors. People in your network see your wins and can vouch for your skills.',
  ways: [
    {
      id: 'classmates',
      icon: 'mortarboard',
      title: 'Find classmates',
      body: 'Add your school to see people from it',
    },
    {
      id: 'community',
      icon: 'users',
      title: 'Join a community',
      body: 'Meet people who share your interests',
    },
    {
      id: 'friend',
      icon: 'link',
      title: 'Invite a friend',
      body: 'Share your GTH link on WhatsApp',
    },
  ],
  suggestions: {
    title: 'People to link up with',
    note: 'A few people to start with',
    topPickId: 'abena-owusu',
    items: [
      { id: 'abena-owusu', cta: 'link-up', status: 'none' },
      { id: 'yaw-darko', cta: 'link-up', status: 'none' },
      { id: 'efua-asante', cta: 'link-up', status: 'none' },
      { id: 'kwame-boateng', cta: 'learn-from', status: 'none' },
    ],
  },
};
/* ---- END BLOCK: EMPTY_RESPONSE ------------------------------------------------------------------------------------- */

/* ---- BLOCK: COPY (screen chrome) ----------------------------------------------------------------------------------- */
export const CIRCLE_COPY = {
  switchCommunities: 'Communities',
  switchCircle: 'My circle',
  createCommunity: 'Create a community',
  title: 'Your circle',
  subtitle: 'Your people: classmates, teammates and mentors who help you grow.',
  growSticker: 'GROW YOUR CIRCLE',
  searchPlaceholder: 'Search people by name, skill or school',
  tabs: {
    discover: 'Discover',
    invitations: 'Invitations',
    circle: 'Circle',
    following: 'Following',
  },
  invitationsTitle: 'Invitations',
  seeAll: 'See all',
  yourCircle: 'Your circle',
  stats: ['In your circle', 'Following', 'Profile views this week'],
  tipTitle: 'Tip from Buddy',
  youShare: 'YOU SHARE',
  topPick: 'TOP PICK',
  linkUp: 'Link up',
  linkUpSent: 'Link-up sent',
  learnFrom: 'Learn from',
  ignore: 'Ignore',
  accept: 'Accept',
  sayHi: 'Say hi',
  inYourCircle: 'In your circle',
  message: 'Message',
  manage: 'Manage',
  verifiedMentor: 'Verified mentor',
  notes: {
    title: (first) => `Why link up with ${first}?`, // Figma 2026-10-23 redraw of NW-02 / flow step 4 (was "Say why you want to link up with {first}")
    help: 'Help me write it',
    without: 'Send without a note',
    send: 'Send link-up',
    sticker: 'NOTES GET 2× MORE YESES',
    max: 300,
    suggestion: (p) =>
      p.id === 'abena-owusu'
        ? 'Hi Abena, we’re both in Data Science Ghana. I’m learning SQL and would love to hear how you got your mPharma internship.'
        : `Hi ${p.firstName}, we have a few things in common. I would love to link up and learn from you.`,
  },
  toast: {
    sent: (first) => `Link-up sent to ${first}`,
    undo: 'Undo',
    inCircle: (first) => `${first} is now in your circle`,
    messageAction: 'Message',
  },
  xp: '+5 XP · NEW CONNECTION',
  follow: 'Follow',
  following: 'Following',
  endorse: 'Endorse',
  cancel: 'Cancel',
  writeRecommendation: 'Write a recommendation',
  recommendations: 'Recommendations',
  skills: 'Skills',
  inCommonTitle: 'You have in common',
  xpBoth: '+10 XP FOR BOTH OF YOU',
};
/* ---- END BLOCK: COPY ----------------------------------------------------------------------------------------------- */
