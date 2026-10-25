/*
 * adminMergeData — copy of the Merge accounts screens (Figma canvas 8520:12, 7.1.5a "Merge duplicates" 8625:6980, 7.1.5b "Merge blocked" 8625:7534,
 * 7.1.5c "Merge minors: choose parent link" 8666:10792). ⚠️ ASSUMPTION: frontend only; `fill` is the bar under a value (share of the track, copied from the
 * Figma bar widths: the bars are decoration, they carry no data).
 */

export const PRIMARY_ID = 'TAL-118-2093';
export const SECONDARY_ID = 'TAL-311-0442';

export const MERGE = {
  adults: {
    sub: 'Two accounts share one Ghana Card. Pick the value to keep for each field. The secondary account closes as MERGED.',
    rows: [
      { field: 'Full name', a: 'Kwesi Owusu', b: 'Kwesi K. Owusu', fa: 1, fb: 0.938 },
      { field: 'Email', a: 'k•••@gmail.com', b: 'k•••@yahoo.com', fa: 0.773, fb: 1 },
      { field: 'Ghana Card', a: 'GHA-•••••••••-7', b: 'GHA-•••••••••-7', fa: 1, fb: 0.98 },
      { field: 'Phone', a: '+233 •• ••• 1180', b: '—', fa: 1, fb: 0.82 },
      { field: 'Assessments', a: '3 completed', b: '0', fa: 1, fb: 0.621 },
    ],
  },
  minors: {
    sub: 'Both accounts belong to a 16-year-old and each has a parent link. Pick the one to keep. Both parents are told about the merge.',
    rows: [
      { field: 'Full name', a: 'Ama Boateng', b: 'Ama A. Boateng', fa: 1, fb: 0.938 },
      { field: 'Email', a: 'k•••@gmail.com', b: 'k•••@yahoo.com', fa: 0.773, fb: 1 },
      { field: 'Ghana Card', a: 'GHA-•••••••••-7', b: 'GHA-•••••••••-7', fa: 1, fb: 0.98 },
      {
        field: 'Parent link',
        a: 'Mrs Efua Boateng · mother',
        b: 'Mr Kofi Boateng · father',
        fa: 1,
        fb: 0.82,
      },
      { field: 'Parent consent', a: 'Given 2 Sep 2026', b: 'Given 4 Oct 2026', fa: 1, fb: 0.621 },
    ],
  },
};

export const BLOCKED = {
  title: 'These accounts can’t be merged yet',
  body: 'Both accounts have a wallet balance. Ask Finance to settle the wallets first, then try again.',
  primary: 'Message Finance',
  secondary: 'Close',
};

export const PARENT = {
  title: 'Which parent link should stay?',
  body: 'The other parent is told and can ask support to be linked again. Both parents get a copy of the merge notice.',
  label: 'Parent link to keep',
  options: ['Mrs Efua Boateng · mother', 'Mr Kofi Boateng · father'],
  primary: 'Keep this link and merge',
  secondary: 'Cancel',
};
