import { classNames } from '../../../../utils/classNames.js';
import {
  AdminEyeIcon,
  AdminLockBadgeIcon,
  AdminShieldCheckIcon,
  AdminSparkleIcon,
} from '../adminIcons.jsx';

/*
 * AdminHealthCards — "Team health" row of three dashed cards of the staff home (Figma "Coming up" 8623:~ → "Unlock feature cards", 1329 x 192, gap 14; the
 * agency feature cards with the admin icon set): card 434 x 192, white, r16, p 16, gap 12, node opacity .92; dashed = 1px #387440 7/5 dash (SVG rect, CSS cannot
 * set the dash length), solid = 1px #387440. Head: 44 icon tile + badge pill (lock 11 #70706e + 12/20 500 #babab7); body: title 14/20 600 #142916, text 12/18
 * #595959, progress pill (56 x 6 track #e1eae2, fill #387440, label 12/18 600 #387440), foot 12/18 #387440.
 * Props: title, subtitle, cards [{ id, icon: 'sparkle'|'shield'|'eye', badge, title, text, progressLabel, fillPct, foot }], dashed (bool), headingId, className.
 */

const ICONS = { sparkle: AdminSparkleIcon, shield: AdminShieldCheckIcon, eye: AdminEyeIcon };

const AdminHealthCards = ({ title, subtitle, cards, dashed = false, headingId, className }) => (
  <section
    aria-labelledby={headingId}
    className={classNames('flex flex-col gap-[12px]', className)}
  >
    <div className="flex flex-col gap-[2px]">
      <h2
        id={headingId}
        className="m-0 font-sans text-[16px] leading-[28px] font-semibold tracking-[0.1px] text-[#1c2a21]"
      >
        {title}
      </h2>
      <p className="m-0 font-sans text-[12px] leading-[18px] tracking-[0.2px] text-[#babab7]">
        {subtitle}
      </p>
    </div>
    <ul className="m-0 grid list-none grid-cols-1 gap-[14px] p-0 lg:grid-cols-3">
      {cards.map((c) => {
        const Icon = ICONS[c.icon];
        return (
          <li
            key={c.id}
            className={classNames(
              'relative flex min-w-0 flex-col gap-[12px] rounded-[16px] bg-white p-[16px] opacity-[0.92]',
              !dashed && 'border border-solid border-[#387440]'
            )}
          >
            {dashed ? (
              <svg
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 size-full text-[#387440]"
              >
                <rect
                  width="100%"
                  height="100%"
                  rx="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="7 5"
                />
              </svg>
            ) : null}
            <div className="relative flex items-center justify-between gap-[8px]">
              <span className="grid size-[44px] shrink-0 place-items-center rounded-[12px] border border-solid border-[#fefefe] bg-white text-[#387440]">
                <Icon className="size-[22px]" />
              </span>
              <span className="inline-flex items-center gap-[4px] rounded-full border border-solid border-[#fefefe] bg-white py-[3px] pr-[9px] pl-[8px]">
                <AdminLockBadgeIcon className="size-[11px] text-[#70706e]" />
                <span className="font-sans text-[12px] leading-[20px] font-medium tracking-[0.2px] text-[#babab7]">
                  {c.badge}
                </span>
              </span>
            </div>
            <div className="relative flex flex-col gap-[8px]">
              <div className="flex flex-col gap-[6px]">
                <h3 className="m-0 font-sans text-[14px] leading-[20px] font-semibold tracking-[0.2px] text-[#142916]">
                  {c.title}
                </h3>
                <p className="m-0 font-sans text-[12px] leading-[18px] tracking-[0.2px] text-[#595959]">
                  {c.text}
                </p>
              </div>
              <span className="inline-flex w-fit items-center gap-[8px] rounded-full border border-solid border-[#fefefe] bg-white px-[8px] py-[4px]">
                <span
                  aria-hidden="true"
                  className="h-[6px] w-[56px] overflow-hidden rounded-full bg-[#e1eae2]"
                >
                  <span
                    className="block h-full rounded-full bg-[#387440]"
                    style={{ width: `${c.fillPct}%` }}
                  />
                </span>
                <span className="font-sans text-[12px] leading-[18px] font-semibold tracking-[0.2px] text-[#387440]">
                  {c.progressLabel}
                </span>
              </span>
              <p className="m-0 font-sans text-[12px] leading-[18px] tracking-[0.2px] text-[#387440]">
                {c.foot}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  </section>
);

export default AdminHealthCards;
