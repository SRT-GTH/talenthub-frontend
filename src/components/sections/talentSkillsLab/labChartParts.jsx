import { debug } from '../../../utils/debug.js';
import { LabEmojiSadIcon } from './labIconsAnalysis.jsx';

const log = debug('labChartParts');

/*
 * labChartParts — the chart card drawn in the Data analysis lab (Figma SL-L12a Q3 bar chart, SL-L12e Q2 line chart,
 * SL-L12f Q4 scatter plot). The chart art is native (HTML + one SVG overlay) so it scales with the column and the values are
 * real data, not an image. Geometry is the Figma plot (992x260, gridlines 932 wide, y axis column 60) expressed in % / px:
 *   bar      0 line at +20+210, 80k at +20 (2.625 px per k), bars 80 wide (8.58 %) spread edge to edge, radius 8 on top
 *   line     5 gridlines over 200 px, points at x = 40 + 170 i of 932, 3px green line, 12px white dots with 3px green ring
 *   scatter  5 gridlines over 200 px, x domain 0 to 13 (GH₵k) across the 932, 14px green dots with a 2px white ring
 * The card is identical in Playful and Focused (Figma pdiff shows no difference), so no `playful:` variants here.
 *
 * chart = {
 *   type: 'bar' | 'line' | 'scatter',
 *   title, sub, chip?,                        header text (chip = pill on the right, e.g. "Week 5 is 21k above the 8-week average")
 *   max, ticks:[{ value, label }],            y axis
 *   bar:     bars:[{ label, value, display, tone?:'alert' }], average?:{ value, label }
 *   line:    points:[{ label, value, display, tone?:'warn' }]
 *   scatter: points:[{ x, y }], xTicks:[{ value, label }], xMax, trend:{ x1, y1, x2, y2 }
 *   summary                                   text for the figure's accessible name (data pairs as drawn)
 * }
 */

const AXIS_TEXT = 'font-sans text-[11px] leading-[13px] text-[#595959] max-lg:text-[12px]';
const GRID = 'absolute inset-x-0 h-0 border-t border-solid border-[#e7e7e7]';
const DASH =
  'bg-[repeating-linear-gradient(90deg,#785910_0,#785910_6px,transparent_6px,transparent_11px)]';

const BAR_RANGE = 210;
const LINE_RANGE = 200;

/* Gridlines + y labels (the plot box it sits in is exactly the 0 line to the top line). */
const YAxis = ({ chart }) => (
  <>
    {chart.ticks.map((tick) => {
      const pct = 100 - (tick.value / chart.max) * 100;
      return (
        <div key={tick.value}>
          <span className={GRID} style={{ top: `${pct}%` }} />
          <span
            className={`${AXIS_TEXT} absolute right-[calc(100%+8px)] -translate-y-1/2 text-right whitespace-nowrap`}
            style={{ top: `${pct}%` }}
          >
            {tick.label}
          </span>
        </div>
      );
    })}
  </>
);

const BarPlot = ({ chart }) => (
  <div className="absolute inset-x-0 top-[20px]" style={{ height: BAR_RANGE }}>
    <YAxis chart={chart} />
    <div className="absolute inset-0 flex justify-between">
      {chart.bars.map((bar) => {
        const pct = (bar.value / chart.max) * 100;
        const alert = bar.tone === 'alert';
        return (
          <div key={bar.label} className="relative h-full w-[8.58%]">
            <span
              className={`absolute inset-x-0 bottom-0 rounded-t-[8px] ${alert ? 'bg-[#c0392b]' : 'bg-[#387440]'}`}
              style={{ height: `${pct}%` }}
            />
            <span
              className={`absolute left-1/2 -translate-x-1/2 font-sans text-[12px] leading-[14px] font-semibold whitespace-nowrap ${alert ? 'text-[#902b20]' : 'text-[#1c2a21]'}`}
              style={{ bottom: `calc(${pct}% + 4px)` }}
            >
              {bar.display}
            </span>
            <span
              className={`${AXIS_TEXT} absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 font-medium whitespace-nowrap ${alert ? '!text-[#902b20]' : ''}`}
            >
              {bar.label}
            </span>
          </div>
        );
      })}
    </div>
    {chart.average ? (
      <>
        <span
          className={`absolute inset-x-0 h-[1.5px] -translate-y-1/2 ${DASH}`}
          style={{ top: `${100 - (chart.average.value / chart.max) * 100}%` }}
        />
        <span
          className="absolute right-0 -translate-y-full pb-[3px] font-sans text-[11px] leading-[13px] font-semibold whitespace-nowrap text-[#785910] max-lg:text-[12px]"
          style={{ top: `${100 - (chart.average.value / chart.max) * 100}%` }}
        >
          {chart.average.label}
        </span>
      </>
    ) : null}
  </div>
);

