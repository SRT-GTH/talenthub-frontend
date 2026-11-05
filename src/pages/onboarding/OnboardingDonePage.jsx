import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';
import { ArrowRightIcon } from '../../components/shared/assets.jsx';
import checkSm from '../../assets/talent-onboarding/done-check-sm.svg';
import checkPill from '../../assets/talent-onboarding/done-check-pill.svg';
import emailIco from '../../assets/talent-onboarding/done-email.svg';
import nextSkills from '../../assets/talent-onboarding/done-next-skills.svg';
import nextPhoto from '../../assets/talent-onboarding/done-next-photo.svg';
import nextJobs from '../../assets/talent-onboarding/done-next-jobs.svg';
import nextMentors from '../../assets/talent-onboarding/done-next-mentors.svg';
import arrowIco from '../../assets/talent-onboarding/done-arrow.svg';
import waveSvg from '../../assets/talent-onboarding/done-wave.svg';
import { classNames } from '../../utils/classNames.js';
import { debug } from '../../utils/debug.js';
import TermsModal from '../../components/shared/TermsModal.jsx';
import PrivacyPolicyModal from '../../components/shared/PrivacyPolicyModal.jsx';
import { readDoneSummary } from '../../services/onboardingReview.js';

const log = debug('OnboardingDonePage');

/*
 * OnboardingDonePage - talent onboarding "Done" screen (frontend-only, mock data).
 * Route: /onboarding/talent/done (REQUEST: register in App.jsx under the
 * `/onboarding/talent/*` nested <Routes>; the Review page's final CTA should
 * navigate here - it currently goes to /login, which is not touched).
 *
 * Figma: success.json
 *   8027:213532  Success Page   1728x1818 - nav + dark hero (score ring, "Welcome to Ghana
 *                Talent Hub, Abena.", live copy) + wave; hero is 511 tall.
 *   8027:213887  gth_screen_08_complete export - the content stack (560px column):
 *                steps card, XP strip, email notice, what-to-do-next, share card, CTAs, footer.
 *   8027:213647  is the Review frame (agreements) - covered by OnboardingReviewPage.
 * Hero: gradient #142916 -> #2A5730 135deg, radial #387440@.35 glow, score ring 148px
 * (white, 4px #fff@.12 border), "Talent Score" 8/700 ls1, "78" Bricolage 49/600,
 * "out of 100" 9/600, Gold Tier pill #C8951A. H1 Bricolage 42/600 ls -1: "Welcome to" white,
 * "Ghana Talent Hub," #C1D4C4, "Abena." white (explicit line breaks; Figma's own 4-line
 * wrap is an export artefact because its text box is only 303px wide).
 * ASSUMPTIONS: name/score/XP/rank are demo constants (no API); Figma's "78" is the Talent
 * Score here (header progress meter also reads 78%). The ring's "78" in the Figma export
 * wraps onto two lines (artefact) - rendered on one line.
 * Footer "Privacy Policy" / "Terms of Use" open the PrivacyPolicyModal / TermsModal
 * summaries in place (there are no /privacy or /terms pages yet).
 */

const DEMO = {
  name: 'Abena',
  score: 78,
  tier: 'Gold Tier',
  xp: '109',
  badges: '3',
  rank: '#1,548',
};

const STEPS = [
  ['Role', 'Student'],
  ['Date of birth', 'Verified'],
  ['Personal info', 'Abena Mensah'],
  ['Contact', 'Phone verified'],
  ['Address', 'Greater Accra Region'],
  ['Education', 'KNUST · Year 2'],
];

