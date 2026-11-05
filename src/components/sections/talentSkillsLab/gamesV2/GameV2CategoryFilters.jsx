import { useCallback, useEffect, useRef, useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { FOCUS_RING } from '../skillsLabDialogUtils.js';
import { GAME_V2_CATEGORIES, GAME_V2_FILTER_ORDER, GAMES_V2_COPY } from './gamesV2Data.js';

const log = debug('GameV2CategoryFilters');

/*
 * GameV2CategoryFilters — "All 13 · Memory 1 · Numbers 1 …" (Figma `filters`: pills 14/17 600 + 12/14 700 count, gap 8, r999).
 * Selected = dark pill (Playful ink #1c2a21, Focused green #27522e) with white text; others = white with a hairline
 * (Playful 1.2px ink@.35). The count is generated content (`data-count`) so the label stays one text node for assistive tech and
 * the audit; each button carries the full "Memory, 1 game" label. Below the width of the strip it scrolls inside itself
 * (no scrollbar) and fades the edge that still has more chips.
 */
const PILL =
  'inline-flex min-h-[33px] shrink-0 cursor-pointer items-center gap-[6px] whitespace-nowrap rounded-full border border-solid px-[14px] py-[8px] font-sans text-[14px] font-semibold leading-[17px]';
const ON = 'border-transparent bg-[#27522e] text-white playful:bg-[#1c2a21]';
const OFF =
  'border-[#dee5e0] bg-white text-[#1c2a21] playful:border-[1.2px] playful:border-[rgba(28,42,33,0.35)]';
const COUNT = 'text-[12px] font-bold leading-[14px] after:content-[attr(data-count)]';

const GameV2CategoryFilters = ({ value, onChange, counts, total }) => {
  const ref = useRef(null);
  const [edges, setEdges] = useState({ left: false, right: false });

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const left = el.scrollLeft > 2;
    const right = el.scrollLeft + el.clientWidth < el.scrollWidth - 2;
    setEdges((prev) => (prev.left === left && prev.right === right ? prev : { left, right }));
  }, []);

  useEffect(() => {
    measure();
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    log('mount', { total, chips: GAME_V2_FILTER_ORDER.length });
    return () => ro.disconnect();
  }, [measure, total]);

  const mask =
    edges.left || edges.right
      ? `linear-gradient(to right, ${edges.left ? 'transparent, #000 28px' : '#000, #000 0'}, ${
          edges.right ? '#000 calc(100% - 28px), transparent' : '#000 100%, #000 100%'
        })`
      : undefined;

  const items = [
    { id: 'all', label: GAMES_V2_COPY.all, count: total },
    ...GAME_V2_FILTER_ORDER.map((id) => ({
      id,
      label: GAME_V2_CATEGORIES[id].label,
      count: counts[id] || 0,
    })),
  ];

  return (
    <div
      ref={ref}
      role="group"
      aria-label="Filter games by category"
      onScroll={measure}
      data-edge-left={edges.left}
      data-edge-right={edges.right}
      className="-my-[4px] flex gap-[8px] overflow-x-auto py-[4px] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      style={mask ? { maskImage: mask, WebkitMaskImage: mask } : undefined}
    >
      {items.map((item) => {
        const on = value === item.id;
        return (
          <button
            key={item.id}
            type="button"
            aria-pressed={on}
            aria-label={`${item.label}, ${item.count} ${item.count === 1 ? 'game' : 'games'}`}
            onClick={() => {
              log('filter', item.id);
              onChange(item.id);
            }}
            className={classNames(PILL, on ? ON : OFF, FOCUS_RING)}
          >
            {item.label}
            <span
              aria-hidden="true"
              data-count={item.count}
              className={classNames(COUNT, on ? 'text-white' : 'text-[#6b6b6b]')}
            />
          </button>
        );
      })}
    </div>
  );
};

export default GameV2CategoryFilters;
