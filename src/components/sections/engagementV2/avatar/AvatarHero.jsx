import { useEffect } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import AvatarPreview from '../../engagement/avatar/AvatarPreview.jsx';
import { useAvatarSelection } from '../../../../hooks/useAvatarSelection.js';
import hexA from '../../../../assets/engagement-v2/avatar/hex-a.svg';
import hexB from '../../../../assets/engagement-v2/avatar/hex-b.svg';
import { EditNameIcon, ShuffleIcon, UndoIcon } from './avatarIcons.jsx';
import { SHADOW_HARD } from './AvatarPieces.jsx';
import { HAIRSTYLES, HAIR_COLORS, OUTFITS, SKIN_SHADES } from './avatarData.js';

const log = debug('AvatarHero');

/*
 * AvatarHero — the left "hero stage" (Figma "LEFT — hero stage", 990x877): green-to-sky gradient (4 stacked fills), diagonal-line
 * texture at 50%, dashed 745px ring with two gold dots, three "✦" sparkles, the 640px avatar showcase (radial #387440 -> white) with the
 * live layered avatar, the undo / username / shuffle row, and the top-left tag + heading. The figure that Figma shows is a flat
 * image; here it is the layered avatar from AvatarSelectionProvider so every pick shows live. Positions (design px from the stage
 * top-left): ring 123,90 · sparkles 19,24 / 893,35 / 84,<sparkleBottom> · showcase 176,129 · controls 190,793 · tag 60,40 · heading 60,80.
 * The showcase's own dashed "Border" ring and three 8px dots sit OUTSIDE its clipped frame in Figma, so they are not visible and not drawn.
 * Playful: Bricolage heading + username, hard shadows, the rotated yellow sticker. Below lg: tag + heading, then the avatar disc and
 * the controls, centred. Props: meta (STEP_META entry).
 */
const HERO_BG = [
  'radial-gradient(ellipse 131% 112% at 15% 15%, rgba(56,116,64,0.8) 0%, rgba(56,116,64,0) 87.5%)',
  'radial-gradient(ellipse 155% 131% at 53% 88%, rgba(251,191,36,0.2) 20%, rgba(244,114,182,0) 100%)',
  'radial-gradient(ellipse 122% 104% at 50% 95%, rgba(206,17,38,0.1) 0%, rgba(56,189,248,0) 45%)',
  'linear-gradient(137deg, rgba(56,116,64,0) 0%, rgba(56,116,64,0.05) 20%, #eef6fd 100%)',
].join(',');

const SKIN_IDS = SKIN_SHADES.map((s) => s.id);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const ControlButton = ({ onClick, label, children }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    className={classNames(
      'inline-grid size-[44px] shrink-0 cursor-pointer place-items-center rounded-full border border-solid border-[#e8e8e4] bg-white p-0 text-[#999999]',
      'shadow-[5px_5px_0_rgba(28,42,33,0.2),0_10px_24px_rgba(28,42,33,0.06)] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]',
      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green'
    )}
  >
    {children}
  </button>
);

