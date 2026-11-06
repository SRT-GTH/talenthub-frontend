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
 * Props: stops, visited (ids in order), best (stops[] in shortest order | null), routeTone ('green'|'red'), locked, onPick(stop),
 *        grid (street crossings per side, default the drawn 7), home ({ col, row }, default the drawn bottom-left crossing),
 *        closeLoop (draw the way back home once every stop is visited — Advanced / Expert live maps).
 * Other grid sizes (live maps: 6–9 crossings) keep the 456 box: the street spacing becomes 384 / (grid − 1); parks follow a
 * fixed pattern (⚠️ ASSUMPTION — only the 7-crossing town is drawn).
 */
const SIZE = 456;
const geometry = (grid) => {
  const step = 384 / (grid - 1);
  const px = (col) => 36 + step * col;
  const py = (row) => 37 + step * (grid - 1 - row);
  const blocks = Array.from({ length: (grid - 1) ** 2 }, (_, n) => [
    n % (grid - 1),
    Math.floor(n / (grid - 1)),
  ]);
  const parks =
    grid === 7 ? ERRAND_PARK_BLOCKS : blocks.filter(([c, r]) => (c * 3 + r * 5) % 7 === 0);
  return { step, px, py, blocks, parks, streets: Array.from({ length: grid }, (_, k) => k) };
};

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

const Pin = ({ geo, col, row, children, className = '' }) => (
  <div
    className={classNames(
      'absolute flex -translate-x-1/2 flex-col items-center gap-[4px]',
      className
    )}
    style={{
      left: `${(geo.px(col) / SIZE) * 100}%`,
      top: `${(geo.py(row) / SIZE) * 100}%`,
      marginTop: `calc(${MARKER} / -2)`,
    }}
  >
    {children}
  </div>
);

const ErrandMap = ({
  stops,
  visited,
  best,
  routeTone,
  locked,
  onPick,
  grid = 7,
  home = ERRAND_HOME,
  closeLoop = false,
}) => {
  const geo = geometry(Math.max(2, grid));
  const toPath = (points) =>
    points.map((p, i) => `${i ? 'L' : 'M'}${geo.px(p.col)} ${geo.py(p.row)}`).join(' ');
  const visitedStops = visited.map((id) => stops.find((s) => s.id === id)).filter(Boolean);
  const loop = (list) => (closeLoop && list.length === stops.length ? [...list, home] : list);
  const routePath = toPath(routePoints(loop(visitedStops), home));
  const bestPath = best ? toPath(routePoints(loop(best), home)) : null;
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
          {geo.blocks.map(([c, r]) => (
            <rect
              key={`b-${c}-${r}`}
              x={44 + geo.step * c}
              y={44 + geo.step * r}
              width={geo.step - 16}
              height={geo.step - 16}
              rx="8"
              fill={geo.parks.some(([pc, pr]) => pc === c && pr === r) ? '#d9e8d2' : '#e4d6ba'}
            />
          ))}
          {geo.streets.map((k) => (
            <g key={`s-${k}`} fill="#fff" fillOpacity="0.9">
              <rect x={31 + geo.step * k} y="0" width="10" height={SIZE} />
              <rect x="0" y={32 + geo.step * k} width={SIZE} height="10" />
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
        <Pin geo={geo} col={home.col} row={home.row}>
          <Marker tone="home">
            <GameBuildingIcon className="size-[18px]" />
          </Marker>
          <PinLabel>Home</PinLabel>
        </Pin>
        {stops.map((stop) => {
          const at = visited.indexOf(stop.id);
          const Glyph = stop.icon === 'plus' ? GamePlusIcon : GamePinIcon;
          return (
            <Pin key={stop.id} geo={geo} col={stop.col} row={stop.row}>
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
