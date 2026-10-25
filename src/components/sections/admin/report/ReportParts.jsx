import { classNames } from '../../../../utils/classNames.js';
import logo from '../../../../assets/admin/report-logo.png';
import { QR_CELLS, QR_FINDERS } from './data/adminReportData.js';

/*
 * Shared pieces of the A4 report kit (Figma 7.3.1 v2, frames 1123 x 794 px). The pages are fixed-size print artwork, not responsive layouts: every layer is placed at the
 * Figma coordinates, so the helpers below take px values on purpose (no clamp()). The print rules in AdminReportPrintPage turn each frame into one landscape A4 sheet.
 */

export const GREEN = '#387440';
export const INK = '#1c2a21';
export const GREY = '#575755';

/* ReportPage — one 1123 x 794 sheet. */
export const ReportPage = ({ n, label, children, className }) => (
  <section
    aria-label={label}
    data-report-page={n}
    className={classNames(
      'report-sheet relative h-[794px] w-[1123px] shrink-0 overflow-hidden bg-white font-sans',
      className
    )}
  >
    {children}
  </section>
);

/*
 * T — an absolutely placed text layer: x / y / w are the Figma box, size / lh the font size and line height in px, `heading` picks Bricolage Grotesque,
 * `caps` the all-caps eyebrow style, `op` the layer opacity. Newlines in the string become line breaks (the frames break lines by hand).
 */
export const T = ({
  x,
  y,
  w,
  size,
  lh,
  weight = 400,
  color = INK,
  ls,
  align,
  heading = false,
  caps = false,
  op,
  nowrap = false,
  as = 'p',
  className,
  style,
  children,
}) => {
  const Tag = as;
  return (
    <Tag
      className={classNames(
        'm-0 absolute',
        heading ? 'font-heading' : 'font-sans',
        caps && 'uppercase',
        className
      )}
      style={{
        left: x,
        top: y,
        width: w,
        fontSize: size,
        lineHeight: `${lh}px`,
        fontWeight: weight,
        color,
        letterSpacing: ls,
        textAlign: align,
        opacity: op,
        whiteSpace: nowrap ? 'nowrap' : 'pre-line',
        ...style,
      }}
    >
      {children}
    </Tag>
  );
};

/* Box — an absolutely placed rectangle. */
export const Box = ({ x, y, w, h, bg, r, op, className, style, children }) => (
  <div
    aria-hidden={children ? undefined : 'true'}
    className={classNames('absolute', className)}
    style={{
      left: x,
      top: y,
      width: w,
      height: h,
      background: bg,
      borderRadius: r,
      opacity: op,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Logo = ({ x, y, w, h }) => (
  <img
    src={logo}
    alt=""
    width={w}
    height={h}
    className="absolute block"
    style={{ left: x, top: y, width: w, height: h }}
  />
);

/* Footer + page number as drawn on every inner page (9 px footer, 12 px Bricolage number). */
export const PageFoot = ({ text, no, x = 48, noX = 1059, light = false }) => (
  <>
    <T
      x={x}
      y={758}
      w={400}
      size={9}
      lh={11}
      color={light ? '#ffffff' : GREY}
      op={light ? 0.85 : undefined}
      nowrap
    >
      {text}
    </T>
    <T
      x={noX}
      y={755}
      w={30}
      size={12}
      lh={14}
      weight={600}
      heading
      color={light ? '#ffffff' : GREEN}
      nowrap
    >
      {no}
    </T>
  </>
);

/* Head stack of the data pages: eyebrow 10/700 caps, title 32/600 Bricolage, sub 12.5. */
export const PageHead = ({ eyebrow, title, sub, w = 560 }) => (
  <>
    <T x={48} y={44} w={w} size={10} lh={12} weight={700} ls={1} color={GREEN} caps>
      {eyebrow}
    </T>
    <T x={48} y={66} w={w} size={32} lh={37} weight={600} ls={-0.32} heading as="h1">
      {title}
    </T>
    <T x={48} y={113} w={w} size={12.5} lh={19} color={GREY}>
      {sub}
    </T>
  </>
);

/* Bar — track + fill, as the Figma "bar · n" instances (px widths: track 330 / 293, fill as drawn). */
export const Bar = ({ x, y, track, fill, h = 6, color = GREEN }) => (
  <>
    <Box x={x} y={y} w={track} h={h} bg="#ebf1ec" r={4} />
    <Box x={x} y={y} w={fill} h={h} bg={color} r={4} />
  </>
);

/* QR — the verify code drawn from the Figma modules: white tile r10, three 42 px finder squares (6 px ring + 18 px core), 6 px modules. */
export const Qr = ({ x, y }) => (
  <div
    role="img"
    aria-label="QR code that opens the report verification page"
    className="absolute overflow-hidden bg-white"
    style={{ left: x, top: y, width: 150, height: 150, borderRadius: 10 }}
  >
    {QR_CELLS.map(([cx, cy]) => (
      <span
        key={`${cx}-${cy}`}
        className="absolute bg-[#1c2a21]"
        style={{ left: cx, top: cy, width: 6, height: 6 }}
      />
    ))}
    {QR_FINDERS.map(([fx, fy]) => (
      <span key={`${fx}-${fy}`}>
        <span
          className="absolute box-border border-[6px] border-solid border-[#1c2a21]"
          style={{ left: fx, top: fy, width: 42, height: 42 }}
        />
        <span
          className="absolute bg-[#1c2a21]"
          style={{ left: fx + 12, top: fy + 12, width: 18, height: 18 }}
        />
      </span>
    ))}
  </div>
);
