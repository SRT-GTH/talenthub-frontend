import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import kofiAvatar from '../../../../assets/engagement-v2/journey/kofi-avatar.svg';
import journeyMap from '../../../../assets/engagement-v2/journey/journey-map.webp';
import Button from '../../../ui/Button.jsx';
import { AVATAR_SPOTS, COPY, MAP_H, MAP_W, REGION_LINES } from './journeyData.js';
import {
  ArrowRightIcon,
  BoltIcon,
  EyeIcon,
  MarkerPinIcon,
  TimeClockIcon,
  TrophyIcon,
} from './JourneyIcons.jsx';
import JourneyNode from './JourneyNode.jsx';
import { nodeSub, nodePill } from './journeyText.js';
import { ROAD_BOX, ROAD_SEGMENTS, ROAD_START } from './journeyRoad.js';
import { travelledNodeCount } from './journeyModel.js';

const log = debug('JourneyMapCanvas');

/* The avatar stands next to the stage the road has reached; Figma draws four spots, anything else follows the same rule. */
const avatarSpotFor = (model) => {
  if (model.inOrder && AVATAR_SPOTS[model.done]) return AVATAR_SPOTS[model.done];
  const node = model.nodes.find((n) => n.id === model.current?.id);
  if (!node) return AVATAR_SPOTS[9];
  return { x: node.cx + 62, y: node.cy - 110 };
};

const Region = ({ region }) => (
  <div
    className="absolute flex items-center gap-[8px] rounded-full border border-[#e7e7e7] bg-white/[.92] py-[8px] pl-[10px] pr-[14px] font-sans"
    style={{ left: region.x, top: region.y }}
  >
    <MarkerPinIcon className="size-[16px] text-[#387440]" />
    <span className="text-[12px] font-bold leading-[14px] tracking-[1.2px] text-[#387440]">
      {region.name}
    </span>
    <span className="whitespace-pre text-[13px] font-medium leading-[16px] text-[#1c2a21]">
      {'·  '}
      {region.tag}
    </span>
    <span className="inline-flex rounded-full border border-[rgba(28,42,33,0.35)] bg-[#f1f1ee] px-[8px] py-[2px] text-[12px] font-semibold leading-[14px] text-[#595959]">
      {region.count}/{region.size ?? 3}
    </span>
  </div>
);

const Tooltip = ({ node, onEnter, onLeave }) => {
  const navigate = useNavigate();
  const t = node.copy.tooltip;
  const Glyph = BoltIcon;
  return (
    <div
      role="tooltip"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="absolute z-30 flex w-[300px] flex-col gap-[12px] rounded-[18px] border border-[#e7e7e7] bg-white p-[16px] shadow-[0_8px_22px_rgba(13,31,15,0.08)]"
      style={{ left: node.cx - 42 - 20 - 300, top: node.cy - 122 }}
    >
      <div className="flex items-center gap-[12px]">
        <span className="flex size-[40px] items-center justify-center rounded-[12px] bg-[#ebf1ec] text-[#387440]">
          <Glyph className="size-[20px]" />
        </span>
        <span className="flex flex-col gap-[2px] font-sans">
          <span className="text-[17px] font-semibold leading-[20px] text-[#1c2a21]">
            {node.stage.label}
          </span>
          <span className="flex items-center gap-[4px] text-[12px] font-medium leading-[14px] text-[#595959]">
            <TimeClockIcon className="size-[13px]" />
            Stage {node.stage.n} · {t.about}
          </span>
        </span>
      </div>
      <p className="m-0 font-sans text-[13px] font-normal leading-[19px] text-[#595959]">
        {t.text}
      </p>
      <span className="flex w-fit items-center gap-[6px] rounded-full border border-[rgba(28,42,33,0.1)] bg-[#faf4e8] py-[6px] pl-[8px] pr-[10px] font-sans text-[12px] font-semibold leading-[14px] text-[#785910] playful:border-[rgba(28,42,33,0.35)]">
        <TrophyIcon className="size-[14px]" />
        {t.counts}
      </span>
      <Button
        variant="primary"
        size="sm"
        rightIcon={<ArrowRightIcon className="size-[20px]" />}
        onClick={() => {
          log('tooltip start', node.id);
          navigate(node.stage.route);
        }}
        className="w-full"
      >
        {t.action}
      </Button>
      <span
        aria-hidden="true"
        className="absolute right-[-11px] top-[102px] size-[22px] rotate-45 border-r border-t border-[#e7e7e7] bg-white"
      />
    </div>
  );
};

