import { classNames } from '../../../../../utils/classNames.js';
import { MediaArchive14Icon, MediaWarning14Icon } from './MediaIcons.jsx';

/*
 * MediaWarningChip — the warning pill under a library card (Figma "GTH · Chip · Needs alt text / Consent not confirmed / Too small for hero sections / Unused"):
 * 32 high, px14, gap6, r999, label 13/600. red #f9ebea / #c0392b · amber #faf4e8 / #463409 · grey #f8f8f4 / #575755 ("Unused", archive icon).
 * Props: warning { id, label, tone } from mediaLibraryModel.assetWarning.
 */
const TONE = {
  red: 'bg-[#f9ebea] text-[#c0392b]',
  amber: 'bg-[#faf4e8] text-[#463409]',
  grey: 'bg-[#f8f8f4] text-[#575755]',
};

const MediaWarningChip = ({ warning }) => (
  <span
    data-warning={warning.id}
    className={classNames(
      'inline-flex min-h-[32px] items-center gap-[6px] self-start rounded-full px-[14px] font-sans text-[13px] leading-[16px] font-semibold',
      TONE[warning.tone]
    )}
  >
    {warning.id === 'unused' ? (
      <MediaArchive14Icon className="size-[14px] shrink-0" />
    ) : (
      <MediaWarning14Icon className="size-[14px] shrink-0" />
    )}
    {warning.label}
  </span>
);

export default MediaWarningChip;
