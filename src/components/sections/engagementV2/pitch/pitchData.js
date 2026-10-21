/*
 * Pitch stage — mock data and copy (Figma canvas 3125:10352, section Pitch: Playful 5625:92950 / Focused 8285:20481).
 * All strings are verbatim from the node `characters`. Mock, API-shaped: swap for the real endpoints later.
 */

export const PITCH_HERO = {
  default: {
    eyebrow: 'PITCH',
    title: ['Your ', '60-second story.'],
    stars: [562, 588],
    stickerShift: -1,
    body: 'The last stage. Record a short video, upload one from your phone, or write four sentences. Any of the three works.',
  },
  review: {
    eyebrow: 'PITCH',
    title: ['Last look, then ', 'you’re live.'],
    stars: [654, 680],
    stickerShift: -33,
    body: 'This is how recruiters will see your pitch on your profile. You can replace it any time.',
  },
};

/* Hero sticker per screen (Playful only). */
export const PITCH_STICKERS = {
  choose: 'FINAL STAGE',
  record: 'FINAL STAGE',
  upload: 'FINAL STAGE',
  uploadReady: 'LOOKING GOOD',
  write: '4 SENTENCES',
  review: 'ALMOST THERE',
};

export const PITCH_HERO_CARD = {
  title: 'What to say in 60 seconds',
  rows: [
    { icon: 'user', title: 'Who you are', sub: 'Your name and what you do' },
    { icon: 'star', title: 'One thing you built', sub: 'With a result if you can' },
    { icon: 'target', title: 'What you want next', sub: 'Role, place, timing' },
  ],
};

export const PITCH_METHODS = [
  {
    id: 'record',
    icon: 'video',
    title: 'Record a video',
    body: 'Use your laptop camera. Takes about 2 minutes.',
    chip: 'Up to 60 seconds',
    cta: 'Start recording',
    sticker: 'MOST MESSAGES',
  },
  {
    id: 'upload',
    icon: 'upload',
    title: 'Upload a video',
    body: 'Recorded on your phone? Drop it in.',
    chip: 'MP4, MOV, WebM · 100 MB',
    cta: 'Upload',
  },
  {
    id: 'write',
    icon: 'text',
    title: 'Write it',
    body: 'Four sentences, about 80 words. Easiest start.',
    chip: '40–150 words',
    cta: 'Start writing',
  },
];

export const PITCH_PICK_LABEL = 'PICK HOW YOU WANT TO PITCH';

export const PITCH_EXAMPLE = {
  chip: 'Example',
  title: 'A written pitch that works',
  text: '“Hi, I’m Kofi, a frontend developer from Accra. My strongest skill is React, and I’ve built production apps with it for two years. I built Accra Bus Tracker, a real-time transport app used by 200+ commuters in the KNUST pilot. I’m looking for a fintech engineering role in Accra, starting within six months.”',
};

export const PITCH_WRITTEN_SAMPLE =
  'Hi, I’m Kofi, a frontend developer from Accra. My strongest skill is React, and I’ve built production apps with it for two years. I built Accra Bus Tracker, a real-time transport app used by 200+ commuters in the KNUST pilot. I’m looking for a fintech engineering role in Accra, starting within six months.';

export const PITCH_TABS = [
  { id: 'record', label: 'Record', icon: 'video' },
  { id: 'upload', label: 'Upload', icon: 'upload' },
  { id: 'write', label: 'Write', icon: 'text' },
];

export const PITCH_FORMULA = {
  title: 'The 4-sentence formula',
  rows: [
    {
      icon: 'user',
      title: '1. Who you are',
      sub: 'Hi, I’m Kofi, a frontend developer from Accra.',
    },
    {
      icon: 'bolt',
      title: '2. Your top skill',
      sub: 'My strongest skill is React, two years in production.',
    },
    {
      icon: 'star',
      title: '3. One thing you built',
      sub: 'I built Accra Bus Tracker, used by 200+ commuters.',
    },
    {
      icon: 'target',
      title: '4. What you want',
      sub: 'I’m looking for a fintech engineering role in Accra.',
    },
  ],
};

export const PITCH_NO_PRESSURE = {
  title: 'No pressure',
  rows: [
    {
      icon: 'refresh',
      title: 'Unlimited takes',
      sub: 'Only the one you publish counts. Replace it any time.',
    },
  ],
};

export const PITCH_TRIM = {
  title: 'Trim it first',
  rows: [
    { icon: 'camera', title: 'iPhone', sub: 'Photos, Edit, then drag the yellow handles.' },
    { icon: 'file', title: 'Android', sub: 'Gallery, Edit, Trim, then save as a new clip.' },
  ],
};

export const PITCH_RECRUITERS = {
  title: 'What recruiters see',
  rows: [
    { icon: 'play', title: 'Your pitch', sub: 'Plays on your profile header' },
    { icon: 'eye', title: 'Who can view', sub: 'Verified recruiters only' },
    { icon: 'refresh', title: 'Replace any time', sub: 'Your old pitch is removed' },
  ],
};

