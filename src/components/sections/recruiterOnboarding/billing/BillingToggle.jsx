import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { BILLING_PERIODS } from './billingData.js';

const log = debug('BillingToggle');

/*
 * BillingToggle - Monthly / "Annual · 2 months free" switch.
 * Figma R05 7374:6764 "Billing toggle": 278x48, r100, #fefefe, 4px padding;
 * active segment = white pill 91x40 with the 2-layer card shadow, text
 * #2a5730 14/500; inactive text #575755 14/400.
 * Real radio group (two native radios, arrow keys work) - the visible
 * segments are their <label>s.
 *
 * Props: value ('monthly' | 'annual'), onChange(key), name.
 */
const ACTIVE_SHADOW = 'shadow-[0_1px_2px_rgba(15,15,10,0.05),0_6px_16px_rgba(15,15,10,0.07)]';

const BillingToggle = ({ value, onChange, name = 'billing-period' }) => (
  <div
    role="radiogroup"
    aria-label="Billing period"
    className="inline-flex max-w-full items-center gap-1 rounded-full bg-[#fefefe] p-1"
  >
    {BILLING_PERIODS.map((period) => {
      const checked = value === period.key;
      const id = `${name}-${period.key}`;
      return (
        <span key={period.key} className="relative inline-flex">
          <input
            id={id}
            type="radio"
            name={name}
            value={period.key}
            checked={checked}
            onChange={() => {
              log('select', period.key);
              onChange(period.key);
            }}
            className="peer sr-only"
          />
          <label
            htmlFor={id}
            className={classNames(
              'inline-flex min-h-10 cursor-pointer items-center whitespace-nowrap rounded-full px-5 py-2 text-[14px] leading-6 tracking-[0.2px] transition-colors duration-150 max-sm:px-3',
              'peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-green',
              checked
                ? classNames('bg-white font-medium text-[#2a5730]', ACTIVE_SHADOW)
                : 'font-normal text-[#575755] hover:text-[#2a5730]'
            )}
          >
            {period.label}
          </label>
        </span>
      );
    })}
  </div>
);

export default BillingToggle;
