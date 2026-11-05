/*
 * talentSearchData.js — verbatim content for the Recruiter Talent Search
 * screen. Source: Figma file Bin8roWL8sloyc36IgFMuT, frame 7249:74283
 * ("Recruiter Talent Search"), content canvas 7249:74314.
 *
 * Every string is the node's exact `characters` value from the Figma REST API.
 *
 * FIGMA NOTES (recorded, not silently resolved):
 *  • Only THREE unique candidates exist. Figma draws two grids of three
 *    (7249:74363 and 7249:74602) whose text is byte-identical, so the second
 *    grid is the same three records repeated to fill the page. Reproduced as
 *    such rather than inventing three more people.
 *  • Every card's LAYER is named "Candidate Card 1: Kofi Amankwah" and the
 *    heading's layer is named "Heading 2 → Opportunities that match you." —
 *    both stale copy-paste names. The `characters` are what ship.
 *  • Godfred's match bar is drawn 128/192 (66.7%) while his label reads 76%;
 *    Kofi (174.72/192) and Ama (161.28/192) are exactly 91% and 84%. Kept as
 *    drawn through `matchBarPercent` (V2.0 rule: Figma inconsistencies stay).
 *  • The subtitle says "Found 12 highly compatible matches" while six cards
 *    are drawn. Kept verbatim — it is the result count, not the card count.
 */

// Figma 7249:74317 — mixed-style headline. characterStyleOverrides splits it
// at index 7: the first 7 characters use #111111, the remaining 14 are italic
// #387440. Stored pre-split so the span structure is data-driven.
// V2.0: Bricolage Grotesque 600, accent run #387440 (not italic).
export const PAGE_HEADING = { lead: 'Talent ', accent: 'Search Results' };

export const PAGE_SUBHEADING = 'Found 12 highly compatible matches for Senior Product Engineer';

// Figma 7249:74322 — GTHInput
export const SEARCH_PLACEHOLDER = 'Search by name or keyword...';

// Figma 7249:74329 / :74338 / :74343 — active filter chips.
export const FILTER_CHIPS = [
  { id: 'skills', label: 'Skills:', value: 'React, Python, AWS' },
  { id: 'experience', label: 'Exp:', value: '5+ Years' },
  { id: 'location', label: 'Location:', value: 'Accra, GH' },
];

export const MORE_FILTERS_LABEL = 'More Filters';

// Figma 7249:74604 — segmented control. URL: ?tab=<id> (default all-matches).
// ⚠️ ASSUMPTION: Figma draws only the "All Matches" state; the other two tabs filter as
// top-matches = matchPercent >= 80, available-now = available === true. "All Matches" is the active tab.
export const RESULT_TABS = [
  { id: 'all-matches', label: 'All Matches' },
  { id: 'top-matches', label: 'Top Matches' },
  { id: 'available-now', label: 'Available now' },
];

// Figma 7249:74583 — analytics tile beside the insight banner.
export const AVERAGE_MATCH = {
  label: 'Average Match',
  value: '78%',
  caption: 'Across 154 candidates',
};

// Figma 7249:74592 — green insight banner. The body carries hard line breaks
// in Figma; they are preserved so the three-line rag matches the design.
export const TALENT_POOL_INSIGHT = {
  heading: 'Insight: Talent Pool Velocity',
  body: 'Similar candidates for this role are being hired within 14 days on\naverage. We recommend engaging your top 3 matches\nimmediately.',
  action: 'View Market Report',
};

// ⚠️ ASSUMPTION (not drawn in Figma): shown when the typed search matches nobody.
export const NO_RESULTS_LABEL = 'No candidates match your search.';

export const TOP_MATCH_THRESHOLD_PERCENT = 80; // ⚠️ ASSUMPTION, see RESULT_TABS

export const CARD_LABELS = {
  matchExplanation: 'Match Explanation',
  topSkills: 'Top Skills',
  availability: 'Availability',
  viewProfile: 'View Profile',
  startConversation: 'Start Conversation',
  matchScore: (percent) => `Match Score: ${percent}%`,
};

// Figma 7249:74364 / :74437 / :74509.
export const CANDIDATES = [
  {
    id: 'kofi-amankwah',
    explanationTint: '#f3f8f4', // Figma 7249:74398
    name: 'Kofi Amankwah',
    role: 'Senior Software Engineer',
    matchPercent: 91,
    tags: ['Full Stack', 'Architecture', 'Cloud Expert'],
    explanation:
      "Kofi's background at Fintech Hub aligns perfectly with your requirements for high-availability systems. He has significant leadership experience in AWS-native architectures and demonstrated a\n95th-percentile score in our Technical Logic Assessment.",
    topSkills: ['React.js', 'PostgreSQL', 'Kubernetes', '+4 more'],
    availability: 'Immediate (Notice period served)',
    available: true,
    figmaNode: '7249:74364',
  },
  {
    id: 'ama-boateng',
    explanationTint: '#ebf1ec', // Figma 7249:74470 (the only card on #ebf1ec)
    name: 'Ama Boateng',
    role: 'Product Lead',
    matchPercent: 84,
    tags: ['Strategic Planning', 'SaaS Growth', 'Cloud Expert'],
    explanation:
      "Ama excels in bridging the gap between engineering and business. Her performance in 'Systems Design for Scale' was exemplary, though she has slightly less direct experience with Python than your ideal profile.",
    topSkills: ['Product Strategy', 'PostgreSQL', 'Agile', 'SQL'],
    availability: 'Immediate (Notice period served)',
    available: true,
    figmaNode: '7249:74437',
  },
  {
    id: 'godfred-ansah',
    explanationTint: '#f3f8f4', // Figma 7249:74543
    // Figma 7249:74523 draws this bar 128/192 = 66.67% while the label reads 76%: kept as drawn.
    matchBarPercent: 66.67,
    name: 'Godfred Ansah',
    role: 'Senior Software Engineer',
    matchPercent: 76,
    tags: ['SQL', 'Data Visualization', 'Junior'],
    explanation:
      "Godfred shows strong foundational skills in data cleaning and visualization from his recent bootcamp project. He's a good fit for entry-level analyst work, but hasn't yet demonstrated experience with production-scale datasets like your role requires.",
    topSkills: ['Excel', 'SQL', 'Power BI', '+1 more'],
    availability: 'Not available (Currently employed, notice period unknown)',
    available: false,
    figmaNode: '7249:74509',
  },
];
