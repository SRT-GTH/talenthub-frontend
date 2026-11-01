import { useEffect } from 'react';
import { classNames } from '../../../../../utils/classNames.js';
import { debug } from '../../../../../utils/debug.js';
import { FOCUS_RING } from '../../labPlayStyles.js';
import {
  GameBuildingIcon,
  GamePinIcon,
  GamePlusIcon,
} from '../planningShared/PlanningChessIcons.jsx';
import { ERRAND_HOME, ERRAND_PARK_BLOCKS } from './errandRunData.js';
import { routePoints } from './errandRunEngine.js';

const log = debug('ErrandMap');

/*
 * ErrandMap — the Figma "town map" (456 x 456, #efe5d0, r24 / Focused r18): a 6 x 6 grid of 48px blocks (#e4d6ba, eight green
 * #d9e8d2 parks) split by seven 10px white@.9 streets every 64px, a route line in 7px, the optional gold "shortest route" (5px,
 * dashed 10/8) and one pin per stop (40px marker + 12/14 700 label). Street crossing (col,row) sits at x = 36 + 64 col,
 * y = 37 + 64 (6 - row). The SVG scales with the box; pins use % positions and a marker that never drops under 28px.
 * Props: stops, visited (ids in order), best (stops[] in shortest order | null), routeTone ('green'|'red'), locked, onPick(stop).
 */
const SIZE = 456;
const px = (col) => 36 + 64 * col;
const py = (row) => 37 + 64 * (6 - row);
const toPath = (points) =>
  points.map((p, i) => `${i ? 'L' : 'M'}${px(p.col)} ${py(p.row)}`).join(' ');

const STREETS = Array.from({ length: 7 }, (_, k) => k);
const BLOCKS = Array.from({ length: 36 }, (_, n) => [n % 6, Math.floor(n / 6)]);

const MARKER = 'max(28px, calc(40 * 100cqw / 456))';

const Marker = ({ tone, children }) => (
  <span
    className={classNames(
      'flex items-center justify-center rounded-full border border-solid border-transparent font-sans text-[14px] leading-[17px] font-semibold',
      'playful:border-[1.5px] playful:border-[rgba(28,42,33,0.6)] playful:font-heading playful:text-[16px] playful:leading-[19px] playful:shadow-[0_3px_0_rgba(28,42,33,0.45)]',
      tone === 'home' && 'bg-[#1c2a21] text-white',
      tone === 'visited' && 'bg-[#387440] text-white',
      tone === 'open' && 'bg-white text-[#1c2a21]'
    )}
    style={{ width: MARKER, height: MARKER }}
  >
    {children}
  </span>
);

const PinLabel = ({ children }) => (
  <span className="rounded-[8px] border border-solid border-[rgba(28,42,33,0.15)] bg-white px-[8px] py-[3px] font-sans text-[12px] leading-[14px] font-bold whitespace-nowrap text-[#1c2a21]">
    {children}
  </span>
);

const Pin = ({ col, row, children, className = '' }) => (
  <div
    className={classNames(
      'absolute flex -translate-x-1/2 flex-col items-center gap-[4px]',
      className
    )}
    style={{
      left: `${(px(col) / SIZE) * 100}%`,
      top: `${(py(row) / SIZE) * 100}%`,
      marginTop: `calc(${MARKER} / -2)`,
    }}
  >
    {children}
  </div>
);

const ErrandMap = ({ stops, visited, best, routeTone, locked, onPick }) => {
  const visitedStops = visited.map((id) => stops.find((s) => s.id === id)).filter(Boolean);
  const routePath = toPath(routePoints(visitedStops));
  const bestPath = best ? toPath(routePoints(best)) : null;
  useEffect(() => {
    log('map', { stops: stops.length, visited: visited.length, best: Boolean(best), routeTone });
  }, [stops.length, visited.length, best, routeTone]);

  return (
    <div className="w-full max-w-[456px] shrink-0 [container-type:inline-size]">
      <div
        className={classNames(
          'relative aspect-square w-full overflow-hidden rounded-[18px] border border-solid border-[rgba(28,42,33,0.15)] bg-[#efe5d0]',
          'playful:rounded-[24px] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[0_5px_0_rgba(28,42,33,0.45)]'
        )}
      >
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="absolute inset-0 size-full"
          aria-hidden="true"
          focusable="false"
        >
          {BLOCKS.map(([c, r]) => (
            <rect
              key={`b-${c}-${r}`}
              x={44 + 64 * c}
              y={44 + 64 * r}
              width="48"
              height="48"
              rx="8"
              fill={
                ERRAND_PARK_BLOCKS.some(([pc, pr]) => pc === c && pr === r) ? '#d9e8d2' : '#e4d6ba'
              }
            />
          ))}
          {STREETS.map((k) => (
            <g key={`s-${k}`} fill="#fff" fillOpacity="0.9">
              <rect x={31 + 64 * k} y="0" width="10" height={SIZE} />
              <rect x="0" y={32 + 64 * k} width={SIZE} height="10" />
            </g>
          ))}
          {bestPath ? (
            <path
              d={bestPath}
              fill="none"
              stroke="#e0a526"
              strokeWidth="5"
              strokeDasharray="10 8"
              strokeLinejoin="round"
            />
          ) : null}
          {visitedStops.length ? (
            <path
              d={routePath}
              fill="none"
              stroke={routeTone === 'red' ? '#c73326' : '#387440'}
              strokeOpacity={routeTone === 'red' ? 0.75 : 1}
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : null}
        </svg>
        <Pin col={ERRAND_HOME.col} row={ERRAND_HOME.row}>
          <Marker tone="home">
            <GameBuildingIcon className="size-[18px]" />
          </Marker>
          <PinLabel>Home</PinLabel>
        </Pin>
        {stops.map((stop) => {
          const at = visited.indexOf(stop.id);
          const Glyph = stop.icon === 'plus' ? GamePlusIcon : GamePinIcon;
          return (
            <Pin key={stop.id} col={stop.col} row={stop.row}>
              <button
                type="button"
                disabled={locked || at >= 0}
                onClick={() => onPick(stop)}
                aria-label={at >= 0 ? `${stop.name}, stop ${at + 1}` : `Go to ${stop.name}`}
                className={classNames(
                  'm-0 cursor-pointer rounded-full border-0 bg-transparent p-0 disabled:cursor-default',
                  FOCUS_RING
                )}
              >
                <Marker tone={at >= 0 ? 'visited' : 'open'}>
                  {at >= 0 ? at + 1 : <Glyph className="size-[18px]" />}
                </Marker>
              </button>
              <PinLabel>{stop.name}</PinLabel>
            </Pin>
          );
        })}
      </div>
    </div>
  );
};

export default ErrandMap;
