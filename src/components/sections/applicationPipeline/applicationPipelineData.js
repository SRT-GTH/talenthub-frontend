/*
 * applicationPipelineData.js — verbatim content for the Recruiter Application
 * Pipeline board. Source: Figma Bin8roWL8sloyc36IgFMuT, frame 7249:79017
 * ("RECRUITER - APPLICATION PIPELINE / Pipeline"), board 7249:79069.
 *
 * COLUMN LABELS carry Figma `textCase: UPPER`, so "Applied", "ACCEPTED" and
 * "rejected" all render upper case despite being stored in mixed case. The
 * strings are kept verbatim and `uppercase` is applied at render.
 *
 * CARD VARIANTS (all 250 wide, white, 1px #00522b, r10, gap 14, pad 18):
 *   profile   avatar + name + meta + tags [+ footer clock/rating]
 *             Applied, Screening, Shortlisted, Offer Extended, Accepted,
 *             Rejected columns.
 *   meeting   no avatar; name + date, a tinted status box (icon + status +
 *             platform) and a secondary button, with a 24px round state badge
 *             in the top-right corner. Interview column only.
 *
 * The Interview column's count badge reads "03" and it does hold three cards —
 * Figma just draws the middle one (Elliot Whitmore) as a slightly different
 * 254x232 frame with two actions instead of one.
 */

export const PAGE_HEADING = { lead: 'Application ', accent: 'Pipeline' };
export const PAGE_SUBHEADING = 'Move candidates through every stage, from application to offer.';

export const CHOOSE_POSTING = {
  label: 'Choose Job Posting',
  required: '*',
  value: 'Senior UX Designer — London, UK',
};

// Status-box palettes, straight from the Figma fills.
export const MEETING_TONES = {
  upcoming: { box: 'bg-[#faf4e8] border-[#f7efdd]', text: 'text-[#785910]', badge: 'bg-[#967014]' },
  past: { box: 'bg-[#f9ebea] border-[#f6e1df]', text: 'text-[#b23b3b]', badge: 'bg-[#b23b3b]' },
  completed: {
    box: 'bg-brand-green-light border-brand-green-light-hover',
    text: 'text-[#224626]',
    badge: 'bg-brand-green-dark',
  },
};

export const COLUMNS = [
  {
    id: 'applied',
    label: 'Applied',
    count: '02',
    cards: [
      {
        id: 'eleanor-fant',
        kind: 'profile',
        avatar: 'eleanor',
        name: 'Eleanor Fant',
        meta: "Match 91% • Bachelor's Degree",
        tags: ['Figma', 'Prototyping'],
        time: '2h ago',
        rating: '4.8',
      },
      {
        id: 'marcus-thorne',
        kind: 'profile',
        name: 'Marcus Thorne',
        meta: 'Match 68% • SHS',
        tags: ['Banking', 'Strategy'],
        time: '5h ago',
        rating: '3.2',
      },
    ],
  },
  {
    id: 'screening',
    label: 'Screening',
    count: '01',
    cards: [
      {
        id: 'julian-reed',
        kind: 'profile',
        avatar: 'julian',
        name: 'Julian Reed',
        meta: "Match 84% • Master's Degree",
        tags: ['FinTech', 'Prototyping'],
        noteLabel: 'Next: Initial Call',
        noteValue: 'Tuesday at 14:00',
      },
    ],
  },
  {
    id: 'shortlisted',
    label: 'Shortlisted',
    count: '--',
    cards: [
      {
        id: 'ella-mensah',
        kind: 'profile',
        avatar: 'ella',
        name: 'Ella Mensah',
        meta: "91% Match • Master's Degree",
        tags: ['Tech', 'Design'],
        primaryAction: 'Schedule Interview',
      },
    ],
  },
  {
    id: 'interview',
    label: 'Interview',
    count: '03',
    cards: [
      {
        id: 'adam-sandler',
        kind: 'meeting',
        tone: 'upcoming',
        badge: 'hourglass',
        name: 'Adam Sandler',
        meta: 'Tue Sept 4 · 2:00 PM',
        statusLabel: 'Upcoming Meeting',
        platform: 'Google Meet',
        secondaryAction: 'View Details',
      },
      {
        id: 'elliot-whitmore',
        kind: 'meeting',
        tone: 'past',
        badge: 'alert',
        wide: true,
        name: 'Elliot Whitmore',
        meta: 'Tue, Sept 4 · 2:00 PM',
        statusLabel: 'Past Meeting',
        platform: 'Google Meet',
        primaryAction: 'Reschedule',
        secondaryAction: 'Mark as Completed',
      },
      {
        id: 'sarah-jenkins',
        kind: 'meeting',
        tone: 'completed',
        badge: 'check',
        name: 'Sarah Jenkins',
        meta: 'Thurs, Aug 4 · 2:00 PM',
        statusLabel: 'Interview Completed',
        platform: 'Zoom Workspace',
        secondaryAction: 'View Meeting',
      },
    ],
  },
  {
    id: 'offer-extended',
    label: 'Offer Extended',
    count: '01',
    cards: [
      {
        id: 'julian-reed-offer',
        kind: 'profile',
        avatar: 'julian',
        name: 'Julian Reed',
        meta: 'Awaiting Response',
      },
    ],
  },
  {
    id: 'accepted',
    label: 'ACCEPTED',
    count: '01',
    cards: [
      {
        id: 'marcus-thorne-accepted',
        kind: 'profile',
        name: 'Marcus Thorne',
        meta: 'Accepted Jul 28',
      },
    ],
  },
  {
    id: 'rejected',
    label: 'rejected',
    count: '01',
    cards: [
      {
        id: 'eleanor-fant-rejected',
        kind: 'profile',
        avatar: 'eleanor',
        name: 'Eleanor Fant',
        meta: 'Not qualified',
      },
    ],
  },
];
