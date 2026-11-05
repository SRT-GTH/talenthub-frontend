import { CORE_CONTENT, HERO } from './talentHomeCoreData.js';

/*
 * emmaPersona — the talent home of Emma Mensah, a parent who is also a talent (Figma Parents file SCXc457vwiq6o7d9g4jVbh, canvas "Parent · 12 Parent who is also a talent" 10057:67476,
 * frames TC-01 10036:531 and TC-02 10036:142934). `/home?as=emma` renders the Discoverable home (HM-02) with her details instead of Kofi's: the page copy (`EMMA_CONTENT`), the sidebar
 * card / nav labels / public link, the top bar ("My career" chip, name, streak) and the "You’re in My career" banner. Everything is mock data, selected by the URL like the other demo states;
 * Kofi's home and the live data path are untouched. Strings are verbatim from the Figma `characters`.
 */
export const EMMA = {
  profile: {
    name: 'Emma Mensah',
    firstName: 'Emma',
    headline: 'Banking to data analytics · Accra',
    url: 'gth.com/talent/emma-mensah',
    navName: 'Emma M.',
  },
  // TC-01's sidebar says "Opportunities" and "Clubs" where Kofi's says "Job Postings" and "Community".
  labels: { opportunities: 'Opportunities', community: 'Clubs' },
  nav: { streakCount: '1' },
  chip: 'My career',
  switchLink: 'Parent view · 4 to review →',
  parentChip: '4 to review',
  banner: {
    title: 'You’re in My career',
    body: 'Your wards and their data stay in Parent view. They can’t see this space.',
    back: 'Back to Parent view',
  },
};

const base = CORE_CONTENT.discoverable;

export const EMMA_CONTENT = {
  ...base,
  hero: { ...HERO.discoverable, headline: [['You’re '], ['Discoverable,', true], [' Emma.']] },
  matches: {
    ...base.matches,
    cards: [
      {
        id: 'jda',
        company: 'hubtel',
        title: 'Junior Data Analyst',
        meta: 'Ecobank · Accra · Hybrid',
        salary: 'GHS 7–10k',
        featured: true,
      },
      {
        id: 'cra',
        company: 'zeepay',
        title: 'Credit Risk Analyst',
        meta: 'Fidelity Bank · Accra · On-site',
        salary: 'GHS 9–12k',
      },
      {
        id: 'da',
        company: 'farmerline',
        title: 'Data Analyst (part-time)',
        meta: 'mPharma · Remote · Ghana',
        salary: 'GHS 4–6k',
      },
    ],
  },
  buddy: {
    ...base.buddy,
    message:
      'Recruiters filter by projects. Add your loan-default dashboard from Power BI Basics, with a screenshot.',
  },
};
