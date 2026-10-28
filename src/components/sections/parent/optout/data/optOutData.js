/*
 * optOutData — copy and options of the parent "Opt out and restore" screens (Figma file SCXc457vwiq6o7d9g4jVbh, canvas "Parent · 05 Opt out and restore" 10057:1302).
 * Frames: PO-01 10033:5762 (opt-out dialog), PO-02 10034:143423 (ward opted out), PO-03 10034:144044 (restore dialog), PO-04 10052:3799 (access restored toast),
 * PH-03 10057:1591 (report a safety concern) and PH-03b 10057:1806 (report sent), the last two drawn over the Help and guides page (a later canvas).
 * Every string is verbatim from Figma `characters`; ward words (she / her / his…) come from the ward (wardsData), so Elliot reads correctly. ⚠️ ASSUMPTION marks text the frames do not draw.
 */

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
// she -> her, he -> him
const objective = (ward) => (ward.pronoun === 'she' ? 'her' : 'him');

export const OPT_OUT_REASONS = [
  { id: 'privacy', label: 'Privacy concerns' },
  { id: 'safety', label: 'Safety concerns' },
  { id: 'young', label: 'Too young' },
  { id: 'other', label: 'Other' },
];

export const REPORT_WORRIES = [
  { id: 'contacted', label: 'Someone contacted her' },
  { id: 'bullying', label: 'Bullying in a club' },
  { id: 'unsafe', label: 'Unsafe opportunity' },
  { id: 'other', label: 'Something else' },
];

// Mock report number of PH-03b (the frame draws one fixed number).
export const REPORT_REFERENCE = 'GTH-S-4821';
// Time the frames print in the paused banner (PO-02 / PO-03); a real opt-out prints the current time.
export const SEED_TIME = '15:20';

export const OPT_OUT_COPY = {
  optOut: {
    title: (w) => `Opt ${w.firstName} out of GTH?`,
    intro: (w) =>
      `${cap(w.pronoun)}’ll lose access straight away. ${cap(w.possessive)} data is kept, and you can restore access at any time.`,
    why: (w) => `Why are you opting ${objective(w)} out?`,
    note: 'Anything else? (optional)',
    noteHelp: 'Up to 500 characters. Only GTH safety staff see this.',
    ack: (w) => `I understand ${w.firstName} will be told ${w.possessive} access is paused.`,
    keep: 'Keep access',
    confirm: (w) => `Opt out ${w.firstName}`,
    noteMax: 500,
  },
  paused: {
    title: (w) => `${w.firstName}’s access is paused`,
    // PO-02: "Opted out by you today, 15:20 · reason: Safety concerns · her profile is hidden and her data is kept"
    sub: (w, time, reason) =>
      `Opted out by you today, ${time}${reason ? ` · reason: ${reason}` : ''} · ${w.possessive} profile is hidden and ${w.possessive} data is kept`,
    chip: 'Opted out',
    restore: 'Restore access',
    happensTitle: 'What happens now',
    happens: (w) => [
      `${w.firstName} can’t sign in. ${cap(w.pronoun)} got a message explaining access is paused.`,
      `Recruiters and clubs can’t see ${w.possessive} profile.`,
      `${cap(w.possessive)} profile, badges, Cycles and wallet balance are kept safely.`,
      `You can restore access whenever you’re ready. ${cap(w.pronoun)}’ll be told.`,
    ],
    safetyTitle: 'Worried about safety?',
    safetyText: 'Our safety team can look into a specific chat or person. It’s confidential.',
    report: 'Report a concern',
  },
  restore: {
    title: (w) => `Restore ${w.firstName}’s access?`,
    intro: 'Everything comes back as it was: profile, badges, Cycles and wallet.',
    note: (w) =>
      `${cap(w.pronoun)}’ll get a message that ${w.possessive} access is back. You can opt out again later.`,
    notNow: 'Not now',
    confirm: 'Restore access',
  },
  toast: {
    restored: (w) => ({
      message: `${w.firstName}’s access is back`,
      detail: `${cap(w.pronoun)}’s been told by SMS and in GTH. Everything is as ${w.pronoun} left it.`,
    }),
  },
  report: {
    title: 'Report a safety concern',
    intro:
      'Our safety team reads every report, usually within 2 hours. It’s confidential — nobody is told who reported.',
    who: 'Who is it about?',
    someoneElse: 'Someone else',
    worry: 'What’s worrying you?',
    more: 'Tell us more',
    moreHelp: 'We may contact you on WhatsApp',
    danger: 'If a child is in danger right now, call 112 (or 191 for the police) first.',
    cancel: 'Cancel',
    send: 'Send report',
  },
  sent: {
    title: (parent) => `Thank you, ${parent.firstName}. We’re on it.`,
    intro: (ref) =>
      `Our safety team will look at this within 2 hours and may message you on WhatsApp. Report number ${ref}.`,
    waitTitle: 'While you wait',
    wait: (w) =>
      `You can opt ${w.firstName} out right now if you feel it’s needed. ${cap(w.possessive)} data stays safe.`,
    optOut: (w) => `Opt ${w.firstName} out`,
    done: 'Done',
  },
};
