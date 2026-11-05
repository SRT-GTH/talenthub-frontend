import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import {
  SidebarPreviewArrowRightIcon,
  SidebarPublicLinkChainIcon,
} from './RecruiterSidebarIcons.jsx';
import { SIDEBAR_PUBLIC_PROFILE } from './dashboardData.js';

const log = debug('PublicProfileCard');

/* Public-profile card. In the expanded rail it is always visible (7025:85355).
 * In the collapsed rail only the link icon shows (7025:86227) and the full card
 * appears as a popover — Figma annotation on 7025:87865:
 *   "Appears when link Icon is hovered or clicked."
 * On phones the same card is reused inside the tab bar's More sheet. */
const PublicProfileCard = ({ className, style }) => (
  <div
    /* Width is set by the caller (`w-full` in the expanded rail, a fixed
       249px for the collapsed rail's popover) — `classNames` is a plain join,
       not tailwind-merge, so no width class may live in the base list. */
    className={classNames(
      'flex flex-col items-start gap-[10px] overflow-hidden rounded-[12px] border border-[#f8f8f4] bg-white p-[12px] shadow-[0_2px_4px_rgba(15,15,10,0.06),0_12px_28px_-6px_rgba(15,15,10,0.1)]',
      className
    )}
    style={style}
  >
    <div className="flex w-full items-center gap-[6px] rounded-[8px] bg-[#ebf1ec] px-[10px] py-[8px] text-[#387440]">
      <SidebarPublicLinkChainIcon className="shrink-0" />
      <span className="font-sans text-[13px] font-medium leading-[18px] tracking-[0.2px]">
        {SIDEBAR_PUBLIC_PROFILE.heading}
      </span>
    </div>
    <p className="w-full max-lg:break-all font-mono text-[10px] max-lg:text-[12px] leading-4 tracking-[0.2px] text-[#32683a]">
      {SIDEBAR_PUBLIC_PROFILE.url}
    </p>
    <button
      type="button"
      onClick={() => log('preview as talent clicked (no destination wired yet)')}
      className="flex h-[36px] max-lg:h-[44px] w-full items-center justify-center gap-[6px] rounded-[14px] border-2 border-[#1c2a21]/30 bg-white px-[12px] shadow-[0_4px_0_rgba(17,17,17,0.25)] transition-colors hover:bg-brand-green-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
    >
      <span className="font-sans text-[13px] font-bold leading-6 tracking-[0.1px] text-[#1c2a21]">
        {SIDEBAR_PUBLIC_PROFILE.action}
      </span>
      <SidebarPreviewArrowRightIcon className="shrink-0 text-[#387440]" />
    </button>
  </div>
);

export default PublicProfileCard;
