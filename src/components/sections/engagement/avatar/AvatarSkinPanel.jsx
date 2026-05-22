import { classNames } from '../../../../utils/classNames.js';
import {
  AvatarOptionTile,
  AvatarStatPill,
  AvatarSectionHeader,
  AvatarRangeSlider,
  AvatarHelperTip,
} from './avatarPrimitives.jsx';
import { useAvatarSelection } from '../../../../hooks/useAvatarSelection.js';
import { debug } from '../../../../utils/debug.js';

// Category tab icons — same PNG set used on the Style panel.
import styleIcon from '../../../../assets/engagement/style.png';
import skinIcon from '../../../../assets/engagement/skin.png';
import hairIcon from '../../../../assets/engagement/hair.png';
import extrasIcon from '../../../../assets/engagement/extras.png';
import outfitIcon from '../../../../assets/engagement/outfit.png';

const log = debug('AvatarSkinPanel');

/*
 * AvatarSkinPanel — the right-side panel on the Skin Tone step.
 * Source: Figma frame (Avatar — Pick your skin tone).
 *
 * Layout:
 *   ├─ header  "Pick your skin tone" + helper line
 *   ├─ stat pills row (same 4 pills as the Style panel)
 *   ├─ category tabs (Skin active)
 *   ├─ "Choose a base tone" + 12 tone tiles in a 6×2 grid
 *   ├─ "Fine-tune (optional)" — Lightness slider
 *   └─ "Preview under lighting" — 3 looks (Daylight / Studio / Golden hour)
 *       followed by a green helper tip ("Real talk: 67% of Ghanaian users
 *       pick Cocoa through Mahogany.")
 *
 * Selections live in AvatarSelectionProvider and persist across steps.
 */

// 12 skin-tone options — labels + hex colours, in Figma order.
const SKIN_TONES = [
  { id: 'soft-almond', color: '#F4D8B7', label: 'Soft Almond' },
  { id: 'warm-sand', color: '#E8C19A', label: 'Warm Sand' },
  { id: 'honey', color: '#C4855E', label: 'Honey' },
  { id: 'caramel', color: '#A4683F', label: 'Caramel' },
  { id: 'bronze', color: '#8B5638', label: 'Bronze' },
  { id: 'cocoa-light', color: '#7B4A30', label: 'Cocoa Light' },
  { id: 'cocoa', color: '#6B3F29', label: 'Cocoa' },
  { id: 'mahogany', color: '#583322', label: 'Mahogany' },
  { id: 'chestnut', color: '#48291B', label: 'Chestnut' },
  { id: 'espresso', color: '#3B2117', label: 'Espresso' },
  { id: 'deep-cocoa', color: '#2E1A11', label: 'Deep Cocoa' },
  { id: 'onyx', color: '#1B0D08', label: 'Onyx' },
];

// 3 lighting presets shown in the "Preview under lighting" row.
const LIGHTING_PRESETS = [
  {
    id: 'daylight',
    label: 'Daylight',
    sub: 'Default',
    bg: 'bg-[linear-gradient(135deg,#FFF7DB_0%,#FFE5A8_100%)]',
    emoji: '🌤️',
  },
  {
    id: 'studio',
    label: 'Studio',
    sub: 'Soft warm',
    bg: 'bg-[linear-gradient(135deg,#F5EFE6_0%,#D9C6A8_100%)]',
    emoji: '💡',
  },
  {
    id: 'golden-hour',
    label: 'Golden hour',
    sub: 'Cinematic',
    bg: 'bg-[linear-gradient(135deg,#FFC97A_0%,#E58B3A_100%)]',
    emoji: '🌅',
  },
];

// PNG tab buttons — same shape as on the Style panel. The Skin PNG is
// the active variant; clicking another tab updates state but the PNG
// itself doesn't change (no per-tab active variants in the asset set).
const CATEGORY_TABS = [
  { id: 'style', label: 'Style', image: styleIcon },
  { id: 'skin', label: 'Skin', image: skinIcon },
  { id: 'hair', label: 'Hair', image: hairIcon },
  { id: 'extras', label: 'Extras', image: extrasIcon },
  { id: 'outfit', label: 'Outfit', image: outfitIcon },
];

