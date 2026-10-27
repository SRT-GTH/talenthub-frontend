import { debug } from '../../../../utils/debug.js';
import HomeCardHead from './HomeCardHead.jsx';
import suitcase from '../../../../assets/parent/home-suitcase.svg';
import fintech from '../../../../assets/parent/home-ind-fintech.svg';
import agritech from '../../../../assets/parent/home-ind-agritech.svg';
import telecom from '../../../../assets/parent/home-ind-telecom.svg';
import { WAITING_ITEMS } from './data/parentHomeData.js';

const log = debug('WaitingCard');

/*
 * WaitingCard — Figma "Waiting for your OK" 10027:1790 (layer "My applications"): white card r24 pad 24, rows r16 pad 14 gap 14,
 * 40px tile r12 with a 20px glyph, 15/600 title + 13 #595959 sub, optional 32px pill action (Review = mint, Decide / Check = white).
 * The highlighted row (Teacher evaluation, no action) uses #f5f9f5. Only rendered in the `busy` variant (absent in PD-01d).
 * Props: items (defaults to WAITING_ITEMS).
 */
const GLYPHS = {
  fintech: { src: fintech, tile: 'bg-[#ebf1ec]' },
  agritech: { src: agritech, tile: 'bg-[#e8f2ed]' },
  telecom: { src: telecom, tile: 'bg-[#faf4e8]' },
};

const ACTION_LOOK = {
  soft: 'border-[#c1d4c4] bg-[#ebf1ec] text-[#387440]',
  white: 'border-[#e1eae2] bg-white text-[#595959]',
};

const WaitingCard = ({ items = WAITING_ITEMS }) => {
  log('render, items:', items.length);
  return (
    <section
      aria-labelledby="parent-waiting-title"
      className="flex flex-col gap-[16px] rounded-[24px] border border-solid border-[#e7e7e7] bg-white p-[24px] shadow-[0_5px_8.5px_rgba(18,38,20,0.03)]"
    >
      <HomeCardHead
        icon={suitcase}
        title={<span id="parent-waiting-title">Waiting for your OK</span>}
        linkLabel="To review (4)"
        onLink={() => log('To review (4)')}
      />
      <ul className="m-0 flex list-none flex-col gap-[16px] p-0">
        {items.map((it) => {
          const g = GLYPHS[it.icon] ?? GLYPHS.fintech;
          return (
            <li
              key={it.id}
              className={`flex items-center gap-[14px] rounded-[16px] border border-solid p-[14px] ${
                it.highlight
                  ? 'border-[#1c2a21]/10 bg-[#f5f9f5] shadow-[0_2px_4px_rgba(28,42,33,0.04),0_1px_1px_rgba(28,42,33,0.04)]'
                  : 'border-[#e7e7e7] bg-white'
              }`}
            >
              <span
                className={`flex size-[40px] shrink-0 items-center justify-center rounded-[12px] ${g.tile}`}
              >
                <img src={g.src} alt="" className="size-[20px]" />
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-[2px] leading-normal">
                <p className="m-0 font-sans text-[15px] font-semibold text-[#1c2a21]">{it.title}</p>
                <p className="m-0 font-sans text-[13px] text-[#595959]">{it.sub}</p>
              </div>
              {it.action && (
                <button
                  type="button"
                  onClick={() => log('waiting action:', it.id, it.action)}
                  className={`h-[32px] shrink-0 cursor-pointer rounded-full border border-solid px-[14px] font-sans text-[13px] leading-normal font-semibold whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440] ${ACTION_LOOK[it.actionLook]}`}
                >
                  {it.action}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default WaitingCard;
