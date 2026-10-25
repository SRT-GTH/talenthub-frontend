import { Link } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { AgMap, AgSearch, AgSuitcase, AgUserPlus, AgUsers } from './agencyHomeIcons.jsx';

const log = debug('AgencyQuickActions');

/*
 * AgencyQuickActions — the strip of four tinted shortcut cards under the hero (Figma "Quick actions strip" 8597:398328, 1329 x 88, gap 16;
 * card 320 x 88, r16, 1px #fefefe border, p 14/16, gap 12; 44 x 44 white r12 icon tile; title 14/20 600, meta 12/18 #959592).
 * Props: actions [{ id, title, meta, icon, tint, ink, to }], className.
 * Below xl the cards wrap 2 x 2, below sm they stack.
 */

const ICONS = {
  userPlus: AgUserPlus,
  search: AgSearch,
  users: AgUsers,
  suitcase: AgSuitcase,
  map: AgMap,
};

const AgencyQuickActions = ({ actions, className }) => (
  <nav aria-label="Quick actions" className={className}>
    <ul className="m-0 grid list-none grid-cols-1 gap-[16px] p-0 sm:grid-cols-2 xl:grid-cols-4">
      {actions.map((a) => {
        const Icon = ICONS[a.icon];
        return (
          <li key={a.id} className="min-w-0">
            <Link
              to={a.to}
              data-tour-target={a.id}
              onClick={() => log('click', { id: a.id, to: a.to })}
              style={{ backgroundColor: a.tint }}
              className={classNames(
                'flex h-[88px] min-w-0 items-center gap-[12px] rounded-[16px] border border-solid border-[#fefefe] px-[16px] py-[14px] no-underline shadow-[0_1px_2px_rgba(15,15,10,0.05),0_6px_16px_-4px_rgba(15,15,10,0.07)] transition-transform duration-150 hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]'
              )}
            >
              <span
                style={{ color: a.ink }}
                className="grid size-[44px] shrink-0 place-items-center rounded-[12px] bg-white"
              >
                <Icon className="size-[22px]" />
              </span>
              <span className="flex min-w-0 flex-col gap-[2px]">
                <span className="truncate font-sans text-[14px] leading-[20px] font-semibold tracking-[0.1px] text-[#1c2a21]">
                  {a.title}
                </span>
                <span className="truncate font-sans text-[12px] max-lg:text-[12px] leading-[18px] tracking-[0.2px] text-[#959592]">
                  {a.meta}
                </span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  </nav>
);

export default AgencyQuickActions;
