import { formatCount } from '../agencyFormat.js';
import { VIEW_BY, queryTitle, querySummary } from '../data/queriesData.js';
import AgencyBanner from '../AgencyBanner.jsx';

/*
 * QuerySummaryBanner — the dark-green "Your query" card under the filter bar (Figma 8597:391007 in 11.5.1a, 8597:391642 in 11.5.1b,
 * 8707:421125 in 11.5.1g):
 *   before the query is built (no ?state=results): eyebrow "Your query" · title "Volta · Technology · ages 18–24" · the hint sentence
 *   built (11.5.1b / g): eyebrow · "N attributes" + one #ebf1ec pill per attribute (12/600 #387440, r999, p 3/8) + "View by: …" · the sentence
 * With extra profile filters the sentence is the 11.5.1g one ("Groups under 5 are hidden. Ages 14–17 are not included ...").
 * ⚠️ ASSUMPTION: with no filter at all the title reads "All talents in your MoU view" (not drawn).
 */

const QuerySummaryBanner = ({ filters, result, built }) => {
  const hasExtras = Object.keys(filters.extras).length > 0;
  const count = formatCount(result.count);
  const sentence = hasExtras
    ? `${count} talents match. Groups under 5 are hidden. Ages 14–17 are not included because they can’t be combined with other filters.`
    : `${count} talents match. Save it to rerun every month, export it as CSV, or open a district to go deeper.`;

  if (!built) {
    return (
      <AgencyBanner
        eyebrow="Your query"
        title={queryTitle(filters)}
        className="min-h-[173px] justify-center"
      >
        {sentence}
      </AgencyBanner>
    );
  }

  const pills = [
    ...querySummary(filters, true),
    { key: 'by', label: `View by: ${VIEW_BY.find((v) => v.id === filters.by)?.label}` },
  ];
  return (
    <AgencyBanner eyebrow="Your query" className="min-h-[173px] justify-center">
      <div className="flex flex-col gap-[8px]">
        <div className="flex flex-wrap items-center gap-x-[8px] gap-y-[8px]">
          <span className="text-[14px] leading-[17px] font-semibold text-[#e7e7e7]">
            {pills.length} {pills.length === 1 ? 'attribute' : 'attributes'}
          </span>
          {pills.map((p) => (
            <span
              key={p.key}
              className="inline-flex rounded-full bg-[#ebf1ec] px-[8px] py-[3px] text-[12px] leading-[14px] font-semibold text-[#387440]"
            >
              {p.label}
            </span>
          ))}
        </div>
        <p className="m-0 text-[16px] leading-[22px] font-medium text-[#b9cdbd]">{sentence}</p>
      </div>
    </AgencyBanner>
  );
};

export default QuerySummaryBanner;
