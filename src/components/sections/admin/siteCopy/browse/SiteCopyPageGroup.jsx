import { classNames } from '../../../../../utils/classNames.js';
import SiteCopyChip from './SiteCopyChip.jsx';
import { chipLabel } from './siteCopyBrowseData.js';
import { BrowseChevronDownIcon, BrowseChevronRightIcon } from './SiteCopyBrowseIcons.jsx';

/*
 * SiteCopyPageGroup — one page of the Pages card (Figma "page · Home"): a 54 high head button (chevron 16, label 15/600, status chip on the right; p 11/12, gap 10)
 * and, when open, the #f8f8f4 r12 panel holding its sections (pl 34, pr 8, pb 10, gap 2). A page that is "Coming soon" is greyed (label #575755, chevron #6e7a72)
 * and cannot be opened ("Greyed pages can't be opened yet", 7.8.1g).
 * Props: label, chip { kind, count }, open, onToggle, disabled, children (the section rows), id.
 */
const SiteCopyPageGroup = ({ label, chip, open, onToggle, disabled, children, id }) => {
  const Chevron = open ? BrowseChevronDownIcon : BrowseChevronRightIcon;
  return (
    <div className={classNames('rounded-[12px]', open && !disabled ? 'bg-[#f8f8f4]' : '')}>
      <button
        type="button"
        id={id}
        aria-expanded={disabled ? undefined : Boolean(open)}
        aria-disabled={disabled || undefined}
        aria-label={chip ? `${label}, ${chipLabel(chip)}` : undefined}
        onClick={disabled ? undefined : onToggle}
        className={classNames(
          'flex min-h-[54px] w-full items-center gap-[10px] rounded-[12px] border-0 bg-transparent px-[12px] py-[11px] text-left font-sans',
          disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-[#f8f8f4]',
          'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#387440]'
        )}
      >
        <Chevron
          className={classNames(
            'size-[16px] shrink-0',
            disabled ? 'text-[#6e7a72]' : 'text-[#1c2a21]'
          )}
        />
        <span
          className={classNames(
            'min-w-0 flex-1 max-sm:truncate text-[15px] leading-[18px] font-semibold',
            disabled ? 'text-[#575755]' : 'text-[#1c2a21]'
          )}
        >
          {label}
        </span>
        {chip ? <SiteCopyChip generated kind={chip.kind} count={chip.count} /> : null}
      </button>
      {open && !disabled ? (
        <div className="flex flex-col gap-[2px] pr-[8px] pb-[10px] pl-[34px] max-sm:pl-[16px]">
          {children}
        </div>
      ) : null}
    </div>
  );
};

export default SiteCopyPageGroup;
