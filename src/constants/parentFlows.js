/*
 * parentFlows — the two parent onboarding entry flows, kept explicit so the
 * routing and layout can branch on them.
 *
 *   A — self-serve: the parent signs up on their own and links a ward manually.
 *       Entry: /onboarding/parent-welcome   (photo right panel)
 *   B — ward-invited (pre-filled): the child registered first and provided the
 *       parent's contact, so the parent's details are pre-filled and the ward is
 *       auto-linked. The parent is invited to claim the account.
 *       Entry: /onboarding/parent-invited   (simple right panel)
 *
 * Both flows converge on the shared sign-up step screens
 * (identity → verification → contact → security → link-ward → review → done).
 */
export const PARENT_FLOWS = {
  selfServe: {
    id: 'A',
    welcome: '/onboarding/parent-welcome',
    firstStep: '/onboarding/parent-identity',
  },
  wardInvited: {
    id: 'B',
    welcome: '/onboarding/parent-invited',
    firstStep: '/onboarding/parent-invited-identity',
  },
};

// First sign-up step for the self-serve flow (kept for back-compat).
export const PARENT_FIRST_STEP = PARENT_FLOWS.selfServe.firstStep;

/*
 * Flow B (ward-invited) step screens — per-step config keyed by the route slug
 * (after `/onboarding/`). Drives the breadcrumb step/percent and the simple
 * step-list panel copy. `currentStep` is the 0-based index into the panel's
 * 6-item list.
 */
// Breadcrumb labels for the invited flow (B). There is no Ghana Card step:
// identity cannot be verified without NIA access yet.
export const INVITED_STEPS = ['Identity', 'Contact', 'Security', 'Link Ward', 'Consent', 'Done'];

export const WARD_INVITE_STEP_PANELS = {
  'parent-invited-identity': {
    currentStep: 0,
    percent: 15,
    title: 'Your identity',
    titleAccent: 'builds trust.',
    subtitle:
      "A complete parent profile helps us communicate with you and keeps your ward's account secure.",
  },
  'parent-invited-verification': {
    currentStep: 1,
    percent: 20,
    title: 'Optional for',
    titleAccent: 'parents.',
    subtitle:
      "Verification builds trust but isn't required. Your ward's access is already active regardless of this step.",
  },
  'parent-invited-contact': {
    currentStep: 1,
    percent: 35,
    title: 'Secure contact',
    titleAccent: 'details.',
    subtitle: "Your contact details are encrypted and protected under Ghana's Data Protection Act.",
  },
  'parent-invited-security': {
    currentStep: 2,
    percent: 55,
    title: 'Lock your account',
    titleAccent: 'down.',
    subtitle:
      "A strong password protects your ward's data and your ability to manage their access.",
  },
  'parent-invited-link-ward': {
    currentStep: 3,
    percent: 75,
    // Uses a custom link-diagram panel (WardLinkPanelContent), not the step list.
    panel: 'link',
  },
  'parent-invited-consent': {
    currentStep: 4,
    percent: 90,
    // Uses a custom capability-list panel (WardConsentPanelContent).
    panel: 'consent',
  },
};
