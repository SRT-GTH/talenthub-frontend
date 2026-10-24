import { Link } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import { PRIMARY_NAV } from './publicDataNav.js';

/*
 * PublicMobileTabs — the "section nav" row under the mobile top bar (Figma 8507:25): Overview · Regions · Showcase · Outcomes · Directory,
 * 14px, active = 600 #387440 with an underline, others 500 #595959. It scrolls inside itself (no visible scrollbar) on narrow phones.
 * Rendered by pages in their body on < md; the Home item is not a tab (the logo is Home).
 */

const PublicMobileTabs = ({ activeId, className }) => (
  <nav
    aria-label="Sections"
    className={classNames(
      'no-scrollbar flex gap-[16px] overflow-x-auto min-[380px]:gap-[20px] md:hidden',
      className
    )}
  >
    {PRIMARY_NAV.filter((item) => item.id !== 'home').map((item) => {
      const active = item.id === activeId;
      return (
        <Link
          key={item.id}
          to={item.to}
          aria-current={active ? 'page' : undefined}
          className={classNames(
            'flex min-h-[26px] shrink-0 flex-col gap-[6px] font-sans text-[14px] leading-[17px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
            active ? 'font-semibold text-[#387440]' : 'font-medium text-[#595959]'
          )}
        >
          <span>{item.tabLabel}</span>
          <span
            className={classNames(
              'h-[3px] rounded-full',
              active ? 'bg-[#387440]' : 'bg-transparent'
            )}
            aria-hidden="true"
          />
        </Link>
      );
    })}
  </nav>
);

export default PublicMobileTabs;
