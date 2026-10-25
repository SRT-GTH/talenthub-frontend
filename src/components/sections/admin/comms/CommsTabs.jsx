import { Link } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import { TABS } from './data/adminCommsData.js';

/*
 * CommsTabs — the "Sent · Templates · Bulk notification" strip under the page title of 7.4.2a / 7.4.3a (Figma "Frame 14451", 316 x 40, 1px #e6e2d6 bottom rule; each tab
 * 15/500 with px14 py6; the selected one is green with a 1.2px #387440 underline). Props: active ('sent' | 'templates' | 'bulk').
 */

const CommsTabs = ({ active }) => (
  <nav
    aria-label="Comms sections"
    className="flex w-fit gap-[12px] border-b border-solid border-[#e6e2d6]"
  >
    {TABS.map((t) => {
      const on = t.id === active;
      return (
        <Link
          key={t.id}
          to={t.to}
          aria-current={on ? 'page' : undefined}
          className={classNames(
            'inline-flex h-[40px] items-center border-b-[1.2px] border-solid px-[14px] font-sans text-[15px] leading-[18px] font-medium no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
            on ? 'border-[#387440] text-[#387440]' : 'border-transparent text-[#737373]'
          )}
        >
          {t.label}
        </Link>
      );
    })}
  </nav>
);

export default CommsTabs;
