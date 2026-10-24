import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { formatChange, formatCount, isSuppressed } from '../publicDataFormat.js';
import { regionById } from '../regionsList.js';
import { withRanks } from './data/mapData.js';
import {
  MAP_HEIGHT,
  MAP_VIEWBOX,
  MAP_WIDTH,
  REGION_LABELS,
  REGION_PATHS,
  REGION_READING_ORDER,
} from './ghanaMapGeometry.js';
import {
  MAP_MINI_BASE_FILL,
  MAP_MINI_HIGHLIGHT_FILL,
  MAP_SKELETON_FILL,
  binForCount,
} from './mapBins.js';
import MapRegionCard from './MapRegionCard.jsx';

const log = debug('GhanaMap');

/*
 * GhanaMap — Figma "T8 · Ghana map · 16 regions" (8487:346045 desktop 400x584, mobile 8507:90 240x350, region-page mini 8493:1807 84x123) with
 * the interaction frames 8.2.2a hover 8489:346162 · 8.2.2b expanded card 8489:346231 · 8.2.2c keyboard focus 8489:346317 · 8.2.2d low-data 8489:346395.
 * ⚠️ PLACEHOLDER GEOMETRY: outlines come from the Figma vector export (ghanaMapGeometry.js) and stay a stand-in until the official Ghana Statistical
 * Service (GSS) boundaries arrive; swap that one file, nothing here depends on the shapes.
 *
 * Props
 *   regions      [{ id, count, trendPct, rank?, education?, topInterests? }]  one per region id of regionsList.js (rank is recomputed)
 *   variant      'full' | 'mini'   full = the interactive map (labels from a 360px container up, none below, like the 240px mobile map);
 *                                  mini = static region-page silhouette: every region #efefea, `highlightId` #224626, no labels, no cards
 *   highlightId  string            mini only
 *   loading      boolean           skeleton: every region #f2f2ee, no interaction, aria-busy
 *   active       { id, mode:'hover'|'keyboard' } | null   CONTROLLED hover/keyboard region (omit for uncontrolled; the gallery forces it)
 *   onActiveChange fn(active)
 *   pinnedId     string | null     CONTROLLED pinned region (expanded card); omit for uncontrolled
 *   onPinnedChange fn(id | null)
 *   onOpenRegion fn(id)            the "View … details →" button of the expanded card (the page navigates to /data/regions/:id)
 *   pointerAt    { x, y } px       forced pointer position inside the map box (gallery); live pointer is used otherwise
 *   ariaLabel    string
 *   className    sizing, e.g. "max-w-[240px]" for the mobile map
 *
 * Interaction model
 *   pointer  hover lifts the region within 200 ms (2px #1a1a18 outline, transition 200ms) and a 240px card follows the cursor; leaving hides it after
 *            150 ms; click / tap pins the expanded card (education split + top 3 interests); click outside or Esc unpins. Touch has no hover.
 *   keyboard every region is a tab stop in reading order (DOM order = REGION_READING_ORDER); arrows move region to region in that order
 *            (Right/Down next, Left/Up previous, Home/End first/last); focus-visible draws the 3.5px #2a78d6 ring and shows the compact card;
 *            Enter / Space pins the expanded card and moves focus to its "View … details →" button; Esc closes (focus returns to the region).
 *   screen readers  each region is a button named "Ashanti, 38,540 talents, ranked 2, up 8% in the last 30 days" (aria-pressed = pinned);
 *            the active card text is announced through an aria-live region; a visually hidden table lists every region (text equivalent).
 * Privacy: counts are only ever printed through formatCount(); a region under 5 uses the neutral fill and reads "<5".
 */

const INK_OUTLINE = '#1a1a18';
const FOCUS_BLUE = '#2a78d6';
const HIDE_DELAY = 150;

const trendWords = (pct) =>
  typeof pct === 'number'
    ? `, ${pct >= 0 ? 'up' : 'down'} ${Math.abs(pct)}% in the last 30 days`
    : ', not enough data yet';