const LINE_LEFT = 4.29;
const LINE_SPAN = 91.2;

const LinePlot = ({ chart }) => {
  const n = chart.points.length;
  const xs = chart.points.map((_, i) => LINE_LEFT + (i * LINE_SPAN) / (n - 1));
  const ys = chart.points.map((p) => 100 - (p.value / chart.max) * 100);
  return (
    <div className="absolute inset-x-0 top-[20px]" style={{ height: LINE_RANGE }}>
      <YAxis chart={chart} />
      <svg
        className="absolute inset-0 size-full overflow-visible"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <polyline
          points={xs.map((x, i) => `${x},${ys[i]}`).join(' ')}
          fill="none"
          stroke="#387440"
          strokeWidth="3"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {chart.points.map((p, i) => {
        const warn = p.tone === 'warn';
        return (
          <div key={p.label}>
            <span
              className={`absolute size-[12px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-solid bg-white ${warn ? 'border-[#c8951a]' : 'border-[#387440]'}`}
              style={{ left: `${xs[i]}%`, top: `${ys[i]}%` }}
            />
            <span
              className="absolute -translate-x-1/2 font-sans text-[12px] leading-[14px] font-semibold whitespace-nowrap text-[#1c2a21]"
              style={{ left: `${xs[i]}%`, bottom: `calc(${100 - ys[i]}% + 12px)` }}
            >
              {p.display}
            </span>
            <span
              className={`${AXIS_TEXT} absolute top-[calc(100%+8px)] -translate-x-1/2 font-medium whitespace-nowrap`}
              style={{ left: `${xs[i]}%` }}
            >
              {p.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const ScatterPlot = ({ chart }) => {
  const px = (x) => (x / chart.xMax) * 100;
  const py = (y) => 100 - (y / chart.max) * 100;
  const { trend } = chart;
  return (
    <div className="absolute inset-x-0 top-[20px]" style={{ height: LINE_RANGE }}>
      <YAxis chart={chart} />
      {chart.xTicks.map((tick) => (
        <span
          key={tick.value}
          className={`${AXIS_TEXT} absolute top-[calc(100%+8px)] -translate-x-1/2 font-medium whitespace-nowrap`}
          style={{ left: `${px(tick.value)}%` }}
        >
          {tick.label}
        </span>
      ))}
      {chart.points.map((p) => (
        <span
          key={`${p.x}-${p.y}`}
          className="absolute size-[14px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-solid border-white bg-[#387440]"
          style={{ left: `${px(p.x)}%`, top: `${py(p.y)}%` }}
        />
      ))}
      <svg
        className="absolute inset-0 size-full overflow-visible"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <line
          x1={px(trend.x1)}
          y1={py(trend.y1)}
          x2={px(trend.x2)}
          y2={py(trend.y2)}
          stroke="#785910"
          strokeWidth="1.5"
          strokeDasharray="6 5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
};

const PLOTS = { bar: BarPlot, line: LinePlot, scatter: ScatterPlot };

export const ChartCard = ({ chart }) => {
  const Plot = PLOTS[chart.type];
  log('render', chart.type);
  if (!Plot) return null;
  return (
    <figure className="m-0 flex flex-col gap-[12px] rounded-[20px] border border-solid border-[#e7e7e7] bg-white px-[clamp(16px,1.4vw,24px)] py-[20px]">
      <figcaption className="flex flex-wrap items-center justify-between gap-x-[16px] gap-y-[8px]">
        <div className="flex min-w-0 flex-col gap-[2px]">
          <p className="m-0 font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
            {chart.title}
          </p>
          <p className="m-0 font-sans text-[12px] leading-[14px] font-normal text-[#595959]">
            {chart.sub}
          </p>
        </div>
        {chart.chip ? (
          <span className="inline-flex min-h-[32px] items-center gap-[6px] rounded-full border border-solid border-[#e1eae2] bg-white px-[14px] font-sans text-[13px] leading-[16px] font-semibold text-[#595959]">
            <LabEmojiSadIcon className="size-[14px] shrink-0 text-[#387440]" />
            {chart.chip}
          </span>
        ) : null}
      </figcaption>
      <div role="img" aria-label={`${chart.title}. ${chart.sub}. ${chart.summary}`}>
        {/* plot: 260 high; the y axis column is the 40/60 px left margin, gridlines run to the right edge */}
        <div className="relative -mr-[2px] h-[260px] pl-[44px] sm:pl-[60px]">
          <div className="relative h-full">
            <Plot chart={chart} />
          </div>
        </div>
      </div>
    </figure>
  );
};
