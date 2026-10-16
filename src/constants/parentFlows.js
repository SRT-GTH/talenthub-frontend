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
// Ghana Card step in the invited flow (B). Off until identity can be checked
// with NIA: set VITE_PARENT_ID_VERIFICATION=true to show it again. The screen
// itself (ParentInviteVerificationSection) does not upload anything yet; it
// needs a backend endpoint and a private store for ID images first.
export const PARENT_ID_VERIFICATION = import.meta.env.VITE_PARENT_ID_VERIFICATION === 'true';

// Breadcrumb labels for the invited flow (B).
export const INVITED_STEPS = PARENT_ID_VERIFICATION
  ? ['Identity', 'Verification', 'Contact', 'Security', 'Link Ward', 'Consent', 'Done']
  : ['Identity', 'Contact', 'Security', 'Link Ward', 'Consent', 'Done'];

// Step-list panel labels for the invited flow (B).
export const INVITED_PANEL_STEPS = PARENT_ID_VERIFICATION
  ? ['Your identity', 'Verification', 'Contact details', 'Security', 'Link your ward', 'Consent']
  : ['Your identity', 'Contact details', 'Security', 'Link your ward', 'Consent'];

// Screen that follows identity in the invited flow.
export const INVITED_AFTER_IDENTITY = PARENT_ID_VERIFICATION
  ? '/onboarding/parent-invited-verification'
  : '/onboarding/parent-invited-contact';

// Steps after verification move down one when it is shown.
const V = PARENT_ID_VERIFICATION ? 1 : 0;
const pct = (off, on) => (PARENT_ID_VERIFICATION ? on : off);

export const WARD_INVITE_STEP_PANELS = {
  'parent-invited-identity': {
    currentStep: 0,
    percent: pct(15, 10),
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
    currentStep: 1 + V,
    percent: pct(35, 34),
    title: 'Secure contact',
    titleAccent: 'details.',
    subtitle: "Your contact details are encrypted and protected under Ghana's Data Protection Act.",
  },
  'parent-invited-security': {
    currentStep: 2 + V,
    percent: pct(55, 50),
    title: 'Lock your account',
    titleAccent: 'down.',
    subtitle:
      "A strong password protects your ward's data and your ability to manage their access.",
  },
  'parent-invited-link-ward': {
    currentStep: 3 + V,
    percent: pct(75, 78),
    // Uses a custom link-diagram panel (WardLinkPanelContent), not the step list.
    panel: 'link',
  },
  'parent-invited-consent': {
    currentStep: 4 + V,
    percent: pct(90, 88),
    // Uses a custom capability-list panel (WardConsentPanelContent).
    panel: 'consent',
  },
};
