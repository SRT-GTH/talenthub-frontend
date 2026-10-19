import kofiAvatar from '../../../assets/talent-community/page/kofi-avatar.svg';
import { classNames } from '../../../utils/classNames.js';

/*
 * CommunityMeAvatar — the signed-in talent's illustrated avatar (Figma `Frame` 44x44 r22 holding the 49x50 `Avatar`
 * vector art: composer, pending post). Focused = flat #387440 disc, Playful = the 135deg #387440 -> #7aa870 gradient.
 * Props: size (px, default 44), className.
 */
const CommunityMeAvatar = ({ size = 44, className }) => (
  <span
    aria-hidden="true"
    className={classNames(
      'relative inline-block shrink-0 overflow-hidden rounded-full bg-[#387440] playful:bg-[linear-gradient(135deg,#387440_0%,#7aa870_100%)]',
      className
    )}
    style={{ width: size, height: size }}
  >
    <img
      src={kofiAvatar}
      alt=""
      className="absolute max-w-none"
      style={{
        width: size * 1.1136,
        height: size * 1.1364,
        left: -size * 0.0455,
        top: -size * 0.0682,
      }}
    />
  </span>
);

export default CommunityMeAvatar;
