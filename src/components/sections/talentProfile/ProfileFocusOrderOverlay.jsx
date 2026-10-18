import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { OVERVIEW_ABOUT, OVERVIEW_SKILLS, PROFILE_STRENGTH } from './talentProfileTabsData.js';
import { AX_FOCUS } from './ProfileAxData.js';
import { mainRect, queryVisible, rectOf, useAxMeasure } from './ProfileAxUtils.js';

const log = debug('ProfileFocusOrderOverlay');

const SURFACE =
  'shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]';

/*
 * Focus stops, in order. `dx`/`dy`: where the badge's top-left sits relative to the element's top-left
 * (taken from the Figma frame: badges 3-9 and 1 sit 14px up-left of their element; 2, 8, 10, 11 differ).
 * `find` locates the REAL element in the DOM, so the badge follows layout, resize and scroll.
 */
const cardButtons = (title) => () => [
  ...(queryVisible(`section[aria-label="${title}"]`)?.querySelectorAll('header button') ?? []),
];
const STOPS = [
  { n: 2, dx: -22, dy: -14, find: () => queryVisible('nav[aria-label="Main"]'), outside: true },
  { n: 3, dx: -14, dy: -14, find: () => queryVisible('[data-ax="preview"]') },
  { n: 4, dx: -14, dy: -14, find: () => queryVisible('[data-ax="share"]'), ring: true },
  { n: 5, dx: -14, dy: -14, find: () => queryVisible('[data-ax="pitch"]') },
  { n: 6, dx: -14, dy: -14, find: () => queryVisible('[data-ax="photo"]') },
  { n: 7, dx: -14, dy: -14, find: () => queryVisible('[data-ax="tabs"]') },
  { n: 8, dx: -54, dy: -14, find: () => cardButtons(OVERVIEW_ABOUT.title)()[0] },
  { n: 9, dx: -14, dy: -14, find: () => cardButtons(OVERVIEW_ABOUT.title)()[1] },
  { n: 10, dx: -14, dy: -22, find: () => cardButtons(OVERVIEW_SKILLS.title)()[0] },
  {
    n: 11,
    dx: -15,
    dy: -38,
    find: () => queryVisible(`section[aria-label="${PROFILE_STRENGTH.title}"] button`),
  },
];

const measure = () => {
  const stops = STOPS.map((s) => {
    const r = rectOf(s.find());
    return r ? { ...s, find: undefined, r } : null;
  }).filter(Boolean);
  const strength = rectOf(queryVisible(`section[aria-label="${PROFILE_STRENGTH.title}"]`));
  return { main: mainRect(), stops, strength, vw: window.innerWidth, vh: window.innerHeight };
};

const Badge = ({ n, style }) => (
  <span
    aria-hidden="true"
    className="absolute flex size-[30px] items-center justify-center rounded-full border border-[rgba(28,42,33,0.12)] bg-[#ffd86b] text-[13px] leading-[16px] font-bold text-[#1c2a21] playful:border-[1.2px] playful:border-[#1c2a21] playful:shadow-[2px_2px_0_#1c2a21]"
    style={style}
  >
    {n}
  </span>
);

/* Focus ring (Figma `focus ring · Share profile`): 4px out from the element, 3px brand-green stroke (1px Focused)
   over a 2px white gap. */
const Ring = ({ r, style }) => (
  <span
    aria-hidden="true"
    className="absolute rounded-[14px] shadow-[0_0_0_1px_#387440,0_0_0_2px_#fff] playful:shadow-[0_0_0_3px_#387440,0_0_0_2px_#fff]"
    style={{ left: r.x - 4, top: r.y - 4, width: r.w + 8, height: r.h + 8, ...style }}
  />
);

/*
 * ProfileFocusOrderOverlay — AX-07a "Keyboard focus order" (Figma Playful 7592:2619 / Focused 8110:394214):
 * 35% white dim, the visible skip link, numbered badges 1-11 over the real page elements, a focus ring on
 * "Share profile" and the dark "Keyboard focus order" card. Pure annotation: pointer-events none.
 */
const ProfileFocusOrderOverlay = ({ profile }) => {
  const m = useAxMeasure(measure);

  useEffect(() => {
    log('mount', { ax: profile?.ax });
  }, [profile?.ax]);

  if (!m) return null;
  const { main, stops, strength, vw, vh } = m;
  const inMain = stops.filter((s) => !s.outside);
  const outside = stops.filter((s) => s.outside);
  const wide = vw >= 1024;

  // Card: Figma sits on the right rail, 46px below the "Profile strength" card top, 40px from the right edge.
  const cardTop = wide && strength ? Math.min(Math.max(strength.y + 46, 64), vh - 260) : null;

  return createPortal(
    <div data-pf-portal="" className="pointer-events-none">
      <div aria-hidden="true" className="fixed inset-0 z-[110] bg-[rgba(255,255,255,0.35)]" />

      <div
        aria-hidden="true"
        className="fixed top-[8px] left-[24px] z-[115] flex items-center gap-[8px] rounded-[12px] border-[1.5px] border-[#1c2a21] bg-white px-[16px] py-[10px] text-[14px] leading-[17px] font-semibold whitespace-nowrap text-[#1c2a21]"
      >
        {AX_FOCUS.skip}
      </div>
      <Badge n={1} style={{ position: 'fixed', top: 2, left: 10, zIndex: 120 }} />

      {outside.map((s) => (
        <Badge
          key={s.n}
          n={s.n}
          style={{
            position: 'fixed',
            left: Math.max(2, s.r.x + s.dx),
            top: s.r.y + s.dy,
            zIndex: 120,
          }}
        />
      ))}

      <div
        aria-hidden="true"
        className="fixed z-[115] overflow-hidden"
        style={{ left: main.x, top: main.y, width: main.w, height: main.h }}
      >
        {inMain
          .filter((s) => s.ring)
          .map((s) => (
            <Ring
              key={`ring-${s.n}`}
              r={{ x: s.r.x - main.x, y: s.r.y - main.y, w: s.r.w, h: s.r.h }}
            />
          ))}
        {inMain.map((s) => (
          <Badge
            key={s.n}
            n={s.n}
            style={{ left: s.r.x - main.x + s.dx, top: s.r.y - main.y + s.dy }}
          />
        ))}
      </div>

      <section
        aria-label={AX_FOCUS.title}
        className={classNames(
          'pointer-events-auto fixed z-[120] flex w-[380px] max-w-[calc(100vw-24px)] flex-col gap-[8px] rounded-[16px] bg-[#1c2a21] p-[18px] leading-[normal]',
          SURFACE,
          wide ? 'right-[40px]' : 'right-[12px] bottom-[12px] max-h-[45vh] overflow-y-auto'
        )}
        style={wide && cardTop !== null ? { top: cardTop } : wide ? { top: '55%' } : undefined}
      >
        <h2 className="m-0 text-[15px] leading-[18px] font-bold text-[#ffd86b]">
          {AX_FOCUS.title}
        </h2>
        {AX_FOCUS.lines.map((line) => (
          <p key={line} className="m-0 text-[12px] leading-[17px] whitespace-pre-wrap text-white">
            {line}
          </p>
        ))}
      </section>
    </div>,
    document.body
  );
};

export default ProfileFocusOrderOverlay;
