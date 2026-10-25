import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { formatAxis, formatCompact } from './trendFormat.js';

const log = debug('TrendChart');

/*
 * TrendChart — the custom SVG chart of the outcomes + trends pages (no chart library). Figma "line chart" / "column chart" frames:
 *   trends 620x220 (8496:347836, 347867 …), phone 326x160 (8508:230), outcomes placements 812x260 (8496:132, plot top 18).
 *   plot: left 52 (phone 36), grid lines #e8e8e4 with the zero line #d9d9d4, tick labels 11/13 500 #70706e right-aligned 8px left of the plot, x labels
 *   11/13 500 #70706e 8px under the zero line; line 2px #387440 (+ optional area), end dot 8px #387440 with a 2px white ring and a direct label
 *   (12/14 600 #1c2a21, clipped by the card as drawn: Figma Inconsistency kept); columns #387440, slot width x 0.625, the current period #224626.
 *   Hover/focus: 1px crosshair #1a1a18 @40%, white 10px dot with a 2.5px #387440 ring, tooltip (#1a1a18, r10, p 10/12: label 12/14 600 white, then a green
 *   dot and "7.9k  Assessments completed" 12/14 500). Event markers (all-time frames): 1px #d9d9d4 vertical line + 11/13 600 #595959 label.
 * Interaction: pointer moves pick the nearest point; the points are focusable with a roving tab stop (one Tab stop per chart, arrow keys / Home / End
 *   move between points); Esc clears. A visually hidden <table> carries every value (the text equivalent); the SVG itself is aria-hidden except the points.
 * Props: id, title (accessible name), unit (series name in the tooltip), kind ('line' | 'column'), series [{label,value}], yMax, yStep, area, current,
 *   events [{at,label}], height (default 220), top (plot top, default 12), xLabelEvery, labelIndexes (opt-in: exact point indexes that get an x label, overrides xLabelEvery), shortLabels (phone: first letter of month names),
 *   compactHeight / compactStep (phone height 160 and tick step), initialActive (index shown until the first interaction; ⚠️ frames 8.5.2a/b draw the Assessments tooltip pinned), showEndLabel, className
 */

const TICK_COLOR = '#70706e';

