import { classNames } from '../../../../utils/classNames.js';
import { MINOR_RESPONSE } from './circleData.js';
import { CircleUsersIcon } from './circleIcons.jsx';
import { CARD } from './circleStyles.js';

/*
 * CircleParentCard — Figma `Parent can see` right-rail card (NW-10): users glyph + "Shared with your parent" 14/600 and the 13/20
 * line "Mrs. Abena Owusu can see your connections and who you follow. She can’t read your messages." Props: className.
 */
const CircleParentCard = ({ className, card = MINOR_RESPONSE.parentCard }) => (
  <section className={classNames(CARD, 'flex flex-col gap-[10px] p-[18px]', className)}>
    <h2 className="m-0 flex items-center gap-[8px] font-sans text-[14px] font-semibold leading-[17px] text-[#1c2a21]">
      <CircleUsersIcon className="size-[18px] text-[#387440]" />
      {card.title}
    </h2>
    <p className="m-0 font-sans text-[13px] leading-[20px] text-[#595959] max-lg:text-[14px]">
      {card.body}
    </p>
  </section>
);

export default CircleParentCard;
