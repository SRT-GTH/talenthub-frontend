import { useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import BillingInput from './BillingInput.jsx';
import { CalendarIcon, CardIcon, LockIcon, ShieldIcon, UserIcon } from './billingIcons.jsx';
import {
  BRAND_LABELS,
  CVC_LENGTH,
  detectBrand,
  digitsOnly,
  formatCardNumber,
  formatExpiry,
  isCardNumberValid,
  maskCardNumber,
} from './cardUtils.js';
import { useDigitCaret } from './useDigitCaret.js';

const log = debug('CardForm');

/*
 * CardForm - cardholder / number / expiry / CVV fields (Figma R06 7374:7507
 * default, 7738 filled, 7969 declined).
 *   Cardholder Name  autocomplete cc-name, placeholder "Name as shown on card"
 *   Card Number      cc-number, groups of 4, brand detected -> the right-hand
 *                    label reads "Visa" / "Mastercard" (default "Visa · Mastercard");
 *                    once complete and blurred the middle groups are masked
 *                    ("4084 •••• •••• 4081") exactly like the filled frame
 *   Expiry Date      cc-exp, "MM / YY" auto-separator
 *   CVV              cc-csc, 3 digits, masked (type=password)
 *   info note        "Payments are encrypted and processed by Paystack. ..."
 *                    (hidden while the decline error is shown, like 7374:7969)
 * Declined: card number turns red + helper row (role=alert).
 *
 * Controlled by the page: `card` = { name, number (digits), expiry (formatted),
 * cvc (digits) }. SECURITY: values live only in the page's component state, are
 * never logged (log lines carry lengths/booleans only) and `settled` (set after
 * success) swaps the inputs for read-only masked placeholders.
 *
 * Props: card, onChange(patch), declined, declinedMessage, settled
 *        ({name, masked, expiry}), disabled, numberRef.
 */
const CardForm = ({ card, onChange, declined, declinedMessage, settled, disabled, numberRef }) => {
  const [numberFocused, setNumberFocused] = useState(false);
  const numberCaret = useDigitCaret();
  const expiryCaret = useDigitCaret();

  const brand = detectBrand(card.number);
  const brandLabel = digitsOnly(card.number).length ? BRAND_LABELS[brand] : null;
  const complete = isCardNumberValid(card.number);

  const numberDisplay = settled
    ? settled.masked
    : !numberFocused && complete
      ? maskCardNumber(card.number)
      : formatCardNumber(card.number);

  log('render', {
    brand,
    numberLength: digitsOnly(card.number).length,
    focused: numberFocused,
    declined: Boolean(declined),
    settled: Boolean(settled),
  });

  const setNumberRefs = (el) => {
    numberCaret.ref.current = el;
    if (numberRef) numberRef.current = el;
  };

  return (
    <div className="flex flex-col gap-4 max-md:gap-3">
      <BillingInput
        label="Cardholder Name"
        required
        icon={<UserIcon className="size-4" />}
        type="text"
        autoComplete="cc-name"
        placeholder="Name as shown on card"
        value={settled ? settled.name : card.name}
        onChange={(e) => onChange({ name: e.target.value })}
        readOnly={Boolean(settled)}
        disabled={disabled && !settled}
      />

      <BillingInput
        label="Card Number"
        required
        trailingLabel={brandLabel || 'Visa · Mastercard'}
        icon={<CardIcon className="size-4" />}
        inputRef={setNumberRefs}
        type="text"
        inputMode="numeric"
        autoComplete="cc-number"
        placeholder="0000 0000 0000 0000"
        value={numberDisplay}
        onChange={(e) => {
          numberCaret.remember(e.target);
          onChange({ number: digitsOnly(e.target.value).slice(0, 19) });
        }}
        onFocus={() => setNumberFocused(true)}
        onBlur={() => setNumberFocused(false)}
        readOnly={Boolean(settled)}
        disabled={disabled && !settled}
        error={Boolean(declined)}
        helper={declined ? declinedMessage : undefined}
      />

      <div className="grid grid-cols-2 gap-4 max-md:gap-3">
        <BillingInput
          label="Expiry Date"
          required
          icon={<CalendarIcon className="size-4" />}
          inputRef={expiryCaret.ref}
          type="text"
          inputMode="numeric"
          autoComplete="cc-exp"
          placeholder="MM / YY"
          maxLength={7}
          value={settled ? settled.expiry : card.expiry}
          onChange={(e) => {
            expiryCaret.remember(e.target);
            const deleting = e.nativeEvent?.inputType?.startsWith('delete');
            onChange({ expiry: formatExpiry(e.target.value, Boolean(deleting)) });
          }}
          readOnly={Boolean(settled)}
          disabled={disabled && !settled}
        />
        <BillingInput
          label="CVV"
          required
          icon={<LockIcon className="size-4" />}
          type="password"
          inputMode="numeric"
          autoComplete="cc-csc"
          placeholder="3 digits"
          maxLength={CVC_LENGTH}
          value={settled ? '•••' : card.cvc}
          onChange={(e) => onChange({ cvc: digitsOnly(e.target.value).slice(0, CVC_LENGTH) })}
          readOnly={Boolean(settled)}
          disabled={disabled && !settled}
        />
      </div>

      {!declined && (
        <div className="flex items-center gap-[10px] rounded-[10px] border border-[#387440]/30 bg-[#ebf1ec]/50 px-4 py-3">
          <ShieldIcon className="size-[18px] shrink-0 text-[#387440]" />
          <p className="text-[14px] leading-6 tracking-[0.2px] text-[#2a5730]">
            Payments are encrypted and processed by Paystack. GTH never stores your full card
            number.
          </p>
        </div>
      )}
    </div>
  );
};

export default CardForm;
