import { classNames } from '../../../utils/classNames.js';
import { useUiStyle } from '../../../hooks/useUiStyle.js';

/*
 * GthRouteProgress — the thin bar under the top bar while moving between pages (Figma "GTH · Route progress" 9314:10305).
 *   Playful: 4 high on #faf0d6, a red / gold / green kente stripe (260 wide) sweeps across.   Focused: 3 high on #e9efe7, one rounded green bar.
 * The sweep is 2 s (`pace="slow"` is the 4 s loop the page loader uses: same sweep, longer wait). Reduced motion: the bar sits full width.
 * Width follows the parent; give it `className` for position (e.g. `fixed inset-x-0 top-0 z-50`).
 */
const GthRouteProgress = ({ look, pace = 'normal', label = 'Loading page', className, style }) => {
  const { uiStyle } = useUiStyle();
  const mode = look || (uiStyle === 'playful' ? 'playful' : 'focused');
  const playful = mode === 'playful';
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-busy="true"
      data-pace={pace === 'slow' ? 'slow' : undefined}
      className={classNames(
        'gl-route w-full',
        playful ? 'h-[4px] bg-[#faf0d6]' : 'h-[3px] bg-[#e9efe7]',
        className
      )}
      style={style}
    >
      <div className={classNames('gl-route-bar', playful ? 'h-[4px]' : 'h-[3px]')}>
        {playful ? (
          <div className="flex size-full">
            <span className="h-full w-1/3 bg-[#d64534]" />
            <span className="h-full w-1/3 bg-[#f5b724]" />
            <span className="h-full w-1/3 bg-[#387440]" />
          </div>
        ) : (
          <span className="block size-full rounded-[2px] bg-[#387440]" />
        )}
      </div>
    </div>
  );
};

export default GthRouteProgress;
