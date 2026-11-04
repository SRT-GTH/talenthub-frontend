import { classNames } from '../../../../../utils/classNames.js';
import {
  BrowseCheckCircleIcon,
  BrowseEditIcon,
  BrowseLockIcon,
  BrowseUsersIcon,
} from './SiteCopyBrowseIcons.jsx';

/*
 * SiteCopyChip — the status chip of the Site copy lists (Figma "GTH · Chip" 8158:2198, 32 high, px14, gap 6, r999, 13/600):
 *   default  #f8f8f4 / #575755                      "Default"            never edited, shows the original text
 *   edited   #ebf1ec / #2a5730 + check-circle       "Edited"             changed and live
 *   draft    #faf4e8 / #463409 + pencil             "Draft changes (n)"  has changes only staff can see
 *   shared   #eaeffb / #244a9f + users              "Used on every page" a shared section
 *   soon     #f8f8f4 / #575755 + lock               "Coming soon"        not editable yet
 *   count    #faf4e8 / #463409, text only           `label` or `count`   (tab counts, "2 changes" on the home)
 * Props: generated (draw the label as CSS generated content, aria-hidden), kind, count (draft number / count text), label (overrides the drawn label), className.
 */
const KINDS = {
  default: { box: 'bg-[#f8f8f4] text-[#575755]', label: 'Default' },
  edited: { box: 'bg-[#ebf1ec] text-[#2a5730]', label: 'Edited', Icon: BrowseCheckCircleIcon },
  draft: { box: 'bg-[#faf4e8] text-[#463409]', Icon: BrowseEditIcon },
  shared: {
    box: 'bg-[#eaeffb] text-[#244a9f]',
    label: 'Used on every page',
    Icon: BrowseUsersIcon,
  },
  soon: { box: 'bg-[#f8f8f4] text-[#575755]', label: 'Coming soon', Icon: BrowseLockIcon },
  count: { box: 'bg-[#faf4e8] text-[#463409]' },
};

const SiteCopyChip = ({ kind = 'default', count, label, className, generated }) => {
  const def = KINDS[kind] ?? KINDS.default;
  const Glyph = def.Icon;
  let text = label ?? def.label;
  if (kind === 'draft') text = label ?? `Draft changes (${count})`;
  if (kind === 'count') text = label ?? String(count);
  if (generated) {
    // text as generated content: the row button that holds the chip keeps one text line of its own (the row carries an aria-label)
    return (
      <span
        aria-hidden="true"
        data-label={text}
        className={classNames(
          'inline-flex h-[32px] shrink-0 items-center gap-[6px] rounded-full px-[14px] max-sm:gap-[4px] max-sm:px-[9px] font-sans text-[13px] leading-[16px] font-semibold whitespace-nowrap after:content-[attr(data-label)]',
          def.box,
          className
        )}
      >
        {Glyph ? <Glyph className="size-[14px] shrink-0 max-sm:hidden" /> : null}
      </span>
    );
  }
  return (
    <span
      className={classNames(
        'inline-flex h-[32px] shrink-0 items-center gap-[6px] rounded-full px-[14px] font-sans text-[13px] leading-[16px] font-semibold whitespace-nowrap',
        def.box,
        className
      )}
    >
      {Glyph ? <Glyph className="size-[14px] shrink-0" /> : null}
      {text}
    </span>
  );
};

export default SiteCopyChip;
