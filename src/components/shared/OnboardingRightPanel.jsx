import { useEffect } from 'react';
import { debug } from '../../utils/debug.js';

import bgGrid from '../../assets/hero/talent-panel-bg-grid.png';
import sparkleStars from '../../assets/hero/talent-panel-sparkle-stars.svg';
import snowPattern from '../../assets/hero/talent-panel-snow-pattern.svg';

const log = debug('OnboardingRightPanel');

/*
 * OnboardingRightPanel — shell for all talent auth / onboarding right panels.
 *
 * Figma reference frame: 739 × 973 px. All % positions are proportional to
 * those dimensions. Widths use vw-based clamp (panel = clamp(360px,42vw,739px)).
 *
 * The shell owns:
 *   – aside sizing + border
 *   – BG layers: TR/BL ellipse glows, grid texture, sparkle stars, snow pattern
 *
 * All foreground content is passed via the `panelContent` prop so each screen
 * can swap in its own photo/card composition without touching this shell.
 *
 * Props:
 *   bgColor          — aside background (default #387440 brand-green)
 *   ellipseTRColor   — TR ellipse glow fill (default #F7EFDD amber)
 *   ellipseBLColor   — BL ellipse glow fill (default #F9EBEA coral)
 *                      Passed directly as backgroundColor on a rounded-full div + blur filter.
 *   showGrid         — render the bottom-right grid texture (default true)
 *   showSparkleStars — render the top-right sparkle stars (default true)
 *   showSnow         — render the left snow/rain pattern (default true)
 *   panelContent     — ReactNode for the foreground (photos + overlay cards)
 *   toast            — optional ReactNode for floating alerts (controls aria-hidden)
 *
 * Pattern mirrors ParentLoginRightPanel: same shell, content via props.
 * ✅ VERIFIED — see wiki/components.md § OnboardingRightPanel
 */
export default function OnboardingRightPanel({
  bgColor = '#387440',
  ellipseTRColor = '#F7EFDD',
  ellipseBLColor = '#F9EBEA',
  showGrid = true,
  showSparkleStars = true,
  showSnow = true,
  panelContent = null,
  toast = null,
}) {
  useEffect(() => {
    log('mount', { hasPanelContent: Boolean(panelContent), hasToast: Boolean(toast) });
  }, []);

  return (
    <aside
      aria-hidden={toast ? undefined : true}
      className="relative hidden shrink-0 self-stretch overflow-hidden lg:block"
      style={{ width: 'clamp(360px, 42vw, 739px)', backgroundColor: bgColor }}
    >
      {/* ── TR ellipse glow — top-right, bleeds off-screen ─────────────────── */}
      {/* Figma: left 617/739=83.5%, top -210/973=-21.6%, size 473/739=64% of panel */}
      {/* CSS div circle: rounded-full gives the shape, filter:blur spreads the glow */}
      {/* beyond the border-radius naturally — no overflow-hidden needed on parent */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute rounded-full"
        style={{
          left: '83.5%',
          top: '-21.6%',
          width: '64%',
          aspectRatio: '1',
          backgroundColor: ellipseTRColor,
          opacity: 0.7,
          filter: 'blur(80px)',
        }}
      />

      {/* ── BL ellipse glow — bottom-left, bleeds off-screen ──────────────── */}
      {/* Figma: bottom -223/973=-22.9%, left -171/739=-23.1% */}
      {/* stdDeviation=150 in 1073px SVG space → ~66px at panel scale → blur(100px) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute rounded-full"
        style={{
          bottom: '-22.9%',
          left: '-23.1%',
          width: '64%',
          aspectRatio: '1',
          backgroundColor: ellipseBLColor,
          opacity: 0.5,
          filter: 'blur(100px)',
        }}
      />

      {/* ── Grid texture — bottom-right, rotated 180° + scaleY(-1) ─────────── */}
      {/* right ~0, top 572/973=58.8%, h 405/973=41.6%, w 358/739=48.4% */}
      {showGrid && (
        <div
          className="absolute flex items-center justify-center"
          style={{ right: 0, top: '58.8%', height: '41.6%', width: '48.4%' }}
        >
          <div className="-scale-y-100 flex-none rotate-180 relative size-full">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img
                src={bgGrid}
                alt=""
                className="absolute max-w-none top-0"
                style={{ height: '124.47%', left: '-90.11%', width: '280.22%' }}
                draggable={false}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Sparkle stars — top-right corner ───────────────────────────────── */}
      {/* Figma: left 578/739=78.2%, top 22/973=2.3%, h 102/973=10.5%, w 100/739=13.5% */}
      {showSparkleStars && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute"
          style={{ left: '78.2%', top: '2.3%', height: '10.5%', width: '13.5%' }}
        >
          <img
            src={sparkleStars}
            alt=""
            className="absolute block inset-0 max-w-none size-full"
            draggable={false}
          />
        </div>
      )}

      {/* ── Snow / rain pattern — left overflow ─────────────────────────────── */}
      {/* Figma: left -389/739=-52.6%, top -31/973=-3.2%, h 359/973=36.9%, w 447/739=60.5% */}
      {showSnow && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute"
          style={{ left: '-52.6%', top: '-3.2%', height: '36.9%', width: '60.5%' }}
        >
          <img
            src={snowPattern}
            alt=""
            className="absolute block inset-0 max-w-none size-full"
            draggable={false}
          />
        </div>
      )}

      {/* ── Foreground content slot ─────────────────────────────────────────── */}
      {panelContent}

      {/* ── Toast / alert slot ─────────────────────────────────────────────── */}
      {toast}
    </aside>
  );
}
