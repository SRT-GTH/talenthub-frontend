/*
 * Copy for the AX overlay frames, verbatim from Figma (Playful 7591:2279 / 7592:2619 / 7592:3287 / 7592:4005,
 * Focused 8110:391845 / 8110:394214 / 8110:394869 / 8110:395519).
 */

export const AX_RAIL_LABEL = 'Your progress';
export const AX_READING_NOW = 'Reading now';

/* AX-04 · read-aloud player + reading-order list */
export const AX_ALOUD = {
  now: 'Reading About · 2 of 9',
  quote: '“Final-year Statistics student who turns messy data…”',
  speed: '1×',
  order: {
    title: 'Reading order',
    // state: done = checked, now = playing (highlighted), todo = ○, private = lock
    items: [
      { key: 'name', label: 'Name, headline & photo description', state: 'done' },
      { key: 'about', label: 'About', state: 'now' },
      { key: 'skills', label: 'Top skills (4)', state: 'todo' },
      { key: 'experience', label: 'Experience (2)', state: 'todo' },
      { key: 'portfolio', label: 'Portfolio (3 images described)', state: 'todo' },
      { key: 'badges', label: 'Badges', state: 'todo' },
      { key: 'strength', label: 'Profile strength · only you hear this', state: 'private' },
    ],
    hint: 'Tab or ⇥ skips to the next section',
  },
};

/* AX-07a · keyboard focus order */
export const AX_FOCUS = {
  skip: 'Skip to profile content ↓',
  title: 'Keyboard focus order',
  lines: [
    '1  Skip link appears on first Tab, jumps to the hero name (h1).',
    '2  Sidebar nav: one Tab stop; ↑ ↓ move between items.',
    '3–6  Hero actions, then pitch, then photo.',
    '7  Tabs: one Tab stop; → switch, Home / End jump. role=tablist.',
    '8–11 Each card: links first, then the edit button (aria-label “Edit About”).',
    'Right rail comes after the main column.',
    'Focus ring: 3px Brand green + 2px white gap, never removed. Shown above on “Share profile”.',
  ],
};

/* AX-07b · landmarks & headings */
export const AX_LANDMARKS = {
  tags: {
    header: '<header> banner',
    nav: '<nav> “Main”',
    main: '<main> profile sections',
    aside: '<aside> “Your progress”',
    hero: '<section> h1 Kofi Agyekum',
  },
  headings: { about: 'h2 About', skills: 'h2 Top skills', strength: 'h2 Profile strength' },
  title: 'Screen reader map',
  lines: [
    'Landmarks: banner, nav “Main”, main, aside “Your progress”. The aside only exists on your own view.',
    'One h1 (your name). Each card is an h2; items inside are h3.',
    // Playful frame only: Focused (8110:395509) has no doodles / kente stripes, so the line is absent.
    {
      text: 'Decorative doodles, kente stripes and sticker tilt are aria-hidden.',
      playfulOnly: true,
    },
    'Avatar alt: “Kofi’s avatar: smiling, short hair, green shirt”.',
    'Badges read as “SQL Top 10 percent badge, earned Sep 2026”.',
    'Progress ring: role=progressbar, aria-valuenow=82, label “Profile strength”.',
    'Skill meters: “Data analytics, assessed, advanced, top 10 percent”.',
  ],
};

/* AX-08 · share modal notes + keyboard hint row */
export const AX_SHARE = {
  title: 'Dialog rules',
  lines: [
    'role=dialog, aria-modal, labelled by “Share your profile”.',
    'Focus opens on the link field; Tab is trapped inside.',
    'Esc or closes and returns focus to “Share profile”.',
    'Copy announces via aria-live=polite: “Link copied”.',
    'Channel tiles: one Tab stop, → to move (radio-style toolbar).',
    'Google switch: role=switch, aria-checked=false.',
    'All tap targets ≥ 44 × 44.',
  ],
  keys: [
    { key: 'tab', keys: ['Tab'], label: 'move' },
    { key: 'enter', keys: ['Enter'], label: 'copy / open' },
    { key: 'arrows', keys: ['arrow-left', '→'], label: 'channels' },
    { key: 'esc', keys: ['Esc'], label: 'close' },
  ],
};