const TrendChart = ({
  id,
  title,
  unit,
  kind = 'line',
  series,
  yMax,
  yStep,
  area = false,
  current = false,
  events = [],
  height = 220,
  compactHeight = 160,
  compactStep,
  top = 12,
  xLabelEvery = 1,
  labelIndexes,
  shortLabels = false,
  initialActive = null,
  showEndLabel = true,
  className,
}) => {
  const uid = useId();
  const wrapRef = useRef(null);
  const pointRefs = useRef([]);
  const [width, setWidth] = useState(620);
  const [active, setActive] = useState(initialActive);
  const [touched, setTouched] = useState(false);
  const [focusIndex, setFocusIndex] = useState(initialActive ?? series.length - 1);

  useEffect(() => {
    log('mount', { id, kind, points: series.length });
  }, [id, kind, series.length]);

  useEffect(() => {
    setActive(initialActive);
    setTouched(false);
    setFocusIndex(initialActive ?? series.length - 1);
  }, [initialActive, series]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(([entry]) => {
      const w = Math.round(entry.contentRect.width);
      if (w > 0) setWidth(w);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const compact = width < 480;
  const h = compact ? compactHeight : height;
  const topPad = compact ? 12 : top;
  const step = compact && compactStep ? compactStep : yStep;
  const left = compact ? 36 : 52;
  const right = kind === 'column' ? (compact ? 12 : 8) : compact ? 12 : 24;
  const plotW = Math.max(40, width - left - right);
  const bottom = h - 28;
  const plotH = bottom - topPad;
  const n = series.length;
  const slot = plotW / n;
  const xOf = (i) =>
    kind === 'column' ? left + slot * (i + 0.5) : left + (n === 1 ? 0 : (i / (n - 1)) * plotW);
  const yOf = (v) => bottom - (Math.min(v, yMax) / yMax) * plotH;
  const ticks = [];
  for (let v = 0; v <= yMax + 1e-6; v += step) ticks.push(v);

  const linePath = series
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${xOf(i).toFixed(1)} ${yOf(p.value).toFixed(1)}`)
    .join('');
  const areaPath = `${linePath}L${xOf(n - 1).toFixed(1)} ${bottom}L${xOf(0).toFixed(1)} ${bottom}Z`;

  const nearest = useCallback(
    (clientX) => {
      const rect = wrapRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      let best = 0;
      let bestD = Infinity;
      series.forEach((_, i) => {
        const d = Math.abs(xOf(i) - x);
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      });
      return best;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [series, width, kind]
  );

  const move = (i) => {
    setTouched(true);
    setActive(i);
    setFocusIndex(i);
  };

  const onKey = (e, i) => {
    let next = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = Math.min(n - 1, i + 1);
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = Math.max(0, i - 1);
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = n - 1;
    if (e.key === 'Escape') {
      e.preventDefault();
      setTouched(true);
      setActive(null);
      return;
    }
    if (next === null) return;
    e.preventDefault();
    log('key', e.key, next);
    move(next);
    pointRefs.current[next]?.focus();
  };

  const shown = active !== null && (touched || initialActive !== null) ? active : null;
  const label = (text) =>
    shortLabels && width < 340 && /^[A-Z][a-z]{2}$/.test(text) ? text[0] : text;
  const point = shown !== null ? series[shown] : null;
  const tipLeft = point ? Math.max(0, Math.min(xOf(shown) - 33, width - 200)) : 0;

  return (
    <div
      ref={wrapRef}
      className={classNames('relative w-full font-sans', className)}
      style={{ height: `${h}px` }}
      onMouseMove={(e) => {
        const i = nearest(e.clientX);
        if (i !== active || !touched) move(i);
      }}
      onMouseLeave={() => {
        setTouched(true);
        setActive(null);
      }}
    >
      <svg
        width={width}
        height={h}
        viewBox={`0 0 ${width} ${h}`}
        className="absolute inset-0 block overflow-visible"
        role="group"
        aria-label={`${title} chart`}
      >
        {ticks.map((v) => (
          <g key={v} aria-hidden="true">
            <line
              x1={left}
              x2={left + plotW}
              y1={yOf(v)}
              y2={yOf(v)}
              stroke={v === 0 ? '#d9d9d4' : '#e8e8e4'}
              strokeWidth="1"
            />
            <text
              x={left - 8}
              y={yOf(v) + 4}
              textAnchor="end"
              fontSize="11"
              fontWeight="500"
              fill={TICK_COLOR}
            >
              {formatAxis(v, width < 340)}
            </text>
          </g>
        ))}
        {events.map((ev) => (
          <g key={ev.label} aria-hidden="true">
            <line
              x1={xOf(ev.at)}
              x2={xOf(ev.at)}
              y1={topPad}
              y2={bottom}
              stroke="#d9d9d4"
              strokeWidth="1"
            />
            <text x={xOf(ev.at) + 6} y={topPad + 8} fontSize="11" fontWeight="600" fill="#595959">
              {ev.label}
            </text>
          </g>
        ))}
        {series.map((p, i) =>
          (labelIndexes ? labelIndexes.includes(i) : i % xLabelEvery === 0) ? (
            <text
              key={p.label + i}
              x={xOf(i)}
              y={bottom + 16}
              textAnchor="middle"
              fontSize="11"
              fontWeight="500"
              fill={TICK_COLOR}
              aria-hidden="true"
            >
              {label(p.label)}
            </text>
          ) : null
        )}
        {kind === 'column' ? (
          series.map((p, i) => {
            const w = Math.round(slot * 0.625);
            const h = bottom - yOf(p.value);
            const isCurrent = current && i === n - 1;
            return (
              <rect
                key={p.label + i}
                x={xOf(i) - w / 2}
                y={bottom - h}
                width={w}
                height={h}
                rx="3"
                fill={isCurrent ? '#224626' : '#387440'}
                opacity={shown !== null && shown !== i ? 0.7 : 1}
                aria-hidden="true"
              />
            );
          })
        ) : (
          <g aria-hidden="true">
            {area && <path d={areaPath} fill="#387440" opacity="0.1" />}
            <path
              d={linePath}
              fill="none"
              stroke="#387440"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <circle
              cx={xOf(n - 1)}
              cy={yOf(series[n - 1].value)}
              r="5"
              fill="#387440"
              stroke="#fff"
              strokeWidth="2"
            />
            {showEndLabel && (
              <text
                x={xOf(n - 1) + 14}
                y={yOf(series[n - 1].value) + 4}
                fontSize="12"
                fontWeight="600"
                fill="#1c2a21"
              >
                {title}
              </text>
            )}
          </g>
        )}
        {shown !== null && (
          <g aria-hidden="true">
            <line
              x1={xOf(shown)}
              x2={xOf(shown)}
              y1={topPad}
              y2={bottom}
              stroke="#1a1a18"
              strokeOpacity="0.4"
              strokeWidth="1"
            />
            {kind === 'line' && (
              <circle
                cx={xOf(shown)}
                cy={yOf(series[shown].value)}
                r="5"
                fill="#fff"
                stroke="#387440"
                strokeWidth="2.5"
              />
            )}
          </g>
        )}
        {series.map((p, i) => (
          <circle
            key={`hit-${p.label}${i}`}
            ref={(el) => {
              pointRefs.current[i] = el;
            }}
            cx={xOf(i)}
            cy={kind === 'column' ? (bottom + yOf(p.value)) / 2 : yOf(p.value)}
            r={kind === 'column' ? Math.max(8, slot * 0.3) : 9}
            fill="transparent"
            tabIndex={i === focusIndex ? 0 : -1}
            role="img"
            aria-label={`${p.label}: ${p.value.toLocaleString('en-GH')} ${unit}`}
            className="cursor-crosshair outline-none focus-visible:stroke-[#387440] focus-visible:stroke-2"
            onFocus={() => move(i)}
            onBlur={() => {
              setTouched(true);
              setActive((a) => (a === i ? null : a));
            }}
            onKeyDown={(e) => onKey(e, i)}
          />
        ))}
      </svg>
      {point && (
        <div
          role="status"
          className="pointer-events-none absolute z-10 flex w-max max-w-[220px] flex-col gap-[4px] rounded-[10px] bg-[#1a1a18] px-[12px] py-[10px]"
          style={{ left: `${tipLeft}px`, top: `${topPad + 8}px` }}
        >
          <span className="text-[12px] leading-[14px] font-semibold text-white">{point.label}</span>
          <span className="flex items-center gap-[6px] text-[12px] leading-[14px] font-medium text-white">
            <span aria-hidden="true" className="size-[8px] shrink-0 rounded-full bg-[#387440]" />
            {formatCompact(point.value)}&nbsp; {unit}
          </span>
        </div>
      )}
      <table className="sr-only" id={`${uid}-table`}>
        <caption>{`${title} — ${unit}`}</caption>
        <thead>
          <tr>
            <th scope="col">Period</th>
            <th scope="col">{unit}</th>
          </tr>
        </thead>
        <tbody>
          {series.map((p, i) => (
            <tr key={p.label + i}>
              <th scope="row">{p.label}</th>
              <td>{p.value.toLocaleString('en-GH')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TrendChart;
