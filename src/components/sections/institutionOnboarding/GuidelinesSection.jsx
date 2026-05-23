import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../ui/Button.jsx';
import WavyDivider from '../../shared/WavyDivider.jsx';
import { ArrowRightIcon, LoadingSpinner } from '../../shared/assets.jsx';
import { debug } from '../../../utils/debug.js';

const log = debug('GuidelinesSection');

/*
 * GuidelinesSection — Institution bulk-onboarding splash / guidelines screen.
 * Figma main frame: 2971:65353, LEFT content column only.
 *
 * REFACTORED: renders the left content column only. The outer <section>,
 * page background glow ellipses, and InstitutionRightPanel are provided by
 * InstitutionOnboardingLayout (the shared route shell for all institution
 * onboarding steps).
 *
 * Route: /onboarding/institution/guidelines
 * Next:  /onboarding/institution/your-institution
 */

// ── sub-components ────────────────────────────────────────────────────────

const InstitutionTag = () => (
  <span
    className="inline-flex items-center rounded-[5px] bg-brand-green-light px-3 py-1"
    style={{ outline: '1px solid #387440', outlineOffset: '-1px' }}
  >
    <span
      className="text-[10px] font-medium leading-4 text-brand-green"
      style={{ letterSpacing: '0.2px' }}
    >
      Institution
    </span>
  </span>
);

const StepNumberBadge = ({ n, numberColor }) => (
  <span
    aria-hidden="true"
    className={`flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-green-light font-display italic ${numberColor}`}
    style={{
      fontSize: 16,
      outline: '1px solid #C1D4C4',
      outlineOffset: '-1px',
    }}
  >
    {n}
  </span>
);

const STEPS = [
  {
    number: '1',
    title: 'Your Institution',
    description: 'Legal name, institution type, region, and district to register the school.',
    numberColor: 'text-brand-green-dark',
  },
  {
    number: '2',
    title: 'Primary Contact',
    description: "Your name, role, email, and phone create your institution's admin account.",
    numberColor: 'text-brand-green-dark',
  },
  {
    number: '3',
    title: 'Accept & Go Live',
    description: 'Review your details, accept T&Cs, and activate your account immediately.',
    numberColor: 'text-brand-green-darker',
  },
];

// ── main export ───────────────────────────────────────────────────────────

const GuidelinesSection = () => {
  log('mount');

  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBegin = () => {
    if (isSubmitting) return;
    log('begin clicked — navigating to institution onboarding step 1');
    setIsSubmitting(true);
    setTimeout(() => navigate('/onboarding/institution/your-institution'), 600);
  };

  return (
    /* flex-1 fills the space beside InstitutionRightPanel in InstitutionOnboardingLayout */
    <div className="flex flex-1 items-center justify-center px-6 py-12 md:py-20">
      <div className="flex w-full max-w-[554px] flex-col items-center gap-6 text-center">
        <InstitutionTag />

        {/* Headline — Figma 2971:65523: Instrument Serif 64px/70px, tracking -0.64px */}
        <h1
          className="font-display font-normal text-black"
          style={{
            fontSize: 'clamp(2rem, 4.4vw, 4rem)',
            lineHeight: 1.094,
            letterSpacing: '-0.64px',
          }}
        >
          <span>Welcome. </span>
          <span>
            {"Here's what happens "}
            <span className="italic text-brand-green">next.</span>
          </span>
        </h1>

        <WavyDivider />

        {/* Sub-copy — Figma 2971:65535 */}
        <p
          className="max-w-[482px] text-[16px] leading-6 text-content-helper"
          style={{ letterSpacing: '0.2px' }}
        >
          {
            "Just a few questions. We'll use your answers to build a profile that works hard for you."
          }
        </p>

        {/* Time badge — Figma 2971:65537 */}
        <div
          className="inline-flex items-center gap-[6px] rounded-[8px] border bg-[#fffefc] px-4 py-1"
          style={{ borderColor: '#dbdbdb' }}
        >
          <span
            aria-hidden="true"
            className="shrink-0 rounded-full"
            style={{
              width: 8,
              height: 8,
              backgroundColor: '#e1eae2',
              border: '1.5px solid #1d7c4d',
              boxShadow: '0px 0px 4px 0px #006b3f',
            }}
          />
          <span
            className="text-[12px] leading-[18px] text-[#70706e]"
            style={{ letterSpacing: '0.2px' }}
          >
            About 4 minutes to complete
          </span>
        </div>

        {/* 3-step list */}
        <ol className="mt-2 w-full max-w-[511px] divide-y divide-[#E6E6E6] text-left">
          {STEPS.map((step) => {
            log('step render:', step.number, step.title);
            return (
              <li key={step.title} className="flex items-start gap-4 py-4">
                <StepNumberBadge n={step.number} numberColor={step.numberColor} />
                <div className="flex flex-col gap-1">
                  <p className="text-[16px] font-semibold leading-[18px] text-brand-green">
                    {step.title}
                  </p>
                  <p
                    className="text-[14px] leading-5 text-neutral-darker"
                    style={{ letterSpacing: '0.1px' }}
                  >
                    {step.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>

        {/* Primary CTA */}
        <Button
          type="button"
          variant="primary"
          size="lg"
          onClick={handleBegin}
          state={isSubmitting ? 'active' : undefined}
          disabled={isSubmitting}
          leftIcon={isSubmitting ? <LoadingSpinner stroke="#FEF1E7" /> : undefined}
          rightIcon={<ArrowRightIcon />}
          className="mt-3 w-full"
          aria-busy={isSubmitting}
        >
          {isSubmitting ? 'Setting Things Up' : "Let's Begin"}
        </Button>

        {/* Already-have-account link */}
        <div className="flex items-center gap-2 text-[14px] leading-6">
          <span className="text-content-helper" style={{ letterSpacing: '0.2px' }}>
            Already Have an account?
          </span>
          <Link
            to="/login"
            className="font-semibold text-brand-green underline-offset-2 hover:underline"
            style={{ letterSpacing: '0.1px' }}
          >
            Log in Instead
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GuidelinesSection;
