/*
 * resultsData — copy for the parent "Evaluate my child" flow, sections C-E (Figma file SCXc457vwiq6o7d9g4jVbh, canvas "Parent · 07 Evaluate my child" 10057:66837).
 * Mock only. Frames: PE-04 10034:149508 (submitted), PE-05 10034:150136 (ward reviewed), PE-05c 10052:4825 (moderation outcome modal), PE-05b 10052:4434 (published automatically), PE-06 10034:150815 (ward turned 18).
 */
export const SUBMITTED = {
  title: 'Thank you, Emma',
  pill: 'Submitted',
  sub: 'Your evaluation is with Abena. She’ll review it before it shows on her profile.',
  heading: 'Your key observations',
  observations: [
    {
      label: 'Strengths',
      text: 'Organised, reliable with deadlines, curious about how things work',
    },
    { label: 'Communication', text: 'Confident once prepared; shy with strangers' },
    { label: 'Interests', text: 'Computers, puzzles, helping younger cousins with homework' },
    { label: 'Your notes', text: '3 notes added' },
  ],
  next: 'Evaluate Elliot next',
  home: 'Back to Home',
};

export const OUTCOME_TITLE = 'Evaluate my child';

// kind: 'published' (check, "On profile") | 'review' (clock, "Under review"); `sub` is the grey line under the label.
export const REVIEWED = {
  chip: 'Abena reviewed your evaluation · 18 Oct',
  heading: '3 items published, 2 under review',
  body: 'Accepted items now show on her profile as “Parent evaluation”. 2 items are with our team because Abena flagged them. We don’t share her reasons, to protect her privacy. You’ll hear the outcome.',
  rows: [
    { id: 'strengths', label: 'Strengths', sub: 'Published', kind: 'published' },
    { id: 'interests', label: 'Interests', sub: 'Published', kind: 'published' },
    { id: 'study', label: 'Study habits', sub: 'Published', kind: 'published' },
    {
      id: 'review-1',
      label: 'Item under review',
      sub: 'Flagged by Abena · with moderation',
      kind: 'review',
    },
    {
      id: 'review-2',
      label: 'Item under review',
      sub: 'Flagged by Abena · with moderation',
      kind: 'review',
    },
  ],
};

export const AUTO = {
  chip: 'Published automatically · 25 Oct',
  heading: 'All 5 items are on Abena’s profile',
  body: 'Abena didn’t review within 7 days, so everything was published as you wrote it. She can still flag an item later.',
  rows: ['Strengths', 'Interests', 'Study habits', 'Communication', 'Career interests'].map(
    (l) => ({
      id: l,
      label: l,
      sub: 'Published',
      kind: 'published',
    })
  ),
};

export const MODERATION = {
  title: 'Our team reviewed 2 items',
  body: 'We checked the items Abena flagged. To protect her privacy, we don’t share her reasons.',
  rows: [
    { id: 1, label: 'Item 1', sub: 'Kept · now on her profile', kind: 'kept', chip: 'Published' },
    {
      id: 2,
      label: 'Item 2',
      sub: 'Removed · it didn’t match our evaluation rules',
      kind: 'removed',
      chip: 'Removed',
    },
  ],
  note: 'You can write a new evaluation for Abena any time.',
  done: 'Done',
  again: 'Evaluate again',
};

export const TURNED18 = {
  title: 'Abena turned 18',
  body: 'Parent evaluations are only for wards under 18. Abena now manages her own profile. She can still invite you to evaluate her, like any trusted person.',
  cta: 'Evaluate Elliot',
};
