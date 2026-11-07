/*
 * Hiring-side data of the recruiter Settings tabs: Hiring preferences, Notifications, Plan and billing, Accessibility
 * (Figma "Recruiter - Settings & Account" 10161:75722: SR-08 10161:79955, SR-09 10161:80292, SR-10 10161:80671, SR-11 10161:81038, SR-12 10161:81376,
 * SR-15 10161:82009, SR-19 10161:83628, SR-21 10161:84249, SR-22 10161:84623). Copy is verbatim from the node `characters`; mock payloads shaped like a future API.
 *
 * URL KEYS (on /recruiter/settings, next to the lead's tab / modal / state):
 *   ?tab=hiring                                  SR-08 (the draft already holds the unsaved change the frame draws: "When a role closes" switched off)
 *   ?tab=hiring&modal=auto-message               SR-09 "When someone applies" editor  (+ &message=applied|forward|declined|closed, default applied)
 *   ?tab=hiring&toast=saved                      SR-15 "Success - Hiring preferences saved" (everything saved, no unsaved hint)
 *   ?hiring=paused  [&toast=hiring-paused]       SR-19 hiring paused: the banner on EVERY tab (HiringPausedBanner) + the "Hiring paused" toast (the Figma frame draws it over Language and data)
 *   ?tab=notifications                           SR-10
 *   ?tab=notifications&state=paused              SR-21 "Notifications paused until tomorrow, 9:00 AM"
 *   ?tab=billing                                 SR-11
 *   ?tab=accessibility                           SR-12
 *   ?tab=accessibility&state=unsaved             SR-22 (High contrast switched on, unsaved bar)
 */

/* ---------- shared footer / toasts ---------- */
export const FOOTER_COPY = {
  unsaved: 'You have unsaved changes',
  cancel: 'Cancel',
  save: 'Save changes',
  saved: 'Saved', // ⚠️ ASSUMPTION: the Notifications / Accessibility frames draw no saved feedback; this line only confirms a click on Save.
};

/* ---------- Hiring preferences (SR-08) ---------- */
export const HIRING_COPY = {
  defaults: {
    title: 'Defaults for new jobs',
    description: 'Pre-filled every time you create a job. You can change them per job.',
    location: 'Default location',
    screening: 'Default screening',
    pay: {
      title: 'Always show pay on postings',
      description: 'Recommended. You can still choose “Unpaid” or “Stipend”.',
    },
    profile: {
      title: 'Let talent apply with their GTH profile',
      description: 'No CV upload needed',
    },
    nss: {
      title: 'Hire NSS graduates and interns',
      description: 'Shows your company in NSS and internship searches',
    },
  },
  messages: {
    title: 'Automatic messages',
    description: 'Sent from your name. Candidates can reply.',
    edit: 'Edit',
  },
  goal: {
    title: 'Response goal',
    description: 'Shown to candidates as “Usually replies within…”',
    row: 'Reply to applicants within',
    average: 'Your average this month: 6 hours',
  },
  toast: {
    title: 'Success - Hiring preferences saved',
    message: 'New jobs will use these defaults',
  },
};

// ⚠️ ASSUMPTION: Figma draws one option per dropdown (the selected value). The other options are plausible mock values so the dropdowns can be operated.
export const LOCATION_OPTIONS = [
  'Accra, Greater Accra',
  'Kumasi, Ashanti',
  'Takoradi, Western',
  'Tamale, Northern',
  'Remote (Ghana)',
];
export const SCREENING_OPTIONS = [
  'Senior design screening',
  'Engineering screening',
  'Graduate screening',
  'No screening',
];
export const REPLY_WITHIN_OPTIONS = ['1 day', '2 days', '3 days', '1 week'];

/* The four automatic messages. `summary` is the drawn one-line preview; `text` is what the editor holds (only "applies" is drawn in full: SR-09).
   ⚠️ ASSUMPTION: the other three editors are not drawn; they reuse the SR-09 dialog with the row's own copy (`text` = the row preview without its quotes, `subtitle` written in the style of the drawn one). */
