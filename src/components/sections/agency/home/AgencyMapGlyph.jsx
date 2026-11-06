import { classNames } from '../../../../utils/classNames.js';
import { binForCount } from '../../publicData/map/mapBins.js';
import { MAP_VIEWBOX, REGION_PATHS } from '../../publicData/map/ghanaMapGeometry.js';

/*
 * AgencyMapGlyph — the small static Ghana map of the home snapshot (Figma "T8 · Ghana map · 16 regions" instance 8597:398354, 96 x 140): the Theme 8 outlines
 * (ghanaMapGeometry.js) filled by the Theme 8 talent-count bins (mapBins.js) of the live counts, 0.256 white strokes, no labels, no interaction.
 * Decorative: the numbers live in the text next to it. Without counts every region gets the lightest fill.
 * Props: regions ([{ id, count }], GET /agency/home → national.regionCounts), className (size it with size-/w-/h-).
 */

const NEUTRAL = '#e1eae2';

const AgencyMapGlyph = ({ regions = [], className }) => {
  const countOf = new Map(regions.map((r) => [r.id, r.count]));
  return (
    <svg
      viewBox={MAP_VIEWBOX}
      aria-hidden="true"
      focusable="false"
      className={classNames('block h-auto', className)}
    >
      {Object.keys(REGION_PATHS).map((id) => (
        <path
          key={id}
          d={REGION_PATHS[id]}
          fill={countOf.has(id) ? binForCount(countOf.get(id)).fill : NEUTRAL}
          stroke="#ffffff"
          strokeWidth="1"
        />
      ))}
    </svg>
  );
};

export default AgencyMapGlyph;
