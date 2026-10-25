import { classNames } from '../../../../utils/classNames.js';

/*
 * TrendHeadline — the "headline" row above a Trends chart (Figma 8704:626: value 24/30 600 #1c2a21 · change 14/17 600 #387440 (#c0392b when it falls) · note 13/16 400 #575755,
 * gap 10, baseline aligned). Props: value (string), change (number, percent or points), changeText (override: "▲ +7 pts"), note.
 */

const TrendHeadline = ({ value, change, changeText, note, className }) => {
  const up = typeof change !== 'number' || change >= 0;
  const text =
    changeText ?? (typeof change === 'number' ? `${up ? '▲ +' : '▼ −'}${Math.abs(change)}%` : null);
  return (
    <div
      className={classNames(
        'flex flex-wrap items-baseline gap-x-[10px] gap-y-[2px] font-sans',
        className
      )}
    >
      <p className="m-0 text-[24px] leading-[30px] font-semibold tracking-[-0.12px] text-[#1c2a21]">
        {value}
      </p>
      {text ? (
        <span
          className={classNames(
            'text-[14px] leading-[17px] font-semibold',
            up ? 'text-[#387440]' : 'text-[#c0392b]'
          )}
        >
          {text}
        </span>
      ) : null}
      {note ? <span className="text-[13px] leading-[16px] text-[#575755]">{note}</span> : null}
    </div>
  );
};

export default TrendHeadline;
