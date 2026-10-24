import { Link } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';

/*
 * RegionBreadcrumb — Figma "breadcrumb" (8493:76, the district frame 8494:2009 adds a level): H gap 8, 14/17; links 600 #387440, "›" 400 #595959,
 * current page 500 #1c2a21.
 * Props: items [{ label, to? }] — the last item is the current page (aria-current); the first is "National" → the overview.
 * Hidden below md: the phone frames draw the section tabs and the title instead.
 */

const RegionBreadcrumb = ({ items, className }) => (
  <nav aria-label="Breadcrumb" className={classNames('max-md:hidden', className)}>
    <ol className="m-0 flex list-none flex-wrap items-center gap-[8px] p-0 font-sans text-[14px] leading-[17px]">
      {items.map((item, i) => {
        const last = i === items.length - 1;
        return (
          <li key={item.label} className="flex items-center gap-[8px]">
            {last || !item.to ? (
              <span aria-current={last ? 'page' : undefined} className="font-medium text-[#1c2a21]">
                {item.label}
              </span>
            ) : (
              <Link
                to={item.to}
                className="font-semibold text-[#387440] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
              >
                {item.label}
              </Link>
            )}
            {!last && (
              <span aria-hidden="true" className="font-normal text-[#595959]">
                ›
              </span>
            )}
          </li>
        );
      })}
    </ol>
  </nav>
);

export default RegionBreadcrumb;
