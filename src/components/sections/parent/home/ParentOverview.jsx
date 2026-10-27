import { useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import ParentHero from './ParentHero.jsx';
import WardsCard from './WardsCard.jsx';
import WaitingCard from './WaitingCard.jsx';
import ActivityCard from './ActivityCard.jsx';
import ParentRail from './ParentRail.jsx';
import offlineWarning from '../../../../assets/parent/home-offline-warning.svg';
import tabHome from '../../../../assets/parent/home-tab-home.svg';
import tabFlag from '../../../../assets/parent/home-tab-flag.svg';
import tabEye from '../../../../assets/parent/home-tab-eye.svg';
import plus from '../../../../assets/parent/home-plus.svg';
import { HOME_TABS, HOME_VARIANTS, OFFLINE } from './data/parentHomeData.js';

const log = debug('ParentOverview');

/*
 * ParentOverview — the parent home main column (Figma PD-01 "Main" 10027:1678, 1376 wide, gap 16):
 *   PD-01  10027:1458  variant="busy"
 *   PD-01d 10056:158090 variant="caughtUp" (no "Waiting for your OK" card; Recent activity sits under Your wards)
 *   PD-07  10077:20066  variant="busy" + offline (amber callout 10077:20286 on top: bg #fdf5e0, border rgba(160,112,10,.25), r12)
 * Renders ONLY the column content; <ParentFrame> supplies <main> padding and scroll.
 * Props: variant ('busy' | 'caughtUp'), offline (bool).
 * Layout: >= xl two columns (912fr / 448fr, gap 16), below that one column. Tabs only change the selected look (no routing yet).
 * ⚠️ ASSUMPTION: the Abena / Elliot tabs do not swap the page content; the offline banner is role="status".
 */
const TAB_ICON = { home: tabHome, flag: tabFlag, eye: tabEye };

const ParentOverview = ({ variant = 'busy', offline = false }) => {
  const [tab, setTab] = useState('overview');
  const data = HOME_VARIANTS[variant] ?? HOME_VARIANTS.busy;
  log('render', { variant, offline, tab, showWaiting: data.showWaiting });

  return (
    <div className="mx-auto flex w-full max-w-[1376px] flex-col gap-[16px]">
      {offline && (
        <div
          role="status"
          className="flex items-start gap-[12px] rounded-[12px] border border-solid border-[rgba(160,112,10,0.25)] bg-[#fdf5e0] px-[16px] py-[14px]"
        >
          <img src={offlineWarning} alt="" className="size-[18px] shrink-0" />
          <div className="flex min-w-0 flex-1 flex-col gap-[2px] leading-normal">
            <p className="m-0 font-sans text-[14px] font-semibold text-[#a0700a]">
              {OFFLINE.title}
            </p>
            <p className="m-0 font-sans text-[13px] text-[#1c2a21]/85">{OFFLINE.body}</p>
          </div>
        </div>
      )}

      <ParentHero greeting={data.greeting} stats={data.stats} />

      <div
        role="tablist"
        aria-label="Home views"
        className="flex gap-[6px] rounded-[16px] border border-solid border-[#e7e7e7] bg-[#f8f8f4] px-[6px] py-[20px]"
      >
        {HOME_TABS.map((t) => {
          const selected = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => {
                log('tab:', t.id);
                setTab(t.id);
              }}
              className={`flex min-w-0 flex-1 cursor-pointer items-center justify-center gap-[8px] rounded-[12px] px-[16px] py-[12px] font-sans text-[15px] leading-normal whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440] ${
                selected
                  ? 'border border-solid border-[#1c2a21]/10 bg-white font-bold text-[#1c2a21] shadow-[0_2px_4px_rgba(28,42,33,0.04),0_1px_1px_rgba(28,42,33,0.04)]'
                  : 'border border-solid border-transparent bg-[#f8f8f4] font-semibold text-[#595959]'
              }`}
            >
              <img src={TAB_ICON[t.icon]} alt="" className="size-[18px] shrink-0 object-contain" />
              {t.label}
              {t.chip && (
                <span className="rounded-full bg-[#ebf1ec] px-[10px] py-[4px] font-sans text-[12px] leading-normal font-semibold text-[#387440] max-sm:hidden">
                  {t.chip}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 items-start gap-[16px] xl:grid-cols-[minmax(0,912fr)_minmax(0,448fr)]">
        <div className="flex min-w-0 flex-col gap-[16px]">
          <WardsCard />
          {data.showWaiting && <WaitingCard />}
          <ActivityCard />
        </div>
        <ParentRail />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-[8px] rounded-[20px] border border-dashed border-[#c1d4c4] px-[20px] py-[24px]">
        <img src={plus} alt="" className="size-[16px]" />
        <p className="m-0 font-sans text-[14px] leading-normal font-medium text-[#595959]">
          Add cards or rearrange your home
        </p>
        <button
          type="button"
          onClick={() => log('Customize home')}
          className="cursor-pointer rounded-[4px] border-0 bg-transparent p-0 font-sans text-[14px] leading-normal font-semibold text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          Customize
        </button>
      </div>
    </div>
  );
};

export default ParentOverview;
