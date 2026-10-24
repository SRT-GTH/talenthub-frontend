import portraitAkosua from '../../../../../assets/public-data/showcase/portrait-akosua.jpg';
import portraitKofi from '../../../../../assets/public-data/showcase/portrait-kofi.jpg';
import portraitEfua from '../../../../../assets/public-data/showcase/portrait-efua.jpg';
import portraitYaw from '../../../../../assets/public-data/showcase/portrait-yaw.jpg';
import portraitAdwoa from '../../../../../assets/public-data/showcase/portrait-adwoa.jpg';
import pieceTrotro from '../../../../../assets/public-data/outcomes/story-data-internship-tamale.jpg';
import pieceLibrary from '../../../../../assets/public-data/outcomes/story-nursing-scholarship-volta.jpg';
import pieceBrand from '../../../../../assets/public-data/outcomes/story-solar-apprenticeship-ashanti.jpg';

/*
 * showcaseData — mock of GET /public/showcase (Theme 8, 8.4 Talent showcase). SAMPLE DATA: every profile below is a sample (Figma canvas
 * 8477:209484 marks all figures and people as sample content).
 *
 * Shape (the future API contract):
 *   { consent: { headline, summary, collapsedToggle, expandedToggle, points: [{ id, title, body }], mobileLabel, gridBadge },
 *     profiles: [{ id, name, region, education, age, aspiration, tagline, interests[], joinedLabel,
 *                  skillsVerified, gamesPassed,                      // the talent's OWN profile stats (not group counts)
 *                  skills[{ id, name, detail, evidence }],           // evidence: assessment | certificate | skillsLab | endorsed
 *                  personality{ type, blurb }, games[], portfolio[{ id, title, image }], photo }] }
 * Privacy: only consented fields are present. There is NO contact field of any kind (no email, phone, social link, address, exact
 * birthday): the API never sends them, so no component can render them.
 * ⚠️ ASSUMPTION: the "skills verified" / "games passed" tiles are one talent's own profile numbers (3, 5, 2 ...), not aggregated talent
 * counts, so the "<5" suppression rule (which protects groups) does not apply to them; they are printed as drawn. Group counts on these pages
 * (none today) would go through formatCount().
 */

/* --- consent ------------------------------------------------------------------------------------------------------------------------ */
export const SHOWCASE_CONSENT = {
  headline: 'Showcase profile, displayed with consent.',
  summary: 'One of 5 curated examples. Contact details are never shown.',
  collapsedToggle: 'How consent works ▾',
  expandedToggle: 'Hide details ▴',
  mobileLabel: 'Showcase profile · shown with consent',
  gridBadge: 'All 5 profiles shown with written consent',
  points: [
    {
      id: 'chosen',
      title: 'Chosen, not scraped',
      body: 'GTH staff invite a small number of talents to be showcased. Nobody appears here automatically.',
    },
    {
      id: 'written',
      title: 'Written consent',
      body: 'Each talent signs a showcase consent (a parent or guardian signs too if under 18) and approves exactly what is shown.',
    },
    {
      id: 'withdraw',
      title: 'Easy to withdraw',
      body: 'A talent can remove their showcase profile at any time from Settings; it disappears within 24 hours.',
    },
  ],
};

/* --- grid overview copy ------------------------------------------------------------------------------------------------------------- */
export const SHOWCASE_GRID_COPY = {
  title: 'Talent showcase',
  subtitle:
    'A small, curated sample of real GTH talents who chose to be featured. Everyone else stays anonymous.',
  whyTitle: 'Why only five?',
  whyBody:
    'The public site never lists talents. These profiles exist to show what a GTH profile contains. Partners search the full, consented talent pool after verification.',
  whyCta: 'Partner sign-up →',
};

/* --- profiles ----------------------------------------------------------------------------------------------------------------------- */
const profile = (p) => p;

