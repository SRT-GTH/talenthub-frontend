import avatarA from '../../../../assets/landing/student-avatar-a.webp';
import avatarB from '../../../../assets/landing/student-avatar-b.webp';
import avatarC from '../../../../assets/landing/student-avatar-c.webp';
import avatarD from '../../../../assets/landing/student-avatar-d.webp';

/* Coming Soon copy — verbatim from Figma CS-01 7797:15854 / CS-02 7797:17223 / CS-03 7797:18587 (curly quotes kept). */

/* ⚠️ naming mine: state is driven by `?state=default|joined|error`. */
export const CS_STATES = ['default', 'joined', 'error'];

export const CS_COPY = {
  topChip: 'Coming soon · 2026',
  steps: ['Register', 'Get assessed', 'Get matched'],
  heading: 'Your talent.\nDiscovered. Connected. Grown.',
  sub: 'The platform that helps every Ghanaian student and graduate get discovered by the right opportunities.',
  rolePrompt: 'I’m a',
  roles: ['Student or graduate', 'Parent', 'School'],
  emailPlaceholder: 'Your email address',
  cta: 'Notify me',
  trust: '12,000+ early sign-ups · no spam, one email at launch',
  perksLabel: 'Join early, get:',
  perks: ['Founding Talent badge', '2x XP in launch week', 'First look at new roles'],
  sticker: 'LAUNCHING 2026',
};

/* CS-03 (error): the field shows what was typed — Figma sample "kofi@gmail". */
export const CS_SAMPLE_EMAIL_ERROR = 'kofi@gmail';
export const CS_ERROR_TEXT = 'That email looks incomplete. Try kofi@gmail.com';

/* CS-02 (joined): Figma sample is "Kofi" / kofi@… ; with a real submit the name and email come from the typed address. */
export const CS_SAMPLE_NAME = 'Kofi';
export const CS_SAMPLE_LOCAL = 'kofi';
export const CS_JOINED = {
  shareLink: 'gth.com/join/kofi-k7',
  copy: 'Copy link',
  share: ['WhatsApp', 'Instagram', 'X', 'Snapchat'],
  sticker: '+50 SPOTS PER FRIEND',
};

export const CS_AVATARS = [avatarA, avatarB, avatarC, avatarD];

export const CS_PROGRESS = {
  label: 'Launch progress',
  items: [
    { label: 'Schools onboarded', value: 412, total: 500 },
    { label: 'Partner companies', value: 250, total: 300 },
    { label: 'Regions live', value: 12, total: 16 },
  ],
};

export const CS_PARTNERS = [
  'MTN Ghana',
  'GCB Bank',
  'Unilever Ghana',
  'Ghana Education Service',
  'KNUST',
  'University of Ghana',
  'Hubtel',
];

/* Floating product cards (desktop corners / tablet peek row). */
export const CS_FLOATS = {
  match: {
    title: 'Frontend Engineer',
    meta: 'Hubtel · Accra',
    pct: '96%',
    pctLabel: 'match for you',
    fill: 215 / 224,
  },
  streak: { title: '12-day streak', meta: '+90 XP this week' },
  buddy: { text: 'Akwaaba! Want me to find roles that fit you?' },
  recruiter: { text: 'Ama from Hubtel viewed your profile' },
};

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
