/*
 * communityData.js — mock data layer for Talent Community Engagement.
 *
 * Source: Figma file `Bin8roWL8sloyc36IgFMuT`, frames
 *   7025:85167 / 7025:85477 / 7025:85782  → Community index ("Recruiter Home")
 *   7025:86093 / 7025:86728 / 7025:87352 / 7025:87985 → Community detail
 *   7025:88607 (Create Post) · 7025:89274 (Share milestone) · 7025:89962 (Report)
 *
 * No backend exists for posts/feeds anywhere in this app, so — exactly like
 * Certs / Work / Portfolio / Goals / Pitch — this module is a plain local
 * dataset the pages seed component state from. There is no fake API call.
 *
 * EVERY string below is the literal `characters` value returned by Figma's
 * `get_design_context`. Trailing spaces and Figma's own typos are reproduced
 * verbatim and flagged inline — do not "fix" them here.
 */

import coverSoftwareEngineeringGhana from '../../../assets/community/cover-software-engineering-ghana.png';
import coverYoungEntrepreneursNetwork from '../../../assets/community/cover-young-entrepreneurs-network.png';
import coverCreativesDesignersHub from '../../../assets/community/cover-creatives-designers-hub.png';
import coverStemGirlsGhana from '../../../assets/community/cover-stem-girls-ghana.png';
import coverTradesVocationalSkills from '../../../assets/community/cover-trades-vocational-skills.png';
import coverFirstGenScholars from '../../../assets/community/cover-first-gen-scholars.png';
import coverFrontendDevsGhana from '../../../assets/community/cover-frontend-devs-ghana.png';
import coverHackathonsGhana from '../../../assets/community/cover-hackathons-ghana.png';
import coverDataScienceGhana from '../../../assets/community/cover-data-science-ghana.png';
import coverYoungFoundersHub from '../../../assets/community/cover-young-founders-hub.png';

import heroStack2 from '../../../assets/community/hero-stack-2.png';
import heroStack3 from '../../../assets/community/hero-stack-3.png';
import heroStack4 from '../../../assets/community/hero-stack-4.png';

import avatarMichaelAsante from '../../../assets/community/avatar-michael-asante.png';
import avatarAbigailMensah from '../../../assets/community/avatar-abigail-mensah.png';
import avatarRansfordKudjoe from '../../../assets/community/avatar-ransford-kudjoe.png';
import avatarAkosuaQuansah from '../../../assets/community/avatar-akosua-quansah.png';
import avatarKingsleySmith from '../../../assets/community/avatar-kingsley-smith.png';
import avatarRoselynAwinnor from '../../../assets/community/avatar-roselyn-awinnor.png';

import avatarSamuelBoateng from '../../../assets/community/avatar-samuel-boateng.png';
import avatarYaaAsantewaa from '../../../assets/community/avatar-yaa-asantewaa.png';
import avatarAkosuaMansa from '../../../assets/community/avatar-akosua-mansa.png';
import avatarKingD from '../../../assets/community/avatar-king-d.png';

import post1Photo1 from '../../../assets/community/post-1-photo-1.png';
import post1Photo2 from '../../../assets/community/post-1-photo-2.png';
import post1Photo3 from '../../../assets/community/post-1-photo-3.png';
import post1Photo4 from '../../../assets/community/post-1-photo-4.png';
import post2Photo1 from '../../../assets/community/post-2-photo-1.png';

import tileDataSciencePlaceholder from '../../../assets/community/tile-data-science-placeholder.svg';

/* ------------------------------------------------------------------ *
 * Category filter chips — index page. `✅ VERIFIED` (7025:85211)
 * The first chip is "All"; the rest are the eight category labels.
 * NB: Figma writes "Software engineering" (lowercase 'e') on the chip but
 * "Software Engineering" (title case) in the results line — reproduced as-is.
 * ------------------------------------------------------------------ */
export const COMMUNITY_CATEGORIES = [
  'All',
  'Software engineering',
  'Design',
  'Data Science',
  'Entrepreneurship',
  'Business',
  'STEM',
  'Cybersecurity',
  'Hackathons',
];

