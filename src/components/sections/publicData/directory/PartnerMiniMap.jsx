import { REGION_PATHS, MAP_VIEWBOX } from '../map/ghanaMapGeometry.js';

/*
 * PartnerMiniMap — Figma "T8 · Ghana map · 16 regions" instance 8498:600 (220x321) in the partner page card "Where they work": a static
 * silhouette where the regions the partner works in are filled #387440 and the rest #efefea, white 1px borders, no labels, no interaction.
 * The shared GhanaMap 'mini' variant highlights ONE region; a partner works in several (and "All 16 regions"), so this draws the same
 * outlines (map/ghanaMapGeometry.js, placeholder geometry until the official GSS boundaries land) with a list of highlighted ids.
 * Props: regionIds (['northern', ...] or ['all']), label (accessible name), className.
 */

const PartnerMiniMap = ({ regionIds, label, className }) => {
  const all = regionIds.includes('all');
  return (
    <svg
      viewBox={MAP_VIEWBOX}
      role="img"
      aria-label={label}
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      {Object.entries(REGION_PATHS).map(([id, d]) => (
        <path
          key={id}
          d={d}
          fill={all || regionIds.includes(id) ? '#387440' : '#efefea'}
          stroke="#ffffff"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
};

export default PartnerMiniMap;
