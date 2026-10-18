import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { useUiStyle } from '../../../hooks/useUiStyle.js';
import { OVERVIEW_ABOUT, OVERVIEW_SKILLS, PROFILE_STRENGTH } from './talentProfileTabsData.js';
import { AX_LANDMARKS } from './ProfileAxData.js';
import { mainRect, queryVisible, rectOf, useAxMeasure } from './ProfileAxUtils.js';

const log = debug('ProfileLandmarksOverlay');

const SURFACE =
  'shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]';

/*
 * Landmark outlines, each = the real element's box + 3px (Figma: header -3,50 1734x93 around the 1728x87 bar,
 * `<main>` 886 wide around the 880 card column ...). Colours are the Figma values.
 * NOTE (Figma): the `<main>` rect is drawn with an OPAQUE #387440 fill in both frames (the other four use 8%);
 * kept as drawn — set MAIN_FILL_ALPHA below to e.g. 0.08 to make the cards beneath visible.
 */
const MAIN_FILL_ALPHA = 1;
const LANDMARKS = [
  {
    key: 'header',
    color: '#3062d4',
    fill: 0.08,
    find: () => queryVisible('header'),
    tag: AX_LANDMARKS.tags.header,
    outside: true,
  },
  {
    key: 'nav',
    color: '#7c3aed',
    fill: 0.08,
    // the sidebar: climb from <nav "Main"> to the column that sits beside <main>
    find: () => {
      let el = queryVisible('nav[aria-label="Main"]');
      while (el?.parentElement && !el.parentElement.querySelector('#main')) el = el.parentElement;
      return el;
    },
    tag: AX_LANDMARKS.tags.nav,
    outside: true,
  },
  {
    key: 'main',
    color: '#387440',
    fill: MAIN_FILL_ALPHA,
    find: () => queryVisible('[data-tab-layout] > [data-ax="main-col"]'),
    tag: AX_LANDMARKS.tags.main,
    focusedStroke: 1,
  },
  {
    key: 'aside',
    color: '#c8951a',
    fill: 0.08,
    find: () => queryVisible('[data-tab-layout] > [data-ax="rail"]'),
    tag: AX_LANDMARKS.tags.aside,
  },
  {
    key: 'hero',
    color: '#1c2a21',
    fill: 0.08,
    find: () => queryVisible('section[aria-label="Profile header"]'),
    tag: AX_LANDMARKS.tags.hero,
  },
];

/* h2 tags: right edge 60px in from the card's right edge, `top` px below the card top (Figma). */
const HEADINGS = [
  { key: 'about', title: OVERVIEW_ABOUT.title, top: 12, text: AX_LANDMARKS.headings.about },
  { key: 'skills', title: OVERVIEW_SKILLS.title, top: 4, text: AX_LANDMARKS.headings.skills },
  { key: 'strength', title: PROFILE_STRENGTH.title, top: 12, text: AX_LANDMARKS.headings.strength },
];

const measure = () => ({
  main: mainRect(),
  vw: window.innerWidth,
  vh: window.innerHeight,
  boxes: LANDMARKS.map((l) => {
    const r = rectOf(l.find());
    return r ? { ...l, find: undefined, r } : null;
  }).filter(Boolean),
  heads: HEADINGS.map((h) => {
    const r = rectOf(queryVisible(`section[aria-label="${h.title}"]`));
    return r ? { ...h, r } : null;
  }).filter(Boolean),
});

