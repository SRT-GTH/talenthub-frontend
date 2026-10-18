import { useEffect, useMemo, useRef, useState } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import kofiAvatar from '../../../assets/talent-profile/share-card/kofi-avatar-portrait.svg';
import {
  ShareCardChipCheckIcon,
  ShareCardFlagIcon,
  ShareCardSparkleDoodle,
  ShareCardSquiggleDoodle,
  ShareCardUserIcon,
} from '../../shared/assets.jsx';
import { ART_SIZE, CARD_LOOKS, CARD_PROFILE, QR_MATRIX } from './talentProfileCardData.js';

const log = debug('ShareCardArt');

/*
 * ShareCardArt — the card itself (Figma `share card · Story 9:16 / Post 1:1 / LinkedIn banner · Forest`
 * inside SC-01..SC-08). Built at the Figma preview size (Story 300×533, Post 360×360, Banner
 * 352×88) with absolute design pixels, then scaled to its container by `FitArt` (the pick tiles are the
 * same art at 186/300). Playful doodles/stickers/shelves are `playful:` variants only.
 *
 * Props: look (CARD_LOOKS id), size ('story' | 'post' | 'banner'), show (SHOW_OPTIONS map),
 * text { headline, highlight, headlineEdited }, status ('idle' | 'making' | 'error').
 */

const lookById = (id) => CARD_LOOKS.find((l) => l.id === id) ?? CARD_LOOKS[0];

/* ---------- QR (25×25 modules, read from the Figma rectangles) ---------- */
const QR_PATH = (() => {
  let d = '';
  QR_MATRIX.forEach((row, y) => {
    for (let x = 0; x < row.length; x += 1) {
      if (row[x] === '#') d += `M${x} ${y}h1v1h-1z`;
    }
  });
  return d;
})();

const Qr = ({ size, logo, className = '' }) => (
  <div
    className={classNames(
      'relative shrink-0 overflow-hidden border border-[rgba(28,42,33,0.12)] bg-white playful:border-[#1c2a21]',
      className
    )}
    style={{ width: size, height: size }}
  >
    <svg
      viewBox="-1 -1 27 27"
      width="100%"
      height="100%"
      shapeRendering="crispEdges"
      aria-hidden="true"
      className="block"
    >
      <path d={QR_PATH} fill="#1c2a21" />
    </svg>
    <span
      className="absolute flex items-center justify-center overflow-hidden border-white bg-[#387440]"
      style={{
        width: logo,
        height: logo,
        left: (size - logo) / 2,
        top: (size - logo) / 2,
        borderWidth: logo * 0.12,
        borderRadius: logo * 0.36,
      }}
    >
      <ShareCardFlagIcon className="shrink-0" />
    </span>
  </div>
);

/* ---------- pieces ---------- */
const Sticker = ({ children, className = '', style }) => (
  <span
    className={classNames(
      'absolute inline-flex items-center rounded-full bg-[#ebf1ec] px-[10px] py-[5px] text-[12px] leading-[14px] font-bold whitespace-nowrap text-[#1f4d26]',
      'playful:-rotate-[7deg] playful:border-[1.2px] playful:border-[#1c2a21] playful:bg-[#ffd86b] playful:font-heading playful:text-[#1c2a21] playful:shadow-[2px_2px_0_#1c2a21]',
      className
    )}
    style={style}
  >
    {children}
  </span>
);

const Chip = ({ children, compact = false }) => (
  <span
    className={classNames(
      'inline-flex items-center rounded-full border border-[rgba(28,42,33,0.12)] bg-white font-semibold whitespace-nowrap text-[#1c2a21] playful:border-[#1c2a21]',
      compact
        ? 'gap-[2px] px-[7px] text-[8px] leading-[10px]'
        : 'gap-[5px] px-[10px] py-[6px] text-[12px] leading-[18px]'
    )}
    style={compact ? { height: 16 } : { height: 32 }}
  >
    <ShareCardChipCheckIcon className={compact ? 'size-[6px]' : 'size-[14px]'} />
    {children}
  </span>
);

const Avatar = ({ size }) => {
  const inner = size - 12;
  const k = inner / 98;
  return (
    <span
      className="absolute flex items-center justify-center overflow-hidden rounded-full border border-[rgba(28,42,33,0.1)] bg-white shadow-[0_2px_8px_rgba(28,42,33,0.04),0_1px_2px_rgba(28,42,33,0.04)] playful:border-[1.2px] playful:border-[#1c2a21] playful:shadow-[3px_3px_0_rgba(28,42,33,0.55)]"
      style={{ width: size, height: size }}
    >
      <span
        className="relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#387440]"
        style={{ width: inner, height: inner }}
      >
        <img
          src={kofiAvatar}
          alt=""
          className="absolute max-w-none"
          style={{ width: 109.06 * k, height: 110.65 * k, left: -5.53 * k, top: -6.32 * k }}
        />
      </span>
    </span>
  );
};

