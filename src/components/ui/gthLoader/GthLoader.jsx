import { classNames } from '../../../utils/classNames.js';
import { useUiStyle } from '../../../hooks/useUiStyle.js';
import pgTrack from '../../../assets/loader/pg-track.svg';
import pgArcGreen from '../../../assets/loader/pg-arc-green.svg';
import pgTrack2 from '../../../assets/loader/pg-track2.svg';
import pgArcGold from '../../../assets/loader/pg-arc-gold.svg';
import pgArcRed from '../../../assets/loader/pg-arc-red.svg';
import pgCenter from '../../../assets/loader/pg-center.svg';
import pgFigure from '../../../assets/loader/pg-figure.svg';
import pgSpark from '../../../assets/loader/pg-spark.svg';
import pgSpark2 from '../../../assets/loader/pg-spark2.svg';
import secTrack from '../../../assets/loader/sec-track.svg';
import secArcGreen from '../../../assets/loader/sec-arc-green.svg';
import secTrack2 from '../../../assets/loader/sec-track2.svg';
import secArcGold from '../../../assets/loader/sec-arc-gold.svg';
import secCenter from '../../../assets/loader/sec-center.svg';
import secFigure from '../../../assets/loader/sec-figure.svg';
import btnTrack from '../../../assets/loader/btn-track.svg';
import btnSpin from '../../../assets/loader/btn-spin.svg';
import btnSpinFocused from '../../../assets/loader/btn-spin-focused.svg';
import fpgTrack from '../../../assets/loader/fpg-track.svg';
import fpgArc from '../../../assets/loader/fpg-arc.svg';
import fpgCenter from '../../../assets/loader/fpg-center.svg';
import fpgFigure from '../../../assets/loader/fpg-figure.svg';
import fsecTrack from '../../../assets/loader/fsec-track.svg';
import fsecArc from '../../../assets/loader/fsec-arc.svg';
import fsecCenter from '../../../assets/loader/fsec-center.svg';
import fsecFigure from '../../../assets/loader/fsec-figure.svg';

/*
 * GthLoader — the GTH loader that replaces the plain green spinner (Figma component "GTH · Loader" 9312:544768, canvas 9312:544769).
 *   size   'page' (first load / route change · 168 Playful, 112 Focused) · 'section' (a card or panel · 56) · 'button' (inside a button · 20)
 *   look   'playful' (green, gold and red arcs round the GTH mark, two sparks) | 'focused' (one calm green arc); default: the user's UI style
 *   px     rendered width and height; the layers are drawn in percentages of the Figma box, so any size keeps the proportions
 * Motion (4 s loop, styles/gthLoader.css): green arc -540deg, gold +360deg, red -720deg, Focused arc -450deg, Button arc -900deg, Playful Page mark hops three times, Focused Page mark
 * breathes, sparks twinkle. Reduced motion: arcs stop, the mark breathes.
 * A11y: role="status" with a visually hidden label; the artwork is aria-hidden.
 */

const BOX = {
  page: { playful: 168, focused: 112 },
  section: { playful: 56, focused: 56 },
  button: { playful: 20, focused: 20 },
};

const pct = (v, base) => `${(v / base) * 100}%`;

// A positioned layer: x / y / w / h are Figma pixels of the loader box, drawn as percentages so the loader scales.
const Layer = ({ base, x = 0, y = 0, w, h = w, className, style, children }) => (
  <div
    className={classNames('absolute', className)}
    style={{
      left: pct(x, base),
      top: pct(y, base),
      width: pct(w, base),
      height: pct(h, base),
      ...style,
    }}
  >
    {children}
  </div>
);

const Img = ({ src, className = 'absolute block inset-0 size-full max-w-none' }) => (
  <img alt="" draggable="false" className={className} src={src} />
);

// The visible slice of an arc box (Figma `left-1/2 right-0 top-0 bottom-X` and friends).
const Slice = ({ src, inset }) => (
  <div className="absolute" style={inset}>
    <img alt="" draggable="false" className="block size-full max-w-none" src={src} />
  </div>
);

