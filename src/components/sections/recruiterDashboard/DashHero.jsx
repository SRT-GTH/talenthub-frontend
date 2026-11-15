import { classNames } from '../../../utils/classNames.js';
import Chip from '../../ui/Chip.jsx';
import { dashIcons } from './recruiterDashboardIcons.js';
import { HERO } from './recruiterDashboardData.js';

/*
 * DashHero — greeting card + four stat tiles (Figma "Hero" 10049:58687, 1329×226, white, 28px radius).
 * `summary` replaces the second line (the "no affiliation" frame 10066:38322 swaps it for "You're not linked to an organisation yet.").
 */
const TILE_TONES = {
  white: 'bg-white',
  cream: 'bg-[#faf4e8]',
  mint: 'bg-[#e8f2ed]',
};

const QUICK_ICONS = {
  search: dashIcons.searchQuickAction,
  plus: dashIcons.plusPostOpportunity,
  edit: dashIcons.editQuickAction,
};

// `data`: the hero copy and tiles (defaults to the Figma HERO; the signed-in home passes liveHero()).
const DashHero = ({ summary, onQuickAction, onCustomize, data = HERO }) => (
  <section
    aria-labelledby="dash-greeting"
    className="relative flex flex-wrap items-start justify-between gap-x-[24px] gap-y-[24px] rounded-[28px] border border-solid border-[#1c2a21]/10 bg-white pt-[42px] pr-[32px] pb-[32px] pl-[36px] shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)] max-sm:p-[20px] max-sm:pt-[48px]"
  >
    <div className="flex min-w-0 max-w-[599px] flex-col gap-[20px]">
      <div className="flex flex-col gap-[10px]">
        <p className="m-0 font-sans text-[12px] leading-[14px] font-bold tracking-[1.2px] text-[#387440]">
          {data.date}
        </p>
        <h1
          id="dash-greeting"
          className="m-0 font-sans text-[36px] leading-[40px] font-semibold text-[#1c2a21] max-sm:text-[28px] max-sm:leading-[34px]"
        >
          {data.greeting}
          <span className="text-[#387440]">{data.name}</span>
        </h1>
        <p className="m-0 max-w-[560px] font-sans text-[16px] leading-[24px] text-[#595959]">
          {summary}
        </p>
      </div>
      <div className="flex flex-wrap gap-[8px]">
        {data.quickActions.map((action) => (
          <Chip
            key={action.id}
            as="button"
            type="button"
            variant="action"
            icon={QUICK_ICONS[action.icon]}
            onClick={() => onQuickAction?.(action.id)}
          >
            {action.label}
          </Chip>
        ))}
      </div>
    </div>

    <ul className="m-0 grid list-none grid-cols-4 gap-[12px] p-0 max-xl:w-full max-md:grid-cols-2">
      {data.stats.map((stat) => (
        <li
          key={stat.id}
          className={classNames(
            'flex min-w-[150px] flex-col gap-[4px] rounded-[18px] border border-solid border-[#1c2a21]/10 p-[16px] shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)] max-md:min-w-0',
            TILE_TONES[stat.tone]
          )}
        >
          <span className="font-sans text-[32px] leading-[38px] font-semibold text-[#1c2a21]">
            {stat.value}
          </span>
          <span className="font-sans text-[13px] leading-[16px] font-semibold text-[#1c2a21]">
            {stat.label}
          </span>
          <span
            className="font-sans text-[12px] leading-[14px] font-medium"
            style={{ color: stat.noteColor }}
          >
            {stat.note}
          </span>
        </li>
      ))}
    </ul>

    <button
      type="button"
      onClick={onCustomize}
      className="absolute top-[18px] right-[32px] inline-flex h-[28px] cursor-pointer items-center gap-[6px] rounded-full border border-solid border-[#e7e7e7] bg-white px-[10px] font-sans text-[12px] leading-[14px] font-semibold text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green max-sm:right-[16px]"
    >
      <img src={dashIcons.customizeSliders} alt="" aria-hidden="true" className="size-[14px]" />
      {data.customize}
    </button>
  </section>
);

export default DashHero;
