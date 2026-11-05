import { Link } from 'react-router-dom';
import { CIRCLE_COPY as COPY } from './circleData.js';
import { PERSON_PHOTOS } from './circlePhotos.js';
import CircleBuddySays from './CircleBuddySays.jsx';
import CircleCardActions from './CircleCardActions.jsx';
import CircleLevelChip from './CircleLevelChip.jsx';
import CircleMentorChip from './CircleMentorChip.jsx';
import CircleMutualFaces from './CircleMutualFaces.jsx';
import CircleRegionPill from './CircleRegionPill.jsx';
import CircleShareChips from './CircleShareChips.jsx';
import { personHref } from './circleState.js';
import { FOCUS_RING, STICKER } from './circleStyles.js';
import { classNames } from '../../../../utils/classNames.js';

// Figma tilts the six cards a little (Abena 1.2°, Yaw -0.8°, Efua 0.6°, Kwame -1.1°, Akosua 0.9°, Kojo -0.7°).
const TILTS = [1.2, -0.8, 0.6, -1.1, 0.9, -0.7];
// Who the mutual-friends face pile shows (Figma uses its own tiny crops).
const initialsOf = (name) =>
  String(name || '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');

const FACES = ['efua-asante', 'esi-quaye', 'kojo-annan'];

/*
 * CirclePersonCardPlayful — Figma `Circle card · {name}` (Playful, ~256 wide, vertical): a 181px hero photo with the region pill
 * (top-left), the yellow "Lv" sticker (top-right, -6°) and the name + headline over a dark gradient; body = YOU SHARE chips, Buddy
 * says (#faf4e8), "{n} in your circle know {first}" with a face pile, actions. White card r22, 1.5px ink@.55 border, 3px hard
 * shadow, small tilt. The first card of a group wears the "TOP PICK" sticker (8°). The × dismiss is not drawn in Playful.
 */
const CirclePersonCardPlayful = ({
  person,
  cta,
  status,
  following,
  index = 0,
  topPick,
  ...actions
}) => (
  <article
    aria-label={person.name}
    className="relative flex flex-col gap-[12px] rounded-[22px] border-[1.5px] border-solid border-[rgba(28,42,33,0.55)] bg-white pb-[14px] shadow-[3px_3px_0_rgba(28,42,33,0.45)]"
    style={{ transform: `rotate(${TILTS[index % TILTS.length]}deg)` }}
  >
    <div className="relative h-[181px] overflow-hidden rounded-t-[21px]">
      {PERSON_PHOTOS[person.id]?.hero || person.photo ? (
        <img
          src={PERSON_PHOTOS[person.id]?.hero ?? person.photo}
          alt=""
          draggable="false"
          className="block size-full object-cover object-top"
        />
      ) : (
        // Live talent without a photo: their initials on the card colour.
        <span className="flex size-full items-start justify-center bg-[#e1eae2] pt-[34px] font-heading text-[44px] font-semibold text-[#387440]">
          {initialsOf(person.name)}
        </span>
      )}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(28,41,33,0)_45%,rgba(28,41,33,0.7)_100%)]"
      />
      {person.town && (
        <CircleRegionPill town={person.town} className="absolute left-[12px] top-[10px]" />
      )}
      <span className="absolute right-[10px] top-[9px]">
        {person.verifiedMentor ? (
          <CircleMentorChip className="!bg-[#e8f0fe]" />
        ) : person.level != null ? (
          <CircleLevelChip level={person.level} />
        ) : null}
      </span>
      <div className="absolute inset-x-[14px] bottom-[10px] flex flex-col">
        <Link
          to={personHref(person.id)}
          className={`font-heading text-[20px] font-semibold leading-[24px] text-white no-underline ${FOCUS_RING}`}
        >
          {person.name}
        </Link>
        <span className="font-sans text-[12px] font-medium leading-[14px] text-white/90 max-lg:text-[13px]">
          {person.headline}
        </span>
      </div>
    </div>
    <div className="flex flex-col gap-[10px] px-[14px]">
      <CircleShareChips shares={person.shares} />
      {person.buddy && <CircleBuddySays>{person.buddy}</CircleBuddySays>}
      {person.mutual > 0 && (
        <div className="flex items-center gap-[6px]">
          {/* The drawn faces belong to the Figma mock people only; live cards show the count. */}
          {PERSON_PHOTOS[person.id] && (
            <CircleMutualFaces ids={FACES.filter((id) => id !== person.id).slice(0, 3)} size={20} />
          )}
          <span className="font-sans text-[11px] leading-[13px] text-[#737373] max-lg:text-[12px]">
            {`${person.mutual} in your circle know ${person.firstName}`}
          </span>
        </div>
      )}
      <CircleCardActions
        person={person}
        cta={cta}
        status={status}
        following={following}
        {...actions}
      />
    </div>
    {topPick && (
      <span
        className={classNames(STICKER, 'absolute -left-[8px] top-[150px] rotate-[8deg] py-[8px]')}
      >
        {COPY.topPick}
      </span>
    )}
  </article>
);

export default CirclePersonCardPlayful;
