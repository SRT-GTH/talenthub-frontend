import gthLogo from '../../../../../assets/public-data/gth-logo.png';
import coverPhoto from '../../../../../assets/public-data/share/report-cover-photo.webp';
import { formatCount } from '../../publicDataFormat.js';
import { REPORT_COVER } from '../data/shareData.js';
import ReportSheet from './ReportSheet.jsx';
import { at } from './reportLayout.js';

/*
 * ReportCover — "GTH Report · Page / Cover" (Figma 8898:11637, page 8.8.1b v2 = 8898:483505). Logo + brand, eyebrow, two-line title (second
 * line green), intro, "Prepared for" note (3px green rule on the left), the big total, a leaf-shaped cover photo (radii 250 / 24) with
 * decorative leaves (small #ebf1ec, green stat leaf "16", gold). Props: pages (total, for the sheet's accessible name).
 */

const D = REPORT_COVER;

const ReportCover = ({ pages }) => (
  <ReportSheet page={1} pages={pages}>
    <img src={gthLogo} alt="" width="48" height="44" style={at(48, 40, 48, 44)} />
    <p className="m-0 font-heading text-[17px] leading-[20px] font-semibold" style={at(108, 52)}>
      {D.brand}
    </p>
    <div className="flex flex-col gap-[18px]" style={at(48, 176, 440)}>
      <p className="m-0 font-sans text-[10px] leading-[12px] font-bold tracking-[1px] text-[#387440] uppercase">
        {D.eyebrow}
      </p>
      <h1 className="m-0 font-heading text-[54px] leading-[57px] font-semibold tracking-[-1.08px]">
        {D.titleLines[0]}
        <br />
        <span className="text-[#387440]">{D.titleLines[1]}</span>
      </h1>
      <p className="m-0 font-sans text-[13px] leading-[20px] text-[#575755]">{D.intro}</p>
      <div className="flex w-[327px] flex-col gap-[4px] border-l-[3px] border-solid border-[#387440] py-[4px] pl-[16px]">
        <span className="font-sans text-[9px] leading-[11px] font-bold tracking-[0.9px] text-[#575755] uppercase">
          {D.preparedLabel}
        </span>
        <span className="font-heading text-[19px] leading-[24px] font-medium">{D.preparedFor}</span>
      </div>
    </div>
    <p
      className="m-0 font-heading text-[68px] leading-[82px] font-semibold tracking-[-1.36px] text-[#387440]"
      style={at(48, 582)}
    >
      {formatCount(D.bigNumber)}
    </p>
    <p className="m-0 font-sans text-[13px] leading-[16px]" style={at(50, 666)}>
      {D.bigNumberLabel}
    </p>
    <p className="m-0 font-sans text-[9px] leading-[11px] text-[#575755]" style={at(48, 758)}>
      {D.footer}
    </p>
    <span
      aria-hidden="true"
      className="bg-[#ebf1ec]"
      style={{ ...at(500, 64, 44, 44), borderRadius: '22px 6px 22px 6px' }}
    />
    <img
      src={coverPhoto}
      alt="A smiling young woman holding a laptop on a tree-lined campus path"
      width="500"
      height="666"
      className="block"
      style={at(560, 64, 500, 666)}
    />
    <div
      className="bg-[#387440] text-center text-white"
      style={{ ...at(486, 556, 196, 196), borderRadius: '98px 14px 98px 14px' }}
    >
      <p
        className="m-0 font-heading text-[58px] leading-[70px] font-semibold"
        style={at(0, 40, 196)}
      >
        {formatCount(D.leafStat)}
      </p>
      <p className="m-0 font-sans text-[12px] leading-[16px]" style={at(0, 116, 196)}>
        {D.leafStatLabel[0]}
        <br />
        {D.leafStatLabel[1]}
      </p>
    </div>
    <span
      aria-hidden="true"
      className="bg-[#c8951a]"
      style={{ ...at(1012, 690, 40, 40), borderRadius: '20px 4px 20px 4px' }}
    />
  </ReportSheet>
);

export default ReportCover;
