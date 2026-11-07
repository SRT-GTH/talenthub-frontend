/*
 * pipelineBoardData.js — mock `board` for the new Application Pipeline design.
 * Source: Figma file OHG2xsfCCskT8xEn356njv, page "Recruiter - Application Pipeline" (10172:10101), frames PL-01 (10173:11112), PL-01b, PL-02, PL-04, PL-06, PL-15.
 * Text is verbatim from the frames. Shaped like the future API payload (see $S/shared_board.md contract):
 *   board  { jobId, jobTitle, totalCandidates, qualifiedCount, stages:[stage] }
 *   stage  { id, label, icon, count, cards:[card], hiddenCount?, empty? }
 *   card   candidate { id, kind:'candidate', name, initials, avatar, avatarTone, role, years, matchPercent, qualified, tags, criteria, badges, footer, primaryAction }
 *          meeting   { id, kind:'meeting', name, meta, tone, badge, statusLabel, platform, primaryAction?, secondaryAction, qualified }
 *
 * Figma inconsistencies kept as drawn: the "All stages 128" chip does not equal the sum of the stage chips (11 shown).
 */

const candidate = (fields) => ({
  kind: 'candidate',
  avatar: null,
  tags: [],
  criteria: null,
  badges: [],
  primaryAction: null,
  qualified: true,
  ...fields,
});

