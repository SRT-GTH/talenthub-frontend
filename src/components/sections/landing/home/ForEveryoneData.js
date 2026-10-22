/* S7 For everyone copy — verbatim from Figma 7797:13315 (desktop) / 7815:269892 (tablet) / 7815:277709 (mobile).
 * The four tab panels are the component variants Tab=Students/Parents/Schools/Recruiters (7797:15692 / 15729 / 15766 / 15803), read from their renders. */

export const FOR_EVERYONE_HEAD = {
  chip: 'Built for Ghana’s whole talent story',
  title: 'One platform, for all of you.',
};

/* Tab order and labels as drawn (icon = LpBIcon name). */
export const AUDIENCE_TABS = [
  { id: 'students', label: 'Students', icon: 'user' },
  { id: 'parents', label: 'Parents', icon: 'heart' },
  { id: 'schools', label: 'Schools', icon: 'book' },
  { id: 'recruiters', label: 'Recruiters', icon: 'company' },
];

export const DEFAULT_AUDIENCE_TAB = 'recruiters';

/* heading = [dark part, green part]. photo key → asset in ForEveryoneSection. `textCompact` = tablet/mobile wording. */
export const AUDIENCE_PANELS = {
  students: {
    heading: ['Your profile is your passport ', 'to opportunity.'],
    body: 'From JHS to university and your first job. Build a verified profile that shows who you really are, not just your grades.',
    items: [
      { id: 'free', text: 'Free for students, forever' },
      { id: 'assess', text: 'Personality and skills assessment included' },
      { id: 'employers', text: 'Direct connection to 250+ employers' },
      { id: 'buddy', text: 'Career Buddy guidance and mentorship tools' },
    ],
    cta: 'Create my free profile',
    sticker: 'STUDENTS',
    stickerBg: '#ffd86b',
    photo: 'students',
  },
  parents: {
    heading: ['Stay in the loop, without ', 'the stress.'],
    body: 'See your child’s progress, approve matches for under-18s and get a heads-up when a recruiter reaches out.',
    items: [
      { id: 'notify', text: 'Instant notifications for new matches' },
      { id: 'approve', text: 'Approve or decline before contact' },
      { id: 'see', text: 'See exactly what recruiters can see' },
      { id: 'phone', text: 'Works with any phone, any network' },
    ],
    cta: 'Invite my parent',
    sticker: 'PARENTS',
    stickerBg: '#84cc16',
    photo: 'pen',
  },
  schools: {
    heading: ['Track every ', 'student’s growth.'],
    body: 'Guidance teams see assessment results, readiness and placements across classes, with student consent.',
    items: [
      { id: 'dash', text: 'Class and cohort dashboards' },
      { id: 'trends', text: 'Readiness and skills trends' },
      { id: 'place', text: 'Placement and scholarship tracking' },
      { id: 'ges', text: 'Free onboarding for GES schools' },
    ],
    cta: 'Bring GTH to my school',
    sticker: 'SCHOOLS',
    stickerBg: '#f9c9b6',
    photo: 'table',
  },
  recruiters: {
    heading: ['Find talent you ', 'can trust.'],
    body: 'Search by verified skills and fit, not keywords. Shortlist in an afternoon and reach talents directly.',
    items: [
      { id: 'verified', text: 'Verified skills and assessment scores' },
      { id: 'fit', text: 'Fit score with reasons on every profile' },
      {
        id: 'under18',
        text: 'Parent-approved contact for under-18s',
        textCompact: 'Parents kept informed for under-18s',
      },
      { id: 'companies', text: '250+ companies already hiring' },
    ],
    cta: 'See GTH for recruiters',
    sticker: 'RECRUITERS',
    stickerBg: '#ffd86b',
    photo: 'pen',
  },
};
