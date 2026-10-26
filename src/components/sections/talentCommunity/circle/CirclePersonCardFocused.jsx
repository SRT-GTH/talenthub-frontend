import { Link } from 'react-router-dom';
import { CIRCLE_COPY as COPY } from './circleData.js';
import { PERSON_PHOTOS } from './circlePhotos.js';
import { CircleCloseIcon } from './circleIcons.jsx';
import CircleBuddySays from './CircleBuddySays.jsx';
import CircleCardActions from './CircleCardActions.jsx';
import CircleLevelChip from './CircleLevelChip.jsx';
import CircleMentorChip from './CircleMentorChip.jsx';
import CircleRegionPill from './CircleRegionPill.jsx';
import CircleShareChips from './CircleShareChips.jsx';
import { personHref } from './circleState.js';
import { CARD, FOCUS_RING } from './circleStyles.js';

/*
 * CirclePersonCardFocused — Figma `Circle card · {name}` (Focused, 520x227): white card r18, p14, gap14 — a 118x150 photo (r14, the
 * region pill bottom-left) beside the info column: name + Lv / Verified mentor + the × dismiss, headline, YOU SHARE chips, Buddy
 * says, actions. Props: see CirclePersonCard.
 */
const initialsOf = (name) =>
  String(name || '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');

const CirclePersonCardFocused = ({ person, cta, status, following, onDismiss, ...actions }) => (
  <article
    aria-label={person.name}
    className={`${CARD} flex gap-[14px] !rounded-[18px] p-[14px] max-sm:flex-col`}
  >
    <Link
      to={personHref(person.id)}
      aria-label={`View ${person.name}'s profile`}
      className={`relative block h-[150px] w-[118px] shrink-0 overflow-hidden rounded-[14px] max-sm:h-[200px] max-sm:w-full ${FOCUS_RING}`}
    >
      {PERSON_PHOTOS[person.id]?.card || person.photo ? (
        <img
          src={PERSON_PHOTOS[person.id]?.card ?? person.photo}
          alt=""
          draggable="false"
          className="block size-full object-cover object-top"
        />
      ) : (
        // Live talent without a photo: their initials.
        <span className="flex size-full items-center justify-center bg-[#e1eae2] font-heading text-[34px] font-semibold text-[#387440]">
          {initialsOf(person.name)}
        </span>
      )}
      {person.town && (
        <CircleRegionPill town={person.town} className="absolute bottom-[6px] left-[6px]" />
      )}
    </Link>
    <div className="flex min-w-0 flex-1 flex-col gap-[8px]">
      <div className="flex items-center gap-[6px]">
        <Link
          to={personHref(person.id)}
          className={`min-w-0 font-sans text-[16px] font-semibold leading-[19px] text-[#1c2a21] no-underline ${FOCUS_RING}`}
        >
          {person.name}
        </Link>
        {person.verifiedMentor ? (
          <CircleMentorChip />
        ) : person.level != null ? (
          <CircleLevelChip level={person.level} />
        ) : null}
        <span className="flex-1" />
        <button
          type="button"
          aria-label={`Dismiss ${person.name}`}
          onClick={() => onDismiss(person)}
          className={`flex size-[20px] shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 text-[#9a9a98] max-lg:size-[32px] ${FOCUS_RING}`}
        >
          <CircleCloseIcon className="size-[12px]" />
        </button>
      </div>
      <p className="m-0 font-sans text-[13px] leading-[16px] text-[#595959] max-lg:text-[14px] max-lg:leading-[18px]">
        {person.headline}
      </p>
      <CircleShareChips shares={person.shares} />
      {person.buddy && <CircleBuddySays>{person.buddy}</CircleBuddySays>}
      <CircleCardActions
        person={person}
        cta={cta}
        status={status}
        following={following}
        {...actions}
      />
    </div>
  </article>
);

export default CirclePersonCardFocused;