// Live (a summary saved by Review after activation): the person's own steps. No talent score, XP, badges or rank
// exist yet (the profile is built after sign-in), so the live view leaves those out instead of showing demo numbers.
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
    body: "Tell us what you're good at — coding, writing, design, leadership.",
    xp: '+25 XP',
    tile: '#EBF1EC',
    shelf: '#C1D4C4',
    icon: 'home',
  },
  {
    id: 'photo',
    title: 'Upload a profile photo',
    body: 'Profiles with photos get 3× more recruiter views.',
    xp: '+10 XP',
    tile: '#EBF1EC',
    shelf: '#C1D4C4',
    icon: 'person',
  },
  {
    id: 'jobs',
    title: 'Browse opportunities',
    body: 'Jobs, internships, and scholarships matched to your profile.',
    tile: '#FAF4E8',
    shelf: '#EEDEB8',
    icon: 'card',
  },
  {
    id: 'mentors',
    title: 'Connect with mentors',
    body: 'Find professionals in your field for guidance and advice.',
    tile: '#F8F8F4',
    shelf: '#C6C6C3',
    icon: 'people',
  },
];

const Check = ({ size = 10 }) => (
  <img
    src={size === 9 ? checkPill : checkSm}
    alt=""
    aria-hidden="true"
    width={size}
    height={size}
    draggable={false}
  />
);

const GLYPHS = { home: nextSkills, person: nextPhoto, card: nextJobs, people: nextMentors };
const Glyph = ({ name }) => (
  <img src={GLYPHS[name]} alt="" aria-hidden="true" width="17" height="17" draggable={false} />
);

const ARROW = (
  <img src={arrowIco} alt="" aria-hidden="true" width="10" height="10" draggable={false} />
);

const cardBase = {
  background: '#fff',
  border: '1px solid rgba(28,42,33,0.08)',
  borderRadius: 24,
  boxShadow: '0 2px 0 rgba(0,0,0,0.06)',
};

