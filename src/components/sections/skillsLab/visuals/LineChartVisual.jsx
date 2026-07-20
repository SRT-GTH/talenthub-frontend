import { debug } from '../../../../utils/debug.js';

const log = debug('LineChartVisual');

const CHART_HEIGHT = 200;
const CHART_PADDING = { left: 40, right: 20, top: 20, bottom: 30 };

export default function LineChartVisual({ visual }) {
  log('rendering line chart:', visual.title);

  const {
    title,
    subtitle,
    badges = [],
    xAxis,
    values,
    mean,
    anomalyIndices = [],
    legend = [],
    statsLine,
  } = visual;
  const maxVal = Math.max(...values) * 1.25;
  const svgWidth = 700;
  const svgHeight = CHART_HEIGHT + CHART_PADDING.top + CHART_PADDING.bottom;
  const plotW = svgWidth - CHART_PADDING.left - CHART_PADDING.right;
  const plotH = CHART_HEIGHT;

  const toX = (i) => CHART_PADDING.left + (i / (values.length - 1)) * plotW;
  const toY = (v) => CHART_PADDING.top + plotH - (v / maxVal) * plotH;

  const linePath = values.map((v, i) => `${i === 0 ? 'M' : 'L'}${toX(i)},${toY(v)}`).join(' ');
  const areaPath = `${linePath} L${toX(values.length - 1)},${toY(0)} L${toX(0)},${toY(0)} Z`;

  const yTicks = [];
  const step = Math.ceil(maxVal / 4 / 10) * 10;
  for (let i = 0; i <= maxVal; i += step) yTicks.push(i);

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
        style={{ maxHeight: '260px' }}
      >
        {/* Y-axis ticks */}
        {yTicks.map((tick) => (
          <g key={tick}>
            <line
              x1={CHART_PADDING.left}
              y1={toY(tick)}
              x2={svgWidth - CHART_PADDING.right}
              y2={toY(tick)}
              stroke="#f0f0f0"
              strokeWidth="0.5"
            />
            <text
              x={CHART_PADDING.left - 6}
              y={toY(tick) + 3}
              textAnchor="end"
              fill="#959592"
              fontSize="10"
              fontFamily="sans-serif"
            >
              {tick}k
            </text>
          </g>
        ))}

        {/* Mean dashed line */}
        {mean && (
          <line
            x1={CHART_PADDING.left}
            y1={toY(mean)}
            x2={svgWidth - CHART_PADDING.right}
            y2={toY(mean)}
            stroke="#387440"
            strokeWidth="1"
            strokeDasharray="4 3"
            opacity="0.5"
          />
        )}

        {/* Area fill */}
        <path d={areaPath} fill="#387440" opacity="0.08" />

        {/* Line */}
        <path d={linePath} fill="none" stroke="#387440" strokeWidth="2" strokeLinejoin="round" />

        {/* Data points */}
        {values.map((v, i) => {
          const isAnomaly = anomalyIndices.includes(i);
          return (
            <g key={i}>
              <circle
                cx={toX(i)}
                cy={toY(v)}
                r={isAnomaly ? 8 : 4}
                fill={isAnomaly ? '#c0392b' : '#387440'}
                opacity={isAnomaly ? 0.8 : 1}
              />
              {isAnomaly && (
                <circle
                  cx={toX(i)}
                  cy={toY(v)}
                  r={12}
                  fill="none"
                  stroke="#c0392b"
                  strokeWidth="1.5"
                  opacity="0.4"
                />
              )}
              <text
                x={toX(i)}
                y={toY(v) - 12}
                textAnchor="middle"
                fill={isAnomaly ? '#c0392b' : '#387440'}
                fontSize="10"
                fontWeight="600"
                fontFamily="sans-serif"
              >
                {v}k
              </text>
            </g>
          );
        })}

        {/* X-axis labels */}
        {xAxis.map((label, i) => (
          <text
            key={i}
            x={toX(i)}
            y={svgHeight - 5}
            textAnchor="middle"
            fill={anomalyIndices.includes(i) ? '#c0392b' : '#959592'}
            fontSize="9"
            fontWeight={anomalyIndices.includes(i) ? '600' : '400'}
            fontFamily="sans-serif"
          >
            {label.split('\n').map((line, li) => (
              <tspan key={li} x={toX(i)} dy={li === 0 ? 0 : 12}>
                {line}
              </tspan>
            ))}
          </text>
        ))}
      </svg>

      <div className="flex items-center justify-between mt-[12px] flex-wrap gap-[8px]">
        <div className="flex items-center gap-[16px]">
          {legend.map((item, i) => (
            <div key={i} className="flex items-center gap-[4px]">
              <div className="size-[8px] rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-[#575755] text-[9px] font-sans">{item.label}</span>
            </div>
          ))}
          {mean && (
            <div className="flex items-center gap-[4px]">
              <div className="w-[12px] h-[1px] border-t border-dashed border-[#387440]" />
              <span className="text-[#575755] text-[9px] font-sans">Mean = {mean}k</span>
            </div>
          )}
        </div>
        {statsLine && (
          <span className="text-[#c0392b] text-[9px] font-sans font-medium">{statsLine}</span>
        )}
      </div>
    </div>
  );
}
