import { debug } from '../../../../utils/debug.js';

const log = debug('BarChartVisual');

const CHART_HEIGHT = 200;
const BAR_COLORS = { normal: '#387440', anomaly: '#c0392b' };

export default function BarChartVisual({ visual }) {
  log('rendering bar chart:', visual.title);

  const {
    title,
    subtitle,
    badges = [],
    xAxis,
    values,
    mean,
    anomalyIndices = [],
    anomalyLabel,
    legend = [],
    statsLine,
  } = visual;
  const maxVal = Math.max(...values) * 1.2;

  const yTicks = [];
  const step = Math.ceil(maxVal / 4 / 10) * 10;
  for (let i = 0; i <= maxVal; i += step) yTicks.push(i);

  return (
    <div className="bg-white border border-[#e8e8e4] rounded-[12px] p-[clamp(16px,2vw,24px)] mb-[clamp(14px,1.8vw,26px)]">
      {/* Header */}
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

      {/* Chart area */}
      <div className="flex">
        {/* Y-axis labels */}
        <div
          className="flex flex-col-reverse justify-between pr-[8px] shrink-0"
          style={{ height: CHART_HEIGHT }}
        >
          {yTicks.map((tick) => (
            <span
              key={tick}
              className="text-[#959592] text-[9px] font-sans leading-none text-right"
            >
              {tick}k
            </span>
          ))}
        </div>

        {/* Bars area */}
        <div className="flex-1 relative" style={{ height: CHART_HEIGHT }}>
          {/* Mean line */}
          {mean && (
            <div
              className="absolute left-0 right-0 border-t border-dashed border-[#c0392b]"
              style={{ bottom: `${(mean / maxVal) * 100}%` }}
            >
              <span className="absolute right-0 -top-[14px] text-[#c0392b] text-[8px] font-sans bg-white px-[2px]">
                avg
              </span>
            </div>
          )}

          {/* Bars */}
          <div className="flex items-end justify-around h-full gap-[4px]">
            {values.map((val, i) => {
              const isAnomaly = anomalyIndices.includes(i);
              const heightPct = (val / maxVal) * 100;
              return (
                <div
                  key={i}
                  className="flex flex-col items-center flex-1 h-full justify-end relative"
                >
                  {/* Value label */}
                  <span
                    className={`text-[9px] font-sans font-medium mb-[2px] ${isAnomaly ? 'text-[#c0392b]' : 'text-[#387440]'}`}
                  >
                    {val}k
                  </span>
                  {/* Anomaly callout */}
                  {isAnomaly && anomalyLabel && (
                    <div className="absolute -top-[12px] left-1/2 -translate-x-1/2 bg-[#fff1f2] border border-[#ebc2bd] rounded-[6px] px-[8px] py-[4px] whitespace-nowrap z-10">
                      <span className="text-[#c0392b] text-[8px] font-sans font-medium leading-tight">
                        ⚠ ANOMALY
                      </span>
                    </div>
                  )}
                  {/* Bar */}
                  <div
                    className="w-full max-w-[48px] rounded-t-[4px] transition-all"
                    style={{
                      height: `${heightPct}%`,
                      backgroundColor: isAnomaly ? BAR_COLORS.anomaly : BAR_COLORS.normal,
                      opacity: isAnomaly ? 0.7 : 0.85,
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* X-axis labels */}
      <div className="flex justify-around ml-[32px] mt-[6px]">
        {xAxis.map((label, i) => {
          const isAnomaly = anomalyIndices.includes(i);
          return (
            <span
              key={i}
              className={`text-[9px] font-sans text-center flex-1 whitespace-pre-line ${isAnomaly ? 'text-[#c0392b] font-semibold' : 'text-[#959592]'}`}
            >
              {label}
            </span>
          );
        })}
      </div>

      {/* Legend + stats */}
      <div className="flex items-center justify-between mt-[12px] flex-wrap gap-[8px]">
        <div className="flex items-center gap-[16px]">
          {legend.map((item, i) => (
            <div key={i} className="flex items-center gap-[4px]">
              <div className="size-[8px] rounded-[2px]" style={{ backgroundColor: item.color }} />
              <span className="text-[#575755] text-[9px] font-sans">{item.label}</span>
            </div>
          ))}
          {mean && (
            <div className="flex items-center gap-[4px]">
              <div className="w-[12px] h-[1px] border-t border-dashed border-[#c0392b]" />
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
