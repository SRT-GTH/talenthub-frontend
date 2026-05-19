/**
 * Profile-stage definitions for the Profile Engagement page.
 * Source: Figma frame 3384:81927 (Gh Design system — engagement side, 9 stages).
 *
 * Each stage is a tile the candidate can pick up in any order. Statuses:
 *   done         — stage submitted, all required fields collected
 *   in-progress  — at least one field saved but not yet submitted
 *   not-started  — nothing saved yet (the default)
 *
 * Each stage carries both a full `title` (used in stage-list cards) and a
 * short `trailLabel` (used in the compact horizontal trail at the top of
 * the engagement pages). The trail labels match the Figma frame
 * (3384:81977) exactly: Avatar › Interests › Personality › Skills › Work
 * › Portfolio › Certs › Goals › Pitch.
 */

export const STAGE_STATUS = {
  DONE: 'done',
  IN_PROGRESS: 'in-progress',
  NOT_STARTED: 'not-started',
};

export const PROFILE_STAGES = [
  {
    id: 'avatar',
    emoji: '🎭',
    title: 'Avatar',
    trailLabel: 'Avatar',
    subtitle: 'show up as you',
    metaPrimary: 'Avatar set',
    durationLabel: '~3 min',
    status: STAGE_STATUS.DONE,
  },
  {
    id: 'personal-interests',
    emoji: '🧭',
    title: 'Personal Areas of Interest',
    trailLabel: 'Interests',
    subtitle: 'How you think',
    metaPrimary: '—',
    durationLabel: '~3 min',
    status: STAGE_STATUS.NOT_STARTED,
  },
  {
    id: 'personality',
    emoji: '🧠',
    title: 'Personality',
    trailLabel: 'Personality',
    subtitle: 'How you think',
    metaPrimary: '—',
    durationLabel: '~3 min',
    status: STAGE_STATUS.NOT_STARTED,
  },
  {
    id: 'skills',
    emoji: '🛠️',
    title: 'Skills (Competencies)',
    trailLabel: 'Skills',
    subtitle: 'What you can do',
    metaPrimary: '—',
    durationLabel: '~3 min',
    status: STAGE_STATUS.NOT_STARTED,
  },
  {
    id: 'work-experience',
    emoji: '💼',
    title: 'Work Experience',
    trailLabel: 'Work',
    subtitle: 'What you can do',
    metaPrimary: '—',
    durationLabel: '~3 min',
    status: STAGE_STATUS.NOT_STARTED,
  },
  {
    id: 'project-portfolio',
    emoji: '🗂️',
    title: 'Project Portfolio',
    trailLabel: 'Portfolio',
    subtitle: 'Where you’ve been',
    metaPrimary: '—',
    durationLabel: '~3 min',
    status: STAGE_STATUS.NOT_STARTED,
  },
  {
    id: 'certifications',
    emoji: '🎓',
    title: 'Certifications',
    trailLabel: 'Certs',
    subtitle: 'What you’ve shipped',
    metaPrimary: '—',
    durationLabel: '~3 min',
    status: STAGE_STATUS.NOT_STARTED,
  },
  {
    id: 'desired-career',
    emoji: '🧗',
    title: 'Desired Career Options',
    trailLabel: 'Goals',
    subtitle: 'show up as you',
    metaPrimary: '—',
    durationLabel: '~5 min',
    status: STAGE_STATUS.NOT_STARTED,
  },
  {
    id: 'talent-pitch',
    emoji: '🎤',
    title: 'Talent Pitch',
    trailLabel: 'Pitch',
    subtitle: 'show up as you',
    metaPrimary: '—',
    durationLabel: '~6 min',
    status: STAGE_STATUS.NOT_STARTED,
  },
];

/*
 * Section grouping (Figma "SECTION 1 · YOUR IDENTITY · 2 OF 9 STAGES DONE"
 * banner on the Identity Map page). The first five stages are "identity"
 * stages; the trophy and final pitch stages mark milestones along the
 * journey. We define the section names + member stage ids here so the
 * map page can derive its header copy without a separate source of truth.
 */
export const PROFILE_SECTIONS = [
  {
    id: 'identity',
    label: 'Your Identity',
    stageIds: ['avatar', 'personal-interests', 'personality', 'skills', 'work-experience'],
  },
  {
    id: 'showcase',
    label: 'Your Showcase',
    stageIds: ['project-portfolio', 'certifications'],
  },
  {
    id: 'direction',
    label: 'Your Direction',
    stageIds: ['desired-career', 'talent-pitch'],
  },
];