export const AUTO_MESSAGES = [
  {
    id: 'applied',
    title: 'When someone applies',
    summary: '“Thanks for applying to {job} at Silver Rock Technology…”',
    subtitle: 'Sent automatically, right after a candidate applies.',
    text: 'Hi {first name}, thanks for applying to {job} at Silver Rock Technology. We review every application and usually reply within 2 days. — {your name}',
    on: true,
  },
  {
    id: 'forward',
    title: 'When you move someone forward',
    summary: '“Good news — your application moved to {stage}.”',
    subtitle: 'Sent automatically, right after you move a candidate to the next stage.',
    text: 'Good news — your application moved to {stage}.',
    on: true,
  },
  {
    id: 'declined',
    title: 'When someone isn’t progressing',
    summary: '“Thank you for applying… we’ve decided to move forward with other candidates.”',
    subtitle: 'Sent automatically, right after you mark a candidate as not progressing.',
    text: 'Thank you for applying… we’ve decided to move forward with other candidates.',
    on: true,
  },
  {
    id: 'closed',
    title: 'When a role closes',
    summary: '“{job} is now closed. Thank you for your interest.”',
    subtitle: 'Sent automatically, right after a role you posted closes.',
    text: '{job} is now closed. Thank you for your interest.',
    on: true,
  },
];

export const AUTO_MESSAGE_DIALOG = {
  messageLabel: 'Message',
  maxLength: 600,
  // Figma inconsistency NOT reproduced: SR-09 draws the counter "152 / 600" under a 147-character text; the counter here is the real length (147 / 600).
  insert: 'Insert',
  tokens: ['{first name}', '{job}', '{stage}', '{your name}', '{company}'],
  // ⚠️ ASSUMPTION: {stage} and {company} are not used in the drawn preview; the sample for {stage} is invented (the others are the SR-09 preview's).
  sample: {
    '{first name}': 'Ama',
    '{job}': 'Senior UX Designer',
    '{stage}': 'Interview',
    '{your name}': 'Joel',
    '{company}': 'Silver Rock Technology',
  },
  preview: 'PREVIEW · AS AMA SEES IT',
  reset: 'Reset to default',
  cancel: 'Cancel',
  save: 'Save message',
};

/* The unsaved baseline of SR-08: everything on. The draft the frame draws has "When a role closes" off (see HiringTab). */
export const HIRING_DEFAULTS = {
  location: 'Accra, Greater Accra',
  screening: 'Senior design screening',
  showPay: true,
  applyWithProfile: true,
  hireNss: true,
  replyWithin: '2 days',
  messages: Object.fromEntries(
    AUTO_MESSAGES.map((m) => [m.id, { on: m.on, text: m.text, edited: false }])
  ),
};

/* ---------- Hiring paused (SR-19) ---------- */
export const HIRING_PAUSED = {
  title: 'Hiring is paused at Silver Rock Technology',
  body: 'Your 2 live jobs are hidden from Opportunities. Pipelines and messages keep working.',
  resume: 'Resume hiring',
  toast: { title: 'Success - Hiring paused', message: '2 jobs hidden from talent', undo: 'Undo' },
};

/* ---------- Notifications (SR-10, SR-21) ---------- */
export const NOTIFICATIONS_COPY = {
  matrix: { title: 'What we tell you about', description: 'Choose where each notification goes.' },
  channels: ['In app', 'Email', 'SMS'],
  quiet: {
    title: 'Quiet hours',
    description: 'No SMS or push between these times.',
    row: 'Quiet hours',
    range: '9:00 PM – 7:00 AM',
  },
  paused: {
    title: 'Notifications paused until tomorrow, 9:00 AM',
    body: 'Interview reminders still come through.',
    resume: 'Resume now',
  },
  // ⚠️ ASSUMPTION: no control that pauses notifications is drawn in the recruiter frames (the talent page has the link "Turn everything off for 24 hours" under the cards);
  // this link, bottom left of the footer, is the way into SR-21 by clicking.
  pauseLink: 'Pause for 24 hours',
};

