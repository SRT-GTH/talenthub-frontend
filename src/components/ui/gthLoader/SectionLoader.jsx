import { classNames } from '../../../utils/classNames.js';
import { useUiStyle } from '../../../hooks/useUiStyle.js';
import GthLoader from './GthLoader.jsx';
import GthRouteProgress from './GthRouteProgress.jsx';

/*
 * SectionLoader — the loader for moving between pages (Figma LD-03 Playful 9315:2, LD-04 Focused 9315:998): the route bar runs full width at the very top of the screen (the shell's top bar
 * and sidebar stay mounted) and the content area shows the 90 Section loader over one caption ("Opening Clubs…"): Playful Bricolage 22 / 600 #1c2a21, Focused 16 / 500 #595959, 16 below the loader.
 * Props: label ("Opening Clubs…"), look, bar (false hides the route bar), className.
 * ⚠️ ASSUMPTION: the route bar is pinned to the top of the viewport (the frames put it under the top bar, a fixed 138 px down); caption sizes read from the frame's text boxes.
 */
const SectionLoader = ({ label = 'Loading…', look, bar = true, className }) => {
  const { uiStyle } = useUiStyle();
  const mode = look || (uiStyle === 'playful' ? 'playful' : 'focused');
  const playful = mode === 'playful';
  return (
    <div
      data-route-fallback
      role="status"
      aria-label={label}
      className={classNames('grid min-h-[60dvh] flex-1 place-items-center px-4', className)}
    >
      {bar ? <GthRouteProgress look={mode} className="fixed inset-x-0 top-0 z-[60]" /> : null}
      <div className="flex flex-col items-center gap-[16px]">
        <GthLoader size="section" look={mode} px="clamp(64px,5.2vw,90px)" label="" />
        <p
          className={classNames(
            'm-0 text-center leading-[normal]',
            playful
              ? 'font-heading text-[22px] font-semibold text-[#1c2a21]'
              : 'font-sans text-[16px] font-medium text-[#595959]'
          )}
        >
          {label}
        </p>
      </div>
    </div>
  );
};

export default SectionLoader;
