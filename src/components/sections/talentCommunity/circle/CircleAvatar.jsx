import { classNames } from '../../../../utils/classNames.js';
import { PERSON_PHOTOS } from './circlePhotos.js';

/*
 * CircleAvatar — round photo of a person (Figma `avatar` ellipses: 56 invitations · 48 connections / dialogs / feed · 44 recs ·
 * 40 side list · 120 profile). Playful draws a 1.5px ink ring on the list avatars (`ring`), Focused none.
 * Props: id (person id), size (px), kind ('avatar' | 'profile' | 'card'), ring, className.
 */
const initialsOf = (name) =>
  String(name || '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');

/* Live people (no drawn photo): `photo` is their uploaded photo, else their initials. */
const CircleAvatar = ({ id, size = 48, kind = 'avatar', ring = true, className, photo, name }) => {
  const photos = PERSON_PHOTOS[id];
  const src = photos?.[kind] ?? photos?.avatar ?? photos?.card ?? photo;
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
      {!src && name && (
        <span
          className="flex size-full items-center justify-center font-sans font-semibold text-[#387440]"
          style={{ fontSize: Math.max(11, Math.round(size * 0.36)) }}
        >
          {initialsOf(name)}
        </span>
      )}
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
