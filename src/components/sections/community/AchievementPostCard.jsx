import { classNames } from '../../../utils/classNames.js';
import CommunityIcon from './CommunityIcon.jsx';
import { icons } from './communityIcons.js';

/*
 * AchievementPostCard — the "Achievement"-badged post variant Figma shows
 * as a live PREVIEW under the milestone-share modal (7025:89895), rendered
 * in Career Buddy while a talent is composing a milestone share.
 *
 * Static/decorative by design: this mirrors what the post WOULD look like
 * once shared, so the like/comment counts below are Figma's own fixed demo
 * numbers ("1.2K" / "5.2k Comments"), not live state — the row renders as
 * plain `<div>`s rather than buttons since nothing here is actually
 * clickable yet (no post has been created).
 *
 * Reuses PostCard's existing icon set (thumbsUp/thumbsDown/share/comment/
 * postMenu) rather than downloading Figma's near-identical duplicate glyphs
 * for this variant — same convention as CommunityIcon elsewhere in this
 * folder. Only the star-badge glyph (icon-star-badge.svg) is genuinely new,
 * since no equivalent existed yet.
 */

const AchievementPostCard = ({
  authorName,
  authorInitials,
  timestamp,
  message,
  bannerText,
  className,
}) => (
  <article
    className={classNames(
      'flex w-full flex-col items-center justify-center gap-[12px] rounded-[16px] bg-white px-[20px] py-[16px] shadow-[0px_6px_8.3px_0px_rgba(63,42,120,0.12)]',
      className
    )}
  >
    <header className="flex w-full items-start justify-between">
      <div className="flex items-center gap-[12px]">
        <span
          className="flex size-[40px] shrink-0 items-center justify-center rounded-full font-sans text-[12px] font-bold text-white"
          style={{ backgroundImage: 'linear-gradient(135deg, #142916 0%, #2a5730 100%)' }}
        >
          {authorInitials}
        </span>
        <div className="flex flex-col items-start gap-[4px]">
          <div className="flex items-center gap-[6px]">
            <span className="whitespace-nowrap font-sans text-[16px] font-medium text-[#2a2a2a]">
              {authorName}
            </span>
            <span className="inline-flex items-center justify-center rounded-full border border-[#e8e8e4] bg-[#f8f8f4] px-[8px] py-[4px]">
              <span className="whitespace-nowrap font-sans text-[12px] font-medium text-[#70706e]">
                Achievement
              </span>
            </span>
          </div>
          <span className="whitespace-nowrap font-sans text-[14px] text-[#999]">{timestamp}</span>
        </div>
      </div>
      <CommunityIcon src={icons.postMenu} size={20} />
    </header>

    <p className="w-full font-sans text-[16px] leading-[1.5] text-[#595959]">{message}</p>

    <div
      className="flex w-full items-center gap-[8px] rounded-[12px] p-[16px]"
      style={{ backgroundImage: 'linear-gradient(174.9deg, #142916 0%, #2a5730 100%)' }}
    >
      <CommunityIcon src={icons.starBadge} size={18} />
      <p
        className="bg-clip-text font-sans text-[14px] leading-[1.3] text-transparent"
        style={{ backgroundImage: 'linear-gradient(181.7deg, #fef1e7 0%, #e8f2ed 20.192%)' }}
      >
        {bannerText}
      </p>
    </div>

    <div className="flex w-full flex-col items-center justify-center gap-[6px]">
      <div className="h-[1.5px] w-full bg-[#ededed]" />
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-[8px]">
          <div className="flex items-center justify-center gap-[6px] rounded-[10px] border-b-2 border-l-2 border-r-2 border-t border-neutral-active bg-neutral px-[16px] py-[10px] drop-shadow-[0px_4px_0px_#959592]">
            <CommunityIcon src={icons.thumbsUp} size={14} />
            <span className="whitespace-nowrap font-sans text-[14px] font-medium tracking-[0.1px] text-[#575755]">
              1.2K
            </span>
          </div>
          <div className="flex items-center justify-center rounded-[10px] border-b-2 border-l-2 border-r-2 border-t border-neutral-active bg-neutral px-[16px] py-[10px] drop-shadow-[0px_4px_0px_#959592]">
            <CommunityIcon src={icons.thumbsDown} size={14} />
          </div>
        </div>
        <div className="flex items-center gap-[4px] rounded-[9.66px] px-[12px] py-[6px]">
          <CommunityIcon src={icons.commentOpen} size={18} />
          <span className="whitespace-nowrap font-sans text-[14px] text-[#595959]">
            5.2k Comments
          </span>
        </div>
        <div className="flex items-center gap-[4px] rounded-[9.66px] px-[12px] py-[6px]">
          <CommunityIcon src={icons.share} size={18} />
          <span className="whitespace-nowrap font-sans text-[14px] text-[#595959]">Share</span>
        </div>
      </div>
    </div>
  </article>
);

export default AchievementPostCard;
