import { Link } from 'react-router-dom';
import { classNames } from '../../../../../utils/classNames.js';
import { COPY_PATHS, copyUrl } from '../copyUrl.js';
import { EditorSearchIcon } from './EditorIcons.jsx';
import { PORTALS } from './sectionEditorData.js';

/*
 * PortalToolbar — the row above the Pages card and the editor (frame 7.8.2a): the portal tabs (a #f8f8f4 r14 strip, p4, gap 4; the current tab white with a
 * 1 px #e7e7e7 border, 14/600; the others 14/500 #575755, r11, px16 / py9) and the search box (380 x 44, r12, 1 px #e7e7e7, the green search icon and
 * "Search pages, sections or words"). A tab opens the Site copy list of that portal (`/admin/site-copy?portal=<id>`, Emails `?tab=emails`);
 * the search filters the Pages card as you type. The strip scrolls inside itself on a phone.
 * Props: ctx, portal (current portal id), query, onQuery.
 */
const PortalToolbar = ({ ctx, portal, query, onQuery }) => (
  <div className="flex flex-col gap-[12px] lg:flex-row lg:items-center">
    <nav
      aria-label="Portals"
      className="max-w-full min-w-0 self-start overflow-x-auto rounded-[14px] bg-[#f8f8f4] p-[4px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <ul className="m-0 flex w-max list-none gap-[4px] p-0">
        {PORTALS.map((p) => {
          const current = p.id === portal;
          return (
            <li key={p.id}>
              <Link
                to={copyUrl(
                  ctx,
                  COPY_PATHS.siteCopy,
                  p.id === 'emails' ? { tab: 'emails' } : { portal: p.id }
                )}
                aria-current={current ? 'page' : undefined}
                className={classNames(
                  'inline-flex min-h-[35px] items-center rounded-[11px] px-[16px] py-[9px] font-sans text-[14px] leading-[17px] no-underline focus-visible:outline-2 focus-visible:outline-[#387440]',
                  current
                    ? 'border border-solid border-[#e7e7e7] bg-white font-semibold text-[#1c2a21]'
                    : 'font-medium text-[#575755] hover:bg-white/60'
                )}
              >
                {p.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
    <span className="hidden grow lg:block" />
    <label className="flex min-h-[44px] w-full items-center gap-[10px] rounded-[12px] border border-solid border-[#e7e7e7] bg-white px-[14px] py-[11px] lg:w-[clamp(260px,22vw,380px)]">
      <EditorSearchIcon className="size-[18px] shrink-0 text-[#387440]" />
      <input
        type="search"
        value={query}
        onChange={(e) => onQuery(e.target.value)}
        placeholder="Search pages, sections or words"
        aria-label="Search pages, sections or words"
        autoComplete="off"
        className="min-w-0 flex-1 border-0 bg-transparent p-0 font-sans text-[14px] leading-[17px] text-[#1c2a21] outline-none placeholder:text-[#575755]"
      />
    </label>
  </div>
);

export default PortalToolbar;
