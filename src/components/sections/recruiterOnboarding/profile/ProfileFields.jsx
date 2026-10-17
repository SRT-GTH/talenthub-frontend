import { useState } from 'react';
import { TextInput } from '../../../ui/form';
import Field from '../../../ui/form/Field.jsx';
import { EyeOffIcon } from '../../../shared/assets.jsx';
import { helperProps } from './helperProps.jsx';
import { EyeGlyph, FieldLockGlyph, FlagChevronGlyph, FlagGhanaGlyph } from './profileIcons.jsx';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';

const log = debug('ProfileFields');

/*
 * Recruiter profile form controls (R01, Figma 7374:1391 / 1606 / 1821 / 2036).
 *   ProfilePhoneInput    - 96px "flag ▾ +233" prefix box + 246px number box
 *                          (Figma GTHInput 96x51 + 246x51), "SMS verification"
 *                          trailing label, diamond helper/error row.
 *   ProfilePasswordField - TextInput + lock + a REAL, keyboard-reachable eye
 *                          button (aria-pressed, named) - the shared
 *                          PasswordInput toggle is tabIndex -1 so it is not used.
 *   HELPER               - shared props for the diamond helper rows.
 */

export const ProfilePhoneInput = ({
  id,
  value,
  onChange,
  onBlur,
  error,
  hasValue,
  describedBy,
}) => {
  const hasError = Boolean(error);
  log('phone render', { hasError, hasValue });
  const prefix = hasError
    ? 'border border-r-0 border-danger-light-active shadow-[0_2.5px_0_0_rgba(146,43,33,0.8)]'
    : 'border border-r-0 border-[#cccccc] shadow-[0_2.5px_0_0_rgba(191,191,191,0.8)]';
  const number = hasError
    ? 'border border-danger-light-active shadow-[0_2.5px_0_0_rgba(146,43,33,0.8)]'
    : 'border border-[#cccccc] shadow-[0_2.5px_0_0_rgba(191,191,191,0.8)] focus-within:bg-yellow-light focus-within:border-brand-green-light-active focus-within:shadow-[0_2.5px_0_0_rgba(34,70,38,0.8)]';
  return (
    <Field
      label="Phone Number"
      htmlFor={id}
      required
      labelTrailing="SMS verification"
      labelTrailingClassName={hasError ? 'text-danger' : 'text-[#595959]'}
      error={error}
      {...helperProps(hasError)}
    >
      <div className="flex h-[51px] w-full items-stretch max-md:h-11 max-md:[&_*]:shadow-none!">
        <div
          className={classNames(
            'flex h-full w-[96px] shrink-0 items-center gap-2 rounded-l-[10px] bg-white pl-[9px] pr-3 max-md:w-[88px]',
            prefix
          )}
          aria-hidden="true"
        >
          <FlagGhanaGlyph className="size-5 shrink-0" />
          <FlagChevronGlyph className="size-2 shrink-0 text-[#272E35]" />
          <span
            className={classNames(
              'text-[14px] font-medium leading-6',
              hasError ? 'text-danger' : 'text-[#575755]'
            )}
            style={{ letterSpacing: '0.2px' }}
          >
            +233
          </span>
        </div>
        <div
          className={classNames(
            'flex h-full min-w-0 flex-1 items-center rounded-r-[10px] bg-white pl-5 pr-4 max-md:pl-3',
            number
          )}
        >
          <input
            id={id}
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder="Enter phone number"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            aria-invalid={hasError || undefined}
            aria-describedby={describedBy}
            className={classNames(
              'w-0 min-w-0 flex-1 border-none bg-transparent text-[14px] font-medium leading-6 outline-none placeholder:font-normal max-md:text-[16px]',
              hasError
                ? 'text-danger placeholder:text-danger'
                : 'text-[#111111] placeholder:text-[#575755]'
            )}
            style={{ letterSpacing: '0.2px' }}
          />
        </div>
      </div>
    </Field>
  );
};

export const ProfilePasswordField = ({
  id,
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  autoComplete,
}) => {
  const [show, setShow] = useState(false);
  const hasError = Boolean(error);
  return (
    <TextInput
      id={id}
      label={label}
      required
      type={show ? 'text' : 'password'}
      placeholder={placeholder}
      autoComplete={autoComplete}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      error={error}
      helperText={hasError ? undefined : helperText}
      {...helperProps(hasError)}
      leftIcon={<FieldLockGlyph />}
      leftIconClassName={
        hasError ? 'text-danger' : value ? 'text-brand-green' : 'text-content-tertiary'
      }
      rightIconInteractive
      rightIcon={
        <button
          type="button"
          onClick={() => {
            log('toggle visibility', id, !show);
            setShow((s) => !s);
          }}
          aria-label={show ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          aria-pressed={show}
          className="-m-2 flex items-center justify-center rounded-md p-2 text-content-tertiary transition-colors duration-100 hover:text-content-primary focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-green"
        >
          {show ? <EyeOffIcon /> : <EyeGlyph />}
        </button>
      }
    />
  );
};
