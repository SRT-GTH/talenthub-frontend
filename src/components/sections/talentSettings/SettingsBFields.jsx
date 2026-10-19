import { useId } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { SettingsCheckIcon } from '../../shared/assets.jsx';

/*
 * Form pieces for the Settings-B dialogs and the guardian invite form (Figma GTHInput 51px field,
 * checkbox 22px, relationship pills). Focused = flat soft shadow; Playful = the stronger
 * `0 4px 16px` drop (Figma 7856:232943 / 7856:235239). Colours exact.
 */

const BOX =
  'flex h-[51px] w-full items-center rounded-[10px] border border-[#ccc] bg-white pr-[16px] pl-[20px] ' +
  'shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_11px_rgba(28,42,33,0.03)] ' +
  'playful:shadow-[0_1px_2px_rgba(28,42,33,0.04),0_4px_16px_rgba(28,42,33,0.06)] ' +
  'focus-within:border-2 focus-within:border-[#c1d4c4] focus-within:bg-[#fffefc] focus-within:pr-[15px] focus-within:pl-[19px] ' +
  'has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#111] max-lg:h-[44px]';

export const FieldB = ({
  label,
  value,
  onChange,
  type = 'text',
  invalid = false,
  inputRef,
  inputMode,
  autoComplete,
  className,
  name,
  ...rest
}) => {
  const id = useId();
  return (
    <div className={classNames('flex w-full min-w-0 flex-col items-start gap-[8px]', className)}>
      <label
        htmlFor={id}
        className="text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#1c2a21]"
      >
        {label}
      </label>
      <div className={classNames(BOX, invalid && 'border-[#c0392b]')}>
        <input
          id={id}
          ref={inputRef}
          name={name}
          type={type}
          value={value}
          inputMode={inputMode}
          autoComplete={autoComplete}
          aria-invalid={invalid || undefined}
          onChange={(event) => onChange(event.target.value)}
          className="w-0 min-w-0 flex-1 border-none bg-transparent font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#1c2a21] outline-none!"
          {...rest}
        />
      </div>
    </div>
  );
};

// 22px checkbox, green when on (white tick), with its label.
export const CheckboxB = ({ checked, onChange, children }) => (
  <label className="flex min-h-[24px] w-full cursor-pointer items-center gap-[10px]">
    <input
      type="checkbox"
      checked={checked}
      onChange={(event) => onChange(event.target.checked)}
      className="peer sr-only"
    />
    <span
      aria-hidden="true"
      className={classNames(
        'flex size-[22px] shrink-0 items-center justify-center rounded-[6px] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#387440]',
        checked ? 'bg-[#387440] text-white' : 'border border-[#ccc] bg-white'
      )}
    >
      {checked && <SettingsCheckIcon className="size-[16px]" />}
    </span>
    <span className="text-[14px] leading-[normal] font-medium text-[#1c2a21]">{children}</span>
  </label>
);

// Relationship pills (Mother / Father / Guardian / Other): ink fill when chosen.
export const PillChoice = ({ options, value, onChange, label }) => (
  <div
    role="radiogroup"
    aria-label={label}
    className="flex w-full flex-wrap items-start gap-[8px] pt-[8px]"
  >
    {options.map((option) => {
      const active = option === value;
      return (
        <button
          key={option}
          type="button"
          role="radio"
          aria-checked={active}
          onClick={() => onChange(option)}
          className={classNames(
            'cursor-pointer rounded-full border px-[14px] py-[8px] text-[14px] leading-[normal] font-semibold whitespace-nowrap',
            active
              ? 'border-[#1c2a21] bg-[#1c2a21] text-white'
              : 'border-[rgba(28,42,33,0.1)] bg-white text-[#1c2a21] playful:border-[rgba(28,42,33,0.2)]'
          )}
        >
          {option}
        </button>
      );
    })}
  </div>
);
