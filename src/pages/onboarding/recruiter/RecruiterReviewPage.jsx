import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RecruiterOnboardingShell from '../../../components/sections/recruiterOnboarding/RecruiterOnboardingShell.jsx';
import StepHeading from '../../../components/sections/recruiterOnboarding/closing/StepHeading.jsx';
import {
  buildSummary,
  initialsOf,
} from '../../../components/sections/recruiterOnboarding/closing/closingSummary.js';
import secRecruiter from '../../../assets/recruiter-onboarding/closing/section-recruiter.svg';
import secOrganisation from '../../../assets/recruiter-onboarding/closing/section-organisation.svg';
import secPlan from '../../../assets/recruiter-onboarding/closing/section-plan.svg';
import secPreferences from '../../../assets/recruiter-onboarding/closing/section-preferences.svg';
import bgGrid from '../../../assets/recruiter-onboarding/closing/bg-grid.png';
import Button from '../../../components/ui/Button.jsx';
import Checkbox from '../../../components/ui/form/Checkbox.jsx';
import StickyActionBar from '../../../components/ui/form/StickyActionBar.jsx';
import { ArrowRightIcon, LoadingSpinner } from '../../../components/shared/assets.jsx';
import { RECRUITER_ROUTES } from '../../../components/shared/recruiterOnboardingSteps.js';
import { useRecruiterOnboarding } from '../../../hooks/useRecruiterOnboarding.js';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';

const log = debug('RecruiterReviewPage');

/*
 * RecruiterReviewPage - /onboarding/recruiter/review (R08, "Review & Terms")
 * Figma: 7374:9838 not accepted, 7374:10128 all accepted. Full-width frame
 * (NO right panel -> panel={false}), 897px column, no sticky annotation in the
 * frame (the CTA is simply the last block; on phones it pins via
 * StickyActionBar like the other steps).
 *
 * Reads data.profile / recruiterType / organisation / plan / payment /
 * preferences through buildSummary() with the Figma demo values as fallbacks.
 * Writes setSection('terms', { accepted: true }) on submit.
 * CTA: disabled grey "Accept Both To Continue" until BOTH boxes are ticked,
 * then green "Activate My Recruiter Account" -> fake create (1.2 s)
 * -> /onboarding/recruiter/done.
 *
 * NOTE: the existing TermsModal / PrivacyPolicyModal copy is written for
 * students ("You must be a JHS student..."), so "Terms & Conditions" and
 * "Privacy Policy" are NOT linked to them (would show wrong legal text).
 */

const SECTIONS = (s) => [
  {
    key: 'profile',
    title: 'Recruiter profile',
    icon: secRecruiter,
    edit: RECRUITER_ROUTES.profile.path,
    cells: [
      ['Full name', s.fullName],
      ['Profile type', `Recruiter · ${s.type}`],
      ['Email address', `${s.email} ✓ verified`],
      ['Phone number', `${s.phone} ✓ verified`],
    ],
  },
  {
    key: 'organisation',
    title: 'Organisation',
    icon: secOrganisation,
    edit: RECRUITER_ROUTES.organisation.path,
    cells: [
      ['Organisation', s.orgFull],
      ['Your role', s.role],
      ['Primary Admin', s.primaryAdmin],
      ['Affiliation status', s.affiliationText],
    ],
  },
  {
    key: 'plan',
    title: 'Plan & billing',
    icon: secPlan,
    edit: RECRUITER_ROUTES.plan.path,
    cells: [
      ['Plan', s.planText],
      ['Amount', s.amountText],
      ['Payment method', s.paymentText],
      ['Next billing', s.nextBilling],
    ],
  },
  {
    key: 'preferences',
    title: 'Hiring preferences',
    icon: secPreferences,
    edit: RECRUITER_ROUTES.preferences.path,
    cells: [
      ['Hiring scope', s.scope],
      ['Experience levels', s.experienceText],
      ['Industries of interest', s.industriesText],
      ['How they’re used', 'Ranking only : not hard filters'],
    ],
  },
];

const createRecruiterAccount = (payload) =>
  // API-shaped seam: swap the body for the real call later.
  new Promise((resolve) => {
    log('createRecruiterAccount (mock)', Object.keys(payload));
    setTimeout(() => resolve({ ok: true }), 1200);
  });

