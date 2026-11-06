import { useId } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';

const log = debug('Radio');

/*
 * Radio — single option in a radio group (Figma job-post / form radios).
 * Green ring + filled center when selected; grey ring when idle.
 * Pair multiple radios with the same `name` for exclusive selection.
 */

const Radio = ({
  label,
  name,
  value,
  checked = false,
  onChange,
  disabled = false,
  id,
  className,
  labelClassName,
  // Opt-in `compact` look (recruiter job-post form, Figma 7958:165478 selected /
  // 7958:165484 idle): 16px slot, 1px #595959 ring idle, #ebf1ec fill + 1px green
  // ring + 8px dot selected, 6px gap, #595959 label. Default = unchanged.
  compact = false,
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;

  log('render', { label, name, value, checked, disabled });

  return (
    <label
      htmlFor={inputId}
      className={classNames(
        'inline-flex items-center select-none',
        compact ? 'gap-[6px]' : 'gap-[8px]',
        'max-md:min-h-11',
        disabled ? 'cursor-not-allowed opacity-55' : 'cursor-pointer',
        className
      )}
    >
      <span
        className={classNames(
          'relative inline-flex shrink-0 items-center justify-center',
          compact ? 'size-4' : 'size-[18px]'
        )}
      >
        <input
          id={inputId}
          type="radio"
          name={name}
          value={value}
          checked={checked}
          disabled={disabled}
          onChange={() => {
            if (disabled) return;
            log('change:', value);
            onChange?.(value);
          }}
          className="absolute inset-0 m-0 cursor-pointer opacity-0 disabled:cursor-not-allowed"
        />
        <span
          aria-hidden="true"
          className={classNames(
            'pointer-events-none rounded-full',
            compact
              ? checked
                ? 'size-4 border border-brand-green bg-brand-green-light'
                : 'size-[14px] border border-[#595959]'
              : classNames(
                  'size-[18px] border-[1.5px]',
                  checked ? 'border-brand-green' : 'border-[#cccccc]'
                )
          )}
        />
        {checked && (
          <span
            aria-hidden="true"
            className={classNames(
              'pointer-events-none absolute rounded-full bg-brand-green',
              compact ? 'size-2' : 'size-[10px]'
            )}
          />
        )}
      </span>
      {label !== undefined && (
        <span
          className={classNames(
            'font-sans text-[14px] leading-[20px]',
            compact ? 'tracking-[0.2px] text-[#595959]' : 'text-[#404040]',
            labelClassName
          )}
        >
          {label}
        </span>
      )}
    </label>
  );
};

export default Radio;
