import { classNames } from '../../../../utils/classNames.js';
import Button from '../../../ui/Button.jsx';
import { PublicIconFilter } from './publicUiIcons.jsx';

/*
 * EmptyState — Figma "T8 · Empty state" (8488:828 "zero matches", 8488:932 "fewer than 5", 420x250; wrapped by the 1360x300 "empty state card").
 * V centred, gap 10, p 32/24; icon disc 48 (#ebf1ec for zero, #f2f2ee for suppressed) with the filter glyph (#387440); title 17/20 600;
 * message 14/20 #595959 (max 360); one outlined button.
 * Props
 *   variant   'zero' | 'suppressed'   picks the verbatim Figma copy:
 *               zero        "No talents match this combination yet" / "Try broadening your filters — remove one, or widen the age range." / "Clear all filters"
 *               suppressed  "Fewer than 5 talents match" / "To protect privacy we hide all breakdowns when a group is this small. Remove a filter to see results." / "Remove last filter"
 *   title / message / actionLabel   override the copy (other empty situations: pass your own icon, e.g. the regional low-data card is a different component)
 *   icon      node      replaces the filter glyph
 *   onAction  fn()      the button; omit to hide it
 *   card      boolean   wrap in the white "empty state card" (r24, border, shadow, py24) — default true
 *   className
 * Privacy: the suppressed variant never prints a number; callers must not pass counts under 5 into title/message.
 */

const COPY = {
  zero: {
    title: 'No talents match this combination yet',
    message: 'Try broadening your filters — remove one, or widen the age range.',
    actionLabel: 'Clear all filters',
    disc: 'bg-[#ebf1ec]',
  },
  suppressed: {
    title: 'Fewer than 5 talents match',
    message:
      'To protect privacy we hide all breakdowns when a group is this small. Remove a filter to see results.',
    actionLabel: 'Remove last filter',
    disc: 'bg-[#f2f2ee]',
  },
};

const EmptyState = ({
  variant = 'zero',
  title,
  message,
  actionLabel,
  icon,
  onAction,
  card = true,
  className,
}) => {
  const copy = COPY[variant] ?? COPY.zero;
  const body = (
    <div
      role="status"
      className="mx-auto flex w-full max-w-[420px] flex-col items-center gap-[10px] px-[24px] py-[32px] text-center font-sans"
    >
      <span
        aria-hidden="true"
        className={classNames(
          'flex size-[48px] items-center justify-center rounded-full text-[#387440]',
          copy.disc
        )}
      >
        {icon ?? <PublicIconFilter className="size-[24px]" />}
      </span>
      <p className="m-0 text-[17px] leading-[20px] font-semibold text-[#1c2a21]">
        {title ?? copy.title}
      </p>
      <p className="m-0 max-w-[360px] text-[14px] leading-[20px] text-[#595959]">
        {message ?? copy.message}
      </p>
      {onAction && (
        <Button
          type="button"
          variant="tertiary"
          size="md"
          onClick={onAction}
          className="!rounded-[14px] !px-[22px] !py-[12px]"
        >
          {actionLabel ?? copy.actionLabel}
        </Button>
      )}
    </div>
  );
  if (!card) return <div className={className}>{body}</div>;
  return (
    <div
      className={classNames(
        'rounded-[24px] border border-solid border-[#e7e7e7] bg-white py-[24px] shadow-[0_5px_17px_rgba(0,0,0,0.04)]',
        className
      )}
    >
      {body}
    </div>
  );
};

export default EmptyState;
