import ConsentModal, { ConsentListItem, NoticeBox } from './ConsentModal.jsx';
import { debug } from '../../../utils/debug.js';

const log = debug('ConsentModals');

/*
 * The three Review & Consent pop-ups, data-driven from the shared ConsentModal
 * shell. Figma frames:
 *   OptOutModal        2947:79682  ("Immediate access — what it means")
 *   ParentRightsModal  2951:80104  ("Your rights as a parent")
 *   DataProcessingModal 2951:80262 ("Data Processing Consent")
 *
 * All text verbatim from Figma. Each modal's "I understand and Accept" calls
 * onAccept (ticks the matching consent checkbox + closes) via the host section.
 */

const UNDER_18_BLUE = {
  variant: 'blue',
  title: 'Under 18?',
  body: 'If you are under 18, you can still register. A parent or guardian will be notified after you complete registration and can opt out on your behalf within 7 days.',
};

// ── 1. How the opt-out model works — Figma 2947:79682 ───────────────────────
const OPT_OUT_ITEMS = [
  {
    title: 'No action needed from you.',
    desc: "If you're happy for Kofi to be on GTH, just tick and move on.",
  },
  {
    title: 'Remove his access any time.',
    desc: 'One button in your parent dashboard. Access suspended within 60 seconds.',
  },
  {
    title: 'Reversal is possible.',
    desc: 'Changed your mind? Reinstate him any time — his profile is preserved.',
    highlight: true,
  },
  {
    title: 'Why immediate access?',
    desc: "Many families can't complete approvals online. GTH ensures no student is blocked because of their family's circumstances.",
  },
];

export const OptOutModal = ({ onClose, onAccept }) => {
  log('OptOutModal render');
  return (
    <ConsentModal
      title="Immediate access"
      titleAccent="what it means"
      intro={{
        title: "Kofi's account is already live",
        subtitle: "He registered himself. You don't need to approve anything.",
      }}
      footnote="Summary of 8 key points. For the full legal text, read the complete document."
      onClose={onClose}
      onAccept={onAccept}
    >
      {OPT_OUT_ITEMS.map((item, i) => (
        <ConsentListItem key={item.title} n={i + 1} {...item} />
      ))}
      <div className="pt-[8px]">
        <NoticeBox variant={UNDER_18_BLUE.variant} title={UNDER_18_BLUE.title}>
          {UNDER_18_BLUE.body}
        </NoticeBox>
      </div>
    </ConsentModal>
  );
};

// ── 2. Read Parent Rights Policy — Figma 2951:80104 ─────────────────────────
const PARENT_RIGHTS_ITEMS = [
  {
    title: "See Kofi's full profile",
    desc: "View everything he's submitted  info, education, talent tags  any time.",
  },
  {
    title: "Flag anything that's wrong",
    desc: 'Inaccurate info? Flag it. GTH reviews and responds within 5 business days.',
  },
  {
    title: 'Opt him out any time',
    desc: 'One button in your dashboard. Access suspended within 60 seconds. No forms.',
    highlight: true,
  },
  {
    title: 'Reinstate him if you change your mind',
    desc: 'Profile preserved during opt-out. Re-activate from the same dashboard.',
  },
  {
    title: "14 days' notice of changes",
    desc: 'GTH notifies you two weeks before any platform changes affecting minors.',
  },
  {
    title: 'Request a copy of his data',
    desc: "Email GTH and we'll send everything we hold within 10 business days.",
  },
];

export const ParentRightsModal = ({ onClose, onAccept }) => {
  log('ParentRightsModal render');
  return (
    <ConsentModal
      title="Your rights as a"
      titleAccent="parent"
      intro={{
        title: "Six rights you have as Kofi's parent on GTH",
        subtitle: 'Plain language : what each one lets you do',
      }}
      footnote="Summary of 8 key points. For the full legal text, read the complete document."
      onClose={onClose}
      onAccept={onAccept}
    >
      {PARENT_RIGHTS_ITEMS.map((item, i) => (
        <ConsentListItem key={item.title} n={i + 1} {...item} />
      ))}
      <div className="pt-[8px]">
        <NoticeBox variant={UNDER_18_BLUE.variant} title={UNDER_18_BLUE.title}>
          {UNDER_18_BLUE.body}
        </NoticeBox>
      </div>
    </ConsentModal>
  );
};

// ── 3. Data Processing Consent — Figma 2951:80262 ───────────────────────────
const DATA_ITEMS = [
  {
    title: 'Talent matching — your core GTH feature',
    desc: 'GTH analyses your profile to calculate your Talent Score and recommend relevant jobs, internships, and scholarships. Without this consent, matching does not work.',
    highlight: true,
  },
  {
    title: 'Recruiter discovery — being found',
    desc: 'Your profile is made visible to verified recruiters searching our platform. Sensitive details like your phone number and date of birth are never shown to recruiters.',
  },
  {
    title: 'Career guidance — personalised suggestions',
    desc: 'GTH uses your profile to suggest skills to add, courses to take, and career paths to consider. You will see these as prompts inside the platform.',
  },
  {
    title: 'Platform improvement — anonymised only',
    desc: 'You are consenting only to these four purposes. If GTH ever wants to use your data for anything else, we will ask for your separate permission first.',
  },
  {
    title: 'Your consent is explicit and specific',
    desc: 'Any privacy questions or requests: privacy@ghanatalenthub.com. We will respond within 10 business days.',
  },
  {
    title: 'You can withdraw consent at any time',
    desc: 'Go to Settings → Privacy → Withdraw Data Processing Consent. Your account stays active but you will no longer appear in recruiter searches or receive personalised matches.',
    highlight: true,
  },
  {
    title: 'Your acceptance is logged with a timestamp',
    desc: 'When you accept this consent, the date, time, and version are recorded and stored securely for at least 5 years as required by the Data Protection Act (Act 843, 2012).',
  },
];

export const DataProcessingModal = ({ onClose, onAccept }) => {
  log('DataProcessingModal render');
  return (
    <ConsentModal
      title="Data Processing"
      titleAccent="Consent"
      intro={{
        title: 'What you are explicitly consenting to',
        subtitle:
          '7 plain-language points about data processing — the what, why, and how to stop it.',
      }}
      footnote="Summary of 7 key points. Read the full Data Processing Consent document for complete legal text."
      onClose={onClose}
      onAccept={onAccept}
    >
      {DATA_ITEMS.map((item, i) => (
        <ConsentListItem key={item.title} n={i + 1} {...item} />
      ))}
      <div className="flex flex-col gap-[8px] pt-[8px]">
        <NoticeBox variant="amber" title="Important if you are under 18">
          Your parent or guardian will be notified of your registration and has the right to request
          account closure or withdrawal of consent on your behalf within 7 days.
        </NoticeBox>
        <NoticeBox variant="blue" title="Withdrawing consent does not delete your account">
          GTH complies with the Data Protection Act (Act 843, 2012). You can lodge a complaint with
          the Data Protection Commission of Ghana if you are unsatisfied with our response.
        </NoticeBox>
      </div>
    </ConsentModal>
  );
};
