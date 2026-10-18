/*
 * Profile accessibility copy — verbatim from Figma (file Bin8roWL8sloyc36IgFMuT).
 *   AX-01 popover "Accessibility panel" 8343:520316 (Playful frame 7590:1952 / Focused 8110:389972)
 *   AX-02 pills 7590:3379 (7590:2746 / 8110:390599), AX-03 pills 7590:4097… (7590:3461 / 8110:391217)
 */
export const A11Y_PANEL = {
  title: 'Accessibility',
  sticker: 'your way',
  sub: 'Make your profile easier to read, hear and share.',
  scope: [
    { id: 'everywhere', label: 'Everywhere' },
    { id: 'profile', label: 'On Profile' },
  ],
  rows: [
    {
      key: 'aloud',
      icon: 'vol',
      title: 'Read my profile aloud',
      sub: 'Hear it the way a screen reader does',
    },
    { key: 'size', icon: 'text', title: 'Profile text size', sub: 'Just this page' },
    {
      key: 'describe',
      icon: 'spark',
      title: 'Describe my images',
      sub: 'Buddy drafts image descriptions',
    },
    {
      key: 'calm',
      icon: 'cloud',
      title: 'Calm profile',
      sub: 'Hides stickers, doodles, tilt & motion',
      // the Focused frame (8110:389972) draws this row without a subtitle
      subPlayfulOnly: true,
    },
    {
      key: 'captions',
      icon: 'cc',
      title: 'Captions on pitches',
      sub: 'Captions + transcript on every video',
    },
    {
      key: 'oneColumn',
      icon: 'columns',
      title: 'One-column layout',
      sub: 'Bigger tap targets, no side rail',
    },
  ],
  note: 'These only change Profile and your share card. Other GTH settings stay the same.',
};

export const TEXT_SIZES = [
  { id: 'small', cls: 'text-[12px]' },
  { id: 'medium', cls: 'text-[13px]' },
  { id: 'large', cls: 'text-[15px]' },
];

export const A11Y_PILLS = {
  calm: 'Calm profile',
  large: 'Aa Large text',
  oneColumn: 'One column',
  change: 'Change in Accessibility',
  contrast: 'High contrast ON',
  links: 'U̲ Underline links',
  everywhere: 'Set in Accessibility › Everywhere',
};
