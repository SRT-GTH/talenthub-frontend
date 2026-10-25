import {
  MAP_HEIGHT,
  MAP_VIEWBOX,
  MAP_WIDTH,
  REGION_PATHS,
  REGION_READING_ORDER,
} from '../../publicData/map/ghanaMapGeometry.js';

/*
 * AgencyPublicMap — static silhouette "T8 · Ghana map · 16 regions" 220x321 of Figma 8611:3605: every region #387440 with a 1.6 white stroke (the agency
 * works in all 16). Uses the Theme 8 outline geometry (placeholder until the GSS shapes arrive). role="img" with a text label.
 */
const AgencyPublicMap = ({ className }) => (
  <div className={className} style={{ aspectRatio: `${MAP_WIDTH} / ${MAP_HEIGHT}` }}>
    <svg
      viewBox={MAP_VIEWBOX}
      role="img"
      aria-label="Map of Ghana: the agency works in all 16 regions"
      className="block size-full"
    >
      {REGION_READING_ORDER.map((id) => (
        <path
          key={id}
          d={REGION_PATHS[id]}
          fill="#387440"
          stroke="#ffffff"
          strokeWidth="1.6"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  </div>
);

export default AgencyPublicMap;
