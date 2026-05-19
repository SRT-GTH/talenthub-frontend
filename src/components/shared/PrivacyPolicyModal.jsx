import LegalModalShell from './LegalModalShell.jsx';

/*
 * PrivacyPolicyModal — bottom-sheet modal for the Privacy Policy
 * during onboarding Step 07. Source: Figma node 2846:29512.
 *
 * The Figma text node for the header reads "Terms & Conditions" — a
 * copy-paste artefact from the Terms modal that the design system
 * never cleaned up. We render the correct title here.
 */

const POINTS = [
  {
    n: 1,
    title: 'We collect what you give us during registration',
    body: 'Name, date of birth, phone number, education details, and location within Ghana. We do not collect your GPS location, financial data, or health information.',
    highlight: true,
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
  },
  {
    n: 7,
    title: 'Contact our Data Protection Officer',
    body: 'Any privacy questions or requests: privacy@ghanatalenthub.com. We will respond within 10 business days.',
  },
];

const CALLOUTS = [
  {
    variant: 'blue',
    title: 'Protected by Ghanaian law',
    body: 'GTH complies with the Data Protection Act (Act 843, 2012). You can lodge a complaint with the Data Protection Commission of Ghana if you are unsatisfied with our response.',
  },
];

const PrivacyPolicyModal = ({ onAccept, onClose }) => (
  <LegalModalShell
    title={{ before: 'Privacy ', after: 'Policy' }}
    introTitle="How we handle your personal data"
    introSubtitle="7 plain-language points about what we collect, how we use it, and your rights."
    points={POINTS}
    callouts={CALLOUTS}
    footerHelper="Summary of 7 key points. Read the full Privacy Policy for complete legal details."
    readFullHref="/legal/privacy"
    onAccept={onAccept}
    onClose={onClose}
  />
);

export default PrivacyPolicyModal;
