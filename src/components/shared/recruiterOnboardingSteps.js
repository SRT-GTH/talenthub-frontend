/*
 * Step catalogue for the RECRUITER onboarding flow.
 * Source: Figma page 7356:96249 "onboarding screens - Recruiter" - the header
 * trail on every R01-R08 frame reads Role / Your Profile / Verify /
 * Organisation / Plan / Payment / Preferences / Review & Terms / Done.
 *
 * Unlike talent, the completion percentage is NOT derived from the step index:
 * Figma fixes it per screen (20 / 32 / 45 / 45 / 56 / 67 / 78 / 90), so each
 * route carries its own `percent` and the header receives it explicitly.
 * Verify (OTP) is a modal over the profile screen, not a route of its own.
 */

export const RECRUITER_ONBOARDING_BASE = '/onboarding/recruiter';

export const RECRUITER_ONBOARDING_STEPS = [
  { key: 'role', label: 'Role' },
  { key: 'profile', label: 'Your Profile' },
  { key: 'verify', label: 'Verify' },
  { key: 'organisation', label: 'Organisation' },
  { key: 'plan', label: 'Plan' },
  { key: 'payment', label: 'Payment' },
  { key: 'preferences', label: 'Preferences' },
  { key: 'review', label: 'Review & Terms' },
  { key: 'done', label: 'Done' },
];

// route key -> { stepKey, percent, path }. `type` and `createOrganisation`
// both sit under the "Organisation" crumb at 45% (Figma R03 / R04 / R04b).
export const RECRUITER_ROUTES = {
  profile: { stepKey: 'profile', percent: 20, path: `${RECRUITER_ONBOARDING_BASE}/profile` },
  verify: { stepKey: 'verify', percent: 32, path: `${RECRUITER_ONBOARDING_BASE}/profile` },
  type: { stepKey: 'organisation', percent: 45, path: `${RECRUITER_ONBOARDING_BASE}/type` },
  organisation: {
    stepKey: 'organisation',
    percent: 45,
    path: `${RECRUITER_ONBOARDING_BASE}/organisation`,
  },
  createOrganisation: {
    stepKey: 'organisation',
    percent: 45,
    path: `${RECRUITER_ONBOARDING_BASE}/organisation/create`,
  },
  plan: { stepKey: 'plan', percent: 56, path: `${RECRUITER_ONBOARDING_BASE}/plan` },
  payment: { stepKey: 'payment', percent: 67, path: `${RECRUITER_ONBOARDING_BASE}/payment` },
  preferences: {
    stepKey: 'preferences',
    percent: 78,
    path: `${RECRUITER_ONBOARDING_BASE}/preferences`,
  },
  review: { stepKey: 'review', percent: 90, path: `${RECRUITER_ONBOARDING_BASE}/review` },
  done: { stepKey: 'done', percent: 100, path: `${RECRUITER_ONBOARDING_BASE}/done` },
};