export const SHOWCASE_PROFILES = [
  profile({
    id: 'akosua-o',
    name: 'Akosua O.',
    firstName: 'Akosua',
    photo: portraitAkosua,
    region: 'Volta',
    education: 'In-tertiary · Nursing',
    age: 21,
    aspiration:
      'Wants to become a public health nurse serving rural communities in the Volta region.',
    tagline: 'Future public health nurse',
    interests: ['Health & medical', 'Community work', 'Education'],
    joinedLabel: 'Feb 2026',
    skillsVerified: 3,
    gamesPassed: 3,
    skills: [
      {
        id: 'patient-care',
        name: 'Patient care basics',
        detail: 'Strong · top 20%',
        evidence: 'assessment',
      },
      {
        id: 'first-aid',
        name: 'First aid',
        detail: 'Ghana Red Cross · 2026',
        evidence: 'certificate',
      },
      {
        id: 'data-entry',
        name: 'Data entry & records',
        detail: 'Passed · Formula Rush',
        evidence: 'skillsLab',
      },
      { id: 'teamwork', name: 'Teamwork', detail: 'Endorsed by 2 tutors', evidence: 'endorsed' },
    ],
    personality: {
      type: 'The Caregiver',
      blurb: 'Warm, patient and organised. Energised by helping people one-to-one.',
    },
    games: ['Formula Rush', 'Speed Sort', 'Group Chat Drama'],
    portfolio: [],
  }),
  profile({
    id: 'kofi-m',
    name: 'Kofi M.',
    firstName: 'Kofi',
    photo: portraitKofi,
    region: 'Ashanti',
    education: 'In-tertiary · Communication design',
    age: 22,
    aspiration: 'Wants to design apps that make public services easier to use in Ghana.',
    tagline: 'Aspiring product designer',
    interests: ['Creative & media', 'Technology', 'Entrepreneurship'],
    joinedLabel: 'Nov 2025',
    skillsVerified: 4,
    gamesPassed: 4,
    skills: [
      {
        id: 'ui-design',
        name: 'UI design',
        detail: 'Passed · Pixel Perfect',
        evidence: 'skillsLab',
      },
      {
        id: 'visual-communication',
        name: 'Visual communication',
        detail: 'Strong · top 15%',
        evidence: 'assessment',
      },
      {
        id: 'prototyping',
        name: 'Prototyping in Figma',
        detail: 'Online course · 2026',
        evidence: 'certificate',
      },
      {
        id: 'presentation',
        name: 'Presentation',
        detail: 'Endorsed by a lecturer',
        evidence: 'endorsed',
      },
    ],
    personality: {
      type: 'The Maker',
      blurb: 'Curious and visual. Likes building things and testing them with people.',
    },
    games: ['Pixel Perfect', 'Feature Frenzy', 'Sprint Stack', 'Chess Blitz'],
    portfolio: [
      { id: 'trotro', title: 'Trotro route finder · mobile concept', image: pieceTrotro },
      { id: 'library', title: 'School library booking flow', image: pieceLibrary },
      { id: 'brand', title: 'Brand refresh for a Kumasi café', image: pieceBrand },
    ],
  }),
  profile({
    id: 'efua-d',
    name: 'Efua D.',
    firstName: 'Efua',
    photo: portraitEfua,
    region: 'Greater Accra',
    education: 'Post-tertiary · BSc Statistics',
    age: 26,
    aspiration: 'Wants to lead a data team that helps Ghanaian businesses make better decisions.',
    tagline: 'Data analyst in training',
    interests: ['Technology', 'Business & finance'],
    joinedLabel: 'Jan 2026',
    skillsVerified: 5,
    gamesPassed: 5,
    skills: [
      { id: 'sql', name: 'SQL', detail: 'Passed · SQL Heist', evidence: 'skillsLab' },
      {
        id: 'data-visualisation',
        name: 'Data visualisation',
        detail: 'Passed · Chart Detective',
        evidence: 'skillsLab',
      },
      {
        id: 'excel',
        name: 'Excel modelling',
        detail: 'Professional cert · 2025',
        evidence: 'certificate',
      },
      {
        id: 'analytical',
        name: 'Analytical thinking',
        detail: 'Strong · top 10%',
        evidence: 'assessment',
      },
    ],
    personality: {
      type: 'The Analyst',
      blurb: 'Methodical and precise. Enjoys finding patterns others miss.',
    },
    games: ['SQL Heist', 'Chart Detective', 'Bug Hunt', 'Formula Rush', 'Crisis Room'],
    portfolio: [
      { id: 'prices', title: 'Market prices dashboard · Makola', image: pieceBrand },
      { id: 'survey', title: 'Survey analysis for an NGO', image: pieceLibrary },
    ],
  }),
  profile({
    id: 'yaw-b',
    name: 'Yaw B.',
    firstName: 'Yaw',
    photo: portraitYaw,
    region: 'Northern',
    education: 'Pre-tertiary · SHS 3',
    age: 18,
    aspiration: 'Wants to study computer science and build software for farmers in the north.',
    tagline: 'Future software developer',
    interests: ['Technology', 'Agriculture'],
    joinedLabel: 'Apr 2026',
    // Figma inconsistency kept as drawn: the stat tile says 2 skills verified, the list below shows 3.
    skillsVerified: 2,
    gamesPassed: 3,
    skills: [
      { id: 'python', name: 'Python basics', detail: 'Passed · Bug Hunt', evidence: 'skillsLab' },
      {
        id: 'logic',
        name: 'Logical reasoning',
        detail: 'Strong · top 20%',
        evidence: 'assessment',
      },
      {
        id: 'problem-solving',
        name: 'Problem solving',
        detail: 'Endorsed by ICT teacher',
        evidence: 'endorsed',
      },
    ],
    personality: {
      type: 'The Builder',
      blurb: 'Hands-on and persistent. Learns by trying, breaking and fixing.',
    },
    games: ['Bug Hunt', 'Escape Room', 'Trotro Rush'],
    portfolio: [],
  }),
  profile({
    id: 'adwoa-k',
    name: 'Adwoa K.',
    firstName: 'Adwoa',
    photo: portraitAdwoa,
    region: 'Central',
    education: 'Post-tertiary · BSc Agribusiness',
    age: 28,
    aspiration: 'Wants to grow a cassava processing business that employs young people in Central.',
    tagline: 'Agribusiness manager',
    interests: ['Agriculture', 'Entrepreneurship', 'Business & finance'],
    joinedLabel: 'Dec 2025',
    skillsVerified: 4,
    gamesPassed: 2,
    skills: [
      {
        id: 'business-planning',
        name: 'Business planning',
        detail: 'Strong · top 15%',
        evidence: 'assessment',
      },
      {
        id: 'bookkeeping',
        name: 'Bookkeeping',
        detail: 'Accredited course · 2025',
        evidence: 'certificate',
      },
      {
        id: 'negotiation',
        name: 'Negotiation',
        detail: 'Passed · Makola Haggle',
        evidence: 'skillsLab',
      },
      {
        id: 'leadership',
        name: 'Leadership',
        detail: 'Endorsed by 3 colleagues',
        evidence: 'endorsed',
      },
    ],
    personality: {
      type: 'The Organiser',
      blurb: 'Decisive and practical. Turns plans into steps and gets people moving.',
    },
    games: ['Makola Haggle', 'Desert Island'],
    portfolio: [{ id: 'cassava', title: 'Cassava value-chain plan', image: pieceTrotro }],
  }),
];

