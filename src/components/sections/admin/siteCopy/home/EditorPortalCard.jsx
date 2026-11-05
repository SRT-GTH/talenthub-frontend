import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { classNames } from '../../../../../utils/classNames.js';
import { debug } from '../../../../../utils/debug.js';
import { PORTALS, portalCounts } from '../browse/siteCopyBrowseData.js';
import {
  HomeBookIcon,
  HomeChatIcon,
  HomeChevronRightIcon,
  HomeCompanyIcon,
  HomeShieldIcon,
  HomeSuitcaseIcon,
  HomeUsersIcon,
} from './EditorHomeIcons.jsx';

const log = debug('EditorPortalCard');

/*
 * EditorPortalCard — "Pick a portal" (7.8.0a): white card (r20, p24, gap 14) with a 3-column grid of tiles (408 x 78, r16, p18, gap 14, 1px #e7e7e7): a 40 px
 * #ebf1ec / 50 % icon square, the portal name (16/600) with "46 pages · 9 edited" (13/400) and a chevron. Each tile opens the Site copy list of that portal
 * (`/admin/site-copy?portal=<id>`). The grid is 3 / 2 / 1 columns from lg / sm / phone. Props: hrefFor(portalId).
 */
const ICONS = {
  company: { Icon: HomeCompanyIcon, color: 'text-[#27522e]' },
  users: { Icon: HomeUsersIcon, color: 'text-[#387440]' },
  shield: { Icon: HomeShieldIcon, color: 'text-[#27522e]' },
  suitcase: { Icon: HomeSuitcaseIcon, color: 'text-[#27522e]' },
  book: { Icon: HomeBookIcon, color: 'text-[#27522e]' },
  chat: { Icon: HomeChatIcon, color: 'text-[#27522e]' },
};

const EditorPortalCard = ({ hrefFor }) => {
  useEffect(() => {
    log('render', { portals: PORTALS.length });
  }, []);
  return (
    <section
      aria-labelledby="editor-portals"
      className="flex flex-col gap-[14px] rounded-[20px] border border-solid border-[#1c2a21]/10 bg-white p-[clamp(16px,1.8vw,24px)] font-sans"
    >
      <h2
        id="editor-portals"
        className="m-0 text-[19px] leading-[23px] font-semibold text-[#1c2a21]"
      >
        Pick a portal
      </h2>
      <ul className="m-0 grid list-none grid-cols-1 gap-[14px] p-0 sm:grid-cols-2 lg:grid-cols-3">
        {PORTALS.map((p) => {
          const { Icon, color } = ICONS[p.iconKey];
          return (
            <li key={p.id} className="min-w-0">
              <Link
                to={hrefFor(p.id)}
                className="flex min-h-[78px] items-center gap-[14px] rounded-[16px] border border-solid border-[#e7e7e7] bg-white p-[18px] no-underline hover:border-[#c1d4c4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
              >
                <span className="flex size-[40px] shrink-0 items-center justify-center rounded-[12px] bg-[#ebf1ec]/50">
                  <Icon className={classNames('size-[20px]', color)} />
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-[2px]">
                  <span className="text-[16px] leading-[19px] font-semibold text-[#1c2a21]">
                    {p.label}
                  </span>
                  <span className="text-[13px] leading-[16px] text-[#575755]">
                    {portalCounts(p)}
                  </span>
                </span>
                <HomeChevronRightIcon className="size-[18px] shrink-0 text-[#5f6b63]" />
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default EditorPortalCard;
