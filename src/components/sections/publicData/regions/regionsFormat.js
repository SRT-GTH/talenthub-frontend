/*
 * regionsFormat.js — small text helpers shared by the region, district and compare screens (Theme 8, Figma 8.3).
 * Counts always go through formatCount() in publicDataFormat.js; these only format percentages and ordinals.
 */

/** 4 → "▲ +4%", -1 → "▼ −1%" (the district table draws a true minus sign U+2212, Figma 8494:2009). */
export const tableChange = (pct) => (pct >= 0 ? `▲ +${pct}%` : `▼ −${Math.abs(pct)}%`);

/** 6 → "+6%" (compare table, 8495:2048). */
export const signedPct = (pct) => `${pct >= 0 ? '+' : '−'}${Math.abs(pct)}%`;

/** Spoken form for screen readers: "up 4% in the last 30 days". */
export const spokenChange = (pct) =>
  `${pct >= 0 ? 'up' : 'down'} ${Math.abs(pct)}% in the last 30 days`;

/** "Nearly 1 in 5 GTH talents lives in Greater Accra." (8493:1751 sub, same pattern for the other regions). */
export const shareSentence = (sharePct, name) => {
  const n = 100 / sharePct;
  const whole = Math.round(n);
  return `${whole < n ? 'Nearly' : 'About'} 1 in ${whole} GTH talents lives in ${name}.`;
};
