import { classNames } from '../../../../../utils/classNames.js';
import { CopyEditIcon } from '../siteCopyIcons.jsx';
import { CheckCircleFillIcon } from './NameIcons.jsx';

/*
 * NameStatusChip — the STATUS pill of a product name row (Figma "GTH · Chip", 32 high, r999, 14 px side padding, 13/600):
 *   live   white-green #ebf1ec, check-circle, "Live" #2a5730 (7.8.6a)
 *   draft  cream #faf4e8, edit glyph, #463409 — "Draft · waiting for a super admin" (Content Editor, 7.8.6e) or
 *          "Draft · drafted by Ama Owusu" (Super Admin, 7.8.6g / 7.8.6h)
 * Props: tone ('live' | 'draft'), children (the label).
 */
const NameStatusChip = ({ tone = 'live', children }) => (
  <span
    className={classNames(
      'inline-flex min-h-[32px] items-center gap-[6px] rounded-full px-[14px] font-sans text-[13px] leading-[16px] font-semibold whitespace-nowrap',
      tone === 'draft' ? 'bg-[#faf4e8] text-[#463409]' : 'bg-[#ebf1ec] text-[#2a5730]'
    )}
  >
    {tone === 'draft' ? (
      <CopyEditIcon className="size-[14px] shrink-0" />
    ) : (
      <CheckCircleFillIcon className="size-[14px] shrink-0" />
    )}
    {children}
  </span>
);

export default NameStatusChip;
