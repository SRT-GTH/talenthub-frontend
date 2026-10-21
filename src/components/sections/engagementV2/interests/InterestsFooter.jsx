import Button from '../../../ui/Button.jsx';
import { TalentHomeActivityCheckCircleIcon } from '../../../shared/assets.jsx';
import { FOCUS_RING } from './interestsStyles.js';
import * as Icons from './interestsIcons.jsx';

/*
 * InterestsFooter: the 88px sticky action bar of the Interests frames (Figma Footer 7706:250 / 7706:519). The shared
 * EngagementStageFooter draws no arrow on its button and no left action, so this screen draws its own with the same metrics.
 *   pick  -> "Skip for now" · Auto-saved · "Continue →" (disabled grey shelf until 2-6 areas)
 *   areas -> "Back: Avatar" on the left · Auto-saved · "Next: Personality →"
 * Props: variant 'pick' | 'areas', disabled, onSkip, onBack, onContinue.
 */
const InterestsFooter = ({ variant, disabled = false, onSkip, onBack, onContinue }) => (
  <div className="sticky bottom-0 z-20 flex min-h-[88px] w-full flex-wrap items-center justify-between gap-3 border-t border-[#e7e7e7] bg-white px-4 py-3 md:px-[clamp(20px,3.7vw,64px)]">
    {variant === 'areas' ? (
      <Button variant="tertiary-subtle" size="lg" onClick={onBack}>
        Back: Avatar
      </Button>
    ) : (
      <span />
    )}
    <div className="ml-auto flex flex-wrap items-center justify-end gap-4">
      {variant === 'pick' ? (
        <button
          type="button"
          onClick={onSkip}
          className={`min-h-[24px] cursor-pointer border-0 bg-transparent p-0 font-sans text-[15px] font-semibold leading-[18px] text-[#1c2a21] ${FOCUS_RING}`}
        >
          Skip for now
        </button>
      ) : null}
      <span className="inline-flex items-center gap-[6px] font-sans text-[13px] font-medium leading-[16px] text-[#595959] max-md:hidden">
        <TalentHomeActivityCheckCircleIcon className="size-[14px] text-[#387440]" />
        Auto-saved
      </span>
      <Button
        size="md"
        disabled={disabled}
        rightIcon={<Icons.ArrowRightIcon />}
        onClick={onContinue}
      >
        {variant === 'pick' ? 'Continue' : 'Next: Personality'}
      </Button>
    </div>
  </div>
);

export default InterestsFooter;
