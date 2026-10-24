import { classNames } from '../../../../utils/classNames.js';
import Button from '../../../ui/Button.jsx';
import { PublicIconWarning } from './publicUiIcons.jsx';

/*
 * SectionError — Figma "T8 · Section error" (8488:601, 420x230, inside the "Career interests" card of 8.2.1c): one card failed to load while the
 * rest of the page is live. V centred, gap 10, p 32/24; icon disc 48 (#f9ebea, warning glyph #9f2a1e); title 17/20 600 #1c2a21;
 * message 14/20 #595959 (max 360); button "Retry now" (outlined, same as "Share").
 * Props
 *   title    string   default "This section couldn’t load"   (curly apostrophe as drawn)
 *   message  string   default "The rest of the dashboard is live. We’ll try again automatically."
 *   onRetry  fn()     the Retry button; omit to hide it
 *   retryLabel string default "Retry now"
 *   retrying boolean  ⚠️ ASSUMPTION: disables the button and sets aria-busy while the retry runs (no retrying frame is drawn)
 *   className
 * a11y: role="alert" so the failure is announced once when it replaces the card body.
 */

const SectionError = ({
  title = 'This section couldn’t load',
  message = 'The rest of the dashboard is live. We’ll try again automatically.',
  onRetry,
  retryLabel = 'Retry now',
  retrying = false,
  className,
}) => (
  <div
    role="alert"
    aria-busy={retrying || undefined}
    className={classNames(
      'mx-auto flex w-full max-w-[420px] flex-col items-center gap-[10px] px-[24px] py-[32px] text-center font-sans',
      className
    )}
  >
    <span
      aria-hidden="true"
      className="flex size-[48px] items-center justify-center rounded-full bg-[#f9ebea] text-[#9f2a1e]"
    >
      <PublicIconWarning className="size-[24px]" />
    </span>
    <p className="m-0 text-[17px] leading-[20px] font-semibold text-[#1c2a21]">{title}</p>
    <p className="m-0 max-w-[360px] text-[14px] leading-[20px] text-[#595959]">{message}</p>
    {onRetry && (
      <Button
        type="button"
        variant="tertiary"
        size="md"
        onClick={onRetry}
        disabled={retrying}
        className="!rounded-[14px] !px-[22px] !py-[12px]"
      >
        {retryLabel}
      </Button>
    )}
  </div>
);

export default SectionError;
