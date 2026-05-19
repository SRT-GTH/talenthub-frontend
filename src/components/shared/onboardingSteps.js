/*
 * Shared step catalogue for the talent onboarding flow. Order matters
 * — `OnboardingHeader` uses the index of `currentKey` to decide which
 * steps are completed (green check + dark grey) vs upcoming (muted
 * grey). Step labels mirror Figma Frame 150 / 153 across every step
 * screen (basics, profile, contact, address, education, [parent],
 * review, done).
 *
 * Below-18 talents pick up an extra `parent` step between `education`
 * and `review`. Pages call `getTalentOnboardingSteps({ isMinor })` to
 * resolve the right list; the legacy `ONBOARDING_STEPS` export is the
 * adult flow and is kept for callers that haven't been migrated yet.
 */

const ADULT_TALENT_STEPS = [
  { key: 'role', label: 'Role' },
  { key: 'start', label: 'Start (Date of Birth)' },
  { key: 'profile', label: 'Build Your Profile' },
  { key: 'contact', label: 'Contact' },
  { key: 'address', label: 'Address' },
  { key: 'education', label: 'Education' },
  { key: 'review', label: 'Review & Terms' },
  { key: 'done', label: 'Done' },
];

const MINOR_PARENT_STEP = { key: 'parent', label: 'Parent' };

export const ONBOARDING_STEPS = ADULT_TALENT_STEPS;

// Returns the appropriate step list for the talent onboarding flow.
// `isMinor` defaults to false so callers that haven't loaded age yet
// still get the adult flow (matches the pre-context behaviour).
export const getTalentOnboardingSteps = ({ isMinor = false } = {}) => {
  if (!isMinor) return ADULT_TALENT_STEPS;
  // Insert the Parent step after Education and before Review.
  const educationIndex = ADULT_TALENT_STEPS.findIndex((s) => s.key === 'education');
  return [
    ...ADULT_TALENT_STEPS.slice(0, educationIndex + 1),
    MINOR_PARENT_STEP,
    ...ADULT_TALENT_STEPS.slice(educationIndex + 1),
  ];
};
