/*
 * InstitutionPortfolioCover — the three portfolio covers of the student record (Figma 11.2.2j "cover/bars" 8744:433712, "cover/line" 8744:433724, "cover/dots" 8744:433731; 264 x 150, r14,
 * 1px ink at 10 %). They are plain Figma shapes, rebuilt from the node boxes: bars #1d4ed8 on #dbeafe, a 4px #7c3aed polyline on #ede9fe, #c8951a / #1c2a21 dots on #faf4e8.
 * Props: kind ('bars' | 'line' | 'dots'), label (the sticker text: Project / Poster / Essay), name (accessible description).
 */

const BARS = [
  [40, 76, 60],
  [74, 41, 95],
  [108, 96, 40],
  [142, 16, 120],
  [176, 56, 80],
  [210, 31, 105],
];
const DOTS = [
  [14, 40, 8, '#1c2a21', 0.6],
  [67, 77, 15, '#c8951a', 0.8],
  [120, 114, 8, '#c8951a', 0.8],
  [173, 55, 15, '#1c2a21', 0.6],
  [226, 92, 8, '#c8951a', 0.8],
  [49, 129, 15, '#c8951a', 0.8],
  [102, 70, 8, '#1c2a21', 0.6],
  [155, 107, 15, '#c8951a', 0.8],
  [208, 48, 8, '#c8951a', 0.8],
  [31, 85, 15, '#1c2a21', 0.6],
  [84, 122, 8, '#c8951a', 0.8],
  [137, 63, 15, '#c8951a', 0.8],
  [190, 100, 8, '#1c2a21', 0.6],
  [243, 41, 15, '#c8951a', 0.8],
  [66, 78, 8, '#c8951a', 0.8],
  [119, 115, 15, '#1c2a21', 0.6],
  [172, 56, 8, '#c8951a', 0.8],
  [225, 93, 15, '#c8951a', 0.8],
  [48, 130, 8, '#1c2a21', 0.6],
  [101, 71, 15, '#c8951a', 0.8],
  [154, 108, 8, '#c8951a', 0.8],
  [207, 49, 15, '#1c2a21', 0.6],
  [30, 86, 8, '#c8951a', 0.8],
  [83, 123, 15, '#c8951a', 0.8],
  [136, 64, 8, '#1c2a21', 0.6],
  [189, 101, 15, '#c8951a', 0.8],
];
const BG = { bars: '#dbeafe', line: '#ede9fe', dots: '#faf4e8' };

const InstitutionPortfolioCover = ({ kind, label, name }) => (
  <div
    role="img"
    aria-label={name}
    style={{ backgroundColor: BG[kind] }}
    className="relative h-[150px] w-full max-w-[264px] overflow-hidden rounded-[14px] border border-solid border-[#1c2a21]/10"
  >
    <svg viewBox="0 0 264 150" aria-hidden="true" className="absolute inset-0 size-full">
      {kind === 'bars'
        ? BARS.map(([x, y, h]) => (
            <rect key={x} x={x} y={y} width="22" height={h} rx="4" fill="#1d4ed8" />
          ))
        : null}
      {kind === 'line' ? (
        <path
          d="M16.0005 131.9998L60.0004 107.9999L100.0003 115.9998L140 75.9999L180 83.9999L246 40"
          stroke="#7C3AED"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      ) : null}
      {kind === 'dots'
        ? DOTS.map(([x, y, d, fill, o], i) => (
            <circle key={i} cx={x + d / 2} cy={y + d / 2} r={d / 2} fill={fill} opacity={o} />
          ))
        : null}
    </svg>
    <span className="absolute top-[12px] left-[12px] inline-flex items-center rounded-full bg-[#ebf1ec] px-[10px] py-[5px] font-sans text-[11px] leading-[13px] font-bold text-[#1f4a2b]">
      {label}
    </span>
  </div>
);

export default InstitutionPortfolioCover;
