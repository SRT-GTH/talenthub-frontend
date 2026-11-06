/*
 * Recruiter Clubs content — Figma file OHG2xsfCCskT8xEn356njv, canvas 10026:36840 "Recruiter - Community Engagement",
 * section "RECRUITER · COMMUNITY · Clubs" (RC-C01 … RC-C17, 10194:18909 … 10194:24251). The frames are "converted 1:1 from
 * talent": the same screens as communityData.js with recruiter copy ("clubs", "Host a company club", "Case study" …). Only what
 * differs lives here; everything else is spread from the talent objects so the two audiences cannot drift apart.
 * Text is VERBATIM from the node `characters`. Selected by `useCommunityContent()` (communityContent.js) from the URL variant.
 * API shape: identical to communityData.js (GET /communities, /communities/:id, …) — the recruiter API is the same contract.
 *
 * Figma inconsistencies kept as drawn:
 *   - RC-C12 Members tab: Abigail Mensah's button reads "Follow" while her neighbours read "Link up" (`idleLabel` below).
 *   - RC-C12 Samuel Boateng is "HR Lead · Silver Rock Technology" (the talent frame says "Student · KNUST · Kumasi"); we keep
 *     his Kumasi city for the "Near you" filter.
 *   - Hackathons Ghana says "New event Sat" in RC-C01 and "Active daily" in RC-C16 (same as talent).
 *   - RC-C14 reads "You + 23 others" for the hero but the sidebar card still says "Members 24" (consistent) while the tab count
 *     "24" sits next to "Events 2": no conflict, kept.
 *
 * ⚠️ ASSUMPTIONS (the frames imply, do not draw):
 *   - "Hiring" feed filter shows only posts whose kind is "Hiring"; the two drawn posts are "Case study", so it shows the empty card.
 *   - Recruiter and talent share the same join / mute store (sessionStorage), seeded with Software Engineering Ghana joined.
 *   - Every catalogue club that is not drawn gets the generated Frontend-style page with an empty feed (as on talent).
 */
import {
  COMMUNITIES_RESPONSE,
  COMMUNITY_BROWSE_COPY,
  COMMUNITY_DETAILS,
  COMMUNITY_PAGE_COPY,
  CREATE_POST,
  LEAVE_COMMUNITY,
  MILESTONE_SHARE,
  PENDING_POST,
  POST_DETAIL,
  REPORT_POST,
} from './communityData.js';

/* ---- browse (RC-C01, C02, C03, C15, C16) ---- */
export const RECRUITER_CLUBS_BROWSE_COPY = {
  ...COMMUNITY_BROWSE_COPY,
  title: 'Find your future hires',
  subtitle:
    'Join clubs where talent with the skills you hire for are active. Share roles, host events and answer questions.',
  searchPlaceholder: 'Search clubs…',
  searchAriaLabel: 'Search clubs',
  categoriesAriaLabel: 'Club categories',
  countLabel: (count) => `${count} clubs`,
  hostButton: 'Host a company club',
  pickedTitle: 'Picked for your open roles',
  pickedNote: (basedOn) => `Based on your open roles: ${basedOn}`,
  loadingNote: 'Finding clubs that fit your open roles…',
  loadingAriaLabel: 'Loading clubs',
  yourCommunities: 'Clubs you recruit in',
  allCommunities: 'All clubs',
  closest: 'Closest clubs',
  tiles: {
    hostTitle: 'Host a company club',
    hostBody:
      'Bring people together around a skill, a place or a cause. GTH checks it within 24 hours.',
    hostLink: 'Host a company club',
    hostAlt: 'or request one: 25 asks opens it',
  },
  noResults: {
    title: (term) => `No club for “${term}” yet`,
    body: 'Start it yourself and become its first moderator, or ask GTH to open it. When 25 people ask, we open it.',
    progress: COMMUNITY_BROWSE_COPY.noResults.progress,
    start: 'Start it yourself',
    request: 'Request this club',
    // RC-C16 draws no "Clear search" button: the search field clears the term.
    clear: null,
  },
  results: {
    showing: (count) => `Showing ${count} ${count === 1 ? 'club' : 'clubs'} in`,
    clear: COMMUNITY_BROWSE_COPY.results.clear,
  },
  menu: { open: 'Open club', mute: 'Mute notifications', leave: 'Leave club' },
  cardMenuAriaLabel: 'Club options',
};

export const RECRUITER_CLUBS_CATALOGUE = {
  ...COMMUNITIES_RESPONSE,
  picked: { ...COMMUNITIES_RESPONSE.picked, basedOn: 'Senior UX Designer, Product Designer' },
  communities: COMMUNITIES_RESPONSE.communities.map((club) =>
    club.id === 'frontend-devs-ghana'
      ? { ...club, tag: { kind: 'highlight', label: 'Fits your open roles' } }
      : club
  ),
};

