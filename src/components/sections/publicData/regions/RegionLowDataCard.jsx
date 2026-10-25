import { formatCount } from '../publicDataFormat.js';
import { PublicIconTrendUp } from '../ui/publicUiIcons.jsx';
import Button from '../../../ui/Button.jsx';

/*
 * RegionLowDataCard — "low data card" of the early-rollout screens (Figma 8.3.1c 8494:426 region, 8.3.2b 8494:2390 district): a region or district under
 * 50 talents shows no breakdowns (they could single someone out). 1360 white card r24, p 40/0, centred, gap 12: 56px disc #ebf1ec with the trend-up glyph,
 * title 24/29 600, text 16/24 #595959 (max 620), three stat boxes (#f2f2ee, r14, p 14/20: value 22/26 700, label 13/16 500), two buttons.
 * Props: backLabel (opt-in, default "Back to national view"), low { title, body(n), talents, joined, partners, stats [3 labels], subscribe }, onSubscribe(), onBack().
 * Counts go through formatCount; "+17" keeps its sign as drawn.
 */

const RegionLowDataCard = ({ low, onSubscribe, onBack, backLabel = 'Back to national view' }) => (
  <section
    aria-labelledby="low-data-title"
    className="flex min-w-0 flex-col items-center gap-[12px] rounded-[24px] border border-solid border-[#e7e7e7] bg-white px-[16px] py-[40px] text-center font-sans shadow-[0_5px_17px_rgba(0,0,0,0.04)]"
  >
    <span
      aria-hidden="true"
      className="flex size-[56px] items-center justify-center rounded-full bg-[#ebf1ec] text-[#387440]"
    >
      <PublicIconTrendUp className="size-[28px]" />
    </span>
    <h2 id="low-data-title" className="m-0 text-[24px] leading-[29px] font-semibold text-[#1c2a21]">
      {low.title}
    </h2>
    <p role="status" className="m-0 max-w-[620px] text-[16px] leading-[24px] text-[#595959]">
      {low.body(low.talents)}
    </p>
    <ul className="m-0 flex list-none flex-wrap justify-center gap-[16px] p-0 pt-[12px]">
      {[formatCount(low.talents), `+${formatCount(low.joined)}`, String(low.partners)].map(
        (value, i) => (
          <li
            key={low.stats[i]}
            className="flex min-w-[114px] flex-col items-center gap-[2px] rounded-[14px] bg-[#f2f2ee] px-[20px] py-[14px]"
          >
            <span className="text-[22px] leading-[26px] font-bold text-[#1c2a21]">{value}</span>
            <span className="text-[13px] leading-[16px] font-medium text-[#595959]">
              {low.stats[i]}
            </span>
          </li>
        )
      )}
    </ul>
    <div className="flex flex-wrap items-center justify-center gap-[12px] pt-[12px]">
      <Button
        type="button"
        variant="tertiary-subtle"
        size="md"
        onClick={onSubscribe}
        className="!rounded-[14px] !border-2 !border-solid !border-[#c1d4c4] !bg-[#e1eae2] !px-[22px] !py-[12px] !text-[#165d3a]"
      >
        {low.subscribe}
      </Button>
      <Button
        type="button"
        variant="tertiary"
        size="md"
        onClick={onBack}
        className="!rounded-[14px] !px-[22px] !py-[12px]"
      >
        {backLabel}
      </Button>
    </div>
  </section>
);

export default RegionLowDataCard;
