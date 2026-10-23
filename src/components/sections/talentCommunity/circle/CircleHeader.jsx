import { classNames } from '../../../../utils/classNames.js';
import { CIRCLE_COPY as COPY } from './circleData.js';
import CircleSearch from './CircleSearch.jsx';
import { HEADING, STICKER } from './circleStyles.js';

/*
 * CircleHeader — Figma `Header` (Your circle 30/36 + subtitle 15/18 + search 300x40; Playful: Bricolage 34 and the tilted
 * "GROW YOUR CIRCLE" sticker left of the search). Props: q, onQ(text).
 */
const CircleHeader = ({ q, onQ }) => (
  <div className="flex flex-wrap items-end justify-between gap-x-[24px] gap-y-[12px]">
    <div className="flex min-w-0 flex-col gap-[4px]">
      <h1
        className={classNames(
          HEADING,
          'text-[30px] leading-[36px] max-lg:text-[26px] max-lg:leading-[32px] playful:text-[34px] playful:leading-[41px]'
        )}
      >
        {COPY.title}
      </h1>
      <p className="m-0 font-sans text-[15px] leading-[18px] text-[#595959] max-lg:text-[14px] max-lg:leading-[20px]">
        {COPY.subtitle}
      </p>
    </div>
    <div className="flex items-center gap-[10px] max-lg:w-full">
      <span className={classNames(STICKER, '-rotate-[4deg] px-[10px]')}>{COPY.growSticker}</span>
      <CircleSearch value={q} onChange={onQ} />
    </div>
  </div>
);

export default CircleHeader;
