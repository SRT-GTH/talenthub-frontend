import { ProfileCard, ProjectCoverArt, Tag } from '../../talentProfile/ProfileTabsUi.jsx';
import { coverBg } from '../../talentProfile/profileTabsStyles.js';

/*
 * ProgressPortfolioCard — "card · Portfolio" (Figma 8595:878, 880x293): three project tiles (cover art drawn in code like the talent profile: bars · line ·
 * dots, a white tag chip, title 15/600 and meta 12 #737373). Read-only. Props: items[].
 * ⚠️ ASSUMPTION: "See all 3 →" has no target drawn; it is inert.
 */

const ProgressPortfolioCard = ({ items }) => (
  <ProfileCard title="Portfolio" link="See all 3 →" onLink={() => {}}>
    <ul className="m-0 grid list-none grid-cols-1 gap-[16px] p-0 @lg:grid-cols-2 @3xl:grid-cols-3">
      {items.map((item) => (
        <li key={item.key} className="flex min-w-0 flex-col items-start gap-[8px]">
          <div
            className="relative w-full overflow-hidden rounded-[14px] border border-solid border-[rgba(28,42,33,0.1)]"
            style={{ background: coverBg(item.cover) }}
          >
            <ProjectCoverArt kind={item.cover} />
            <Tag tone="white" className="absolute top-[11px] left-[11px]">
              {item.tag}
            </Tag>
          </div>
          <p className="m-0 font-sans text-[15px] leading-[normal] font-semibold text-[#1c2a21]">
            {item.title}
          </p>
          <p className="m-0 font-sans text-[12px] leading-[normal] text-[#737373]">{item.meta}</p>
        </li>
      ))}
    </ul>
  </ProfileCard>
);

export default ProgressPortfolioCard;