/* ------------------------------------------------------------------ *
 * Communities. `✅ VERIFIED` names / member counts / descriptions / join
 * state, all from 7025:85245 (the 10-card grid).
 *
 * `categories`:
 *   - "Software engineering" membership is `✅ VERIFIED` — frame 7025:85477
 *     renders exactly these four cards under "Showing 4 communities in
 *     Software Engineering": 7025:85246, :85249, :85252, :85253.
 *   - Every other category assignment is `⚠️ ASSUMPTION` — Figma never shows
 *     another filtered state, so these are inferred from the community name.
 *     "Cybersecurity" has no community in any Figma frame and is left empty
 *     on purpose rather than inventing one.
 * ------------------------------------------------------------------ */
export const COMMUNITIES = [
  {
    id: 'software-engineering-ghana',
    figmaNode: '7025:85246',
    name: 'Software Engineering Ghana',
    memberLabel: '2,400 members ', // trailing space is Figma's
    description: 'Learn, build, and get code-reviewed by peers across Ghana.',
    cover: coverSoftwareEngineeringGhana,
    joined: true,
    categories: ['Software engineering'],
  },
  {
    id: 'young-entrepreneurs-network',
    figmaNode: '7025:85247',
    name: 'Young Entrepreneurs Network',
    memberLabel: '890 members ',
    description: 'Pitch ideas, find co-founders, and swap startup lessons.',
    cover: coverYoungEntrepreneursNetwork,
    joined: false,
    categories: ['Entrepreneurship', 'Business'],
  },
  {
    id: 'creatives-designers-hub',
    figmaNode: '7025:85248',
    name: 'Creatives & Designers Hub',
    memberLabel: '1200 members ',
    description: 'Portfolio feedback, briefs, and creative collabs.',
    cover: coverCreativesDesignersHub,
    joined: false,
    categories: ['Design'],
  },
  {
    id: 'stem-girls-ghana',
    figmaNode: '7025:85249',
    name: 'STEM Girls Ghana',
    memberLabel: '650 members ',
    description: 'A space for girls in STEM to mentor and be mentored.',
    cover: coverStemGirlsGhana,
    joined: false,
    categories: ['Software engineering', 'STEM'],
  },
  {
    id: 'trades-vocational-skills',
    figmaNode: '7025:85250',
    // Figma's own trailing space inside the name — reproduced verbatim.
    name: 'Trades & Vocational Skills ',
    memberLabel: '430 members',
    description: 'Apprenticeships, certifications, and hands-on skill sharing.',
    cover: coverTradesVocationalSkills,
    joined: false,
    categories: ['Business'],
  },
  {
    id: 'first-gen-scholars',
    figmaNode: '7025:85251',
    name: 'First-Gen Scholars',
    memberLabel: '780 members',
    description: 'Navigating university as the first in your family.',
    cover: coverFirstGenScholars,
    joined: false,
    categories: ['STEM'],
  },
  {
    id: 'frontend-devs-ghana',
    figmaNode: '7025:85252',
    name: 'Frontend Devs Ghana',
    memberLabel: '1,240 members',
    description: 'Swap tips on React, CSS tricks, and shipping faster.',
    cover: coverFrontendDevsGhana,
    joined: false,
    categories: ['Software engineering'],
  },
  {
    id: 'hackathons-ghana',
    figmaNode: '7025:85253',
    name: 'Hackathons Ghana',
    memberLabel: '380 members ',
    description: 'Team up for hackathons and build events across Ghana.',
    cover: coverHackathonsGhana,
    joined: false,
    categories: ['Software engineering', 'Hackathons'],
  },
  {
    id: 'data-science-ghana',
    figmaNode: '7025:85254',
    name: 'Data Science Ghana',
    memberLabel: '890 members ',
    description: 'Share datasets, discuss models, and grow your analytics skills.',
    cover: coverDataScienceGhana,
    joined: false,
    categories: ['Data Science'],
  },
  {
    id: 'young-founders-hub',
    figmaNode: '7025:85255',
    name: 'Young Founders Hub',
    memberLabel: '512 members ',
    description: 'Trade startup lessons and find your next co-founder.',
    cover: coverYoungFoundersHub,
    joined: false,
    categories: ['Entrepreneurship'],
  },
];

