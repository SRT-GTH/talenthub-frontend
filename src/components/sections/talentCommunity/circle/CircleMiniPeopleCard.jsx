import { classNames } from '../../../../utils/classNames.js';
import CircleAvatar from './CircleAvatar.jsx';
import CirclePersonLink from './CirclePersonLink.jsx';
import { CARD, FOCUS_RING, HEADING } from './circleStyles.js';
import { useCircleVariantData } from './useCircleVariantData.js';

/*
 * CircleMiniPeopleCard — the ONE right-rail "list of people" card of My crew / My network. Three Figma cards draw it:
 * "People to link up with" (feed side, NW-09), "Mentors to learn from" / "Mentors and hiring partners" and "You both know · 8".
 * Layout: title 17/20 (Bricolage in Playful), rows of a 40px avatar (links to the profile) + name 13/600 + note, an optional
 * action on the right (rows with an action are 56px tall, the button's height), and a "See all" text button.
 * Focused: hairline card, gap `gap` (16 default; the feed side draws 20). Playful: ink card, gap 12 (all three frames).
 * Note text: talent 12/14 (#737373, NW-01 / NW-06 / NW-09); the recruiter canvas keeps its 11/13.
 * Props: title, items ([{ id, note }]), renderAction(person, item) (optional), seeAll (label), onSeeAll(), gap ('16' | '20'),
 * className.
 */
const GAPS = { 16: 'gap-[16px]', 20: 'gap-[20px]' };

const CircleMiniPeopleCard = ({
  title,
  items,
  renderAction,
  seeAll,
  onSeeAll,
  gap = 16,
  className,
}) => {
  const { people, isRecruiter } = useCircleVariantData();
  const noteCls = isRecruiter
    ? 'text-[11px] leading-[13px] max-lg:text-[12px]'
    : 'text-[12px] leading-[14px]';
  return (
    <section
      className={classNames(
        CARD,
        'flex flex-col p-[18px] playful:gap-[12px]',
        GAPS[gap],
        className
      )}
    >
      <h2 className={classNames(HEADING, 'text-[17px] leading-[20px]')}>{title}</h2>
      <ul className={classNames('m-0 flex list-none flex-col p-0 playful:gap-[12px]', GAPS[gap])}>
        {items.map((item) => {
          const person = people[item.id];
          if (!person) return null;
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
                <span className={classNames('font-sans text-[#737373]', noteCls)}>{item.note}</span>
              </span>
              {renderAction?.(person, item)}
            </li>
          );
        })}
      </ul>
      {seeAll && (
        <button
          type="button"
          onClick={onSeeAll}
          className={`w-fit cursor-pointer border-0 bg-transparent p-0 font-sans text-[13px] font-semibold leading-[16px] text-[#387440] max-lg:text-[14px] ${FOCUS_RING}`}
        >
          {seeAll}
        </button>
      )}
    </section>
  );
};

export default CircleMiniPeopleCard;
