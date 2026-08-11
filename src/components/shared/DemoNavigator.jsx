import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { debug } from '../../utils/debug.js';
import { useCareerBuddyRole } from '../../hooks/useCareerBuddyRole.js';

const log = debug('DemoNavigator');

const TALENT_ADULT_STEPS = [
  { label: 'Welcome', path: '/onboarding/talent/welcome' },
  { label: 'Date of Birth', path: '/onboarding/talent/dob' },
  { label: 'Personal Info', path: '/onboarding/talent/personal-info' },
  { label: 'Contact', path: '/onboarding/talent/contact' },
  { label: 'Address', path: '/onboarding/talent/address' },
  { label: 'Education', path: '/onboarding/talent/education' },
  { label: 'Review', path: '/onboarding/talent/review' },
];

const TALENT_MINOR_STEPS = [
  ...TALENT_ADULT_STEPS.slice(0, 6),
  { label: 'Parent Info', path: '/onboarding/talent/parent-info' },
  { label: 'Review', path: '/onboarding/talent/review' },
];

const INSTITUTION_STEPS = [
  { label: 'Guidelines', path: '/onboarding/institution/guidelines' },
  { label: 'Your Institution', path: '/onboarding/institution/your-institution' },
  { label: 'Contact', path: '/onboarding/institution/contact' },
  { label: 'Activate', path: '/onboarding/institution/activate' },
  { label: 'Template Guide', path: '/onboarding/institution/template-guide' },
  { label: 'Template', path: '/onboarding/institution/template' },
  { label: 'Upload', path: '/onboarding/institution/upload' },
  { label: 'Validate', path: '/onboarding/institution/validate' },
  { label: 'Confirm', path: '/onboarding/institution/confirm' },
  { label: 'Report', path: '/onboarding/institution/report' },
];

// Parent Flow A — self-serve (parent signs up on their own).
const PARENT_A_STEPS = [
  { label: 'Login', path: '/onboarding/parent-login' },
  { label: 'Welcome', path: '/onboarding/parent-welcome' },
  { label: 'Identity', path: '/onboarding/parent-identity' },
  { label: 'Verification', path: '/onboarding/parent-verification' },
  { label: 'Contact', path: '/onboarding/parent-contact' },
  { label: 'Security', path: '/onboarding/parent-security' },
  { label: 'Link Ward', path: '/onboarding/parent-link-ward' },
  { label: 'Review', path: '/onboarding/parent-review' },
  { label: 'Done', path: '/onboarding/parent-done' },
];

// Parent Flow B — ward-invited (details pre-filled by the ward). Shares the
// Flow A "Done" screen at the end.
const PARENT_B_STEPS = [
  { label: 'Welcome', path: '/onboarding/parent-invited' },
  { label: 'Identity', path: '/onboarding/parent-invited-identity' },
  { label: 'Verification', path: '/onboarding/parent-invited-verification' },
  { label: 'Contact', path: '/onboarding/parent-invited-contact' },
  { label: 'Security', path: '/onboarding/parent-invited-security' },
  { label: 'Link Ward', path: '/onboarding/parent-invited-link-ward' },
  { label: 'Consent', path: '/onboarding/parent-invited-consent' },
  { label: 'Done', path: '/onboarding/parent-done' },
];

// Shared Career Buddy route — role flips content; ?cb= seeds recruiter mid-flow.
const CAREER_BUDDY_PATH = '/profile/filling/career-buddy';

const CAREER_BUDDY_TALENT_STEPS = [{ label: 'Landing', path: CAREER_BUDDY_PATH }];

const CAREER_BUDDY_RECRUITER_STEPS = [
  { label: 'Landing', path: `${CAREER_BUDDY_PATH}?cb=welcome` },
  { label: 'KYB Upload', path: `${CAREER_BUDDY_PATH}?cb=kyb-prompt` },
  { label: 'KYB Verified', path: `${CAREER_BUDDY_PATH}?cb=kyb-verified` },
  { label: 'Company Start', path: `${CAREER_BUDDY_PATH}?cb=company-start` },
  { label: 'Company Review', path: `${CAREER_BUDDY_PATH}?cb=company-review` },
  { label: 'Company Confirmed', path: `${CAREER_BUDDY_PATH}?cb=company-confirmed` },
  { label: 'Post Job Form', path: `${CAREER_BUDDY_PATH}?cb=post-job-form` },
  { label: 'Post Job Chat', path: `${CAREER_BUDDY_PATH}?cb=post-job-chat` },
  { label: 'Post Job Review', path: `${CAREER_BUDDY_PATH}?cb=post-job-chat-review` },
  { label: 'Post Job Upload', path: `${CAREER_BUDDY_PATH}?cb=post-job-upload` },
  { label: 'Post Job Upload Review', path: `${CAREER_BUDDY_PATH}?cb=post-job-upload-review` },
  { label: 'Post Job Confirm', path: `${CAREER_BUDDY_PATH}?cb=post-job-confirm` },
  { label: 'Post Job Success', path: `${CAREER_BUDDY_PATH}?cb=post-job-success` },
];

