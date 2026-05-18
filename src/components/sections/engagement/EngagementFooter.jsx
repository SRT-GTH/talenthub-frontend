import { classNames } from '../../../utils/classNames.js';
import Button from '../../ui/Button.jsx';
import StatusDot from '../../ui/StatusDot.jsx';

/*
 * EngagementFooter — sticky-feeling action bar at the bottom of the page.
 * Source: Figma frame 3384:81928 ("Background+HorizontalBorder").
 *
 *   left  → "• Auto-Saved · Everything is Reversible · Finish Later" status
 *   right → secondary skip button + primary continue button
 *
 * The button labels and arrow direction default to "← Skip to Home" /
 * "Get Started →" (matches the engagement-hub Figma) but can be
 * overridden per-page — e.g. the Top 20% milestone uses "← Back to map"
 * and "Next: Certs →".
 */

const ArrowLeft = ({ className }) => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M16 10H4" />
    <path d="M10 4l-6 6 6 6" />
  </svg>
);

const ArrowRight = ({ className }) => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M4 10h12" />
    <path d="M10 4l6 6-6 6" />
  </svg>
);

const EngagementFooter = ({
  onSkip,
  onContinue,
  skipLabel = 'Skip To Home',
  continueLabel = 'Get Started',
  className,
}) => (
  <footer
    className={classNames(
      'w-full border-t border-border-default bg-background-default',
      'px-[clamp(16px,4vw,56px)] py-[clamp(16px,2vw,28px)]',
      'flex flex-wrap items-center justify-between gap-4',
      className
    )}
  >
    <div className="flex items-center gap-2 font-sans text-[14px] leading-5 tracking-[0.2px] text-neutral-dark-hover">
      <StatusDot color="brand" />
      <span>
        <span className="font-semibold text-content-primary">Auto-Saved</span>
        <span aria-hidden="true"> · </span>Everything is Reversible
        <span aria-hidden="true"> · </span>Finish Later
      </span>
    </div>

    <div className="flex items-center gap-3">
      <Button
        variant="tertiary"
        size="md"
        onClick={onSkip}
        leftIcon={<ArrowLeft className="size-4" />}
      >
        {skipLabel}
      </Button>
      <Button
        variant="primary"
        size="md"
        onClick={onContinue}
        rightIcon={<ArrowRight className="size-4" />}
      >
        {continueLabel}
      </Button>
    </div>
  </footer>
);

export default EngagementFooter;
