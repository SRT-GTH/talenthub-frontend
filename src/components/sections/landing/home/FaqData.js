/* S9 FAQ copy — verbatim from Figma 7797:14848 (desktop) / 7815:271425 (tablet) / 7815:279242 (mobile). */

export const FAQ_HEAD = {
  chip: 'FAQ',
  title: 'Questions? We’ve got you.',
};

/* Answers are the hidden "expanded" content of each LP · FAQ item instance (Figma 7797:14853 → variants 7797:15841 closed / 7797:15847 open). */
export const FAQ_ITEMS = [
  {
    id: 'free',
    question: 'Is GTH really free for students?',
    answer:
      'Yes. Students and graduates never pay to build a profile, take assessments, use Career Buddy or apply to roles. Companies pay to hire.',
  },
  {
    id: 'cv',
    question: 'Do I need a CV to start?',
    answer:
      'No. Your 9 profile stages build something better than a CV, and you can add a CV later if you have one.',
  },
  {
    id: 'time',
    question: 'How long does the profile take?',
    answer:
      'About 20 minutes in total, in short stages that save on their own. You become Discoverable after the first three.',
  },
  {
    id: 'privacy',
    question: 'Who can see my profile?',
    answer:
      'Only verified recruiters, once you reach Discoverable. You choose what’s shown and can hide from your current employer.',
  },
  {
    id: 'under18',
    question: 'I’m under 18. Can I join?',
    answer:
      'Yes. A parent or guardian links to your account and approves matches before any recruiter can contact you.',
  },
  {
    id: 'phone',
    question: 'Does it work on my phone and slow data?',
    answer: 'Yes. GTH is built for phones and 3G, and everything saves as you go.',
  },
];

export const FAQ_DEFAULT_OPEN = 'free';

export const FAQ_HELP = {
  lead: 'Still stuck?',
  link: 'Ask Career Buddy or email info@ghanatalenthub.com',
};