const CardHeader = ({ label, children }) => (
  <div
    className="flex items-center justify-between px-[18px]"
    style={{ height: 44, borderBottom: '1px solid rgba(28,42,33,0.06)' }}
  >
    <span
      className="font-ui font-bold uppercase text-[#BABAB7]"
      style={{ fontSize: 'var(--fs-9)', letterSpacing: '0.9px' }}
    >
      {label}
    </span>
    {children}
  </div>
);

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

  return (
    <section className="relative flex w-full flex-1 min-h-0 flex-col overflow-y-auto no-scrollbar bg-white">
      {/* Hero 8027:213630 */}
      <div
        className="relative isolate shrink-0 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #142916 0%, #2A5730 100%)',
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
        <div className="mx-auto flex max-w-[640px] flex-col items-center px-6 pt-[52px] pb-24 text-center">
          {live ? null : (
            <div
              className="relative flex size-[148px] flex-col items-center justify-center rounded-full bg-white"
              style={{
                border: '4px solid rgba(255,255,255,0.12)',
                boxShadow: '0 20px 48px rgba(0,0,0,0.3)',
              }}
            >
              <span
                className="font-ui font-bold uppercase text-[#BABAB7]"
                style={{ fontSize: 8, letterSpacing: '1px', lineHeight: '9.8px' }}
              >
                Talent Score
              </span>
              <span
                className="font-heading font-semibold text-[#387440]"
                style={{ fontSize: 49, lineHeight: '53.9px', letterSpacing: '-0.98px' }}
              >
                {DEMO.score}
              </span>
              <span
                className="font-ui font-semibold text-[#BABAB7]"
                style={{ fontSize: 9, lineHeight: '11px' }}
              >
                out of 100
              </span>
              <span
                className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#C8951A] px-3.5 py-1 font-ui font-bold uppercase text-white"
                style={{
                  bottom: -12,
                  fontSize: 10,
                  lineHeight: '12.2px',
                  letterSpacing: '0.5px',
                  boxShadow: '0 2px 0 rgba(0,0,0,0.2)',
                }}
              >
                {DEMO.tier}
              </span>
            </div>
          )}

          <h1
            className="mt-6 font-heading font-semibold text-white"
            style={{
              fontSize: 'clamp(2rem, 4vw, 2.625rem)',
              lineHeight: 1.31,
              letterSpacing: '-1px',
            }}
          >
            Welcome to
            <br />
            <span style={{ color: '#C1D4C4' }}>Ghana Talent Hub,</span>
            <br />
            {name}.
          </h1>

          <p className="mt-4 font-ui text-[14px] leading-[23.8px]">
            <span style={{ color: 'rgba(255,255,255,0.6)' }}>
              {live ? 'Your account is ready. ' : 'Your profile is live. '}
            </span>
            <strong className="font-bold" style={{ color: 'rgba(255,255,255,0.9)' }}>
              {live?.isMinor ? (
                <>
                  Log in and build your profile.
                  <br />
                  We&apos;ve emailed your parent or guardian about GTH.
                </>
              ) : live ? (
                <>
                  Log in and build your profile so
                  <br />
                  recruiters and institutions can find you.
                </>
              ) : (
                <>
                  Recruiters and institutions across Ghana
                  <br />
                  can now discover you.
                </>
              )}
            </strong>
          </p>
        </div>
        {/* wave edge 8027:213645 */}
        <img
          src={waveSvg}
          alt=""
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 block h-[63px] w-full max-w-none"
          style={{ objectFit: 'fill' }}
          draggable={false}
        />
      </div>

      {/* Content stack 8027:213909 (560px column) */}
      <div className="flex flex-1 justify-center bg-[#F8F8F4] px-4 pt-8 pb-10">
        <div className="flex w-full max-w-[560px] flex-col gap-5">
          {/* Steps completed */}
          <div style={cardBase} className="overflow-hidden">
            <CardHeader label="All steps completed">
              <span
                className="inline-flex items-center gap-1.5 rounded-full bg-[#EBF1EC] px-2.5 font-ui font-bold uppercase text-[#2A5730]"
                style={{ height: 17, fontSize: 'var(--fs-9)', letterSpacing: '0.4px' }}
              >
                <Check size={9} />
                {steps.length + 1} of {steps.length + 1} done
              </span>
            </CardHeader>
            <ul className="grid grid-cols-2 gap-x-[9px] gap-y-2 p-3.5 max-sm:grid-cols-1">
              {steps.map(([title, sub]) => (
                <li
                  key={title}
                  className="flex items-center gap-2.5 px-3"
                  style={{
                    height: 47,
                    background: '#EBF1EC',
                    border: '1px solid #C1D4C4',
                    borderRadius: 16,
                  }}
                >
                  <span
                    className="flex size-[22px] shrink-0 items-center justify-center rounded-full bg-[#387440]"
                    style={{ boxShadow: '0 1px 0 #2A5730' }}
                  >
                    <Check />
                  </span>
                  <span className="flex min-w-0 flex-col">
                    <span
                      className="font-ui font-bold text-[#2A5730]"
                      style={{ fontSize: 'var(--fs-11)', lineHeight: '13.4px' }}
                    >
                      {title}
                    </span>
                    <span
                      className="truncate font-ui text-[#70706E]"
                      style={{ fontSize: 'var(--fs-10)', lineHeight: '12.2px' }}
                    >
                      {sub}
                    </span>
                  </span>
                </li>
              ))}
              <li
                className="col-span-2 flex items-center gap-2.5 px-3 max-sm:col-span-1"
                style={{
                  height: 47,
                  background: '#FAF4E8',
                  border: '1px solid #EEDEB8',
                  borderRadius: 16,
                }}
              >
                <span
                  className="flex size-[22px] shrink-0 items-center justify-center rounded-full bg-[#C8951A]"
                  style={{ boxShadow: '0 1px 0 #967014' }}
                >
                  <Check />
                </span>
                <span className="flex flex-col">
                  <span
                    className="font-ui font-bold text-[#967014]"
                    style={{ fontSize: 'var(--fs-11)', lineHeight: '13.4px' }}
                  >
                    Terms &amp; legal agreements
                  </span>
                  <span
                    className="font-ui text-[#70706E]"
                    style={{ fontSize: 'var(--fs-10)', lineHeight: '12.2px' }}
                  >
                    Accepted · Timestamps recorded
                  </span>
                </span>
              </li>
            </ul>
          </div>

          {/* XP strip 8027:213966 (demo only: no XP, badges or rank exist before the profile is built) */}
          {live ? null : (
            <dl
              className="grid grid-cols-3 gap-px overflow-hidden"
              style={{ ...cardBase, background: 'rgba(28,42,33,0.06)' }}
            >
              {[
                ['⭐', DEMO.xp, 'XP earned', '#1C2A21', '#BABAB7'],
                ['🏅', DEMO.badges, 'Badges', '#967014', '#967014'],
                ['📊', DEMO.rank, 'Your rank', '#1C2A21', '#BABAB7'],
              ].map(([emoji, value, label, vColor, lColor]) => (
                <div
                  key={label}
                  className="flex flex-col items-center justify-center bg-white"
                  style={{ height: 99 }}
                >
                  <span aria-hidden="true" style={{ fontSize: 20, lineHeight: '20px' }}>
                    {emoji}
                  </span>
                  <dd
                    className="font-heading font-semibold"
                    style={{
                      fontSize: 25,
                      lineHeight: '30px',
                      letterSpacing: '-0.5px',
                      color: vColor,
                    }}
                  >
                    {value}
                  </dd>
                  <dt
                    className="font-ui font-bold uppercase"
                    style={{ fontSize: 'var(--fs-9)', letterSpacing: '0.6px', color: lColor }}
                  >
                    {label}
                  </dt>
                </div>
              ))}
            </dl>
          )}

          {/* Email notice 8027:213980 */}
          <div
            role="status"
            className="flex items-center gap-3 px-[18px] py-[15px]"
            style={{
              background: '#E8F2ED',
              border: '1px solid rgba(29,124,77,0.25)',
              borderLeft: '3px solid #1D7C4D',
              minHeight: 59.5,
            }}
          >
            <span
              className="flex size-7 shrink-0 items-center justify-center rounded-[6px] bg-[#1D7C4D]"
              style={{ boxShadow: '0 2px 0 rgba(15,80,40,0.3)' }}
            >
              <img
                src={emailIco}
                alt=""
                aria-hidden="true"
                width="13"
                height="13"
                draggable={false}
              />
            </span>
            <span className="flex flex-col text-[#1D7C4D]">
              <span className="font-ui font-bold" style={{ fontSize: 12, lineHeight: '14.6px' }}>
                Welcome email sent
              </span>
              <span
                className="font-ui"
                style={{ fontSize: 'var(--fs-11)', lineHeight: '16.5px', opacity: 0.8 }}
              >
                Check your inbox — we&apos;ve sent your profile link and next steps.
              </span>
            </span>
          </div>

          {/* What to do next 8027:213987 */}
          <div style={cardBase} className="overflow-hidden">
            <CardHeader label="What to do next">
              <span
                className="inline-flex items-center rounded-full bg-[#FAF4E8] px-2.5 font-ui font-bold uppercase text-[#967014]"
                style={{ height: 17, fontSize: 'var(--fs-9)', letterSpacing: '0.4px' }}
              >
                Boost your score
              </span>
            </CardHeader>
            <ul className="px-3.5 py-1">
              {next.map((item, i) => (
                <li
                  key={item.id}
                  className={classNames(
                    'flex items-center gap-3 py-[11px]',
                    live && 'cursor-pointer',
                    i < next.length - 1 && 'border-b border-[rgba(28,42,33,0.05)]'
                  )}
                  // Live: each row opens its page (sign-in first if needed: the protected routes send people to login).
                  onClick={live ? () => navigate(NEXT_LINKS[item.id]) : undefined}
                >
                  <span
                    className="flex size-[38px] shrink-0 items-center justify-center rounded-[16px]"
                    style={{ background: item.tile, boxShadow: `0 2px 0 ${item.shelf}` }}
                  >
                    <Glyph name={item.icon} />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span
                      className="font-ui font-bold text-[#1C2A21]"
                      style={{ fontSize: 13, lineHeight: '15.9px' }}
                    >
                      {item.title}
                    </span>
                    <span
                      className="font-ui text-[#70706E]"
                      style={{ fontSize: 'var(--fs-11)', lineHeight: '13.4px' }}
                    >
                      {item.body}
                    </span>
                  </span>
                  {item.xp && (
                    <span
                      className="shrink-0 rounded-full bg-[#EBF1EC] px-2 font-ui font-bold text-[#387440]"
                      style={{ fontSize: 'var(--fs-10)', lineHeight: '17px' }}
                    >
                      {item.xp}
                    </span>
                  )}
                  <span className="flex size-[26px] shrink-0 items-center justify-center rounded-full bg-[#F8F8F4]">
                    {ARROW}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Share card 8027:214038 */}
          <div
            className="flex items-end justify-between gap-4 px-5 py-[22px] max-sm:flex-col max-sm:items-start"
            style={{ background: '#142916', borderRadius: 24, minHeight: 124.5 }}
          >
            <div className="flex flex-col">
              <span
                className="font-ui font-bold uppercase"
                style={{
                  fontSize: 'var(--fs-9)',
                  letterSpacing: '0.8px',
                  color: 'rgba(255,255,255,0.5)',
                }}
              >
                Share your profile
              </span>
              <h2
                className="mt-1 font-heading font-semibold text-white"
                style={{ fontSize: 20, lineHeight: '25px', letterSpacing: '-0.4px' }}
              >
                Let the world know
                <br />
                you&apos;re on GTH.
              </h2>
              <p
                className="mt-2 font-ui"
                style={{
                  fontSize: 'var(--fs-11)',
                  lineHeight: '16.5px',
                  color: 'rgba(255,255,255,0.55)',
                }}
              >
                Send your GTH link directly to employers and collaborators.
              </p>
            </div>
            <button
              type="button"
              onClick={copyLink}
              className="shrink-0 cursor-pointer rounded-[14px] bg-white px-6 font-sans font-bold text-[#1C2A21] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              style={{
                height: 39,
                fontSize: 12,
                lineHeight: '24px',
                letterSpacing: '0.1px',
                border: '2px solid rgba(28,42,33,0.3)',
                borderTopWidth: 1,
                boxShadow: '0 4px 0 rgba(17,17,17,0.25)',
              }}
            >
              Copy link
              <span role="status" className="sr-only">
                {copied ? 'Link copied' : ''}
              </span>
            </button>
          </div>

          {/* CTAs 8027:214050 */}
          <div className="flex flex-col gap-2.5">
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
              className="cursor-pointer rounded-[14px] bg-white font-sans font-bold text-[#1C2A21] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
              style={{
                height: 42,
                fontSize: 13,
                lineHeight: '24px',
                letterSpacing: '0.1px',
                border: '2px solid rgba(28,42,33,0.3)',
                borderTopWidth: 1,
                boxShadow: '0 4px 0 rgba(17,17,17,0.25)',
              }}
            >
              Invite a friend to Ghana Talent Hub
            </button>
          </div>
        </div>
      </div>

      {/* Footer 8027:214060 */}
      <footer
        className="shrink-0 bg-white px-4 py-5 text-center font-ui text-[#387440]"
        style={{
          fontSize: 'var(--fs-11)',
          lineHeight: '13.4px',
          borderTop: '1px solid rgba(28,42,33,0.06)',
        }}
      >
        <button
          type="button"
          onClick={() => {
            log('open privacy summary');
            setLegalModal('privacy');
          }}
          className="cursor-pointer border-0 bg-transparent p-0 font-[inherit] text-inherit underline"
        >
          Privacy Policy
        </button>
        {' · '}
        <button
          type="button"
          onClick={() => {
            log('open terms summary');
            setLegalModal('terms');
          }}
          className="cursor-pointer border-0 bg-transparent p-0 font-[inherit] text-inherit underline"
        >
          Terms of Use
        </button>
        <span className="text-[#70706E]"> · © 2026 Ghana Talent Hub · 🇬🇭 Built for Ghana</span>
      </footer>
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
