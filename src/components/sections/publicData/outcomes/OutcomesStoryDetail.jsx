import { Link } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import { DATA_BASE } from '../publicDataNav.js';
import PublicCard from '../ui/PublicCard.jsx';
import { PublicIconShield } from '../showcase/showcaseIcons.jsx';
import { OUTCOMES_COPY, OUTCOME_STORY_COPY } from './data/outcomesData.js';

/*
 * OutcomesStoryDetail — Figma 8.5.1b case study (8496:348427, 1728) and phone story (8516:407).
 *   hero 1440x420 (photo cover + gradient transparent -> rgba(20,41,23,.85)), text at the bottom-left: kicker 13/16 600 caps +0.78 #c1d4c4,
 *   h1 44/53 600 -0.44 white, consent line 14/17 500 #e1eae2. Body px120 (tablet 28), gap 48: story column 752 (breadcrumb Outcomes › Stories › Abena A.,
 *   three 18/30 paragraphs, "Her journey on GTH" 22/26 600 + timeline) and aside 400 ("At a glance" card, consent note, "More stories" with two 400x92 cards).
 *   Phone: photo 358x220 r20, kicker 12/14, h1 26/30, consent 12/14, one 16/20 paragraph, "At a glance" card with three rows.
 * ⚠️ ASSUMPTION: only the first story has a drawn detail page. The other two stories render the same page from the data they have (kicker, title, summary,
 * photo, "Region") with the Figma line "Shared with each talent’s written consent." — nothing is invented.
 * embedded (opt-in, agency portal 11.4.2q): rounded 420-high hero, title as <h2>, 16/20 paragraphs, one column, no own padding.
 * Props: story, others (the other stories for "More stories"), base (route prefix of the links, default /data; the agency portal passes /agency)
 */

const FOCUS =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';

