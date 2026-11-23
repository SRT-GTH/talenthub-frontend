import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';
import { ArrowRightIcon, GenzDoodleStar } from '../../components/shared/assets.jsx';
import checkIco from '../../assets/talent-onboarding/done-check.svg';
import checkCircleIco from '../../assets/talent-onboarding/done-check-circle.svg';
import verifiedFocusedIco from '../../assets/talent-onboarding/done-verified-focused.svg';
import verifiedPlayfulIco from '../../assets/talent-onboarding/done-verified-playful.svg';
import statBonusIco from '../../assets/talent-onboarding/done-stat-bonus.svg';
import statBadgesIco from '../../assets/talent-onboarding/done-stat-badges.svg';
import statRankIco from '../../assets/talent-onboarding/done-stat-rank.svg';
import mailIco from '../../assets/talent-onboarding/done-welcome-mail.svg';
import chevronIco from '../../assets/talent-onboarding/done-chevron-right.svg';
import nextSkillsIco from '../../assets/talent-onboarding/done-next-skills-bolt.svg';
import nextPhotoIco from '../../assets/talent-onboarding/done-next-photo-camera.svg';
import nextJobsIco from '../../assets/talent-onboarding/done-next-jobs-briefcase.svg';
import nextMentorsIco from '../../assets/talent-onboarding/done-next-mentors-users.svg';
import spotSent from '../../assets/talent-onboarding/done-spot-sent.svg';
import spotSkills from '../../assets/talent-onboarding/done-spot-skills.svg';
import spotPhoto from '../../assets/talent-onboarding/done-spot-photo.svg';
import spotJobs from '../../assets/talent-onboarding/done-spot-jobs.svg';
import spotMentors from '../../assets/talent-onboarding/done-spot-mentors.svg';
import waveSvg from '../../assets/talent-onboarding/done-wave.svg';
import { classNames } from '../../utils/classNames.js';
import { debug } from '../../utils/debug.js';
import TermsModal from '../../components/shared/TermsModal.jsx';
import PrivacyPolicyModal from '../../components/shared/PrivacyPolicyModal.jsx';
import { readDoneSummary } from '../../services/onboardingReview.js';

const log = debug('OnboardingDonePage');

/*
 * OnboardingDonePage — the talent sign-up success screen (/onboarding/talent/done), frontend-only with mock data.
 *
 * Two looks, following the sign-up style switch (UiStyleScope puts data-ui-style on <html>):
 *   Focused: dark green hero with the talent-score ring (gold "Gold Tier" pill), then a 640px column of quiet
 *     white cards (1px hairline, soft shadow, radius 20): steps completed, stats (+50 pts, badges, rank), a
 *     welcome-email banner, "What to do next" rows with small duotone icons in mint tiles and pale-gold "pts"
 *     pills, a green gradient share card with a gold "Copy link" button, the two CTAs and a one-line footer.
 *   Playful: same content; cards get the ink edge and hard 4px ink shadow, step tiles get a green edge, the
 *     ring's tier pill becomes a tilted gold sticker with doodle stars, stars float in the hero, a tilted
 *     "YOU'RE IN!" sticker hangs off the steps card, "Boost your score" is a sticker, the next-step rows use the
 *     sticker-style spot illustrations, points read "XP" in gold ink-edged pills, headings use Bricolage.
 * ⚠️ ASSUMPTION: the success frames also show a confetti burst (a prototype animation); not built.
 * Live mode (a summary saved by Review after activation) shows the person's own steps and leaves out the score,
 * stats and points, because none exist until the profile is built after sign-in.
 */

const DEMO = {
  name: 'Abena',
  score: 78,
  tier: 'Gold Tier',
  bonus: 50,
  badges: '3',
  rank: '#1,548',
};

const STEPS = [
  ['Role', 'Student'],
  ['Date of birth', 'Verified'],
  ['Personal info', 'Abena Mensah'],
  ['Contact', 'Phone verified'],
  ['Address', 'Kumasi, Ashanti Region'],
  ['Education', 'KNUST · Year 2'],
];

const liveSteps = (s) => [
  ['Role', s.role || 'Talent'],
  ['Date of birth', s.isMinor ? 'Verified · under 18' : 'Verified'],
  ['Personal info', s.fullName || '—'],
  ['Contact', 'Phone and email verified'],
  ['Address', s.region || '—'],
  ['Education', s.education || 'Not currently studying'],
  ...(s.isMinor
    ? [['Parent or guardian', s.guardianNotified ? 'Notified by email' : 'Added']]
    : []),
];

