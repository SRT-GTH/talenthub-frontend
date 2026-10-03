/*
 * jobTemplatesData.js — verbatim content for the Recruiter Job Templates
 * screen. Source: Figma Bin8roWL8sloyc36IgFMuT, frame 7249:75046
 * ("RECRUITER - JOB TEMPLATES / All"), content canvas 7249:75078.
 *
 * Every string is the node's exact `characters` from the Figma REST API,
 * including the double space in the subtitle ("hiring process  with") and the
 * ellipsis characters that end three of the card descriptions — those are
 * literal "…" in Figma, i.e. the design's own truncation, not a CSS clamp.
 *
 * `icon` keys the per-card glyph. Every card carries a distinct 23-26px icon
 * in a 48x48 #f3f8f4 tile (all #2a5730); the glyphs are matched to each card's
 * Figma bounding-box proportions — see jobTemplatesIcons.jsx.
 */

// Figma 7249:75082 — characterStyleOverrides split "Job Templates" at index 4.
export const PAGE_HEADING = { lead: 'Job ', accent: 'Templates' };
export const PAGE_SUBHEADING =
  'Accelerate your hiring process  with a pre-optimized job description';

// Figma 7249:75100 — category filter pills; "All" is the active (filled) pill.
export const CATEGORY_PILLS = [
  'All',
  'Technology',
  'Design',
  'Healthcare',
  'Manufacturing',
  'Retail',
  'Internship',
];

export const SEARCH_PLACEHOLDER = 'Search templates...';
export const CREATE_CUSTOM_LABEL = 'Create Custom';

// Figma 7249:75142 / :75164 / :75186 / :75208 and the 7249:75141 instance.
export const TEMPLATES = [
  {
    id: 'software-engineer',
    icon: 'code',
    title: 'Software Engineer',
    category: 'Technology',
    type: 'Full-Time',
    description:
      'Optimized for modern tech stacks.\nIncludes requirements for distributed\nsystems, collaborative development,…',
    footnote: 'Last used 2 days ago',
    figmaNode: '7249:75141',
  },
  {
    id: 'marketing-associate',
    icon: 'megaphone',
    title: 'Marketing Associate',
    category: 'Marketing',
    type: 'Part-Time',
    description:
      'Focuses on multi-channel campaign\nmanagement, brand storytelling, and\ndata-driven marketing analytics for…',
    footnote: 'Popular Choice',
    figmaNode: '7249:75142',
  },
  {
    id: 'customer-support-rep',
    icon: 'headset',
    title: 'Customer Support Rep',
    category: 'Retail',
    type: 'Contract',
    description:
      'Standardized template for client-facing roles. Emphasizes empathetic communication, technical…',
    footnote: '12 Variants available',
    figmaNode: '7249:75164',
  },
  {
    id: 'general-internship',
    icon: 'graduation',
    title: 'General Internship',
    category: 'Internship',
    type: 'Seasonal',
    description:
      'A versatile framework for university\npartnerships and summer programs.\nIncludes structured learning outcomes',
    footnote: 'Updated Q3 2026',
    figmaNode: '7249:75186',
  },
  {
    id: 'product-designer',
    icon: 'design',
    title: 'Product Designer',
    category: 'Design',
    type: 'Temporal',
    description:
      'Crafted for design systems and UX/UI\nexpertise. Focuses on visual craft,\nuser research, and cross-functional…',
    footnote: '5-star Rating',
    figmaNode: '7249:75208',
  },
];

// Figma 7249:75230 — the dashed "add new" tile that closes the grid.
export const BLANK_TEMPLATE = {
  title: 'Create Custom',
  description: 'Start with a blank canvas and build a bespoke job profile from scratch.',
};
