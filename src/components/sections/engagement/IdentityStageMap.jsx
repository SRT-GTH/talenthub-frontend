import { classNames } from '../../../utils/classNames.js';
import identityMapBg from '../../../assets/engagement/identity-map-bg.webp';
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
 * pass — we render the designer-provided flat export (`identity-map-bg.webp`)
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
        'relative w-full overflow-hidden max-lg:overflow-x-auto max-lg:overscroll-x-contain',
        'rounded-r-3xl lg:rounded-r-none',
        'bg-[#cfe0c8]', // matches the image's top-most gradient stop so any
        // letterboxing on extreme aspect ratios blends in
        className
      )}
    >
      <img
        src={identityMapBg}
        alt="Section 1 · Your Identity progress map showing the 9 profile stages and milestone rewards"
        // Below lg the 1255px map would shrink to an unreadable ~288px, so it keeps a
        // 680px floor and pans horizontally inside its box instead.
        className="block w-full h-auto select-none max-lg:min-w-[680px]"
        draggable="false"
      />
      <p className="sticky left-0 w-full bg-[#cfe0c8] px-4 py-2 text-center font-sans text-[12px] leading-4 text-neutral-darker lg:hidden">
        Swipe sideways to explore the map
      </p>
    </div>
  );
};

export default IdentityStageMap;
