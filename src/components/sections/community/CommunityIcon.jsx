import { classNames } from '../../../utils/classNames.js';

/*
 * CommunityIcon — renders one of the Figma SVG assets from
 * `communityIcons.js` at an exact pixel size.
 *
 * The assets carry Figma's own fills, so this component deliberately does NOT
 * try to recolour them (no mask/currentColor trick). Where a glyph needs two
 * colours the icon map ships two files (e.g. `icons.joinCard` vs
 * `icons.joinedCard`, `icons.navHome` vs `icons.navCommunityActive`).
 *
 * Props:
 *   src   — a value from the `icons` map
 *   size  — number (px) or CSS length string (e.g. a clamp())
 *   alt   — supply only when the glyph carries meaning on its own; the
 *           default '' marks it decorative (aria-hidden).
 */
const CommunityIcon = ({ src, size = 20, className, alt = '' }) => {
  const dimension = typeof size === 'number' ? `${size}px` : size;
  return (
    <img
      src={src}
      alt={alt}
      aria-hidden={alt ? undefined : 'true'}
      draggable="false"
      /* Figma exports these with preserveAspectRatio="none", and several are
         not square (the meatball menu is 20.64x4.07, the thumbs are 16.88x18.6,
         etc.). object-contain letterboxes each glyph inside its Figma bounding
         box instead of stretching it — without this the menu icon renders as
         three vertical bars. */
      className={classNames('block shrink-0 select-none object-contain', className)}
      style={{ width: dimension, height: dimension }}
    />
  );
};

export default CommunityIcon;