const CategoryTabButton = ({ image, label, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    aria-label={label}
    className={classNames(
      'inline-flex items-center justify-center rounded-pill bg-transparent border-0 p-0',
      'transition-[transform,opacity] duration-150',
      'hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
      active ? 'opacity-100' : 'opacity-80 hover:opacity-100'
    )}
  >
    <img
      src={image}
      alt=""
      aria-hidden="true"
      draggable="false"
      className="block h-[clamp(34px,3vw,42px)] w-auto select-none"
    />
  </button>
);

// Coloured circle that fills a tile — used inside AvatarOptionTile for
// each of the 12 tones.
const ToneSwatchInTile = ({ color }) => (
  <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center p-2">
    <span className="block size-full rounded-full" style={{ backgroundColor: color }} />
  </span>
);

// One lighting-preset tile — a small card with the preset's tint as the
// background and the emoji + label inside.
const LightingTile = ({ preset, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={selected}
    aria-label={preset.label}
    className={classNames(
      'group relative flex min-w-[120px] flex-1 flex-col items-start gap-1 rounded-xl p-3',
      'transition-[border-color,box-shadow,transform] duration-150 ease-out',
      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
      preset.bg,
      selected
        ? 'border-[1.5px] border-brand-green shadow-[0_2px_6px_-1px_rgba(56,116,64,0.18)]'
        : 'border border-border-default/40 hover:border-brand-green-light-active'
    )}
  >
    <span aria-hidden="true" className="text-[20px] leading-none">
      {preset.emoji}
    </span>
    <span className="font-sans font-semibold text-[13px] leading-4 tracking-[0.1px] text-content-primary">
      {preset.label}
    </span>
    <span className="font-sans text-[11px] leading-4 tracking-[0.2px] text-neutral-darker">
      {preset.sub}
    </span>
  </button>
);

const AvatarSkinPanel = ({ activeTab = 'skin', onTabSelect, className }) => {
  log('render');
  const { selection, setField } = useAvatarSelection();

  return (
    <div className={classNames('flex flex-col gap-6', className)}>
      {/* Header */}
      <header>
        <h2 className="font-display text-[clamp(22px,2.2vw,28px)] leading-[1.1] tracking-[-0.2px] text-content-primary">
          Pick your skin tone
        </h2>
        <p className="mt-1 font-sans text-[13px] leading-5 tracking-[0.2px] text-neutral-darker">
          Select a tone — preview updates instantly on the left.
        </p>
      </header>

      {/* Stat pills */}
      <div className="flex flex-wrap items-center gap-2">
        <AvatarStatPill count="24" label="styles" />
        <AvatarStatPill count="12" label="Skin Tones" />
        <AvatarStatPill count="18" label="Hairstyles" />
        <AvatarStatPill count="14" label="Extras" />
      </div>

      {/* Category tabs */}
      <nav aria-label="Customisation categories" className="flex flex-wrap items-center gap-2">
        {CATEGORY_TABS.map((tab) => (
          <CategoryTabButton
            key={tab.id}
            image={tab.image}
            label={tab.label}
            active={tab.id === activeTab}
            onClick={() => onTabSelect?.(tab.id)}
          />
        ))}
      </nav>

      {/* 12 base-tone tiles in a 6×2 grid */}
      <section className="flex flex-col gap-3">
        <AvatarSectionHeader title="Choose a base tone" meta="12 Options" />
        <div className="grid grid-cols-6 gap-2">
          {SKIN_TONES.map((tone) => (
            <AvatarOptionTile
              key={tone.id}
              selected={selection.skinTone === tone.id}
              onClick={() => setField('skinTone', tone.id)}
              ariaLabel={tone.label}
              label={tone.label}
            >
              <ToneSwatchInTile color={tone.color} />
            </AvatarOptionTile>
          ))}
        </div>
      </section>

      {/* Fine-tune slider */}
      <section className="flex flex-col gap-3">
        <AvatarSectionHeader title="Fine-tune (optional)" meta="+/− around base" />
        <AvatarRangeSlider
          label="Lightness"
          value={selection.lightness ?? 0}
          min={-100}
          max={100}
          onChange={(v) => setField('lightness', v)}
          rightSlot={
            <span className="font-semibold text-content-primary">
              {(selection.lightness ?? 0) > 0
                ? `+${selection.lightness}`
                : (selection.lightness ?? 0)}
            </span>
          }
        />
      </section>

      {/* Lighting presets */}
      <section className="flex flex-col gap-3">
        <AvatarSectionHeader title="Preview under lighting" meta="3 looks" />
        <div className="flex flex-wrap items-stretch gap-2">
          {LIGHTING_PRESETS.map((preset) => (
            <LightingTile
              key={preset.id}
              preset={preset}
              selected={selection.lighting === preset.id}
              onClick={() => setField('lighting', preset.id)}
            />
          ))}
        </div>
      </section>

      {/* Helper tip */}
      <AvatarHelperTip>
        <span className="font-semibold">Real talk:</span> 67% of Ghanaian users pick{' '}
        <span className="font-semibold">Cocoa</span> through{' '}
        <span className="font-semibold">Mahogany</span>. This palette was built for us, not adapted
        from somewhere else.
      </AvatarHelperTip>
    </div>
  );
};

export default AvatarSkinPanel;
