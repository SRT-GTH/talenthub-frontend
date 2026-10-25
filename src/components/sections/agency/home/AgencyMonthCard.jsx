import AgencyButton from '../AgencyButton.jsx';
import { formatCount } from '../agencyFormat.js';
import { MONTH_STATS as M } from './data/agencyHomeData.js';

/*
 * AgencyMonthCard — "This month" stats card (Figma 8597:398361, 878 x 173, white, 1.5 #e5e5e5, r16, p 20/22, gap 24): the "This month" button on the
 * right (decorative range label, ⚠️ ASSUMPTION: the range switch is not drawn), three stat columns (label 16/24 #999, value 22/28 600) split by
 * #dfdfdc dividers, and the three-bar glyph (Group 41232, 266 x 64) at the bottom right.
 * Props: queriesRun (number), dataRequests (number), csvExports (number).
 */

const AgencyMonthCard = ({
  queriesRun,
  dataRequests = M.dataRequests,
  csvExports = M.csvExports,
  className,
}) => {
  const stats = [
    { id: 'queries', label: 'Queries run', value: queriesRun, ink: '#1f4a2b' },
    { id: 'requests', label: 'Data requests', value: dataRequests, ink: '#32683a' },
    { id: 'csv', label: 'CSV exports', value: csvExports, ink: '#32683a' },
  ];
  return (
    <section
      aria-label="This month"
      className={`flex min-w-0 flex-col gap-[24px] rounded-[16px] border-[1.5px] border-solid border-[#e5e5e5] bg-white px-[22px] py-[20px] shadow-[0_1px_2px_rgba(15,15,10,0.05)] ${className ?? ''}`}
    >
      <div className="flex justify-end">
        <AgencyButton size="md" aria-label="Range: this month" aria-disabled="true">
          {M.title}
        </AgencyButton>
      </div>
      <div className="flex flex-wrap items-end justify-between gap-x-[24px] gap-y-[16px]">
        <dl className="m-0 flex items-stretch gap-[clamp(12px,3vw,48px)]">
          {stats.map((s, i) => (
            <div key={s.id} className="flex items-stretch gap-[clamp(12px,3vw,48px)]">
              {i > 0 ? (
                <span aria-hidden="true" className="w-px self-stretch bg-[#dfdfdc]" />
              ) : null}
              <div className="flex flex-col items-center gap-[6px] px-[16px] pt-[3px]">
                <dt className="font-sans text-[16px] leading-[24px] tracking-[0.2px] text-[#999999]">
                  {s.label}
                </dt>
                <dd
                  style={{ color: s.ink }}
                  className="m-0 font-sans text-[22px] leading-[28px] font-semibold tracking-[-0.11px]"
                >
                  {formatCount(s.value)}
                </dd>
              </div>
            </div>
          ))}
        </dl>
        <svg
          aria-hidden="true"
          viewBox="0 0 266 64"
          className="hidden h-[64px] w-[266px] shrink-0 md:block"
        >
          <rect x="0" y="32" width="128" height="32" fill="#f3f8f4" />
          <rect x="32" y="16" width="128" height="48" fill="#a7f4bb" fillOpacity="0.5" />
          <rect x="137" y="0" width="128" height="64" fill="#00522b" fillOpacity="0.2" />
        </svg>
      </div>
    </section>
  );
};

export default AgencyMonthCard;
