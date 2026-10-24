import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import { formatCount } from '../publicDataFormat.js';
import GhanaMap from '../map/GhanaMap.jsx';
import { REGION_PATHS } from '../map/ghanaMapGeometry.js';
import PublicCard from '../ui/PublicCard.jsx';
import { GA_ZOOM } from './data/regionsData.js';
import { bubbleSize, pathBounds, spiralOffset } from './regionsGeometry.js';

const log = debug('DistrictZoomMap');

/*
 * DistrictZoomMap — the "Zoomed map" card of the region page (Figma 8493:1779, 700x503) and the "Where talents are in …" card of the district page.
 * Inside: the 652x420 "zoom map" (#fbfbf8, r16): the region outline (fill #ebf1ec, 2px #6ca271), one bubble per district at its capital
 * (fill #387440 @ 85 %, 1.5px white; the district being viewed #224626; diameter follows the talents; labels 11/13 600 for the big ones),
 * the 84x123 national silhouette top-right (the region in #224626) and the footnote bottom-left.
 * ⚠️ PLACEHOLDER GEOMETRY: the Greater Accra layout is taken from the Figma frame; for the other regions the outline comes from the national map export and
 * the bubbles are spread around its centre (⚠️ ASSUMPTION) until the GSS district boundary files arrive (footnote copy, verbatim).
 * Every bubble is a link to its district (name + talents as the accessible name); the district table beside the map is the text equivalent.
 * Props: regionId, map { title, aside, markers, highlightId, districtTo(id) }, loading (outline + silhouette only, no bubbles).
 */

const W = GA_ZOOM.width;
const H = GA_ZOOM.height;
const BUBBLE = '#387440';
const BUBBLE_ACTIVE = '#224626';

const useLayout = (regionId, markers) =>
  useMemo(() => {
    const max = Math.max(1, ...markers.map((m) => m.talents));
    if (regionId === 'greater-accra') {
      return {
        outline: { kind: 'ga' },
        bubbles: markers.map((m) => ({
          ...m,
          cx: m.marker.x + m.marker.d / 2,
          cy: m.marker.y + m.marker.d / 2,
          r: m.marker.d / 2,
          label: m.label ? { x: m.label.x, y: m.label.y + 10 } : null,
        })),
      };
    }
    const path = REGION_PATHS[regionId];
    const b = pathBounds(path);
    const k = Math.min((W - 140) / b.w, (H - 110) / b.h);
    const ox = (W - b.w * k) / 2 - b.minX * k;
    const oy = (H - b.h * k) / 2 - b.minY * k;
    const cx0 = ox + ((b.minX + b.maxX) / 2) * k;
    const cy0 = oy + ((b.minY + b.maxY) / 2) * k;
    const reach = Math.min(b.w * k, b.h * k) * 0.42;
    return {
      outline: { kind: 'region', path, transform: `translate(${ox} ${oy}) scale(${k})` },
      bubbles: markers.map((m, i) => {
        const d = bubbleSize(m.talents, max);
        const { dx, dy } = spiralOffset(
          i,
          Math.max(18, reach / Math.sqrt(Math.max(markers.length, 2)))
        );
        return {
          ...m,
          cx: cx0 + dx,
          cy: cy0 + dy,
          r: d / 2,
          label: i < 3 ? { x: cx0 + dx + d / 2 + 4, y: cy0 + dy + 4 } : null,
        };
      }),
    };
  }, [regionId, markers]);

const DistrictZoomMap = ({ regionId, map, loading = false }) => {
  const layout = useLayout(regionId, map.markers);
  log('render', { regionId, markers: map.markers.length, loading });
  return (
    <PublicCard
      id={`zoom-${map.highlightId ?? regionId}`}
      title={map.title}
      hint={map.aside}
      loading={loading}
      className="min-w-0"
      bodyClassName="px-[24px] pb-[24px]"
    >
      <div
        className="relative mx-auto w-full max-w-[652px] overflow-hidden rounded-[16px] bg-[#fbfbf8]"
        style={{ aspectRatio: `${W} / ${H}` }}
      >
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="absolute inset-0 block size-full"
          role="group"
          aria-label={map.title}
          focusable="false"
        >
          {layout.outline.kind === 'ga' ? (
            <svg
              x={GA_ZOOM.outline.x}
              y={GA_ZOOM.outline.y}
              width={GA_ZOOM.outline.w}
              height={GA_ZOOM.outline.h}
              viewBox={`0 0 ${GA_ZOOM.outline.w} ${GA_ZOOM.outline.h}`}
              aria-hidden="true"
            >
              <path d={GA_ZOOM.outline.d} fill="#EBF1EC" stroke="#6CA271" strokeWidth="2.0012" />
            </svg>
          ) : (
            <g transform={layout.outline.transform} aria-hidden="true">
              <path
                d={layout.outline.path}
                fill="#EBF1EC"
                stroke="#6CA271"
                strokeWidth="2"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            </g>
          )}
          {!loading &&
            [...layout.bubbles]
              .sort((a, b) => b.r - a.r)
              .map((b) => {
                const active = b.id === map.highlightId;
                return (
                  <Link
                    key={b.id}
                    to={map.districtTo(b.id)}
                    aria-label={`${b.name}, ${formatCount(b.talents)} talents`}
                    aria-current={active ? 'page' : undefined}
                    className="group outline-none"
                  >
                    <circle
                      cx={b.cx}
                      cy={b.cy}
                      r={b.r + 4}
                      fill="none"
                      stroke="#2a78d6"
                      strokeWidth="3"
                      className="opacity-0 group-focus-visible:opacity-100"
                    />
                    <circle
                      cx={b.cx}
                      cy={b.cy}
                      r={b.r}
                      fill={active ? BUBBLE_ACTIVE : BUBBLE}
                      fillOpacity="0.85"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                      className="transition-opacity group-hover:opacity-80"
                    />
                  </Link>
                );
              })}
          {!loading &&
            layout.bubbles.map((b) =>
              b.label ? (
                <text
                  key={`${b.id}-label`}
                  x={b.label.x}
                  y={b.label.y}
                  fontSize="11"
                  fontWeight="600"
                  fill="#1c2a21"
                  aria-hidden="true"
                  className="pointer-events-none select-none"
                >
                  {b.name}
                </text>
              ) : null
            )}
        </svg>
        <GhanaMap
          variant="mini"
          highlightId={regionId}
          ariaLabel={`Location of ${regionId.replace(/-/g, ' ')} on the map of Ghana`}
          className="absolute top-[3.33%] left-[84.97%] w-[12.88%]"
        />
        <p className="absolute bottom-[14px] left-[16px] m-0 max-w-[calc(100%-32px)] font-sans text-[12px] leading-[14px] text-[#595959]">
          Markers sit at district capitals. Boundaries arrive with GSS district data.
        </p>
      </div>
    </PublicCard>
  );
};

export default DistrictZoomMap;
