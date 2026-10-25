import gthLogo from '../../../../assets/public-data/gth-logo.png';
import qr from '../../../../assets/public-data/share/report-verify-qr.svg';
import { classNames } from '../../../../utils/classNames.js';
import ReportFooter from '../../publicData/share/report/ReportFooter.jsx';
import ReportPageHeader from '../../publicData/share/report/ReportPageHeader.jsx';
import ReportSheet from '../../publicData/share/report/ReportSheet.jsx';
import { at } from '../../publicData/share/report/reportLayout.js';
import { AGENCY_REPORT_FOOTER, AGENCY_REPORT_METHOD as D } from './data/reportData.js';

/*
 * AgencyReportMethod — page 8 (Figma 11.4.4p v2, 8932:19360): six method blocks, the data-as-of line and the dark back panel with the logo tile,
 * "Check this report is real", the verification QR + link and the contact line. ⚠️ ASSUMPTION: the QR is the Theme 8 static sample export,
 * not a working code (Figma draws an image). Props: pages (total).
 */

const AgencyReportMethod = ({ pages }) => (
  <ReportSheet page={8} pages={pages}>
    <ReportPageHeader eyebrow={D.eyebrow} title={D.title} sub={D.sub} width={600} />
    {D.blocks.map((block) => (
      <div key={block.title}>
        <span
          aria-hidden="true"
          className={classNames(block.strong ? 'bg-[#387440]' : 'bg-[#ebf1ec]')}
          style={at(block.x, block.y, 300, 2)}
        />
        <h2
          className="m-0 font-heading text-[17px] leading-[20px] font-semibold"
          style={at(block.x, block.y + 14)}
        >
          {block.title}
        </h2>
        <p
          className="m-0 font-sans text-[11.5px] leading-[17px] text-[#575755]"
          style={at(block.x, block.y + 42, 290)}
        >
          {block.text}
        </p>
      </div>
    ))}
    <p
      className="m-0 font-sans text-[10.5px] leading-[13px] font-medium whitespace-pre"
      style={at(48, 672)}
    >
      {D.dataLine}
    </p>
    <div className="bg-[#142916]" style={at(743, 0, 380, 794)} />
    <span aria-hidden="true" className="rounded-[12px] bg-white" style={at(773, 48, 76, 68)} />
    <img src={gthLogo} alt="" width="56" height="52" style={at(783, 56, 56, 52)} />
    <p
      className="m-0 font-heading text-[20px] leading-[24px] font-semibold text-white"
      style={at(783, 122)}
    >
      Ghana Talent Hub
    </p>
    <h2
      className="m-0 font-heading text-[22px] leading-[26px] font-semibold text-white"
      style={at(783, 300, 300)}
    >
      {D.backTitle}
    </h2>
    <p
      className="m-0 font-sans text-[11.5px] leading-[17px] text-white/80"
      style={at(783, 336, 290)}
    >
      {D.backText}
    </p>
    <span className="rounded-[10px] bg-white" style={at(783, 410, 150, 150)}>
      <img
        src={qr}
        alt="QR code that opens the report verification page"
        width="150"
        height="150"
      />
    </span>
    <p
      className="m-0 font-['DM_Mono',monospace] text-[11px] leading-[14px] text-white"
      style={at(783, 578)}
    >
      {D.verifyUrl}
    </p>
    <p className="m-0 font-sans text-[11px] leading-[16px] text-white/80" style={at(783, 640)}>
      {D.questions[0]}
      <br />
      {D.questions[1]}
    </p>
    <ReportFooter text={AGENCY_REPORT_FOOTER} page="08" pageLeft={1060} pageOnDark />
  </ReportSheet>
);

export default AgencyReportMethod;
