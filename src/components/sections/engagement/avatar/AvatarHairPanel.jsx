import { classNames } from '../../../../utils/classNames.js';
import {
  AvatarOptionTile,
  AvatarColorSwatch,
  AvatarStatPill,
  AvatarSectionHeader,
  AvatarRangeSlider,
  AvatarHelperTip,
} from './avatarPrimitives.jsx';
import AvatarCategoryTabs from './AvatarCategoryTabs.jsx';
import { useAvatarSelection } from '../../../../hooks/useAvatarSelection.js';
import { debug } from '../../../../utils/debug.js';

// 12 hairstyle tiles — Figma export order (firsthairstyle → twelvethhairstyle).
import hair1 from '../../../../assets/engagement/firsthairstyle.svg';
import hair2 from '../../../../assets/engagement/secondhairstyle.svg';
import hair3 from '../../../../assets/engagement/thirdhairstyle.svg';
import hair4 from '../../../../assets/engagement/fourthhairstyle.svg';
import hair5 from '../../../../assets/engagement/fifthhairstyle.svg';
import hair6 from '../../../../assets/engagement/sixthhairstyle.svg';
import hair7 from '../../../../assets/engagement/seventhhairstyle.svg';
import hair8 from '../../../../assets/engagement/eighthhairstyle.svg';
import hair9 from '../../../../assets/engagement/ninethhairstyle.svg';
import hair10 from '../../../../assets/engagement/tenthhairstyle.svg';
import hair11 from '../../../../assets/engagement/eleventhhairstyle.svg';
import hair12 from '../../../../assets/engagement/twelvethhairstyle.svg';

// Fashion-tone SVG swatches — used in the Hair colour row in place of
// the last three flat-colour swatches. Each is a designer ring SVG
// (blue / pink / green) for the "do something bold" hair colours.
import blueTone from '../../../../assets/engagement/bluetone.svg';
import pinkTone from '../../../../assets/engagement/pinktone.svg';
import greenTone from '../../../../assets/engagement/greentone.svg';

const log = debug('AvatarHairPanel');

/*
 * AvatarHairPanel — the right-side panel on the Hair step.
 * Source: Figma frame (Avatar — Crown Energy).
 *
 * Layout:
 *   ├─ header  "Crown Energy" + helper line
 *   ├─ stat pills row (same 4 pills as the other panels)
 *   ├─ category tabs (Hair active)
 *   ├─ "Choose a hairstyle" + 12 hairstyle tiles in a 6×2 grid
 *   ├─ "Hair colour" + 9 round colour swatches
 *   ├─ "Volume" slider
 *   └─ helper tip
 *
 * Selections live in AvatarSelectionProvider and persist across steps.
 */

// 12 hairstyles in strict positional order (first → twelvth). Labels
// match the Figma reference (Box Braids → Onyx).
const HAIRSTYLES = [
  { id: 'hair-1', label: 'Box Braids', image: hair1 },
  { id: 'hair-2', label: 'Cornrows', image: hair2 },
  { id: 'hair-3', label: 'Afro', image: hair3 },
  { id: 'hair-4', label: 'Buzz Cut', image: hair4 },
  { id: 'hair-5', label: 'Fade', image: hair5 },
  { id: 'hair-6', label: 'Twists', image: hair6 },
  { id: 'hair-7', label: 'Locs', image: hair7 },
  { id: 'hair-8', label: 'Hijab', image: hair8 },
  { id: 'hair-9', label: 'Kente Wrap', image: hair9 },
  { id: 'hair-10', label: 'Long Curly', image: hair10 },
  { id: 'hair-11', label: 'Bald', image: hair11 },
  { id: 'hair-12', label: 'Onyx', image: hair12 },
];

// 9 hair "colour" swatches — first 6 are natural shades (flat colour
// swatches); last 3 are fashion shades rendered via designer ring SVGs
// (blue / pink / green) so they read visually distinct from the
// natural row. AvatarColorSwatch picks the right render path based on
// whether `color` or `image` is set.
const HAIR_COLORS = [
  { id: 'black', color: '#0F0F0F', label: 'Black' },
  { id: 'dark-brown', color: '#3B2417', label: 'Dark Brown' },
  { id: 'brown', color: '#6B3F23', label: 'Brown' },
  { id: 'auburn', color: '#8C4A2A', label: 'Auburn' },
  { id: 'chestnut', color: '#A66332', label: 'Chestnut' },
  { id: 'honey', color: '#C99066', label: 'Honey' },
  { id: 'blue-tone', image: blueTone, label: 'Blue Tone' },
  { id: 'pink-tone', image: pinkTone, label: 'Pink Tone' },
  { id: 'green-tone', image: greenTone, label: 'Green Tone' },
];

