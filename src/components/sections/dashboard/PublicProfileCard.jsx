import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import CommunityIcon from '../community/CommunityIcon.jsx';
import { icons } from '../community/communityIcons.js';
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
      'flex flex-col items-start gap-[10px] overflow-hidden rounded-[12px] border border-neutral bg-white p-[12px]',
      className
    )}
    style={style}
  >
    <div className="flex w-full items-center gap-[6px] rounded-[8px] bg-brand-green-light px-[10px] py-[8px]">
      <CommunityIcon src={icons.linkOutlined} size={16} />
      <span className="font-sans text-[13px] font-medium leading-[18px] tracking-[0.2px] text-brand-green">
        {SIDEBAR_PUBLIC_PROFILE.heading}
      </span>
    </div>
    <p className="w-full max-lg:break-all font-mono text-[10px] max-lg:text-[12px] leading-4 tracking-[0.2px] text-brand-green-hover">
      {SIDEBAR_PUBLIC_PROFILE.url}
    </p>
    <button
      type="button"
      onClick={() => log('preview as talent clicked (no destination wired yet)')}
      className="flex h-[36px] max-lg:h-[44px] w-full items-center justify-center gap-[6px] rounded-[8px] border border-brand-green-light-active bg-white px-[12px] py-[6px] transition-colors hover:bg-brand-green-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
    >
      <span className="font-sans text-[13px] font-semibold leading-[18px] tracking-[0.2px] text-brand-green">
        {SIDEBAR_PUBLIC_PROFILE.action}
      </span>
      <span className="inline-flex -scale-y-100 rotate-180 items-center justify-center">
        <CommunityIcon src={icons.arrowUpLeft} size={16} />
      </span>
    </button>
  </div>
);

export default PublicProfileCard;
