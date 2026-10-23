import { classNames } from '../../../../utils/classNames.js';
import { COMMUNITY_PAGE_COPY } from '../communityData.js';
import { CmHelpIcon, CmStarIcon, CmUsersIcon } from '../CommunityPageIcons.jsx';
import { PageButton } from '../CommunityPageParts.jsx';
import { FOCUS_RING, HEADING } from '../communityPageStyles.js';

const IDEA_ICONS = { help: CmHelpIcon, star: CmStarIcon, users: CmUsersIcon };

/*
 * OwnerEmptyFeed — the dashed `empty feed` card of the owner page (Figma CC-06 … CC-17b): the same card as the Community empty feed,
 * but with the title / body / button of each owner state ("Posting opens when it’s live", "This community is archived", …).
 * Props: title, body, cta (null hides the button), ideas (false hides the three idea chips), onCta().
 */
const OwnerEmptyFeed = ({ title, body, cta, ideas = true, onCta }) => {
  const copy = COMMUNITY_PAGE_COPY.empty;
  return (
    <section className="relative flex flex-col items-center gap-[14px] rounded-[20px] bg-white px-[32px] py-[40px] text-center max-sm:px-[16px] max-sm:py-[28px]">
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 size-full overflow-visible"
      >
        <rect
          x="0.75"
          y="0.75"
          rx="19.25"
          fill="none"
          stroke="#bfbfbf"
          strokeWidth="1.5"
          strokeDasharray="6 5"
          style={{ width: 'calc(100% - 1.5px)', height: 'calc(100% - 1.5px)' }}
        />
      </svg>
      <img src={copy.art} alt="" className="size-[104px]" />
      <h2
        className={classNames(
          HEADING,
          'text-[23px] leading-[28.75px] max-sm:text-[20px] max-sm:leading-[26px]'
        )}
      >
        {title}
      </h2>
      <p className="m-0 max-w-[440px] font-sans text-[14px] leading-[21px] text-[#595959]">
        {body}
      </p>
      {ideas ? (
        <div className="flex flex-wrap items-center justify-center gap-[8px]">
          {copy.ideas.map((idea) => {
            const Glyph = IDEA_ICONS[idea.icon];
            return (
              <button
                key={idea.id}
                type="button"
                onClick={() => onCta?.(idea.id)}
                className={classNames(
                  'inline-flex h-[32px] cursor-pointer items-center gap-[6px] rounded-full border-0 bg-[#ebf1ec] py-[8px] pl-[10px] pr-[12px] font-sans text-[13px] font-semibold leading-[16px] text-[#2d5d33]',
                  FOCUS_RING
                )}
              >
                <Glyph className="size-[14px] shrink-0 text-[#2d5d33]" />
                {idea.label}
              </button>
            );
          })}
        </div>
      ) : null}
      {cta ? (
        <PageButton className="mt-[2px]" onClick={() => onCta?.('cta')}>
          {cta}
        </PageButton>
      ) : null}
    </section>
  );
};

export default OwnerEmptyFeed;