const NEXT_LINKS = {
  skills: '/profile/filling/skills',
  photo: '/profile',
  jobs: '/job-postings',
  mentors: '/community',
};

const NEXT = [
  {
    id: 'skills',
    title: 'Add your skills',
    body: 'Tell us what you are good at: coding, writing, design, leadership.',
    points: 25,
    icon: nextSkillsIco,
    spot: spotSkills,
  },
  {
    id: 'photo',
    title: 'Upload a profile photo',
    body: 'Profiles with photos get 3× more recruiter views.',
    points: 10,
    icon: nextPhotoIco,
    spot: spotPhoto,
  },
  {
    id: 'jobs',
    title: 'Browse opportunities',
    body: 'Jobs, internships and scholarships matched to your profile.',
    icon: nextJobsIco,
    spot: spotJobs,
  },
  {
    id: 'mentors',
    title: 'Connect with mentors',
    body: 'Find professionals in your field for guidance and advice.',
    icon: nextMentorsIco,
    spot: spotMentors,
  },
];

// Card chrome: Focused hairline + soft shadow; Playful ink edge + hard ink shadow.
const CARD =
  'relative w-full rounded-[20px] border border-[rgba(28,42,33,0.1)] bg-white shadow-[0_2px_4px_rgba(28,42,33,0.04),0_1px_1px_rgba(28,42,33,0.04)] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[0_12px_14px_rgba(28,42,33,0.06),4px_4px_0_rgba(28,42,33,0.45)]';
const CARD_LABEL = 'text-[11px] font-bold uppercase tracking-[0.9px] text-[#70706e]';
const STICKER =
  'whitespace-nowrap rounded-[8px] border-[1.2px] border-[#1c2a21] bg-[#ffd86b] px-[11px] py-[5px] font-bold text-[#1c2a21] shadow-[2px_2px_0_#1c2a21]';

const Img = ({ src, size, className }) => (
  <img
    src={src}
    alt=""
    aria-hidden="true"
    width={size}
    height={size}
    className={classNames('shrink-0', className)}
    draggable={false}
  />
);

// "+25 pts" (Focused, pale gold pill) / "+25 XP" (Playful, gold ink-edged pill).
const PointsPill = ({ value }) => (
  <>
    <span className="shrink-0 whitespace-nowrap rounded-full bg-[#fbf1da] px-2.5 py-1 text-[12px] font-semibold text-[#785910] playful:hidden">
      +{value} pts
    </span>
    <span className="hidden shrink-0 whitespace-nowrap rounded-full border border-[#1c2a21] bg-[#ffd86b] px-2 py-[3px] text-[11px] font-bold text-[#1c2a21] playful:inline-block">
      +{value} XP
    </span>
  </>
);

// Doodle stars around the hero copy (Playful only), placed from the page centre line.
const HERO_STARS = [
  { dx: -340, top: 242, size: 22, color: '#FFD86B' },
  { dx: 320, top: 232, size: 14, color: '#FFD86B' },
  { dx: 310, top: 342, size: 12, color: '#99CC99' },
  { dx: -310, top: 352, size: 10, color: '#FFD86B' },
];

