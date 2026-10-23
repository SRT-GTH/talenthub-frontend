import { classNames } from '../../../../utils/classNames.js';
import spot from '../../../../assets/talent-circle/art/start-your-circle-spot.svg';
import { EMPTY_RESPONSE } from './circleData.js';
import { CircleLinkIcon, CircleMortarboardIcon, CircleUsersIcon } from './circleIcons.jsx';
import { CARD, FOCUS_RING, HEADING, STICKER } from './circleStyles.js';

const WAY_ICONS = {
  mortarboard: CircleMortarboardIcon,
  users: CircleUsersIcon,
  link: CircleLinkIcon,
};

/*
 * CircleEmptyNetwork — Figma `Empty network` (NW-11, new talent): the 140px "Start your circle" spot illustration (Playful: the
 * yellow "DAY 1 OF YOUR NETWORK" sticker under it), title 26/31, the 15px explainer and three "ways in" tiles (Find classmates ·
 * Join a community · Invite a friend). Props: onWay(id) (called with 'classmates' | 'community' | 'friend').
 */
const CircleEmptyNetwork = ({ onWay }) => (
  <section
    className={classNames(CARD, 'flex flex-col items-center gap-[14px] p-[32px] max-sm:p-[16px]')}
  >
    <img src={spot} alt="" draggable="false" className="size-[140px] shrink-0" />
    <span className={classNames(STICKER, 'rotate-[3deg]')}>{EMPTY_RESPONSE.sticker}</span>
    <h2
      className={classNames(
        HEADING,
        'text-[26px] leading-[31px] max-sm:text-[22px] max-sm:leading-[27px]'
      )}
    >
      {EMPTY_RESPONSE.title}
    </h2>
    <p className="m-0 max-w-[560px] text-center font-sans text-[15px] leading-[23px] text-[#595959] max-lg:text-[15px]">
      {EMPTY_RESPONSE.body}
    </p>
    <ul className="m-0 mt-[8px] grid w-full list-none grid-cols-1 gap-[14px] p-0 md:grid-cols-3">
      {EMPTY_RESPONSE.ways.map((way) => {
        const Glyph = WAY_ICONS[way.icon];
        return (
          <li key={way.id}>
            <button
              type="button"
              onClick={() => onWay(way.id)}
              className={classNames(
                CARD,
                'flex w-full cursor-pointer flex-col items-start gap-[8px] p-[16px] text-left',
                FOCUS_RING
              )}
            >
              <span className="flex size-[36px] items-center justify-center rounded-[10px] bg-[#ebf1ec] p-[8px] text-[#387440]">
                <Glyph className="size-[20px]" />
              </span>
              <span className="font-sans text-[15px] font-semibold leading-[18px] text-[#1c2a21]">
                {way.title}
              </span>
              <span className="font-sans text-[13px] leading-[19px] text-[#595959] max-lg:text-[14px]">
                {way.body}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  </section>
);

export default CircleEmptyNetwork;
