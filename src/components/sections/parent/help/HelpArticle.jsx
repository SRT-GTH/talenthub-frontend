import { useState } from 'react';
import { Link } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { ARTICLE_FEEDBACK } from './data/articleData.js';

const log = debug('HelpArticle');

/*
 * HelpArticle — a help article page body (Figma PH-02 "Help article · Opting out and privacy" 10053:3343): title 34/600 over the #999 crumb ("Help and guides › Your controls"), a white card
 * (r24, p32, gap 16) of sections (18/600 heading over a 14 / 1.55 #575755 paragraph, gap 12; the last section gap 4 as drawn), the "Was this helpful?" row (13/600, two 32px chips Yes / Not really),
 * and on the right (360) the mint "Related" card (#ebf1ec, r24, p22, gap 16: 16/600 title, three 13/600 #387440 links).
 * Props: article ({ title, crumb, sections, related }).
 * The crumb's "Help and guides" links back to /parent/help. ⚠️ ASSUMPTION: the feedback chips toggle a selected look only (nothing is sent); related links without a built target only log.
 * Layout: the Related card sits right from 1280px, below the article under that.
 */
const CHIP =
  'flex h-[32px] cursor-pointer items-center gap-[6px] rounded-full border border-solid px-[14px] font-sans text-[13px] leading-[normal] font-semibold whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';

const HelpArticle = ({ article }) => {
  const [vote, setVote] = useState(null);
  log('render', { title: article.title, vote });
  return (
    <div className="mx-auto flex w-full max-w-[1329px] flex-col gap-[24px] pt-[clamp(0px,0.7vw,12px)]">
      <div className="flex flex-col gap-[3px]">
        <h1 className="m-0 font-sans text-[clamp(26px,1.97vw,34px)] leading-[1.2] font-semibold tracking-[-0.68px] text-[#1c2a21]">
          {article.title}
        </h1>
        <p className="m-0 font-sans text-[16px] leading-[24px] tracking-[0.2px] text-[#999]">
          <Link to="/parent/help" className="text-inherit no-underline hover:underline">
            Help and guides
          </Link>{' '}
          › {article.crumb}
        </p>
      </div>

      <div className="flex flex-col items-start gap-[24px] min-[1280px]:flex-row">
        <article className="flex w-full min-w-0 flex-1 flex-col gap-[16px] rounded-[24px] border border-solid border-[#e7e7e7] bg-white p-[32px] shadow-[0_5px_17px_rgba(28,42,33,0.03)] max-sm:p-[20px]">
          {article.sections.map((s) => (
            <section
              key={s.heading}
              className={classNames(
                'flex flex-col items-start',
                s.tight ? 'gap-[4px]' : 'gap-[12px]'
              )}
            >
              <h2 className="m-0 font-sans text-[18px] leading-[normal] font-semibold text-[#1c2a21]">
                {s.heading}
              </h2>
              <p className="m-0 font-sans text-[14px] leading-[1.55] text-[#575755]">{s.body}</p>
            </section>
          ))}
          <div className="flex flex-wrap items-center gap-[10px]">
            <p className="m-0 font-sans text-[13px] leading-[normal] font-semibold whitespace-nowrap text-[#1c2a21]">
              {ARTICLE_FEEDBACK.prompt}
            </p>
            {[
              ['yes', ARTICLE_FEEDBACK.yes],
              ['no', ARTICLE_FEEDBACK.no],
            ].map(([id, label]) => (
              <button
                key={id}
                type="button"
                aria-pressed={vote === id}
                onClick={() => {
                  log('feedback', id);
                  setVote(id);
                }}
                className={classNames(
                  CHIP,
                  vote === id
                    ? 'border-[#387440] bg-[#ebf1ec] text-[#387440]'
                    : 'border-[#e1eae2] bg-white text-[#595959]'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </article>

        <aside
          aria-label="Related"
          className="flex w-full shrink-0 flex-col items-start gap-[16px] rounded-[24px] bg-[#ebf1ec] p-[22px] font-sans leading-[normal] font-semibold min-[1280px]:w-[360px]"
        >
          <h2 className="m-0 text-[16px] font-semibold text-[#1c2a21]">Related</h2>
          {article.related.map((r) =>
            r.to ? (
              <Link
                key={r.label}
                to={r.to}
                className="text-[13px] text-[#387440] no-underline hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
              >
                {r.label}
              </Link>
            ) : (
              <button
                key={r.label}
                type="button"
                onClick={() => log('related (no article designed yet):', r.label)}
                className="cursor-pointer border-0 bg-transparent p-0 text-left text-[13px] font-semibold text-[#387440] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
              >
                {r.label}
              </button>
            )
          )}
        </aside>
      </div>
    </div>
  );
};

export default HelpArticle;
