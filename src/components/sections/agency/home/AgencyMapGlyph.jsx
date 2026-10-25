import { classNames } from '../../../../utils/classNames.js';
import { MAP_REGIONS_SAMPLE } from '../../publicData/map/data/mapData.js';
import { binForCount } from '../../publicData/map/mapBins.js';
import { MAP_VIEWBOX, REGION_PATHS } from '../../publicData/map/ghanaMapGeometry.js';

/*
 * AgencyMapGlyph — the small static Ghana map of the home snapshot (Figma "T8 · Ghana map · 16 regions" instance 8597:398354, 96 x 140): the Theme 8 outlines
 * (ghanaMapGeometry.js) filled by the Theme 8 talent-count bins (mapBins.js, counts from the Theme 8 sample data), 0.256 white strokes, no labels, no interaction.
 * Decorative: the numbers live in the text next to it. Props: className (size it with size-/w-/h-).
 */

const AgencyMapGlyph = ({ className }) => (
  <svg
    viewBox={MAP_VIEWBOX}
    aria-hidden="true"
    focusable="false"
    className={classNames('block h-auto', className)}
  >
    {MAP_REGIONS_SAMPLE.map((r) => (
      <path
        key={r.id}
        d={REGION_PATHS[r.id]}
        fill={binForCount(r.count).fill}
        stroke="#ffffff"
        strokeWidth="1"
      />
    ))}
  </svg>
);

export default AgencyMapGlyph;
