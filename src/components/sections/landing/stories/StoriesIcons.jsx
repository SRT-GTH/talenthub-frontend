import { createElement } from 'react';
import { Fi20Chat, Fi20MarkerPin } from '../../../shared/assets.jsx';

/* Icons now live in src/components/shared/assets.jsx as exact Figma glyphs (currentColor, sized by className or `size`). These wrappers keep the old names/props. */
const wrapIcon = (Base) => {
  const Icon = ({ size, className = '', style }) =>
    createElement(Base, {
      className: /(^|\s)(size|w|h)-/.test(className)
        ? className
        : `${className} size-[15px]`.trim(),
      style: size ? { width: size, height: size, ...style } : style,
    });
  return Icon;
};

export const StoriesChatIcon = wrapIcon(Fi20Chat);
export const StoriesPinIcon = wrapIcon(Fi20MarkerPin);