// Order = In app, Email, SMS. Values are the drawn switches.
export const NOTIFICATION_ROWS = [
  {
    id: 'new-applicants',
    title: 'New applicants',
    description: 'Each time someone applies to your jobs',
    on: [true, true, false],
  },
  {
    id: 'messages',
    title: 'Messages from candidates',
    description: 'Replies and new conversations',
    on: [true, true, true],
  },
  {
    id: 'interviews',
    title: 'Interview reminders',
    description: '1 hour before each interview',
    on: [true, true, true],
  },
  {
    id: 'offers',
    title: 'Offer responses',
    description: 'When a candidate accepts or declines',
    on: [true, true, true],
  },
  {
    id: 'closing',
    title: 'Jobs closing soon',
    description: '2 days before a deadline',
    on: [true, false, false],
  },
  {
    id: 'digest',
    title: 'Daily hiring digest',
    description: 'A summary at 8:00 AM',
    on: [false, true, false],
  },
  {
    id: 'streak',
    title: 'Hiring streak reminders',
    description: 'If your streak is at risk',
    on: [true, false, false],
  },
];

/* ---------- Plan and billing (SR-11) ---------- */
// Mock payload shaped like GET /recruiter/billing. Usage bar width = used / limit; `tone` is the drawn bar colour (amber for invites).
export const BILLING = {
  plan: {
    name: 'Professional',
    renews: 'Renews 1 Nov 2026',
    price: 'GHS 450 / month · billed monthly',
    compare: 'Compare plans',
    upgrade: 'Upgrade',
  },
  usage: [
    {
      id: 'job-posts',
      label: 'Job posts',
      used: 3,
      limit: 20,
      note: 'This billing period',
      tone: 'green',
    },
    {
      id: 'invites',
      label: 'Invites (InMails)',
      used: 33,
      limit: 50,
      note: 'Resets on 1 Nov',
      tone: 'amber',
    },
    {
      id: 'seats',
      label: 'Team seats',
      used: 5,
      limit: 10,
      note: 'This billing period',
      tone: 'green',
    },
  ],
  payment: {
    title: 'Payment method',
    method: 'MTN Mobile Money · •••• 4521',
    holder: 'Kwame Asante',
    badge: 'Default',
    change: 'Change',
  },
  invoices: {
    title: 'Invoices',
    download: 'Download',
    // `paidColor` is drawn differently on the 2nd invoice (#165d3a, the others #2a5730): Figma inconsistency kept as drawn.
    rows: [
      {
        id: 'inv-2026-10',
        date: '1 Oct 2026',
        plan: 'Professional plan · ',
        status: 'Paid',
        amount: 'GHS 450.00',
        paidColor: '#2a5730',
      },
      {
        id: 'inv-2026-09',
        date: '1 Sep 2026',
        plan: 'Professional plan · ',
        status: 'Paid',
        amount: 'GHS 450.00',
        paidColor: '#165d3a',
      },
      {
        id: 'inv-2026-08',
        date: '1 Aug 2026',
        plan: 'Professional plan · ',
        status: 'Paid',
        amount: 'GHS 450.00',
        paidColor: '#2a5730',
      },
    ],
  },
};

/* ---------- Accessibility (SR-12, SR-22) ---------- */
export const A11Y_COPY = {
  banner: {
    title: 'Recruiter accounts always use Focused mode',
    body: 'A calm, information-dense layout built for reviewing candidates. Playful mode is only available to talent.',
  },
  reading: { title: 'Reading and display' },
  textSize: {
    title: 'Text size',
    description: 'Applies everywhere on GTH',
    options: ['Default', 'Large', 'Extra large'],
  },
  support: { title: 'Reading support' },
};

export const A11Y_TOGGLES = {
  reading: [
    { id: 'contrast', title: 'High contrast', description: 'Stronger borders and text' },
    {
      id: 'motion',
      title: 'Reduce motion',
      description: 'Turns off animations and the streak flame',
    },
    {
      id: 'dyslexia',
      title: 'Dyslexia-friendly font',
      description: 'Uses a clearer typeface for long text',
    },
  ],
  support: [
    {
      id: 'aloud',
      title: 'Read messages aloud',
      description: 'Adds a play button to candidate messages',
    },
    {
      id: 'shortcuts',
      title: 'Keyboard shortcuts',
      description: 'Press ? to see them · J/K to move between candidates',
    },
  ],
};

export const A11Y_DEFAULTS = {
  textSize: 'Default',
  contrast: false,
  motion: false,
  dyslexia: false,
  aloud: true,
  shortcuts: true,
};