const Doodles = ({ size }) => {
  if (size === 'banner') {
    return (
      <span
        aria-hidden="true"
        className="pointer-events-none absolute hidden rounded-full border-[1.5px] border-dashed border-[#84cc16] playful:block"
        style={{ left: 232, top: -70, width: 180, height: 180 }}
      />
    );
  }
  if (size === 'post') {
    return (
      <span
        aria-hidden="true"
        className="pointer-events-none absolute hidden rounded-full border-[1.5px] border-dashed border-[#84cc16] playful:block"
        style={{ left: 180, top: -100, width: 260, height: 260 }}
      />
    );
  }
  return null;
};

/* Story doodles are positioned individually (Figma 7608:9549..9553). */
const StoryDoodles = () => (
  <span aria-hidden="true" className="contents">
    <span
      className="pointer-events-none absolute hidden rounded-full border-[1.5px] border-dashed border-[#84cc16] playful:block"
      style={{ left: 120, top: -90, width: 260, height: 260 }}
    />
    <span
      className="pointer-events-none absolute hidden playful:block"
      style={{ left: 150, top: 118, width: 96, height: 7 }}
    >
      <ShareCardSquiggleDoodle className="size-full" />
    </span>
    {[
      [250, 140, 16],
      [34, 60, 12],
      [240, 420, 14],
    ].map(([x, y, s]) => (
      <span
        key={`${x}-${y}`}
        className="pointer-events-none absolute hidden playful:block"
        style={{ left: x, top: y, width: s, height: s }}
      >
        <ShareCardSparkleDoodle className="size-full" />
      </span>
    ))}
  </span>
);

const FadeOverlay = ({ status }) => {
  if (status === 'error') {
    return <span aria-hidden="true" className="absolute inset-0 bg-[rgba(255,255,255,0.57)]" />;
  }
  if (status === 'making') {
    return (
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.44),rgba(255,255,255,0.9)_43%,rgba(255,255,255,0.44))]"
      />
    );
  }
  return null;
};

