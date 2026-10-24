import { Link } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';

/*
 * DirectoryHead — the "hd" frame of both directories (Figma 8498:76 / 8498:349051): title 34/41 600 (-0.34) + description 16/19 #595959,
 * and on the right the "directory tabs" (Partners | Opportunities: 16/19, active 600 #387440 with a 3px underline, inactive 500 #595959, gap 28).
 * Phone (8508:375): title 26/31, one short line (14/20), and no tabs (the section tabs of the frame and the footer links switch directory).
 * Props: title, description, mobileDescription, activeTab ('partners' | 'opportunities').
 */

const TABS = [
  { id: 'partners', label: 'Partners', to: '/data/partners' },
  { id: 'opportunities', label: 'Opportunities', to: '/data/opportunities' },
];

const DirectoryHead = ({ title, description, mobileDescription, activeTab }) => (
  <div className="flex flex-col gap-[16px] md:flex-row md:items-end md:justify-between md:gap-[8px]">
    <div className="flex min-w-0 flex-col gap-[4px] md:gap-[6px]">
      <h1 className="m-0 font-sans text-[26px] leading-[31px] font-semibold tracking-[-0.13px] text-[#1c2a21] md:text-[34px] md:leading-[41px] md:tracking-[-0.34px]">
        {title}
      </h1>
      <p className="m-0 font-sans text-[14px] leading-[20px] text-[#595959] md:hidden">
        {mobileDescription ?? description}
      </p>
      <p className="m-0 hidden max-w-[661px] font-sans text-[16px] leading-[19px] text-[#595959] md:block">
        {description}
      </p>
    </div>
    <nav aria-label="Directory" className="hidden shrink-0 gap-[28px] md:flex">
      {TABS.map((tab) => {
        const active = tab.id === activeTab;
        return (
          <Link
            key={tab.id}
            to={tab.to}
            aria-current={active ? 'page' : undefined}
            className={classNames(
              'flex flex-col gap-[8px] rounded-[4px] font-sans text-[16px] leading-[19px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#387440]',
              active ? 'font-semibold text-[#387440]' : 'font-medium text-[#595959]'
            )}
          >
            <span>{tab.label}</span>
            <span
              aria-hidden="true"
              className={classNames(
                'h-[3px] rounded-[2px]',
                active ? 'bg-[#387440]' : 'bg-transparent'
              )}
            />
          </Link>
        );
      })}
    </nav>
  </div>
);

export default DirectoryHead;
