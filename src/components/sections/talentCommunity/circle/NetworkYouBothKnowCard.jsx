import { classNames } from '../../../../utils/classNames.js';
import CircleAvatar from './CircleAvatar.jsx';
import CirclePersonLink from './CirclePersonLink.jsx';
import { CARD, FOCUS_RING, HEADING } from './circleStyles.js';
import { useCircleVariantData } from './useCircleVariantData.js';

/*
 * NetworkYouBothKnowCard — Figma `You both know · 8` right-rail card of the recruiter talent profile (RC-NW06): title 17/20, three rows of
 * a 40px avatar + name 13/600 + note 11, and "See all 8". Props: block ({ title, seeAll, items: [{ id, note }] }), onSeeAll(), className.
 */
const NetworkYouBothKnowCard = ({ block, onSeeAll, className }) => {
  const { people } = useCircleVariantData();
  return (
    <section className={classNames(CARD, 'flex flex-col gap-[16px] p-[18px]', className)}>
      <h2 className={classNames(HEADING, 'text-[17px] leading-[20px]')}>{block.title}</h2>
      <ul className="m-0 flex list-none flex-col gap-[16px] p-0">
        {block.items.map((item) => {
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
                <span className="font-sans text-[11px] leading-[13px] text-[#737373] max-lg:text-[12px]">
                  {item.note}
                </span>
              </span>
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
};

export default NetworkYouBothKnowCard;
