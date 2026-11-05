import { classNames } from '../../../../../utils/classNames.js';
import { CopyEditIcon } from '../siteCopyIcons.jsx';
import { EditorCheckCircleIcon, EditorUsersIcon } from './EditorIcons.jsx';

/*
 * CopyStatusChip — the 32 px status pills of the section editor ("GTH · Chip" components of frames 7.8.2a-2n): 13/600, px 14, gap 6, r999.
 *   edited   "Edited"                   #ebf1ec / #2a5730 + check-circle     default  "Default"            #f8f8f4 / #575755
 *   draft    "Draft changes (n)"        #faf4e8 / #463409 + pencil           changed  "Changed"            #faf4e8 / #463409
 *   shared   "Used on every page"       #eaeffb / #244a9f + people
 * Props: kind, count (draft only), className.
 */
const KINDS = {
  edited: { bg: 'bg-[#ebf1ec] text-[#2a5730]', Icon: EditorCheckCircleIcon, label: () => 'Edited' },
  default: { bg: 'bg-[#f8f8f4] text-[#575755]', Icon: null, label: () => 'Default' },
  draft: {
    bg: 'bg-[#faf4e8] text-[#463409]',
    Icon: CopyEditIcon,
    label: (n) => `Draft changes (${n})`,
  },
  changed: { bg: 'bg-[#faf4e8] text-[#463409]', Icon: null, label: () => 'Changed' },
  shared: {
    bg: 'bg-[#eaeffb] text-[#244a9f]',
    Icon: EditorUsersIcon,
    label: () => 'Used on every page',
  },
};

const CopyStatusChip = ({ kind = 'default', count = 1, className }) => {
  const def = KINDS[kind] ?? KINDS.default;
  const Glyph = def.Icon;
  return (
    <span
      className={classNames(
        'inline-flex h-[32px] shrink-0 items-center gap-[6px] rounded-full px-[14px] font-sans text-[13px] leading-[16px] font-semibold whitespace-nowrap',
        def.bg,
        className
      )}
    >
      {Glyph ? <Glyph className="size-[14px] shrink-0" /> : null}
      {def.label(count)}
    </span>
  );
};

export default CopyStatusChip;