const OnboardingDonePage = () => {
  const navigate = useNavigate();
  const [live] = useState(readDoneSummary);
  const name = live?.firstName || (live ? 'friend' : DEMO.name);
  const steps = live ? liveSteps(live) : STEPS;
  const next = live && live.photoUploaded ? NEXT.filter((n) => n.id !== 'photo') : NEXT;
  const [copied, setCopied] = useState(false);
  // 'privacy' | 'terms' | null — footer links open the legal summary modals in place.
  const [legalModal, setLegalModal] = useState(null);

  useEffect(() => {
    log('mount', live ? { live: true, isMinor: live.isMinor } : DEMO);
  }, [live]);

  useEffect(() => {
    if (!copied) return undefined;
    const t = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(t);
  }, [copied]);

  const copyLink = () => {
    log('copy link');
    try {
      navigator.clipboard?.writeText(window.location.origin);
    } catch (e) {
      log('clipboard unavailable', e);
    }
    setCopied(true);
  };

  const heroLine = live?.isMinor
    ? "Log in and build your profile. We've emailed your parent or guardian about GTH."
    : live
      ? 'Log in and build your profile so recruiters and institutions can find you.'
      : 'Recruiters and institutions across Ghana can now discover you.';

  return (
    <section className="relative flex w-full min-h-0 flex-1 flex-col overflow-y-auto no-scrollbar">
      {/* Hero */}
      <div
        className="relative isolate shrink-0 overflow-hidden"
        style={{
          background: 'linear-gradient(163deg, #142916 0%, #2A5730 100%)',
          minHeight: 'clamp(430px, 29.6vw, 511px)',
        }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 -top-[120px] -z-10 h-[480px] w-[600px] -translate-x-1/2 rounded-[270px]"
          style={{
            background: 'radial-gradient(circle, rgba(56,116,64,0.35) 0%, rgba(56,116,64,0) 65%)',
          }}
        />
        {HERO_STARS.map((s) => (
          <GenzDoodleStar
            key={`${s.dx}-${s.top}`}
            size={s.size}
            color={s.color}
            className="pointer-events-none absolute hidden playful:block max-md:hidden!"
            style={{ left: `calc(50% + ${s.dx}px)`, top: s.top }}
          />
        ))}
        <div className="mx-auto flex max-w-[760px] flex-col items-center px-6 pt-[52px] pb-24 text-center">
          {live ? null : (
            <div className="relative flex size-[148px] flex-col items-center justify-center rounded-full border-4 border-[rgba(255,255,255,0.12)] bg-white shadow-[0_0_0_10px_rgba(255,255,255,0.06),0_0_0_22px_rgba(255,255,255,0.03),0_12px_34px_rgba(0,0,0,0.15)] playful:shadow-[0_0_0_10px_rgba(255,255,255,0.06),0_0_0_22px_rgba(255,255,255,0.03),0_20px_48px_rgba(0,0,0,0.3)]">
              <span className="font-ui text-[11px] font-bold uppercase tracking-[1px] text-[#6b6b6b]">
                Talent Score
              </span>
              <span className="text-[49px] font-semibold leading-[1.1] tracking-[-0.98px] text-brand-green playful:font-heading">
                {DEMO.score}
              </span>
              <span className="font-ui text-[11px] font-semibold text-[#6b6b6b]">out of 100</span>
              {/* Tier: Focused gold pill; Playful tilted gold sticker. */}
              <span className="absolute -bottom-[13px] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-[rgba(28,42,33,0.1)] bg-[#c8951a] px-[13px] py-[2px] font-ui text-[11px] font-bold uppercase leading-[15px] tracking-[0.5px] text-[#1c2a21] playful:hidden">
                {DEMO.tier}
              </span>
              <span className="absolute -bottom-[17px] left-1/2 hidden -translate-x-1/2 rotate-[4deg] playful:block">
                <span
                  className={classNames(
                    STICKER,
                    'block px-[12px] py-[3px] font-ui text-[11px] uppercase leading-[15px] tracking-[0.5px]'
                  )}
                >
                  {DEMO.tier}
                </span>
              </span>
              <GenzDoodleStar
                size={16}
                color="#C8951A"
                className="absolute hidden playful:block"
                style={{ left: 125, top: 124 }}
              />
              <GenzDoodleStar
                size={10}
                color="#C8951A"
                className="absolute hidden playful:block"
                style={{ left: 147, top: 142 }}
              />
              <GenzDoodleStar
                size={9}
                color="#387440"
                className="absolute hidden playful:block"
                style={{ left: 1, top: 146 }}
              />
            </div>
          )}

          <h1
            className={classNames(
              'font-semibold text-white playful:font-heading',
              live ? 'mt-2' : 'mt-[42px]'
            )}
            style={{
              fontSize: 'clamp(2rem, 4vw, 2.625rem)',
              lineHeight: 1.1,
              letterSpacing: '-0.84px',
            }}
          >
            Welcome to
            <br />
            <span className="text-[#c1d4c4]">Ghana Talent Hub,</span>
            <br />
            {name}.
          </h1>

          <p className="mt-5 max-w-[640px] text-[16px] text-white opacity-85 max-md:text-[14px]">
            {live ? 'Your account is ready. ' : 'Your profile is live. '}
            <strong className="font-semibold">{heroLine}</strong>
          </p>
        </div>
        {/* Wave edge */}
        <img
          src={waveSvg}
          alt=""
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 block h-[63px] w-full max-w-none"
          style={{ objectFit: 'fill' }}
          draggable={false}
        />
      </div>

      {/* Content column */}
      <div className="flex flex-1 justify-center px-4 pt-[61px] pb-10 max-md:pt-8">
        <div className="flex w-full max-w-[640px] flex-col gap-5">
          {/* Steps completed */}
          <div className={classNames(CARD, 'flex flex-col gap-4 p-6 max-md:p-4')}>
            <span
              aria-hidden="true"
              className={classNames(
                STICKER,
                'pointer-events-none absolute left-[22px] top-[-14px] hidden rotate-[5deg] text-[12px] tracking-[0.5px] playful:block'
              )}
            >
              YOU&apos;RE IN!
            </span>
            <div className="flex items-center justify-between gap-3">
              <span className={CARD_LABEL}>All steps completed</span>
              <span className="inline-flex shrink-0 items-center gap-[5px] rounded-full bg-brand-green-light px-2.5 py-1 text-[12px] font-semibold text-brand-green">
                <Img src={checkIco} size={14} />
                {steps.length + 1} of {steps.length + 1} done
              </span>
            </div>
            <ul className="grid grid-cols-2 gap-2.5 max-sm:grid-cols-1">
              {steps.map(([title, sub]) => (
                <li
                  key={title}
                  className="flex min-w-0 items-center gap-2.5 rounded-[12px] bg-brand-green-light p-3 playful:border playful:border-brand-green"
                >
                  <Img src={checkCircleIco} size={22} />
                  <span className="flex min-w-0 flex-col gap-0.5">
                    <span className="text-[14px] font-semibold text-[#1c2a21]">{title}</span>
                    <span className="truncate text-[12px] text-[#6b6b6b]">{sub}</span>
                  </span>
                </li>
              ))}
              <li className="col-span-2 flex items-center gap-2.5 rounded-[12px] bg-[#fbf1da] p-3 text-[#785910] max-sm:col-span-1 playful:border playful:border-[rgba(200,149,26,0.5)]">
                <Img src={verifiedFocusedIco} size={22} className="playful:hidden" />
                <Img src={verifiedPlayfulIco} size={22} className="hidden playful:block" />
                <span className="flex flex-col gap-0.5">
                  <span className="text-[14px] font-semibold">Terms &amp; legal agreements</span>
                  <span className="text-[12px]">Accepted · timestamp recorded</span>
                </span>
              </li>
            </ul>
          </div>

          {/* Stats (demo only: no points, badges or rank exist before the profile is built) */}
          {live ? null : (
            <dl className={classNames(CARD, 'grid grid-cols-3 px-6 py-5 max-md:px-3')}>
              {[
                [statBonusIco, null, 'Welcome bonus', 'text-[#785910]'],
                [statBadgesIco, DEMO.badges, 'Badges earned', 'text-[#1c2a21]'],
                [statRankIco, DEMO.rank, 'Rank in Ghana', 'text-[#1c2a21]'],
              ].map(([icon, value, label, valueColor]) => (
                <div key={label} className="flex flex-col items-center gap-1 text-center">
                  <Img src={icon} size={24} />
                  <dd
                    className={classNames(
                      'whitespace-nowrap text-[24px] font-bold playful:font-heading playful:font-semibold max-md:text-[20px]',
                      valueColor
                    )}
                  >
                    {value ?? (
                      <>
                        <span className="playful:hidden">+{DEMO.bonus} pts</span>
                        <span className="hidden playful:inline">+{DEMO.bonus} XP</span>
                      </>
                    )}
                  </dd>
                  <dt
                    className={classNames(CARD_LABEL, 'max-md:text-[10px] max-md:tracking-[0.5px]')}
                  >
                    {label}
                  </dt>
                </div>
              ))}
            </dl>
          )}

          {/* Welcome email */}
          <div
            role="status"
            className="flex items-center gap-3.5 rounded-[14px] border-l-4 border-brand-green bg-brand-green-light p-4"
          >
            <span className="flex shrink-0 rounded-full bg-white p-2 playful:hidden">
              <Img src={mailIco} size={22} />
            </span>
            <Img src={spotSent} size={48} className="hidden playful:block" />
            <span className="flex min-w-0 flex-col gap-0.5">
              <span className="text-[15px] font-semibold text-brand-green">Welcome email sent</span>
              <span className="text-[13px] text-[#6b6b6b]">
                Check your inbox. We&apos;ve sent your profile link and next steps.
              </span>
            </span>
          </div>

          {/* What to do next */}
          <div className={classNames(CARD, 'flex flex-col gap-1 p-6 max-md:p-4')}>
            <div className="flex items-center justify-between gap-3 pb-2">
              <span className={CARD_LABEL}>What to do next</span>
              <span className="shrink-0 rounded-full bg-[#fbf1da] px-2.5 py-1 text-[12px] font-semibold text-[#785910] playful:hidden">
                Boost your score
              </span>
              <span
                className={classNames(
                  STICKER,
                  'hidden -rotate-[3deg] text-[11px] tracking-[0.5px] playful:inline-block'
                )}
              >
                BOOST YOUR SCORE
              </span>
            </div>
            <ul className="flex flex-col">
              {next.map((item, i) => (
                <li
                  key={item.id}
                  className={classNames(
                    'flex items-center gap-3.5 p-2.5 max-md:px-0',
                    live && 'cursor-pointer',
                    i < next.length - 1 && 'border-b border-[rgba(28,42,33,0.08)]'
                  )}
                  // Live: each row opens its page (sign-in first if needed: the protected routes send people to login).
                  onClick={live ? () => navigate(NEXT_LINKS[item.id]) : undefined}
                >
                  <span className="flex shrink-0 rounded-[12px] bg-brand-green-light p-[9px] playful:hidden">
                    <Img src={item.icon} size={22} />
                  </span>
                  <Img src={item.spot} size={52} className="hidden playful:block" />
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="text-[15px] font-semibold text-[#1c2a21]">{item.title}</span>
                    <span className="text-[13px] text-[#70706e]">{item.body}</span>
                  </span>
                  {item.points && !live ? <PointsPill value={item.points} /> : null}
                  <Img src={chevronIco} size={18} />
                </li>
              ))}
            </ul>
          </div>

          {/* Share */}
          <div className="relative flex items-center justify-between gap-4 rounded-[20px] bg-linear-to-r from-[#16341f] to-brand-green p-6 shadow-[0_2px_4px_rgba(28,42,33,0.06)] max-md:p-5 max-sm:flex-col max-sm:items-start playful:border-[1.5px] playful:border-[#1c2a21] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45)]">
            <GenzDoodleStar
              size={16}
              color="#FFD86B"
              className="absolute right-[25px] top-[8px] hidden playful:block"
            />
            <div className="flex min-w-0 flex-col gap-1.5 text-white">
              <h2 className="text-[20px] font-semibold playful:font-heading playful:text-[22px]">
                Let the world know you&apos;re on GTH.
              </h2>
              <p className="text-[13px] opacity-80">
                Share your GTH link directly with employers and collaborators.
              </p>
            </div>
            <button
              type="button"
              onClick={copyLink}
              className="h-12 shrink-0 cursor-pointer rounded-[10px] border-2 border-t border-[#967014] bg-[#c8951a] px-[18px] text-[16px] font-bold tracking-[0.1px] text-[#fef1e7] shadow-[0_4px_0_#967014] transition-transform hover:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {copied ? 'Link copied' : 'Copy link'}
              <span role="status" className="sr-only">
                {copied ? 'Link copied' : ''}
              </span>
            </button>
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-5 max-md:gap-3">
            <Button
              type="button"
              variant="primary"
              size="lg"
              className="w-full"
              rightIcon={<ArrowRightIcon />}
              onClick={() => {
                // Activation doesn't sign the person in: live goes to login (the dashboard follows); demo as drawn.
                log('go to dashboard', live ? '-> /login' : '-> /');
                navigate(live ? '/login' : '/');
              }}
            >
              {live ? 'Log in to my dashboard' : 'Go to my dashboard'}
            </Button>
            <button
              type="button"
              onClick={() => log('invite a friend')}
              className="w-full cursor-pointer rounded-[14px] border-2 border-t border-[rgba(28,42,33,0.3)] bg-white px-[34px] py-4 text-[16px] font-bold tracking-[0.1px] text-[#1c2a21] shadow-[0_4px_0_rgba(17,17,17,0.25)] transition-transform hover:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green max-lg:px-4 max-lg:py-2.5 max-lg:text-[14px]"
            >
              Invite a friend to Ghana Talent Hub
            </button>
          </div>

          {/* Footer line */}
          <p className="text-center text-[12px] text-[#70706e]">
            <button
              type="button"
              onClick={() => {
                log('open privacy summary');
                setLegalModal('privacy');
              }}
              className="cursor-pointer hover:underline"
            >
              Privacy Policy
            </button>
            {'  ·  '}
            <button
              type="button"
              onClick={() => {
                log('open terms summary');
                setLegalModal('terms');
              }}
              className="cursor-pointer hover:underline"
            >
              Terms of Use
            </button>
            {'  ·  © 2026 Ghana Talent Hub. Built for Ghana.'}
          </p>
        </div>
      </div>

      {legalModal === 'privacy' && (
        <PrivacyPolicyModal
          ctaLabel="Got it"
          onAccept={() => setLegalModal(null)}
          onClose={() => setLegalModal(null)}
        />
      )}
      {legalModal === 'terms' && (
        <TermsModal
          ctaLabel="Got it"
          onAccept={() => setLegalModal(null)}
          onClose={() => setLegalModal(null)}
        />
      )}
    </section>
  );
};

export default OnboardingDonePage;