/* ------------------------------------------------------------------ *
 * Community detail — "#Frontend Devs Ghana". `✅ VERIFIED` (7025:86234)
 * ------------------------------------------------------------------ */
export const COMMUNITY_DETAIL = {
  id: 'frontend-devs-ghana',
  breadcrumbLabel: 'Go to Community',
  title: '#Frontend Devs Ghana',
  memberLabel: '1,240 Members',
  description:
    'Swap tips on React, CSS tricks, and shipping faster — get feedback on your builds and learn from other frontend developers solving the same problems',
  // Fanned photo stack, bottom-of-stack first (Figma 7025:86253 group).
  // NB: the frontmost card reuses the community's own cover image.
  photoStack: [coverFrontendDevsGhana, heroStack2, heroStack3, heroStack4],
  info: [
    { label: 'Members', value: '1240' },
    { label: 'Activity', value: 'Active daily' },
  ],
};

/** Guidelines toast — `✅ VERIFIED` (7062:54239). */
export const COMMUNITY_GUIDELINES = {
  title: 'Guidelines',
  body: "Be respectful, keep posts relevant, and credit others' work. Posts are reviewed before appearing to all members",
};

/** Feed tabs — `✅ VERIFIED` (7025:86265). */
export const COMMUNITY_TABS = ['Feed', 'About', 'Members'];

/** Post-type filter chips — `✅ VERIFIED` (7025:86283). */
export const POST_FILTERS = ['All', 'Achievements', 'Updates', 'Questions', 'Resources'];

/** Create-Post type chips — `✅ VERIFIED` (7025:89215). Singular, unlike the feed filters. */
export const CREATE_POST_TYPES = ['Updates', 'Achievement', 'Question', 'Resources'];

/* ------------------------------------------------------------------ *
 * Feed posts. `✅ VERIFIED` (7025:86386 collapsed · 7025:86431 expanded)
 *
 * `body` is a run list so the mixed-style text (grey body / black semibold
 * inline code / brand-green hashtags) can be rendered exactly as Figma
 * authored it. `photoLayout` picks the image arrangement:
 *   'triptych' → col | stacked pair | col   (post 1, 7025:86403)
 *   'single'   → one full-width image       (post 2, 7025:86448)
 * ------------------------------------------------------------------ */
export const COMMUNITY_POSTS = [
  {
    id: 'post-samuel-boateng',
    figmaNode: '7025:86386',
    author: 'Samuel Boateng',
    avatar: avatarSamuelBoateng,
    badge: 'Achievement',
    timestamp: '2 hours ago',
    type: 'Achievements',
    body: [
      {
        text: "Finally fixed that hydration bug that's been haunting me for two days. Turns out it was a ",
        tone: 'body',
      },
      { text: 'Date.now()', tone: 'code' },
      { text: ' call rendering differently on server vs client. Lesson learned. ', tone: 'body' },
      { text: '#ReactGh #WhyIsMyDivBroken #NextJS', tone: 'hashtag' },
    ],
    photoLayout: 'triptych',
    photos: [post1Photo1, post1Photo2, post1Photo3, post1Photo4],
    likeLabel: '1.2K',
    commentLabel: '5.2k Comments',
    comments: [],
  },
  {
    id: 'post-yaa-asantewaa',
    figmaNode: '7025:86431',
    author: 'Yaa Asantewaa',
    avatar: avatarYaaAsantewaa,
    badge: 'Achievement',
    timestamp: '2 hours ago',
    type: 'Achievements',
    body: [
      {
        text: 'Just merged my first PR into a production codebase at work today 🙌 Small change, huge feeling. Thank you to everyone in this group who reviewed my code over the past few months — you all made this possible.\n ',
        tone: 'body',
      },
      { text: '#FirstPRMerged #FrontendJobsGh #ShipItFriday', tone: 'hashtag' },
    ],
    photoLayout: 'single',
    photos: [post2Photo1],
    likeLabel: '1.2K',
    commentLabel: '5.2k Comments',
    // Figma renders this post with its comment thread already expanded.
    commentsOpenByDefault: true,
    comments: [
      {
        id: 'comment-akosua-mansa',
        author: 'Akosua Mansa',
        avatar: avatarAkosuaMansa,
        timestamp: '11 hours ago',
        body: 'Well done Yaa ', // trailing space is Figma's
        likeCount: 20,
        replyCountLabel: '4 replies',
        replies: [],
      },
      {
        id: 'comment-king-d',
        author: 'King D',
        avatar: avatarKingD,
        timestamp: '11 hours ago',
        body: 'Congrats sis ', // trailing space is Figma's
        likeCount: 3,
        replyCountLabel: null,
        // Figma shows this comment with its inline reply composer already open.
        replyComposerOpenByDefault: true,
        replies: [],
      },
    ],
  },
];

