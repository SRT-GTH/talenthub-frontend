import { debug } from '../../../utils/debug.js';
import Button from '../../ui/Button.jsx';
import Chip from '../../ui/Chip.jsx';
import SkeletonBlock from '../../ui/SkeletonBlock.jsx';
import {
  BriefcaseIcon,
  SearchLargeIcon,
  SearchSmallIcon,
  SparklesIcon,
} from './talentSearchMenuIcons.jsx';
import { FIRST_VISIT, LOADING_SKELETON_COUNT, NO_RESULTS } from './talentSearchFilterData.js';

const log = debug('TalentSearchStates');

/*
 * TalentSearchStates — the three non-results screens of /recruiter/talent-search.
 *   TalentResultsLoading  TS-08, Figma 10102:40681  six skeleton cards (432×334, r20, the #ecefe9→#f4f6f1 shimmer of `SkeletonBlock`), 3 × 2 at xl, 2 × 3 at md, 1 column on phones.
 *   TalentNoResults       TS-09, Figma 10102:40976  centred: 64px amber tile with the search glyph, a 28px title, a body line, three "Remove / Experience / Include" suggestion rows
 *                         (each with a "+N talents" chip and an Apply link), then "Clear all filters" and "Ask Hiring Assistant".
 *   TalentFirstVisit      TS-10, Figma 10102:41272  "Start from one of your open roles" (three role cards with "See matches") and "Popular searches" pills.
 * Props: see each component; all copy comes from talentSearchFilterData.js.
 */
export const TalentResultsLoading = () => {
  log('render loading', { count: LOADING_SKELETON_COUNT });
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Finding matches"
      className="grid w-full grid-cols-1 gap-[16px] md:grid-cols-2 xl:grid-cols-3"
    >
      {Array.from({ length: LOADING_SKELETON_COUNT }, (_, index) => (
        <SkeletonBlock
          key={index}
          className="h-[334px] w-full rounded-[20px] max-sm:h-[220px] max-sm:rounded-[16px]"
        />
      ))}
    </div>
  );
};

