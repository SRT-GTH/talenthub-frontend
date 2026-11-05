import { classNames } from '../../../../../utils/classNames.js';
import { BrowseChipChevronIcon, BrowseChipCloseIcon } from './SiteCopyBrowseIcons.jsx';

/*
 * SiteCopyFilterChips — the filter row under the toolbar (Figma "T8 · Filter chip": 35 high, px 14/12, py8, r100, 14/500). The chosen filter is #387440 with
 * white text and an x that clears it; the others are white with a #e7e7e7 border and a chevron. "All" is the cleared state (drawn selected with an x when no
 * other filter is on). Single choice: All · Edited · Has unpublished changes · Not editable yet.
 * Props: filter ('edited' | 'unpublished' | 'soon' | null), onChange(filter | null).
 */
const CHIPS = [
  { id: null, label: 'All' },
  { id: 'edited', label: 'Edited' },
  { id: 'unpublished', label: 'Has unpublished changes' },
  { id: 'soon', label: 'Not editable yet' },
];

const SiteCopyFilterChips = ({ filter, onChange }) => (
  <div role="group" aria-label="Filter" className="flex flex-wrap items-center gap-[8px]">
    {CHIPS.map((c) => {
      const on = (filter ?? null) === c.id;
      return (
        <button
          key={c.label}
          type="button"
          aria-pressed={on}
          onClick={() => onChange(on ? null : c.id)}
          className={classNames(
            'inline-flex min-h-[35px] cursor-pointer items-center gap-[6px] rounded-full border border-solid py-[8px] pr-[12px] pl-[14px] font-sans text-[14px] leading-[17px] font-medium whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
            on
              ? 'border-[#387440] bg-[#387440] text-white'
              : 'border-[#e7e7e7] bg-white text-[#1c2a21] hover:border-[#c1d4c4]'
          )}
        >
          {c.label}
          {on ? (
            <BrowseChipCloseIcon className="size-[14px] shrink-0" />
          ) : (
            <BrowseChipChevronIcon className="size-[16px] shrink-0 text-[#595959]" />
          )}
        </button>
      );
    })}
  </div>
);

export default SiteCopyFilterChips;