// Tile body: render the designer hairstyle SVG centred at a fixed
// visible size (size-10 = 40px) so every tile shows the icon at the
// same on-screen size regardless of the source SVG's intrinsic
// dimensions. `object-contain` preserves aspect.
const HairstyleVisual = ({ image, alt }) => (
  <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
    <img src={image} alt={alt} className="block size-10 object-contain" draggable="false" />
  </span>
);

const AvatarHairPanel = ({ activeTab = 'hair', onTabSelect, className }) => {
  log('render');
  const { selection, setField } = useAvatarSelection();

  return (
    <div className={classNames('flex flex-col gap-[clamp(12px,1.5vw,24px)]', className)}>
      {/* Header */}
      <header>
        <h2 className="font-display text-[clamp(22px,2.2vw,28px)] leading-[1.1] tracking-[-0.2px] text-content-primary">
          Crown energy
        </h2>
        <p className="mt-1 font-sans text-[13px] leading-5 tracking-[0.2px] text-neutral-darker">
          Pick a hairstyle — preview updates instantly on the left.
        </p>
      </header>

      {/* Stat pills */}
      <div className="flex flex-wrap items-center gap-2">
        <AvatarStatPill count="24" label="styles" />
        <AvatarStatPill count="12" label="Skin Tones" />
        <AvatarStatPill count="18" label="Hairstyles" />
        <AvatarStatPill count="14" label="Extras" />
      </div>

      {/* Category tabs — shared 5-pill row. */}
      <AvatarCategoryTabs activeTab={activeTab} onTabSelect={onTabSelect} />

      {/* 12 hairstyle tiles in a 6×2 grid */}
      <section className="flex flex-col gap-3">
        <AvatarSectionHeader title="Choose a hairstyle" meta="12 Options" />
        <div className="grid grid-cols-6 gap-2">
          {HAIRSTYLES.map((style) => (
            <AvatarOptionTile
              key={style.id}
              selected={selection.hairStyle === style.id}
              onClick={() => setField('hairStyle', style.id)}
              ariaLabel={style.label}
              label={style.label}
            >
              <HairstyleVisual image={style.image} alt={style.label} />
            </AvatarOptionTile>
          ))}
        </div>
      </section>

      {/* Hair colour swatches */}
      <section className="flex flex-col gap-3">
        <AvatarSectionHeader title="Hair colour" meta="9 Options" />
        <div className="flex flex-wrap items-center gap-2.5">
          {HAIR_COLORS.map((shade) => (
            <AvatarColorSwatch
              key={shade.id}
              color={shade.color}
              image={shade.image}
              selected={selection.hairColor === shade.id}
              onClick={() => setField('hairColor', shade.id)}
              ariaLabel={shade.label}
            />
          ))}
        </div>
      </section>

      {/* Volume slider */}
      <section className="flex flex-col gap-3">
        <AvatarSectionHeader title="Volume" meta="Fine-tune" />
        <AvatarRangeSlider
          label="Volume"
          value={selection.hairVolumeLevel ?? 0}
          min={-100}
          max={100}
          onChange={(v) => setField('hairVolumeLevel', v)}
          rightSlot={
            <span className="font-semibold text-content-primary">
              {(selection.hairVolumeLevel ?? 0) > 0
                ? `+${selection.hairVolumeLevel}`
                : (selection.hairVolumeLevel ?? 0)}
            </span>
          }
        />
      </section>

      {/* Helper tip */}
      <AvatarHelperTip>
        <span className="font-semibold">Tip:</span> Locs, fades, and natural curls render
        beautifully under all three lighting presets — pick what feels like you, not what
        photographs easiest.
      </AvatarHelperTip>
    </div>
  );
};

export default AvatarHairPanel;
