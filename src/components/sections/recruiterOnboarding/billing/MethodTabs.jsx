import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { CardTabIcon, PhoneTabIcon } from './billingIcons.jsx';
import { panelId, tabId } from './billingData.js';

const log = debug('MethodTabs');

/*
 * MethodTabs - "Card | Mobile Money" segmented control.
 * Figma R06 7374:7507 "Segmented control": 699x56, white, r10, pad 4, two 48px
 * segments (r6, pad 12/16, gap 8); active = white + 2-layer shadow, label
 * #2a5730 14/500; inactive label #575755 14/400; 18px green icons.
 * Implemented as a WAI-ARIA tablist (roving tabindex, Left/Right/Home/End);
 * the panels are rendered by the page with role="tabpanel".
 *
 * Props: value ('card' | 'momo'), onChange(key), idPrefix, disabled.
 */
const TABS = [
  {
    key: 'card',
    label: 'Card',
    icon: <CardTabIcon className="size-[18px] shrink-0" />,
  },
  {
    key: 'momo',
    label: 'Mobile Money',
    icon: <PhoneTabIcon className="size-[18px] shrink-0" />,
  },
];

const MethodTabs = ({ value, onChange, idPrefix = 'pay-method', disabled = false }) => {
  const move = (e, index) => {
    const last = TABS.length - 1;
    let next = null;
    if (e.key === 'ArrowRight') next = index === last ? 0 : index + 1;
    else if (e.key === 'ArrowLeft') next = index === 0 ? last : index - 1;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = last;
    if (next == null) return;
    e.preventDefault();
    const key = TABS[next].key;
    log('arrow', key);
    onChange(key);
    document.getElementById(tabId(idPrefix, key))?.focus();
  };

  return (
    <div
      role="tablist"
      aria-label="Payment method"
      className="grid grid-cols-2 gap-1 rounded-[10px] bg-white p-1"
    >
      {TABS.map(({ key, label, icon }, index) => {
        const active = key === value;
        return (
          <button
            key={key}
            id={tabId(idPrefix, key)}
            type="button"
            role="tab"
            aria-selected={active}
            aria-controls={panelId(idPrefix, key)}
            tabIndex={active ? 0 : -1}
            disabled={disabled}
            onClick={() => onChange(key)}
            onKeyDown={(e) => move(e, index)}
            className={classNames(
              'inline-flex min-h-12 items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-3 text-[14px] leading-6 tracking-[0.2px] transition-colors duration-150 max-sm:px-2',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green disabled:cursor-not-allowed',
              active
                ? 'bg-white font-medium text-[#2a5730] shadow-[0_1px_2px_rgba(15,15,10,0.05),0_6px_16px_rgba(15,15,10,0.07)]'
                : 'font-normal text-[#575755] hover:text-[#2a5730]'
            )}
          >
            {icon}
            {label}
          </button>
        );
      })}
    </div>
  );
};

export default MethodTabs;
