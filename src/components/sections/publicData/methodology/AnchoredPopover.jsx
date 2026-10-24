import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';

const log = debug('AnchoredPopover');

/*
 * AnchoredPopover — the engine behind FreshnessTooltip and SuppressionPopover (Figma 8.7.2a 8499:170 and 8.7.2b 8499:188).
 * A trigger button with a small dark card anchored under it: 340 wide, p 16/18, r14, #1a1a18, shadow 0 12 28, 10px below the trigger.
 *   open   : pointer hover, keyboard focus, or click / tap (touch has no hover: "tap opens it; tap outside closes")
 *   close  : Esc (focus returns to the trigger), pointer leaving (150 ms grace) when it was not opened by click or focus, focus leaving the
 *            trigger + card, a pointer press outside
 *   a11y   : the trigger is a real <button aria-haspopup="dialog" aria-expanded aria-controls>, the card is role="dialog" (non-modal, it
 *            holds a link, so it is reachable with Tab right after the trigger) and is named by `label`.
 * Props
 *   trigger         node       the visual of the button (a pill, a "<5" chip …)
 *   triggerLabel    string     accessible name of the button when the visual alone is not enough
 *   label           string     accessible name of the card
 *   children        node       the card content (see TipCard)
 *   placement       'end' | 'center'   card aligned to the trigger's right edge (freshness pill) or centred under it (a "<5" chip)
 *   open            boolean    CONTROLLED open state; omit for uncontrolled
 *   defaultOpen     boolean    uncontrolled initial state (the `?tip=` frames start open and stay interactive)
 *   onOpenChange    fn(open)
 *   className / triggerClassName
 */

const AnchoredPopover = ({
  trigger,
  triggerLabel,
  label,
  children,
  placement = 'end',
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  className,
  triggerClassName,
}) => {
  const [innerOpen, setInnerOpen] = useState(defaultOpen);
  const open = controlledOpen ?? innerOpen;
  const id = useId();
  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const timer = useRef(null);
  const pinned = useRef(false); // opened by click or focus: pointer leave does not close it

  const setOpen = useCallback(
    (next) => {
      log('open', next);
      setInnerOpen(next);
      onOpenChange?.(next);
    },
    [onOpenChange]
  );

  useEffect(() => () => clearTimeout(timer.current), []);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        pinned.current = false;
        setOpen(false);
      }
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open, setOpen]);

  const onKeyDown = (e) => {
    if (e.key === 'Escape' && open) {
      e.stopPropagation();
      pinned.current = false;
      setOpen(false);
      buttonRef.current?.focus();
    }
  };

  const onBlur = (e) => {
    if (!rootRef.current?.contains(e.relatedTarget)) {
      pinned.current = false;
      setOpen(false);
    }
  };

  return (
    <span
      ref={rootRef}
      className={classNames('relative inline-flex', className)}
      onKeyDown={onKeyDown}
      onBlur={onBlur}
      onMouseEnter={() => {
        clearTimeout(timer.current);
        if (!open) setOpen(true);
      }}
      onMouseLeave={() => {
        clearTimeout(timer.current);
        timer.current = setTimeout(() => {
          if (!pinned.current) setOpen(false);
        }, 150);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        aria-label={triggerLabel}
        onFocus={() => {
          pinned.current = true;
          if (!open) setOpen(true);
        }}
        onClick={() => {
          pinned.current = true;
          setOpen(!open);
        }}
        className={classNames(
          'inline-flex cursor-pointer items-center rounded-full border-0 bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
          triggerClassName
        )}
      >
        {trigger}
      </button>
      {open && (
        <div
          id={id}
          role="dialog"
          aria-label={label}
          className={classNames(
            'absolute top-full z-40 mt-[10px] w-[340px] max-w-[calc(100vw-32px)] rounded-[14px] bg-[#1a1a18] px-[18px] py-[16px] text-left font-sans shadow-[0_12px_28px_rgba(0,0,0,0.28)]',
            placement === 'end' ? 'right-0' : 'left-1/2 -translate-x-1/2'
          )}
        >
          {children}
        </div>
      )}
    </span>
  );
};

export default AnchoredPopover;