export const BASE_BOARD = {
  jobId: 'senior-ux-designer',
  jobTitle: 'Senior UX Designer — London, UK',
  totalCandidates: 128,
  qualifiedCount: 46,
  stages: [
    {
      id: 'applied',
      label: 'Applied',
      icon: 'inbox',
      count: 3,
      selectAllCount: 42, // PL-06 "Select all 42 in Applied" (⚠️ only Applied is drawn; the other stages fall back to their count)
      cards: [
        candidate({
          id: 'ama-boateng',
          name: 'Ama Boateng',
          initials: 'AB',
          avatar: 'ama-boateng',
          role: 'Product Lead',
          years: 8,
          matchPercent: 84,
          tags: ['Figma', 'Prototyping'],
          criteria: '3 of 4 criteria',
          footer: 'Applied 2h ago',
        }),
        candidate({
          id: 'eleanor-fant',
          name: 'Eleanor Fant',
          initials: 'EF',
          avatarTone: 'violet',
          role: 'UX Lead',
          years: 7,
          matchPercent: 91,
          criteria: '3 of 4 criteria',
          footer: 'Applied 8h ago',
        }),
        candidate({
          id: 'marcus-thorne',
          name: 'Marcus Thorne',
          initials: 'MT',
          avatarTone: 'taupe',
          role: 'UX Designer',
          years: 4,
          matchPercent: 68,
          qualified: false,
          badges: [
            { id: 'close-match', label: 'Close match', tone: 'amber', icon: 'alert', chip: true },
          ],
          footer: 'Applied 1d ago',
        }),
      ],
    },
    {
      id: 'screening',
      label: 'Screening',
      icon: 'pipeline',
      count: 1,
      cards: [
        candidate({
          id: 'abena-owusu',
          name: 'Abena Owusu',
          initials: 'AO',
          avatarTone: 'blue',
          role: 'UI Designer',
          years: 5,
          matchPercent: 64,
          qualified: false,
          badges: [
            { id: 'moved-anyway', label: 'Moved anyway', tone: 'amber', icon: 'alert' },
            { id: 'no-reply', label: 'No reply in 3 days', tone: 'red', icon: 'clock' },
          ],
          footer: '3d in stage',
        }),
      ],
    },
    {
      id: 'shortlisted',
      label: 'Shortlisted',
      icon: 'check',
      count: 1,
      cards: [
        candidate({
          id: 'ella-mensah',
          name: 'Ella Mensah',
          initials: 'EM',
          avatar: 'ella-mensah',
          role: 'UX Designer',
          years: 2,
          matchPercent: 91,
          criteria: '3 of 4 criteria',
          primaryAction: 'schedule-interview',
          footer: '2d in stage',
        }),
      ],
    },
    {
      id: 'interview',
      label: 'Interview',
      icon: 'calendar',
      count: 3,
      cards: [
        {
          id: 'adam-sandler',
          kind: 'meeting',
          qualified: true,
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
          qualified: true,
          tone: 'past',
          badge: 'alert',
          wide: true,
          name: 'Elliot Whitmore',
          meta: 'Tue, Sept 4 · 2:00 PM',
          statusLabel: 'Past Meeting',
          platform: 'Google Meet',
          primaryAction: 'Mark as Completed',
          secondaryAction: 'Reschedule',
        },
        {
          id: 'sarah-jenkins',
          kind: 'meeting',
          qualified: true,
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
      label: 'Offer extended',
      icon: 'offer',
      count: 1,
      cards: [
        candidate({
          id: 'akosua-quansah',
          name: 'Akosua Quansah',
          initials: 'AQ',
          avatarTone: 'green',
          role: 'Senior Product Designer',
          years: 7,
          matchPercent: 88,
          badges: [{ id: 'awaiting', label: 'Awaiting response', tone: 'amber', icon: 'clock' }],
          footer: 'Expires 30 Oct',
        }),
      ],
    },
    {
      id: 'hired',
      label: 'Hired',
      icon: 'hired',
      count: 0,
      cards: [],
      empty: {
        title: 'No hires yet',
        text: 'Accepted offers land here. 1 opening left.',
      },
    },
    {
      id: 'not-progressed',
      label: 'Not progressed',
      icon: 'not-progressed',
      count: 2,
      cards: [
        candidate({
          id: 'godfred-ansah',
          name: 'Godfred Ansah',
          initials: 'GA',
          avatarTone: 'green',
          role: 'Product Designer',
          years: 6,
          matchPercent: 45,
          qualified: false,
          badges: [{ id: 'message-sent', label: 'Message sent', tone: 'neutral', icon: 'check' }],
          footer: 'Rejected 3 Oct',
        }),
        candidate({
          id: 'kwesi-osei',
          name: 'Kwesi Osei',
          initials: 'KO',
          avatarTone: 'taupe',
          role: 'Graphic Designer',
          years: 2,
          matchPercent: 53,
          qualified: false,
          badges: [{ id: 'withdrawn', label: 'Withdrawn', tone: 'neutral', icon: 'undo' }],
          footer: 'Withdrew 1 Oct',
        }),
      ],
    },
  ],
};

/*
 * Cards the frames draw IN FLIGHT (not on the base board). ⚠️ ASSUMPTION: Figma shows no source card for them, so they are modelled as copies
 * that sit in `to` while the source stage chip still counts them (PL-04 chip "Screening 2", PL-06 chip "Screening 2").
 *   ?drag=nana-kwarteng&over=shortlisted       PL-04  ghost in the dashed drop column
 *   ?justMoved=eleanor-fant-recent             PL-06  Eleanor's copy "2m in stage" in Shortlisted
 */
export const IN_FLIGHT_CARDS = {
  'nana-kwarteng': {
    from: 'screening',
    to: 'shortlisted',
    hiddenInTarget: 16,
    card: candidate({
      id: 'nana-kwarteng',
      name: 'Nana Kwarteng',
      initials: 'NK',
      avatarTone: 'taupe',
      role: 'Product Designer',
      years: 7,
      matchPercent: 63,
      criteria: '2 of 4 criteria',
      primaryAction: 'schedule-interview',
      footer: '2d in stage',
    }),
  },
  'eleanor-fant-recent': {
    from: 'screening',
    to: 'shortlisted',
    card: candidate({
      id: 'eleanor-fant-recent',
      name: 'Eleanor Fant',
      initials: 'EF',
      avatarTone: 'violet',
      role: 'UX Lead',
      years: 7,
      matchPercent: 91,
      criteria: '3 of 4 criteria',
      primaryAction: 'schedule-interview',
      footer: '2m in stage',
    }),
  },
};

// Empty pipeline for a brand-new posting (PL-15, "Posted today"): every count 0, only Applied carries the invite prompt.
export const EMPTY_BOARD = {
  ...BASE_BOARD,
  totalCandidates: 0,
  qualifiedCount: 46,
  stages: BASE_BOARD.stages.map((stage) => ({
    ...stage,
    count: 0,
    cards: [],
    empty:
      stage.id === 'applied'
        ? {
            title: 'No applicants yet',
            text: 'Posted today. New applications and invites you send land here.',
            action: 'Invite talent',
          }
        : stage.empty,
  })),
};

/*
 * Card "..." menu (PL-02, 10173:12710). Labels verbatim; `sub` is the second line. ⚠️ ASSUMPTION: Figma draws the menu for an Applied card only,
 * so the rows other stages show are inferred: Move-to rows hide the stage the card is in (and earlier ones), "Not progressing…" is hidden for finished stages.
 */
export const CARD_MENU_ROWS = [
  { id: 'view-profile', label: 'View candidate’s profile', icon: 'profile' },
  { id: 'open-application', label: 'Open application', icon: 'application' },
  {
    id: 'message',
    label: 'Message',
    sub: 'Opens your conversation in Messages',
    icon: 'message',
  },
  { id: 'move-screening', label: 'Move to Screening', icon: 'move', moveTo: 'screening' },
  { id: 'move-shortlisted', label: 'Move to Shortlisted', icon: 'move', moveTo: 'shortlisted' },
  { id: 'schedule-interview', label: 'Schedule interview', icon: 'schedule' },
  {
    id: 'not-progressing',
    label: 'Not progressing…',
    sub: 'Choose a reason and send a kind message',
    icon: 'not-progressing',
    destructive: true,
  },
];

const STAGE_ORDER = ['applied', 'screening', 'shortlisted'];

export const menuRowsFor = (stageId) =>
  CARD_MENU_ROWS.filter((row) => {
    if (row.moveTo)
      return (
        STAGE_ORDER.indexOf(stageId) !== -1 &&
        STAGE_ORDER.indexOf(stageId) < STAGE_ORDER.indexOf(row.moveTo)
      );
    if (row.id === 'schedule-interview') return STAGE_ORDER.includes(stageId);
    if (row.id === 'not-progressing') return !['not-progressed', 'hired'].includes(stageId);
    return true;
  });