const ONBOARDING_PREFIX = '/onboarding/';
const CAREER_BUDDY_PREFIX = '/profile/filling/career-buddy';

function buddyLocationKey(pathname, search) {
  const params = new URLSearchParams(search);
  const cb = params.get('cb');
  if (pathname.startsWith(CAREER_BUDDY_PREFIX) && cb) {
    return `${CAREER_BUDDY_PATH}?cb=${cb}`;
  }
  return pathname;
}

export default function DemoNavigator() {
  const location = useLocation();
  const navigate = useNavigate();
  const { role, setRole } = useCareerBuddyRole();

  const onCareerBuddy = location.pathname.startsWith(CAREER_BUDDY_PREFIX);
  const onOnboarding = location.pathname.startsWith(ONBOARDING_PREFIX);
  const recruiterActive = role === 'recruiter';

  const [surface, setSurface] = useState(() => (onCareerBuddy ? 'career-buddy' : 'onboarding'));
  const [activeFlow, setActiveFlow] = useState('talent');
  const [isMinor, setIsMinor] = useState(false);
  const [isPathB, setIsPathB] = useState(false);

  if (!import.meta.env.DEV) return null;
  if (!onOnboarding && !onCareerBuddy) return null;

  const effectiveSurface = onCareerBuddy
    ? 'career-buddy'
    : surface === 'career-buddy' && onOnboarding
      ? 'onboarding'
      : surface;

  const buddySteps = recruiterActive ? CAREER_BUDDY_RECRUITER_STEPS : CAREER_BUDDY_TALENT_STEPS;

  const onboardingSteps =
    activeFlow === 'institution'
      ? INSTITUTION_STEPS
      : activeFlow === 'parent'
        ? isPathB
          ? PARENT_B_STEPS
          : PARENT_A_STEPS
        : isMinor
          ? TALENT_MINOR_STEPS
          : TALENT_ADULT_STEPS;

  const steps = effectiveSurface === 'career-buddy' ? buddySteps : onboardingSteps;
  const locationKey = buddyLocationKey(location.pathname, location.search);
  const foundIndex = steps.findIndex((s) => s.path === locationKey);
  // Bare /career-buddy with recruiter role maps to Landing (?cb=welcome).
  const currentIndex =
    foundIndex === -1 && recruiterActive && locationKey === CAREER_BUDDY_PATH
      ? 0
      : foundIndex === -1
        ? 0
        : foundIndex;
  const currentStep = steps[currentIndex];

  function handleSurfaceSwitch(next) {
    log('surface switch:', next);
    setSurface(next);
    if (next === 'career-buddy') {
      navigate(role === 'recruiter' ? `${CAREER_BUDDY_PATH}?cb=welcome` : CAREER_BUDDY_PATH);
      return;
    }
    const dest =
      activeFlow === 'institution'
        ? INSTITUTION_STEPS[0].path
        : activeFlow === 'parent'
          ? isPathB
            ? PARENT_B_STEPS[0].path
            : PARENT_A_STEPS[0].path
          : TALENT_ADULT_STEPS[0].path;
    navigate(dest);
  }

  function handleBuddyRole(nextRole) {
    log('career-buddy role:', nextRole);
    setRole(nextRole);
    navigate(nextRole === 'recruiter' ? `${CAREER_BUDDY_PATH}?cb=welcome` : CAREER_BUDDY_PATH);
  }

  function handleFlowSwitch(flow) {
    const nextSteps =
      flow === 'institution'
        ? INSTITUTION_STEPS
        : flow === 'parent'
          ? isPathB
            ? PARENT_B_STEPS
            : PARENT_A_STEPS
          : isMinor
            ? TALENT_MINOR_STEPS
            : TALENT_ADULT_STEPS;
    log('flow switch:', flow, '→', nextSteps[0].path);
    setActiveFlow(flow);
    navigate(nextSteps[0].path);
  }

  function handleMinorToggle() {
    const next = !isMinor;
    const nextSteps = next ? TALENT_MINOR_STEPS : TALENT_ADULT_STEPS;
    const stillValid = nextSteps.some((s) => s.path === location.pathname);
    log('minor toggle:', next, stillValid ? 'stay' : 'clamp to last');
    setIsMinor(next);
    if (!stillValid) navigate(nextSteps[nextSteps.length - 1].path);
  }

  function handlePathBToggle() {
    const next = !isPathB;
    const nextSteps = next ? PARENT_B_STEPS : PARENT_A_STEPS;
    log('parent path toggle:', next ? 'B (invited)' : 'A (self-serve)', '→', nextSteps[0].path);
    setIsPathB(next);
    navigate(nextSteps[0].path);
  }

  function handlePrev() {
    if (currentIndex <= 0) return;
    const dest = steps[currentIndex - 1].path;
    log('prev →', dest);
    navigate(dest);
  }

  function handleNext() {
    if (currentIndex >= steps.length - 1) return;
    const dest = steps[currentIndex + 1].path;
    log('next →', dest);
    navigate(dest);
  }

  return (
    <div className="fixed bottom-6 left-1/2 z-[9999] flex -translate-x-1/2 items-center gap-3 rounded-full bg-gray-900/90 px-4 py-2 text-sm text-white shadow-lg backdrop-blur-sm">
      {/* Surface: Onboarding | Career Buddy */}
      <div className="flex items-center gap-1">
        {[
          { id: 'onboarding', label: 'Onboarding' },
          { id: 'career-buddy', label: 'Career Buddy' },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => handleSurfaceSwitch(item.id)}
            className={`rounded-full px-3 py-0.5 transition-colors ${
              effectiveSurface === item.id ? 'bg-white text-gray-900' : 'hover:bg-white/10'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <span className="text-white/30">|</span>

      {effectiveSurface === 'career-buddy' ? (
        <>
          <div className="flex items-center gap-1">
            {['talent', 'recruiter'].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => handleBuddyRole(r)}
                className={`rounded-full px-3 py-0.5 capitalize transition-colors ${
                  (r === 'recruiter') === recruiterActive
                    ? 'bg-white text-gray-900'
                    : 'hover:bg-white/10'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <span className="text-white/30">|</span>
          <span className="text-white/80">
            {currentIndex + 1}&thinsp;/&thinsp;{steps.length}&ensp;·&ensp;{currentStep?.label}
          </span>
          {recruiterActive && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="rounded px-2 py-0.5 transition-opacity hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Previous step"
              >
                ←
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={currentIndex === steps.length - 1}
                className="rounded px-2 py-0.5 transition-opacity hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Next step"
              >
                →
              </button>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="flex items-center gap-1">
            {['talent', 'institution', 'parent'].map((flow) => (
              <button
                key={flow}
                type="button"
                onClick={() => handleFlowSwitch(flow)}
                className={`rounded-full px-3 py-0.5 capitalize transition-colors ${
                  activeFlow === flow ? 'bg-white text-gray-900' : 'hover:bg-white/10'
                }`}
              >
                {flow}
              </button>
            ))}
          </div>

          {activeFlow === 'talent' && (
            <label className="flex cursor-pointer items-center gap-1.5 select-none">
              <input
                type="checkbox"
                checked={isMinor}
                onChange={handleMinorToggle}
                className="accent-white"
              />
              Minor
            </label>
          )}

          {activeFlow === 'parent' && (
            <label className="flex cursor-pointer items-center gap-1.5 select-none">
              <input
                type="checkbox"
                checked={isPathB}
                onChange={handlePathBToggle}
                className="accent-white"
              />
              Ward-invited
            </label>
          )}

          <span className="text-white/30">|</span>

          <span className="text-white/80">
            {currentIndex + 1}&thinsp;/&thinsp;{steps.length}&ensp;·&ensp;{currentStep?.label}
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="rounded px-2 py-0.5 transition-opacity hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Previous step"
            >
              ←
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={currentIndex === steps.length - 1}
              className="rounded px-2 py-0.5 transition-opacity hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Next step"
            >
              →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