export const PITCH_CAMERA = {
  permissionTitle: 'Let GTH use your camera',
  permissionBody:
    'Your browser will ask for permission. Nothing is recorded until you press Record, and raw video is never stored on this device.',
  allow: 'Allow camera',
  trouble: 'Having trouble? Upload a video instead',
  rec: 'REC 0:42',
  left: '18 seconds left',
  cueLabel: 'NOW: WHAT YOU WANT NEXT',
  cue: '“I’m looking for a fintech engineering role in Accra…”',
};

/* Live checklist chips on the recording screen (done = green). */
export const PITCH_CHECKLIST = [
  { label: 'Name', done: true },
  { label: 'Top skill', done: true },
  { label: 'One project', done: true },
  { label: 'What you want', done: false },
];

export const PITCH_UPLOAD = {
  dropTitle: 'Drop your pitch video here',
  dropSub: 'or browse to choose a file',
  formats: ['MP4', 'MOV', 'WebM', 'Up to 100 MB', 'Max 60 s'],
  browse: 'Browse files',
  waysLabel: 'GETTING THE VIDEO OFF YOUR PHONE',
  ways: [
    {
      icon: 'chat',
      title: 'WhatsApp to yourself',
      sub: 'Send it to your own chat, then download it on WhatsApp Web.',
    },
    {
      icon: 'bell',
      title: 'Email it to yourself',
      sub: 'Download the attachment and drop it here.',
    },
    { icon: 'camera', title: 'iPhone to Mac', sub: 'AirDrop it, then drag it in.' },
    { icon: 'file', title: 'Android to PC', sub: 'Copy it from the DCIM folder over USB.' },
  ],
};

/* Mock uploaded / recorded video file. */
export const PITCH_FILE = {
  name: 'pitch_kofi_accra.mp4',
  meta: '18.4 MB · 0:54 · 1080p',
  chips: ['Under 60 s', 'Under 100 MB', 'Sound detected'],
  replace: 'Replace',
};

export const PITCH_SELF_CHECK = {
  title: 'Quick self-check before you publish',
  rows: [
    { done: true, title: 'You say your name and what you do' },
    {
      done: true,
      title: 'You mention one skill and one project',
      sub: 'Accra Bus Tracker, React',
    },
    { done: true, title: 'You say what role you want next' },
    {
      done: false,
      title: 'Good light on your face',
      sub: 'Optional, but recruiters notice',
    },
  ],
};

export const PITCH_WRITE = {
  label: 'Your written pitch',
  words: '53 words',
  wordsPct: 296 / 838,
  sweet: 'Sweet spot: 40–150',
  formula: 'Formula',
  parts: ['Who you are', 'Top skill', 'One project', 'What you want'],
  sticker: 'NAILED IT',
};

export const PITCH_READY = {
  title: 'Ready to publish',
  rows: [
    { title: 'Pitch is under 60 seconds', sub: '0:54' },
    { title: 'All four parts covered', sub: 'Who, skill, project, what next' },
    { title: 'Profile stages 1 to 8 complete', sub: 'Avatar to Goals' },
    { title: 'Visible to verified recruiters only', sub: 'Change this in Privacy settings' },
  ],
  after: {
    title: 'Publish to hit 100% and unlock Top Talent',
    sub: 'Profiles with a pitch show up first in recruiter search.',
  },
};

export const PITCH_FOOTER = {
  back: 'Back: Goals',
  backEdit: 'Back: Edit pitch',
  skip: 'Skip for now',
  review: 'Review and publish',
  publish: 'Publish pitch',
};

export const PITCH_COMPLETE = {
  sticker: 'STAGE 9 DONE',
  eyebrow: 'STAGE 9 OF 9 COMPLETE',
  title: ['You’re a ', 'Top Talent.'],
  body: 'Nine of nine stages done. Your profile is 100% and live for recruiters across Ghana.',
  stats: [
    { value: '9/9', label: 'STAGES DONE' },
    { value: '100%', label: 'PROFILE' },
    { value: '+150 XP', valueFocused: '+150 pts', label: 'EARNED' },
  ],
  unlockedLabel: 'WHAT YOU JUST UNLOCKED',
  unlocked: [
    { icon: 'trend', title: 'Top of recruiter search', sub: 'Profiles with a pitch show up first' },
    { icon: 'chat', title: 'Recruiter messages', sub: 'Verified recruiters can now reach you' },
    { icon: 'star', title: 'Top Talent badge', sub: 'Shown on your profile and in search' },
  ],
  watch: 'Watch my pitch',
  milestone: 'See your milestone',
};

export const PITCH_DELETE = {
  chip: 'Delete pitch',
  title: 'Delete this pitch?',
  body: 'It disappears from your profile straight away. This can’t be undone.',
  fileMeta: 'Video · 0:54 · published today',
  whatLabel: 'WHAT HAPPENS',
  effects: [
    'Your profile drops from 100% to 89%',
    'You lose the Top Talent badge until you add a new one',
    'Recruiters stop seeing a video on your profile',
  ],
  editTitle: 'Just need to fix something?',
  editBody: 'Replace it with a new take and keep your badge the whole time.',
  replace: 'Replace instead',
  confirm: 'Delete pitch',
};
