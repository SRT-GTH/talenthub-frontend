import { createElement } from 'react';
import {
  Fi16Check,
  Fi20ArrowRight,
  Fi20Bell,
  Fi20CheckCircleFill,
  Fi20Eye,
  Fi20Flag,
  Fi20Globe,
  Fi20Lock,
  Fi20Shield,
  Fi20UserCheck,
  Fi20Users,
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

export const UsersGlyph = wrapIcon(Fi20Users);
export const BellGlyph = wrapIcon(Fi20Bell);
export const CheckCircleFillGlyph = wrapIcon(Fi20CheckCircleFill);
export const EyeGlyph = wrapIcon(Fi20Eye);
export const GlobeGlyph = wrapIcon(Fi20Globe);
export const ShieldGlyph = wrapIcon(Fi20Shield);
export const LockGlyph = wrapIcon(Fi20Lock);
export const FlagGlyph = wrapIcon(Fi20Flag);
export const UserCheckGlyph = wrapIcon(Fi20UserCheck);
export const CheckGlyph = wrapIcon(Fi16Check);
export const ArrowRightGlyph = wrapIcon(Fi20ArrowRight);
