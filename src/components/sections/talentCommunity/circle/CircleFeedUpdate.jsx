import { Link } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import { CIRCLE_PEOPLE } from './circleData.js';
import CircleAvatar from './CircleAvatar.jsx';
import CircleButton from './CircleButton.jsx';
import { personHref } from './circleState.js';
import { CARD, FOCUS_RING } from './circleStyles.js';

/*
 * CircleFeedUpdate — Figma `Network update · Yaw …` (NW-09): 44px avatar, the headline 15/600 + "Found through GTH Opportunities ·
 * Yesterday", and the "Say congrats" button. Props: item (FEED_RESPONSE.items[1]), done (already congratulated), onCongrats().
 */
const CircleFeedUpdate = ({ item, done, onCongrats }) => {
  const person = CIRCLE_PEOPLE[item.personId];
  return (
    <article
      className={classNames(
        CARD,
        'flex items-center gap-[12px] px-[20px] py-[16px] max-sm:flex-wrap max-sm:px-[14px]'
      )}
    >
      <Link
        to={personHref(person.id)}
        aria-label={`View ${person.name}'s profile`}
        className={`rounded-full ${FOCUS_RING}`}
      >
        <CircleAvatar id={person.id} size={44} />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
        <p className="m-0 font-sans text-[15px] font-semibold leading-[18px] text-[#1c2a21] max-lg:text-[16px] max-lg:leading-[20px]">
          {item.title}
        </p>
        <span className="font-sans text-[12px] leading-[14px] text-[#737373] max-lg:text-[13px]">
          {item.meta}
        </span>
      </div>
      <CircleButton tone="soft" disabled={done} onClick={onCongrats}>
        {done ? 'Congratulated' : item.cta}
      </CircleButton>
    </article>
  );
};

export default CircleFeedUpdate;
