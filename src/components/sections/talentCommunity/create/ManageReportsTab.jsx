import Button from '../../../ui/Button.jsx';
import { MANAGE_COPY } from './createCommunityData.js';
import { Pill } from './CreateDialogParts.jsx';
import ManageModerators from './ManageModerators.jsx';

/*
 * ManageReportsTab — Figma CC-10: the open report (reason pill, "Reported by …", the quoted post, "Keep post" /
 * "Remove and warn") followed by the Moderators list. Props: community, onKeep(report), onRemove(report), onRemind(mod).
 */
const ManageReportsTab = ({ community, onKeep, onRemove, onRemind }) => (
  <>
    {community.reports.length === 0 ? (
      <p className="m-0 font-sans text-[14px] leading-[20px] text-[#737373]">
        {MANAGE_COPY.noReports}
      </p>
    ) : (
      community.reports.map((report) => (
        <article
          key={report.id}
          className="flex flex-col gap-[8px] rounded-[16px] border border-solid border-[#e6e6e6] bg-white p-[16px]"
        >
          <div className="flex flex-wrap items-center gap-[8px]">
            <Pill tone="gold">{report.reason}</Pill>
            <span className="font-sans text-[12px] font-normal leading-[14px] text-[#737373]">
              {report.reportedBy}
            </span>
          </div>
          <p className="m-0 font-sans text-[14px] font-medium leading-[20px] text-[#1c2a21]">
            {report.quote}
          </p>
          <p className="m-0 font-sans text-[12px] font-normal leading-[14px] text-[#737373]">
            {report.note}
          </p>
          <div className="flex flex-wrap items-center gap-[10px]">
            <Button variant="tertiary" size="lg" onClick={() => onKeep(report)}>
              {MANAGE_COPY.keep}
            </Button>
            <Button variant="primary" size="sm" onClick={() => onRemove(report)}>
              {MANAGE_COPY.remove}
            </Button>
          </div>
        </article>
      ))
    )}
    <ManageModerators moderators={community.moderators} onRemind={onRemind} />
  </>
);

export default ManageReportsTab;
