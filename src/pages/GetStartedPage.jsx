import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import StickyActionBar from '../components/ui/form/StickyActionBar.jsx';
import { COMPACT_PRIMARY_BUTTON } from '../components/ui/form/mobileScale.js';
import WavyDivider from '../components/shared/WavyDivider.jsx';
import { ArrowRightIcon, LoadingSpinner } from '../components/shared/assets.jsx';
import studentDefault from '../assets/entry/role-student-default.svg';
import studentSelected from '../assets/entry/role-student-selected.svg';
import parentDefault from '../assets/entry/role-parent-default.svg';
import parentSelected from '../assets/entry/role-parent-selected.svg';
import recruiterDefault from '../assets/entry/role-recruiter-default.svg';
import recruiterSelected from '../assets/entry/role-recruiter-selected.svg';
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

// Per-role benefit lists straight from Figma roles frames (8027:201634 talent).
const TALENT_BENEFITS = [
  'Free talent assessment',
  'Verified Profile',
  'Smart Job Matching',
  'Career Guidance',
];

// Figma 8027:201147 (parent) and 8027:200660 (recruiter) "WHAT YOU WOULD GET" lists.
const PARENT_BENEFITS = [
  'Consent controls',
  'SMS notifications',
  'Match approvals',
  'Privacy first',
];
const RECRUITER_BENEFITS = [
  'Search 12K+ profiles',
  'Post opportunities',
  'AI matching',
  'Direct messaging',
];

const ROLES = [
  {
    id: 'talent',
    tag: 'Talent',
    headline: "Let's build my future.",
    description:
      'Discover your strengths, build a verified profile and get matched with real opportunities.',
    ctaLabel: 'Continue as a Talent',
    loaderLabel: 'Setting Things Up', // Figma 8027:201877 casing
    benefits: TALENT_BENEFITS,
    iconDefault: studentDefault, // Figma 8027:200876 / selected 8027:201850 (2153:11455 / 11555)
    iconSelected: studentSelected,
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
    loaderLabel: 'Setting things up', // 8027:201390
    benefits: PARENT_BENEFITS,
    iconDefault: parentDefault, // 8027:200877 / selected 8027:201364
    iconSelected: parentSelected,
    route: AUTH_ROUTES.parent.signUp,
  },
  {
    id: 'recruiter',
    tag: 'Company/Recruiter',
    headline: "I'm hiring Ghana's best.",
    description: 'Search verified, assessed profiles and connect with the right talent fast.',
    ctaLabel: 'Continue As A Recruiter', // Figma 8027:200660 verbatim casing
    loaderLabel: 'Setting things up', // 8027:200903
    benefits: RECRUITER_BENEFITS,
    iconDefault: recruiterDefault, // 8027:201852 / selected 8027:200878
    iconSelected: recruiterSelected,
    route: AUTH_ROUTES.recruiter.signUp,
  },
];

// Benefits pill that appears under the cards once a role is selected.
// Figma source: node 2153:13850 ("WHAT YOU WOULD GET" pill inside the
// Talent-selected variant of node 2153:13443).
// Role icon = exact Figma export (62x62, tile background included).
const RoleIcon = ({ role, selected, className }) => (
  <img
    src={selected ? role.iconSelected : role.iconDefault}
    alt=""
    aria-hidden="true"
    draggable={false}
    className={className ?? 'size-full'}
  />
);

