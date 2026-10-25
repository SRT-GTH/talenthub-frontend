import ChartGrid from './ChartGrid.jsx';
import ChartTable from './ChartTable.jsx';
import useChartWidth from './useChartWidth.js';

/*
 * LineTrendChart — custom SVG line chart of Trends (Figma "line chart" 8704:695 cumulative 602x120, 8704:792 skill trend 560x280, 8704:999 score 600x220): 2px lines,
 * gridlines + 11px y labels like ChartGrid, a 9px dot with a 2px white ring at the last point, optional end label ("219.4k", 11/500 #1c2a21 above the dot).
 * Props: series [{ name, values, color }], labels [string] (one per point), xTicks [{ i, label }] (printed under the plot), yTicks [number], yMin, yMax, format(v),
 * height, endLabel (string for the last point of the FIRST series), caption, formatCell(v).
 * a11y: svg aria-hidden + ChartTable (sr-only), one row per point and one column per series.
 */

const LineTrendChart = ({
  series,
  labels,
  xTicks,
  yTicks,
  yMin,
  yMax,
  format,
  height,
  endLabel,
  caption,
  formatCell = (v) => String(v),
}) => {
  const [ref, w] = useChartWidth(602);
  const left = 44;
  const right = w - 12;
  const top = 10;
  const base = height - (xTicks ? 24 : 4);
  const n = labels.length;
  const x = (i) => left + ((right - left - 6) * i) / (n - 1) + 3;
  const y = (v) => base - ((v - yMin) / (yMax - yMin)) * (base - top);
  const gridTicks = yTicks.map((v) => ({ y: y(v), label: format(v), base: v === yMin }));
  return (
    <div ref={ref} className="w-full min-w-0 overflow-hidden">
      <svg
        width={w}
        height={height}
        viewBox={`0 0 ${w} ${height}`}
        aria-hidden="true"
        focusable="false"
        className="block max-w-full overflow-visible font-sans"
      >
        <ChartGrid ticks={gridTicks} left={left} right={right} />
        {[...series].reverse().map((s) => (
          <g key={s.name}>
            <path
              d={s.values.map((v, i) => `${i ? 'L' : 'M'}${x(i)} ${y(v)}`).join('')}
              fill="none"
              stroke={s.color}
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <circle
              cx={x(n - 1)}
              cy={y(s.values[n - 1])}
              r="4.5"
              fill={s.color}
              stroke="#fff"
              strokeWidth="2"
            />
          </g>
        ))}
        {endLabel ? (
          <text
            x={x(n - 1)}
            y={y(series[0].values[n - 1]) - 9}
            fontSize="11"
            fontWeight="500"
            fill="#1c2a21"
            textAnchor="end"
            fontFamily="inherit"
          >
            {endLabel}
          </text>
        ) : null}
        {xTicks
          ? xTicks.map((t) => (
              <text
                key={t.label}
                x={x(t.i)}
                y={base + 17}
                fontSize="11"
                fill="#575755"
                textAnchor="middle"
                fontFamily="inherit"
              >
                {t.label}
              </text>
            ))
          : null}
      </svg>
      <ChartTable
        caption={caption}
        headers={['Period', ...series.map((s) => s.name)]}
        rows={labels.map((l, i) => [l, ...series.map((s) => formatCell(s.values[i]))])}
      />
    </div>
  );
};

export default LineTrendChart;
