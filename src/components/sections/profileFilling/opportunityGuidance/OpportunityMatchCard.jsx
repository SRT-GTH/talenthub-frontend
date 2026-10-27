import { classNames } from '../../../../utils/classNames.js';
import { OPPORTUNITY_COPY } from './opportunityGuidanceData.js';
import {
  OpportunityArrowRightIcon,
  OpportunityCloseIcon,
  OpportunityPinIcon,
  OpportunitySparkleIcon,
  OpportunityShieldIcon,
  OpportunityTickIcon,
} from './opportunityIcons.jsx';

const FACT_PILL =
  'inline-flex items-center gap-[4px] rounded-full bg-white/12 px-[10px] py-[5px] font-sans text-[11px] font-medium leading-[13px] tracking-[0.2px] text-white max-lg:text-[12px]';

/*
 * OpportunityMatchCard - one "Job proposal card" of the Career Buddy opportunity matches (Figma 9222:118005 ...).
 * `match` is an OPPORTUNITY_MATCHES row; `onView` opens the role, `onWhy` asks the buddy "Card N - Why this match?".
 */
const initials = (name) =>
  String(name || '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('') || '·';

// `compact`: the narrower card for the Ask Buddy side panel (480px wide), where a 420px card would not leave room to scroll.
const OpportunityMatchCard = ({ match, onView, onWhy, whyDisabled = false, compact = false }) => (
  <article
    aria-label={match.company ? `${match.title}, ${match.company}` : match.title}
    className={`flex ${compact ? 'w-[min(320px,78vw)]' : 'w-[min(420px,84vw)]'} shrink-0 flex-col gap-[16px] rounded-[16px] bg-[linear-gradient(135deg,#142916,#2a5730)] p-[16px] text-white shadow-[0_5px_17px_rgba(31,69,38,0.09)] playful:border-[1.5px] playful:border-solid playful:border-[#1c2a21]/55 playful:shadow-[4px_4px_0_rgba(28,42,33,0.55)]`}
  >
    <header className="flex items-center gap-[10px]">
      {match.logo ? (
        <img
          src={match.logo}
          alt=""
          className="size-[40px] shrink-0 rounded-[10px] bg-white object-cover"
        />
      ) : (
        // Live postings without a logo: the company's initials on the same white tile.
        <span
          aria-hidden="true"
          className="flex size-[40px] shrink-0 items-center justify-center rounded-[10px] bg-white font-sans text-[14px] font-semibold text-[#1f4526]"
        >
          {initials(match.company || match.title)}
        </span>
      )}
      <div className="flex min-w-0 flex-1 items-start justify-between gap-[6px]">
        <div className="flex min-w-0 flex-col gap-[4px]">
          <span className="flex items-center gap-[4px] font-sans text-[12px] leading-[14px] tracking-[0.2px]">
            <OpportunityShieldIcon className="size-[13px] shrink-0" />
            <span className="min-w-0 truncate">
              {match.company
                ? `${match.company} · ${OPPORTUNITY_COPY.jobTag}`
                : OPPORTUNITY_COPY.jobTag}
            </span>
          </span>
          <h3 className="m-0 font-sans text-[16px] font-semibold leading-[19px] tracking-[0.2px] playful:font-heading max-lg:text-[16px]">
            {match.title}
          </h3>
        </div>
        {match.closes ? (
          <span className="mt-[8px] shrink-0 whitespace-nowrap rounded-full bg-white/16 px-[10px] py-[4px] font-sans text-[11px] font-semibold leading-[13px] tracking-[0.2px] max-lg:text-[12px]">
            {match.closes}
          </span>
        ) : null}
      </div>
    </header>

    <ul className="m-0 flex list-none flex-wrap gap-[6px] p-0">
      {match.facts.map((fact, i) => (
        <li key={fact} className={FACT_PILL}>
          {i === 0 && match.placeFirst !== false ? (
            <OpportunityPinIcon className="size-[10px] shrink-0" />
          ) : null}
          {fact}
        </li>
      ))}
    </ul>

    <div className="flex flex-col gap-[12px] rounded-[12px] bg-white/8 px-[12px] py-[10px]">
      <div className="flex flex-col gap-[8px]">
        <div className="flex items-center gap-[6px]">
          <OpportunitySparkleIcon className="h-[12px] w-[14px] shrink-0 text-[#f3c84b]" />
          <span className="font-sans text-[14px] font-semibold leading-[24px] tracking-[0.2px]">
            {match.match}% match
          </span>
          <span className="min-w-0 flex-1 text-right font-sans text-[12px] font-medium leading-[14px] tracking-[0.2px] text-white/75">
            {match.keySkills}
          </span>
        </div>
        <div
          role="meter"
          aria-label={`${match.match}% match`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={match.match}
          className="h-[6px] w-full overflow-hidden rounded-full bg-white/18"
        >
          <div
            className="h-full rounded-full bg-[#f3c84b]"
            style={{ width: `${Math.round(match.meter * 100)}%` }}
          />
        </div>
      </div>
      {match.skills.length ? (
        <ul className="m-0 flex list-none flex-wrap gap-[6px] p-0">
          {match.skills.map((skill) => (
            <li
              key={skill.name}
              className="inline-flex items-center gap-[3px] rounded-full bg-white/12 px-[10px] py-[5px] font-sans text-[10.5px] font-medium leading-[13px] tracking-[0.2px] text-white max-lg:text-[12px]"
            >
              {skill.have ? (
                <OpportunityTickIcon className="size-[12px] shrink-0 text-[#f3c84b]" />
              ) : (
                <OpportunityCloseIcon className="size-[12px] shrink-0 text-[#c0392b]" />
              )}
              <span className="sr-only">{skill.have ? 'You have' : 'Missing'}</span>
              {skill.name}
            </li>
          ))}
        </ul>
      ) : null}
    </div>

    <div className="flex flex-col items-center gap-[6px]">
      <button
        type="button"
        onClick={onView}
        className="flex min-h-[35px] w-full cursor-pointer items-center justify-center gap-[6px] rounded-[10px] border-2 border-solid border-[#1c2a21]/30 bg-white px-[12px] font-sans text-[14px] font-medium leading-[24px] tracking-[0.1px] text-[#1c2a21] shadow-[0_4px_0_rgba(0,0,0,0)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f3c84b] playful:border-[#1c2a21]"
      >
        {OPPORTUNITY_COPY.viewOpportunity}
        <OpportunityArrowRightIcon className={classNames('size-[20px] shrink-0 text-[#387440]')} />
      </button>
      <button
        type="button"
        onClick={onWhy}
        disabled={whyDisabled}
        className="min-h-[24px] cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 border-0 bg-transparent p-0 font-sans text-[12px] font-normal leading-[18px] tracking-[0.2px] text-[#f3c84b] underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f3c84b] max-lg:text-[12px]"
      >
        {OPPORTUNITY_COPY.whyThisMatch}
      </button>
    </div>
  </article>
);

export default OpportunityMatchCard;