const Playful = ({ size }) => {
  const isPage = size === 'page';
  const b = isPage ? 168 : 56;
  const g = isPage
    ? { track: pgTrack, green: pgArcGreen, track2: pgTrack2, gold: pgArcGold }
    : { track: secTrack, green: secArcGreen, track2: secTrack2, gold: secArcGold };
  const t2 = isPage ? { x: 15, w: 138 } : { x: 9, w: 38 };
  return (
    <>
      <Layer base={b} w={b}>
        <Img src={g.track} />
      </Layer>
      <Layer base={b} w={b} className="gl-arc" style={{ '--gl-turn': '-540deg' }}>
        <Slice src={g.green} inset={{ left: '50%', right: 0, top: 0, bottom: '32.9%' }} />
      </Layer>
      <Layer base={b} x={t2.x} y={t2.x} w={t2.w}>
        <Img src={g.track2} />
      </Layer>
      <Layer
        base={b}
        x={t2.x}
        y={t2.x}
        w={t2.w}
        className="gl-arc"
        style={{ '--gl-turn': '360deg' }}
      >
        <Slice
          src={g.gold}
          inset={{ left: '0.76%', right: '50%', top: isPage ? '57.3%' : '56.4%', bottom: 0 }}
        />
      </Layer>
      {isPage ? (
        <>
          <Layer
            base={b}
            x={30}
            y={30}
            w={108}
            className="gl-arc"
            style={{ '--gl-turn': '-720deg' }}
          >
            <Slice
              src={pgArcRed}
              inset={{ left: '3.02%', top: '3.02%', right: '64.25%', bottom: '64.25%' }}
            />
          </Layer>
          <Layer base={b} x={47} y={47} w={74}>
            <div className="absolute" style={{ inset: '0 0 -4.05% 0' }}>
              <img alt="" draggable="false" className="block size-full max-w-none" src={pgCenter} />
            </div>
          </Layer>
          <Layer base={b} x={59.58} y={65.18} w={48.84} h={40.609} className="gl-hop">
            <div className="absolute" style={{ inset: '0 0 0 -0.39%' }}>
              <img alt="" draggable="false" className="block size-full max-w-none" src={pgFigure} />
            </div>
          </Layer>
          <Layer base={b} x={142} y={2} w={22} className="gl-spark-a">
            <Img src={pgSpark} />
          </Layer>
          <Layer base={b} x={4} y={146} w={14} className="gl-spark-b">
            <Img src={pgSpark2} />
          </Layer>
        </>
      ) : (
        <>
          <Layer base={b} x={13} y={13} w={30}>
            <Img src={secCenter} />
          </Layer>
          <Layer base={b} x={18.1} y={20.37} w={19.8} h={16.463}>
            <div className="absolute" style={{ inset: '0 0 0 -0.39%' }}>
              <img
                alt=""
                draggable="false"
                className="block size-full max-w-none"
                src={secFigure}
              />
            </div>
          </Layer>
        </>
      )}
    </>
  );
};

const Focused = ({ size }) => {
  const isPage = size === 'page';
  const b = isPage ? 112 : 56;
  const g = isPage
    ? { track: fpgTrack, arc: fpgArc, center: fpgCenter, figure: fpgFigure }
    : { track: fsecTrack, arc: fsecArc, center: fsecCenter, figure: fsecFigure };
  const c = isPage ? { x: 26, w: 60 } : { x: 14, w: 28 };
  const f = isPage
    ? { x: 36.2, y: 40.74, w: 39.6, h: 32.926 }
    : { x: 18.76, y: 20.88, w: 18.48, h: 15.365 };
  return (
    <>
      <Layer base={b} w={b}>
        <Img src={g.track} />
      </Layer>
      <Layer base={b} w={b} className="gl-arc" style={{ '--gl-turn': '-450deg' }}>
        <Slice src={g.arc} inset={{ left: '50%', right: 0, top: 0, bottom: '50%' }} />
      </Layer>
      <Layer base={b} x={c.x} y={c.x} w={c.w}>
        <Img src={g.center} />
      </Layer>
      <Layer base={b} x={f.x} y={f.y} w={f.w} h={f.h} className={isPage ? 'gl-breathe' : undefined}>
        <div className="absolute" style={{ inset: '0 0 0 -0.39%' }}>
          <img alt="" draggable="false" className="block size-full max-w-none" src={g.figure} />
        </div>
      </Layer>
    </>
  );
};

const Button = ({ look }) => (
  <>
    <Layer base={20} w={20}>
      <Img src={btnTrack} />
    </Layer>
    <Layer base={20} w={20} className="gl-arc" style={{ '--gl-turn': '-900deg' }}>
      <Slice
        src={look === 'focused' ? btnSpinFocused : btnSpin}
        inset={{ left: '50%', right: 0, top: 0, bottom: '41.32%' }}
      />
    </Layer>
  </>
);

const GthLoader = ({ size = 'page', look, px, label = 'Loading', className, style, ...rest }) => {
  const { uiStyle } = useUiStyle();
  const mode = look || (uiStyle === 'playful' ? 'playful' : 'focused');
  const box = BOX[size]?.[mode] ?? 56;
  const dim = px ?? box;
  return (
    <span
      role="status"
      aria-live="polite"
      data-gth-loader={`${mode}-${size}`}
      className={classNames('relative inline-block shrink-0', className)}
      style={{ width: dim, height: dim, ...style }}
      {...rest}
    >
      {size === 'button' ? (
        <Button look={mode} />
      ) : mode === 'playful' ? (
        <Playful size={size} />
      ) : (
        <Focused size={size} />
      )}
      <span className="sr-only">{label}</span>
    </span>
  );
};

export default GthLoader;