/** Composer placeholders — `✅ VERIFIED`. */
export const COMMENT_PLACEHOLDER = 'Add a comment...';
export const POST_SEARCH_PLACEHOLDER = 'Search anything...';
export const COMMUNITY_SEARCH_PLACEHOLDER = 'Search communities...';

/* Left rail — Top Contributors. `✅ VERIFIED` (7025:86331). */
export const TOP_CONTRIBUTORS = [
  {
    id: 'michael-asante',
    name: 'Michael Asante',
    meta: 'Last Activity, 30 mins',
    avatar: avatarMichaelAsante,
    online: true,
  },
  {
    id: 'abigail-mensah',
    name: 'Abigail Mensah',
    meta: 'Last Activity, 2 days ago',
    avatar: avatarAbigailMensah,
    online: false,
  },
  {
    id: 'ransford-kudjoe',
    name: 'Ransford Kudjoe',
    meta: 'Last Activity, Monday',
    avatar: avatarRansfordKudjoe,
    online: false,
  },
  {
    id: 'akosua-quansah',
    name: 'Akosua Quansah',
    meta: 'Last Activity, Sunday',
    avatar: avatarAkosuaQuansah,
    online: true,
  },
  {
    id: 'kingsley-smith',
    name: 'Kingsley Smith',
    meta: 'Last Activity, 6 days ago',
    avatar: avatarKingsleySmith,
    online: false,
  },
  {
    id: 'roselyn-awinnor',
    name: 'Roselyn Awinnor',
    meta: 'Last Activity, 1 day ago',
    avatar: avatarRoselynAwinnor,
    online: true,
  },
];

/*
 * Right rail — Trending Topics. `✅ VERIFIED` (7025:86546).
 * Figma lays these out as six wrapped rows; the first tag is brand-green
 * (active), the rest grey. Row grouping is preserved so the wrap matches.
 */
export const TRENDING_TOPIC_ROWS = [
  ['#ReactGh', '#FrontendJobsGh', '#NextJS'],
  ['#PortfolioWeekend', '#DebuggingAtMidnight'],
  ['#JavaScript30DayChallenge', '#ShipItFriday'],
  ['#GitMergeHell', '#TypeScriptWins'],
  ['#WhyIsMyDivBroken', '#CSSIsHard'],
  ['#InterviewPrepGh'],
];
export const TRENDING_TOPIC_ACTIVE = '#ReactGh';

/*
 * Right rail — Related Communities. `✅ VERIFIED` (7025:86568).
 * Figma annotation on 7025:86565:
 *   "Related communitites are shown based on the common category the
 *    communities are in. In this case is 'Software engineering'"
 * (typo "communitites" is Figma's). The list below is what Figma renders;
 * `RELATED_COMMUNITY_CATEGORY` records the category that produced it.
 */
export const RELATED_COMMUNITY_CATEGORY = 'Software engineering';
export const RELATED_COMMUNITIES = [
  {
    id: 'software-engineering',
    name: 'Software Engineering',
    meta: '2,400 members',
    image: coverSoftwareEngineeringGhana,
  },
  {
    id: 'hackathon-ghana',
    name: 'Hackathon Ghana',
    meta: '380 members',
    image: coverHackathonsGhana,
  },
  {
    id: 'stem-girls-ghana',
    name: 'STEM Girls Ghana',
    meta: '650 members',
    image: coverStemGirlsGhana,
  },
  // Figma renders this row with a grey image-placeholder tile, not a photo.
  {
    id: 'data-science-ghana',
    name: 'Data Science Ghana',
    meta: '1,050 members',
    image: tileDataSciencePlaceholder,
  },
];