export const TalentNoResults = ({ onApply, onClearAll, onAskAssistant }) => {
  log('render no results');
  return (
    <div className="mx-auto flex w-full max-w-[620px] flex-col items-center gap-[14px] pt-[40px] pb-[8px] max-md:pt-[16px]">
      <span className="flex size-[64px] items-center justify-center rounded-[10px] bg-[#faf4e8] text-[#463409]">
        <SearchLargeIcon className="size-[32px]" />
      </span>
      <h2 className="m-0 text-center font-heading text-[clamp(1.375rem,1.1rem+0.9vw,1.75rem)] leading-[1.21] font-semibold tracking-[-0.02em] text-[#111]">
        {NO_RESULTS.title}
      </h2>
      <p className="m-0 max-w-[520px] text-center font-sans text-[14px] leading-[24px] tracking-[0.2px] text-[#575755]">
        {NO_RESULTS.body}
      </p>
      <ul className="m-0 mt-[8px] flex w-full list-none flex-col gap-[10px] p-0">
        {NO_RESULTS.suggestions.map((suggestion) => (
          <li
            key={suggestion.id}
            className="flex min-h-[60px] items-center gap-[12px] rounded-[16px] border border-solid border-[#e5e8e3] bg-white p-[16px] max-sm:flex-wrap max-sm:gap-x-[10px] max-sm:gap-y-[4px] max-sm:p-[12px]"
          >
            <SparklesIcon className="size-[18px] shrink-0 text-[#387440]" />
            <span className="min-w-0 flex-1 font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#111] max-sm:basis-[calc(100%-120px)]">
              {suggestion.label}
            </span>
            <Chip tone="success">{suggestion.gain}</Chip>
            <button
              type="button"
              onClick={() => {
                log('branch: apply suggestion', suggestion.id);
                onApply?.(suggestion);
              }}
              className="inline-flex min-h-[24px] min-w-[36px] cursor-pointer items-center justify-center border-0 bg-transparent p-0 font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#387440] max-lg:min-h-[32px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
              aria-label={`${NO_RESULTS.applyLabel}: ${suggestion.label}`}
            >
              {NO_RESULTS.applyLabel}
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-[8px] flex flex-wrap items-center justify-center gap-[12px]">
        <Button variant="tertiary" size="lg" onClick={onClearAll} className="whitespace-nowrap">
          {NO_RESULTS.clearAll}
        </Button>
        <Button variant="primary" size="sm" onClick={onAskAssistant} className="whitespace-nowrap">
          {NO_RESULTS.askAssistant}
        </Button>
      </div>
    </div>
  );
};

export const TalentFirstVisit = ({ onSeeMatches, onPickPopular }) => {
  log('render first visit');
  return (
    <div className="flex w-full flex-col gap-[40px] max-md:gap-[24px]">
      <section aria-labelledby="talent-open-roles" className="flex flex-col gap-[20px]">
        <h2
          id="talent-open-roles"
          className="m-0 font-heading text-[clamp(1.125rem,1rem+0.4vw,1.375rem)] leading-[1.18] font-semibold tracking-[-0.02em] text-[#111]"
        >
          {FIRST_VISIT.rolesHeading}
        </h2>
        <ul className="m-0 grid w-full list-none grid-cols-1 gap-[16px] p-0 md:grid-cols-2 xl:grid-cols-3">
          {FIRST_VISIT.roles.map((role) => (
            <li
              key={role.id}
              className="flex min-w-0 flex-col gap-[12px] rounded-[16px] border border-solid border-[#e5e8e3] bg-white p-[24px] shadow-[0_1px_2px_rgba(15,15,10,0.05),0_6px_16px_-4px_rgba(15,15,10,0.07)] max-sm:p-[16px]"
            >
              <div className="flex items-center justify-between gap-[12px]">
                <span className="flex size-[40px] items-center justify-center rounded-[10px] bg-[#ebf1ec] text-[#2a5730]">
                  <BriefcaseIcon className="size-[20px]" />
                </span>
                <Chip tone="success">
                  <SparklesIcon className="size-[12px]" />
                  {role.matches}
                </Chip>
              </div>
              <div className="flex items-end justify-between gap-[10px]">
                <div className="flex min-w-0 flex-col gap-[10px]">
                  <h3 className="m-0 font-heading text-[clamp(1.125rem,1rem+0.4vw,1.375rem)] leading-[1.18] font-semibold tracking-[-0.02em] text-[#111]">
                    {role.title}
                  </h3>
                  <p className="m-0 font-sans text-[12px] leading-[20px] tracking-[0.2px] text-[#575755]">
                    {role.meta}
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  className="shrink-0 !py-[8px] !text-[14px] whitespace-nowrap"
                  aria-label={`${FIRST_VISIT.seeMatches} for ${role.title}`}
                  onClick={() => onSeeMatches?.(role)}
                >
                  {FIRST_VISIT.seeMatches}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="talent-popular-searches" className="flex flex-col gap-[20px]">
        <h2
          id="talent-popular-searches"
          className="m-0 font-heading text-[clamp(1.125rem,1rem+0.4vw,1.375rem)] leading-[1.18] font-semibold tracking-[-0.02em] text-[#111]"
        >
          {FIRST_VISIT.popularHeading}
        </h2>
        <ul className="m-0 flex list-none flex-wrap gap-[8px] p-0">
          {FIRST_VISIT.popular.map((text) => (
            <li key={text}>
              <button
                type="button"
                onClick={() => onPickPopular?.(text)}
                className="inline-flex min-h-[42px] cursor-pointer items-center gap-[6px] rounded-full border border-solid border-[#dbded9] bg-white px-[16px] py-[8px] font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#111] hover:bg-[#f8f8f4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
              >
                <SearchSmallIcon className="size-[16px] shrink-0 text-[#575755]" />
                {text}
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};
