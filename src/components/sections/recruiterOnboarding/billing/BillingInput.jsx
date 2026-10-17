import { useId } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { DiamondAlertIcon } from './billingIcons.jsx';

const log = debug('BillingInput');

/*
 * BillingInput - labelled text field for the R06 payment forms.
 * Figma "GTHInput" 7374:7507: 51px, r10, pad 13/16/13/20, 1px #ccc border,
 * 2.5px #bfbfbf shelf, 16px green leading icon (#387440), value 14/500 #1c2a21
 * (placeholder 14/400 #595959). Label 14/500 #1c2a21 + green `*`; optional
 * right-hand label text (12 #595959). Error (declined, 7374:7969): border
 * 1.5px #ebc2bd, red shelf rgba(146,43,33,.8), value #c0392b, plus a helper row
 * with the green diamond alert + 12px #575755 text (announced, role="alert").
 * Built here (instead of TextInput) so the helper can be linked with a real
 * aria-describedby id and the value colour can follow the error state.
 *
 * Props: label, required, trailingLabel, icon, prefix (node, left of input,
 *        Mobile Money "+233"), error (bool), helper (string), inputRef, and any
 *        <input> prop (value, onChange, autoComplete, inputMode, ...).
 */
const BASE =
  'flex items-center gap-2 rounded-[10px] bg-white pl-5 pr-4 py-[13px] transition-colors duration-100 max-md:py-[9px] max-md:pl-3 max-md:pr-3 max-md:shadow-none!';
const IDLE =
  'border border-[#cccccc] shadow-[0_2.5px_0_0_rgba(191,191,191,0.8)] focus-within:border-brand-green-light-active focus-within:bg-yellow-light focus-within:shadow-[0_2.5px_0_0_rgba(34,70,38,0.8)]';
const ERROR =
  'border-[1.5px] border-[#ebc2bd] shadow-[0_2.5px_0_0_rgba(146,43,33,0.8)] focus-within:border-[#ebc2bd]';

const BillingInput = ({
  label,
  required,
  trailingLabel,
  icon,
  prefix,
  error = false,
  helper,
  inputRef,
  id,
  className,
  ...inputProps
}) => {
  const generated = useId();
  const inputId = id || generated;
  const helperId = `${inputId}-helper`;
  log('render', { label, error, hasHelper: Boolean(helper) });

  return (
    <div className={classNames('flex w-full flex-col gap-2 max-md:gap-1.5', className)}>
      <div className="flex min-h-6 items-center justify-between gap-3">
        <label
          htmlFor={inputId}
          className="inline-flex items-baseline gap-px text-[14px] font-medium leading-6 tracking-[0.2px] text-[#1c2a21] max-md:text-[13px]"
        >
          {label}
          {required && (
            <span
              aria-hidden="true"
              className="text-[14px] font-semibold leading-[21px] text-[#2e8b57]"
            >
              *
            </span>
          )}
        </label>
        {trailingLabel && (
          <span className="text-[12px] leading-[18px] tracking-[0.2px] text-[#595959]">
            {trailingLabel}
          </span>
        )}
      </div>

      <div className={classNames(BASE, prefix && 'pl-0 max-md:pl-0', error ? ERROR : IDLE)}>
        {prefix}
        {icon && (
          <span className="inline-flex size-4 shrink-0 text-[#387440]" aria-hidden="true">
            {icon}
          </span>
        )}
        <input
          ref={inputRef}
          id={inputId}
          aria-invalid={error || undefined}
          aria-describedby={helper ? helperId : undefined}
          className={classNames(
            'w-0 min-w-0 flex-1 border-none bg-transparent text-[14px] font-medium leading-6 tracking-[0.2px] outline-none',
            'placeholder:font-normal placeholder:text-[#595959] max-md:text-[16px]',
            error ? 'text-[#c0392b]' : 'text-[#1c2a21]'
          )}
          {...inputProps}
        />
      </div>

      {helper && (
        <p
          id={helperId}
          role="alert"
          className="flex items-center gap-2 px-2 text-[12px] leading-[18px] tracking-[0.2px] text-[#575755]"
        >
          <DiamondAlertIcon className="size-4 shrink-0 text-[#387440]" />
          {helper}
        </p>
      )}
    </div>
  );
};

export default BillingInput;
