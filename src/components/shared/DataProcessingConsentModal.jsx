import LegalModalShell from './LegalModalShell.jsx';

/*
 * DataProcessingConsentModal — bottom-sheet modal for explicit data-
 * processing consent during onboarding Step 07. Source: Figma node
 * 2846:30205.
 *
 * Adds a SECOND callout that the other two modals don't carry — an
 * informational blue panel about withdrawal mechanics — for a total
 * of two stacked callouts at the bottom of the body.
 */

const POINTS = [
  {
    n: 1,
    title: 'Talent matching — your core GTH feature',
    body: 'GTH analyses your profile to calculate your Talent Score and recommend relevant jobs, internships, and scholarships. Without this consent, matching does not work.',
    highlight: true,
  },
  {
    n: 2,
    title: 'Recruiter discovery — being found',
    body: 'Your profile is made visible to verified recruiters searching our platform. Sensitive details like your phone number and date of birth are never shown to recruiters.',
    highlight: true,
  },
  {
    n: 3,
    title: 'Career guidance — personalised suggestions',
    body: 'GTH uses your profile to suggest skills to add, courses to take, and career paths to consider. You will see these as prompts inside the platform.',
  },
  {
    n: 4,
    title: 'Platform improvement — anonymised only',
    body: 'You are consenting only to these four purposes. If GTH ever wants to use your data for anything else, we will ask for your separate permission first.',
  },
  {
    n: 5,
    title: 'Your consent is explicit and specific',
    body: 'You can grant or refuse this consent independently of your account. Refusing it disables matching and recruiter discovery, but your account remains open.',
  },
  {
    n: 6,
    title: 'You can withdraw consent at any time',
    body: 'Go to Settings → Privacy → Withdraw Data Processing Consent. Your account stays active but you will no longer appear in recruiter searches or receive personalised matches.',
  },
  {
    n: 7,
    title: 'Your acceptance is logged with a timestamp',
    body: 'When you accept this consent, the date, time, and version are recorded and stored securely for at least 5 years as required by the Data Protection Act (Act 843, 2012).',
  },
];

const CALLOUTS = [
  {
    variant: 'amber',
    title: 'Important if you are under 18',
    body: 'Your parent or guardian will be notified of your registration and has the right to request account closure or withdrawal of consent on your behalf within 7 days.',
  },
  {
    variant: 'blue',
    title: 'Withdrawing consent does not delete your account',
    body: 'You will still be able to log in and update your profile, but matching and recruiter discovery will stop until you reconsent.',
  },
];

const DataProcessingConsentModal = ({ onAccept, onClose }) => (
  <LegalModalShell
    title={{ before: 'Data Processing ', after: 'Consent' }}
    introTitle="What you are explicitly consenting to"
    introSubtitle="7 plain-language points about data processing — the what, why, and how to stop it."
    points={POINTS}
    callouts={CALLOUTS}
    footerHelper="Summary of 7 key points. Read the full Data Processing Consent document for complete legal text."
    readFullHref="/legal/data-processing"
    onAccept={onAccept}
    onClose={onClose}
  />
);

export default DataProcessingConsentModal;
