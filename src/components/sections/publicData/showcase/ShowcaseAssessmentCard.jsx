import PublicCard from '../ui/PublicCard.jsx';
import { PublicIconCheckSmall } from './showcaseIcons.jsx';

/*
 * ShowcaseAssessmentCard — Figma "Assessment results" 8497:1874 (376x327), phone card 8508:166 (358x186).
 * Header "Assessment results" · aside "Summary" (phone: no aside). Desktop body px24 pb24 gap 14:
 *   personality panel (#ebf1ec r14 p 14/16: "Personality type" 12/14 600 caps +0.72 #2a5730, type 20/24 600 #2a5730, blurb 14/20 #2a5730);
 *   "Skills Lab games passed · 3" 12/14 600 caps +0.72 #595959; game chips (#f2f2ee r10 p 7/12, check 16, 13/16 600), wrapping, gap 8.
 * Phone: type 18/21 600 #2a5730, blurb 13/19 #595959, one line "Skills Lab games passed · Formula Rush · Speed Sort · Group Chat Drama" 13/19 500.
 * Props: profile
 */

const ShowcaseAssessmentCard = ({ profile, className }) => (
  <PublicCard
    id="showcase-assessment"
    title="Assessment results"
    hint="Summary"
    bodyClassName="flex flex-col gap-[12px] px-[16px] pb-[16px] md:gap-[14px] md:px-[24px] md:pb-[24px]"
    className={className}
  >
    <div className="flex flex-col gap-[4px] md:rounded-[14px] md:bg-[#ebf1ec] md:px-[16px] md:py-[14px]">
      <p className="m-0 hidden text-[12px] leading-[14px] font-semibold tracking-[0.72px] text-[#2a5730] uppercase md:block">
        Personality type
      </p>
      <p className="m-0 text-[18px] leading-[21px] font-semibold text-[#2a5730] md:text-[20px] md:leading-[24px]">
        {profile.personality.type}
      </p>
      <p className="m-0 text-[13px] leading-[19px] text-[#595959] md:text-[14px] md:leading-[20px] md:text-[#2a5730]">
        {profile.personality.blurb}
      </p>
    </div>
    <p className="m-0 text-[13px] leading-[19px] font-medium text-[#1c2a21] md:hidden">
      Skills Lab games passed · {profile.games.join(' · ')}
    </p>
    <p className="m-0 hidden text-[12px] leading-[14px] font-semibold tracking-[0.72px] text-[#595959] uppercase md:block">
      Skills Lab games passed · {profile.games.length}
    </p>
    <ul
      aria-label="Skills Lab games passed"
      className="m-0 hidden list-none flex-wrap gap-[8px] p-0 md:flex"
    >
      {profile.games.map((game) => (
        <li
          key={game}
          className="inline-flex items-center gap-[6px] rounded-[10px] bg-[#f2f2ee] px-[12px] py-[7px] text-[13px] leading-[16px] font-semibold text-[#1c2a21]"
        >
          <PublicIconCheckSmall className="size-[16px] shrink-0 text-[#387440]" />
          {game}
        </li>
      ))}
    </ul>
  </PublicCard>
);

export default ShowcaseAssessmentCard;
