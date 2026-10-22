import { createElement } from 'react';
import {
  Fi16Check,
  Fi20ArrowRight,
  Fi20Bolt,
  Fi20ErrorFill,
  Fi20Eye,
  Fi20Message,
  Fi20Search,
  Fi20Shield,
  Fi20TimeClock,
  Fi20Wallet,
  FiFire,
  FiGame,
  FiTrophy,
} from '../../../shared/assets.jsx';

/* Icons now live in src/components/shared/assets.jsx as exact Figma glyphs (currentColor, sized by className or `size`). These wrappers keep the old names/props. */
const wrapIcon = (Base) => {
  const Icon = ({ size, className = '', style }) =>
    createElement(Base, {
      className: /(^|\s)(size|w|h)-/.test(className) ? className : `${className} size-5`.trim(),
      style: size ? { width: size, height: size, ...style } : style,
    });
  return Icon;
};

/* Trophy — Figma icon/trophy keeps its drawn colours (#fec417 / #ffa828 / #d1701c). */

/* Fire — Figma icon/fire (gradient flame + pale core). */

/* genz:doodle star — 4-point sparkle, gold 26px / lime 12px (no stroke in Figma). */
export const CsStar = ({ className, size = 26, color = '#ffd86b' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 26 26"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M13 1C13.800 8 18 12.200 25 13 18 13.800 13.800 18 13 25 12.200 18 8 13.800 1 13 8 12.200 12.200 8 13 1Z"
      fill={color}
    />
  </svg>
);

export const CsClockIcon = wrapIcon(Fi20TimeClock);
export const CsArrowRightIcon = wrapIcon(Fi20ArrowRight);
export const CsCheckIcon = wrapIcon(Fi16Check);
export const CsMessageIcon = wrapIcon(Fi20Message);
export const CsBoltIcon = wrapIcon(Fi20Bolt);
export const CsEyeIcon = wrapIcon(Fi20Eye);
export const CsGameIcon = wrapIcon(FiGame);
export const CsShieldIcon = wrapIcon(Fi20Shield);
export const CsSearchIcon = wrapIcon(Fi20Search);
export const CsWalletIcon = wrapIcon(Fi20Wallet);
export const CsErrorIcon = wrapIcon(Fi20ErrorFill);
export const CsTrophyIcon = wrapIcon(FiTrophy);
export const CsFireIcon = wrapIcon(FiFire);