const GhanaMap = ({
  regions = [],
  variant = 'full',
  highlightId,
  loading = false,
  active: activeProp,
  onActiveChange,
  pinnedId: pinnedProp,
  onPinnedChange,
  onOpenRegion,
  pointerAt,
  ariaLabel = 'Map of Ghana’s 16 regions, shaded by number of talents',
  className,
}) => {
  const uid = useId();
  const wrapRef = useRef(null);
  const cardRef = useRef(null);
  const regionRefs = useRef({});
  const hideTimer = useRef(null);
  const keyboardPin = useRef(false);
  const [innerActive, setInnerActive] = useState(null);
  const [innerPinned, setInnerPinned] = useState(null);
  const [pointer, setPointer] = useState(null);
  const [width, setWidth] = useState(MAP_WIDTH);
  const [shift, setShift] = useState(0);

  const active = activeProp !== undefined ? activeProp : innerActive;
  const pinnedId = pinnedProp !== undefined ? pinnedProp : innerPinned;

  const setActive = useCallback(
    (next) => {
      log('active', next);
      if (activeProp === undefined) setInnerActive(next);
      onActiveChange?.(next);
    },
    [activeProp, onActiveChange]
  );
  const setPinned = useCallback(
    (next) => {
      log('pinned', next);
      if (pinnedProp === undefined) setInnerPinned(next);
      onPinnedChange?.(next);
    },
    [pinnedProp, onPinnedChange]
  );

  const ranked = useMemo(
    () =>
      withRanks(regions).map((r) => ({
        ...r,
        name: r.name ?? regionById(r.id)?.name ?? r.id,
      })),
    [regions]
  );
  const byId = useMemo(() => Object.fromEntries(ranked.map((r) => [r.id, r])), [ranked]);

  // track the rendered width so labels / card anchors scale with the map
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width || MAP_WIDTH));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // outside click unpins
  useEffect(() => {
    if (!pinnedId) return undefined;
    const onDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        log('outside click, unpin');
        setPinned(null);
        setActive(null);
      }
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [pinnedId, setPinned, setActive]);

  useEffect(() => () => clearTimeout(hideTimer.current), []);

  const scale = width / MAP_WIDTH;
  const cardRegionId = pinnedId ?? active?.id ?? null;
  const cardRegion = cardRegionId ? byId[cardRegionId] : null;
  const cardVariant = pinnedId ? 'pinned' : 'hover';

  // keep the card inside the viewport horizontally
  useLayoutEffect(() => {
    const el = cardRef.current;
    if (!el) {
      setShift(0);
      return;
    }
    const rect = el.getBoundingClientRect();
    const base = rect.left - shift;
    const vw = document.documentElement.clientWidth;
    let next = 0;
    if (base + rect.width > vw - 8) next = vw - 8 - (base + rect.width);
    if (base + next < 8) next = 8 - base;
    if (Math.abs(next - shift) > 0.5) setShift(next);
  }, [cardRegionId, cardVariant, width, pointer, shift]);

  const showHover = useCallback(
    (id, e) => {
      clearTimeout(hideTimer.current);
      if (e && wrapRef.current) {
        const box = wrapRef.current.getBoundingClientRect();
        setPointer({ x: e.clientX - box.left, y: e.clientY - box.top });
      }
      setActive({ id, mode: 'hover' });
    },
    [setActive]
  );

  const scheduleHide = useCallback(() => {
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      setActive(null);
      setPointer(null);
    }, HIDE_DELAY);
  }, [setActive]);

  const focusRegion = (id) => regionRefs.current[id]?.focus();

  const onKeyDown = (e, id) => {
    const i = REGION_READING_ORDER.indexOf(id);
    let target = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown')
      target = REGION_READING_ORDER[Math.min(i + 1, 15)];
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp')
      target = REGION_READING_ORDER[Math.max(i - 1, 0)];
    else if (e.key === 'Home') target = REGION_READING_ORDER[0];
    else if (e.key === 'End') target = REGION_READING_ORDER[15];
    if (target) {
      e.preventDefault();
      focusRegion(target);
      return;
    }
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      keyboardPin.current = true;
      setPinned(pinnedId === id ? null : id);
      setActive({ id, mode: 'keyboard' });
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setPinned(null);
      setActive(null);
    }
  };

  const closePinned = () => {
    const id = pinnedId;
    setPinned(null);
    keyboardPin.current = false;
    if (id) focusRegion(id);
  };

  /* ---------------------------------------------------------------- mini (static silhouette) */
  if (variant === 'mini') {
    return (
      <div
        className={classNames('relative', className)}
        style={{ aspectRatio: `${MAP_WIDTH} / ${MAP_HEIGHT}` }}
      >
        <svg
          viewBox={MAP_VIEWBOX}
          role="img"
          aria-label={
            highlightId
              ? `Map of Ghana with ${byId[highlightId]?.name ?? regionById(highlightId)?.name ?? highlightId} highlighted`
              : 'Map of Ghana'
          }
          className="block size-full overflow-visible"
        >
          {REGION_READING_ORDER.map((id) => (
            <path
              key={id}
              data-region={id}
              d={REGION_PATHS[id]}
              fill={id === highlightId ? MAP_MINI_HIGHLIGHT_FILL : MAP_MINI_BASE_FILL}
              stroke="#ffffff"
              strokeWidth="0.8"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>
      </div>
    );
  }

  /* ---------------------------------------------------------------- full */
  const interactive = !loading;
  const overlayStyle = (id) => {
    const isPinned = pinnedId === id;
    const isActive = active?.id === id;
    if (isActive && active.mode === 'keyboard') return { stroke: FOCUS_BLUE, w: 3.5, on: true };
    if (isPinned || isActive) return { stroke: INK_OUTLINE, w: 2.5, on: true };
    return { stroke: INK_OUTLINE, w: 2.5, on: false };
  };

  // card position (px inside the map box); the box is `relative` so the card may overflow it (onto the legend column)
  let cardStyle = null;
  if (cardRegion) {
    const label = REGION_LABELS[cardRegion.id];
    const anchor =
      active?.mode === 'hover' && !pinnedId
        ? (pointerAt ?? pointer ?? { x: label.x * scale, y: label.y * scale })
        : { x: label.x * scale, y: label.y * scale };
    if (cardVariant === 'pinned') {
      const lowRegion = anchor.y * 1 < 300 * Math.max(scale, 0.6);
      cardStyle = lowRegion
        ? { left: anchor.x + 40 * scale, top: anchor.y + 24 }
        : { left: anchor.x + 40 * scale, bottom: `calc(100% - ${anchor.y + 44 * scale}px)` };
    } else {
      cardStyle = { left: anchor.x + 18, top: Math.max(anchor.y - 50, 0) };
    }
    cardStyle = { position: 'absolute', ...cardStyle, transform: `translateX(${shift}px)` };
  }

  const liveText = cardRegion
    ? `${cardRegion.name}: ${isSuppressed(cardRegion.count) ? '<5' : formatCount(cardRegion.count)} talents${
        cardRegion.rank ? `, ranked ${cardRegion.rank}` : ''
      }${trendWords(isSuppressed(cardRegion.count) ? null : cardRegion.trendPct)}`
    : '';

  return (
    <div
      ref={wrapRef}
      aria-busy={loading || undefined}
      className={classNames('@container relative w-full font-sans', className)}
    >
      <svg
        viewBox={MAP_VIEWBOX}
        role="group"
        aria-label={ariaLabel}
        className="block h-auto w-full touch-manipulation overflow-visible"
        style={{ aspectRatio: `${MAP_WIDTH} / ${MAP_HEIGHT}` }}
        onPointerMove={(e) => {
          if (interactive && e.pointerType !== 'touch' && active?.mode === 'hover' && !pinnedId) {
            const box = wrapRef.current?.getBoundingClientRect();
            if (box) setPointer({ x: e.clientX - box.left, y: e.clientY - box.top });
          }
        }}
      >
        <g>
          {REGION_READING_ORDER.map((id) => {
            const region = byId[id] ?? { id, name: regionById(id)?.name ?? id, count: null };
            const bin = binForCount(region.count);
            const fill = loading ? MAP_SKELETON_FILL : bin.fill;
            const isSuppressedRegion = isSuppressed(region.count) || region.count == null;
            const name = `${region.name}, ${isSuppressedRegion ? '<5' : formatCount(region.count)} talents${
              region.rank ? `, ranked ${region.rank}` : ''
            }${trendWords(isSuppressedRegion ? null : region.trendPct)}`;
            return (
              <path
                key={id}
                ref={(el) => {
                  regionRefs.current[id] = el;
                }}
                id={`${uid}-region-${id}`}
                data-region={id}
                d={REGION_PATHS[id]}
                fill={fill}
                stroke="#ffffff"
                strokeWidth="1.6"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
                {...(interactive
                  ? {
                      role: 'button',
                      tabIndex: 0,
                      'aria-label': name,
                      'aria-pressed': pinnedId === id,
                      className: 'cursor-pointer outline-none',
                      onPointerEnter: (e) => {
                        if (e.pointerType !== 'touch') showHover(id, e);
                      },
                      onPointerLeave: (e) => {
                        if (e.pointerType !== 'touch') scheduleHide();
                      },
                      onClick: () => {
                        clearTimeout(hideTimer.current);
                        keyboardPin.current = false;
                        setPinned(pinnedId === id ? null : id);
                      },
                      onFocus: (e) => {
                        if (e.currentTarget.matches(':focus-visible')) {
                          clearTimeout(hideTimer.current);
                          setActive({ id, mode: 'keyboard' });
                        }
                      },
                      onBlur: (e) => {
                        const to = e.relatedTarget;
                        if (to && cardRef.current?.contains(to)) return;
                        if (active?.id === id && active.mode === 'keyboard') setActive(null);
                      },
                      onKeyDown: (e) => onKeyDown(e, id),
                    }
                  : { 'aria-hidden': 'true' })}
              />
            );
          })}
        </g>
        {/* lift / focus outlines: drawn above every fill, never take pointer events; stroke + width transition in 200 ms */}
        <g aria-hidden="true" pointerEvents="none">
          {REGION_READING_ORDER.map((id) => {
            const o = overlayStyle(id);
            return (
              <path
                key={id}
                d={REGION_PATHS[id]}
                fill="none"
                stroke={o.stroke}
                strokeWidth={o.w}
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
                style={{
                  opacity: o.on ? 1 : 0,
                  transition: 'opacity 200ms ease, stroke 200ms ease, stroke-width 200ms ease',
                }}
              />
            );
          })}
        </g>
        {!loading && (
          <g
            aria-hidden="true"
            pointerEvents="none"
            className="hidden @min-[360px]:inline"
            fontFamily="inherit"
            fontWeight="600"
            textAnchor="middle"
            dominantBaseline="central"
          >
            {REGION_READING_ORDER.map((id) => {
              const label = REGION_LABELS[id];
              const bin = binForCount(byId[id]?.count);
              return (
                <text key={id} x={label.x} y={label.y} fontSize={label.size} fill={bin.ink}>
                  {label.text}
                </text>
              );
            })}
          </g>
        )}
      </svg>

      {cardRegion && interactive && (
        <MapRegionCard
          id={`${uid}-card`}
          cardRef={cardRef}
          region={cardRegion}
          variant={cardVariant}
          onOpen={onOpenRegion}
          focusAction={keyboardPin.current}
          onEscape={closePinned}
          style={cardStyle}
        />
      )}

      <p className="sr-only" role="status" aria-live="polite">
        {liveText}
      </p>

      {interactive && (
        <div className="sr-only">
          <table>
            <caption>{ariaLabel}</caption>
            <thead>
              <tr>
                <th scope="col">Region</th>
                <th scope="col">Talents</th>
                <th scope="col">Rank</th>
                <th scope="col">Change in the last 30 days</th>
              </tr>
            </thead>
            <tbody>
              {REGION_READING_ORDER.map((id) => {
                const r = byId[id];
                if (!r) return null;
                const hidden = isSuppressed(r.count) || r.count == null;
                return (
                  <tr key={id}>
                    <th scope="row">{r.name}</th>
                    <td>{hidden ? '<5' : formatCount(r.count)}</td>
                    <td>{r.rank ?? '–'}</td>
                    <td>
                      {!hidden && typeof r.trendPct === 'number'
                        ? formatChange(r.trendPct)
                        : 'Not enough data yet'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default GhanaMap;