/* ---- club page (RC-C04 … C14) ---- */
export const RECRUITER_CLUBS_PAGE_COPY = {
  ...COMMUNITY_PAGE_COPY,
  back: 'All clubs',
  join: 'Join club',
  invite: 'Share club',
  filters: ['All', 'Hiring', 'Updates', 'Questions', 'Resources'],
  composer: {
    placeholder: 'Share a role, a hiring update or an event…',
    // Same Figma icons as the talent Photo / Win / Link quick buttons, new labels.
    photo: 'Event',
    win: 'Share a role',
    link: 'Hiring update',
  },
  preview: { ...COMMUNITY_PAGE_COPY.preview, title: 'You’re previewing this club' },
  card: {
    ...COMMUNITY_PAGE_COPY.card,
    about: 'About this club',
    related: 'Related clubs',
  },
  about: { ...COMMUNITY_PAGE_COPY.about, forTitle: 'What this club is for' },
  members: { ...COMMUNITY_PAGE_COPY.members, follow: 'Link up', following: 'In your network' },
};

const recruiterPerson = (person) => {
  if (person.id === 'samuel-boateng')
    return { ...person, role: 'HR Lead · Silver Rock Technology' };
  // RC-C12 draws Abigail's button as "Follow" (not "Link up"): kept until she is toggled.
  if (person.id === 'abigail-mensah') return { ...person, idleLabel: 'Follow' };
  return person;
};

const recruiterAbout = (about) => ({
  ...about,
  rules: about.rules.map((rule) => {
    if (rule.title === 'Keep it relevant') {
      return {
        ...rule,
        text: 'Frontend, careers and learning. Recruiters may share roles with the “Hiring” tag only.',
      };
    }
    if (rule.title === 'No paid job ads') {
      return {
        ...rule,
        text: 'Recruiters: share roles with the “Share a role” post type. Up to 2 hiring posts per week, and roles must show pay or say “unpaid”.',
      };
    }
    return rule;
  }),
  moderators: about.moderators.map((moderator) =>
    moderator.name === 'GTH Community Team' ? { ...moderator, name: 'GTH Club Team' } : moderator
  ),
});

const recruiterDetail = (detail) => ({
  ...detail,
  posts: detail.posts.map((post) => ({ ...post, kind: 'Case study' })),
  people: detail.people.map(recruiterPerson),
  about: recruiterAbout(detail.about),
  faces: detail.id === 'agritech-innovators-ghana' ? 'You + 23 others' : detail.faces,
});

export const RECRUITER_CLUBS_DETAILS = Object.fromEntries(
  Object.entries(COMMUNITY_DETAILS).map(([id, detail]) => [id, recruiterDetail(detail)])
);

/* Catalogue entry -> detail for clubs that are not drawn (⚠️ ASSUMPTION: Frontend content, empty feed, as on talent). */
export const buildRecruiterFallbackDetail = (entry) => ({
  ...RECRUITER_CLUBS_DETAILS['frontend-devs-ghana'],
  id: entry.id,
  name: `#${entry.name}`,
  members: entry.members,
  membersLabel: `${entry.members.toLocaleString('en-US')} members`,
  activity: entry.activity,
  description: entry.description,
  info: {
    ...RECRUITER_CLUBS_DETAILS['frontend-devs-ghana'].info,
    members: entry.members.toLocaleString('en-US'),
    activity: entry.activity,
  },
  posts: [],
});

/* ---- dialogs (RC-C08 create, C10 report, C17 leave, C09 milestone) + C13 pending ---- */
export const RECRUITER_CLUBS_CREATE_POST = {
  ...CREATE_POST,
  // The "Achievement" kind is drawn as "Case study" (same star glyph).
  types: CREATE_POST.types.map((type) =>
    type.id === 'achievement' ? { ...type, label: 'Case study' } : type
  ),
  seed: { ...CREATE_POST.seed, link: 'silverrock.tech/careers' },
};

export const RECRUITER_CLUBS_REPORT_POST = {
  ...REPORT_POST,
  reasons: REPORT_POST.reasons.map((reason) =>
    reason.id === 'inappropriate' ? { ...reason, sub: 'Not safe for a career club' } : reason
  ),
};

export const RECRUITER_CLUBS_LEAVE = {
  ...LEAVE_COMMUNITY,
  rows: [
    'You’ll stop seeing posts and event invites from this club',
    ...LEAVE_COMMUNITY.rows.slice(1),
  ],
  leave: 'Leave club',
};

export const RECRUITER_CLUBS_MILESTONE = {
  ...MILESTONE_SHARE,
  body: 'Your company is verified. Tell your clubs you’re hiring? Recruiter posts with a role get 3× more views.',
  message:
    'Silver Rock Technology is now a verified employer on GTH. We’re hiring designers and engineers in Accra this quarter. Ask me anything!',
  audiences: MILESTONE_SHARE.audiences.map((audience) =>
    audience.id === 'community' ? { ...audience, label: 'A club' } : audience
  ),
  previewName: 'Joel Adade Kofie',
  previewTag: 'Case study',
  banner: 'Silver Rock Technology is now a verified employer',
};

export const RECRUITER_CLUBS_PENDING_POST = { ...PENDING_POST, author: 'Joel Adade Kofie' };

export const RECRUITER_CLUBS_POST_DETAIL = { ...POST_DETAIL, meName: 'Joel Adade Kofie' };
