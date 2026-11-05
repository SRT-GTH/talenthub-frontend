import { debug } from '../../../../utils/debug.js';
import flagGlyph from '../../../../assets/parent/review-flag.svg';
import { ASSESSMENT } from './data/reviewData.js';

const log = debug('AssessmentResults');

/*
 * AssessmentResults — PR-04 "Assessment results · review and flag" (Figma 10034:146870, card 10034:147481): white, r24, #e7e7e7 hairline, soft shadow, p22, gap30. The green "Personality profile · Abena ·
 * completed 12 Oct" pill (#ebf1ec, #c1d4c4 hairline, 13/600 #387440), "The Architect" 28/600 over a 15 #575755 line (max 860), then four trait rows: 14/500 name (200), a 520 x 10 track (#eceee9) with a
 * #387440 fill of the percentile, the 13/600 "88th percentile" label exactly as Figma prints it (the "72th" / "41th" typos are Figma's and are kept), and a 14px flag glyph + "Flag" link.
 * Props: flagged (trait ids already flagged), onFlag(trait).
 * Below lg the track fills the row and the percentile + Flag drop beneath the name so nothing scrolls sideways.
 */
const AssessmentResults = ({ flagged = [], onFlag }) => {
  log('render', { flagged });
  return (
    <section
      aria-label="Personality profile results"
      className="flex flex-col gap-[30px] rounded-[24px] border border-solid border-black-light bg-white p-[22px] shadow-[0_5px_17px_rgba(28,42,33,0.03)] max-sm:p-[16px]"
    >
      <span className="inline-flex h-[32px] items-center self-start rounded-full border border-solid border-brand-green-light-active bg-brand-green-light px-[14px] font-sans text-[13px] leading-[16px] font-semibold text-brand-green">
        {ASSESSMENT.chip}
      </span>

      <div className="flex max-w-[860px] flex-col gap-[8px] font-sans">
        <h2 className="m-0 text-[28px] leading-[35px] font-semibold tracking-[-0.14px] text-[#1c2a21]">
          {ASSESSMENT.type}
        </h2>
        <p className="m-0 text-[15px] leading-[18px] text-[#575755]">{ASSESSMENT.body}</p>
      </div>

      <ul className="m-0 flex list-none flex-col gap-[30px] p-0">
        {ASSESSMENT.traits.map((t) => {
          const isFlagged = flagged.includes(t.id);
          return (
            <li
              key={t.id}
              className="flex flex-wrap items-center gap-x-[14px] gap-y-[8px] font-sans lg:flex-nowrap"
            >
              <span className="w-[200px] shrink-0 text-[14px] leading-[17px] font-medium text-[#1c2a21] max-lg:w-full">
                {t.name}
              </span>
              <span
                role="img"
                aria-label={`${t.name}: ${t.page}`}
                className="h-[10px] w-[520px] max-w-full shrink-0 overflow-hidden rounded-full bg-[#eceee9] max-lg:w-auto max-lg:flex-1"
              >
                <span
                  className="block h-full rounded-full bg-brand-green"
                  style={{ width: `${t.pct}%` }}
                />
              </span>
              <span className="w-[89px] shrink-0 text-[13px] leading-[16px] font-semibold whitespace-nowrap text-[#575755] max-lg:w-auto">
                {t.page}
              </span>
              <button
                type="button"
                disabled={isFlagged}
                onClick={() => {
                  log('flag', { trait: t.id });
                  onFlag?.(t);
                }}
                className="inline-flex shrink-0 cursor-pointer items-center gap-[6px] border-0 bg-transparent p-0 font-sans text-[13px] leading-[16px] font-semibold text-[#575755] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green disabled:cursor-default"
              >
                <img src={flagGlyph} alt="" aria-hidden="true" className="size-[14px]" />
                {isFlagged ? ASSESSMENT.flagged : ASSESSMENT.flag}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default AssessmentResults;
