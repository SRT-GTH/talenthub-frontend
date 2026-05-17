/**
 * Profile-stage definitions for the Profile Engagement page.
 * Source: Figma frame 3384:81927 (Gh Design system — engagement side, 9 stages).
 *
 * Each stage is a tile the candidate can pick up in any order. Statuses:
 *   done         — stage submitted, all required fields collected
 *   in-progress  — at least one field saved but not yet submitted
 *   not-started  — nothing saved yet (the default)
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
    subtitle: 'show up as you',
    metaPrimary: 'Avatar set',
    durationLabel: '~3 min',
    status: STAGE_STATUS.DONE,
  },
  {
    id: 'personal-interests',
    emoji: '🧭',
    title: 'Personal Areas of Interest',
    subtitle: 'How you think',
    metaPrimary: '—',
    durationLabel: '~3 min',
    status: STAGE_STATUS.NOT_STARTED,
  },
  {
    id: 'personality',
    emoji: '🧠',
    title: 'Personality',
    subtitle: 'How you think',
    metaPrimary: '—',
    durationLabel: '~3 min',
    status: STAGE_STATUS.NOT_STARTED,
  },
  {
    id: 'skills',
    emoji: '🛠️',
    title: 'Skills (Competencies)',
    subtitle: 'What you can do',
    metaPrimary: '—',
    durationLabel: '~3 min',
    status: STAGE_STATUS.NOT_STARTED,
  },
  {
    id: 'work-experience',
    emoji: '💼',
    title: 'Work Experience',
    subtitle: 'What you can do',
    metaPrimary: '—',
    durationLabel: '~3 min',
    status: STAGE_STATUS.NOT_STARTED,
  },
  {
    id: 'project-portfolio',
    emoji: '🗂️',
    title: 'Project Portfolio',
    subtitle: 'Where you’ve been',
    metaPrimary: '—',
    durationLabel: '~3 min',
    status: STAGE_STATUS.NOT_STARTED,
  },
  {
    id: 'certifications',
    emoji: '🎓',
    title: 'Certifications',
    subtitle: 'What you’ve shipped',
    metaPrimary: '—',
    durationLabel: '~3 min',
    status: STAGE_STATUS.NOT_STARTED,
  },
  {
    id: 'desired-career',
    emoji: '🧗',
    title: 'Desired Career Options',
    subtitle: 'show up as you',
    metaPrimary: '—',
    durationLabel: '~5 min',
    status: STAGE_STATUS.NOT_STARTED,
  },
  {
    id: 'talent-pitch',
    emoji: '🎤',
    title: 'Talent Pitch',
    subtitle: 'show up as you',
    metaPrimary: '—',
    durationLabel: '~6 min',
    status: STAGE_STATUS.NOT_STARTED,
  },
];
