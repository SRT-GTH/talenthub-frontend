import { useNavigate } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import CommunityIcon from './CommunityIcon.jsx';
import { icons } from './communityIcons.js';
import {
  RELATED_COMMUNITIES,
  RELATED_COMMUNITY_CATEGORY,
  TRENDING_TOPIC_ACTIVE,
  TRENDING_TOPIC_ROWS,
} from './communityData.js';

const log = debug('CommunityRightRail');

/*
 * CommunityRightRail — "Trending Topics" + "Related Communities" cards.
 * Source: Figma 7025:86543 (7025:86544 trending, 7025:86565 related).
 *
 * Trending topics keep Figma's exact six-row grouping and per-row gaps so the
 * wrap matches; the first tag (#ReactGh) is brand-green, the rest #737373.
 *
 * Figma annotation on 7025:86565 (Related Communities):
 *   "Related communitites are shown based on the common category the
 *    communities are in. In this case is 'Software engineering'"
 * → surfaced as the card's `title` so the rule is visible in the product,
 *   and recorded as RELATED_COMMUNITY_CATEGORY in communityData.js.
 *   (Figma's "communitites" typo is left alone in the data comment.)
 */

const ROW_GAPS = ['9.64px', '14.47px', '21.7px', '25.31px', '19.29px', '0px'];

const RailCard = ({ children, className, title }) => (
  <div
    title={title}
    className={classNames(
      'w-full overflow-hidden rounded-[24.108px] bg-white p-[28px] shadow-[0px_2px_1px_0px_rgba(141,138,138,0.17)]',
      className
    )}
  >
    {children}
  </div>
);

const CommunityRightRail = ({ className }) => {
  const navigate = useNavigate();

  return (
    <div className={classNames('flex w-full flex-col items-start gap-[18px]', className)}>
      <RailCard>
        <div className="flex w-full flex-col items-start gap-[16px]">
          <h2 className="whitespace-nowrap font-sans text-[18px] font-medium text-black">
            Trending Topics
          </h2>
          <div className="flex flex-col items-start gap-[8.44px]">
            {TRENDING_TOPIC_ROWS.map((row, rowIndex) => (
              <div
                key={row.join('-')}
                className="flex flex-wrap items-center"
                style={{ columnGap: ROW_GAPS[rowIndex] ?? '14.47px', rowGap: '8.44px' }}
              >
                {row.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => log('trending topic clicked (no search route wired yet):', tag)}
                    className={classNames(
                      'whitespace-nowrap rounded font-sans text-[16px] transition-opacity hover:opacity-75',
                      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
                      tag === TRENDING_TOPIC_ACTIVE ? 'text-brand-green' : 'text-[#737373]'
                    )}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </RailCard>

      <RailCard
        className="flex-1"
        title={`Related communities are shown based on the common category the communities are in. In this case is '${RELATED_COMMUNITY_CATEGORY}'`}
      >
        <div className="flex h-full w-full flex-col items-start gap-[16px]">
          <h2 className="w-full font-sans text-[18px] font-medium text-[#0a0a0a]">
            Related Communities
          </h2>
          {/* Row buttons are plain `w-full` — no negative-margin bleed. Same
              fix as CommunityLeftRail.jsx: `-mx-[12px] w-[calc(100%+24px)]`
              made each row 24px wider than this `<ul>`'s own box, and since
              the `<ul>` only declares `overflow-y-auto`, the CSS
              visible/auto interaction rule forces its `overflow-x` to
              `auto` too — so that overhang gave the list a real, permanent
              horizontal scrollbar. Plain `w-full` + `px-[12px]` gives the
              content genuine padding from the row's own edges instead. */}
          <ul className="flex w-full flex-1 flex-col items-start gap-[7.23px] overflow-y-auto">
            {RELATED_COMMUNITIES.map((item, index) => (
              <li key={item.id} className="contents">
                {index > 0 && <div className="h-[1.205px] w-full bg-[#f2f2f2]" />}
                <button
                  type="button"
                  onClick={() => {
                    log('related community clicked:', item.id);
                    navigate(`/community/${item.id}`);
                  }}
                  className="flex w-full items-center justify-between rounded-[8px] px-[12px] py-[12.05px] text-left transition-colors hover:bg-neutral focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-green"
                >
                  <span className="flex min-w-0 items-center gap-[16.88px]">
                    <img
                      src={item.image}
                      alt=""
                      draggable="false"
                      className="size-[53.04px] shrink-0 select-none rounded-[12.05px] object-cover"
                    />
                    <span className="flex min-w-0 flex-col items-start gap-[6px]">
                      <span className="w-full truncate font-sans text-[16px] font-medium text-black">
                        {item.name}
                      </span>
                      <span className="w-full truncate font-sans text-[15px] text-[#737373]">
                        {item.meta}
                      </span>
                    </span>
                  </span>
                  <CommunityIcon src={icons.chevronRight} size={21.7} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </RailCard>
    </div>
  );
};

export default CommunityRightRail;
