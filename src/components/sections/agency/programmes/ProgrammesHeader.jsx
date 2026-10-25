import { Link } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import { PROGRAMME_TABS } from '../data/programmesData.js';

/*
 * ProgrammesHeader — the page header of the programme screens (Figma "Page Header & Filters" 8610:400626, 1329 x 124):
 *   title 32/40 600 -0.16 #1c2a21 (the page <h1>; a coloured word for "Programme templates" / "Who can apply" via `accent`) · sentence 16/24 #999999 ·
 *   the tab row "Your programmes · Templates · Who can apply" (15/500, #737373; active #387440 with a 1.2px green underline; the row has a 1px #e6e2d6 base).
 * The tabs are links: Your programmes = /agency/programmes, Templates = /agency/programmes/new?modal=template (the manifest URL of frame 11.5.2g),
 * Who can apply = /agency/programmes/new. `tab` null draws no tab row (the Applicants page, frame 11.5.2d).
 * Props: title (string), accent (the coloured last word, optional), sentence, tab ('programmes' | 'templates' | 'apply' | null).
 */

const HREFS = {
  programmes: '/agency/programmes',
  templates: '/agency/programmes/new?modal=template',
  apply: '/agency/programmes/new',
};

const ProgrammesHeader = ({ title, accent, sentence, tab }) => (
  <header className="flex flex-col gap-[16px] font-sans">
    <div className="flex flex-col gap-[3px]">
      <h1 className="m-0 text-[28px] leading-[36px] font-semibold tracking-[-0.16px] text-[#1c2a21] md:text-[32px] md:leading-[40px]">
        {title}
        {accent ? <span className="text-[#387440]"> {accent}</span> : null}
      </h1>
      <p className="m-0 text-[16px] leading-[24px] tracking-[0.2px] text-[#999999]">{sentence}</p>
    </div>
    {tab ? (
      <nav
        aria-label="Programme sections"
        className="flex w-fit max-w-full flex-wrap gap-[12px] border-0 border-b border-solid border-[#e6e2d6]"
      >
        {PROGRAMME_TABS.map((t) => {
          const active = t.id === tab;
          return (
            <Link
              key={t.id}
              to={HREFS[t.id]}
              aria-current={active ? 'page' : undefined}
              className={classNames(
                '-mb-px inline-flex min-h-[40px] items-center border-0 border-b-[1.2px] border-solid px-[14px] py-[6px] text-[15px] leading-[24px] font-medium tracking-[0.24px] no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
                active
                  ? 'border-[#387440] text-[#387440]'
                  : 'border-transparent text-[#737373] hover:text-[#1c2a21]'
              )}
            >
              {t.label}
            </Link>
          );
        })}
      </nav>
    ) : null}
  </header>
);

export default ProgrammesHeader;
