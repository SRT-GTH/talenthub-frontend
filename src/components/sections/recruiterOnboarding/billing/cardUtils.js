/*
 * cardUtils - pure formatting / detection / validation helpers for the demo
 * card form (Figma R06 7374:7507..7969). UI ONLY: validation is deliberately
 * Luhn-free (demo numbers must work) and nothing here logs, stores or
 * transmits a value. The real tokenisation belongs to the hosted payment
 * provider's fields; see paymentApi.js.
 */

export const digitsOnly = (value) => String(value ?? '').replace(/\D/g, '');

// Visa 4..., Mastercard 51-55 / 2221-2720. Anything else -> 'card'.
export const detectBrand = (digits) => {
  const d = digitsOnly(digits);
  if (/^4/.test(d)) return 'visa';
  if (/^5[1-5]/.test(d)) return 'mastercard';
  const four = Number(d.slice(0, 4));
  if (d.length >= 4 && four >= 2221 && four <= 2720) return 'mastercard';
  return 'card';
};

export const BRAND_LABELS = { visa: 'Visa', mastercard: 'Mastercard', card: 'Card' };

export const CARD_NUMBER_MAX = 19;

// "4084123412341234" -> "4084 1234 1234 1234"
export const formatCardNumber = (value) =>
  digitsOnly(value)
    .slice(0, CARD_NUMBER_MAX)
    .replace(/(.{4})/g, '$1 ')
    .trim();

// Figma filled / declined / success state: "4084 •••• •••• 4081" (first and
// last group visible). Display only; the raw digits stay in the form state.
export const maskCardNumber = (value) => {
  const groups = formatCardNumber(value).split(' ');
  if (groups.length < 3) return groups.join(' ');
  return groups
    .map((g, i) => (i === 0 || i === groups.length - 1 ? g : '•'.repeat(g.length)))
    .join(' ');
};

export const lastFour = (value) => digitsOnly(value).slice(-4);

// "0812" -> "08 / 12". `deleting` lets the user backspace across the separator.
export const formatExpiry = (value, deleting = false) => {
  let d = digitsOnly(value).slice(0, 4);
  if (d.length === 1 && Number(d) > 1) d = `0${d}`;
  if (d.length < 2) return d;
  if (d.length === 2) return deleting ? d : `${d} / `;
  return `${d.slice(0, 2)} / ${d.slice(2)}`;
};

export const CVC_LENGTH = 3;

export const isExpiryValid = (value, now = new Date()) => {
  const d = digitsOnly(value);
  if (d.length !== 4) return false;
  const month = Number(d.slice(0, 2));
  const year = 2000 + Number(d.slice(2));
  if (month < 1 || month > 12) return false;
  // valid through the last day of the expiry month
  return year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth() + 1);
};

export const isCardNumberValid = (value) => {
  const d = digitsOnly(value);
  return d.length >= 13 && d.length <= CARD_NUMBER_MAX;
};

export const isCardComplete = ({ name, number, expiry, cvc }) =>
  String(name ?? '').trim().length >= 2 &&
  isCardNumberValid(number) &&
  isExpiryValid(expiry) &&
  digitsOnly(cvc).length === CVC_LENGTH;

// ---- Mobile Money (Ghana national number, 9 digits after +233) ---------
export const normaliseMomoDigits = (value) => {
  const d = digitsOnly(value);
  return (d.startsWith('0') ? d.slice(1) : d).slice(0, 9);
};

// "241234567" -> "24 123 4567"
export const formatMomoNumber = (value) => {
  const d = normaliseMomoDigits(value);
  return [d.slice(0, 2), d.slice(2, 5), d.slice(5, 9)].filter(Boolean).join(' ');
};

export const isMomoNumberValid = (value) => normaliseMomoDigits(value).length === 9;

// "+233 24 ••• 4567" (Figma 7374:8437 summary row)
export const maskMomoNumber = (value) => {
  const d = normaliseMomoDigits(value);
  return `+233 ${d.slice(0, 2)} ••• ${d.slice(-4)}`;
};
