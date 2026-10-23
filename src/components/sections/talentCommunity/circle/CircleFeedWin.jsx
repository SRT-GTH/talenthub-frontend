import { Link } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import { CIRCLE_COPY as COPY, CIRCLE_PEOPLE } from './circleData.js';
import { CircleCommentIcon, CircleTrophyIcon } from './circleIcons.jsx';
import CircleAvatar from './CircleAvatar.jsx';
import CircleButton from './CircleButton.jsx';
import CircleLikeToggle from './CircleLikeToggle.jsx';
import { personHref } from './circleState.js';
import { CARD, FOCUS_RING, HEADING, STICKER } from './circleStyles.js';

/*
 * CircleFeedWin — Figma `Network win · Abena verified…` (NW-09): head (48px avatar, name + "1st", meta), the win box (trophy tile,
 * title 18/600, detail; Playful: #faf4e8 + the "VERIFIED" sticker, -6°), three quick-congrats chips, like / comments and the
 * "Congratulate" button. Props: item (FEED_RESPONSE.items[0]), liked, likes, congratulated, onLike(), onQuick(text), onCongratulate().
 * ⚠️ ASSUMPTION: the chips and Congratulate send a congratulation (toast); Congratulate then reads "Congratulated".
 */
const CircleFeedWin = ({ item, liked, likes, congratulated, onLike, onQuick, onCongratulate }) => {
  const person = CIRCLE_PEOPLE[item.personId];
  return (
    <article
      className={classNames(
        CARD,
        'flex flex-col gap-[12px] px-[20px] pb-[16px] pt-[18px] max-sm:px-[14px]'
      )}
    >
      <div className="flex items-center gap-[12px]">
        <CircleAvatar id={person.id} size={48} />
        <div className="flex min-w-0 flex-col gap-[2px]">
          <div className="flex items-center gap-[6px]">
            <Link
              to={personHref(person.id)}
              className={`font-sans text-[15px] font-semibold leading-[18px] text-[#1c2a21] no-underline ${FOCUS_RING}`}
            >
              {person.name}
            </Link>
            <span className="rounded-[6px] bg-[#f8f8f4] px-[6px] py-[1px] font-sans text-[11px] font-semibold leading-[13px] text-[#737373] max-lg:text-[12px]">
              {item.degree}
            </span>
          </div>
          <span className="font-sans text-[12px] leading-[14px] text-[#737373] max-lg:text-[13px]">
            {item.meta}
          </span>
        </div>
      </div>
      <div className="relative flex items-center gap-[14px] rounded-[16px] border border-solid border-[#e7e7e7] bg-[#f8f8f4] p-[16px] playful:bg-[#faf4e8]">
        <span className="flex size-[50px] shrink-0 items-center justify-center rounded-[14px] border border-solid border-[#e7e7e7] bg-white text-[#387440]">
          <CircleTrophyIcon className="size-[28px]" />
        </span>
        <div className="flex min-w-0 flex-col gap-[3px]">
          <h2 className={classNames(HEADING, 'text-[18px] leading-[21px]')}>{item.title}</h2>
          <span className="font-sans text-[13px] leading-[16px] text-[#595959] max-lg:text-[14px] max-lg:leading-[18px]">
            {item.detail}
          </span>
        </div>
        <span
          className={classNames(
            STICKER,
            'absolute right-[16px] top-1/2 -translate-y-1/2 -rotate-6 max-sm:hidden'
          )}
        >
          {item.badge}
        </span>
      </div>
      <div className="flex flex-wrap gap-[8px]">
        {item.quick.map((text) => (
          <button
            key={text}
            type="button"
            onClick={() => onQuick(text)}
            className={classNames(
              'inline-flex h-[22px] cursor-pointer items-center rounded-full border-0 bg-[#f8f8f4] px-[10px] font-sans text-[12px] font-semibold leading-[14px] text-[#595959] max-lg:h-[32px]',
              'playful:border playful:border-solid playful:border-[rgba(28,42,33,0.35)] playful:bg-white',
              FOCUS_RING
            )}
          >
            {text}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-[10px]">
        <CircleLikeToggle
          liked={liked}
          count={likes}
          label={`Like ${person.firstName}'s win`}
          onToggle={onLike}
        />
        <span className="inline-flex items-center gap-[6px] px-[8px] font-sans text-[13px] font-medium leading-[16px] text-[#595959]">
          <CircleCommentIcon className="size-[16px]" />
          {item.comments}
        </span>
        <span
          aria-hidden="true"
          className="hidden h-px min-w-[16px] flex-1 bg-[#e7e7e7] sm:block"
        />
        <CircleButton className="ml-auto" disabled={congratulated} onClick={onCongratulate}>
          {congratulated ? 'Congratulated' : item.cta}
        </CircleButton>
      </div>
    </article>
  );
};

export default CircleFeedWin;
