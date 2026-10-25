import { classNames } from '../../../../utils/classNames.js';

/*
 * DemandCompactKpis — the four white KPI cards of phone / tablet (Figma 11.4.5o 8707:426318 / 11.4.5p): 2x2 on a phone, 4 across on a tablet, gap 10, each r16, 1px #e7e7e7,
 * p 12/14: label 12/500 #575755, value 22/600 #1c2a21 (16/700 for the two text values), sub 12/600 #387440 when it is a rise, else 12/400 #575755.
 * Props: tiles [{ eyebrow, value, sub, tone ('up'), small }].
 */

const DemandCompactKpis = ({ tiles }) => (
  <div className="grid grid-cols-2 gap-[10px] font-sans md:grid-cols-4">
    {tiles.map((t) => (
      <div
        key={t.eyebrow}
        className="flex min-w-0 flex-col gap-[4px] rounded-[16px] border border-solid border-[#e7e7e7] bg-white px-[14px] py-[12px]"
      >
        <p className="m-0 text-[12px] leading-[14px] font-medium text-[#575755]">{t.eyebrow}</p>
        <p
          className={classNames(
            'm-0 font-semibold text-[#1c2a21]',
            t.small ? 'text-[16px] leading-[24px] font-bold' : 'text-[22px] leading-[26px]'
          )}
        >
          {t.value}
        </p>
        <p
          className={classNames(
            'm-0 text-[12px] leading-[14px]',
            t.tone === 'up' ? 'font-semibold text-[#387440]' : 'text-[#575755]'
          )}
        >
          {t.sub}
        </p>
      </div>
    ))}
  </div>
);

export default DemandCompactKpis;
