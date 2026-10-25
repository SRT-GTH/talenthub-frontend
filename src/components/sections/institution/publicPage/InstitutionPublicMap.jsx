import {
  MAP_HEIGHT,
  MAP_VIEWBOX,
  MAP_WIDTH,
  REGION_PATHS,
  REGION_READING_ORDER,
} from '../../publicData/map/ghanaMapGeometry.js';

/*
 * InstitutionPublicMap — static silhouette "T8 · Ghana map · 16 regions" 220x321 of Figma 8746:1771: every region #387440 with a 1.6 white stroke, as
 * drawn (the frame colours all 16 regions although the caption reads "Tamale · Northern Region"). Uses the Theme 8 outline geometry (placeholder until
 * the GSS shapes arrive). role="img" with a text label. Props: className, label.
 */
const InstitutionPublicMap = ({ className, label = 'Map of Ghana' }) => (
  <div className={className} style={{ aspectRatio: `${MAP_WIDTH} / ${MAP_HEIGHT}` }}>
    <svg viewBox={MAP_VIEWBOX} role="img" aria-label={label} className="block size-full">
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

export default InstitutionPublicMap;