const BenefitsBar = ({ benefits }) => (
  <div className="flex h-[53px] w-full items-center justify-center gap-2.5 overflow-hidden rounded-[10px] border border-brand-green-light-active bg-neutral px-2.5 py-2 max-md:h-auto max-md:flex-wrap max-md:gap-x-2 max-md:gap-y-0 max-md:py-1.5">
    <span className="px-2.5 py-2 max-md:py-0.5 text-[12px] font-bold leading-5 tracking-[0.1px] text-neutral-dark max-md:w-full max-md:text-center">
      WHAT YOU WOULD GET
    </span>
    <ul className="flex items-center gap-3 max-md:flex-wrap max-md:justify-center max-md:gap-x-2 max-md:gap-y-0">
      {benefits.map((label, idx) => (
        <li key={label} className="flex items-center">
          {idx > 0 && (
            <span
              aria-hidden="true"
              className="mr-3 max-md:mr-2 text-[24px] max-md:text-[16px] font-medium leading-9 max-md:leading-5 text-neutral-darker"
            >
              ·
            </span>
          )}
          <span className="text-center text-[14px] max-md:text-[13px] font-medium leading-6 max-md:leading-5 tracking-[0.2px] text-brand-green">
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

  // Radio-group arrow-key navigation (Left/Up = previous, Right/Down = next).
  const handleRadioKeys = (e, id) => {
    const keys = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'];
    if (!keys.includes(e.key)) return;
    e.preventDefault();
    const i = ROLES.findIndex((r) => r.id === id);
    const step = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1;
    const next = ROLES[(i + step + ROLES.length) % ROLES.length];
    log('arrow key ->', next.id);
    setSelectedRole(next.id);
    e.currentTarget.parentElement?.querySelector(`[data-role="${next.id}"]`)?.focus();
  };

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
    <section className="relative min-h-[calc(100vh-160px)] max-md:min-h-[calc(100dvh-53px)] overflow-clip bg-white">
      <BackgroundOrbs />

      <div className="relative mx-auto flex max-w-[951px] flex-col items-center gap-16 px-6 py-16 md:py-24 max-md:gap-3 max-md:px-4 max-md:py-4">
        {/* Inner content column: header + cards + benefits (gap-24) */}
        <div className="flex w-full flex-col items-center gap-6 max-md:gap-3">
          {/* ---- header ------------------------------------------------ */}
          <div className="flex flex-col items-center gap-6 text-center max-md:gap-2">
            {/* Eyebrow pill */}
            <span className="inline-flex items-center max-md:px-3 max-md:py-0.5 gap-1.5 rounded-[10px] border border-accent-light-active bg-accent-light px-6 py-2.5">
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
              className="font-heading max-w-[792px] font-semibold tracking-[-0.01em] text-black max-md:text-[24px]! max-md:leading-tight!"
              style={{ fontSize: 'clamp(2.25rem, 5vw, 3.375rem)', lineHeight: 1.1 }} // Figma 54/59.4 Bricolage 600
            >
              <span>Let&apos;s </span>
              <span className="text-accent">set things</span>
              <span> up just for </span>
              <span className="text-accent">you.</span>
            </h1>

            {/* Sub-copy */}
            <p className="max-w-[720px] px-2 text-[16px] max-md:text-[14px] leading-6 max-md:leading-5 tracking-[0.2px] text-[#737373]">
              Your GTH experience is shaped around your role. Pick one to get started.
            </p>

            {/* Decorative wavy divider */}
            <WavyDivider />
          </div>

          {/* ---- role cards -------------------------------------------- */}
          <div
            role="radiogroup"
            aria-label="Choose your role"
            className="grid w-full grid-cols-1 gap-6 max-md:hidden md:grid-cols-3 md:gap-[30px]"
          >
            {ROLES.map((role) => (
              <Card
                key={role.id}
                icon={<RoleIcon role={role} selected={selectedRole === role.id} />}
                tag={role.tag}
                headline={role.headline}
                headlineVariant="heading"
                description={role.description}
                selected={selectedRole === role.id}
                onClick={() => setSelectedRole(role.id)}
                onKeyDown={(e) => handleRadioKeys(e, role.id)}
                data-role={role.id}
                role="radio"
                aria-checked={selectedRole === role.id}
                aria-pressed={undefined}
                tabIndex={(selectedRole ?? ROLES[0].id) === role.id ? 0 : -1}
                aria-label={`${role.tag}: ${role.headline}`}
                // Figma 8027:200660: with a role chosen the other cards dim.
                className={
                  hasSelection && selectedRole !== role.id
                    ? 'opacity-55 hover:opacity-100 focus-visible:opacity-100'
                    : undefined
                }
              />
            ))}
          </div>
          {/* ---- phones: compact role rows (3 fit above the CTA bar) ---- */}
          <div
            role="radiogroup"
            aria-label="Choose your role"
            className="flex w-full flex-col gap-2 md:hidden"
          >
            {ROLES.map((role) => {
              const selected = selectedRole === role.id;
              return (
                <button
                  key={role.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  aria-label={`${role.tag}: ${role.headline}`}
                  onClick={() => setSelectedRole(role.id)}
                  className={`flex w-full items-center gap-3 rounded-[12px] border p-3 text-left transition-colors ${
                    selected
                      ? 'border-brand-green bg-brand-green-light'
                      : 'border-[#E7E7E7] bg-white'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-[#F2F2EE] text-content-tertiary [&>svg]:size-6"
                  >
                    <RoleIcon role={role} selected={selected} className="size-10 rounded-[10px]" />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="text-[12px] font-semibold uppercase leading-4 tracking-[0.6px] text-brand-green">
                      {role.tag}
                    </span>
                    <span className="text-[16px] font-semibold leading-5 text-black">
                      {role.headline}
                    </span>
                    <span className="text-[13px] leading-[18px] text-[#737373]">
                      {role.description}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className={`flex size-5 shrink-0 items-center justify-center rounded-full border-[1.5px] ${
                      selected ? 'border-brand-green' : 'border-[#CCCCCC]'
                    }`}
                  >
                    {selected && <span className="size-2.5 rounded-full bg-brand-green" />}
                  </span>
                </button>
              );
            })}
          </div>

          {/* ---- "what you would get" benefits bar --------------------- */}
          {selectedRoleData && <BenefitsBar benefits={selectedRoleData.benefits} />}
        </div>

        {/* ---- CTA + login link ------------------------------------- */}
        <div aria-live="polite" className="flex w-full flex-col items-center gap-2 max-md:contents">
          <StickyActionBar bleed={16}>
            <Button
              variant="primary"
              size="lg"
              disabled={!hasSelection}
              leftIcon={isLoading ? <LoadingSpinner /> : undefined}
              rightIcon={isLoading ? undefined : <ArrowRightIcon />}
              onClick={handleContinue}
              className={`w-full ${COMPACT_PRIMARY_BUTTON}`}
              aria-busy={isLoading}
            >
              {isLoading
                ? (selectedRoleData?.loaderLabel ?? 'Setting things up')
                : selectedRoleData
                  ? selectedRoleData.ctaLabel
                  : 'Select a role to continue'}
            </Button>
          </StickyActionBar>

          <p className="flex items-center gap-1 py-2 max-md:py-1 text-[14px] max-md:text-[13px] leading-6 max-md:leading-5 tracking-[0.1px] text-[#737373]">
            Already have an account?
            <Link
              to="/login"
              className="font-semibold text-brand-green underline-offset-2 hover:underline relative max-md:before:absolute max-md:before:-inset-x-1 max-md:before:-inset-y-2.5 max-md:before:content-['']"
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
