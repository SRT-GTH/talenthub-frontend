/*
 * Shared step catalogue for the talent onboarding flow. Order matters
 * — `OnboardingHeader` uses the index of `currentKey` to decide which
 * steps are completed (green check + dark grey) vs upcoming (muted
 * grey). Step labels mirror Figma Frame 150 / 153 across every step
 * screen (basics, profile, contact, address, education, review, done).
 */
export const ONBOARDING_STEPS = [
  { key: 'role', label: 'Role' },
  { key: 'start', label: 'Start (Date of Birth)' },
  { key: 'profile', label: 'Build Your Profile' },
  { key: 'contact', label: 'Contact' },
  { key: 'address', label: 'Address' },
  { key: 'education', label: 'Education' },
  { key: 'review', label: 'Review & Terms' },
  { key: 'done', label: 'Done' },
];
