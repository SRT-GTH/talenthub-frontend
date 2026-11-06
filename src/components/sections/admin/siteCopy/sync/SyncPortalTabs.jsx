import { Link } from 'react-router-dom';
import { classNames } from '../../../../../utils/classNames.js';
import { COPY_PATHS, copyUrl } from '../copyUrl.js';
import { SYNC_PORTALS } from './releaseSyncData.js';

/*
 * SyncPortalTabs — the portal switch of the Site copy toolbar (Figma "portal tabs": #f8f8f4, r14, 4 padding, 4 gap; the current tab is white with a 1px
 * #e7e7e7 border, 14/600 #1c2a21; the others 14/500 #575755, px16 py9, r11). The current portal is a label; the others open that portal in the Site copy
 * browse (`/admin/site-copy?portal=…`). The strip scrolls inside itself on phones (no scrollbar).
 * Props: ctx, current (portal id).
 */
const SyncPortalTabs = ({ ctx, current }) => (
  <nav
    aria-label="Portals"
    className="min-w-0 max-w-full overflow-x-auto rounded-[14px] bg-[#f8f8f4] p-[4px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden max-md:[mask-image:linear-gradient(90deg,#000_calc(100%-28px),transparent)]"
  >
    <ul className="m-0 flex w-max list-none gap-[4px] p-0">
      {SYNC_PORTALS.map((p) => {
        const active = p.id === current;
        const cls = classNames(
          'inline-flex min-h-[35px] items-center rounded-[11px] px-[16px] py-[9px] font-sans text-[14px] leading-[17px] no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
          active
            ? 'border border-solid border-[#e7e7e7] bg-white font-semibold text-[#1c2a21]'
            : 'border border-solid border-transparent font-medium text-[#575755] hover:bg-white/60'
        );
        return (
          <li key={p.id}>
            {active ? (
              <span aria-current="page" className={cls}>
                {p.label}
              </span>
            ) : (
              <Link to={copyUrl(ctx, COPY_PATHS.siteCopy, { portal: p.id })} className={cls}>
                {p.label}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  </nav>
);

export default SyncPortalTabs;
