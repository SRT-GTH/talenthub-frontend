import { classNames } from '../../../utils/classNames.js';
import identityMapBg from '../../../assets/engagement/identity-map-bg.png';
import { debug } from '../../../utils/debug.js';

const log = debug('IdentityStageMap');

/*
 * IdentityStageMap — the green map column on the Identity Map page.
 * Source: Figma frame (Section 1 · Your Identity).
 *
 * The Figma frame is a richly illustrated map (boy mascot, stage badges,
 * trees, mountains, sparkles, dashed connector path, geography labels,
 * the dashed road at the bottom). Rather than reconstruct all of those
 * inline in code — which produced a bare, off-design result on the first
 * pass — we render the designer-provided flat export (`identity-map-bg.png`)
 * as the full map visual.
 *
 * The component is just a responsive container that lets the image fill
 * the available column width. Interactive overlays (clickable hit areas
 * per stage badge for future routing) can be layered on top later — for
 * now this stays purely presentational.
 */

const IdentityStageMap = ({ className }) => {
  log('render');

  return (
    <div
      className={classNames(
        'relative w-full overflow-hidden',
        'rounded-r-3xl lg:rounded-r-none',
        'bg-[#cfe0c8]', // matches the image's top-most gradient stop so any
        // letterboxing on extreme aspect ratios blends in
        className
      )}
    >
      <img
        src={identityMapBg}
        alt="Section 1 · Your Identity progress map showing the 9 profile stages and milestone rewards"
        className="block w-full h-auto select-none"
        draggable="false"
      />
    </div>
  );
};

export default IdentityStageMap;
