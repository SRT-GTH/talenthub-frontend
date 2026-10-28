/*
 * helpData — copy and topics of the parent "Help and guides" page (drawn behind PH-03 / PH-03b of Figma file SCXc457vwiq6o7d9g4jVbh, canvas "Parent · 05 Opt out and restore" 10057:1302; PH-03 10057:1591).
 * Every string is verbatim from Figma `characters`. The six topic cards and the contact card are the page; the report dialogs are parent/optout. ⚠️ ASSUMPTION marks text the frame does not draw.
 */
import spotPrivacy from '../../../../../assets/parent/spot-privacy.svg';
import spotCalendar from '../../../../../assets/parent/spot-calendar.svg';
import spotProfile from '../../../../../assets/parent/help-spot-profile.svg';
import spotCertificate from '../../../../../assets/parent/help-spot-certificate.svg';
import spotEvaluations from '../../../../../assets/parent/help-spot-evaluations.svg';
import spotSalary from '../../../../../assets/parent/help-spot-salary.svg';
import spotChats from '../../../../../assets/parent/help-spot-chats.svg';

export const HELP_COPY = {
  title: 'Help and guides',
  subtitle:
    'Short answers to what parents ask most. Still stuck? We reply on WhatsApp within a day.',
  searchLabel: 'Search help',
  // Figma draws this text inside the field in the filled style; it reads as a hint, so it is the placeholder.
  searchHint: 'Try “opt out” or “payment limit”',
  // ⚠️ ASSUMPTION: the frame draws no empty-search state.
  noMatch: 'No topics match your search.',
  contact: {
    title: 'Talk to the GTH parent team',
    text: 'WhatsApp +233 30 000 0000 · Mon–Sat, 8:00–18:00. For safety worries, use “Report a concern” any time.',
    whatsapp: 'Chat on WhatsApp',
    report: 'Report a concern',
    art: spotChats,
  },
};

export const HELP_TOPICS = [
  {
    id: 'opting-out',
    title: 'Opting out and privacy',
    text: 'What opt-out does, what’s kept, and how to restore access.',
    art: spotPrivacy,
  },
  {
    id: 'flagging',
    title: 'Flagging your ward’s profile',
    text: 'You flag, they fix. Why parents can’t edit.',
    art: spotProfile,
  },
  {
    id: 'certificates',
    title: 'Approving certificates',
    text: 'Why uploads wait for you and what to check.',
    art: spotCertificate,
  },
  {
    id: 'evaluating',
    title: 'Evaluating your child',
    text: '20 questions, autosave, and what your ward sees.',
    art: spotEvaluations,
  },
  {
    id: 'wallets',
    title: 'Starter wallets and limits',
    text: 'Payments over your limit, Cycles, and withdrawals at 18.',
    art: spotSalary,
  },
  {
    id: 'turns-18',
    title: 'When your ward turns 18',
    text: 'What changes and how to stay a trusted contact.',
    art: spotCalendar,
  },
];
