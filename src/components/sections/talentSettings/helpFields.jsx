import { classNames } from '../../../utils/classNames.js';

/*
 * Form field used by HP-05 Contact support and HP-07 Report a problem ("Input ields" instance,
 * `GTHInput` 2282:8890 / 8132:400299): label 14 Medium + green required star + optional counter,
 * 10px-radius box with #ccc border; Focused soft shadow, Playful 2.5px grey shelf.
 */
const BOX =
  'block w-full rounded-[10px] border border-solid border-[#ccc] bg-white py-[13px] pl-[20px] pr-[16px] font-sans text-[14px] font-medium leading-[24px] tracking-[0.2px] text-[#1c2a21] shadow-[0_2px_8px_rgba(28,42,33,0.04),0_1px_2px_rgba(28,42,33,0.04)] outline-none placeholder:text-[#bfbfbf] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green playful:shadow-[0_2.5px_0_rgba(191,191,191,0.8)]';

const HelpField = ({
  id,
  label,
  required = false,
  star = required,
  counter,
  multiline = false,
  value,
  onChange,
  maxLength,
  className,
}) => (
  <div className={classNames('flex w-full flex-col gap-[8px]', className)}>
    <div className="flex h-[21px] items-center justify-between">
      <label htmlFor={id} className="inline-flex gap-px">
        <span className="font-sans text-[14px] font-medium leading-[24px] tracking-[0.2px] text-[#1c2a21]">
          {label}
        </span>
        {star && (
          <span
            aria-hidden="true"
            className="font-semibold text-[14px] leading-[21px] text-[#2e8b57]"
            style={{ fontFamily: "'Instrument Sans', var(--font-sans)" }}
          >
            *
          </span>
        )}
      </label>
      <span className="font-sans text-[12px] leading-[18px] tracking-[0.2px] text-[#595959]">
        {counter ?? ' '}
      </span>
    </div>
    {multiline ? (
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        required={required}
        className={classNames(BOX, 'h-[112px] resize-none')}
      />
    ) : (
      <input
        id={id}
        type="text"
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        required={required}
        className={classNames(BOX, 'h-[51px]')}
      />
    )}
  </div>
);

export default HelpField;
