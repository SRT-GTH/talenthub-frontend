/*
 * jobPostingsData.js — verbatim content for the Recruiter Job Postings screen.
 * Source: Figma Bin8roWL8sloyc36IgFMuT, frame 7249:75818
 * ("RECRUITER - JOB POSTINGS / All"), content canvas 7249:75849.
 *
 * HEADING NOTE — unlike every other screen in this set, 7249:75853's
 * `characterStyleOverrides` array is EMPTY, so "Job Postings" renders
 * uniformly in its base style (#111111 Instrument Serif, not italic). The node
 * still carries a vestigial styleOverrideTable copied from a sibling heading,
 * but nothing references it. Reproduced as Figma renders it — `accent` is
 * omitted — rather than assuming the split was intended.
 *
 * Double spaces in "Ho,  Ghana" and "Accra,  Ghana" are literal in Figma.
 * "--" is the design's own placeholder for a stat a draft/closed post has no
 * value for.
 */

export const PAGE_HEADING = { lead: 'Job Postings' };
export const PAGE_SUBHEADING = "Track every posting's progress, from draft to hire";

// Figma 7249:75871 — status filter pills. "All" is active and carries a count.
export const STATUS_PILLS = [
  { id: 'all', label: 'All', count: '(5)' },
  { id: 'active', label: 'Active' },
  { id: 'draft', label: 'Draft' },
  { id: 'closed', label: 'Closed' },
];

export const SEARCH_PLACEHOLDER = 'Search your postings...';
export const CREATE_POST_LABEL = 'Create Post';

export const STAT_LABELS = {
  totalApplicants: 'Total Applicants',
  awaiting: 'Awaiting',
  avgMatch: 'Avg. Match',
};

// Figma 7249:75903 / :75953 / :76003. Badge palettes come straight from the
// Figma fills: Active #ebf1ec/#e1eae2/#2a5730, Draft #faf4e8/#eedeb8/#935a22,
// Closed #f8f8f4/#e8e8e4/#737373.
export const STATUS_STYLES = {
  Active: 'bg-brand-green-light border-brand-green-light-hover text-brand-green-dark',
  Draft: 'bg-[#faf4e8] border-[#eedeb8] text-[#935a22]',
  Closed: 'bg-neutral border-border-pill text-content-helper',
};

// The 48x48 icon tile and its glyph track the posting's STATUS, not the role —
// Figma 7249:75907 / :75957 / :76007 give three different tile fills, and only
// the Active card's glyph is green (#2a5730); Draft and Closed are #999999.
export const STATUS_ICON_STYLES = {
  Active: { tile: 'bg-[#f3f8f4]', glyph: 'text-brand-green-dark' },
  Draft: { tile: 'bg-[#faf4e8]', glyph: 'text-[#999999]' },
  Closed: { tile: 'bg-[#eae8e2]', glyph: 'text-[#999999]' },
};

export const POSTINGS = [
  {
    id: 'senior-ux-designer',
    icon: 'pencil-ruler',
    title: 'Senior UX Designer',
    status: 'Active',
    location: 'London, UK',
    type: 'Full-Time',
    age: '5 days ago',
    totalApplicants: '128',
    awaiting: '42',
    avgMatch: '84%',
    action: 'View Pipeline',
    figmaNode: '7249:75903',
  },
  {
    id: 'devops-engineer',
    icon: 'developer-board',
    title: 'DevOps Engineer',
    status: 'Draft',
    location: 'Ho,  Ghana',
    type: 'Full-Time',
    age: '1 week ago',
    totalApplicants: '--',
    awaiting: '--',
    avgMatch: '--',
    action: 'Continue Editing',
    figmaNode: '7249:75953',
  },
  {
    id: 'data-analyst-intern',
    icon: 'hat-graduation',
    title: 'Data Analyst Intern',
    status: 'Closed',
    location: 'Accra,  Ghana',
    type: 'Full-Time',
    age: '1 week ago',
    totalApplicants: '41',
    awaiting: '--',
    avgMatch: '64%',
    action: 'View Summary',
    figmaNode: '7249:76003',
  },
];

// Figma 7249:76889 — the per-card overflow menu. 160x156, white, r12,
// 0.7px #e5e5e5 outline, 49px rows separated by 0.6px #e5e5e5 rules.
// "Close posting" is the destructive item (#902b20); the others are #737373.
export const CARD_MENU_ITEMS = [
  { id: 'edit', label: 'Edit Posting' },
  { id: 'duplicate', label: 'Duplicate' },
  { id: 'close', label: 'Close posting', destructive: true },
];

// Figma 7249:78032 — the modal the "Close posting" item opens. 528x313,
// white, r24, padding 48/64, centred text, danger + outline button pair.
export const CLOSE_CONFIRMATION = {
  title: 'Close this posting?',
  body: 'Once closed, it stops accepting new applicants and comes off candidate search. You can reopen it anytime.',
  confirmLabel: 'Yes, close posting',
  cancelLabel: 'No, keep it open',
};
