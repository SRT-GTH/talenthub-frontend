import { classNames } from '../../../../utils/classNames.js';
import PublicCard from '../../publicData/ui/PublicCard.jsx';
import DemandNote from './DemandNote.jsx';

/*
 * RegionalGrowthCard — "Regional growth" (Figma 8704:838, 652 wide): a diverging bar list of the 16 regions, sorted, change in registrations vs the previous period.
 * Rows 22 high: name 13/500 · bar (#387440 to the right of a 1px #babab7 zero line, #babab7 to its left for a fall, 14 high) · "▲ +52%" 13/600 #387440 / "▼ −4%" #c0392b.
 * "Bars start at zero. Regions below zero had fewer sign-ups than the period before." Props: names [string], values [number], text (TREND_TEXT[unit]).
 * a11y: an ordered list; every row's text carries the sign and the percentage, so the bars are decorative.
 */

const RegionalGrowthCard = ({ names, values, text }) => {
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const span = max - min + 2;
  const zero = ((0 - min + 1) / span) * 100;
  return (
    <PublicCard
      id="regional-growth"
      title="Regional growth"
      hint={text.regionalHint}
      className="flex flex-col"
      bodyClassName="flex flex-1 flex-col gap-[12px] px-[16px] pb-[24px] md:px-[24px]"
    >
      <ol className="m-0 flex list-none flex-col gap-[4px] p-0 font-sans">
        {names.map((name, i) => {
          const v = values[i];
          const up = v >= 0;
          return (
            <li
              key={name}
              className="grid min-h-[18px] grid-cols-[minmax(0,110px)_minmax(0,1fr)_48px] items-center gap-[8px] sm:grid-cols-[minmax(0,130px)_minmax(0,1fr)_56px]"
            >
              <span className="truncate text-[13px] leading-[16px] font-medium text-[#1c2a21]">
                {name}
              </span>
              <span aria-hidden="true" className="relative h-[18px]">
                <span
                  className="absolute top-0 h-full w-px bg-[#babab7]"
                  style={{ left: `${zero}%` }}
                />
                <span
                  className={classNames(
                    'absolute top-[2px] h-[14px]',
                    up ? 'bg-[#387440]' : 'bg-[#babab7]'
                  )}
                  style={
                    up
                      ? { left: `${zero}%`, width: `${(v / span) * 100}%` }
                      : {
                          left: `${zero - (Math.abs(v) / span) * 100}%`,
                          width: `${(Math.abs(v) / span) * 100}%`,
                        }
                  }
                />
              </span>
              <span
                className={classNames(
                  'text-right text-[13px] leading-[16px] font-semibold',
                  up ? 'text-[#387440]' : 'text-[#c0392b]'
                )}
              >
                {`${up ? '▲ +' : '▼ −'}${Math.abs(v)}%`}
              </span>
            </li>
          );
        })}
      </ol>
      <DemandNote className="mt-auto">
        Bars start at zero. Regions below zero had fewer sign-ups than the period before.
      </DemandNote>
    </PublicCard>
  );
};

export default RegionalGrowthCard;