/* --- evidence kinds (chip colours as drawn on the skill rows; written out with their md: prefix so Tailwind's scanner sees them) ------------------------------------------------------------------------ */
export const EVIDENCE_KINDS = {
  assessment: {
    label: 'Assessment',
    chip: 'md:bg-[#ebf1ec] md:text-[#2a5730]',
    icon: 'text-[#2a5730]',
  },
  certificate: {
    label: 'Certificate',
    chip: 'md:bg-[#eaeffb] md:text-[#244a9f]',
    icon: 'text-[#1d4f91]',
  },
  skillsLab: {
    label: 'Skills Lab',
    chip: 'md:bg-[#faf4e8] md:text-[#785910]',
    icon: 'text-[#9a3d12]',
  },
  endorsed: {
    label: 'Endorsed',
    chip: 'md:bg-[#f2f2ee] md:text-[#575755]',
    icon: 'text-[#3d3d3a]',
  },
};

/* --- the response -------------------------------------------------------------------------------------------------------------------- */
export const SHOWCASE_RESPONSE = {
  consent: SHOWCASE_CONSENT,
  grid: SHOWCASE_GRID_COPY,
  profiles: SHOWCASE_PROFILES,
};

/** GET /public/showcase (mock, synchronous). */
export const getShowcase = () => SHOWCASE_RESPONSE;

/** The profile for a URL id, or the first one; also its position and neighbours (circular). */
export const resolveProfile = (profileId) => {
  const list = SHOWCASE_PROFILES;
  const found = list.findIndex((p) => p.id === profileId);
  const index = found === -1 ? 0 : found;
  return {
    profile: list[index],
    index,
    total: list.length,
    previous: list[(index - 1 + list.length) % list.length],
    next: list[(index + 1) % list.length],
    others: list.filter((_, i) => i !== index),
    known: found !== -1 || !profileId,
  };
};