const OutcomesStoryDetail = ({ story, others, base = DATA_BASE, embedded = false }) => {
  const d = story.detail;
  const glance = d?.glance ?? [{ label: 'Region', value: story.region }];
  const glanceShort = d?.glanceShort ?? glance;
  const paragraphs = d?.body ?? [story.summary];
  const byline = d?.byline ?? `${story.kicker} · Sample story`;
  const consentLine = d?.consentLine ?? OUTCOMES_COPY.storiesSub;
  const person = d?.personName ?? story.title;
  return (
    <article className="flex flex-col font-sans">
      <header
        className={classNames(
          'relative hidden items-end bg-[#1c2a21] bg-cover bg-center md:flex',
          embedded
            ? 'min-h-[420px] overflow-hidden rounded-[16px] px-[28px] pb-[64px]'
            : 'min-h-[420px] px-[28px] pb-[64px] xl:px-[120px]'
        )}
        style={{ backgroundImage: `url(${story.photo})` }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-[rgba(20,41,23,0)] to-[rgba(20,41,23,0.85)]"
        />
        <div className="relative flex max-w-[760px] flex-col gap-[10px]">
          <p className="m-0 text-[13px] leading-[16px] font-semibold tracking-[0.78px] text-[#c1d4c4] uppercase">
            {byline}
          </p>
          {embedded ? (
            <h2 className="m-0 text-[44px] leading-[53px] font-semibold tracking-[-0.44px] text-white">
              {story.title}
            </h2>
          ) : (
            <h1 className="m-0 text-[44px] leading-[53px] font-semibold tracking-[-0.44px] text-white">
              {story.title}
            </h1>
          )}
          <p className="m-0 text-[14px] leading-[17px] font-medium text-[#e1eae2]">{consentLine}</p>
        </div>
      </header>

      <div
        className={classNames(
          'flex flex-col gap-[16px] md:grid',
          embedded
            ? 'pt-[16px] md:gap-[24px] md:pt-[16px]'
            : 'px-[16px] pt-[16px] pb-[24px] md:gap-[48px] md:px-[28px] md:pt-[48px] md:pb-[64px] xl:grid-cols-[minmax(0,752fr)_minmax(0,400fr)] xl:px-[120px]'
        )}
      >
        <div className="flex min-w-0 flex-col gap-[16px] md:gap-[20px]">
          <img
            src={story.photo}
            alt=""
            width="358"
            height="220"
            className="h-[220px] w-full rounded-[20px] object-cover md:hidden"
          />
          <nav
            aria-label="Breadcrumb"
            className="hidden items-center gap-[8px] text-[14px] leading-[17px] md:flex"
          >
            <Link
              to={`${base}/outcomes`}
              className={classNames(
                'inline-flex min-h-[24px] items-center font-semibold text-[#387440] no-underline',
                FOCUS
              )}
            >
              {OUTCOME_STORY_COPY.breadcrumbRoot}
            </Link>
            <span aria-hidden="true" className="text-[#595959]">
              ›
            </span>
            <Link
              to={`${base}/outcomes#outcomes-stories`}
              className={classNames(
                'inline-flex min-h-[24px] items-center font-semibold text-[#387440] no-underline',
                FOCUS
              )}
            >
              {OUTCOME_STORY_COPY.breadcrumbMid}
            </Link>
            <span aria-hidden="true" className="text-[#595959]">
              ›
            </span>
            <span aria-current="page" className="font-medium text-[#1c2a21]">
              {person}
            </span>
          </nav>
          <div className="flex flex-col gap-[6px] md:hidden">
            <p className="m-0 text-[12px] leading-[14px] font-semibold tracking-[0.72px] text-[#387440] uppercase">
              {story.kicker}
            </p>
            <h1 className="m-0 pt-[8px] text-[26px] leading-[30px] font-semibold text-[#1c2a21]">
              {story.title}
            </h1>
            <p className="m-0 pt-[10px] text-[12px] leading-[14px] font-medium text-[#595959]">
              {d?.mobileConsent ?? OUTCOMES_COPY.storiesSub}
            </p>
          </div>
          {d?.mobileIntro && (
            <p className="m-0 pt-[6px] text-[16px] leading-[20px] text-[#1c2a21] md:hidden">
              {d.mobileIntro}
            </p>
          )}
          {!d?.mobileIntro && (
            <p className="m-0 pt-[6px] text-[16px] leading-[20px] text-[#1c2a21] md:hidden">
              {story.summary}
            </p>
          )}
          <div
            className={classNames(
              'hidden flex-col md:flex',
              embedded ? 'gap-[14px]' : 'gap-[20px]'
            )}
          >
            {paragraphs.map((text) => (
              <p
                key={text}
                className={classNames(
                  'm-0 text-[#1c2a21]',
                  embedded ? 'text-[16px] leading-[20px]' : 'text-[18px] leading-[30px]'
                )}
              >
                {text}
              </p>
            ))}
          </div>
          {d?.timeline && (
            <section
              aria-labelledby="story-journey"
              className="hidden flex-col gap-[20px] pt-[0px] md:flex"
            >
              <h2
                id="story-journey"
                className="m-0 text-[22px] leading-[26px] font-semibold text-[#1c2a21]"
              >
                {d.timelineTitle}
              </h2>
              <ol className="m-0 flex list-none flex-col p-0">
                {d.timeline.map((step, i) => {
                  const last = i === d.timeline.length - 1;
                  return (
                    <li key={step.when + step.what} className="flex gap-[16px]">
                      <span
                        aria-hidden="true"
                        className="flex w-[14px] shrink-0 flex-col items-center"
                      >
                        <span
                          className={classNames(
                            'size-[14px] shrink-0 rounded-full border-2 border-solid border-[#387440]',
                            last ? 'bg-[#387440]' : 'bg-white'
                          )}
                        />
                        {!last && <span className="mt-[0px] h-[38px] w-[2px] bg-[#c1d4c4]" />}
                      </span>
                      <span className={classNames('flex flex-col gap-[2px]', !last && 'pb-[0px]')}>
                        <span className="text-[12px] leading-[14px] font-semibold tracking-[0.72px] text-[#595959] uppercase">
                          {step.when}
                        </span>
                        <span className="text-[16px] leading-[19px] font-medium text-[#1c2a21]">
                          {step.what}
                        </span>
                      </span>
                    </li>
                  );
                })}
              </ol>
            </section>
          )}
        </div>

        <aside className="flex min-w-0 flex-col gap-[16px]" aria-label="About this story">
          <PublicCard
            id="story-glance"
            title={OUTCOME_STORY_COPY.atAGlance}
            bodyClassName="px-[16px] pb-[16px] md:px-[24px] md:pb-[24px]"
          >
            <dl className="m-0 hidden flex-col gap-[14px] md:flex">
              {glance.map((row) => (
                <div key={row.label} className="flex items-baseline justify-between gap-[12px]">
                  <dt className="text-[14px] leading-[17px] font-medium text-[#595959]">
                    {row.label}
                  </dt>
                  <dd className="m-0 text-right text-[14px] leading-[17px] font-semibold text-[#1c2a21]">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
            <dl className="m-0 flex flex-col gap-[12px] md:hidden">
              {glanceShort.map((row) => (
                <div key={row.label} className="flex items-baseline justify-between gap-[8px]">
                  <dt className="text-[14px] leading-[17px] font-medium text-[#595959]">
                    {row.label}
                  </dt>
                  <dd className="m-0 text-right text-[14px] leading-[17px] font-semibold text-[#1c2a21]">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </PublicCard>
          <p className="m-0 hidden items-start gap-[10px] rounded-[14px] bg-[#ebf1ec] px-[16px] py-[14px] text-[13px] leading-[18px] font-medium text-[#2a5730] md:flex">
            <PublicIconShield className="mt-[0px] size-[18px] shrink-0 text-[#387440]" />
            {d?.consentNote ??
              'Published with consent. The talent chose what to share and can withdraw this story at any time.'}
          </p>
          <section aria-labelledby="story-more" className="hidden flex-col gap-[14px] md:flex">
            <h2
              id="story-more"
              className="m-0 text-[16px] leading-[19px] font-semibold text-[#1c2a21]"
            >
              {OUTCOME_STORY_COPY.moreStories}
            </h2>
            <ul className="m-0 flex list-none flex-col gap-[16px] p-0">
              {others.map((o) => (
                <li key={o.id}>
                  <Link
                    to={`${base}/outcomes/stories/${o.id}`}
                    className={classNames(
                      'flex h-[92px] items-center overflow-hidden rounded-[24px] border border-solid border-[#e7e7e7] bg-white text-inherit no-underline shadow-[0_5px_17px_rgba(0,0,0,0.04)] hover:border-[#387440]',
                      FOCUS
                    )}
                  >
                    <img
                      src={o.photo}
                      alt=""
                      width="110"
                      height="90"
                      loading="lazy"
                      className="h-[90px] w-[110px] shrink-0 object-cover"
                    />
                    <span className="flex min-w-0 flex-col gap-[4px] px-[16px]">
                      <span className="text-[12px] leading-[14px] font-semibold tracking-[0.66px] text-[#387440] uppercase">
                        {o.shortKicker ?? o.kicker}
                      </span>
                      <span className="text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
                        {o.title}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </article>
  );
};

export default OutcomesStoryDetail;
