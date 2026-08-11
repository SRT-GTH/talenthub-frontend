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
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;

  log('render', { label, name, value, checked, disabled });

  return (
    <label
      htmlFor={inputId}
      className={classNames(
        'inline-flex items-center gap-[8px] select-none',
        disabled ? 'cursor-not-allowed opacity-55' : 'cursor-pointer',
        className
      )}
    >
      <span className="relative inline-flex size-[18px] shrink-0 items-center justify-center">
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
            'pointer-events-none size-[18px] rounded-full border-[1.5px]',
            checked ? 'border-brand-green' : 'border-[#cccccc]'
          )}
        />
        {checked && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute size-[10px] rounded-full bg-brand-green"
          />
        )}
      </span>
      {label !== undefined && (
        <span
          className={classNames(
            'font-sans text-[14px] leading-[20px] text-[#404040]',
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
