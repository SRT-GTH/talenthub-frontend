import ghanaMap from '../../../../assets/public-data/share/report-ghana-map-labelled.svg';
import { classNames } from '../../../../utils/classNames.js';
import { formatCount } from '../publicDataFormat.js';
import PrintBarRow from './PrintBarRow.jsx';
import PrintHeader from './PrintHeader.jsx';
import { PRINT_OVERVIEW } from './data/shareData.js';

/*
 * PrintOverview — Figma 8.2.1h "Overview · Browser print layout (A4)" (8503:258), 794×1123 px = A4 portrait at 96 dpi.
 * Header · title · four KPI cards · map (labels printed on the regions) with the legend and the top-10 career interests as labelled bars ·
 * "Who the talents are" stack · footnote. Colours step in greyscale-safe values and every bar carries its number so a black-and-white print
 * still reads. Rendered by PrintHost (?print=1 on screen, window.print() for real). The top "browser line" of Figma (date · address · 1/3)
 * simulates the browser's own print header, so it shows on screen only.
 * Props: none (SAMPLE data from shareData.js; the overview page's own numbers are not read ⚠️ mock).
 */

const D = PRINT_OVERVIEW;

const PrintOverview = () => (
  <article
    data-print-sheet=""
    aria-label={D.title}
    className="relative h-[1123px] w-[794px] overflow-hidden bg-white font-sans text-[#1c2a21]"
  >
    <p
      aria-hidden="true"
      className="absolute top-[8px] left-[24px] m-0 font-sans text-[9px] leading-[11px] whitespace-pre text-[#595959] print:hidden"
    >
      {D.browserLine.join('                         ')}
    </p>
    <PrintHeader
      title={D.headerTitle}
      pageLabel={D.pageLabel}
      className="absolute top-[24px] left-0 w-full"
    />
    <div className="absolute top-[104px] left-[40px] flex w-[714px] flex-col gap-[16px]">
      <h1 className="m-0 font-sans text-[24px] leading-[29px] font-semibold">{D.title}</h1>
      <div className="flex gap-[10px]">
        {D.kpis.map((kpi) => (
          <div
            key={kpi.label}
            className={classNames(
              'flex h-[64px] w-[171px] flex-col gap-[2px] rounded-[12px] px-[14px] py-[12px]',
              kpi.tone === 'green' ? 'bg-[#ebf1ec]' : 'bg-[#f2f2ee]'
            )}
          >
            <span className="font-sans text-[10px] leading-[12px] font-semibold tracking-[0.6px] text-[#595959] uppercase">
              {kpi.label}
            </span>
            <span
              className={classNames(
                'font-sans text-[22px] leading-[26px] font-bold',
                kpi.tone === 'green' ? 'text-[#2a5730]' : 'text-[#1c2a21]'
              )}
            >
              {kpi.text ?? formatCount(kpi.value)}
            </span>
          </div>
        ))}
      </div>
      <div className="flex gap-[20px]">
        <img
          src={ghanaMap}
          alt="Map of Ghana's 16 regions shaded by talents per region"
          width="260"
          height="380"
          className="h-[380px] w-[260px] shrink-0"
        />
        <div className="flex w-[434px] flex-col gap-[10px]">
          <h2 className="m-0 font-sans text-[15px] leading-[18px] font-semibold">{D.mapTitle}</h2>
          <div className="flex flex-col gap-[16px]">
            <p className="m-0 font-sans text-[12px] leading-[14px] font-semibold text-[#595959]">
              Talents per region
            </p>
            {D.legend.map((bin) => (
              <div key={bin.label} className="flex items-center gap-[10px]">
                <span
                  className="h-[12px] w-[20px] rounded-[3px]"
                  style={{ backgroundColor: bin.swatch }}
                />
                <span
                  className={classNames(
                    'font-sans text-[13px] leading-[16px] font-medium',
                    bin.muted ? 'text-[#595959]' : 'text-[#1c2a21]'
                  )}
                >
                  {bin.label}
                </span>
              </div>
            ))}
          </div>
          <h2 className="m-0 font-sans text-[15px] leading-[18px] font-semibold">
            {D.interestsTitle}
          </h2>
          <div className="flex flex-col gap-[10px]">
            {D.interests.map((row) => (
              <PrintBarRow key={row.label} {...row} track={156} />
            ))}
          </div>
        </div>
      </div>
      <h2 className="m-0 font-sans text-[15px] leading-[18px] font-semibold">{D.educationTitle}</h2>
      <div className="flex w-[714px] gap-[2px] overflow-hidden rounded-[5px]">
        {D.education.map((seg) => (
          <div
            key={seg.label}
            className="flex h-[22px] items-center justify-center font-sans text-[10px] leading-[12px] font-bold"
            style={{ width: seg.width, backgroundColor: seg.bg, color: seg.fg }}
          >
            {seg.label} {seg.pct}%
          </div>
        ))}
      </div>
    </div>
    <p className="absolute top-[1063px] left-[40px] m-0 w-[714px] font-sans text-[10px] leading-[12px] font-medium text-[#595959]">
      {D.footnote}
    </p>
  </article>
);

export default PrintOverview;
