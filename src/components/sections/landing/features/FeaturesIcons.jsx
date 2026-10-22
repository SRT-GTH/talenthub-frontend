import { createElement } from 'react';
import { Fi20Chat, Fi20Edit, Fi20Wallet, FiFire, FiGame } from '../../../shared/assets.jsx';
import { FcCareerBuddyIcon } from '../../../shared/assets.jsx';

/* Icons now live in src/components/shared/assets.jsx as exact Figma glyphs (currentColor, sized by className or `size`). These wrappers keep the old names/props. */
const wrapIcon = (Base) => {
  const Icon = ({ size, className = '', style }) =>
    createElement(Base, {
      className: /(^|\s)(size|w|h)-/.test(className) ? className : `${className} size-5`.trim(),
      style: size ? { width: size, height: size, ...style } : style,
    });
  return Icon;
};

/*
 * Icons for the P-02 Features package. Shared glyphs (ai, target, bulb, shield, search, star, check) are re-exported from the
 * P-01 icon file; the controller / flame / wallet / chat / pencil glyphs are drawn here in the same 20px, 1.5-stroke style.
 * ⚠️ ASSUMPTION: Figma icon vectors have no exported path geometry, so these are redrawn, not traced.
 */
export {
  AiGlyph,
  BulbGlyph,
  CheckGlyph,
  SearchGlyph,
  ShieldGlyph,
  StarGlyph,
  TargetGlyph,
} from '../howItWorks/HowItWorksIcons.jsx';

/* The Figma Career Buddy card icon (17x19, gold) at its drawn size inside the 22px tile slot of the deep-dive. */
export const CareerBuddyDeepDiveIcon = () => (
  <FcCareerBuddyIcon color="#fcd116" className="h-[19px] w-[17px]" />
);

export const GameGlyph = wrapIcon(FiGame);
export const FireGlyph = wrapIcon(FiFire);
export const WalletGlyph = wrapIcon(Fi20Wallet);
export const ChatGlyph = wrapIcon(Fi20Chat);
export const EditGlyph = wrapIcon(Fi20Edit);