/*
 * JourneyMapCanvas — the 1112x1140 "road map" (Figma `Journey map`), drawn at design size and scaled to its container
 * (never above 1x). Layers: map photo (+ white wash), region lines, road (white) + dotted road ahead + travelled stretch,
 * region pills, nodes, avatar + shadow, tooltip, toast.
 */
const JourneyMapCanvas = ({ model, hoverId, onHover, toast, onToast }) => {
  const hostRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return undefined;
    const measure = () => {
      const w = el.clientWidth;
      const s = Math.min(1, w / MAP_W);
      setScale(s);
      log('scale', { w, s });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const travelled = ROAD_SEGMENTS.slice(0, travelledNodeCount(model) - 1).join('');
  const spot = avatarSpotFor(model);
  const hovered = model.nodes.find((n) => n.id === hoverId && n.copy?.tooltip);

  return (
    <div ref={hostRef} className="w-full" style={{ maxWidth: MAP_W }}>
      <div style={{ height: MAP_H * scale }}>
        <div
          className="relative overflow-hidden rounded-[28px] border border-[#e7e7e7]"
          style={{
            width: MAP_W,
            height: MAP_H,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        >
          <img
            src={journeyMap}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 size-full object-cover [filter:brightness(1.08)_contrast(0.955)_saturate(0.45)]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.42)_0%,rgba(255,255,255,0.22)_60%,rgba(255,255,255,0.12)_85%,rgba(255,255,255,0)_100%)]"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-[#f7f8f4]/[0.28]" />

          {REGION_LINES.map((y) => (
            <span
              key={y}
              aria-hidden="true"
              className="absolute left-[24px] h-0 w-[1064px] border-t-[1.5px] border-white/[.85]"
              style={{ top: y }}
            />
          ))}
          <span
            aria-hidden="true"
            className="absolute left-[40px] top-[1110px] font-sans text-[10px] font-semibold leading-[12px] tracking-[2px] text-white/90 opacity-50"
          >
            {COPY.gulf}
          </span>

          <svg
            aria-hidden="true"
            className="absolute"
            style={{ left: ROAD_BOX.x, top: ROAD_BOX.y }}
            width={ROAD_BOX.w}
            height={ROAD_BOX.h}
            viewBox={`0 0 ${ROAD_BOX.w} ${ROAD_BOX.h}`}
            fill="none"
          >
            <path
              d={ROAD_START + ROAD_SEGMENTS.join('')}
              stroke="white"
              strokeOpacity="0.75"
              strokeWidth="22"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={ROAD_START + ROAD_SEGMENTS.join('')}
              stroke="#a9b8a6"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="1 12"
            />
            <path
              d={ROAD_START + travelled}
              stroke="#387440"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {model.regions.map((r) => (
            <Region key={r.id} region={r} />
          ))}

          {model.nodes.map((node) => (
            <JourneyNode
              key={node.id}
              node={node}
              sub={nodeSub(node, model)}
              pill={nodePill(node, model)}
              emphasis={hoverId === node.id}
              onEnter={() => node.copy?.tooltip && onHover(node.id)}
              onLeave={() => node.copy?.tooltip && onHover(null)}
            />
          ))}

          <span
            aria-hidden="true"
            className="absolute h-[12px] w-[80px] rounded-full bg-[#2a5730]"
            style={{ left: spot.x + 11, top: spot.y + 144 }}
          />
          <img
            src={kofiAvatar}
            alt="Kofi's avatar"
            width={101}
            height={150}
            className="absolute"
            style={{ left: spot.x, top: spot.y }}
          />

          {hovered ? (
            <Tooltip
              node={hovered}
              onEnter={() => onHover(hovered.id)}
              onLeave={() => onHover(null)}
            />
          ) : null}

          {toast ? (
            <div
              role="status"
              className={classNames(
                'absolute z-20 flex h-[50px] w-[505px] items-center gap-[10px] rounded-full bg-[#1c2a21] py-[12px] pl-[14px] pr-[18px] font-sans',
                'shadow-[0_5px_14px_rgba(0,0,0,0.09)]'
              )}
              style={{ left: 585, top: 84 }}
            >
              <span className="flex size-[26px] shrink-0 items-center justify-center rounded-full bg-[#c8951a] text-[#387440]">
                <EyeIcon className="h-[14px] w-[15px]" />
              </span>
              <span className="text-[14px] font-semibold leading-[17px] text-white">{toast}</span>
              <button
                type="button"
                onClick={() => {
                  log('toast: view card (no destination drawn)');
                  onToast?.();
                }}
                className="ml-auto cursor-pointer whitespace-nowrap border-0 bg-transparent p-0 font-sans text-[14px] font-semibold leading-[17px] text-[#ffd86b]"
              >
                View card
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default JourneyMapCanvas;
