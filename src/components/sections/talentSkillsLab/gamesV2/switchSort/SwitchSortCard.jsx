import { useEffect, useRef } from 'react';
import { debug } from '../../../../../utils/debug.js';
import { cardLabel } from './switchSortData.js';
import SwitchSortGlyph from './SwitchSortGlyph.jsx';

const log = debug('SwitchSortCard');

/*
 * SwitchSortCard — the card that arrives, its timer bar and caption (Figma "card column" 9619:56556: card 220×260, gap 14, bar 8, caption 12/500).
 *   fade       true after a correct sort (card at 55 %, SS-02)
 *   barTone    'ok' green · 'bad' red          barRatio 0–1 of the per-card time
 * A new card (`cardKey`) drops in from above; skipped for frozen Figma seeds and prefers-reduced-motion.
 */
const SwitchSortCard = ({ card, cardKey, fade, barTone, barRatio, caption, animate }) => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!animate || !el || typeof el.animate !== 'function') return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    log('card arrives', cardKey, cardLabel(card));
    el.animate(
      [
        { transform: 'translateY(-28px)', opacity: 0 },
        { transform: 'translateY(0)', opacity: 1 },
      ],
      { duration: 240, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only a new card key should replay the arrival
  }, [cardKey, animate]);

  return (
    <div className="flex w-[min(220px,100%)] flex-col gap-[14px]">
      <div
        ref={ref}
        data-testid="switch-sort-card"
        style={{ opacity: fade ? 0.55 : 1 }}
        className="flex h-[260px] flex-col items-center justify-center gap-[14px] rounded-[22px] border border-solid border-[#dee5e0] bg-white shadow-[0_2px_6px_rgba(28,42,33,0.08)] max-lg:h-[212px] playful:rounded-[28px] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[4px_6px_0_rgba(28,42,33,0.45)]"
      >
        <SwitchSortGlyph
          colour={card.colour}
          shape={card.shape}
          className="size-[120px] max-lg:size-[96px]"
        />
        <span className="font-sans text-[13px] leading-[16px] font-semibold text-[#6b6b6b]">
          {cardLabel(card)}
        </span>
      </div>
      <div className="h-[8px] w-full overflow-hidden rounded-full bg-[#f2f5f4]" aria-hidden="true">
        <div
          className={`h-full rounded-full ${barTone === 'bad' ? 'bg-[#c73326]' : 'bg-[#387440]'}`}
          style={{ width: `${Math.max(0, Math.min(1, barRatio)) * 100}%` }}
        />
      </div>
      <p className="m-0 text-center font-sans text-[12px] leading-[14px] font-medium text-[#6b6b6b]">
        {caption}
      </p>
    </div>
  );
};

export default SwitchSortCard;
