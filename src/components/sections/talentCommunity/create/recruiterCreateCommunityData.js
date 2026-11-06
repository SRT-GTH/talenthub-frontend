/*
 * Recruiter "Host a company club" — copy + owner fixtures (Figma canvas 10026:36840 "Recruiter - Community Engagement", section
 * "RECRUITER · COMMUNITY · Host a company club", RC-CC02 … RC-CC17b). The frames are "converted 1:1 from talent": the same screens
 * with club copy, so every block here is the talent block (createCommunityData.js) with the strings Figma changes laid over it.
 * Strings are VERBATIM from the Figma text nodes. Mock data only, API-shaped like the talent fixtures.
 */
import {
  ARCHIVE_COPY,
  CREATE_COPY,
  INVITE_COPY,
  MANAGE_COPY,
  MENTOR_COPY,
  OWNER_COPY,
  OWNER_STATUS_COPY,
  TRANSFER_COPY,
  buildOwnedCommunity,
  buildSubmittedCommunity,
} from './createCommunityData.js';

/* Deep-merge `over` onto `base`: plain objects merge, arrays and primitives are replaced. Returns a new object. */
const withOverrides = (base, over) => {
  const out = { ...base };
  Object.entries(over).forEach(([key, value]) => {
    const isPlain = value && typeof value === 'object' && !Array.isArray(value);
    out[key] = isPlain && base[key] ? withOverrides(base[key], value) : value;
  });
  return out;
};

export const RECRUITER_CREATE_COPY = withOverrides(CREATE_COPY, {
  title: 'Host a company club',
  basics: { name: 'Club name' },
  review: {
    nextBody:
      'GTH checks new clubs within 24 hours. While you wait, invite your co-moderators. A mentor or teacher must join before it opens to under-18s.',
    agree:
      'I agree to the GTH club guidelines for company clubs. No paid placements, no fees to join, and I’ll act on reports within 48 hours.',
  },
  notReady: {
    title: 'Almost ready to start a club',
    intro:
      'Company-hosted clubs need a verified employer and a named owner. Two more things and you’re set.',
    underBody:
      'You can draft a club and invite friends. It opens once a verified mentor or teacher co-moderates it, and your parent is told.',
    note: 'Your company can host up to 3 clubs at a time',
  },
});

export const RECRUITER_OWNER_STATUS_COPY = withOverrides(OWNER_STATUS_COPY, {
  'under-review': {
    empty: {
      body: 'Draft a welcome post now (e.g. “Welcome to the Silver Rock Design Circle”). It goes out the moment GTH approves your club.',
    },
  },
  'waiting-mentor': {
    empty: { body: 'Your welcome post is saved and goes out when the club opens.' },
  },
  archived: {
    primary: { label: 'Restore club' },
    empty: { title: 'This club is archived' },
  },
});

export const RECRUITER_OWNER_COPY = withOverrides(OWNER_COPY, {
  back: 'All clubs',
  // One recruiter style (no Playful/Focused pair): the toast draws "pts".
  toastLive: '{name} is live · +100 {xp}',
});

export const RECRUITER_INVITE_COPY = withOverrides(INVITE_COPY, {
  calloutBody:
    'Talents under 18 only get invites from people they follow, and their parent can see which clubs they join.',
});

export const RECRUITER_MENTOR_COPY = withOverrides(MENTOR_COPY, {});

export const RECRUITER_MANAGE_COPY = withOverrides(MANAGE_COPY, {
  requestsNote: 'Only for “Request to join” clubs',
  settings: { archive: { title: 'Archive club' } },
});

export const RECRUITER_TRANSFER_COPY = withOverrides(TRANSFER_COPY, {
  points: [
    TRANSFER_COPY.points[0],
    TRANSFER_COPY.points[1],
    { ...TRANSFER_COPY.points[2], body: 'Because the club is open to ages 14 and up.' },
  ],
});

export const RECRUITER_ARCHIVE_COPY = withOverrides(ARCHIVE_COPY, {
  archive: 'Archive club',
});

/* The signed-in recruiter (the drawn owner "Joel Adade Kofie", HR Lead · Silver Rock Technology): owner row in members / moderators. */
const RECRUITER_OWNER_NAME = 'Joel Adade Kofie';
const asRecruiterOwner = (person) =>
  person.role === 'owner' || person.state === 'owner'
    ? { ...person, name: RECRUITER_OWNER_NAME }
    : person;

/* RC-CC10 / RC-CC14 draw the moderator whose invite is pending as "Michael Asante" in the Manage dialog, while RC-CC16 (Transfer
 * ownership) lists the same pending invite as "Ransford Kudjoe": a Figma inconsistency kept as drawn (`transferName`). */
const asRecruiterPending = (person) =>
  person.state === 'invited' && person.id === 'ransford'
    ? { ...person, id: 'michael', name: 'Michael Asante', transferName: 'Ransford Kudjoe' }
    : person;

/* GET /recruiter/communities/mine/:id — the talent fixture with the recruiter as owner. */
export const buildRecruiterOwnedCommunity = (status = 'live', options = {}) => {
  const base = buildOwnedCommunity(status, options);
  return {
    ...base,
    members: base.members.map(asRecruiterOwner),
    moderators: base.moderators.map(asRecruiterOwner).map(asRecruiterPending),
    feedback:
      status === 'needs-change' ? RECRUITER_OWNER_STATUS_COPY['needs-change'].banner.body : null,
  };
};

/* POST /recruiter/communities — a club made from the wizard: one member (the recruiter), under review. */
export const buildRecruiterSubmittedCommunity = (draft, id) => {
  const base = buildSubmittedCommunity(draft, id);
  return {
    ...base,
    members: base.members.map(asRecruiterOwner),
    moderators: base.moderators.map(asRecruiterOwner),
  };
};
