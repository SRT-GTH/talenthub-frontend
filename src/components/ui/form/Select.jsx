import { useEffect, useId, useRef, useState } from 'react';
import Field from './Field.jsx';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';

const log = debug('Select');

/*
 * Select — design-system dropdown.
 * Source: Figma frame 50:6275 ("Drop Downs"). Closed-state visuals mirror
 * TextInput exactly (51px box, same border/shadow ladder per state). Open
 * state pulls a 2px green-tinted menu below the trigger with an inverse
 * shelf shadow (`shadow-[0_-4px_0_<dark>]`) — the trigger and menu visually
 * "hover" 12px apart, connected by their opposing shelves.
 *
 * Hybrid pattern (same as TextInput): accepts Field props directly.
 * Pass `searchable` to enable a filter input at the top of the menu.
 *
 * State derivation priority:
 *   forced `state` > `disabled` > `error` > `verified` > open (interactive) > default
 *
 * `options` accepts either strings or `{ value, label, helperText? }` objects.
 *
 * Out of scope for v1 (compose at parent level if needed):
 *   - Cascading dropdowns: pass `disabled={!parentSelected}` from the consumer.
 *   - Grouped options with section headers: TBD; will require a `groups` prop.
 *   - Multi-select: separate variant when product needs it.
 */

const TRIGGER_BASE =
  'flex h-[51px] items-center gap-2 pl-[20px] pr-[16px] py-[13px] rounded-md w-full ' +
  'transition-colors duration-100 cursor-pointer text-left ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green';

const TRIGGER_STATE_CLASSES = {
  default: 'bg-white border border-[#cccccc] shadow-[0_2.5px_0_0_rgba(191,191,191,0.8)]',
  open: 'bg-white border border-brand-green-light-active shadow-[0_2.5px_0_0_rgba(34,70,38,0.8)]',
  verified:
    'bg-white border-[1.5px] border-brand-green-light-active shadow-[0_2.5px_0_0_rgba(34,70,38,0.8)]',
  error:
    'bg-white border-[1.5px] border-danger-light-active shadow-[0_2.5px_0_0_rgba(146,43,33,0.8)]',
  disabled:
    'bg-brand-green-light border-2 border-[#cccccc] opacity-55 shadow-none cursor-not-allowed',
};

