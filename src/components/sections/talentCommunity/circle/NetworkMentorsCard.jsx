import { classNames } from '../../../../utils/classNames.js';
import CircleAvatar from './CircleAvatar.jsx';
import CircleButton from './CircleButton.jsx';
import CirclePersonLink from './CirclePersonLink.jsx';
import { CARD, FOCUS_RING, HEADING } from './circleStyles.js';
import { NETWORK_MENTORS_CARD } from './recruiterCircleData.js';
import { useCircleVariantData } from './useCircleVariantData.js';

/*
 * NetworkMentorsCard — Figma `Mentors to learn from` right-rail card ("Mentors and hiring partners" on the recruiter canvas): title 17/20,
 * rows of a 40px avatar + name 13/600 + note 11 + a soft "Follow" button, and "See all". Same row as CircleFeedSide.
 * Props: following (ids followed this session), onFollow(person), onSeeAll(), card (defaults to NETWORK_MENTORS_CARD), className.
 */
const NetworkMentorsCard = ({
  following,
  onFollow,
  onSeeAll,
  card = NETWORK_MENTORS_CARD,
  className,
}) => {
  const { people, copy: COPY } = useCircleVariantData();
  return (
    <section className={classNames(CARD, 'flex flex-col gap-[16px] p-[18px]', className)}>
      <h2 className={classNames(HEADING, 'text-[17px] leading-[20px]')}>{card.title}</h2>
      <ul className="m-0 flex list-none flex-col gap-[16px] p-0">
        {card.items.map((item) => {
          const person = people[item.id];
          if (!person) return null;
          const follows = following.includes(item.id);
          return (
            <li key={item.id} className="flex items-center gap-[10px]">
              <CirclePersonLink
                id={item.id}
                aria-label={`View ${person.name}'s profile`}
                className={`rounded-full ${FOCUS_RING}`}
              >
                <CircleAvatar id={item.id} size={40} />
              </CirclePersonLink>
              <span className="flex min-w-0 flex-1 flex-col gap-[1px]">
                <span className="font-sans text-[13px] font-semibold leading-[16px] text-[#1c2a21] max-lg:text-[14px]">
                  {person.name}
                </span>
                <span className="font-sans text-[11px] leading-[13px] text-[#737373] max-lg:text-[12px]">
                  {item.note}
                </span>
              </span>
              <CircleButton tone="soft" aria-pressed={follows} onClick={() => onFollow(person)}>
                {follows ? COPY.following : COPY.follow}
              </CircleButton>
            </li>
          );
        })}
      </ul>
      <button
        type="button"
        onClick={onSeeAll}
        className={`w-fit cursor-pointer border-0 bg-transparent p-0 font-sans text-[13px] font-semibold leading-[16px] text-[#387440] max-lg:text-[14px] ${FOCUS_RING}`}
      >
        {card.seeAll}
      </button>
    </section>
  );
};

export default NetworkMentorsCard;
