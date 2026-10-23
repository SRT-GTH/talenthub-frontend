import { Link } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import { CIRCLE_COPY as COPY, CIRCLE_PEOPLE } from './circleData.js';
import { CircleCommentIcon } from './circleIcons.jsx';
import CircleAvatar from './CircleAvatar.jsx';
import CircleLikeToggle from './CircleLikeToggle.jsx';
import CircleMentorChip from './CircleMentorChip.jsx';
import { personHref } from './circleState.js';
import { CARD, FOCUS_RING } from './circleStyles.js';

/*
 * CircleFeedPost — Figma `Mentor post · Kwame` (NW-09): 44px avatar, name + Verified mentor + "Following" chip, the meta line, the
 * post text 14/21, like (214) + comments (41). Props: item (FEED_RESPONSE.items[2]), liked, likes, onLike().
 */
const CircleFeedPost = ({ item, liked, likes, onLike }) => {
  const person = CIRCLE_PEOPLE[item.personId];
  return (
    <article
      className={classNames(CARD, 'flex flex-col gap-[12px] px-[20px] py-[16px] max-sm:px-[14px]')}
    >
      <div className="flex items-center gap-[12px]">
        <CircleAvatar id={person.id} size={44} />
        <div className="flex min-w-0 flex-col gap-[2px]">
          <div className="flex flex-wrap items-center gap-[6px]">
            <Link
              to={personHref(person.id)}
              className={`font-sans text-[15px] font-semibold leading-[18px] text-[#1c2a21] no-underline ${FOCUS_RING}`}
            >
              {person.name}
            </Link>
            <CircleMentorChip />
            {item.following && (
              <span className="inline-flex h-[22px] items-center rounded-full bg-[#f8f8f4] px-[10px] font-sans text-[12px] font-semibold leading-[14px] text-[#595959] playful:border playful:border-solid playful:border-[rgba(28,42,33,0.35)]">
                {COPY.following}
              </span>
            )}
          </div>
          <span className="font-sans text-[12px] leading-[14px] text-[#737373] max-lg:text-[13px]">
            {item.meta}
          </span>
        </div>
      </div>
      <p className="m-0 font-sans text-[14px] leading-[22px] text-[#1c2a21] max-lg:text-[15px]">
        {item.text}
      </p>
      <div className="flex items-center gap-[10px]">
        <CircleLikeToggle
          liked={liked}
          count={likes}
          label={`Like ${person.firstName}'s post`}
          onToggle={onLike}
        />
        <span className="inline-flex items-center gap-[6px] px-[8px] font-sans text-[13px] font-medium leading-[16px] text-[#595959]">
          <CircleCommentIcon className="size-[16px]" />
          {item.comments}
        </span>
      </div>
    </article>
  );
};

export default CircleFeedPost;
