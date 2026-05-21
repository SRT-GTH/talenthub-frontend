import { classNames } from '../../../../utils/classNames.js';
import {
  AvatarOptionTile,
  AvatarColorSwatch,
  AvatarCategoryTab,
  AvatarStatPill,
  AvatarSectionHeader,
} from './avatarPrimitives.jsx';
import { useAvatarSelection } from '../../../../hooks/useAvatarSelection.js';
import { debug } from '../../../../utils/debug.js';

const log = debug('AvatarStylePanel');

/*
 * AvatarStylePanel — the right-side panel on the Style step.
 * Source: Figma frame (Avatar — Customise your look).
 *
 * Layout:
 *   ├─ header  "Customise your look" + helper line
 *   ├─ stat pills row (24 styles · 12 Skin Tones · 18 Hairstyles · 14 Extras)
 *   ├─ category tabs (Style active · Skin · Hair · Extras · Outfit)
 *   ├─ "Choose a base style" + "10 Options"  → 10 tiles in a 5x2 grid
 *   └─ "Skin tone" + "Quick Pick"            → 8 round swatches
 *
 * Selections live in the AvatarSelectionProvider so they persist across
 * step pages. The category tabs are visual-only for now — clicking them
 * doesn't navigate yet (we'll wire that once all 5 panels are built).
 */

// 10 base style options — each is a colour combo (skin / hair / outfit)
// rendered into a simple silhouette inside the tile. Real per-style art
// drops in here later via an `image` field.
const BASE_STYLES = [
  { id: 'style-1', skin: '#9C6F4E', hair: '#1A0F0D', outfit: '#1F6A2A' }, // green sweater
  { id: 'style-2', skin: '#7E4F38', hair: '#2A1410', outfit: '#D63D7A' }, // pink
  { id: 'style-3', skin: '#9C6F4E', hair: '#2A1410', outfit: '#7B4DD6' }, // purple (with hijab vibe)
  { id: 'style-4', skin: '#8C5E40', hair: '#1A0F0D', outfit: '#94C73E' }, // lime green
  { id: 'style-5', skin: '#6B4530', hair: '#1A0F0D', outfit: '#E68A1F' }, // orange
  { id: 'style-6', skin: '#9C6F4E', hair: '#D6A02C', outfit: '#1F6A2A' }, // gold hair
  { id: 'style-7', skin: '#7E4F38', hair: '#2A1410', outfit: '#E84B7C' }, // hot pink
  { id: 'style-8', skin: '#7E4F38', hair: '#1A0F0D', outfit: '#6E3FC9' }, // purple top
  { id: 'style-9', skin: '#9C6F4E', hair: '#1A0F0D', outfit: '#D03A4A' }, // red
  { id: 'style-10', skin: '#8C5E40', hair: '#1A0F0D', outfit: '#3CA0E0' }, // blue
];

// 8 skin tones — round swatches under the style grid.
const SKIN_TONES = [
  { id: 'soft-almond', color: '#F2D7B6', label: 'Soft Almond' },
  { id: 'warm-sand', color: '#E8C098', label: 'Warm Sand' },
  { id: 'honey', color: '#C58F66', label: 'Honey' },
  { id: 'caramel', color: '#A77244', label: 'Caramel' },
  { id: 'bronze', color: '#8C5E40', label: 'Bronze' },
  { id: 'cocoa-light', color: '#7E4F38', label: 'Cocoa Light' },
  { id: 'cocoa', color: '#6B4530', label: 'Cocoa' },
  { id: 'mahogany', color: '#54392A', label: 'Mahogany' },
];

// Simple silhouette used inside each style tile — a head circle on top of
// a V-neck body. Colours come from the BASE_STYLES entry.
const StyleSilhouette = ({ skin, hair, outfit }) => (
  <span aria-hidden="true" className="absolute inset-0 flex items-end justify-center pb-0">
    <svg viewBox="0 0 64 64" className="size-full" preserveAspectRatio="xMidYMax meet">
      {/* Body / outfit */}
      <path d="M6 60 Q 6 38 18 38 L 26 44 L 32 50 L 38 44 L 46 38 Q 58 38 58 60 Z" fill={outfit} />
      {/* V-neck darker accent */}
      <path d="M26 44 L 32 50 L 38 44 L 32 42 Z" fill="rgba(0,0,0,0.18)" />
      {/* Head */}
      <circle cx="32" cy="28" r="13" fill={skin} />
      {/* Hair (top half cap) */}
      <path
        d="M19 28 Q 19 13 32 13 Q 45 13 45 28 L 45 24 Q 38 18 32 18 Q 26 18 19 24 Z"
        fill={hair}
      />
    </svg>
  </span>
);

