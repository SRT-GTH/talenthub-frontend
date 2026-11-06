/*
 * jobPostingsData.js — verbatim content for the Recruiter Job Postings screen.
 * Source: Figma OHG2xsfCCskT8xEn356njv (Job prospecting V2.0), frame 7249:75818
 * ("RECRUITER - JOB POSTINGS / All"), content canvas 7249:75849.
 *
 * HEADING NOTE — V2.0 draws "Job Postings" with a two-tone run split (7249:75853:
 * 'Job ' #1c2a21, 'Postings' #387440, Bricolage Grotesque 600), same as Job Screening.
 *
 * Double spaces in "Ho,  Ghana" and "Accra,  Ghana" are literal in Figma.
 * "--" is the design's own placeholder for a stat a draft/closed post has no
 * value for.
 */

// V2.0 (7249:75853): Bricolage Grotesque 600, "Job " #1c2a21 + "Postings" #387440.
export const PAGE_HEADING = { lead: 'Job ', accent: 'Postings' };
export const PAGE_SUBHEADING = "Track every posting's progress, from draft to hire";

// Figma 7249:75871 — status filter pills. Only the ACTIVE pill carries a count
// ("All (5)" in 7249:75818, "Draft (1)" in 7249:76277); the inactive pills are
// label-only. `count` here is the label Figma draws when that pill is active and
// the posting list cannot derive it: "All (5)" is kept VERBATIM although the mock
// list holds 3 cards (Figma inconsistency kept as drawn). Every other pill derives
// its count from the visible postings.
export const STATUS_PILLS = [
  { id: 'all', label: 'All', fixedCount: '(5)' },
  { id: 'active', label: 'Active' },
  { id: 'draft', label: 'Draft' },
  { id: 'closed', label: 'Closed' },
];

// URL key values accepted by ?status= (anything else falls back to 'all').
export const STATUS_FILTER_IDS = STATUS_PILLS.map((pill) => pill.id);

// Figma 7249:76361 — the helper line under the toolbar when a status is filtered:
// "Showing 1 posting in Draft" ("Draft" is #387440 / 500). Only the singular is
// drawn; the plural/zero forms below are ⚠️ ASSUMPTION.
export const FILTER_SUMMARY = {
  prefix: 'Showing',
  singular: 'posting',
  plural: 'postings', // ⚠️ ASSUMPTION — Figma only draws "1 posting"
  connector: 'in',
};

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
  Paused: 'bg-[#faf4e8] border-[#eedeb8] text-[#463409]', // JM-09 10117:62145
};

// The 48x48 icon tile and its glyph track the posting's STATUS, not the role —
// Figma 7249:75907 / :75957 / :76007: Active tile #f3f8f4 + glyph #2a5730, Draft
// tile #faf4e8 + glyph #785910, Closed tile #eae8e2 + glyph #737373.
export const STATUS_ICON_STYLES = {
  Active: { tile: 'bg-[#f3f8f4]', glyph: 'text-[#2a5730]' },
  Draft: { tile: 'bg-[#faf4e8]', glyph: 'text-[#785910]' },
  Closed: { tile: 'bg-[#eae8e2]', glyph: 'text-[#737373]' },
  Paused: { tile: 'bg-[#faf4e8]', glyph: 'text-[#785910]' },
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
// 0.7px #e5e5e5 outline, 49px rows separated by 0.6px #e5e5e5 rules, labels
// CENTRED. "Close posting" is the destructive item (#902b20); the others are
// #737373. Hover (7249:77110, "Duplicate" row) fills the row #f6f6f6.
export const CARD_MENU_ITEMS = [
  { id: 'edit', label: 'Edit Posting' },
  { id: 'duplicate', label: 'Duplicate' },
  { id: 'close', label: 'Close posting', destructive: true },
];

// Figma 7249:78032 — the modal the "Close posting" item opens. 528x304,
// white, r24, padding 64/48, centred title + body, danger + outline button pair
// flush RIGHT under them, over a #1c2a21 @ 70% scrim.
export const CLOSE_CONFIRMATION = {
  title: 'Close this posting?',
  body: 'Once closed, it stops accepting new applicants and comes off candidate search. You can reopen it anytime.',
  confirmLabel: 'Yes, close posting',
  cancelLabel: 'No, keep it open',
};

// JT-10 / JT-11 (10117:54589 / :54084): the posting that "Publish job" just created, first in the list with a green outline.
export const NEW_POSTING = {
  id: 'product-designer',
  icon: 'pencil-ruler',
  title: 'Product Designer',
  status: 'Active',
  location: 'Accra,  Ghana',
  type: 'Full-Time',
  age: 'Just now',
  totalApplicants: '0',
  awaiting: '0',
  avgMatch: '--',
  action: 'View Pipeline',
  isNew: true,
};

// JM-02 (10117:58656): the manage menu's note on a posting people have applied to.
export const DELETE_BLOCKED_NOTE = 'Not available once people have applied. Close it instead.';

// JM-09 / JM-11 / JM-13 toasts (10117:62145 / :62599 / :63053).
export const POSTING_TOASTS = {
  published: {
    tone: 'success',
    title: 'Success',
    message: 'Product Designer is live.Talent can now find it in Opportunities',
    actionLabel: 'View posting',
  },
  paused: {
    tone: 'warning',
    title: 'Warning - Applications paused for Senior UX Designer',
    message: 'Your pipeline is unchanged',
    actionLabel: 'Undo',
  },
  closed: {
    tone: 'success',
    title: 'Success - Senior UX Designer is closed',
    message: '72 applicants were sent a “role closed” message',
    actionLabel: 'Reopen',
  },
  deleted: {
    tone: 'success',
    title: 'Success - Draft deleted',
    message: 'DevOps Engineer',
    actionLabel: 'Undo',
  },
};