const ChevronDown = ({ className }) => (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
    <path
      d="M5 8l5 5 5-5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SearchIcon = ({ className }) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
    <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
    <path d="m11 11 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// Allow options as strings OR objects.
const normaliseOption = (opt) => (typeof opt === 'string' ? { value: opt, label: opt } : opt);

const Select = ({
  label,
  required,
  optional,
  helperText,
  error,
  state,
  options = [],
  value,
  defaultValue,
  onChange,
  placeholder = 'Select an option',
  searchable = false,
  verified = false,
  disabled = false,
  leftIcon,
  className,
  name,
  id,
  ...rest
}) => {
  const generatedId = useId();
  const triggerId = id || generatedId;
  const listboxId = `${triggerId}-listbox`;

  const wrapperRef = useRef(null);
  const searchRef = useRef(null);

  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = isControlled ? value : internalValue;

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const isForced = Boolean(state);
  const effectiveOpen = isForced ? state === 'open' : open;
  const effectiveDisabled = disabled || state === 'disabled';

  log('render', { label, state, open: effectiveOpen, value: currentValue });

  // Resolve trigger visual state — earliest match wins.
  const triggerState = isForced
    ? state
    : effectiveDisabled
      ? 'disabled'
      : error
        ? 'error'
        : effectiveOpen
          ? 'open'
          : verified
            ? 'verified'
            : 'default';

  const normalisedOptions = options.map(normaliseOption);
  const selected = normalisedOptions.find((opt) => opt.value === currentValue);

  const filteredOptions =
    searchable && query
      ? normalisedOptions.filter((opt) => opt.label.toLowerCase().includes(query.toLowerCase()))
      : normalisedOptions;

  // Click outside / Escape to close.
  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        log('click outside, closing');
        setOpen(false);
        setQuery('');
      }
    };
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        log('escape, closing');
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  // Focus search box when menu opens with searchable enabled.
  useEffect(() => {
    if (open && searchable) {
      requestAnimationFrame(() => searchRef.current?.focus());
    }
  }, [open, searchable]);

  const handleSelect = (option) => {
    log('select:', option.value);
    if (!isControlled) setInternalValue(option.value);
    onChange?.(option.value, option);
    setOpen(false);
    setQuery('');
  };

  const handleTriggerClick = () => {
    if (effectiveDisabled || isForced) return;
    setOpen((prev) => !prev);
  };

  const handleTriggerKey = (e) => {
    if (effectiveDisabled || isForced) return;
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      if (!open) {
        e.preventDefault();
        setOpen(true);
      }
    }
  };

  return (
    <Field
      label={label}
      htmlFor={triggerId}
      required={required}
      optional={optional}
      helperText={helperText}
      error={error}
      className={className}
    >
      <div ref={wrapperRef} className="relative w-full">
        <button
          type="button"
          id={triggerId}
          name={name}
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={effectiveOpen}
          aria-controls={listboxId}
          aria-invalid={Boolean(error) || undefined}
          disabled={effectiveDisabled}
          onClick={handleTriggerClick}
          onKeyDown={handleTriggerKey}
          className={classNames(TRIGGER_BASE, TRIGGER_STATE_CLASSES[triggerState])}
          {...rest}
        >
          {leftIcon && (
            <span
              className="flex items-center justify-center shrink-0 size-4 text-content-tertiary [&>svg]:w-full [&>svg]:h-full [&>img]:w-full [&>img]:h-full"
              aria-hidden="true"
            >
              {leftIcon}
            </span>
          )}
          <span
            className={classNames(
              'flex-1 min-w-0 font-sans text-[14px] leading-[20px] tracking-[0.2px] truncate',
              selected ? 'text-content-primary font-medium' : 'text-[#595959] font-normal'
            )}
          >
            {selected?.label || placeholder}
          </span>
          <ChevronDown
            className={classNames(
              'size-5 shrink-0 text-content-tertiary transition-transform duration-150',
              effectiveOpen && 'rotate-180'
            )}
          />
        </button>

        {effectiveOpen && !effectiveDisabled && (
          <div
            id={listboxId}
            role="listbox"
            aria-labelledby={triggerId}
            className="absolute top-full left-0 right-0 mt-3 z-20 bg-white border-2 border-brand-green-light-active rounded-md shadow-[0_-4px_0_0_rgba(34,70,38,0.8)] p-3 max-h-[340px] overflow-y-auto"
          >
            {searchable && (
              <>
                <div className="flex items-center gap-2 px-3 py-2 border border-[#bfbfbf] rounded-sm">
                  <SearchIcon className="size-4 shrink-0 text-content-tertiary" />
                  <input
                    ref={searchRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Type to filter"
                    className="flex-1 min-w-0 bg-transparent outline-none border-none font-sans text-[12px] leading-[18px] tracking-[0.2px] text-content-primary placeholder:text-[#595959]"
                  />
                </div>
                <div className="h-px bg-[#e7e7e7] opacity-40 my-2" />
              </>
            )}

            <div className="flex flex-col gap-1" role="none">
              {filteredOptions.length === 0 ? (
                <p className="px-3 py-2 font-sans text-[12px] leading-[18px] tracking-[0.2px] text-content-tertiary">
                  No options found
                </p>
              ) : (
                filteredOptions.map((option) => {
                  const isSelected = option.value === currentValue;
                  return (
                    <button
                      type="button"
                      key={option.value}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleSelect(option)}
                      className={classNames(
                        'flex items-center px-3 py-2 rounded-sm text-left cursor-pointer',
                        'font-sans text-[12px] leading-[18px] tracking-[0.2px]',
                        'hover:bg-brand-green-light',
                        isSelected
                          ? 'bg-brand-green-light text-content-primary font-medium'
                          : 'text-[#595959] font-normal'
                      )}
                    >
                      {option.label}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </Field>
  );
};

export default Select;
