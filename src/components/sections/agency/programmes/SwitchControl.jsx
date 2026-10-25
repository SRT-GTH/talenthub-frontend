import { classNames } from '../../../../utils/classNames.js';

/*
 * SwitchControl — the on / off toggle of an eligibility rule (Figma "Label" 8597:393897 / 393932: 44 x 24, r9999; on = #387440 with a white 20px knob on
 * the right, off = #d5d5d5 with a white knob (1px #d1d5db) on the left). A role="switch" button with a visible focus ring.
 * Props: checked, onChange(next), label (accessible name, "Age range"), disabled, className.
 */

const SwitchControl = ({ checked, onChange, label, disabled = false, className }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    disabled={disabled}
    onClick={() => onChange(!checked)}
    className={classNames(
      'flex h-[24px] w-[44px] shrink-0 cursor-pointer items-center rounded-full border-0 p-[2px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440] disabled:cursor-not-allowed disabled:opacity-60',
      checked ? 'justify-end bg-[#387440]' : 'justify-start bg-[#d5d5d5]',
      className
    )}
  >
    <span
      className={classNames(
        'size-[20px] rounded-full bg-white',
        checked ? '' : 'border border-solid border-[#d1d5db]'
      )}
    />
  </button>
);

export default SwitchControl;
