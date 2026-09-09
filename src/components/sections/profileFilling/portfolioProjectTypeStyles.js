// Project-type list for AddEditPortfolioModal.jsx's "Project Type" Select.
//
// Split into its own file — like workRoleStatusStyles.js — because a
// component file may only export components under this project's
// react-refresh lint rule.
export const PROJECT_TYPES = [
  'Web app',
  'Mobile app',
  'Design case study',
  'Data analysis',
  'Research paper',
  'Hardware build',
  'Other',
];

// Cover-image fallback gradient (when no cover image is uploaded) — used by
// PortfolioStage2Section.jsx's ProjectCard and DeletePortfolioModal.jsx's
// preview card. Figma's own CSS variable is `--graphs`, a single fixed
// gradient reused everywhere regardless of project type — a previous version
// invented a colour-per-project-type map here, which was wrong (confirmed:
// every project's icon background is this exact green gradient, never
// anything else).
export const PROJECT_ICON_GRADIENT = 'linear-gradient(90deg, #387440 0%, #69DA78 100%)';

// Decorative emoji shown in the compact (non-pinned) project row's icon
// column — Figma's own compact-card examples (5200:105120/105157/105194)
// each show a different literal emoji character per project type (📊 for
// Data analysis, 🎨 for Design case study, etc.) rather than an SVG icon, so
// this follows the same plain-emoji approach (already used elsewhere in this
// app, e.g. WorkSavedModal's 🏆) instead of extracting/hand-crafting icons.
// Figma's dive only covered "Data analysis" and "Design case study"
// directly — the rest are invented-but-consistent, same convention as
// PROJECT_TYPES itself.
const PROJECT_TYPE_EMOJI = {
  'Web app': '🌐',
  'Mobile app': '📱',
  'Design case study': '🎨',
  'Data analysis': '📊',
  'Research paper': '📄',
  'Hardware build': '🔧',
  Other: '🗂️',
};

export const getProjectTypeEmoji = (type) => PROJECT_TYPE_EMOJI[type] ?? PROJECT_TYPE_EMOJI.Other;

// "Year completed" Select options — Figma's field (5209:112754) is styled as
// a select (thicker border + arrowhead-down icon) with placeholder "e.g.
// 2024" but specs no option list, so this generates a sensible descending
// range from the current year back 14 years.
export const getYearOptions = () => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 15 }, (_, i) => String(currentYear - i));
};
