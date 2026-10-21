/* Mock money helpers for the Wallet dialogs (display only — nothing is stored or sent). */
export const WALLET_BALANCE = 1240.5;

// "1,240.5" / "200" -> 1240.5 / 200 ; anything unreadable -> NaN
export const parseAmount = (text) => Number.parseFloat(String(text).replace(/,/g, ''));

// 1240.5 -> "1,240.50"
export const formatAmount = (n) =>
  Number.isFinite(n)
    ? n.toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : '';