const AvatarHero = ({ meta }) => {
  const { selection, undo, setField } = useAvatarSelection();
  useEffect(() => {
    log('mount', { tag: meta.tag });
  }, [meta.tag]);

  const shuffle = () => {
    log('shuffle');
    setField('skinTone', pick(SKIN_IDS));
    setField('hairStyle', pick(HAIRSTYLES).id);
    setField('hairColor', pick(HAIR_COLORS).id);
    setField('apparel', pick(OUTFITS).id);
    setField('apparelColor', pick([null, 'brand-green', 'violet', 'red', 'ocean', 'charcoal']));
  };

  const lines = Array.isArray(meta.heading) ? meta.heading : [meta.heading];

  return (
    <section
      aria-label="Avatar preview"
      className="relative flex flex-col items-center gap-[20px] overflow-hidden px-4 pb-8 pt-6 lg:block lg:h-full lg:min-h-[calc(877*var(--u))] lg:p-0"
      style={{ background: HERO_BG }}
    >
      {/* diagonal-line texture, 50% */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 h-[calc(922*var(--u))] w-[calc(1045*var(--u))] opacity-50 max-lg:inset-0 max-lg:h-full max-lg:w-full"
      >
        <defs>
          <pattern id="avatar-hex" width="55" height="48.5" patternUnits="userSpaceOnUse">
            <image href={hexA} x="0" y="0" width="55" height="48.5" />
            <image href={hexB} x="0" y="0" width="55" height="48.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#avatar-hex)" />
      </svg>

      {/* dashed ring + gold dots */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[calc(123*var(--u))] top-[calc(90*var(--u))] size-[calc(745*var(--u))] rounded-full max-lg:hidden"
      >
        <svg className="absolute inset-0 size-full overflow-visible" viewBox="0 0 745 745">
          <circle
            cx="372.5"
            cy="372.5"
            r="372"
            fill="none"
            stroke="#f3f1ea"
            strokeWidth="1"
            strokeDasharray="3 2"
          />
        </svg>
        <span className="absolute left-[calc(5*var(--u))] top-[calc(462*var(--u))] size-[calc(16*var(--u))] rounded-full border border-solid border-[#fef1e7] bg-[#c8951a]" />
        <span className="absolute left-[calc(655*var(--u))] top-[calc(129*var(--u))] size-[calc(16*var(--u))] rounded-full border border-solid border-[#fef1e7] bg-[#c8951a]" />
      </div>

      {/* sparkles */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-[calc(19*var(--u))] top-[calc(24*var(--u))] font-ui text-[20px] leading-[24px] text-[#ffd86b] max-lg:hidden"
      >
        ✦
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-[calc(893*var(--u))] top-[calc(35*var(--u))] font-ui text-[100px] leading-[122px] text-white/55 opacity-20 max-lg:hidden"
      >
        ✦
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-[calc(84*var(--u))] font-ui text-[100px] leading-[122px] text-[#387440] opacity-40 max-lg:hidden"
        style={{ top: `calc(${meta.sparkleBottom} * var(--u))` }}
      >
        ✦
      </span>

      {/* tag + heading (+ Playful sticker) */}
      <div className="relative z-10 flex flex-col items-start gap-[8px] self-start lg:absolute lg:left-[calc(60*var(--u))] lg:top-[calc(40*var(--u))]">
        <span className="inline-flex items-center rounded-full border border-solid border-[#e1eae2] bg-white px-[12px] py-[5px] font-sans text-[12px] font-medium leading-[20px] tracking-[0.2px] text-[#387440] shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
          {meta.tag}
        </span>
        <h1
          className="m-0 font-sans font-semibold text-white playful:font-heading max-lg:!text-[28px] max-lg:!leading-[34px]"
          style={{
            fontSize: meta.headingSize,
            lineHeight: `${meta.headingLine}px`,
            letterSpacing: meta.headingTracking,
            maxWidth: meta.nowrap ? undefined : meta.headingW,
            whiteSpace: meta.nowrap ? 'nowrap' : undefined,
          }}
        >
          {lines.map((l) => (
            <span key={l} className="block">
              {l}
            </span>
          ))}
        </h1>
      </div>
      <span
        aria-hidden="true"
        className="absolute z-10 hidden -rotate-[5deg] rounded-[8px] border-[1.2px] border-solid border-[#1c2a21] bg-[#ffd86b] px-[11px] py-[5px] font-sans text-[12px] font-bold leading-[14px] tracking-[0.4px] text-[#1c2a21] shadow-[2px_2px_0_#1c2a21] playful:lg:block"
        style={{
          left: `calc(${meta.sticker.x} * var(--u))`,
          top: 'calc(88 * var(--u))',
        }}
      >
        {meta.sticker.text}
      </span>

      {/* avatar showcase */}
      <div
        className="relative z-10 aspect-square w-[min(78vw,340px)] shrink-0 overflow-hidden rounded-full lg:absolute lg:left-[calc(176*var(--u))] lg:top-[calc(129*var(--u))] lg:w-[calc(640*var(--u))]"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, #387440 0%, rgba(255,255,255,0.15) 65%, rgba(255,255,255,0) 80%)',
        }}
      >
        <AvatarPreview className="!max-w-none [&_.aspect-square]:!bg-transparent [&_div[aria-hidden='true']]:!hidden" />
      </div>

      {/* controls: undo · username · shuffle */}
      <div className="relative z-10 flex items-center justify-center gap-[12px] lg:absolute lg:left-[calc(190*var(--u))] lg:top-[calc(793*var(--u))] lg:w-[calc(612*var(--u))]">
        <ControlButton
          label="Undo last change"
          onClick={() => {
            log('undo');
            undo();
          }}
        >
          <UndoIcon className="size-[16px]" />
        </ControlButton>
        <div
          className={classNames(
            'inline-flex min-h-[42px] items-center gap-[8px] rounded-[10px] border border-solid border-[#e8e8e4] bg-white px-[12px] py-[11px]',
            'shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)]',
            SHADOW_HARD
          )}
        >
          <span className="font-sans text-[15px] font-semibold leading-[19px] text-[#387440] playful:font-heading">
            {selection.username || 'KofiA_23'}
          </span>
          <button
            type="button"
            aria-label="Edit name"
            onClick={() => log('edit name (not drawn in Figma: inert)')}
            className="inline-grid min-h-[24px] min-w-[16px] cursor-pointer place-items-center border-0 bg-transparent p-0 text-[#387440]"
          >
            <EditNameIcon className="size-[16px]" />
          </button>
        </div>
        <ControlButton label="Shuffle avatar" onClick={shuffle}>
          <ShuffleIcon className="size-[16px]" />
        </ControlButton>
      </div>
    </section>
  );
};

export default AvatarHero;
