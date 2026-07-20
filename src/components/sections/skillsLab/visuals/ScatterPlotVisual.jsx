import { debug } from '../../../../utils/debug.js';

const log = debug('ScatterPlotVisual');

const CHART_PADDING = { left: 50, right: 20, top: 20, bottom: 40 };

export default function ScatterPlotVisual({ visual }) {
  log('rendering scatter plot:', visual.title);

  const {
    title,
    subtitle,
    badges = [],
    xAxisLabel,
    yAxisLabel,
    points,
    outlier,
    legend = [],
  } = visual;

  const allPoints = [...points, outlier].filter(Boolean);
  const maxX = Math.max(...allPoints.map((p) => p.x)) * 1.2;
  const maxY = Math.max(...allPoints.map((p) => p.y)) * 1.2;

  const svgWidth = 700;
  const svgHeight = 280;
  const plotW = svgWidth - CHART_PADDING.left - CHART_PADDING.right;
  const plotH = svgHeight - CHART_PADDING.top - CHART_PADDING.bottom;

  const toX = (v) => CHART_PADDING.left + (v / maxX) * plotW;
  const toY = (v) => CHART_PADDING.top + plotH - (v / maxY) * plotH;

  const xTicks = [];
  const xStep = Math.ceil(maxX / 6 / 10) * 10;
  for (let i = 0; i <= maxX; i += xStep) xTicks.push(i);

  const yTicks = [];
  const yStep = Math.ceil(maxY / 4 / 10) * 10;
  for (let i = 0; i <= maxY; i += yStep) yTicks.push(i);

  // Trend line via simple linear regression on normal points
  const n = points.length;
  const sumX = points.reduce((s, p) => s + p.x, 0);
  const sumY = points.reduce((s, p) => s + p.y, 0);
  const sumXY = points.reduce((s, p) => s + p.x * p.y, 0);
  const sumX2 = points.reduce((s, p) => s + p.x * p.x, 0);
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return (
    <div className="bg-white border border-[#e8e8e4] rounded-[12px] p-[clamp(16px,2vw,24px)] mb-[clamp(14px,1.8vw,26px)]">
      <div className="flex items-start justify-between mb-[16px]">
        <div>
          <h4 className="text-[#111] text-[14px] font-sans font-semibold leading-normal m-0">
            {title}
          </h4>
          {subtitle && (
            <p className="text-[#959592] text-[10px] font-sans leading-normal m-0 mt-[2px]">
              {subtitle}
            </p>
          )}
        </div>
        {badges.length > 0 && (
          <div className="flex items-center gap-[8px]">
            {badges.map((badge, i) => (
              <span
                key={i}
                className={`px-[10px] py-[4px] rounded-[12px] text-[10px] font-sans font-medium ${
                  badge.startsWith('⚠')
                    ? 'bg-[#fff1f2] text-[#c0392b] border border-[#ebc2bd]'
                    : 'bg-[#f8f8f4] text-[#575755] border border-[#e8e8e4]'
                }`}
              >
                {badge}
              </span>
            ))}
          </div>
        )}
      </div>

      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full"
        style={{ maxHeight: '300px' }}
      >
        {/* Grid lines */}
        {yTicks.map((tick) => (
          <g key={`y-${tick}`}>
            <line
              x1={CHART_PADDING.left}
              y1={toY(tick)}
              x2={svgWidth - CHART_PADDING.right}
              y2={toY(tick)}
              stroke="#f0f0f0"
              strokeWidth="0.5"
            />
            <text
              x={CHART_PADDING.left - 8}
              y={toY(tick) + 3}
              textAnchor="end"
              fill="#959592"
              fontSize="9"
              fontFamily="sans-serif"
            >
              {tick}k
            </text>
          </g>
        ))}
        {xTicks.map((tick) => (
          <text
            key={`x-${tick}`}
            x={toX(tick)}
            y={svgHeight - 8}
            textAnchor="middle"
            fill="#959592"
            fontSize="9"
            fontFamily="sans-serif"
          >
            {tick}k
          </text>
        ))}

        {/* Axis labels */}
        {yAxisLabel && (
          <text
            x={12}
            y={svgHeight / 2}
            textAnchor="middle"
            fill="#959592"
            fontSize="9"
            fontFamily="sans-serif"
            transform={`rotate(-90, 12, ${svgHeight / 2})`}
          >
            {yAxisLabel}
          </text>
        )}
        {xAxisLabel && (
          <text
            x={svgWidth / 2}
            y={svgHeight - 2}
            textAnchor="middle"
            fill="#959592"
            fontSize="9"
            fontFamily="sans-serif"
          >
            {xAxisLabel}
          </text>
        )}

        {/* Trend line */}
        <line
          x1={toX(0)}
          y1={toY(intercept)}
          x2={toX(maxX)}
          y2={toY(slope * maxX + intercept)}
          stroke="#959592"
          strokeWidth="1"
          strokeDasharray="6 3"
          opacity="0.5"
        />
        <text
          x={toX(maxX) - 10}
          y={toY(slope * maxX + intercept) - 8}
          textAnchor="end"
          fill="#959592"
          fontSize="9"
          fontFamily="sans-serif"
          fontStyle="italic"
        >
          trend ↗
        </text>

        {/* Normal points */}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={toX(p.x)} cy={toY(p.y)} r="6" fill="#387440" />
            <text
              x={toX(p.x) + 8}
              y={toY(p.y) - 2}
              fill="#575755"
              fontSize="8"
              fontFamily="sans-serif"
            >
              ~{p.label}
            </text>
          </g>
        ))}

        {/* Outlier */}
        {outlier && (
          <g>
            <circle cx={toX(outlier.x)} cy={toY(outlier.y)} r="10" fill="#c0392b" opacity="0.8" />
            <circle
              cx={toX(outlier.x)}
              cy={toY(outlier.y)}
              r="16"
              fill="none"
              stroke="#c0392b"
              strokeWidth="1.5"
              opacity="0.3"
            />
            <text
              x={toX(outlier.x) + 16}
              y={toY(outlier.y) + 4}
              fill="#c0392b"
              fontSize="10"
              fontWeight="600"
              fontFamily="sans-serif"
            >
              {outlier.label} ⚠
            </text>
          </g>
        )}
      </svg>

      <div className="flex items-center gap-[16px] mt-[8px]">
        {legend.map((item, i) => (
          <div key={i} className="flex items-center gap-[4px]">
            <div className="size-[8px] rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-[#575755] text-[9px] font-sans">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
