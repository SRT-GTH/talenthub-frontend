import { Link } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import { CIRCLE_COPY as COPY, CIRCLE_PEOPLE } from './circleData.js';
import CircleAvatar from './CircleAvatar.jsx';
import CircleButton from './CircleButton.jsx';
import { personHref } from './circleState.js';
import { CARD, FOCUS_RING, HEADING } from './circleStyles.js';

/*
 * CircleFeedSide — Figma `People you may know (mini)` (NW-09 right rail): "People to link up with" 17/20, three rows (40px avatar,
 * name 13/600, reason 11, soft Link up / Follow button) and "See all". Props: block (FEED_RESPONSE.sideSuggestions), statusOf(id),
 * following (ids), onLinkUp(person), onFollow(person), onSeeAll().
 */
const CircleFeedSide = ({ block, statusOf, following, onLinkUp, onFollow, onSeeAll }) => (
  <section className={classNames(CARD, 'flex flex-col gap-[16px] p-[18px]')}>
    <h2 className={classNames(HEADING, 'text-[17px] leading-[20px]')}>{block.title}</h2>
    <ul className="m-0 flex list-none flex-col gap-[16px] p-0">
      {block.items.map((item) => {
        const person = CIRCLE_PEOPLE[item.id];
        const sent = statusOf(item.id) === 'pending-sent';
        const follows = following.includes(item.id);
        return (
          <li key={item.id} className="flex items-center gap-[10px]">
            <Link
              to={personHref(item.id)}
              aria-label={`View ${person.name}'s profile`}
              className={`rounded-full ${FOCUS_RING}`}
            >
              <CircleAvatar id={item.id} size={40} />
            </Link>
            <span className="flex min-w-0 flex-1 flex-col gap-[1px]">
              <span className="font-sans text-[13px] font-semibold leading-[16px] text-[#1c2a21] max-lg:text-[14px]">
                {person.name}
              </span>
              <span className="font-sans text-[11px] leading-[13px] text-[#737373] max-lg:text-[12px]">
                {item.note}
              </span>
            </span>
            {item.cta === 'follow' ? (
              <CircleButton tone="soft" aria-pressed={follows} onClick={() => onFollow(person)}>
                {follows ? COPY.following : COPY.follow}
              </CircleButton>
            ) : (
              <CircleButton tone="soft" disabled={sent} onClick={() => onLinkUp(person)}>
                {sent ? COPY.linkUpSent : COPY.linkUp}
              </CircleButton>
            )}
          </li>
        );
      })}
    </ul>
    <button
      type="button"
      onClick={onSeeAll}
      className={`w-fit cursor-pointer border-0 bg-transparent p-0 font-sans text-[13px] font-semibold leading-[16px] text-[#387440] max-lg:text-[14px] ${FOCUS_RING}`}
    >
      {block.seeAll}
    </button>
  </section>
);

export default CircleFeedSide;
