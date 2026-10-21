import { debug } from '../../../../utils/debug.js';
import AreaOptionCard from './AreaOptionCard.jsx';
import { AREAS, MAX_AREAS } from './interestsData.js';
import { CARD, HEADING_FONT } from './interestsStyles.js';
import * as Icons from './interestsIcons.jsx';

const log = debug('PickAreasPanel');

/*
 * PickAreasPanel (IN-01 left column): "Pick 2 to 6 areas" card with the "N selected" chip, the 3-column area grid and the
 * depth tip. Props: selected (array of area ids), onToggle(id).
 */
const PickAreasPanel = ({ selected, onToggle }) => {
  const full = selected.length >= MAX_AREAS;
  log('render', { selected: selected.length, full });
  return (
    <div className="flex flex-col gap-5">
      <section
        aria-labelledby="in-pick-title"
        className={`flex flex-col gap-[18px] p-[clamp(16px,1.62vw,28px)] ${CARD}`}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <h2
              id="in-pick-title"
              className={`m-0 text-[clamp(20px,1.56vw,27px)] font-semibold leading-[1.2] text-[#111] ${HEADING_FONT}`}
            >
              <span className="text-[#1c2a21]">Pick </span>
              <span className="text-[#387440]">2 to 6</span>
              <span className="text-[#1c2a21]"> areas</span>
            </h2>
            <p className="m-0 font-sans text-[14px] leading-[17px] text-[#595959]">
              Tap to select. You’ll add specifics inside each one next.
            </p>
          </div>
          <span
            role="status"
            className="inline-flex h-[32px] items-center rounded-full border border-solid border-[#e1eae2] bg-white px-[14px] font-sans text-[13px] font-semibold leading-[16px] text-[#595959] max-lg:text-[12px]"
          >
            {selected.length} selected
          </span>
        </div>
        <div
          role="group"
          aria-label="Broad areas"
          className="grid grid-cols-1 gap-[14px] min-[480px]:grid-cols-2 xl:grid-cols-3"
        >
          {AREAS.map((a) => (
            <AreaOptionCard
              key={a.id}
              area={a}
              selected={selected.includes(a.id)}
              disabled={full}
              onToggle={onToggle}
            />
          ))}
        </div>
      </section>
      <div className="flex items-start gap-3 rounded-[16px] border border-solid border-[#eedeb8] bg-[#faf4e8] py-[14px] pr-[18px] pl-4">
        <span className="mt-[1px] shrink-0 text-[18px] text-[#785910]">
          <Icons.BulbIcon />
        </span>
        <p className="m-0 font-sans text-[14px] font-medium leading-[17px] text-[#1c2a21]">
          Depth beats breadth: 3–5 areas with a few specifics each matches better than ticking
          everything.
        </p>
      </div>
    </div>
  );
};

export default PickAreasPanel;
