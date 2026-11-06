import { classNames } from '../../../../../utils/classNames.js';
import { TextInput } from '../../../../ui/form';

/* Shared bits for the Reference data sections (Settings › Reference data). */

export const Btn = ({ primary, onClick, children, disabled, type = 'button' }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={classNames(
      'inline-flex min-h-[40px] cursor-pointer items-center rounded-[10px] border-2 border-solid px-[16px] font-sans text-[14px] font-semibold disabled:cursor-not-allowed disabled:opacity-50',
      primary
        ? 'border-[#1c2a21] bg-[#387440] text-white'
        : 'border-[#1c2a21]/30 bg-white text-[#1c2a21]'
    )}
  >
    {children}
  </button>
);

export const Note = ({ tone = 'info', children }) => (
  <div
    className={classNames(
      'rounded-[12px] px-[14px] py-[10px] font-sans text-[14px]',
      tone === 'warn' ? 'bg-[#faf4e8] text-[#463409]' : 'bg-[#eef5ef] text-[#1c2a21]'
    )}
  >
    {children}
  </div>
);

export const Chip = ({ children, tone }) => (
  <span
    className={classNames(
      'inline-flex rounded-full px-[8px] py-[2px] font-sans text-[12px] font-semibold',
      tone === 'good'
        ? 'bg-[#e3f1e5] text-[#1f5a2a]'
        : tone === 'warn'
          ? 'bg-[#faf0dc] text-[#7a5308]'
          : 'bg-[#f0f0ec] text-[#595959]'
    )}
  >
    {children}
  </span>
);

export const ReasonInput = ({ value, onChange, error, placeholder }) => (
  <TextInput
    label="Reason"
    required
    placeholder={placeholder || 'Why this change (for the audit log)'}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    error={error || undefined}
  />
);