const Box = ({ b, ox, oy, focused }) => {
  const sw = b.focusedStroke && focused ? b.focusedStroke : 2.5;
  const w = b.r.w + 6;
  const h = b.r.h + 6;
  return (
    <>
      <svg
        aria-hidden="true"
        className="absolute overflow-visible"
        width={w}
        height={h}
        style={{ left: b.r.x - 3 - ox, top: b.r.y - 3 - oy }}
      >
        <rect
          x={sw / 2}
          y={sw / 2}
          width={w - sw}
          height={h - sw}
          rx={16 - sw / 2}
          fill={b.color}
          fillOpacity={b.fill}
          stroke={b.color}
          strokeWidth={sw}
          strokeDasharray="8 5"
        />
      </svg>
      <span
        aria-hidden="true"
        className="absolute inline-flex items-center rounded-[8px] px-[10px] py-[5px] text-[12px] leading-[14px] font-bold whitespace-nowrap text-white playful:border playful:border-[rgba(28,42,33,0.35)]"
        style={{ left: b.r.x + 5 - ox, top: b.r.y + 5 - oy, background: b.color }}
      >
        {b.tag}
      </span>
    </>
  );
};

/*
 * ProfileLandmarksOverlay — AX-07b "Landmarks & headings" (Figma Playful 7592:3287 / Focused 8110:394869):
 * dashed landmark outlines + their tags over the real elements, h2 tags on the cards and the dark
 * "Screen reader map" card. Boxes are measured from the DOM; pointer-events none.
 */
const ProfileLandmarksOverlay = ({ profile }) => {
  const m = useAxMeasure(measure);
  const { uiStyle } = useUiStyle();
  const playful = uiStyle === 'playful';

  useEffect(() => {
    log('mount', { ax: profile?.ax });
  }, [profile?.ax]);

  if (!m) return null;
  const { main, vw, vh, boxes, heads } = m;
  const wide = vw >= 1024;
  const aside = boxes.find((b) => b.key === 'aside');
  const cardTop = wide && aside ? Math.min(Math.max(aside.r.y + 69, 64), vh - 260) : null;
  const lines = AX_LANDMARKS.lines.filter((l) => typeof l === 'string' || playful);

  return createPortal(
    <div data-pf-portal="" className="pointer-events-none">
      <div aria-hidden="true" className="fixed inset-0 z-[110]">
        {boxes
          .filter((b) => b.outside)
          .map((b) => (
            <Box key={b.key} b={b} ox={0} oy={0} focused={!playful} />
          ))}
      </div>
      <div
        aria-hidden="true"
        className="fixed z-[111] overflow-hidden"
        style={{ left: main.x, top: main.y, width: main.w, height: main.h }}
      >
        {boxes
          .filter((b) => !b.outside)
          .map((b) => (
            <Box key={b.key} b={b} ox={main.x} oy={main.y} focused={!playful} />
          ))}
        {heads.map((h) => (
          <span
            key={h.key}
            className="absolute inline-flex items-center rounded-[6px] border border-[rgba(28,42,33,0.12)] bg-[#ffd86b] px-[8px] py-[4px] text-[11px] leading-[13px] font-bold whitespace-nowrap text-[#1c2a21] max-lg:text-[12px] playful:border-[#1c2a21]"
            style={{
              right: main.x + main.w - (h.r.x + h.r.w) + 60,
              top: h.r.y - main.y + h.top,
            }}
          >
            {h.text}
          </span>
        ))}
      </div>

      <section
        aria-label={AX_LANDMARKS.title}
        className={classNames(
          'pointer-events-auto fixed z-[120] flex w-[380px] max-w-[calc(100vw-24px)] flex-col gap-[8px] rounded-[16px] bg-[#1c2a21] p-[18px] leading-[normal]',
          SURFACE,
          wide ? 'right-[40px]' : 'right-[12px] bottom-[12px] max-h-[45vh] overflow-y-auto'
        )}
        style={wide ? { top: cardTop ?? '55%' } : undefined}
      >
        <h2 className="m-0 text-[15px] leading-[18px] font-bold text-[#ffd86b]">
          {AX_LANDMARKS.title}
        </h2>
        {lines.map((line) => {
          const text = typeof line === 'string' ? line : line.text;
          return (
            <p key={text} className="m-0 text-[12px] leading-[17px] text-white">
              {text}
            </p>
          );
        })}
      </section>
    </div>,
    document.body
  );
};

export default ProfileLandmarksOverlay;
