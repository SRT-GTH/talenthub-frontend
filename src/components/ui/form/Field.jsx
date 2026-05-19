import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';

const log = debug('Field');

/*
 * Field — generic form-control wrapper.
 * Renders the label row (label + optional required `*` + optional "optional"
 * badge) above the control, and a helper/error row below.
 *
 * Used internally by TextInput / Textarea / Select (the "hybrid" pattern —
 * those primitives accept Field props directly), and exposed for composition
 * when wrapping a non-text control:
 *
 *   <Field label="Avatar" required helperText="PNG only">
 *     <Upload ... />
 *   </Field>
 *
 * Visual source: Figma frame 50:6914. The 16px alert icon next to helper /
 * error text matches the "20-alert" symbol used throughout the design system.
 */

const AlertIcon = ({ className }) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.4" />
    <path d="M8 4.5v4.25" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <circle cx="8" cy="11.4" r="0.85" fill="currentColor" />
  </svg>
);

const Field = ({
  label,
  htmlFor,
  required = false,
  optional = false,
  // labelTrailing renders an arbitrary string on the right side of the label
  // row (replaces the "optional" literal when set). Used by the contact-info
  // page to surface "SMS verification" / "Optional" / "Email verification"
  // adornments in different colors.
  labelTrailing,
  labelTrailingClassName = 'text-brand-green',
  helperText,
  error,
  className,
  children,
  ...rest
}) => {
  log('render', { label, required, optional, hasError: !!error });

  const message = error || helperText;
  const messageColourClass = error ? 'text-danger' : 'text-neutral-darker';
  const showLabelRow = Boolean(label) || optional || Boolean(labelTrailing);

  return (
    <div className={classNames('flex flex-col gap-2 w-full', className)} {...rest}>
      {showLabelRow && (
        <div className="flex h-[21px] items-center justify-between w-full">
          {label ? (
            <label
              htmlFor={htmlFor}
              className="inline-flex items-baseline gap-px font-sans font-medium text-[14px] leading-[24px] tracking-[0.2px] text-content-primary"
            >
              {label}
              {required && (
                <span
                  className="font-semibold text-brand-green text-[14px] leading-[21px]"
                  aria-hidden="true"
                >
                  *
                </span>
              )}
            </label>
          ) : (
            <span aria-hidden="true" />
          )}
          {labelTrailing ? (
            <span
              className={classNames(
                'font-sans text-[12px] leading-[18px] tracking-[0.2px]',
                labelTrailingClassName
              )}
            >
              {labelTrailing}
            </span>
          ) : optional ? (
            <span className="font-sans text-[12px] leading-[18px] tracking-[0.2px] text-[#595959]">
              optional
            </span>
          ) : null}
        </div>
      )}

      {children}

      {message && (
        <div
          className={classNames('flex items-center gap-2 px-2', messageColourClass)}
          role={error ? 'alert' : undefined}
        >
          <AlertIcon className="size-4 shrink-0" />
          <p className="font-sans text-[12px] leading-[18px] tracking-[0.2px]">{message}</p>
        </div>
      )}
    </div>
  );
};

export default Field;