// Tab icons — small, schematic. Stand-ins for the Figma's bespoke icons
// until the design-system icon set lands.
const TshirtIcon = ({ className }) => (
  <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M5 2L3 4l1.5 1.5L5 5v9h6V5l.5.5L13 4l-2-2-2 1H7L5 2z" />
  </svg>
);
const CircleIcon = ({ className }) => (
  <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className={className}>
    <circle cx="8" cy="8" r="6" />
  </svg>
);
const HairIcon = ({ className }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    aria-hidden="true"
    className={className}
  >
    <path d="M3 13 Q 3 4 8 4 Q 13 4 13 13" />
    <circle cx="8" cy="9" r="3" />
  </svg>
);
const GlassesIcon = ({ className }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    aria-hidden="true"
    className={className}
  >
    <circle cx="4.5" cy="9" r="2.5" />
    <circle cx="11.5" cy="9" r="2.5" />
    <path d="M7 9 H 9" />
  </svg>
);
const HangerIcon = ({ className }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    aria-hidden="true"
    className={className}
  >
    <path d="M8 6 V 4 a 1.5 1.5 0 1 1 1.5 1.5" />
    <path d="M8 6 L 2 12 H 14 L 8 6 Z" />
  </svg>
);

const CATEGORY_TABS = [
  { id: 'style', label: 'Style', icon: <TshirtIcon className="size-full" /> },
  { id: 'skin', label: 'Skin', icon: <CircleIcon className="size-full" /> },
  { id: 'hair', label: 'Hair', icon: <HairIcon className="size-full" /> },
  { id: 'extras', label: 'Extras', icon: <GlassesIcon className="size-full" /> },
  { id: 'outfit', label: 'Outfit', icon: <HangerIcon className="size-full" /> },
];

const AvatarStylePanel = ({ activeTab = 'style', onTabSelect, className }) => {
  log('render');
  const { selection, setField } = useAvatarSelection();

  return (
    <div className={classNames('flex flex-col gap-6', className)}>
      {/* Header */}
      <header>
        <h2 className="font-display text-[clamp(22px,2.2vw,28px)] leading-[1.1] tracking-[-0.2px] text-content-primary">
          Customise your look
        </h2>
        <p className="mt-1 font-sans text-[13px] leading-5 tracking-[0.2px] text-neutral-darker">
          Select a style tile — preview updates instantly on the left.
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
          <AvatarCategoryTab
            key={tab.id}
            active={tab.id === activeTab}
            icon={tab.icon}
            label={tab.label}
            onClick={() => onTabSelect?.(tab.id)}
          />
        ))}
      </nav>

      {/* Base style grid */}
      <section className="flex flex-col gap-3">
        <AvatarSectionHeader title="Choose a base style" meta="10 Options" />
        <div className="grid grid-cols-5 gap-2">
          {BASE_STYLES.map((style) => (
            <AvatarOptionTile
              key={style.id}
              selected={selection.baseStyle === style.id}
              onClick={() => setField('baseStyle', style.id)}
              ariaLabel={`Base style ${style.id}`}
            >
              <StyleSilhouette skin={style.skin} hair={style.hair} outfit={style.outfit} />
            </AvatarOptionTile>
          ))}
        </div>
      </section>

      {/* Skin tone swatch row */}
      <section className="flex flex-col gap-3">
        <AvatarSectionHeader title="Skin tone" meta="Quick Pick" />
        <div className="flex flex-wrap items-center gap-2.5">
          {SKIN_TONES.map((tone) => (
            <AvatarColorSwatch
              key={tone.id}
              color={tone.color}
              selected={selection.skinTone === tone.id}
              onClick={() => setField('skinTone', tone.id)}
              ariaLabel={tone.label}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default AvatarStylePanel;
