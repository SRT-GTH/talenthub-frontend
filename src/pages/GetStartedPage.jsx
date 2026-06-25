import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import WavyDivider from '../components/shared/WavyDivider.jsx';
import {
  TalentIcon,
  ParentIcon,
  RecruiterIcon,
  ArrowRightIcon,
  LoadingSpinner,
} from '../components/shared/assets.jsx';
import { AUTH_ROUTES } from '../constants/authRoutes.js';
import { debug } from '../utils/debug.js';
import gridBg from '../assets/getStarted/grid.jpg';

const log = debug('GetStartedPage');

/*
 * GetStartedPage — onboarding role-selection screen.
 * Figma source: copy-of-record from the Figma Make export shared in chat
 * (1728×1117 frame). Three role cards (Talent / Parent-Guardian /
 * Company-Recruiter) drive a single-select group; the primary CTA stays
 * disabled until a role is picked.
 *
 * Layout follows the Card "selection-group pattern" documented in
 * wiki/components.md — selection state lives here in the parent.
 */

// Per-Figma the Talent variant ships four benefits; copy for the other
// roles isn't in the file yet, so all three reuse the Talent list. Swap
// in per-role copy once the Figma frames for Parent / Company land.
const TALENT_BENEFITS = [
  'Free talent assessment',
  'Verified Profile',
  'Smart Job Matching',
  'Career Guidance',
];

const ROLES = [
  {
    id: 'talent',
    tag: 'Talent',
    headline: "Let's build my future.",
    description:
      'Discover your strengths, build a verified profile and get matched with real opportunities.',
    ctaLabel: 'Continue as a Talent',
    benefits: TALENT_BENEFITS,
    icon: <TalentIcon />,
    // Destination = the role's sign-up entry (single source of truth).
    route: AUTH_ROUTES.talent.signUp,
  },
  {
    id: 'parent',
    tag: 'Parent/Guardian',
    headline: "I'm supporting my child.",
    description:
      "Stay involved, give consent and guide your child's opportunities every step of the way.",
    ctaLabel: 'Continue as a Parent',
    benefits: TALENT_BENEFITS,
    icon: <ParentIcon />,
    route: AUTH_ROUTES.parent.signUp,
  },
  {
    id: 'recruiter',
    tag: 'Company/Recruiter',
    headline: "I'm hiring Ghana's best.",
    description: 'Search verified, assessed profiles and connect with the right talent fast.',
    ctaLabel: 'Continue as a Recruiter',
    benefits: TALENT_BENEFITS,
    icon: <RecruiterIcon />,
    // No dedicated recruiter flow yet — routes to the institution onboarding
    // (the only org-side flow). Repoint here when a recruiter flow exists.
    route: AUTH_ROUTES.institution.signUp,
  },
];

// Benefits pill that appears under the cards once a role is selected.
// Figma source: node 2153:13850 ("WHAT YOU WOULD GET" pill inside the
// Talent-selected variant of node 2153:13443).
const BenefitsBar = ({ benefits }) => (
  <div className="flex h-[53px] w-full items-center justify-center gap-2.5 overflow-hidden rounded-[10px] border border-brand-green-light-active bg-neutral px-2.5 py-2">
    <span className="px-2.5 py-2 text-[12px] font-bold leading-5 tracking-[0.1px] text-neutral-dark">
      WHAT YOU WOULD GET
    </span>
    <ul className="flex items-center gap-3">
      {benefits.map((label, idx) => (
        <li key={label} className="flex items-center">
          {idx > 0 && (
            <span
              aria-hidden="true"
              className="mr-3 text-[24px] font-medium leading-9 text-neutral-darker"
            >
              ·
            </span>
          )}
          <span className="text-center text-[14px] font-medium leading-6 tracking-[0.2px] text-brand-green">
            {label}
          </span>
        </li>
      ))}
    </ul>
  </div>
);

const BackgroundOrbs = () => (
  // Decorative background layer (grid image + colored orbs). aria-hidden,
  // pointer-events-none — purely visual. Orbs render *on top* of the grid
  // because they appear later in source order.
  <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
    {/* Grid image — Figma source: imgGrid asset, 70% opacity, full bleed */}
    <img src={gridBg} alt="" className="absolute inset-0 size-full object-cover opacity-70" />
    {/* Green orb — top-left bleed */}
    <div
      className="absolute size-[571px] rounded-full opacity-60 blur-[100px]"
      style={{
        left: '-95px',
        top: '-178px',
        background: 'linear-gradient(180deg, #387440 0%, rgba(56,116,64,0.27) 51%, #69DA78 100%)',
      }}
    />
    {/* Gold orb — top-center */}
    <div
      className="absolute size-[473px] rounded-full opacity-10 blur-[100px]"
      style={{
        left: '39%',
        top: '122px',
        background: 'linear-gradient(180deg, #E8A832 0%, rgba(200,149,26,0.80) 51%, #C8951A 100%)',
      }}
    />
    {/* Red orb — bottom-right bleed */}
    <div
      className="absolute size-[571px] rounded-full opacity-15 blur-[100px] bg-danger"
      style={{ right: '-85px', bottom: '-160px' }}
    />
  </div>
);

