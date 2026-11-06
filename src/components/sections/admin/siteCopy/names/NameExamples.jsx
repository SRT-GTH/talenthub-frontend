import { renderExample } from './productNameRules.js';

/*
 * NameExamples — "EXAMPLES" of the rename drawer (7.8.6b): one 43 px row (r12, 1px #e7e7e7, 12 padding) per sentence, the old wording 14/400 #575755,
 * an arrow "→" 14/700, the new wording 14/600 #1c2a21. The new wording follows what is typed in the fields.
 * Props: examples [{ template, before }], values { name, short }, current (the item, for the fallback when a field is empty).
 */
const NameExamples = ({ examples, values, current }) => (
  <section aria-label="Examples" className="flex flex-col gap-[18px]">
    <h3 className="m-0 font-sans text-[12px] leading-[14px] font-bold tracking-[0.48px] text-[#575755]">
      EXAMPLES
    </h3>
    <ul className="m-0 flex list-none flex-col gap-[18px] p-0">
      {examples.map((ex) => (
        <li
          key={ex.template}
          className="flex flex-wrap items-center gap-x-[10px] gap-y-[2px] rounded-[12px] border border-solid border-[#e7e7e7] p-[12px] font-sans text-[14px] leading-[17px]"
        >
          <span className="min-w-0 flex-1 basis-[200px] font-normal text-[#575755]">
            {ex.before}
          </span>
          <span aria-hidden="true" className="font-bold text-[#575755]">
            →
          </span>
          <span className="min-w-0 flex-1 basis-[200px] font-semibold text-[#1c2a21]">
            <span className="sr-only">becomes </span>
            {renderExample(ex.template, values, current)}
          </span>
        </li>
      ))}
    </ul>
  </section>
);

export default NameExamples;
