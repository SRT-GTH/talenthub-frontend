import { USAGE_PLACES } from './productNamesData.js';

/*
 * NameUsageTiles — "WHERE IT’S USED" of the rename drawer (7.8.6b): one #f8f8f4 tile (r12, 10/14 padding) per place with the count 18/600 and its
 * label 12.5/500 #575755 — Public site 14 · Talent 212 · Parent 18 · Recruiter 9 · Institution 4 · Emails 23 · Assistant replies "All".
 * Props: usage { public, talent, parent, recruiter, institution, emails, assistant }.
 */
const NameUsageTiles = ({ usage }) => (
  <section aria-label="Where it’s used" className="flex flex-col gap-[18px]">
    <h3 className="m-0 font-sans text-[12px] leading-[14px] font-bold tracking-[0.48px] text-[#575755]">
      WHERE IT’S USED
    </h3>
    <ul className="m-0 flex list-none flex-wrap gap-[8px] p-0">
      {USAGE_PLACES.map(({ key, label }) => (
        <li
          key={key}
          className="flex flex-col gap-[2px] rounded-[12px] bg-[#f8f8f4] px-[14px] py-[10px]"
        >
          <span className="font-sans text-[18px] leading-[21px] font-semibold text-[#1c2a21]">
            {usage[key] ?? 0}
          </span>
          <span className="font-sans text-[12.5px] leading-[15px] font-medium text-[#575755]">
            {label}
          </span>
        </li>
      ))}
    </ul>
  </section>
);

export default NameUsageTiles;
