import { classNames } from '../../../utils/classNames.js';
import bgGrid from '../../../assets/community/bg-grid.png';
import bgEllipse1 from '../../../assets/community/bg-ellipse-1.svg';
import bgEllipse2 from '../../../assets/community/bg-ellipse-2.svg';
import bgEllipse3 from '../../../assets/community/bg-ellipse-3.svg';

/*
 * DashboardPageBackground — the grid texture + 3 blurred ellipses shared by
 * every community screen (Figma 7025:85168 grid + 7025:85170-172 ellipses).
 *
 * Uses `background-attachment: fixed` (raw CSS via inline `style` — Tailwind
 * has no arbitrary-value syntax for multi-layer background-position/-size
 * lists), NOT `position: fixed` on the element itself. That distinction is
 * the whole point: a `background-attachment: fixed` layer is still painted
 * within its own element's normal box — a small sticky bar with this style
 * stays correctly sized/clipped by ordinary layout — while the IMAGE inside
 * it is positioned against the viewport, exactly like the full-page copy.
 * `vw`/`vh` units on `background-position`/`background-size` (rather than
 * `%`, which for a fixed background is a *relative-alignment* fraction, not
 * a plain offset) reproduce the original absolute `left/top/width` percentages
 * as literal viewport-relative offsets, so every copy of this component
 * lines up pixel-for-pixel with every other copy, regardless of the size of
 * the element that renders it.
 *
 * Corrected 2026-09-17, third pass:
 *   1st: sticky bars got their own `bg-white/85 backdrop-blur-sm` wash —
 *        looked like a foggy bar cutting across the real background.
 *   2nd: removed that wash entirely → sticky bars went fully transparent,
 *        letting scrolled content bleed through unreadably.
 *   3rd (this one): tried reusing this component with `position: fixed` +
 *        an `overflow-hidden` ancestor to crop it — broke completely, because
 *        `position: fixed` descendants are positioned (and only clipped)
 *        against the *viewport*, not an ancestor's `overflow: hidden` box,
 *        unless that ancestor has its own transform/filter/will-change
 *        (none do here) — so it painted full-viewport-opaque over the whole
 *        page. `background-attachment: fixed` doesn't have that escape
 *        hatch: it's a paint-time positioning rule for the background image,
 *        the element itself stays a completely normal, clippable box.
 */
/*
 * `variant="recruiter"` — the "Job prospecting V2.0" recruiter canvas (Figma frame 7249:75818, measured 2026-11-04):
 *   - base = white + #E1EAE2 at 20% = #F9FBF9 (the frame's two fills), not plain white
 *   - the grid texture is drawn twice: full width, plus a 767px-wide copy rotated 180deg on the left
 *   - the three blurred ellipses are 571 / 473 / 571px circles (the ellipse SVGs carry a 200px blur margin, so each
 *     SVG is drawn 971 / 873 / 971px) at Figma's absolute coordinates, expressed in vw so they scale with the frame
 *     (frame y has the 52px Safari toolbar subtracted). The default variant sizes the same SVGs at the circle
 *     diameter, which shrinks the circles to ~59% — left untouched for the other consumers.
 */
const RECRUITER_ELLIPSE_LAYERS = {
  backgroundImage: (a, b, c) => `url("${a}"), url("${b}"), url("${c}")`,
  backgroundPosition: '-22.11vw -29.63vw, 27.55vw -21.93vw, 70.83vw 20.72vw',
  backgroundSize: '56.19vw auto, 50.52vw auto, 56.19vw auto',
};

const DashboardPageBackground = ({ className, variant = 'default' }) => {
  const recruiter = variant === 'recruiter';
  return (
    <div
      aria-hidden="true"
      className={classNames(
        'pointer-events-none absolute inset-0 overflow-hidden',
        recruiter ? 'bg-[#f9fbf9]' : 'bg-white',
        className
      )}
    >
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage: `url(${bgGrid})`,
          backgroundAttachment: 'fixed',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          // Quoted `url("...")`, not bare `url(...)` — Vite dev inlines these
          // small SVGs as unquoted data URIs, and the SVGs' own
          // `filter='url(#id)'` attributes contain literal, unescaped parens.
          // Bare inside a CSS url() token, an unescaped `(`/`)` terminates the
          // token early, which silently invalidates this ENTIRE multi-layer
          // background-image (all 3 ellipses, not just the offending one) —
          // the browser drops the whole declaration with no console error.
          // Quoting lets the string carry parens safely. Root-caused
          // 2026-09-18 after the ellipses render fine on some assets (the
          // grid PNG's own plain path has no special characters) but silently
          // vanish here.
          backgroundImage: recruiter
            ? RECRUITER_ELLIPSE_LAYERS.backgroundImage(bgEllipse2, bgEllipse3, bgEllipse1)
            : `url("${bgEllipse2}"), url("${bgEllipse3}"), url("${bgEllipse1}")`,
          backgroundAttachment: 'fixed, fixed, fixed',
          backgroundRepeat: 'no-repeat, no-repeat, no-repeat',
          // left/top offsets as vw/vh lengths (not %) = the original absolute
          // `left/top` percentages, but resolved against the viewport instead
          // of whichever element happens to render this.
          backgroundPosition: recruiter
            ? RECRUITER_ELLIPSE_LAYERS.backgroundPosition
            : '-10.53vw -23.28vh, 39.12vw -11.37vh, 82.41vw 54.61vh',
          backgroundSize: recruiter
            ? RECRUITER_ELLIPSE_LAYERS.backgroundSize
            : '33.04vw auto, 27.37vw auto, 33.04vw auto',
        }}
      />
      {recruiter && (
        <div
          className="absolute inset-y-0 left-0 w-[44.39vw] rotate-180 opacity-70"
          style={{
            backgroundImage: `url(${bgGrid})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
          }}
        />
      )}
    </div>
  );
};

export default DashboardPageBackground;
