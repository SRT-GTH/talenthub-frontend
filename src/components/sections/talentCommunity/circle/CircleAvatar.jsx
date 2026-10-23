import { classNames } from '../../../../utils/classNames.js';
import { PERSON_PHOTOS } from './circlePhotos.js';

/*
 * CircleAvatar — round photo of a person (Figma `avatar` ellipses: 56 invitations · 48 connections / dialogs / feed · 44 recs ·
 * 40 side list · 120 profile). Playful draws a 1.5px ink ring on the list avatars (`ring`), Focused none.
 * Props: id (person id), size (px), kind ('avatar' | 'profile' | 'card'), ring, className.
 */
const CircleAvatar = ({ id, size = 48, kind = 'avatar', ring = true, className }) => {
  const photos = PERSON_PHOTOS[id];
  const src = photos?.[kind] ?? photos?.avatar ?? photos?.card;
  return (
    <span
      aria-hidden="true"
      className={classNames(
        'relative inline-block shrink-0 overflow-hidden rounded-full bg-[#e1eae2]',
        ring && 'playful:border-[1.5px] playful:border-solid playful:border-[#1c2a21]',
        className
      )}
      style={{ width: size, height: size }}
    >
      {src && (
        <img
          src={src}
          alt=""
          className="block size-full object-cover object-top"
          draggable="false"
        />
      )}
    </span>
  );
};

export default CircleAvatar;