/* Index page header. `✅ VERIFIED` (7025:85202 / 7025:85204).
 *
 * ⚠️ Figma's literal headline is "Find you People" — "Find you " in plain
 * Instrument Serif #111 followed by "People" in Instrument Serif *Italic*
 * #387440. That reads like a typo for "Find your People", but per the
 * verbatim-copy rule it is reproduced exactly and flagged here instead.
 * (The layer NAME says "Heading 2 → Opportunities that match you." — stale
 * leftover text, NOT the rendered content.)
 */
export const INDEX_HEADING = { lead: 'Find you ', accent: 'People' };
export const INDEX_SUBHEADING = 'Connect with talent who share your career interests.';

/** Filtered-results line — `✅ VERIFIED` (7025:85555). */
export const buildResultsLine = (count, category) => ({
  lead: `Showing ${count} ${count === 1 ? 'community' : 'communities'} in `,
  accent: category,
});

/* Create Post modal. `✅ VERIFIED` (7025:89210). */
export const CREATE_POST_COPY = {
  title: 'Create Post',
  postingToLead: 'Posting to ',
  postingToTarget: '#Frontend Devs Ghana',
  placeholder: "What's on your mind? Share an update, ask a question, or celebrate a win...",
  uploadTitle: 'Upload your photos',
  uploadHint: 'Drag & drop, or click to upload · PNG or JPG, up to 10MB',
  linksLabel: 'Links',
  addLabel: 'Add',
  maxLength: 1000,
  cancelLabel: 'Cancel',
  submitLabel: 'Post',
};

/* Report Post modal. `✅ VERIFIED` (7025:90562). */
export const REPORT_POST_COPY = {
  title: 'Report Post',
  subtitle: "Help us understand what's wrong with this post.",
  reasons: ['Inappropriate', 'Spam', 'Misleading', 'Other'],
  cancelLabel: 'Cancel',
  submitLabel: 'Submit Report',
};

/*
 * Milestone share modal. Shown from Career Buddy right after a talent
 * profile stage is confirmed (not from a community post's own Share button
 * — see ShareMilestoneModal.jsx for that history).
 *
 * The Personality copy below is `✅ VERIFIED` (7025:89865) — Figma's only
 * concrete milestone screen. No other stage has its own Figma frame, so
 * `buildShareMilestoneCopy` reproduces that screen's exact sentence
 * template with the stage's label substituted in — `⚠️ ASSUMPTION` for
 * every stage other than Personality.
 */
export const SHARE_MILESTONE_COPY = {
  title: 'Milestone unlocked!',
  subtitle: 'You completed your Personality Assessment! Share this with your network?',
  message:
    'Just completed my Personality Assessment on GTH — one step closer to finding the right career fit! 🎉',
  shareWithLabel: 'Share with',
  audiences: ['My Connections', 'Select Community', 'Public'],
  declineLabel: 'No, keep this private',
  submitLabel: 'Share',
};

export const buildShareMilestoneCopy = (stageLabel) => ({
  ...SHARE_MILESTONE_COPY,
  subtitle: `You completed your ${stageLabel}! Share this with your network?`,
  message: `Just completed my ${stageLabel} on GTH — one step closer to finding the right career fit! 🎉`,
});

/*
 * Achievement post preview — the "PREVIEW" card Figma shows live-updating
 * below the milestone modal (7025:89895). Personality's banner text is
 * `✅ VERIFIED`, its exact casing ("personality Assessment", lowercase p)
 * reproduced rather than corrected since it's Figma's own real content.
 * Other stages build the same template — `⚠️ ASSUMPTION`, proper-cased
 * since there's no Figma typo to reproduce for those.
 */
export const ACHIEVEMENT_BANNER_TEXT = 'Emma has completed their personality Assessment on GTH';

export const buildAchievementBannerText = (fullName, stageLabel) =>
  `${fullName} has completed their ${stageLabel} on GTH`;

/** Post overflow-menu items. `⚠️ ASSUMPTION` — Figma draws the meatball icon
 *  (7025:86397) and a Report Post modal (7025:89962) but never the open menu,
 *  so "Report Post" is the single action wired, matching the only modal shown. */
export const POST_MENU_ITEMS = [{ id: 'report', label: 'Report Post' }];
