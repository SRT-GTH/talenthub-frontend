import { classNames } from '../../../../../utils/classNames.js';
import {
  BrowseCheckFilledIcon,
  BrowseSearchIcon,
  BrowseWarningIcon,
} from './SiteCopyBrowseIcons.jsx';

/*
 * SiteCopyStateCard — the full-width centred state card of the Site copy list (Figma "empty state" / "error state": r20, p56, gap 14, centred): a 60 px round icon
 * tile, a 22/600 title, a 15/22 #575755 line and the buttons. Variants: search (7.8.1d "No text matches", grey tile + search), error (7.8.1k, #f9ebea tile + warning
 * in #c0392b), done (7.8.1l "All caught up", #ebf1ec tile + filled check in #387440).
 * Props: variant, title, text, actions (node).
 */
const VARIANTS = {
  search: {
    tile: 'bg-[#f8f8f4] text-[#387440]',
    Icon: BrowseSearchIcon,
    iconClass: 'size-[22px]',
  },
  error: {
    tile: 'bg-[#f9ebea]/50 text-[#c0392b]',
    Icon: BrowseWarningIcon,
    iconClass: 'size-[28px]',
  },
  done: {
    tile: 'bg-[#ebf1ec]/50 text-[#387440]',
    Icon: BrowseCheckFilledIcon,
    iconClass: 'size-[28px]',
  },
};

const SiteCopyStateCard = ({ variant = 'search', title, text, actions }) => {
  const def = VARIANTS[variant] ?? VARIANTS.search;
  const Glyph = def.Icon;
  return (
    <section
      role={variant === 'error' ? 'alert' : 'status'}
      className="flex w-full flex-col items-center gap-[14px] rounded-[20px] border border-solid border-[#1c2a21]/10 bg-white px-[clamp(20px,4vw,56px)] py-[clamp(32px,4vw,56px)] text-center font-sans"
    >
      <span
        className={classNames(
          'flex size-[60px] items-center justify-center rounded-full',
          def.tile
        )}
      >
        <Glyph className={def.iconClass} />
      </span>
      <h2 className="m-0 text-[22px] leading-[26px] font-semibold text-[#1c2a21]">{title}</h2>
      <p className="m-0 max-w-[520px] text-[15px] leading-[22px] text-[#575755]">{text}</p>
      {actions ? (
        <div className="mt-[4px] flex flex-wrap items-center justify-center gap-[12px]">
          {actions}
        </div>
      ) : null}
    </section>
  );
};

export default SiteCopyStateCard;
