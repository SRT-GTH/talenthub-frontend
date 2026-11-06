import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { classNames } from '../../../../../utils/classNames.js';
import { debug } from '../../../../../utils/debug.js';
import { copyUrl, COPY_PATHS } from '../copyUrl.js';
import { SearchIcon } from '../fields/FieldsIcons.jsx';
import { PORTAL_TABS } from './pagesTreeData.js';

const log = debug('PortalTabsRow');

/*
 * PortalTabsRow — the toolbar of the Site copy editor screens (Figma "toolbar": the portal tabs on a #f8f8f4 tray, r14, 4 padding — the active tab white with a
 * #e7e7e7 ring, 14 / 600; the others 14 / 500 #575755 — and the 380 x 44 search "Search pages, sections or words").
 * The tabs are links to the Site copy list of that portal (`/admin/site-copy?portal=…`, builder A's screen); the search goes to the list with `?q=`.
 * Props: ctx (screen ctx, keeps the mock role in links), active (portal id, default 'public').
 * Below lg the tray scrolls inside itself (no scrollbar) and the search takes its own row.
 */
const PortalTabsRow = ({ ctx, active = 'public' }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  return (
    <div className="flex flex-wrap items-center gap-[12px] max-lg:flex-col max-lg:items-stretch">
      <nav
        aria-label="Portals"
        className="flex min-w-0 gap-[4px] overflow-x-auto rounded-[14px] bg-[#f8f8f4] p-[4px] [scrollbar-width:none] max-lg:max-w-full [&::-webkit-scrollbar]:hidden"
      >
        {PORTAL_TABS.map((t) => {
          const on = t.id === active;
          return (
            <Link
              key={t.id}
              to={copyUrl(ctx, COPY_PATHS.siteCopy, { portal: t.id === 'public' ? null : t.id })}
              aria-current={on ? 'page' : undefined}
              onClick={() => log('portal tab', t.id)}
              className={classNames(
                'flex min-h-[35px] shrink-0 items-center rounded-[11px] px-[16px] py-[9px] font-sans text-[14px] leading-[17px] no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
                on
                  ? 'border border-solid border-[#e7e7e7] bg-white font-semibold text-[#1c2a21]'
                  : 'font-medium text-[#575755] hover:bg-white/60'
              )}
            >
              {t.label}
            </Link>
          );
        })}
      </nav>
      <span className="flex-1 max-lg:hidden" />
      <form
        role="search"
        className="flex h-[44px] w-[380px] max-w-full items-center gap-[10px] rounded-[12px] border border-solid border-[#e7e7e7] bg-white px-[14px] max-lg:w-full"
        onSubmit={(e) => {
          e.preventDefault();
          log('search', query);
          navigate(copyUrl(ctx, COPY_PATHS.siteCopy, { q: query.trim() }));
        }}
      >
        <SearchIcon className="size-[18px] shrink-0 text-[#387440]" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search pages, sections or words"
          aria-label="Search pages, sections or words"
          className="min-w-0 flex-1 border-0 bg-transparent p-0 font-sans text-[14px] leading-[17px] text-[#1c2a21] outline-none placeholder:text-[#575755]"
        />
      </form>
    </div>
  );
};

export default PortalTabsRow;
