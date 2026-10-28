import { debug } from '../../../../utils/debug.js';
import HomeCardHead from './HomeCardHead.jsx';
import clock from '../../../../assets/parent/home-clock.svg';
import checkCircle from '../../../../assets/parent/home-check-circle.svg';
import star from '../../../../assets/parent/home-star.svg';
import { ACTIVITY } from './data/parentHomeData.js';

const log = debug('ActivityCard');

/*
 * ActivityCard — Figma "Recent activity" 10027:1849: white card r24 pad 24 gap 10, rows pad-y 12 gap 12 with a 1px #e7e7e7 divider,
 * 36px photo or mint circle tile (check / star), 14/500 #1c2a21 text + 12 #595959 time.
 * Props: items (defaults to ACTIVITY).
 */
const TILE_ICON = { check: checkCircle, star };

const ActivityCard = ({ items = ACTIVITY }) => {
  log('render, items:', items.length);
  return (
    <section
      aria-labelledby="parent-activity-title"
      className="flex flex-col gap-[10px] rounded-[24px] border border-solid border-[#e7e7e7] bg-white p-[24px] shadow-[0_5px_8.5px_rgba(18,38,20,0.03)]"
    >
      <HomeCardHead
        icon={clock}
        title={<span id="parent-activity-title">Recent activity</span>}
        linkLabel="See all"
        to="/parent/wards/abena?tab=activity"
        onLink={() => log('Activity: See all')}
      />
      <ul className="m-0 flex list-none flex-col gap-[10px] p-0">
        {items.map((a) => (
          <li
            key={a.id}
            className="flex items-center gap-[12px] border-0 border-b border-solid border-[#e7e7e7] py-[12px]"
          >
            {a.kind === 'photo' ? (
              <img
                src={a.photo}
                alt=""
                width="36"
                height="36"
                className="size-[36px] shrink-0 rounded-full object-cover"
              />
            ) : (
              <span className="flex size-[36px] shrink-0 items-center justify-center rounded-full bg-[#ebf1ec]">
                <img src={TILE_ICON[a.kind]} alt="" className="size-[18px]" />
              </span>
            )}
            <div className="flex min-w-0 flex-col gap-[2px] leading-normal">
              <p className="m-0 font-sans text-[14px] font-medium text-[#1c2a21]">{a.text}</p>
              <p className="m-0 font-sans text-[12px] text-[#595959]">{a.when}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ActivityCard;
