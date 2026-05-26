import { useState, useId } from 'react';
import TextInput from './TextInput.jsx';
import { LockIcon, EyeIcon, EyeOffIcon } from '../../shared/assets.jsx';
import { debug } from '../../../utils/debug.js';

const log = debug('PasswordInput');

/*
 * PasswordInput — password field with show / hide toggle.
 *
 * Thin wrapper around TextInput that:
 *   • Always renders LockIcon as the leftIcon (brand-green tint).
 *   • Adds an EyeIcon / EyeOffIcon toggle button as the rightIcon that
 *     switches the underlying input between type="password" and type="text".
 *
 * Accepts all TextInput props (label, required, error, helperText,
 * successText, etc.). The `type` and `rightIcon` props are reserved
 * — they are derived from internal state and cannot be overridden.
 *
 * react-hook-form usage — spread `register`:
 *   <PasswordInput label="Password" required {...register('password')} />
 *
 * Figma source: institution contact step password fields.
 */

const PasswordInput = ({
  label,
  required,
  optional,
  labelTrailing,
  labelTrailingClassName,
  helperText,
  successText,
  error,
  disabled = false,
  state,
  id,
  className,
  ref,
  ...inputProps
}) => {
  const [show, setShow] = useState(false);
  const generatedId = useId();
  const inputId = id || generatedId;

  log('render', { label, show, disabled, hasError: Boolean(error) });

  const toggleShow = () => {
    log('toggle visibility:', !show);
    setShow((s) => !s);
  };

  return (
    <TextInput
      ref={ref}
      id={inputId}
      label={label}
      required={required}
      optional={optional}
      labelTrailing={labelTrailing}
      labelTrailingClassName={labelTrailingClassName}
      helperText={helperText}
      successText={successText}
      error={error}
      disabled={disabled}
      state={state}
      type={show ? 'text' : 'password'}
      leftIcon={<LockIcon />}
      leftIconClassName="text-brand-green"
      rightIcon={
        <button
          type="button"
          tabIndex={-1}
          onClick={toggleShow}
          className="flex items-center justify-center text-content-tertiary hover:text-content-primary transition-colors duration-100"
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      }
      rightIconInteractive
      className={className}
      {...inputProps}
    />
  );
};

export default PasswordInput;
