import { Link } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import { AgBuildArrow, AgTick } from './agencyHomeIcons.jsx';

/*
 * AgencyChecklistCard — the white checklist card of the first-login home ("Get set up", Figma "Get ready" 8607:3740) and of the MoU status pages
 * ("Your verification", 8596:1707): 1329 x 331, white, 1.5 #fefefe, r16. Head (p 18/14/16/20): title 16/24 600 #142916, subtitle 12/18 #babab7, badge pill
 * (#ebf1ec at 50 %, r8, 12/16 500 #387440), 8 high progress track (#f8f8f4, r4). Rows (p 8 0, gap 12, 60 high): 24 round marker (done = #387440 with a white tick,
 * todo = 1.5 #dfdfdc ring), title 14/24 600 #2a5730 (done rows: 14/20 400 #babab7 struck through), subtitle 12/18 #c6c6c3, trailing label 12/18 #bfbfbf ("Done" 12/20 500 #387440)
 * or the green action button (r9, 3px shelf, 14/24 600 white + arrow).
 * Props: title, subtitle, badge, pct (progress width), items [{ id, title, sub, state: 'done'|'todo', trailing, action: { label, to } }], headingId, className.
 */

const AgencyChecklistCard = ({ title, subtitle, badge, pct, items, headingId, className }) => (
  <section
    aria-labelledby={headingId}
    data-tour-target="checklist"
    className={classNames(
      'flex flex-col rounded-[16px] border-[1.5px] border-solid border-[#fefefe] bg-white shadow-[0_1px_2px_rgba(15,15,10,0.05)]',
      className
    )}
  >
    <div className="flex flex-col gap-[12px] pt-[18px] pr-[14px] pb-[16px] pl-[20px]">
      <div className="flex items-center justify-between gap-[12px]">
        <div className="flex min-w-0 flex-col gap-[3px]">
          <h2
            id={headingId}
            className="m-0 font-sans text-[16px] leading-[24px] font-semibold tracking-[0.2px] text-[#142916]"
          >
            {title}
          </h2>
          <p className="m-0 font-sans text-[12px] leading-[18px] tracking-[0.2px] text-[#babab7]">
            {subtitle}
          </p>
        </div>
        <span className="shrink-0 rounded-[8px] bg-[#ebf1ec]/50 px-[10px] py-[6px] font-sans text-[12px] leading-[16px] font-medium tracking-[0.2px] text-[#387440]">
          {badge}
        </span>
      </div>
      <div
        role="progressbar"
        aria-label={title}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        className="h-[8px] w-full overflow-hidden rounded-[4px] border border-solid border-[#fefefe] bg-[#f8f8f4]"
      >
        <div
          className="h-full rounded-[4px] bg-[linear-gradient(90deg,#2a5730,#387440)]"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
    <ul className="m-0 flex list-none flex-col px-[20px] pt-[2px] pb-[10px]">
      {items.map((it) => {
        const done = it.state === 'done';
        return (
          <li
            key={it.id}
            className="flex min-h-[40px] items-center gap-[12px] border-t border-solid border-[#ebf1ec]/40 py-[8px] first:border-t-0 max-sm:flex-wrap"
          >
            {done ? (
              <span
                aria-hidden="true"
                className="grid size-[24px] shrink-0 place-items-center rounded-full bg-[#387440]"
              >
                <AgTick className="size-[13px] text-white" />
              </span>
            ) : (
              <span
                aria-hidden="true"
                className="size-[24px] shrink-0 rounded-full border-[1.5px] border-solid border-[#dfdfdc]"
              />
            )}
            <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
              <span
                className={classNames(
                  'font-sans tracking-[0.2px]',
                  done
                    ? 'text-[14px] leading-[20px] text-[#babab7] line-through'
                    : 'text-[14px] leading-[24px] font-semibold text-[#2a5730]'
                )}
              >
                {it.title}
              </span>
              {it.sub ? (
                <span className="font-sans text-[12px] leading-[18px] tracking-[0.2px] text-[#c6c6c3]">
                  {it.sub}
                </span>
              ) : null}
            </div>
            {it.action ? (
              <Link
                to={it.action.to}
                className="inline-flex shrink-0 items-center gap-[6px] rounded-[9px] bg-[#387440] px-[14px] py-[8px] font-sans text-[14px] leading-[24px] font-semibold tracking-[0.2px] text-white no-underline shadow-[0_3px_0_#2a5730] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
              >
                {it.action.label}
                <AgBuildArrow className="size-[13px]" />
              </Link>
            ) : it.trailing ? (
              <span
                className={classNames(
                  'shrink-0 font-sans text-[12px] tracking-[0.2px]',
                  done
                    ? 'leading-[20px] font-medium text-[#387440]'
                    : 'leading-[18px] text-[#bfbfbf]'
                )}
              >
                {it.trailing}
              </span>
            ) : null}
          </li>
        );
      })}
    </ul>
  </section>
);

export default AgencyChecklistCard;
