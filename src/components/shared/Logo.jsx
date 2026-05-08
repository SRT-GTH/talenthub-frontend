import gthMark from '../../assets/brand/gth-mark.png';
import gthWordmark from '../../assets/brand/gth-wordmark.png';
import { classNames } from '../../utils/classNames.js';
import { debug } from '../../utils/debug.js';

const log = debug('Logo');

/*
 * Logo — Ghana Talent Hub brand mark + wordmark.
 * Source: Figma `GTHLogo 1` (nodes 2517:28662 inside the navbar at 2513:28586,
 * 2638:4807 inside the footer at 2638:4802). The mark + wordmark are PNG
 * assets bundled under `src/assets/brand/`.
 *
 * Both images are positioned absolutely inside cropping containers — Figma
 * renders the source PNGs at 128/131% of their box and clips the overflow
 * (left=-1%, top=0% for the mark; left=1%, top=4% for the wordmark). A
 * naive `<img>` stretching to fit the box throws off the visual centre,
 * so we mirror Figma's absolute-positioned layout exactly.
 *
 * Layout: 64×58 mark on the left + 8px gap + 62×20 wordmark on the right,
 * both vertically centred in a 50px wrapper. The mark slightly overflows
 * the wrapper top/bottom (4px each) by design — this is what Figma does
 * to make the figure feel centred against the wordmark text baseline.
 *
 * Notes:
 *   - The wordmark PNG is white-on-transparent — it's intended for dark
 *     backgrounds (the navbar's translucent dark fill, the footer's
 *     brand-green-darker). For light backgrounds, set `invert` to flip
 *     the wordmark to dark via CSS `filter: invert`.
 *   - Both images are bundled by Vite as static assets so the build is
 *     self-contained.
 */

const SIZE_PRESETS = {
  sm: { wrapperH: 'h-9', markBox: 'w-[46px] h-[42px]', wordBox: 'w-[44px] h-[14px]' },
  md: { wrapperH: 'h-[50px]', markBox: 'w-16 h-[58px]', wordBox: 'w-[62px] h-5' },
  lg: { wrapperH: 'h-16', markBox: 'w-[80px] h-[72px]', wordBox: 'w-[78px] h-[26px]' },
};

const Logo = ({ size = 'md', invert = false, showWordmark = true, className, ...rest }) => {
  log('render', { size, invert, showWordmark });

  const preset = SIZE_PRESETS[size] || SIZE_PRESETS.md;
  const wordmarkFilter = invert ? 'invert' : '';

  return (
    <span
      className={classNames('inline-flex items-center gap-2', preset.wrapperH, className)}
      aria-label="Ghana Talent Hub"
      {...rest}
    >
      {/* Mark: 64×58 cropping container — image is rendered at 128.19%×131.58%
        with a -1% left offset so the centred figure is visible. */}
      <span
        aria-hidden="true"
        className={classNames(
          'relative inline-block shrink-0 overflow-hidden pointer-events-none',
          preset.markBox
        )}
      >
        <img
          src={gthMark}
          alt=""
          className="absolute max-w-none top-0"
          style={{ height: '131.58%', width: '128.19%', left: '-1%' }}
        />
      </span>
      {showWordmark && (
        // Wordmark: 62×20 cropping container — image at 97.72%×92.88%, offset
        // left 1.02% / top 3.98% (Figma exact).
        <span
          aria-hidden="true"
          className={classNames(
            'relative inline-block shrink-0 overflow-hidden pointer-events-none',
            preset.wordBox,
            wordmarkFilter
          )}
        >
          <img
            src={gthWordmark}
            alt=""
            className="absolute max-w-none"
            style={{ height: '92.88%', width: '97.72%', left: '1.02%', top: '3.98%' }}
          />
        </span>
      )}
    </span>
  );
};

export default Logo;
