import Button from '../../ui/Button.jsx';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { ArrowRightIcon, TalentHomeActivityCheckCircleIcon } from '../../shared/assets.jsx';

const log = debug('EngagementStageFooter');

/*
 * EngagementStageFooter — the 88px action bar at the bottom of every stage screen (Figma "Footer", IN-01 Focused 8285:10044):
 * white, 1px #e7e7e7 top rule, content right-aligned at the 64px page margin with a 16px gap: "Skip for now" link (15/600
 * #1c2a21) · "✓ Auto-saved" (13/500 #595959) · primary "Continue →" button (152x52; disabled = grey shelf).
 * Props: onSkip, onContinue, continueLabel ('Continue'), skipLabel ('Skip for now', null hides it), disabled, autoSaved,
 * left (node drawn at the left margin, for frames that carry a left action), className.
 */
const EngagementStageFooter = ({
  onSkip,
  onContinue,
  continueLabel = 'Continue',
  skipLabel = 'Skip for now',
  disabled = false,
  autoSaved = true,
  left = null,
  className,
}) => {
  log('render', { continueLabel, disabled });
  return (
    <div
      className={classNames(
        'flex min-h-[88px] w-full items-center gap-4 border-t border-[#e7e7e7] bg-white',
        'px-4 py-3 md:px-[clamp(20px,3.7vw,64px)]',
        left ? 'justify-between' : 'justify-end',
        className
      )}
    >
      {left}
      <div className="flex flex-wrap items-center justify-end gap-[16px]">
        {skipLabel ? (
          <button
            type="button"
            onClick={() => {
              log('skip');
              onSkip?.();
            }}
            className="min-h-[24px] cursor-pointer border-0 bg-transparent p-0 font-sans text-[15px] font-semibold leading-[18px] text-[#1c2a21] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
          >
            {skipLabel}
          </button>
        ) : null}
        {autoSaved ? (
          <span className="inline-flex items-center gap-[6px] font-sans text-[13px] font-medium leading-[16px] text-[#595959] max-md:hidden">
            <TalentHomeActivityCheckCircleIcon className="size-[14px] text-[#387440]" />
            Auto-saved
          </span>
        ) : null}
        <Button
          size="md"
          rightIcon={<ArrowRightIcon />}
          disabled={disabled}
          onClick={() => {
            log('continue');
            onContinue?.();
          }}
        >
          {continueLabel}
        </Button>
      </div>
    </div>
  );
};

export default EngagementStageFooter;
