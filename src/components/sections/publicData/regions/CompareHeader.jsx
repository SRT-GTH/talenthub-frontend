import { classNames } from '../../../../utils/classNames.js';
import { COMPARE_MAX, COMPARE_MIN } from './data/regionsData.js';

/*
 * CompareHeader — title row of the compare page (Figma 8495:2008, 1360x41; phone 8516:172 + 8516:175): "Compare regions" 34/41 600 on the left, the selected
 * regions as pills on the right: white, 1px #e7e7e7, p 9/14, gap 8 — a 10px dot in the region's colour (green · orange · blue), the name 14/17 600 and
 * "✕" (11/13 700 #595959) to remove; then the dashed "+ Add a region" pill (1px #387440, 14/17 600) that opens the selector — or, at three regions,
 * the note "Maximum 3 regions" (13/16 500 #595959). Phones: pills p 7/12 with 13px text and "+ Add".
 * Removing is blocked at two regions (a comparison needs two); the ✕ is then disabled. ⚠️ ASSUMPTION (Figma draws it enabled at two).
 * Props: regions [{ id, name, colour }], onRemove(id), onAdd().
 */

const FOCUS =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';

const CompareHeader = ({ regions, onRemove, onAdd }) => {
  const canRemove = regions.length > COMPARE_MIN;
  const full = regions.length >= COMPARE_MAX;
  return (
    <header className="flex flex-col gap-[16px] md:flex-row md:items-center md:justify-between md:gap-[8px]">
      <h1 className="m-0 font-sans text-[26px] leading-[31px] font-semibold tracking-[-0.13px] text-[#1c2a21] md:text-[34px] md:leading-[41px] md:tracking-[-0.34px]">
        Compare regions
      </h1>
      <ul
        aria-label="Selected regions"
        className="m-0 flex list-none flex-wrap items-center gap-[8px] p-0 md:gap-[10px]"
      >
        {regions.map((r) => (
          <li
            key={r.id}
            className="flex items-center gap-[6px] rounded-full border border-solid border-[#e7e7e7] bg-white px-[12px] py-[7px] font-sans text-[13px] leading-[16px] font-semibold text-[#1c2a21] md:gap-[8px] md:px-[14px] md:py-[9px] md:text-[14px] md:leading-[17px]"
          >
            <span
              aria-hidden="true"
              className="size-[9px] shrink-0 rounded-full md:size-[10px]"
              style={{ background: r.colour }}
            />
            {r.name}
            <button
              type="button"
              disabled={!canRemove}
              onClick={() => onRemove(r.id)}
              aria-label={`Remove ${r.name}`}
              className={classNames(
                'ml-[2px] min-h-[24px] min-w-[24px] cursor-pointer rounded-full border-0 bg-transparent p-0 font-sans text-[12px] leading-[13px] font-bold text-[#595959] lg:text-[11px] disabled:cursor-not-allowed disabled:opacity-40 max-md:hidden',
                FOCUS
              )}
            >
              <span aria-hidden="true">✕</span>
            </button>
          </li>
        ))}
        <li>
          {full ? (
            <span className="font-sans text-[13px] leading-[16px] font-medium text-[#595959]">
              Maximum 3 regions
            </span>
          ) : (
            <button
              type="button"
              onClick={onAdd}
              className={classNames(
                'cursor-pointer rounded-full border border-dashed border-[#387440] bg-transparent px-[12px] py-[7px] font-sans text-[13px] leading-[16px] font-semibold text-[#387440] md:px-[14px] md:py-[9px] md:text-[14px] md:leading-[17px]',
                FOCUS
              )}
            >
              <span className="md:hidden">+ Add</span>
              <span className="max-md:hidden">+ Add a region</span>
            </button>
          )}
        </li>
      </ul>
    </header>
  );
};

export default CompareHeader;
