import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import BillingInput from './BillingInput.jsx';
import {
  AirtelTigoMark,
  ChevronDownIcon,
  GhanaFlagIcon,
  MtnMark,
  PhoneTabIcon,
  TelecelMark,
} from './billingIcons.jsx';
import { MOMO_NETWORKS } from './billingData.js';
import { formatMomoNumber, normaliseMomoDigits } from './cardUtils.js';
import { useDigitCaret } from './useDigitCaret.js';

const log = debug('MomoForm');

/*
 * MomoForm - Mobile Money network + number (Figma R06 7374:8197 filled,
 * 8437 awaiting approval behind the dialog).
 *   "Mobile Money Network"  3 options (MTN MoMo selected by default): 52px,
 *       r10, pad 12/16, gap 8; selected = #ebf1ec fill + 2px #387440 border,
 *       500 weight; others white + 1px #d9dbd6. Native radio group.
 *   "Mobile Money Number" *  "Must be registered for MoMo", +233 prefix with
 *       Ghana flag, placeholder-free value "24 123 4567" (digits only stored;
 *       a leading 0 is dropped), autocomplete tel-national.
 *   info note: phone icon + "We'll send a payment prompt to this number. ..."
 * The three network logos are MISSING raster assets - hand-drawn stand-ins in
 * billingIcons.jsx (intended final files: src/assets/payment/*.png).
 *
 * Props: momo { network, number }, onChange(patch), disabled.
 */
const MARKS = { mtn: MtnMark, telecel: TelecelMark, airteltigo: AirtelTigoMark };

const Prefix = () => (
  <span
    aria-hidden="true"
    className="mr-3 flex shrink-0 items-center gap-2 self-stretch border-r border-[#cccccc] pl-[9px] pr-4"
  >
    <span className="flex items-center gap-1">
      <GhanaFlagIcon className="size-5" />
      <ChevronDownIcon className="size-2" />
    </span>
    <span className="text-[14px] font-medium leading-6 tracking-[0.2px] text-[#575755]">+233</span>
  </span>
);

const MomoForm = ({ momo, onChange, disabled }) => {
  const caret = useDigitCaret();
  log('render', { network: momo.network, numberLength: normaliseMomoDigits(momo.number).length });

  return (
    <div className="flex flex-col gap-4 max-md:gap-3">
      <fieldset className="flex min-w-0 flex-col gap-2 border-0 p-0">
        <legend className="mb-2 p-0 text-[14px] font-medium leading-6 tracking-[0.2px] text-[#111111]">
          Mobile Money Network
        </legend>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {MOMO_NETWORKS.map((network) => {
            const checked = momo.network === network.key;
            const Mark = MARKS[network.key];
            const id = `momo-network-${network.key}`;
            return (
              <span key={network.key} className="relative block">
                <input
                  id={id}
                  type="radio"
                  name="momo-network"
                  value={network.key}
                  checked={checked}
                  disabled={disabled}
                  onChange={() => {
                    log('network', network.key);
                    onChange({ network: network.key });
                  }}
                  className="peer sr-only"
                />
                <label
                  htmlFor={id}
                  className={classNames(
                    'flex min-h-[52px] cursor-pointer items-center gap-2 rounded-[10px] px-4 py-3 text-[14px] leading-6 tracking-[0.2px] text-[#111111] transition-colors duration-150',
                    'peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-green',
                    checked
                      ? 'border-2 border-[#387440] bg-[#ebf1ec] font-medium'
                      : 'border border-[#d9dbd6] bg-white font-normal hover:border-brand-green-light-active'
                  )}
                >
                  <Mark className="size-6 shrink-0 rounded-[5px]" />
                  <span className="whitespace-nowrap">{network.label}</span>
                </label>
              </span>
            );
          })}
        </div>
      </fieldset>

      <BillingInput
        label="Mobile Money Number"
        required
        trailingLabel="Must be registered for MoMo"
        prefix={<Prefix />}
        inputRef={caret.ref}
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        value={formatMomoNumber(momo.number)}
        onChange={(e) => {
          caret.remember(e.target);
          onChange({ number: normaliseMomoDigits(e.target.value) });
        }}
        disabled={disabled}
      />

      <div className="flex items-center gap-[10px] rounded-[10px] border border-[#387440]/30 bg-[#ebf1ec]/50 px-4 py-3">
        <PhoneTabIcon className="size-[18px] shrink-0" />
        <p className="text-[14px] leading-6 tracking-[0.2px] text-[#2a5730]">
          We&apos;ll send a payment prompt to this number. Approve it with your MoMo PIN — it
          expires in 2 minutes.
        </p>
      </div>
    </div>
  );
};

export default MomoForm;
