import { PERSON_PHOTOS } from './circlePhotos.js';

/*
 * CircleMutualFaces — Figma `mutual avatars`: overlapping 18-22px faces (-8px gap, 2px white ring).
 * ⚠️ Figma uses its own tiny crops; these reuse the people's avatar exports. Props: ids (person ids), size (px).
 */
const CircleMutualFaces = ({ ids, size = 18 }) => (
  <span aria-hidden="true" className="flex shrink-0 items-center">
    {ids.map((id, i) => (
      <img
        key={id}
        src={PERSON_PHOTOS[id]?.avatar ?? PERSON_PHOTOS[id]?.card}
        alt=""
        draggable="false"
        className="block shrink-0 rounded-full border-2 border-solid border-white object-cover object-top"
        style={{ width: size, height: size, marginLeft: i === 0 ? 0 : -8 }}
      />
    ))}
  </span>
);

export default CircleMutualFaces;
