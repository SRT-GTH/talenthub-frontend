import { useEffect } from 'react';
import { ClockGlyph } from './HowItWorksIcons.jsx';
import { POP_SHADOW, STAGE_GROUPS } from './HowItWorksData.js';
import AccentText from '../shared/AccentText.jsx';
import { debug } from '../../../../utils/debug.js';

const log = debug('StagesSection');

/* Stage meta chips ("1 min", "+50 XP"). Desktop/tablet: right of the row. Mobile: under the text (Figma 7815:293546). */
const StageMeta = ({ time, xp, className }) => (
  <span className={className}>
    <span className="inline-flex h-7 items-center gap-[6px] rounded-full border border-[#e7e7e7] bg-[#f7f8f4] py-[6px] pl-[10px] pr-3 font-sans text-[12px] font-semibold leading-[1.19] text-[#595959]">
      <ClockGlyph className="size-[14px]" />
      {time}
    </span>
    <span className="inline-flex h-6 items-center rounded-full bg-[#faf4e8] px-3 font-sans text-[12px] font-semibold leading-[1.19] text-[#785910]">
      {xp}
    </span>
  </span>
);

/* Figma "Stage n · …" 1152x74: 44 number tile (last stage of a group is filled ink) + 40 icon tile + copy + chips. */
const StageRow = ({ stage, last }) => {
  const { n, Icon, title, text, time, xp } = stage;
  return (
    <div className="flex items-center gap-4 rounded-[18px] border border-[#e7e7e7] bg-white py-[14px] pl-[14px] pr-4">
      <span
        className={`flex size-11 shrink-0 items-center justify-center rounded-full border-[1.5px] border-[#1c2a21] font-sans text-[16px] font-bold ${
          last ? 'bg-[#1c2a21] text-white' : 'bg-white text-[#1c2a21]'
        }`}
      >
        {n}
      </span>
      <span className="flex size-10 shrink-0 items-center justify-center rounded-[12px] bg-[#ebf1ec] text-[#387440]">
        <Icon className="size-5" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-[2px]">
        <span className="font-sans text-[16px] font-semibold leading-[1.19] text-[#1c2a21] md:text-[18px]">
          {title}
        </span>
        <span className="font-sans text-[14px] leading-[1.19] text-[#595959]">{text}</span>
        <StageMeta time={time} xp={xp} className="mt-[6px] flex items-center gap-2 md:hidden" />
      </span>
      <StageMeta time={time} xp={xp} className="hidden shrink-0 items-center gap-2 md:flex" />
    </div>
  );
};

/* Milestone unlock row: row on tablet/desktop, column (tile centred) on mobile. */
const UnlockRow = ({ accent, unlock }) => {
  const { Icon, title, text } = unlock;
  return (
    <div
      className={`flex flex-col items-center gap-[14px] rounded-[18px] border border-[#1c2a21] py-4 pl-4 pr-5 md:flex-row ${accent}`}
    >
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full border-[1.5px] border-[#1c2a21] bg-white text-[#387440]">
        <Icon className="size-[22px]" />
      </span>
      <span className="flex w-full min-w-0 flex-col gap-[2px] md:w-auto">
        <span className="font-sans text-[16px] font-bold leading-[1.19] text-[#1c2a21] md:text-[18px]">
          {title}
        </span>
        <span className="font-sans text-[14px] font-medium leading-[1.19] text-[#1c2a21]">
          {text}
        </span>
      </span>
    </div>
  );
};

/* P-01 S "The 9 stages" — Figma 7797:20824 (1728x1740), tablet 7815:281227, mobile 7815:287823. */
const StagesSection = () => {
  useEffect(() => {
    log('mount', { groups: STAGE_GROUPS.length });
  }, []);
  return (
    <section className="relative isolate overflow-hidden bg-[linear-gradient(180deg,#fbf6ea_0%,#eef4ea_100%)] px-5 py-14 md:px-10 md:py-[72px] xl:px-24 xl:py-[100px]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle,rgba(200,185,146,0.35)_1px,transparent_1.5px)] bg-[length:36px_36px] bg-[position:17px_17px]"
      />
      <div className="mx-auto flex w-full max-w-[1536px] flex-col items-center gap-5 md:gap-7">
        <div className="flex w-full max-w-[760px] flex-col items-center gap-3 text-center">
          <span className="inline-flex h-7 items-center rounded-full border border-[#c1d4c4] bg-white px-3 font-sans text-[13px] font-semibold text-[#387440]">
            The 9 stages
          </span>
          <h2 className="m-0 font-heading text-[32px] font-semibold leading-[1.1] md:text-[35px] xl:text-[47px] text-[#1c2a21] xl:whitespace-nowrap">
            <AccentText accent="stage by stage.">What you’ll do, stage by stage.</AccentText>
          </h2>
          <p className="m-0 font-sans text-[16px] leading-[27px] text-[#595959] md:text-[18px]">
            Each stage is short, saves on its own and earns XP. Skip and come back any time.
          </p>
        </div>
        <div className="flex w-full max-w-[1200px] flex-col gap-5 md:gap-7">
          {STAGE_GROUPS.map((group) => (
            <div
              key={group.key}
              className={`relative flex flex-col gap-6 rounded-[30px] border-[1.4px] border-[#1c2a21]/[.32] bg-[#fffdf7] p-6 ${POP_SHADOW}`}
            >
              <span
                className={`absolute -top-[14px] left-[37px] z-10 rotate-5 whitespace-nowrap rounded-[8px] border-[1.2px] border-[#1c2a21] px-[11px] py-[5px] font-sans text-[12px] font-bold leading-[1.19] tracking-[0.4px] text-[#1c2a21] shadow-[2px_2px_0_#1c2a21] ${group.accent}`}
              >
                {group.sticker}
              </span>
              {group.stages.map((stage, i) => (
                <StageRow key={stage.n} stage={stage} last={i === group.stages.length - 1} />
              ))}
              <UnlockRow accent={group.accent} unlock={group.unlock} />
            </div>
          ))}
        </div>
        <span className="inline-flex h-[29px] items-center rounded-full border border-[#1c2a21] bg-[#ffd86b] px-3 font-sans text-[14px] font-semibold text-[#1c2a21]">
          Total: about 20 minutes · 700 XP
        </span>
      </div>
    </section>
  );
};

export default StagesSection;
