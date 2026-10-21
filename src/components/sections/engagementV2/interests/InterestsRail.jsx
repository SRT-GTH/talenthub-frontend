import { CARD } from './interestsStyles.js';
import * as Icons from './interestsIcons.jsx';

/*
 * RailCard: the 464px right-rail card (Figma "Rail · …"): 18/600 title + icon rows (32px tile, 14/600 title, 13/400 body)
 * and an optional `children` block (the mentor progress bar). Props: title, rows [{icon,title,body}], children, gapClass (gap-6 | gap-[14px] | gap-[14px] playful:gap-6).
 */
const RailCard = ({ title, rows = [], children, ariaLabel, gapClass = 'gap-6' }) => (
  <section aria-label={ariaLabel ?? title} className={`flex flex-col p-6 ${gapClass} ${CARD}`}>
    <h2 className="m-0 font-sans text-[18px] font-semibold leading-[21px] text-[#1c2a21]">
      {title}
    </h2>
    {rows.map((r) => {
      const Glyph = Icons[`${r.icon}Icon`];
      return (
        <div key={r.title} className="flex items-start gap-3">
          <span className="grid size-[32px] shrink-0 place-items-center rounded-[10px] bg-[#ebf1ec] text-[16px] text-[#387440]">
            <Glyph />
          </span>
          <div className="flex min-w-0 flex-col gap-[2px]">
            <span className="font-sans text-[14px] font-semibold leading-[17px] text-[#1c2a21]">
              {r.title}
            </span>
            <span className="font-sans text-[13px] leading-[19px] text-[#595959] max-lg:text-[12px]">
              {r.body}
            </span>
          </div>
        </div>
      );
    })}
    {children}
  </section>
);

export default RailCard;
