import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { debug } from '../../utils/debug.js';

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

export default function DemoNavigator() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeFlow, setActiveFlow] = useState('talent');
  const [isMinor, setIsMinor] = useState(false);
  // Parent flow B (ward-invited) toggle — mirrors the talent "Minor" toggle.
  const [isPathB, setIsPathB] = useState(false);

  if (!import.meta.env.DEV) return null;
  if (!location.pathname.startsWith('/onboarding/')) return null;

  const steps =
    activeFlow === 'institution'
      ? INSTITUTION_STEPS
      : activeFlow === 'parent'
        ? isPathB
          ? PARENT_B_STEPS
          : PARENT_A_STEPS
        : isMinor
          ? TALENT_MINOR_STEPS
          : TALENT_ADULT_STEPS;

  const foundIndex = steps.findIndex((s) => s.path === location.pathname);
  const currentIndex = foundIndex === -1 ? 0 : foundIndex;
  const currentStep = steps[currentIndex];

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
    const dest = steps[currentIndex - 1].path;
    log('prev →', dest);
    navigate(dest);
  }

  function handleNext() {
    const dest = steps[currentIndex + 1].path;
    log('next →', dest);
    navigate(dest);
  }

  return (
    <div className="fixed bottom-6 left-1/2 z-[9999] flex -translate-x-1/2 items-center gap-3 rounded-full bg-gray-900/90 px-4 py-2 text-sm text-white shadow-lg backdrop-blur-sm">
      {/* Flow switcher */}
      <div className="flex items-center gap-1">
        {['talent', 'institution', 'parent'].map((flow) => (
          <button
            key={flow}
            onClick={() => handleFlowSwitch(flow)}
            className={`rounded-full px-3 py-0.5 capitalize transition-colors ${
              activeFlow === flow ? 'bg-white text-gray-900' : 'hover:bg-white/10'
            }`}
          >
            {flow}
          </button>
        ))}
      </div>

      {/* Minor toggle — talent only */}
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

      {/* Path B (ward-invited) toggle — parent only */}
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

      {/* Divider */}
      <span className="text-white/30">|</span>

      {/* Step counter */}
      <span className="text-white/80">
        {currentIndex + 1}&thinsp;/&thinsp;{steps.length}&ensp;·&ensp;{currentStep?.label}
      </span>

      {/* Prev / Next */}
      <div className="flex items-center gap-1">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="rounded px-2 py-0.5 transition-opacity hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Previous step"
        >
          ←
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex === steps.length - 1}
          className="rounded px-2 py-0.5 transition-opacity hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Next step"
        >
          →
        </button>
      </div>
    </div>
  );
}
