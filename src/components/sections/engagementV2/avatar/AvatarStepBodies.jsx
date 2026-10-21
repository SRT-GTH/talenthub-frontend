import { useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { useAvatarSelection } from '../../../../hooks/useAvatarSelection.js';
import alertIcon from '../../../../assets/engagement-v2/avatar/alert.svg';
import {
  APPAREL_SWATCHES,
  CAREER_PRESETS,
  DETAILS,
  EARRINGS,
  EYEWEAR,
  FONT_INTER,
  FONT_SPACE,
  FACIAL_HAIR,
  FITS,
  HAIRSTYLES,
  HAIR_COLORS,
  LIGHTING,
  OUTFITS,
  QUICK_SKIN,
  SKIN_SHADES,
  STYLE_PRESETS,
  STYLE_TILES,
  TINT_SWATCHES,
} from './avatarData.js';
import {
  NoneBody,
  OptionTile,
  SHADOW_HARD,
  SHADOW_SOFT,
  SectionHeader,
  Swatch,
  TileArt,
  TileGrid,
} from './AvatarPieces.jsx';

const log = debug('AvatarStepBodies');

/*
 * The five step bodies (the area under the tab row of the Figma "RIGHT — customiser panel"). Every pick is written to the shared
 * AvatarSelectionProvider (skinTone, hairStyle, eyewear, apparel …) so the layered preview and Career Buddy follow. Copy verbatim from
 * the nodes (Style 8285:3265, Skin 8285:5468, Hair 8285:6524, Extra 8285:7628, Outfit 8285:8765 and their Playful twins).
 */

const Block = ({ children, gap = 8 }) => (
  <div className="flex flex-col" style={{ gap }}>
    {children}
  </div>
);

/* ---------------------------------------------------------------- Style */
export const StyleBody = () => {
  const { selection, setField } = useAvatarSelection();
  const applyPreset = (id) => {
    log('style preset', id);
    setField('baseStyle', id);
    Object.entries(STYLE_PRESETS[id] ?? {}).forEach(([k, v]) => setField(k, v));
  };
  return (
    <div className="flex flex-col gap-[24px]">
      <Block gap={16}>
        <SectionHeader title="Choose a base style" meta="10 Options" />
        <div className="grid grid-cols-[repeat(auto-fill,minmax(64px,1fr))] gap-[8px] lg:grid-cols-[repeat(5,calc(97*var(--u)))] lg:justify-between lg:gap-x-0">
          {STYLE_TILES.map((s) => {
            const on = selection.baseStyle === s.id;
            return (
              <button
                key={s.id}
                type="button"
                role="radio"
                aria-checked={on}
                aria-label={s.label}
                onClick={() => applyPreset(s.id)}
                className={classNames(
                  'relative aspect-square w-full cursor-pointer overflow-hidden rounded-[16px] border border-solid p-0 lg:aspect-auto lg:h-[calc(97*var(--u))] lg:w-[calc(97*var(--u))]',
                  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
                  on
                    ? `border-[rgba(28,42,33,0.1)] bg-[#ebf1ec] ${SHADOW_SOFT} playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] ${SHADOW_HARD}`
                    : 'border-2 border-transparent bg-[#f8f8f4] hover:border-[#c1d4c4]'
                )}
              >
                <img
                  src={s.image}
                  alt=""
                  draggable="false"
                  className="absolute left-1/2 top-[22%] block aspect-square w-[66%] -translate-x-1/2 object-cover object-top"
                />
                {on ? (
                  <span
                    aria-hidden="true"
                    className="absolute right-[7px] top-[8px] inline-grid size-[16px] place-items-center rounded-full bg-[#387440] font-ui text-[9px] font-bold leading-[11px] text-white max-lg:size-[18px] max-lg:text-[12px]"
                  >
                    ✓
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </Block>
      <Block gap={16}>
        <SectionHeader title="Skin tone" meta="Quick Pick" />
        <div className="flex flex-wrap items-center gap-[20px] max-lg:gap-[12px]">
          {QUICK_SKIN.map((t) => (
            <Swatch
              key={t.id}
              color={t.color}
              label={t.label}
              selected={selection.skinTone === t.id}
              onClick={() => setField('skinTone', t.id)}
            />
          ))}
        </div>
      </Block>
    </div>
  );
};

/* ---------------------------------------------------------------- slider */
const FineSlider = ({
  value,
  onChange,
  min = -100,
  max = 100,
  trackClass,
  trackStyle,
  trackH,
  label,
}) => {
  const frac = (value - min) / (max - min);
  return (
    <div className="relative" style={{ height: 20 }}>
      <div
        aria-hidden="true"
        className={classNames('absolute left-0 right-0 rounded-full', trackClass)}
        style={{ top: (20 - trackH) / 2, height: trackH, ...trackStyle }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-0 size-[20px] -translate-x-1/2 rounded-full border border-solid border-[#387440] bg-white shadow-[0_2px_7px_rgba(42,87,48,0.15)] playful:border-[3px] playful:shadow-[0_4px_10px_rgba(42,87,48,0.3)]"
        style={{ left: `${frac * 100}%` }}
      />
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        aria-label={label}
        onChange={(e) => onChange(Number(e.target.value))}
        className="absolute inset-0 m-0 h-full w-full cursor-pointer opacity-0"
      />
    </div>
  );
};

const signed = (n) => (n >= 0 ? `+${n}` : `${n}`);

/* ---------------------------------------------------------------- Skin */
export const SkinBody = () => {
  const { selection, setField } = useAvatarSelection();
  const lightness = selection.lightness ?? 0;
  return (
    <div className="flex flex-col gap-[24px]">
      <div className="flex flex-col gap-[12px]">
        <Block>
          <SectionHeader title="Choose your shade" meta="12 shades" />
          <TileGrid>
            {SKIN_SHADES.map((s) => {
              const on = selection.skinTone === s.id;
              return (
                <OptionTile
                  key={s.id}
                  selected={on}
                  ariaLabel={s.label}
                  onClick={() => setField('skinTone', s.id)}
                  label={s.label}
                  labelStyle={{ ...FONT_INTER, fontWeight: on ? 700 : 600 }}
                >
                  <span
                    aria-hidden="true"
                    className="block size-[42px] rounded-full border-[3px] border-solid border-white shadow-[inset_0_-4px_6px_rgba(0,0,0,0.12)]"
                    style={{ background: s.color }}
                  />
                </OptionTile>
              );
            })}
          </TileGrid>
        </Block>
        <Block gap={12}>
          <SectionHeader title="Fine-tune (optional)" meta="+/- around base" tone="strong" />
          <div className="flex flex-col gap-[8px] rounded-[12px] border border-solid border-[#e2e8f0] bg-[#ebf1ec] p-[11px]">
            <div className="flex items-center justify-between">
              <span className="font-sans text-[12px] font-medium leading-[14px] text-[#334155] max-lg:text-[12px]">
                Lightness
              </span>
              <span
                className="inline-flex min-h-[22px] items-center rounded-full border border-solid border-[#e2e8f0] bg-white px-[10px] text-[12px] font-bold leading-[15px] text-[#387440]"
                style={FONT_SPACE}
              >
                {signed(lightness)}
              </span>
            </div>
            <FineSlider
              value={lightness}
              onChange={(v) => setField('lightness', v)}
              trackH={6}
              trackStyle={{
                background: 'linear-gradient(90deg,#ffe4c4 0%,#8b5a3c 50%,#2a1508 100%)',
              }}
              label="Lightness"
            />
          </div>
        </Block>
        <Block gap={12}>
          <SectionHeader title="Preview under lighting" meta="3 looks" tone="strong" />
          <div className="grid grid-cols-1 gap-[12px] sm:grid-cols-3 lg:grid-cols-[repeat(3,calc(194*var(--u)))] lg:justify-between lg:gap-x-0">
            {LIGHTING.map((l) => {
              const on = (selection.lighting ?? 'daylight') === l.id;
              return (
                <button
                  key={l.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  aria-label={`${l.label} ${l.sub}`}
                  onClick={() => setField('lighting', l.id)}
                  className={classNames(
                    'flex min-h-[74px] cursor-pointer flex-col items-start justify-start gap-[3px] rounded-[10px] border border-solid p-[11px] pt-[9px] text-left',
                    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
                    on ? 'border-[#387440] bg-[#ebf1ec]' : 'border-[#e8e8e4] bg-[#f8f8f4]'
                  )}
                >
                  <img
                    src={l.icon}
                    alt=""
                    draggable="false"
                    style={{ width: l.iconSize, height: l.iconSize }}
                  />
                  <span className="font-ui text-[12px] leading-[16px] max-lg:text-[12px]">
                    <span className="block font-semibold text-[#1c2a21]">{l.label}</span>
                    <span className="block font-normal text-[#70706e]">{l.sub}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </Block>
      </div>
      <Tip>
        <span className="font-ui font-bold text-[#2a5730]">
          Real talk: there’s no default here. Pick what feels like you.
        </span>
      </Tip>
    </div>
  );
};

const Tip = ({ children }) => (
  <div className="flex min-h-[58px] items-center gap-[8px] rounded-[10px] border border-solid border-[#c1d4c4] bg-[#ebf1ec] px-[10px] py-[13px] text-[11px] leading-[17px] max-lg:text-[12px]">
    <img src={alertIcon} alt="" draggable="false" className="size-[16px] shrink-0 self-start" />
    <p className="m-0 font-ui">{children}</p>
  </div>
);

/* ---------------------------------------------------------------- Hair */
const ColorRow = ({ items, current, onPick, size = 38 }) => (
  <div className="flex flex-wrap items-center gap-[10px]">
    {items.map((c) => (
      <Swatch
        key={c.id}
        color={c.color}
        label={c.label}
        size={size}
        selected={current === c.id}
        badge={c.dyed}
        onClick={() => onPick(c.id)}
      />
    ))}
  </div>
);

export const HairBody = () => {
  const { selection, setField } = useAvatarSelection();
  const volume = selection.hairVolumeLevel ?? 0;
  return (
    <div className="flex flex-col gap-[24px]">
      <div className="flex flex-col gap-[12px]">
        <Block>
          <SectionHeader title="Hairstyle" meta="12 styles · all textures welcome" />
          <TileGrid>
            {HAIRSTYLES.map((h) => (
              <OptionTile
                key={h.id}
                selected={selection.hairStyle === h.id}
                ariaLabel={h.label}
                label={h.label}
                onClick={() => setField('hairStyle', h.id)}
              >
                <TileArt src={h.image} art={h.art} />
              </OptionTile>
            ))}
          </TileGrid>
        </Block>
        <Block gap={12}>
          <SectionHeader title="Hair color" meta="9 colors · including dyed" tone="strong" />
          <ColorRow
            items={HAIR_COLORS}
            current={selection.hairColor}
            onPick={(id) => setField('hairColor', id)}
          />
        </Block>
        <Block gap={12}>
          <SectionHeader title="Volume" meta="Optional" tone="strong" />
          <div className="flex flex-col gap-[14px] rounded-[12px] border border-solid border-[rgba(226,232,240,0.5)] bg-[#ebf1ec] px-[17px] pb-[16px] pt-[14px]">
            <div className="flex items-center justify-between">
              <span className="font-sans text-[12px] font-semibold leading-[14px] text-[#334155] max-lg:text-[12px]">
                Volume / fullness
              </span>
              <span
                className="inline-flex min-h-[22px] items-center rounded-[4px] border border-solid border-[#e2e8f0] bg-white px-[10px] text-[12px] font-bold leading-[15px] text-[#387440]"
                style={FONT_SPACE}
              >
                {volume === 0 ? 'Medium' : signed(volume)}
              </span>
            </div>
            <FineSlider
              value={volume}
              onChange={(v) => setField('hairVolumeLevel', v)}
              trackH={8}
              trackClass="bg-[#e2e8f0]"
              label="Volume / fullness"
            />
          </div>
        </Block>
      </div>
      <Tip>
        <span className="font-ui font-bold text-[#2a5730]">Tips:</span>
        <span className="font-ui font-normal text-[#387440]">
          {' '}
          Hair updates pair with your skin tone live.{' '}
        </span>
        <span className="font-ui font-bold text-[#2a5730]">Locs, Braids</span>
        <span className="font-ui font-normal text-[#387440]"> and </span>
        <span className="font-ui font-bold text-[#2a5730]">Fade</span>
        <span className="font-ui font-normal text-[#387440]">
          . are the three most-picked styles in Ghana.
        </span>
      </Tip>
    </div>
  );
};

/* ---------------------------------------------------------------- Extras */
const ExtrasGroup = ({ title, meta, options, current, onPick, multi = false }) => (
  <Block>
    <SectionHeader title={title} meta={meta} />
    <TileGrid>
      {options.map((o) => {
        const on = current === o.id;
        return (
          <OptionTile
            key={o.id}
            selected={on}
            ariaLabel={o.label}
            pressedRole={multi ? 'checkbox' : 'radio'}
            label={o.image ? o.label : undefined}
            onClick={() => onPick(o.id)}
          >
            {o.image ? (
              <TileArt src={o.image} art={o.art} />
            ) : (
              <NoneBody sub={o.sub} selected={on} />
            )}
          </OptionTile>
        );
      })}
    </TileGrid>
  </Block>
);

export const ExtrasBody = () => {
  const { selection, setField } = useAvatarSelection();
  const tint = selection.eyewearTintColor;
  return (
    <div className="flex flex-col gap-[24px]">
      <div className="flex flex-col gap-[12px]">
        <ExtrasGroup
          title="Eyewear"
          meta="Pick one"
          options={EYEWEAR}
          current={selection.eyewear}
          onPick={(id) => setField('eyewear', id)}
        />
        <ExtrasGroup
          title="Facial hair"
          meta="Pick one"
          options={FACIAL_HAIR}
          current={selection.facialHair}
          onPick={(id) => setField('facialHair', id)}
        />
        <ExtrasGroup
          title="Earrings"
          meta="Pick one"
          options={EARRINGS}
          current={selection.earring}
          onPick={(id) => setField('earring', id)}
        />
        <ExtrasGroup
          title="Details · multi-select"
          meta="Pick any"
          options={DETAILS}
          multi
          current={selection.details}
          onPick={(id) => setField('details', selection.details === id ? null : id)}
        />
      </div>
      <Block gap={12}>
        <SectionHeader title="Accessory colour" meta="Earrings, glasses tint" tone="strong" />
        <ColorRow
          items={TINT_SWATCHES}
          current={tint}
          onPick={(id) => {
            log('accessory tint', id);
            setField('eyewearTintColor', id);
            setField('earringTintColor', id);
          }}
        />
      </Block>
    </div>
  );
};

/* ---------------------------------------------------------------- Outfit */
const PILL_SHELF = 'shadow-[0_4px_0_rgba(17,17,17,0.25)]';

export const OutfitBody = () => {
  const { selection, setField } = useAvatarSelection();
  const [, force] = useState(0);
  return (
    <div className="flex flex-col gap-[24px]">
      <div className="flex flex-col gap-[12px]">
        <Block>
          <SectionHeader title="Career presets" meta="12 fits · pick one" />
          <div className="flex flex-wrap gap-[8px]">
            {CAREER_PRESETS.map((p) => {
              const on = selection.careerPreset === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => {
                    log('career preset', p.id);
                    setField('careerPreset', on ? null : p.id);
                    force((n) => n + 1);
                  }}
                  className={classNames(
                    'inline-flex min-h-[37px] cursor-pointer items-center rounded-[14px] border-2 border-solid px-[15px] font-sans text-[12.5px] font-bold leading-[24px] tracking-[0.1px] text-[#1c2a21] max-lg:text-[12.5px]',
                    PILL_SHELF,
                    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
                    on ? 'border-[#387440] bg-[#ebf1ec]' : 'border-[rgba(28,42,33,0.3)] bg-white'
                  )}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </Block>
        <Block>
          <SectionHeader title="Top" meta="Pick one" />
          <TileGrid>
            {OUTFITS.map((o) => (
              <OptionTile
                key={o.id}
                selected={selection.apparel === o.id}
                ariaLabel={o.label}
                label={o.label}
                onClick={() => setField('apparel', o.id)}
              >
                <TileArt src={o.image} art={o.art} />
              </OptionTile>
            ))}
          </TileGrid>
        </Block>
        <div className="flex flex-wrap items-center justify-between gap-[8px]">
          <h3 className="m-0 font-sans text-[14px] font-semibold leading-[14px] tracking-[0.2px] text-[#595959]">
            Fit
          </h3>
          <div
            role="radiogroup"
            aria-label="Fit"
            className="flex items-center rounded-[8px] border border-solid border-[#e2e8f0] bg-[#f8fafc] lg:w-[calc(207*var(--u))] lg:justify-between lg:px-[17px]"
          >
            {FITS.map((f) => {
              const on = (selection.fit ?? 'regular') === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => setField('fit', f.id)}
                  className={classNames(
                    'inline-flex min-h-[29px] cursor-pointer items-center justify-center font-sans text-[12px] leading-[14px] max-lg:min-h-[32px] max-lg:px-3 max-lg:text-[12px]',
                    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
                    on
                      ? `rounded-[14px] border-2 border-solid border-[rgba(28,42,33,0.3)] bg-white px-[12px] font-bold leading-[24px] tracking-[0.1px] text-[#1c2a21] ${PILL_SHELF}`
                      : 'border-0 bg-transparent p-0 font-normal text-[#64748b]'
                  )}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <Block gap={12}>
        <SectionHeader title="Color" meta="Solid + traditional" tone="strong" />
        <div className="flex flex-wrap items-center gap-[10px]">
          {APPAREL_SWATCHES.map((c) => (
            <Swatch
              key={c.label}
              color={c.color}
              background={
                c.id === null
                  ? 'linear-gradient(45deg,#f59e0b 0 14%,#dc2626 14% 28%,#0f172a 28% 42%,#10b981 42% 100%)'
                  : undefined
              }
              label={c.label}
              size={32}
              border={2}
              selected={(selection.apparelColor ?? null) === c.id}
              onClick={() => setField('apparelColor', c.id)}
            />
          ))}
        </div>
      </Block>
    </div>
  );
};