const Cell = ({ label, value, strong }) => (
  <div className="flex min-w-0 flex-col gap-0.5 rounded-[10px] bg-[#f8f8f4] px-3 py-2">
    <dt
      className="text-[9px] font-bold uppercase leading-[11px] text-[#babab7] max-lg:text-[12px] max-lg:leading-4"
      style={{ letterSpacing: '0.6px' }}
    >
      {label}
    </dt>
    <dd
      className={classNames(
        'm-0 break-words text-[14px] leading-[17px]',
        strong ? 'font-semibold text-[#575755]' : 'text-[#70706e]'
      )}
    >
      {value}
    </dd>
  </div>
);

const Section = ({ title, edit, cells, icon }) => (
  <section aria-label={title} className="flex flex-col gap-3">
    <div className="flex items-center gap-2">
      <img src={icon} alt="" aria-hidden="true" className="size-[11px] shrink-0" />
      <h2
        className="text-[9px] font-bold uppercase leading-[11px] text-[#babab7] max-lg:text-[12px] max-lg:leading-4"
        style={{ letterSpacing: '1px' }}
      >
        {title}
      </h2>
      <Link
        to={edit}
        aria-label={`Edit ${title}`}
        className="relative inline-flex items-center rounded-[6px] border border-brand-green-light-active px-2 py-0.5 text-[10px] font-semibold uppercase leading-3 text-brand-green hover:bg-brand-green-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green max-lg:text-[12px] max-md:before:absolute max-md:before:-inset-x-2 max-md:before:-inset-y-3 max-md:before:content-['']"
        style={{ letterSpacing: '1px' }}
      >
        Edit
      </Link>
      <span aria-hidden="true" className="h-px flex-1 bg-[#1c2a21]/[0.06]" />
    </div>
    <dl className="m-0 grid grid-cols-[426fr_413fr] gap-x-[17px] gap-y-2 max-md:grid-cols-1">
      {cells.map(([l, v], i) => (
        <Cell key={l} label={l} value={v} strong={i % 2 === 1} />
      ))}
    </dl>
  </section>
);

