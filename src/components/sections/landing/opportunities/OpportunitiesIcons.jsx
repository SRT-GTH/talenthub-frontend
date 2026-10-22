import { createElement } from 'react';
import {
  Fi16Check,
  Fi16Close,
  Fi20ArrowRight,
  Fi20Bolt,
  Fi20Book,
  Fi20Bulb,
  Fi20ChartBar,
  Fi20Company,
  Fi20Globe,
  Fi20Heart,
  Fi20Lock,
  Fi20Map,
  Fi20MarkerPin,
  Fi20Search,
  Fi20Suitcase,
  Fi20Target,
  Fi20TrendUp,
  Fi20Wallet,
} from '../../../shared/assets.jsx';

/* Icons now live in src/components/shared/assets.jsx as exact Figma glyphs (currentColor, sized by className or `size`). These wrappers keep the old names/props. */
const wrapIcon = (Base) => {
  const Icon = ({ size, className = '', style }) =>
    createElement(Base, {
      className: /(^|\s)(size|w|h)-/.test(className) ? className : `${className} size-full`.trim(),
      style: size ? { width: size, height: size, ...style } : style,
    });
  return Icon;
};

const Svg = ({ children, className = '' }) => (
  <svg
    viewBox="0 0 20 20"
    width="100%"
    height="100%"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    {children}
  </svg>
);

export const FilterGlyph = () => (
  <Svg>
    <path d="M3 5.5h14M5.5 10h9M8 14.5h4" />
  </Svg>
);

export const SearchGlyph = wrapIcon(Fi20Search);
export const PinGlyph = wrapIcon(Fi20MarkerPin);
export const SuitcaseGlyph = wrapIcon(Fi20Suitcase);
export const ArrowRightGlyph = wrapIcon(Fi20ArrowRight);
export const CheckGlyph = wrapIcon(Fi16Check);
export const CloseGlyph = wrapIcon(Fi16Close);
export const ChartBarGlyph = wrapIcon(Fi20ChartBar);
export const HeartGlyph = wrapIcon(Fi20Heart);
export const LockGlyph = wrapIcon(Fi20Lock);
export const WalletGlyph = wrapIcon(Fi20Wallet);
export const GlobeGlyph = wrapIcon(Fi20Globe);
export const CompanyGlyph = wrapIcon(Fi20Company);
export const MapGlyph = wrapIcon(Fi20Map);
export const BookGlyph = wrapIcon(Fi20Book);
export const BoltGlyph = wrapIcon(Fi20Bolt);
export const BulbGlyph = wrapIcon(Fi20Bulb);
export const TargetGlyph = wrapIcon(Fi20Target);
export const TrendUpGlyph = wrapIcon(Fi20TrendUp);
