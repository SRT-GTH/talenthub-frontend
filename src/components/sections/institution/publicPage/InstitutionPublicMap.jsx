import {
  MAP_HEIGHT,
  MAP_VIEWBOX,
  MAP_WIDTH,
  REGION_PATHS,
  REGION_READING_ORDER,
} from '../../publicData/map/ghanaMapGeometry.js';
import { MAP_MINI_BASE_FILL, MAP_MINI_HIGHLIGHT_FILL } from '../../publicData/map/mapBins.js';

/*
 * InstitutionPublicMap — "T8 · Ghana map · 16 regions" 220x321 of Figma 8746:1771 with a 1.6 white stroke. The school's own region is filled
 * dark (the Theme 8 zoomed-map colours) and the rest light, so the map matches the "Town · Region" caption; with no known region every region is
 * #387440 as drawn. Uses the Theme 8 outline geometry. role="img" with a text label. Props: className, label, highlight (region id).
 */
const InstitutionPublicMap = ({ className, label = 'Map of Ghana', highlight = null }) => {
  const known = Boolean(highlight && REGION_PATHS[highlight]);
  return (
    <div className={className} style={{ aspectRatio: `${MAP_WIDTH} / ${MAP_HEIGHT}` }}>
      <svg viewBox={MAP_VIEWBOX} role="img" aria-label={label} className="block size-full">
        {REGION_READING_ORDER.map((id) => (
          <path
            key={id}
            d={REGION_PATHS[id]}
            fill={
              !known ? '#387440' : id === highlight ? MAP_MINI_HIGHLIGHT_FILL : MAP_MINI_BASE_FILL
            }
            stroke="#ffffff"
            strokeWidth="1.6"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
    </div>
  );
};

export default InstitutionPublicMap;
