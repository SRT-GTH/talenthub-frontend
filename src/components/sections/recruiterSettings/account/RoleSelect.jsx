import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { ArrowheadDownIcon } from '../../../shared/assets.jsx';
import { RoleCheckIcon } from './accountIcons.jsx';

const log = debug('RoleSelect');

/*
 * RoleSelect - the role dropdown of the Team screens: the "Dropdown · …" trigger (51px, #c1d4c4 line, 2.5px green shelf; disabled = #ebf1ec at 55 %) and the open menu
 * "Dropdown · Role (open)" (Figma 10161:79211: white card, 16px radius, #e5e8e3 line, 6px padding; items 10px radius with a 14/24 title + 12/20 #575755 hint, the chosen one on #ebf1ec at 50 % with a green tick).
 * The menu is a fixed-position portal so the invite dialog's scroll area never clips it (SR-05 draws it running past the dialog's bottom edge). Focus stays on the trigger
 * (combobox + aria-activedescendant: ArrowUp / ArrowDown / Home / End / Enter / Escape), so the dialog's focus trap keeps working. Escape closes only the menu.
 * Props: value, onChange(value), options [{ value, label, hint }], label / required (a visible label row, 21px + 8px gap), ariaLabel (when there is no label), disabled,
 *        defaultOpen, onOpenChange(open) (the URL mirrors SR-05's open menu), className.
 */
const GAP = 8;

const RoleSelect = ({
  value,
  onChange,
  options,
  label,
  required = false,
  ariaLabel,
  disabled = false,
  defaultOpen = false,
  onOpenChange,
  className,
}) => {
  const id = useId();
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const [open, setOpen] = useState(defaultOpen && !disabled);
  const [box, setBox] = useState(null);
  const selectedIndex = Math.max(
    0,
    options.findIndex((o) => o.value === value)
  );
  const [active, setActive] = useState(selectedIndex);
  const selected = options[selectedIndex];

  const changeOpen = useCallback(
    (next) => {
      log('open', next);
      setOpen(next);
      onOpenChange?.(next);
    },
    [onOpenChange]
  );

  const place = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const height = menuRef.current?.offsetHeight ?? 264;
    const below = window.innerHeight - rect.bottom - GAP;
    const flip = below < height && rect.top > below;
    setBox({
      left: rect.left,
      width: rect.width,
      top: flip ? Math.max(8, rect.top - GAP - height) : rect.bottom + GAP,
    });
  }, []);

  useLayoutEffect(() => {
    if (!open) return undefined;
    place();
    const frame = requestAnimationFrame(place);
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
    };
  }, [open, place]);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (event) => {
      if (triggerRef.current?.contains(event.target) || menuRef.current?.contains(event.target))
        return;
      log('click outside, closing');
      changeOpen(false);
    };
    // Escape closes only the menu (capture phase on window, so the dialog's own Escape handler never sees it), wherever the focus is.
    const onEscape = (event) => {
      if (event.key !== 'Escape') return;
      event.stopPropagation();
      event.preventDefault();
      log('escape, closing the menu');
      changeOpen(false);
      triggerRef.current?.focus();
    };
    document.addEventListener('mousedown', onDown);
    window.addEventListener('keydown', onEscape, true);
    return () => {
      document.removeEventListener('mousedown', onDown);
      window.removeEventListener('keydown', onEscape, true);
    };
  }, [open, changeOpen]);

  const choose = (option) => {
    log('select', option.value);
    onChange?.(option.value);
    changeOpen(false);
    triggerRef.current?.focus();
  };

  const onKeyDown = (event) => {
    if (disabled) return;
    const last = options.length - 1;
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
        event.preventDefault();
        setActive(selectedIndex);
        changeOpen(true);
      }
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive((i) => Math.min(last, i + 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((i) => Math.max(0, i - 1));
    } else if (event.key === 'Home') {
      event.preventDefault();
      setActive(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      setActive(last);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      choose(options[active]);
    } else if (event.key === 'Tab') {
      changeOpen(false);
    }
  };

  const listId = `${id}-list`;
  return (
    <div className={classNames('flex w-full min-w-0 flex-col gap-[8px]', className)}>
      {label ? (
        <label
          htmlFor={`${id}-trigger`}
          className="inline-flex h-[21px] items-baseline gap-px font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#111]"
        >
          {label}
          {required ? (
            <span
              aria-hidden="true"
              className="font-ui text-[14px] leading-[21px] font-semibold text-[#2E8B57]"
            >
              *
            </span>
          ) : null}
        </label>
      ) : null}
      <button
        ref={triggerRef}
        id={`${id}-trigger`}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open ? `${id}-opt-${active}` : undefined}
        aria-label={label ? undefined : ariaLabel}
        disabled={disabled}
        onClick={() => {
          if (disabled) return;
          setActive(selectedIndex);
          changeOpen(!open);
        }}
        onKeyDown={onKeyDown}
        className={classNames(
          'flex h-[51px] w-full cursor-pointer items-center gap-[8px] rounded-[10px] py-[13px] pr-[16px] pl-[20px] text-left max-md:h-[44px] max-md:py-0',
          disabled
            ? 'cursor-not-allowed border-2 border-solid border-[#ccc] bg-[#ebf1ec] opacity-55'
            : 'border border-solid border-[#c1d4c4] bg-white shadow-[0_2.5px_0_0_rgba(34,70,38,0.8)] max-md:shadow-none',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green'
        )}
      >
        <span className="min-w-0 flex-1 truncate font-sans text-[14px] leading-[20px] font-normal tracking-[0.2px] text-[#111]">
          {selected?.label}
        </span>
        <ArrowheadDownIcon
          className={classNames(
            'size-[20px] shrink-0 text-[#387440] transition-transform duration-150',
            open && 'rotate-180'
          )}
        />
      </button>
      {open && typeof document !== 'undefined'
        ? createPortal(
            <div
              ref={menuRef}
              id={listId}
              role="listbox"
              aria-label={label ?? ariaLabel}
              style={
                box ? { top: box.top, left: box.left, width: box.width } : { visibility: 'hidden' }
              }
              className="fixed z-[2100] flex flex-col gap-[2px] rounded-[16px] border border-solid border-[#e5e8e3] bg-white p-[6px] shadow-[0_2px_4px_rgba(15,15,10,0.06),0_12px_28px_rgba(15,15,10,0.1)]"
            >
              {options.map((option, index) => {
                const chosen = option.value === value;
                return (
                  <div
                    key={option.value}
                    id={`${id}-opt-${index}`}
                    role="option"
                    aria-selected={chosen}
                    onMouseEnter={() => setActive(index)}
                    onClick={() => choose(option)}
                    className={classNames(
                      'flex cursor-pointer items-center gap-[10px] rounded-[10px] px-[10px] py-[8px]',
                      chosen || index === active ? 'bg-[#ebf1ec]/50' : 'bg-transparent'
                    )}
                  >
                    <span className="flex min-w-0 flex-1 flex-col gap-px">
                      <span
                        className={classNames(
                          'font-sans text-[14px] leading-[24px] tracking-[0.2px] text-[#111]',
                          chosen ? 'font-medium' : 'font-normal'
                        )}
                      >
                        {option.label}
                      </span>
                      <span className="font-sans text-[12px] leading-[20px] tracking-[0.2px] text-[#575755]">
                        {option.hint}
                      </span>
                    </span>
                    {chosen ? <RoleCheckIcon className="shrink-0 text-[#387440]" /> : null}
                  </div>
                );
              })}
            </div>,
            document.body
          )
        : null}
    </div>
  );
};

export default RoleSelect;
