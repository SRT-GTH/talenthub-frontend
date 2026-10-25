/*
 * ChartGrid — gridlines + y-axis labels shared by the Trends charts (Figma "column chart" 8704:630 / "line chart" 8704:667): lines 1px #e8e8e4 with the baseline
 * #d9d9d4, labels 11/13 400 #575755 at the chart's left edge, the plot starts 44px in and ends 10px before the right edge.
 * Props: ticks [{ y, label, base }] (y in svg px), left, right (x of the plot start / end). Pure SVG fragment, aria-hidden (every chart has a table equivalent).
 */

const ChartGrid = ({ ticks, left, right }) => (
  <g aria-hidden="true">
    {ticks.map((t) => (
      <g key={t.label}>
        <line
          x1={left}
          x2={right}
          y1={t.y}
          y2={t.y}
          stroke={t.base ? '#d9d9d4' : '#e8e8e4'}
          strokeWidth="1"
          shapeRendering="crispEdges"
        />
        <text x="0" y={t.y + 4} fontSize="11" fill="#575755" fontFamily="inherit">
          {t.label}
        </text>
      </g>
    ))}
  </g>
);

export default ChartGrid;
