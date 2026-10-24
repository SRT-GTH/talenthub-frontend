import LegalModalShell from './LegalModalShell.jsx';

/*
 * PrivacyPolicyModal — bottom-sheet modal for the Privacy Policy
 * during onboarding Step 07. Restyled to Figma 8027:211501 (dialog 8027:211862):
 * highlighted points 2/4/6, green 'Protected by Ghanaian law' callout.
 * Point 4 keeps the app's own copy: Figma point 4 is a copy-paste of the Terms
 * point 3 ('Your information must be accurate'), a design artefact.
 *
 * The Figma text node for the header reads "Terms & Conditions" — a
 * copy-paste artefact from the Terms modal that the design system
 * never cleaned up. We render the correct title here.
 *
 * No full legal text exists yet, so there is no "Read full document" link;
 * the footer says the full text is coming soon. Opened for acceptance during
 * onboarding Review, and read-only (ctaLabel "Got it") from the footers and
 * the onboarding Done page.
 */

const POINTS = [
  {
    n: 1,
    title: 'We collect what you give us during registration',
    body: 'Name, date of birth, phone number, education details, and location within Ghana. We do not collect your GPS location, financial data, or health information.',
  },
  {
    n: 2,
    title: 'Your data powers your profile and matches',
    body: 'We use your data to calculate your Talent Score, match you with opportunities, and send you relevant notifications. That is the main purpose.',
    highlight: true,
  },
  {
    n: 3,
    title: 'Verified recruiters can see your profile',
    body: 'Employers and institutions registered on GTH can search your profile. They see your education, skills, and score. They cannot see your phone number or date of birth.',
  },
  {
    n: 4,
    title: 'You control who sees sensitive information',
    body: 'Your phone number, date of birth, and Ghana Card details are hidden from recruiters by default. You can choose to share these directly when applying to specific opportunities.',
    highlight: true,
  },
  {
    n: 5,
    title: 'Your data stays while your account is active',
    body: 'If you delete your account, your data is removed within 30 days. Anonymized aggregated data may be kept for research — but it cannot identify you individually.',
  },
  {
    n: 6,
    title: 'You have rights under the Data Protection Act',
    body: 'You can access, correct, delete, or export your data at any time from Settings → Privacy. You can also withdraw your data processing consent without closing your account.',
    highlight: true,
  },
  {
    n: 7,
    title: 'Contact our Data Protection Officer',
    body: 'Any privacy questions or requests: privacy@ghanatalenthub.com. We will respond within 10 business days.',
  },
];

const CALLOUTS = [
  {
    variant: 'green',
    title: 'Protected by Ghanaian law',
    body: 'GTH complies with the Data Protection Act (Act 843, 2012). You can lodge a complaint with the Data Protection Commission of Ghana if you are unsatisfied with our response.',
  },
];

const PrivacyPolicyModal = ({ onAccept, onClose, ctaLabel }) => (
  <LegalModalShell
    title={{ before: 'Privacy ', after: 'Policy' }}
    introTitle="How we handle your personal data"
    introSubtitle="7 plain-language points about what we collect, how we use it, and your rights."
    points={POINTS}
    callouts={CALLOUTS}
    footerHelper="Summary of 7 key points. The full policy is coming soon."
    ctaLabel={ctaLabel}
    onAccept={onAccept}
    onClose={onClose}
  />
);

export default PrivacyPolicyModal;
