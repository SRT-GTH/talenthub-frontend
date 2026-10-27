/*
 * Post purposes (US-5.2.2-01..04). Every community post carries one, chosen from a dropdown; the
 * backend validates it (utils/postPurpose.js there). Labels follow the story's terminology mapping;
 * colours make the badge readable at a glance (orange = Opportunity, blue = Upskilling, ...).
 */
export const POST_PURPOSES = [
  {
    value: 'opportunity_discovery',
    label: 'Opportunities',
    singular: 'Opportunity',
    hint: 'Jobs, internships, gigs, scholarships',
    badge: 'bg-[#fdebd8] text-[#8a4b0f]',
  },
  {
    value: 'profile_building',
    label: 'Profile Building',
    singular: 'Profile Building',
    hint: 'CV, portfolio and profile advice',
    badge: 'bg-[#efe6fb] text-[#55308f]',
  },
  {
    value: 'upskilling',
    label: 'Upskilling',
    singular: 'Upskilling',
    hint: 'Courses, learning resources, skill tips',
    badge: 'bg-[#e1edfb] text-[#1d4f8c]',
  },
  {
    value: 'career_guidance',
    label: 'Career Guidance',
    singular: 'Career Guidance',
    hint: 'Career paths, mentoring, questions about a career',
    badge: 'bg-[#e3f2e6] text-[#1f5a2c]',
  },
  {
    value: 'milestone_celebration',
    label: 'Milestones',
    singular: 'Milestone',
    hint: 'Wins worth celebrating',
    badge: 'bg-[#fbf1d0] text-[#6b4f05]',
  },
];

export const PURPOSE_BY_VALUE = Object.fromEntries(POST_PURPOSES.map((p) => [p.value, p]));

/** "Showing 4 Upskilling posts" / "Showing 1 Opportunity post". */
export const showingLabel = (purpose, total) => {
  const p = PURPOSE_BY_VALUE[purpose];
  if (!p) return null;
  return `Showing ${total} ${p.singular} post${total === 1 ? '' : 's'}`;
};

/** US-5.2.2-02 empty state, e.g. "No milestone posts in this community yet. Be the first to share one!" */
export const emptyPurposeText = (purpose) => {
  const p = PURPOSE_BY_VALUE[purpose];
  return p
    ? `No ${p.singular.toLowerCase()} posts in this community yet. Be the first to share one!`
    : null;
};
