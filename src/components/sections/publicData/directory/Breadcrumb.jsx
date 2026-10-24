import { Link } from 'react-router-dom';

/*
 * Breadcrumb — Figma "breadcrumb" (8498:529): "Directory › Partners › Northern Skills Foundation", 14/17, gap 8; the two links 600 #387440,
 * the › 400 #595959, the current page 500 #1c2a21. Desktop and tablet only (the phone frames draw none).
 * Props: items [{ label, to }] — the last one is the current page (no `to`).
 */

const Breadcrumb = ({ items }) => (
  <nav aria-label="Breadcrumb" className="hidden md:block">
    <ol className="m-0 flex list-none flex-wrap items-center gap-[8px] p-0 font-sans text-[14px] leading-[17px]">
      {items.map((item, i) => (
        <li key={item.label} className="flex items-center gap-[8px]">
          {i > 0 && (
            <span aria-hidden="true" className="font-normal text-[#595959]">
              ›
            </span>
          )}
          {item.to ? (
            <Link
              to={item.to}
              className="rounded-[4px] font-semibold text-[#387440] no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
            >
              {item.label}
            </Link>
          ) : (
            <span aria-current="page" className="font-medium text-[#1c2a21]">
              {item.label}
            </span>
          )}
        </li>
      ))}
    </ol>
  </nav>
);

export default Breadcrumb;