const ShareCardArt = ({ look = 'forest', size = 'story', show, text, status = 'idle' }) => {
  const l = lookById(look);
  const { w, h } = ART_SIZE[size];
  const headline = text?.headline ?? CARD_PROFILE.headline;
  const highlight = text?.highlight ?? CARD_PROFILE.highlight;
  const showHighlight = Boolean(text?.highlightEdited && highlight.trim());
  const skills = size === 'post' ? CARD_PROFILE.skills.slice(0, 2) : CARD_PROFILE.skills;
  log('render', { look, size, status, headlineLen: headline.length });

  const frame = classNames(
    'relative overflow-hidden border border-[rgba(28,42,33,0.1)] shadow-[0_2px_8px_rgba(28,42,33,0.04),0_1px_2px_rgba(28,42,33,0.04)]',
    'playful:border-[1.2px] playful:border-[#1c2a21] playful:shadow-[5px_5px_0_rgba(28,42,33,0.55)]'
  );

  /* ----- LinkedIn banner ----- */
  if (size === 'banner') {
    return (
      <div className="relative" style={{ width: w, height: 148 }} data-card-size="banner">
        <div
          className={classNames(
            frame,
            'rounded-[16px] playful:shadow-[4px_4px_0_rgba(28,42,33,0.55)]'
          )}
          style={{ width: w, height: h, backgroundColor: l.bg }}
        >
          <Doodles size="banner" />
          <p
            className="absolute m-0 text-[15px] leading-[18px] font-semibold whitespace-nowrap playful:font-heading"
            style={{ left: 110, top: 12, color: l.name }}
          >
            {text?.headlineEdited ? headline : CARD_PROFILE.bannerTitle}
          </p>
          {show?.skills !== false && (
            <span className="absolute flex gap-[4px]" style={{ left: 110, top: 36 }}>
              {CARD_PROFILE.bannerSkills.map((s) => (
                <Chip key={s} compact>
                  {s}
                </Chip>
              ))}
            </span>
          )}
          {show?.qr !== false && (
            <>
              <span
                className="absolute text-[8px] leading-[10px] font-semibold whitespace-nowrap text-[#ffd86b]"
                style={{ left: 110, top: 62 }}
              >
                {CARD_PROFILE.link}
              </span>
              <Qr size={56} logo={11} className="absolute rounded-[2px]" />
            </>
          )}
          <FadeOverlay status={status} />
        </div>
        <div className="absolute" style={{ left: 0, top: 88, width: w, height: 60 }}>
          <span
            className="absolute flex items-center justify-center rounded-full border-[1.5px] border-dashed border-[#bfbfbf] bg-white text-[#bfbfbf]"
            style={{ left: 18, top: -36, width: 72, height: 72 }}
          >
            <ShareCardUserIcon />
          </span>
          <p
            className="absolute m-0 text-[11px] leading-[13px] font-medium text-[#595959]"
            style={{ left: 100, top: 6, width: 230 }}
          >
            Your LinkedIn photo sits here, so this corner stays clear
          </p>
        </div>
      </div>
    );
  }

  const isPost = size === 'post';
  return (
    <div
      className={classNames(frame, isPost ? 'rounded-[16px]' : 'rounded-[22px]', 'shrink-0')}
      style={{ width: w, height: h, backgroundColor: l.bg }}
      data-card-size={size}
    >
      {isPost ? <Doodles size="post" /> : <StoryDoodles />}

      {show?.openToWork !== false && (
        <Sticker style={isPost ? { left: 240, top: 26 } : { left: 22, top: 24 }}>
          Open to work
        </Sticker>
      )}
      {show?.badges && (
        <Sticker
          className="!rotate-0"
          style={isPost ? { left: 240, top: 58 } : { left: 22, top: 56 }}
        >
          {CARD_PROFILE.badge}
        </Sticker>
      )}

      <span className="absolute" style={isPost ? { left: 22, top: 22 } : { left: 22, top: 66 }}>
        <Avatar size={isPost ? 88 : 110} />
      </span>

      <div
        className="absolute font-semibold playful:font-heading"
        style={{
          left: 22,
          top: isPost ? 124 : 186,
          color: l.name,
          fontSize: isPost ? 32 : 40.32,
          lineHeight: 1.2,
          whiteSpace: 'nowrap',
        }}
      >
        {isPost ? (
          <p className="m-0">{CARD_PROFILE.name}</p>
        ) : (
          <>
            <p className="m-0">{CARD_PROFILE.firstName}</p>
            <p className="m-0">{CARD_PROFILE.lastName}</p>
          </>
        )}
      </div>

      {show?.headline !== false && (
        <div
          className="absolute flex items-center gap-[6px] text-[14px] leading-[17px] font-semibold whitespace-nowrap text-[#ebf1ec]"
          style={{ left: 22, top: isPost ? 172 : 278 }}
        >
          <span>{headline}</span>
          {!isPost && <ShareCardFlagIcon className="size-[16px] shrink-0" />}
        </div>
      )}

      {showHighlight && (
        <p
          className="absolute m-0 text-[12px] leading-[14px] font-semibold whitespace-nowrap text-[#ffd86b]"
          style={{ left: 22, top: isPost ? 190 : 296 }}
        >
          {highlight}
        </p>
      )}

      {show?.skills !== false && (
        <div
          className="absolute flex flex-col items-start gap-[5px]"
          style={{ left: 22, top: isPost ? 204 : 306 }}
        >
          {skills.map((s) => (
            <Chip key={s}>{s}</Chip>
          ))}
        </div>
      )}

      {show?.pitch && (
        <span
          className="absolute inline-flex items-center rounded-full bg-[#ffd86b] px-[10px] py-[5px] text-[12px] leading-[14px] font-bold whitespace-nowrap text-[#1c2a21]"
          style={isPost ? { left: 240, top: 90 } : { left: 160, top: 24 }}
        >
          Watch my pitch
        </span>
      )}

      {show?.qr !== false && (
        <div
          className="absolute flex items-center gap-[10px] rounded-[14px] bg-white p-[10px] playful:border-[1.2px] playful:border-[#1c2a21] playful:p-[8.8px]"
          style={{ left: 22, top: isPost ? 266 : 439, width: 256, height: 72 }}
        >
          <Qr size={52} logo={10} />
          <div className="flex min-w-0 flex-col gap-[2px] leading-[normal] whitespace-nowrap">
            <p className="m-0 text-[11px] leading-[13px] font-medium text-[#595959]">Find me on</p>
            <p className="m-0 text-[14px] leading-[17px] font-bold text-[#1c2a21]">
              Ghana Talent Hub
            </p>
            <p className="m-0 text-[11px] leading-[13px] font-medium text-[#387440]">
              {CARD_PROFILE.link}
            </p>
          </div>
        </div>
      )}
      <FadeOverlay status={status} />
    </div>
  );
};

/* FitArt — scales design-pixel art to the width of its box (never above 1× unless `max` allows). */
export const FitArt = ({ size = 'story', children, max = 1, className = '', style }) => {
  const ref = useRef(null);
  const { w, h } = ART_SIZE[size];
  const boxH = size === 'banner' ? 148 : h;
  const [scale, setScale] = useState(max);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const measure = () => {
      const next = Math.min(max, el.clientWidth / w);
      if (next > 0) setScale(next);
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [w, max]);

  const inner = useMemo(() => children, [children]);
  return (
    <div ref={ref} className={classNames('w-full', className)} style={style}>
      <div style={{ width: w * scale, height: boxH * scale, margin: '0 auto' }}>
        <div
          style={{
            width: w,
            height: boxH,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        >
          {inner}
        </div>
      </div>
    </div>
  );
};

export default ShareCardArt;
