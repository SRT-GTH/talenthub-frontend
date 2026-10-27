import { useId, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import {
  OpportunityArrowRightIcon,
  OpportunityShieldIcon,
} from '../opportunityGuidance/opportunityIcons.jsx';

const log = debug('CareerPostCards');

const FACT_PILL =
  'inline-flex items-center rounded-full bg-white/12 px-[10px] py-[5px] font-sans text-[11px] font-medium leading-[13px] tracking-[0.2px] text-white max-lg:text-[12px]';

const TYPE_MARK = { article: 'Aa', video: '▶', qa: '?' };

/*
 * CareerPostCard - one GTH post about a career in a Career Buddy reply (2026-10-27, career exposure). Same look as the
 * opportunity match card (OpportunityMatchCard): type tile, "Article · Software Engineering Ghana", the title, pills
 * (author, career), an open button (the career-content reader) and "Why this post?", which shows the reason in place.
 * `post` is a careerPostView (careerBuddyLive.js).
 */
export const CareerPostCard = ({ post, onOpen }) => {
  const [whyOpen, setWhyOpen] = useState(false);
  // Unique per card even when the same post shows in two replies.
  const whyId = `career-post-why-${useId()}`;
  return (
    <article
      aria-label={post.title}
      className="flex w-[min(320px,72vw)] shrink-0 flex-col gap-[14px] rounded-[16px] bg-[linear-gradient(135deg,#142916,#2a5730)] p-[16px] text-white shadow-[0_5px_17px_rgba(31,69,38,0.09)] playful:border-[1.5px] playful:border-solid playful:border-[#1c2a21]/55 playful:shadow-[4px_4px_0_rgba(28,42,33,0.55)]"
    >
      <header className="flex items-start gap-[10px]">
        <span
          aria-hidden="true"
          className="flex size-[40px] shrink-0 items-center justify-center rounded-[10px] bg-white font-sans text-[15px] font-semibold text-[#1f4526]"
        >
          {TYPE_MARK[post.type] || TYPE_MARK.article}
        </span>
        <div className="flex min-w-0 flex-col gap-[4px]">
          <span className="flex items-center gap-[4px] font-sans text-[12px] leading-[14px] tracking-[0.2px]">
            <OpportunityShieldIcon className="size-[13px] shrink-0" />
            <span className="min-w-0 truncate">{post.tag}</span>
          </span>
          <h3 className="m-0 line-clamp-3 font-sans text-[15px] font-semibold leading-[19px] tracking-[0.2px] playful:font-heading">
            {post.title}
          </h3>
        </div>
      </header>

      <ul className="m-0 flex list-none flex-wrap gap-[6px] p-0">
        {post.facts.map((fact) => (
          <li key={fact} className={FACT_PILL}>
            {fact}
          </li>
        ))}
      </ul>

      {whyOpen ? (
        <p
          id={whyId}
          className="m-0 rounded-[12px] bg-white/8 px-[12px] py-[10px] font-sans text-[12px] leading-[18px] tracking-[0.2px] text-white/90 max-lg:text-[13px]"
        >
          {post.why}
        </p>
      ) : null}

      <div className="mt-auto flex flex-col items-center gap-[6px]">
        <button
          type="button"
          onClick={onOpen}
          className="flex min-h-[35px] w-full cursor-pointer items-center justify-center gap-[6px] rounded-[10px] border-2 border-solid border-[#1c2a21]/30 bg-white px-[12px] font-sans text-[14px] font-medium leading-[24px] tracking-[0.1px] text-[#1c2a21] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f3c84b] playful:border-[#1c2a21]"
        >
          {post.openLabel}
          <OpportunityArrowRightIcon className="size-[20px] shrink-0 text-[#387440]" />
        </button>
        <button
          type="button"
          aria-expanded={whyOpen}
          aria-controls={whyId}
          onClick={() => setWhyOpen((v) => !v)}
          className="min-h-[24px] cursor-pointer border-0 bg-transparent p-0 font-sans text-[12px] font-normal leading-[18px] tracking-[0.2px] text-[#f3c84b] underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f3c84b]"
        >
          {whyOpen ? 'Hide why' : 'Why this post?'}
        </button>
      </div>
    </article>
  );
};

/*
 * CareerPostCards - "What people on GTH are saying about {career}" and a scrolling row of post cards, under a Career
 * Buddy reply. Props: posts (careerPostView[]), career (heading), onOpen(post) (defaults to the reader page),
 * compact (the narrow Ask Buddy panel on /home: the row takes the panel's width).
 */
const CareerPostCards = ({ posts, career, onOpen, compact = false }) => {
  const navigate = useNavigate();
  if (!posts?.length) return null;
  return (
    <div
      className="mt-[16px] flex min-w-0 max-w-full flex-col gap-[10px]"
      style={
        compact ? { width: '100%' } : { width: `min(${posts.length * 332 - 12}px, 660px, 78vw)` }
      }
    >
      <p className="m-0 font-sans text-[14px] font-semibold leading-[20px]">
        {career ? `What people on GTH are saying about ${career}` : 'What people on GTH are saying'}
      </p>
      <div
        role="group"
        aria-label={career ? `Posts about ${career}` : 'Posts'}
        className="-mx-[4px] flex max-w-full gap-[12px] overflow-x-auto px-[4px] pb-[8px] [scrollbar-width:thin]"
      >
        {posts.map((post) => (
          <CareerPostCard
            key={post.id}
            post={post}
            onOpen={() => {
              log('open', post.id);
              if (onOpen) onOpen(post);
              else navigate(post.detailPath);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default CareerPostCards;
