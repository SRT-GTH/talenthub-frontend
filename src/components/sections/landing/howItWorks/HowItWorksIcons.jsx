import { createElement } from 'react';
import {
  Fi16Check,
  Fi20Bolt,
  Fi20Bulb,
  Fi20Eye,
  Fi20Folder,
  Fi20Heart,
  Fi20Lock,
  Fi20Map,
  Fi20Search,
  Fi20Shield,
  Fi20Star,
  Fi20Suitcase,
  Fi20Target,
  Fi20TimeClock,
  Fi20TrendUp,
  Fi20User,
  Fi20VideoCamera,
  FiAi,
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

export const MapGlyph = wrapIcon(Fi20Map);
export const UserGlyph = wrapIcon(Fi20User);
export const HeartGlyph = wrapIcon(Fi20Heart);
export const BulbGlyph = wrapIcon(Fi20Bulb);
export const BoltGlyph = wrapIcon(Fi20Bolt);
export const SuitcaseGlyph = wrapIcon(Fi20Suitcase);
export const FolderGlyph = wrapIcon(Fi20Folder);
export const ShieldGlyph = wrapIcon(Fi20Shield);
export const TargetGlyph = wrapIcon(Fi20Target);
export const VideoGlyph = wrapIcon(Fi20VideoCamera);
export const TrendUpGlyph = wrapIcon(Fi20TrendUp);
export const TrophyGlyph = wrapIcon(FiTrophy);
export const EyeGlyph = wrapIcon(Fi20Eye);
export const ClockGlyph = wrapIcon(Fi20TimeClock);
export const SearchGlyph = wrapIcon(Fi20Search);
export const LockGlyph = wrapIcon(Fi20Lock);
export const CheckGlyph = wrapIcon(Fi16Check);
export const AiGlyph = wrapIcon(FiAi);
export const StarGlyph = wrapIcon(Fi20Star);
