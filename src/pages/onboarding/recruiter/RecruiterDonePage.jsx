import { useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import RecruiterOnboardingShell from '../../../components/sections/recruiterOnboarding/RecruiterOnboardingShell.jsx';
import {
  buildSummary,
  initialsOf,
  orgMark,
} from '../../../components/sections/recruiterOnboarding/closing/closingSummary.js';
import iconTrend from '../../../assets/recruiter-onboarding/closing/icon-trade-up.svg';
import iconSearch from '../../../assets/recruiter-onboarding/closing/icon-search.svg';
import iconBuilding from '../../../assets/recruiter-onboarding/closing/icon-building.svg';
import iconCheckFill from '../../../assets/recruiter-onboarding/closing/icon-check-circle-fill.svg';
import iconWarning from '../../../assets/recruiter-onboarding/closing/icon-warning.svg';
import iconArrow from '../../../assets/recruiter-onboarding/closing/icon-arrow-right-sm.svg';
import heroWave from '../../../assets/recruiter-onboarding/closing/hero-wave.svg';
import bgGrid from '../../../assets/recruiter-onboarding/closing/bg-grid.png';
import Button from '../../../components/ui/Button.jsx';
import { useRecruiterOnboarding } from '../../../hooks/useRecruiterOnboarding.js';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';

const log = debug('RecruiterDonePage');

// Monthly job-post allowance per plan (backend PLAN_CATALOGUE / plan cards).
const JOB_POSTS = {
  free: '1 job post',
  professional: '20 job posts',
  enterprise: 'unlimited job posts',
};

/*
 * RecruiterDonePage - /onboarding/recruiter/done (R09)
 * Figma: 7374:10419 Active (Professional plan), 7374:10565 Active - affiliation
 * pending, 7374:10711 Primary Admin of new organisation. ONE page, three
 * variants picked from the provider:
 *   organisation.affiliation  /admin|owner|creat/ -> admin   (10711)
 *                             /pending/           -> pending (10565)
 *                             anything else / empty -> active (10419, demo default)
 * The plan tier fills the active banner + hero pill ("Pro" / "plan active" /
 * "Professional"; Free tier is an ASSUMED derivation, Figma has no Free-active
 * frame). The frame has NO breadcrumb (hideHeader; the logo / Log In bar is the
 * app layout's) and NO right panel (panel={false}); the hero is full-bleed.
 * Demo hook: ?variant=pending|admin|active overrides the provider-derived variant.
 * CTA "Go To Recruiter Dashboard" -> /recruiter/home (no sticky annotation).
 */

const DASHBOARD = '/recruiter/home';

const buildVariant = (s) => {
  const org = s.orgName;
  if (s.affiliation === 'admin') {
    return {
      key: 'admin',
      badge: {
        eyebrow: 'Admin',
        mark: initialsOf(org),
        sub: org.replace(/\s+Ghana$/i, ''),
        pill: 'Admin',
      },
      banner: {
        tone: 'ok',
        text: `You're the Primary Admin of ${org}  approve recruiters, manage billing and analytics.`,
      },
      cards: [
        {
          icon: iconTrend,
          title: 'Post your first job',
          body: `Your ${s.tier} plan includes ${JOB_POSTS[s.tierKey] || '1 job post'} this month.`,
          cta: 'Post a job',
          to: '/recruiter/job-postings',
        },
        {
          icon: iconSearch,
          title: 'Search talent',
          body: 'Filter by skills, education and location. You only see what each talent allows.',
          cta: 'Start searching',
          to: '/recruiter/talent-search',
        },
        {
          icon: iconBuilding,
          title: 'Invite your team',
          body: 'Colleagues create their own recruiter profiles and request to join — you approve them.',
          cta: 'Open',
          to: DASHBOARD,
        },
      ],
    };
  }
  if (s.affiliation === 'pending') {
    return {
      key: 'pending',
      badge: { eyebrow: 'Recruiter', mark: orgMark(org), sub: 'awaiting admin', pill: 'Pending' },
      banner: {
        tone: 'warn',
        text: `Waiting for ${s.primaryAdmin} to approve you joining ${org}  you can post under your own name now.`,
      },
      cards: [
        {
          icon: iconTrend,
          title: 'Post your first job',
          body: `Jobs show your name until ${org} approves you.`,
          cta: 'Post a job',
          to: '/recruiter/job-postings',
        },
        {
          icon: iconSearch,
          title: 'Search talent',
          body: 'Filter by skills, education and location. You only see what each talent allows.',
          cta: 'Start searching',
          to: '/recruiter/talent-search',
        },
        {
          icon: iconBuilding,
          title: 'Track your request',
          body: `See the status of your ${org} affiliation in Settings → Organisation.`,
          cta: 'Open',
          to: DASHBOARD,
        },
      ],
    };
  }
  return {
    key: 'active',
    badge: {
      eyebrow: 'Recruiter',
      mark: s.isFree ? 'Free' : s.tier.slice(0, 3),
      sub: 'plan active',
      pill: s.tier,
    },
    banner: {
      tone: 'ok',
      text: s.isFree
        ? 'Your Free plan is active. 1 job post this month.'
        : `Your ${s.tier} plan is active. 20 job posts and 50 InMails this month.`,
    },
    cards: [
      {
        icon: iconTrend,
        title: 'Post your first job',
        body: `Jobs show your name and ${org}.`,
        cta: 'Post a job',
        to: '/recruiter/job-postings',
      },
      {
        icon: iconSearch,
        title: 'Search talent',
        body: 'Filter by skills, education and location. You only see what each talent allows.',
        cta: 'Start searching',
        to: '/recruiter/talent-search',
      },
      {
        icon: iconBuilding,
        title: 'Set up your organisation page',
        body: `Add a logo and description so talent recognise ${org}.`,
        cta: 'Open',
        to: DASHBOARD,
      },
    ],
  };
};

const RecruiterDonePage = () => {
  const navigate = useNavigate();
  const { data } = useRecruiterOnboarding();
  // Demo hook: ?variant=pending|admin|active forces a variant (DemoNavigator / QA); real flow uses provider data.
  const [params] = useSearchParams();
  const forced = params.get('variant');
  const base = buildSummary(data, { defaultAffiliation: 'active' });
  const s = forced
    ? buildSummary(
        { ...data, organisation: { ...data.organisation, affiliation: forced } },
        { defaultAffiliation: 'active' }
      )
    : base;
  const v = buildVariant(s);

  useEffect(() => {
    log('mount', { variant: v.key, tier: s.tierKey });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <RecruiterOnboardingShell routeKey="done" hideHeader panel={false} className="p-0! max-md:p-0!">
      <div
        className="relative w-full"
        style={{
          background:
            'radial-gradient(40% 35% at 6% 62%, rgba(249,235,234,0.95), rgba(249,235,234,0) 100%), radial-gradient(38% 38% at 96% 70%, rgba(240,212,190,0.75), rgba(240,212,190,0) 100%), #fff',
        }}
      >
        <section
          aria-labelledby="done-title"
          className="relative z-10 overflow-hidden text-center text-white"
          style={{
            background:
              'radial-gradient(600px 480px at 50% 0%, rgba(56,116,64,0.35), rgba(56,116,64,0) 65%), linear-gradient(135deg, #142916 0%, #2a5730 100%)',
          }}
        >
          <div className="relative mx-auto flex flex-col items-center px-6 pt-[clamp(32px,5.3vw,89px)] pb-[clamp(48px,6.6vw,110px)] max-md:px-4">
            <div
              className="relative flex size-[148px] flex-col items-center justify-center rounded-full border-4 border-white/[0.12] bg-white shadow-[0_20px_48px_rgba(0,0,0,0.3),0_0_0_10px_rgba(255,255,255,0.03),0_0_0_22px_rgba(255,255,255,0.06)] max-md:size-[124px]"
              aria-hidden="true"
            >
              <span
                className="text-[8px] font-bold uppercase leading-[10px] text-[#babab7]"
                style={{ letterSpacing: '1px' }}
              >
                {v.badge.eyebrow}
              </span>
              <span
                className="font-heading text-[44px] font-semibold leading-[48px] text-brand-green max-md:text-[36px]"
                style={{ letterSpacing: '-0.88px' }}
              >
                {v.badge.mark}
              </span>
              <span className="text-[9px] font-semibold leading-[11px] text-[#babab7]">
                {v.badge.sub}
              </span>
              <span
                className="absolute -bottom-2.5 rounded-full bg-[#c8951a] px-3.5 py-1 text-[10px] font-bold uppercase leading-3 text-white shadow-[0_4px_10px_rgba(0,0,0,0.25)]"
                style={{ letterSpacing: '0.5px' }}
              >
                {v.badge.pill}
              </span>
            </div>
            <div className="mt-[33px] flex flex-col items-center gap-3">
              <h1
                id="done-title"
                className="font-heading font-semibold text-white"
                style={{
                  fontSize: 'clamp(2rem, 4.2vw, 2.625rem)',
                  lineHeight: 1.1,
                  letterSpacing: '-0.84px',
                }}
              >
                Welcome to
                <br />
                Ghana Talent Hub,{s.firstName}.
              </h1>
              <p className="m-0 max-w-[420px] text-[14px] leading-6 text-white/60">
                Your account is live.{' '}
                <strong className="font-bold text-white/90">
                  Post jobs and discover verified talent across Ghana from today.
                </strong>
              </p>
            </div>
          </div>
          <img
            src={heroWave}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-auto w-full"
          />
        </section>

        <img
          src={bgGrid}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 -z-0 h-[60%] w-full object-cover opacity-70"
        />
        <div className="relative mx-auto flex w-full max-w-[945px] flex-col gap-5 px-6 pt-5 pb-10 max-md:px-4">
          <p
            role="status"
            className={classNames(
              'm-0 flex items-start gap-3 rounded-2xl border px-5 py-4 text-[16px] leading-7 max-md:px-4 max-md:text-[14px] max-md:leading-6',
              v.banner.tone === 'warn'
                ? 'border-[#c8951a]/35 bg-[#faf4e8] text-[#463409]'
                : 'border-brand-green/35 bg-brand-green-light/50 text-brand-green-dark'
            )}
            style={{ letterSpacing: '0.2px' }}
          >
            <img
              src={v.banner.tone === 'warn' ? iconWarning : iconCheckFill}
              alt=""
              aria-hidden="true"
              className="size-[22px] shrink-0"
            />
            <span>{v.banner.text}</span>
          </p>

          <ul className="m-0 grid list-none grid-cols-3 gap-4 p-0 max-lg:grid-cols-1">
            {v.cards.map(({ icon, title, body, cta, to }) => (
              <li
                key={title}
                className="flex flex-col gap-2.5 rounded-2xl border border-[#e0e3de] bg-white px-6 py-[18px] shadow-[0_1px_2px_rgba(15,15,10,0.05),0_6px_16px_rgba(15,15,10,0.07)]"
              >
                <span
                  aria-hidden="true"
                  className="flex size-11 items-center justify-center rounded-[10px] bg-brand-green-light"
                >
                  <img src={icon} alt="" aria-hidden="true" className="size-[22px]" />
                </span>
                <h2
                  className="m-0 text-[16px] font-medium leading-7 text-[#111111]"
                  style={{ letterSpacing: '0.2px' }}
                >
                  {title}
                </h2>
                <p
                  className="m-0 text-[14px] leading-6 text-[#575755]"
                  style={{ letterSpacing: '0.2px' }}
                >
                  {body}
                </p>
                <Link
                  to={to}
                  className="relative inline-flex w-fit items-center gap-1.5 text-[14px] font-medium leading-6 text-brand-green hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green max-md:before:absolute max-md:before:-inset-y-2.5 max-md:before:inset-x-0 max-md:before:content-['']"
                  style={{ letterSpacing: '0.2px' }}
                >
                  {cta}
                  <img src={iconArrow} alt="" aria-hidden="true" className="size-4" />
                </Link>
              </li>
            ))}
          </ul>

          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={() => {
              log('cta -> dashboard');
              navigate(DASHBOARD);
            }}
          >
            Go To Recruiter Dashboard
          </Button>
        </div>
      </div>
    </RecruiterOnboardingShell>
  );
};

export default RecruiterDonePage;
