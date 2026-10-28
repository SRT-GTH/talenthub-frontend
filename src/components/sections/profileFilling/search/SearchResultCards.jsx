import { useId, useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import {
  OpportunityArrowRightIcon,
  OpportunityShieldIcon,
} from '../opportunityGuidance/opportunityIcons.jsx';

const log = debug('SearchResultCards');

/*
 * SearchResultCards - Career Buddy search results (2026-10-27, search Phase 1, backend gthSearch.query): one card per
 * result in the opportunity-card style - type tile, the first fact (type / source), title, snippet, fact pills, then
 * an Open button for things with a page (post, job, course, community) or "Ask Career Buddy" for those without
 * (career, SHS programme, tertiary programme), and "Why this?" (where the words matched).
 * Props: results (agent searchResults cards), onOpen(card) (navigate to card.link), onAsk(card) (send card.ask),
 * onDetails(card) (Iteration 9: the details sheet for career / elective / programme), onWhy(card) ("Why this?"
 * opened - a signal), disabled, compact (the narrow Ask Buddy panel on /home).
 * Every link comes from the server (app paths only); nothing here builds a URL from text.
 */
const TYPE = {
  post: { mark: 'Aa', open: 'Read post' },
  opportunity: { mark: 'Job', open: 'View opportunity' },
  career: { mark: '★', open: null },
  course: { mark: '▶', open: 'View course' },
  elective: { mark: 'SHS', open: null },
  programme: { mark: 'Uni', open: null },
  community: { mark: '#', open: 'View community' },
};

/** Post marks by kind, like the career post cards. */
const POST_MARK = { article: 'Aa', video: '▶', qa: '?' };

const norm = (s) =>
  String(s || '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

/** The snippet only when it adds something: not when it is the title again (short posts are all title). */
const extraSnippet = (title, snippet) => {
  const t = norm(title).replace(/…$/, '');
  const s = norm(snippet).replace(/…$/, '');
  if (!s || s === t || t.startsWith(s) || (t && s.startsWith(t) && s.length - t.length < 12))
    return null;
  return snippet;
};

const PILL =
  'inline-flex items-center rounded-full bg-white/12 px-[10px] py-[5px] font-sans text-[11px] font-medium leading-[13px] tracking-[0.2px] text-white max-lg:text-[12px]';

/** An app path only (starts with one slash): never an external or javascript: link. */
const safePath = (link) => (typeof link === 'string' && /^\/(?![/\\])/.test(link) ? link : null);

/** Types without a page of their own: Iteration 9 shows their details in a sheet over the chat. */
const DETAIL_TYPES = ['career', 'elective', 'programme'];

const LINK_BUTTON =
  'min-h-[24px] cursor-pointer border-0 bg-transparent p-0 font-sans text-[12px] font-normal leading-[18px] tracking-[0.2px] text-[#f3c84b] underline disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f3c84b]';

export const SearchResultCard = ({ card, onOpen, onAsk, onDetails, onWhy, disabled = false }) => {
  const [whyOpen, setWhyOpen] = useState(false);
  const whyId = `search-why-${useId()}`;
  const kind = TYPE[card.type] || TYPE.post;
  const mark = card.type === 'post' ? POST_MARK[card.subtype] || kind.mark : kind.mark;
  const snippet = extraSnippet(card.title, card.snippet);
  const link = safePath(card.link);
  const hasDetails =
    !link && DETAIL_TYPES.includes(card.type) && typeof card.code === 'string' && !!onDetails;
  const [lead, ...rest] = Array.isArray(card.facts) ? card.facts : [];
  return (
    <article
      aria-label={card.title}
      className="flex w-[min(300px,72vw)] shrink-0 flex-col gap-[12px] rounded-[16px] bg-[linear-gradient(135deg,#142916,#2a5730)] p-[16px] text-white shadow-[0_5px_17px_rgba(31,69,38,0.09)] playful:border-[1.5px] playful:border-solid playful:border-[#1c2a21]/55 playful:shadow-[4px_4px_0_rgba(28,42,33,0.55)]"
    >
      <header className="flex items-start gap-[10px]">
        {card.logo ? (
          <img
            src={card.logo}
            alt=""
            className="size-[40px] shrink-0 rounded-[10px] bg-white object-cover"
          />
        ) : (
          <span
            aria-hidden="true"
            className="flex size-[40px] shrink-0 items-center justify-center rounded-[10px] bg-white font-sans text-[13px] font-semibold text-[#1f4526]"
          >
            {mark}
          </span>
        )}
        <div className="flex min-w-0 flex-col gap-[4px]">
          {lead ? (
            <span className="flex items-center gap-[4px] font-sans text-[12px] leading-[14px] tracking-[0.2px]">
              <OpportunityShieldIcon className="size-[13px] shrink-0" />
              <span className="min-w-0 truncate">{lead}</span>
            </span>
          ) : null}
          <h3 className="m-0 line-clamp-3 font-sans text-[15px] font-semibold leading-[19px] tracking-[0.2px] playful:font-heading">
            {card.title}
          </h3>
        </div>
      </header>

      {snippet ? (
        <p className="m-0 line-clamp-3 font-sans text-[12px] leading-[17px] text-white/85 max-lg:text-[13px]">
          {snippet}
        </p>
      ) : null}

      {rest.length ? (
        <ul className="m-0 flex list-none flex-wrap gap-[6px] p-0">
          {rest.map((fact) => (
            <li key={fact} className={PILL}>
              {fact}
            </li>
          ))}
        </ul>
      ) : null}

      {whyOpen ? (
        <p
          id={whyId}
          className="m-0 rounded-[12px] bg-white/8 px-[12px] py-[10px] font-sans text-[12px] leading-[18px] tracking-[0.2px] text-white/90 max-lg:text-[13px]"
        >
          {card.why}
        </p>
      ) : null}

      <div className="mt-auto flex flex-col items-center gap-[6px]">
        {link ? (
          <button
            type="button"
            onClick={() => onOpen?.({ ...card, link })}
            className="flex min-h-[35px] w-full cursor-pointer items-center justify-center gap-[6px] rounded-[10px] border-2 border-solid border-[#1c2a21]/30 bg-white px-[12px] font-sans text-[14px] font-medium leading-[24px] tracking-[0.1px] text-[#1c2a21] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f3c84b] playful:border-[#1c2a21]"
          >
            {kind.open || 'Open'}
            <OpportunityArrowRightIcon className="size-[20px] shrink-0 text-[#387440]" />
          </button>
        ) : hasDetails ? (
          <button
            type="button"
            onClick={(event) => onDetails?.(card, event.currentTarget)}
            className="flex min-h-[35px] w-full cursor-pointer items-center justify-center gap-[6px] rounded-[10px] border-2 border-solid border-[#1c2a21]/30 bg-white px-[12px] font-sans text-[14px] font-medium leading-[24px] tracking-[0.1px] text-[#1c2a21] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f3c84b] playful:border-[#1c2a21]"
          >
            View details
            <OpportunityArrowRightIcon className="size-[20px] shrink-0 text-[#387440]" />
          </button>
        ) : card.ask ? (
          <button
            type="button"
            disabled={disabled}
            onClick={() => onAsk?.(card)}
            className="flex min-h-[35px] w-full cursor-pointer items-center justify-center gap-[6px] rounded-[10px] border-2 border-solid border-[#1c2a21]/30 bg-white px-[12px] font-sans text-[14px] font-medium leading-[24px] tracking-[0.1px] text-[#1c2a21] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f3c84b] playful:border-[#1c2a21]"
          >
            Ask Career Buddy
            <OpportunityArrowRightIcon className="size-[20px] shrink-0 text-[#387440]" />
          </button>
        ) : null}
        {hasDetails && card.ask ? (
          <button
            type="button"
            disabled={disabled}
            onClick={() => onAsk?.(card)}
            className={LINK_BUTTON}
          >
            Ask Career Buddy
          </button>
        ) : null}
        {card.why ? (
          <button
            type="button"
            aria-expanded={whyOpen}
            aria-controls={whyId}
            onClick={() => {
              if (!whyOpen) onWhy?.(card);
              setWhyOpen((v) => !v);
            }}
            className={LINK_BUTTON}
          >
            {whyOpen ? 'Hide why' : 'Why this?'}
          </button>
        ) : null}
      </div>
    </article>
  );
};

const SearchResultCards = ({
  results,
  onOpen,
  onAsk,
  onDetails,
  onWhy,
  disabled = false,
  compact = false,
}) => {
  if (!results?.length) return null;
  return (
    <div
      className="mt-[16px] flex min-w-0 max-w-full flex-col gap-[10px]"
      style={
        compact ? { width: '100%' } : { width: `min(${results.length * 312 - 12}px, 660px, 78vw)` }
      }
    >
      <div
        role="group"
        aria-label="Search results"
        className="-mx-[4px] flex max-w-full gap-[12px] overflow-x-auto px-[4px] pb-[8px] [scrollbar-width:thin]"
      >
        {results.map((card) => (
          <SearchResultCard
            key={`${card.type}-${card.id}`}
            card={card}
            disabled={disabled}
            onOpen={(c) => {
              log('open', c.type, c.id);
              onOpen?.(c);
            }}
            onAsk={(c) => {
              log('ask', c.type, c.id);
              onAsk?.(c);
            }}
            onDetails={(c, opener) => {
              log('details', c.type, c.id);
              onDetails?.(c, opener);
            }}
            onWhy={onWhy}
          />
        ))}
      </div>
    </div>
  );
};

export default SearchResultCards;
