import { classNames } from '../../../../../utils/classNames.js';
import { PreviewCheckFilledIcon, PreviewUsersIcon } from './PreviewIcons.jsx';

/*
 * CopyChip — the 32 px pill of the Site copy screens (Figma "GTH · Chip", 13/600, px 14, gap 6, r999): Edited (check, green) · Default (grey) ·
 * Live now (green) · Used on every page (users icon, blue) · Restored from version N (blue) · N unpublished changes (amber).
 * tone: edited | default | defaultPlain (7.8.5e title chip #f4f7f5) | live | livePlain (7.8.5e row chip #eaf3ec) | shared | restored | unpublished | unpublishedLive (7.8.3g label #8a6100).
 * Props: tone, children, className.
 */
const TONES = {
  edited: { box: 'bg-[#ebf1ec] text-[#2a5730]', icon: PreviewCheckFilledIcon },
  default: { box: 'bg-[#f8f8f4] text-[#575755]' },
  defaultPlain: { box: 'bg-[#f4f7f5] text-[#5f6b63]' },
  live: { box: 'bg-[#ebf1ec] text-[#2a5730]' },
  livePlain: { box: 'bg-[#eaf3ec] text-[#27522e]' },
  shared: { box: 'bg-[#eaeffb] text-[#244a9f]', icon: PreviewUsersIcon },
  restored: { box: 'bg-[#eaeffb] text-[#244a9f]' },
  unpublished: { box: 'bg-[#faf4e8] text-[#463409]' },
  unpublishedLive: { box: 'bg-[#faf4e8] text-[#8a6100]' },
};

const CopyChip = ({ tone = 'default', className, children }) => {
  const t = TONES[tone] ?? TONES.default;
  const Glyph = t.icon;
  return (
    <span
      className={classNames(
        'inline-flex h-[32px] shrink-0 items-center gap-[6px] rounded-full px-[14px] font-sans text-[13px] leading-[16px] font-semibold whitespace-nowrap',
        t.box,
        className
      )}
    >
      {Glyph ? <Glyph className="size-[14px]" /> : null}
      {children}
    </span>
  );
};

export default CopyChip;
