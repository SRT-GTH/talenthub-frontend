import { classNames } from '../../../utils/classNames.js';

/*
 * TalentNavIcon — renders one of the single-colour nav glyph components from shared/assets.jsx
 * (stroke = currentColor), sized in px and coloured by the caller's text colour.
 */
const TalentNavIcon = ({ icon, size = 18, className }) => {
  const Glyph = icon;
  const dimension = typeof size === 'number' ? `${size}px` : size;
  return (
    <span
      aria-hidden="true"
      className={classNames('inline-flex shrink-0', className)}
      style={{ width: dimension, height: dimension }}
    >
      <Glyph className="size-full" />
    </span>
  );
};

export default TalentNavIcon;
