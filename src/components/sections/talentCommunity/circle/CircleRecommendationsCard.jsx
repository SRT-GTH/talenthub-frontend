import { classNames } from '../../../../utils/classNames.js';
import { CIRCLE_COPY as COPY, CIRCLE_PEOPLE } from './circleData.js';
import CircleAvatar from './CircleAvatar.jsx';
import CircleButton from './CircleButton.jsx';
import CircleMentorChip from './CircleMentorChip.jsx';
import { CARD, HEADING } from './circleStyles.js';

/*
 * CircleRecommendationsCard — Figma `Recommendations` (NW-06 / 06b): "Recommendations" 20/24 + the "Write a recommendation" button,
 * then each recommendation (44px avatar, name + Verified mentor, "Mentored Yaw in Data Science Ghana · Sep 2026", the quote).
 * Props: recommendations ([{ author, meta, text }]), sent (text of the recommendation the talent just wrote, or null),
 * onWrite(). ⚠️ ASSUMPTION: a recommendation the talent sends shows here as "Sent to … for approval" (they approve it first).
 * Live: `recommendations` are server cards ({ id, author: { id, name, photo }, relationshipLine, text }); onWrite is left out when
 * the talent can't write one (not connected, or already wrote one), and onEdit / onRemove act on the talent's own (`sent`).
 */
const CircleRecommendationsCard = ({ recommendations, sent, onWrite, onEdit, onRemove, empty }) => (
  <section
    className={classNames(CARD, 'flex flex-col gap-[14px] px-[22px] py-[20px] max-sm:px-[16px]')}
  >
    <div className="flex flex-wrap items-center justify-between gap-[12px]">
      <h2 className={classNames(HEADING, 'text-[20px] leading-[24px]')}>{COPY.recommendations}</h2>
      {onWrite && (
        <CircleButton tone="soft" onClick={onWrite}>
          {COPY.writeRecommendation}
        </CircleButton>
      )}
    </div>
    {recommendations.length === 0 && !sent && empty && (
      <p className="m-0 font-sans text-[14px] leading-[20px] text-[#737373]">{empty}</p>
    )}
    {recommendations.map((rec) => {
      const live = typeof rec.author === 'object';
      const author = live ? rec.author : CIRCLE_PEOPLE[rec.author];
      return (
        <article key={rec.id ?? rec.author} className="flex gap-[12px]">
          <CircleAvatar
            id={live ? (author.id ?? `anon-${rec.id}`) : rec.author}
            size={44}
            photo={live ? author.photo : undefined}
            name={live ? author.name : undefined}
          />
          <div className="flex min-w-0 flex-1 flex-col gap-[4px]">
            <div className="flex flex-wrap items-center gap-[6px]">
              <span className="font-sans text-[14px] font-semibold leading-[17px] text-[#1c2a21]">
                {author.name}
              </span>
              {author.verifiedMentor && <CircleMentorChip />}
            </div>
            <span className="font-sans text-[12px] leading-[14px] text-[#737373] max-lg:text-[13px]">
              {rec.meta ?? rec.relationshipLine}
            </span>
            <p className="m-0 font-sans text-[14px] leading-[21px] text-[#1c2a21] max-lg:text-[15px]">
              {rec.text}
            </p>
          </div>
        </article>
      );
    })}
    {sent && (
      <div
        role="status"
        className="flex flex-col gap-[8px] rounded-[12px] bg-[#faf4e8] px-[12px] py-[10px] font-sans text-[12px] leading-[17px] text-[#785910] max-lg:text-[13px]"
      >
        <p className="m-0">{sent}</p>
        {(onEdit || onRemove) && (
          <div className="flex flex-wrap gap-[8px]">
            {onEdit && (
              <CircleButton tone="soft" onClick={onEdit}>
                Edit
              </CircleButton>
            )}
            {onRemove && (
              <CircleButton tone="soft" onClick={onRemove}>
                Remove
              </CircleButton>
            )}
          </div>
        )}
      </div>
    )}
  </section>
);

export default CircleRecommendationsCard;