const GetStartedPage = () => {
  log('mount');
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  log('selectedRole:', selectedRole, 'isLoading:', isLoading);

  const hasSelection = Boolean(selectedRole);
  const selectedRoleData = ROLES.find((r) => r.id === selectedRole);

  const handleContinue = () => {
    if (isLoading || !selectedRoleData) return;
    const dest = selectedRoleData.route;
    log('continue with role:', selectedRole, '→', dest);
    setIsLoading(true);
    // Short delay so the loading state is visible before navigation;
    // replace with the real /role POST when the endpoint lands.
    setTimeout(() => navigate(dest), 700);
  };

  return (
    <section className="relative min-h-[calc(100vh-160px)] overflow-hidden bg-white">
      <BackgroundOrbs />

      <div className="relative mx-auto flex max-w-[951px] flex-col items-center gap-16 px-6 py-16 md:py-24">
        {/* Inner content column: header + cards + benefits (gap-24) */}
        <div className="flex w-full flex-col items-center gap-6">
          {/* ---- header ------------------------------------------------ */}
          <div className="flex flex-col items-center gap-6 text-center">
            {/* Eyebrow pill */}
            <span className="inline-flex items-center gap-1.5 rounded-[10px] border border-accent-light-active bg-accent-light px-6 py-2.5">
              <span
                aria-hidden="true"
                className="size-2 rounded-full border-[1.5px] border-warning bg-accent-light shadow-[inset_0_0_4px_#E8A832]"
              />
              <span className="text-[12px] leading-[18px] tracking-[0.2px] text-neutral-darker">
                Ghana&apos;s next generation is ready.
              </span>
            </span>

            {/* Headline */}
            <h1
              className="font-display max-w-[792px] font-normal text-black"
              style={{ fontSize: 'clamp(2.25rem, 5vw, 4rem)', lineHeight: 1.25 }}
            >
              <span>Let&apos;s </span>
              <span className="text-accent">set things</span>
              <span> up just for </span>
              <span className="text-accent">you.</span>
            </h1>

            {/* Sub-copy */}
            <p className="max-w-[720px] px-2 text-[16px] leading-6 tracking-[0.2px] text-[#737373]">
              Your GTH experience is shaped around your role. Pick one to get started.
            </p>

            {/* Decorative wavy divider */}
            <WavyDivider />
          </div>

          {/* ---- role cards -------------------------------------------- */}
          <div
            role="radiogroup"
            aria-label="Choose your role"
            className="grid w-full grid-cols-1 gap-6 md:grid-cols-3 md:gap-[30px]"
          >
            {ROLES.map((role) => (
              <Card
                key={role.id}
                icon={role.icon}
                tag={role.tag}
                headline={role.headline}
                description={role.description}
                selected={selectedRole === role.id}
                onClick={() => setSelectedRole(role.id)}
                aria-label={`${role.tag}: ${role.headline}`}
              />
            ))}
          </div>

          {/* ---- "what you would get" benefits bar --------------------- */}
          {selectedRoleData && <BenefitsBar benefits={selectedRoleData.benefits} />}
        </div>

        {/* ---- CTA + login link ------------------------------------- */}
        <div className="flex w-full flex-col items-center gap-2">
          <Button
            variant="primary"
            size="lg"
            disabled={!hasSelection}
            leftIcon={isLoading ? <LoadingSpinner /> : undefined}
            rightIcon={isLoading ? undefined : <ArrowRightIcon />}
            onClick={handleContinue}
            className="w-full"
            aria-busy={isLoading}
          >
            {isLoading
              ? 'Setting things up'
              : selectedRoleData
                ? selectedRoleData.ctaLabel
                : 'Select a role to continue'}
          </Button>

          <p className="flex items-center gap-1 py-2 text-[14px] leading-6 tracking-[0.1px] text-[#737373]">
            Already have an account?
            <Link
              to="/login"
              className="font-semibold text-brand-green underline-offset-2 hover:underline"
            >
              Log in instead
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default GetStartedPage;
