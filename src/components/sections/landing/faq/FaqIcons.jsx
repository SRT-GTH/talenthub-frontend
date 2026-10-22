import { createElement } from 'react';
import {
  Fi20Bulb,
  Fi20Chat,
  Fi20Eye,
  Fi20InfoCircle,
  Fi20Lock,
  Fi20Message,
  Fi20Play,
  Fi20Plus,
  Fi20Search,
  Fi20Suitcase,
  Fi20User,
  Fi20Users,
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

export const FaqInfoIcon = wrapIcon(Fi20InfoCircle);
export const FaqSearchIcon = wrapIcon(Fi20Search);
export const FaqPlusIcon = wrapIcon(Fi20Plus);
export const FaqPlayIcon = wrapIcon(Fi20Play);
export const FaqUserIcon = wrapIcon(Fi20User);
export const FaqBulbIcon = wrapIcon(Fi20Bulb);
export const FaqSuitcaseIcon = wrapIcon(Fi20Suitcase);
export const FaqLockIcon = wrapIcon(Fi20Lock);
export const FaqUsersIcon = wrapIcon(Fi20Users);
export const FaqEyeIcon = wrapIcon(Fi20Eye);
export const FaqMessageIcon = wrapIcon(Fi20Message);
export const FaqChatIcon = wrapIcon(Fi20Chat);