const RecruiterReviewPage = () => {
  const navigate = useNavigate();
  const { data, setSection } = useRecruiterOnboarding();
  const s = buildSummary(data);
  const [terms, setTerms] = useState(Boolean(data.terms?.accepted));
  const [privacy, setPrivacy] = useState(Boolean(data.terms?.accepted));
  const [busy, setBusy] = useState(false);
  const alive = useRef(true);
  const allAccepted = terms && privacy;

  useEffect(() => {
    alive.current = true;
    log('mount', { affiliation: s.affiliation, tier: s.tierKey });
    return () => {
      alive.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!allAccepted || busy) return;
    setBusy(true);
    setSection('terms', { accepted: true });
    createRecruiterAccount({ profile: data.profile, organisation: data.organisation }).then(() => {
      if (!alive.current) return;
      log('navigate -> done');
      navigate(RECRUITER_ROUTES.done.path);
    });
  };

  return (
    <RecruiterOnboardingShell routeKey="review" panel={false} className="relative p-0! max-md:p-0!">
      <img
        src={bgGrid}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-full w-full object-cover object-top opacity-70"
      />
      <div className="relative flex w-full justify-center px-6 pt-12 pb-12 md:pt-16 max-md:px-4 max-md:pt-3 max-md:pb-3">
        <form
          onSubmit={onSubmit}
          noValidate
          className="flex w-full max-w-[897px] flex-col items-center gap-6 max-md:gap-3"
        >
          <StepHeading
            number="08"
            maxSize="4rem"
            label="Review & Terms"
            title={
              <>
                Almost <span className="text-brand-green">there.</span>
              </>
            }
            subtitle="Check your details — tap Edit next to any section to change it. Then accept the agreements to activate your recruiter account."
            subtitleClassName="max-w-[854px]"
          />

          <div className="flex w-full flex-col gap-10 max-md:gap-6">
            <div className="flex w-full flex-col overflow-hidden rounded-[24px] border border-[#1c2a21]/[0.08] bg-white shadow-[0_4px_0_0_rgba(28,42,33,0.08),0_12px_32px_-12px_rgba(28,42,33,0.12)]">
              <div className="flex items-center gap-3 border-b border-[#1c2a21]/[0.07] px-6 py-2.5 max-md:px-4">
                <span
                  aria-hidden="true"
                  className="flex size-[82px] shrink-0 items-center justify-center rounded-[36px] border-2 border-brand-green-light-active bg-brand-green-light font-heading text-[25px] font-semibold text-brand-green-dark max-md:size-14 max-md:text-[18px]"
                >
                  {initialsOf(s.fullName)}
                </span>
                <div className="flex min-w-0 flex-1 flex-col items-start gap-1">
                  <span
                    className="truncate text-[16px] font-semibold leading-6 text-[#575755]"
                    style={{ letterSpacing: '0.2px' }}
                  >
                    {s.fullName}
                  </span>
                  <span
                    className="rounded-[4px] border border-brand-green-light-active bg-brand-green-light px-1 py-[3px] text-[10px] max-lg:text-[12px] font-semibold leading-[13px] text-brand-green-dark"
                    style={{ letterSpacing: '0.2px' }}
                  >
                    Recruiter
                  </span>
                </div>
                <Link
                  to={RECRUITER_ROUTES.profile.path}
                  className="inline-flex min-h-[31px] items-center rounded-[14px] border-2 border-[#1c2a21]/30 bg-white px-3 text-[12px] font-bold leading-6 text-[#1c2a21] shadow-[0_2px_0_0_rgba(28,42,33,0.2)] hover:bg-brand-green-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green max-md:min-h-11"
                  style={{ letterSpacing: '0.1px' }}
                >
                  Edit profile
                </Link>
              </div>
              <div className="flex flex-col gap-6 px-6 pb-8 pt-4 max-md:gap-5 max-md:px-4 max-md:pb-5">
                {SECTIONS(s).map(({ key, ...sec }) => (
                  <Section key={key} {...sec} />
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 px-5 max-md:px-0">
                <h2
                  className="shrink-0 max-md:shrink text-[10px] font-bold uppercase leading-3 text-[#babab7] max-lg:text-[12px] max-lg:leading-4"
                  style={{ letterSpacing: '1px' }}
                >
                  Required agreements — both must be accepted
                </h2>
                <span aria-hidden="true" className="h-px flex-1 bg-[#1c2a21]/[0.07]" />
              </div>
              <div className="flex flex-col gap-4 px-5 py-5 max-md:px-0 max-md:py-3">
                <Checkbox
                  checked={terms}
                  onChange={(e) => {
                    log('terms', e.target.checked);
                    setTerms(e.target.checked);
                  }}
                  label="I agree to Ghana Talent Hub's Recruiter Terms & Conditions and Privacy Policy."
                  labelClassName="text-[14px] leading-5 text-[#575755]"
                />
                <Checkbox
                  checked={privacy}
                  onChange={(e) => {
                    log('privacy', e.target.checked);
                    setPrivacy(e.target.checked);
                  }}
                  label="I'll use talent data only for genuine hiring and respect each talent's privacy settings (Data Protection Act, 2012)."
                  labelClassName="text-[14px] leading-5 text-[#575755]"
                />
              </div>
              <div className="rounded-[12px] border border-[#e0e7f9] bg-[#eaeffb]/40 px-5 py-3.5">
                <p
                  className="m-0 text-[12px] font-bold leading-5 text-[#3062d4]"
                  style={{ letterSpacing: '0.1px' }}
                >
                  Your data is protected under Ghanaian law
                </p>
                <p
                  className="m-0 mt-1.5 max-w-[725px] text-[12px] leading-[18px] text-[#3062d4]"
                  style={{ letterSpacing: '0.2px' }}
                >
                  Ghana Talent Hub complies with the Data Protection Act (Act 843, 2012). You can
                  withdraw consent, request access to your data, or request deletion at any time
                  from Settings → Privacy.
                </p>
              </div>
            </div>
          </div>

          <StickyActionBar bleed={16}>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={!allAccepted || busy}
              state={busy ? 'active' : undefined}
              leftIcon={busy ? <LoadingSpinner stroke="#FEF1E7" /> : undefined}
              rightIcon={<ArrowRightIcon />}
              className="mt-2 w-full"
              aria-busy={busy}
            >
              {allAccepted ? 'Activate My Recruiter Account' : 'Accept Both To Continue'}
            </Button>
          </StickyActionBar>

          <div className="flex items-center gap-2 text-[14px] leading-6 max-md:text-[13px] max-md:leading-5">
            <span className="text-[#737373]" style={{ letterSpacing: '0.2px' }}>
              Already Have an account?
            </span>
            <Link
              to="/login"
              className="relative font-semibold text-brand-green underline-offset-2 hover:underline max-md:before:absolute max-md:before:-inset-x-1 max-md:before:-inset-y-2.5 max-md:before:content-['']"
              style={{ letterSpacing: '0.1px' }}
            >
              Log in Instead
            </Link>
          </div>
        </form>
      </div>
    </RecruiterOnboardingShell>
  );
};

export default RecruiterReviewPage;
