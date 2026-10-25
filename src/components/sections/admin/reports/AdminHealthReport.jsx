import { Link } from 'react-router-dom';
import AgencyButton from '../../agency/AgencyButton.jsx';
import AgencyPageHero from '../../agency/AgencyPageHero.jsx';
import TrendCard from '../../publicData/outcomes/TrendCard.jsx';
import { AdminInfoCircleIcon } from '../adminIcons.jsx';
import { HEALTH } from './data/adminReportsData.js';

/*
 * AdminHealthReport — /admin/reports/health (Figma 7.3.1a "Reports · Platform health" 8635:8): green hero "Platform health report" + "Download PDF" · breadcrumb "Reports ›
 * Platform health" · four chart cards in a 2 x 2 grid (the Theme 8 Growth-trends card: header title 18/21 600 + aside, headline 30/36 700 #2a5730 + delta 14/17 600,
 * custom SVG chart 220 high; the Flags resolved chart opens with its W10 tooltip pinned as drawn) · the 13 #595959 footnote with its 16 info-circle icon.
 * Props: onDownload().
 */

const AdminHealthReport = ({ onDownload }) => (
  <div className="flex flex-col gap-[30px]">
    <AgencyPageHero
      title={HEALTH.title}
      subtitle={HEALTH.subtitle}
      actions={<AgencyButton onClick={onDownload}>Download PDF</AgencyButton>}
    />
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-[8px] font-sans text-[14px] leading-[17px]"
    >
      <Link
        to="/admin/reports"
        className="font-semibold text-[#387440] no-underline hover:underline"
      >
        Reports
      </Link>
      <span aria-hidden="true" className="text-[#595959]">
        ›
      </span>
      <span aria-current="page" className="font-medium text-[#1c2a21]">
        Platform health
      </span>
    </nav>
    <div className="grid grid-cols-1 gap-[24px] xl:grid-cols-2">
      {HEALTH.charts.map((c) => (
        <TrendCard key={c.id} chart={c} />
      ))}
    </div>
    <p className="m-0 flex items-center gap-[8px] font-sans text-[13px] leading-[16px] text-[#595959]">
      <AdminInfoCircleIcon className="size-[16px] shrink-0" />
      {HEALTH.note}
    </p>
  </div>
);

export default AdminHealthReport;
