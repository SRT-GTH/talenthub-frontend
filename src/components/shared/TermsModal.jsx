import LegalModalShell from './LegalModalShell.jsx';

/*
 * TermsModal — bottom-sheet modal for Terms & Conditions during
 * onboarding Step 07. Source: Figma node 2837:28954.
 *
 * Copy is Figma-verbatim except where the design carried obvious
 * artefacts: the original "agreement s" typo on the page subhead is
 * fixed up there; here, the only known artefact is "GTH is adiscovery
 * tool" in point 7 which we render as "GTH is a discovery tool".
 */

const POINTS = [
  {
    n: 1,
    title: 'You must be a JHS student or above',
    body: 'GTH is for students from Junior High School through postgraduate level in Ghana. Primary school students are not eligible yet.',
  },
  {
    n: 2,
    title: 'You are responsible for your account',
    body: 'Keep your password private. You are responsible for everything that happens under your account. If you think someone else has accessed it, contact us immediately.',
  },
  {
    n: 3,
    title: 'Your information must be accurate',
    body: 'You agree to provide truthful information about your education, skills, and qualifications. Providing false information can result in your account being suspended.',
    highlight: true,
  },
  {
    n: 4,
    title: 'Be respectful — no misuse',
    body: 'You may not use GTH to impersonate others, attempt to access other accounts, scrape data, or interfere with the platform in any way.',
  },
  {
    n: 5,
    title: 'Your Talent Score is calculated automatically',
    body: 'The score is based on what you put in your profile. It is not a test result. GTH does not guarantee employment outcomes based on your score.',
  },
  {
    n: 6,
    title: 'GTH can update these terms',
    body: 'We may update the Terms & Conditions from time to time. We will notify you of significant changes via email or in-app notification.',
  },
  {
    n: 7,
    title: 'GTH is not liable for third-party decisions',
    body: 'Recruiters and institutions use your profile to make their own hiring decisions. GTH is a discovery tool and is not responsible for those outcomes.',
  },
  {
    n: 8,
    title: 'Ghanaian law applies',
    body: 'These terms are governed by the laws of the Republic of Ghana. Any disputes are handled by Ghanaian courts.',
  },
];

const CALLOUTS = [
  {
    variant: 'amber',
    title: 'Under 18?',
    body: 'If you are under 18, you can still register. A parent or guardian will be notified after you complete registration and can opt out on your behalf within 7 days.',
  },
];

const TermsModal = ({ onAccept, onClose }) => (
  <LegalModalShell
    title={{ before: 'Terms & ', after: 'Conditions' }}
    introTitle="What you are agreeing to"
    introSubtitle="8 key points. This is what these terms actually mean for you as a GTH user."
    points={POINTS}
    callouts={CALLOUTS}
    footerHelper="Summary of 8 key points. For the full legal text, read the complete document."
    readFullHref="/legal/terms"
    onAccept={onAccept}
    onClose={onClose}
  />
);

export default TermsModal;
