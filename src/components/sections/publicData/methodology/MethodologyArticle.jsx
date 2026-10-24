import { useEffect, useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { PublicIconCheckcircle, PublicIconDownload } from '../directory/directoryIcons.jsx';
import LinkButton from '../directory/LinkButton.jsx';
import {
  METHODOLOGY_DEFINITIONS,
  METHODOLOGY_META,
  METHODOLOGY_QUESTIONS,
  METHODOLOGY_SECTIONS as S,
  METHODOLOGY_TOC,
} from './data/methodologyData.js';

const log = debug('MethodologyArticle');

/*
 * MethodologyArticle — Figma 8.7.1a "Methodology page" (8499:9) on desktop and tablet (8516:356171): "On this page" contents column
 * (240 desktop / 200 tablet, sticky) + the article (max 840): title 44/53, intro 19/30, "Last reviewed …", the sections h2 24/29 600,
 * the "Privacy protections" box (#ebf1ec r20), the definitions table (white card r24, term 15/18 600 | text 15/22), the questions card.
 * The contents list highlights the section being read (Figma draws "Privacy protections" highlighted: that is the initial state until the
 * reader scrolls). ⚠️ ASSUMPTION: "Changes to this page" has no drawn section; it scrolls to the "Last reviewed … Version" line.
 * ⚠️ ASSUMPTION: "Ask the data team" has no drawn destination (the footer "Contact" is inert too): the button logs and does nothing yet.
 * Props: onDownload() ("Download as PDF" opens the shared Download dialog).
 */

const SECTION_FONT = 'm-0 font-sans text-[24px] leading-[29px] font-semibold text-[#1c2a21]';
const BODY = 'm-0 font-sans text-[16px] leading-[26px] text-[#1c2a21]';

const MethodologyArticle = ({ onDownload }) => {
  const [active, setActive] = useState('privacy');

  useEffect(() => {
    const onScroll = () => {
      const ids = METHODOLOGY_TOC.map((t) => t.id);
      let current = null;
      ids.forEach((id) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 140) current = id;
      });
      if (current) setActive((prev) => (prev === current ? prev : current));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const jump = (e, id) => {
    e.preventDefault();
    log('jump', id);
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.history.replaceState(null, '', `#${id}`);
  };

  return (
    <div className="hidden gap-[32px] px-[40px] pt-[48px] pb-[64px] md:flex xl:gap-[56px] xl:px-[120px]">
      <nav
        aria-label="On this page"
        className="sticky top-[124px] hidden w-[200px] shrink-0 flex-col gap-[4px] self-start md:flex xl:w-[240px]"
      >
        <p className="m-0 mb-[2px] font-sans text-[12px] leading-[14px] font-semibold tracking-[0.72px] text-[#595959] uppercase">
          On this page
        </p>
        {METHODOLOGY_TOC.map((item) => {
          const on = item.id === active;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              aria-current={on ? 'location' : undefined}
              onClick={(e) => jump(e, item.id)}
              className={classNames(
                'rounded-[8px] px-[12px] py-[8px] font-sans text-[14px] leading-[17px] no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
                on
                  ? 'bg-[#ebf1ec] font-semibold text-[#2a5730]'
                  : 'font-medium text-[#1c2a21] hover:bg-[#f2f2ee]'
              )}
            >
              {item.label}
            </a>
          );
        })}
        <button
          type="button"
          onClick={onDownload}
          className="mt-[16px] flex w-fit cursor-pointer items-center gap-[8px] rounded-[6px] bg-transparent p-0 font-sans text-[14px] leading-[17px] font-semibold text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          <PublicIconDownload className="size-[16px] shrink-0" />
          Download as PDF
        </button>
      </nav>

      <article className="flex min-w-0 max-w-[840px] flex-1 flex-col gap-[20px]">
        <h1 className="m-0 font-sans text-[44px] leading-[53px] font-semibold tracking-[-0.66px] text-[#1c2a21]">
          {METHODOLOGY_META.title}
        </h1>
        <p className="m-0 font-sans text-[19px] leading-[30px] text-[#595959]">
          {METHODOLOGY_META.intro}
        </p>
        <p
          id="changes"
          className="m-0 scroll-mt-[100px] font-sans text-[13px] leading-[16px] font-medium text-[#595959]"
        >
          {METHODOLOGY_META.lastReviewed}
        </p>

        <section aria-labelledby="sources-h" className="flex flex-col gap-[20px]">
          <h3 id="sources" className={classNames(SECTION_FONT, 'scroll-mt-[100px]')}>
            <span id="sources-h">{S.sources.title}</span>
          </h3>
          <p className={BODY}>{S.sources.body}</p>
        </section>

        <section aria-labelledby="count-h" className="flex flex-col gap-[20px]">
          <h3 id="count" className={classNames(SECTION_FONT, 'scroll-mt-[100px]')}>
            <span id="count-h">{S.count.title}</span>
          </h3>
          <p className={BODY}>{S.count.body}</p>
        </section>

        <section
          aria-labelledby="privacy-h"
          className="flex flex-col gap-[12px] rounded-[20px] bg-[#ebf1ec] px-[24px] py-[22px]"
        >
          <h3 id="privacy" className={classNames(SECTION_FONT, 'scroll-mt-[100px] text-[#2a5730]')}>
            <span id="privacy-h">{S.privacy.title}</span>
          </h3>
          <ul className="m-0 flex list-none flex-col gap-[12px] p-0">
            {S.privacy.points.map((p) => (
              <li key={p.title} className="flex gap-[12px]">
                <PublicIconCheckcircle className="mt-[0px] size-[20px] shrink-0 text-[#387440]" />
                <div className="flex min-w-0 flex-col gap-[2px]">
                  <p className="m-0 font-sans text-[16px] leading-[19px] font-semibold text-[#2a5730]">
                    {p.title}
                  </p>
                  <p className="m-0 font-sans text-[15px] leading-[22px] text-[#2a5730]">
                    {p.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="fresh-h" className="flex flex-col gap-[20px]">
          <h3 id="fresh" className={classNames(SECTION_FONT, 'scroll-mt-[100px]')}>
            <span id="fresh-h">{S.fresh.title}</span>
          </h3>
          <p className={BODY}>{S.fresh.body}</p>
        </section>

        <section aria-labelledby="definitions-h" className="flex flex-col gap-[20px]">
          <h3 id="definitions" className={classNames(SECTION_FONT, 'scroll-mt-[100px]')}>
            <span id="definitions-h">{S.definitions.title}</span>
          </h3>
          <dl className="m-0 overflow-hidden rounded-[24px] border border-solid border-[#e7e7e7] bg-white shadow-[0_5px_17px_rgba(0,0,0,0.04)]">
            {METHODOLOGY_DEFINITIONS.map((d, i) => (
              <div
                key={d.id}
                className={classNames(
                  'grid grid-cols-[minmax(0,180px)_minmax(0,1fr)] gap-[24px] px-[20px] py-[16px] font-sans xl:grid-cols-[200px_minmax(0,540px)]',
                  i > 0 && 'border-t border-solid border-[#e7e7e7]'
                )}
              >
                <dt className="text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
                  {d.term}
                </dt>
                <dd className="m-0 text-[15px] leading-[22px] text-[#1c2a21]">{d.body}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="limits-h" className="flex flex-col gap-[20px]">
          <h3 id="limits" className={classNames(SECTION_FONT, 'scroll-mt-[100px]')}>
            <span id="limits-h">{S.limits.title}</span>
          </h3>
          <p className={BODY}>{S.limits.body}</p>
        </section>

        <aside
          aria-label="Questions"
          className="flex flex-wrap items-center justify-between gap-[16px] rounded-[20px] border border-solid border-[#e7e7e7] bg-white px-[24px] py-[20px] shadow-[0_5px_17px_rgba(0,0,0,0.04)]"
        >
          <div className="flex flex-col gap-[2px]">
            <p className="m-0 font-sans text-[17px] leading-[20px] font-semibold text-[#1c2a21]">
              {METHODOLOGY_QUESTIONS.title}
            </p>
            <p className="m-0 font-sans text-[14px] leading-[17px] text-[#595959]">
              {METHODOLOGY_QUESTIONS.note}
            </p>
          </div>
          <LinkButton
            to="/data/methodology#changes"
            variant="outline"
            onClick={() => log('ask the data team (no destination drawn)')}
          >
            {METHODOLOGY_QUESTIONS.action}
          </LinkButton>
        </aside>
      </article>
    </div>
  );
};

export default MethodologyArticle;
