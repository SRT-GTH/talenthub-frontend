import ChartGrid from './ChartGrid.jsx';
import ChartTable from './ChartTable.jsx';
import useChartWidth from './useChartWidth.js';

/*
 * ColumnTrendChart — custom SVG column chart of Trends (Figma "column chart" 8704:630, 604x220: plot 548 wide from x 44, baseline y 196, top gridline y 10, bars 26 wide, 3 radius
 * none, #387440, the period still filling #2a5730, previous period as a faint dashed line #9fc3a5 2px "6 2"). Laid out in real pixels (useChartWidth) so labels stay 11px.
 * Bars come in two kinds: single (one value per label) or paired (`pairs`: second series in #9fc3a5, 18px bars as in "Opportunities posted" 8704:718).
 * Props: labels [string], values [number], pairs [number] (optional second series), previous [number] (optional), ticks [string] (labels to print), yTicks [number],
 * yMax, format(v) -> axis label, height (220), currentIndex (index drawn dark, default last), caption, headers (table), formatCell(v), rowNames (code -> full name for the table).
 * a11y: svg aria-hidden + ChartTable (sr-only) with the same numbers; each bar has a <title>.
 */

const ColumnTrendChart = ({
  labels,
  values,
  pairs,
  previous,
  ticks,
  yTicks,
  yMax,
  format,
  height = 220,
  barWidth,
  currentIndex = values.length - 1,
  caption,
  headers,
  formatCell = (v) => String(v),
  rowNames,
}) => {
  const [ref, w] = useChartWidth(602);
  const left = 44;
  const right = w - 10;
  const base = height - 24;
  const top = 10;
  const plotH = base - top;
  const n = values.length;
  const pitch = (right - left) / n;
  const single = !pairs;
  const bw = barWidth ?? (single ? Math.min(26, pitch * 0.57) : Math.min(18, pitch * 0.4));
  const y = (v) => base - (v / yMax) * plotH;
  const gridTicks = yTicks.map((v) => ({ y: y(v), label: format(v), base: v === 0 }));
  const showLabel = (l) => !ticks || ticks.includes(l);
  const prevPath = previous
    ? previous.map((v, i) => `${i ? 'L' : 'M'}${left + pitch * i + pitch / 2} ${y(v)}`).join('')
    : null;
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
        {values.map((v, i) => {
          const cx = left + pitch * i + pitch / 2;
          const x = single ? cx - bw / 2 : cx - bw - 1;
          const dark = i === currentIndex && single;
          return (
            <g key={labels[i]}>
              <rect
                x={x}
                y={y(v)}
                width={bw}
                height={Math.max(0, base - y(v))}
                fill={dark ? '#2a5730' : '#387440'}
              >
                <title>{`${labels[i]}: ${formatCell(v)}`}</title>
              </rect>
              {pairs ? (
                <rect
                  x={cx + 1}
                  y={y(pairs[i])}
                  width={bw}
                  height={Math.max(0, base - y(pairs[i]))}
                  fill="#9fc3a5"
                >
                  <title>{`${labels[i]}: ${formatCell(pairs[i])}`}</title>
                </rect>
              ) : null}
              {showLabel(labels[i]) ? (
                <text
                  x={cx}
                  y={base + 17}
                  fontSize="11"
                  fill="#575755"
                  textAnchor="middle"
                  fontFamily="inherit"
                >
                  {labels[i]}
                </text>
              ) : null}
            </g>
          );
        })}
        {prevPath ? (
          <path
            d={prevPath}
            fill="none"
            stroke="#9fc3a5"
            strokeWidth="2"
            strokeDasharray="6 2"
            strokeLinejoin="round"
          />
        ) : null}
      </svg>
      <ChartTable
        caption={caption}
        headers={headers}
        rows={labels.map((l, i) => [
          rowNames?.[l] ? `${rowNames[l]} (${l})` : l,
          formatCell(values[i]),
          ...(pairs ? [formatCell(pairs[i])] : []),
          ...(previous ? [formatCell(previous[i])] : []),
        ])}
      />
    </div>
  );
};

export default ColumnTrendChart;
