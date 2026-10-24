import { formatCount } from '../publicDataFormat.js';
import PrintBarRow from './PrintBarRow.jsx';
import PrintHeader from './PrintHeader.jsx';
import { PRINT_OUTCOMES } from './data/shareData.js';

/*
 * PrintOutcomes — Figma 8.5.1e "Outcomes · PDF export layout" (8503:448), 794×1123 px = A4 portrait. Header · title · four KPI cards ·
 * "Placements by month" column chart (12 months, axis 0–500, last month darker) · "Placements by type" bars · stories line · live-data footer.
 * The chart has a text equivalent (a visually hidden table). Props: none (SAMPLE data from shareData.js ⚠️ mock).
 */

const D = PRINT_OUTCOMES;
const PX_PER_UNIT = 35 / 100;
const BASELINE = 192;
const COL_STEP = 654 / 12;

const PrintOutcomes = () => (
  <article
    data-print-sheet=""
    aria-label={D.title}
    className="relative h-[1123px] w-[794px] overflow-hidden bg-white font-sans text-[#1c2a21]"
  >
    <PrintHeader
      title={D.headerTitle}
      pageLabel={D.pageLabel}
      className="absolute top-0 left-0 w-full"
    />
    <div className="absolute top-[84px] left-[40px] flex w-[714px] flex-col gap-[16px]">
      <h1 className="m-0 font-sans text-[24px] leading-[29px] font-semibold">{D.title}</h1>
      <div className="flex gap-[10px]">
        {D.kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="flex h-[64px] w-[171px] flex-col gap-[2px] rounded-[12px] bg-[#f2f2ee] px-[14px] py-[12px]"
          >
            <span className="font-sans text-[10px] leading-[12px] font-semibold tracking-[0.6px] text-[#595959] uppercase">
              {kpi.label}
            </span>
            <span className="font-sans text-[22px] leading-[26px] font-bold">
              {kpi.text ?? formatCount(kpi.value)}
            </span>
          </div>
        ))}
      </div>
      <h2 className="m-0 font-sans text-[15px] leading-[18px] font-semibold">{D.monthsTitle}</h2>
      <div
        className="relative h-[220px] w-[714px]"
        role="img"
        aria-label={`${D.monthsTitle}, last 12 months`}
      >
        {D.monthsAxis.map((tick) => (
          <div key={tick}>
            <span
              className="absolute left-0 w-[44px] text-right font-sans text-[11px] leading-[13px] font-medium text-[#70706e]"
              style={{ top: BASELINE - tick * PX_PER_UNIT - 7 }}
            >
              {tick}
            </span>
            <span
              className="absolute left-[52px] h-px w-[654px]"
              style={{
                top: BASELINE - tick * PX_PER_UNIT,
                backgroundColor: tick === 0 ? '#d9d9d4' : '#e8e8e4',
              }}
            />
          </div>
        ))}
        {D.months.map((month, index) => {
          const left = 62 + index * COL_STEP;
          return (
            <div key={`${month.id}-${index}`}>
              <span
                className="absolute w-[34px] rounded-[2px]"
                style={{
                  left,
                  top: BASELINE - month.value * PX_PER_UNIT,
                  height: month.value * PX_PER_UNIT,
                  backgroundColor: month.current ? '#224626' : '#387440',
                }}
              />
              <span
                className="absolute w-[34px] text-center font-sans text-[11px] leading-[13px] font-medium text-[#70706e]"
                style={{ left, top: BASELINE + 8 }}
              >
                {month.id}
              </span>
            </div>
          );
        })}
        <table className="sr-only">
          <caption>{D.monthsTitle}, November to October</caption>
          <tbody>
            {D.months.map((month, index) => (
              <tr key={`${month.id}-${index}`}>
                <th scope="row">Month {index + 1}</th>
                <td>{formatCount(month.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h2 className="m-0 font-sans text-[15px] leading-[18px] font-semibold">{D.typesTitle}</h2>
      <div className="flex flex-col gap-[16px]">
        {D.types.map((row) => (
          <PrintBarRow key={row.label} {...row} track={436} />
        ))}
      </div>
      <h2 className="m-0 font-sans text-[15px] leading-[18px] font-semibold">{D.storiesTitle}</h2>
      <p className="m-0 font-sans text-[12px] leading-[18px]">{D.stories}</p>
    </div>
    <p className="absolute top-[1089px] left-[40px] m-0 font-sans text-[10px] leading-[12px] font-medium text-[#595959]">
      {D.footer}
    </p>
  </article>
);

export default PrintOutcomes;
