import { classNames } from '../../../../utils/classNames.js';
import Button from '../../../ui/Button.jsx';
import { formatCount } from '../agencyFormat.js';
import { audienceBlocked, audienceNote } from '../data/programmesData.js';
import { ProgrammesIconStar } from './programmesIcons.jsx';

/*
 * AudiencePreviewCard — "Audience preview" (Figma "Background+Border" 8597:393935: 435 wide, #f3f8f4, 1px rgba(0,82,43,.1), r14, p16, gap 18):
 *   title 18/500 centred · "In your pool 42,610" + a 7px track · dot + "talents match 9,870" (#387440) · rule · "Ready now: 81% of matches" +
 *   five stars (#eab308, the unused #d6d1c2) + "81%" · the sentence (#999999) · "Save and continue" (green) + "Save as Template" (white, 2px).
 * Privacy: every count goes through formatCount(). ⚠️ Figma draws the real numbers "4" and "2 of 4" under 5 (frame 11.5.2h); the card prints "<5" instead,
 * and "Save and continue" is disabled while fewer than 5 talents match ("Groups under 5 can’t be targeted").
 * Props: audience (computeAudience), onContinue(), onTemplate().
 */

const POOL_REF = 356000;

const AudiencePreviewCard = ({ audience, onContinue, onTemplate }) => {
  const blocked = audienceBlocked(audience);
  const ready = blocked
    ? `Ready now: ${formatCount(audience.readyNow)} of ${formatCount(audience.match)}`
    : `Ready now: ${audience.readyPct}% of matches`;
  return (
    <section
      aria-labelledby="audience-title"
      className="flex min-w-0 flex-col gap-[18px] rounded-[14px] border border-solid border-[#00522b]/10 bg-[#f3f8f4] p-[16px] font-sans"
    >
      <h2
        id="audience-title"
        className="m-0 text-center text-[18px] leading-[24px] font-medium tracking-[0.2px] text-[#1c2a21]"
      >
        Audience preview
      </h2>
      <div role="status" aria-live="polite" className="flex flex-col gap-[16px]">
        <div className="flex items-center justify-between text-[16px] leading-[24px] tracking-[0.2px]">
          <span className="text-[#595959]">In your pool</span>
          <span className="text-[#1c2a21]">{formatCount(audience.pool)}</span>
        </div>
        <div aria-hidden="true" className="h-[7px] overflow-hidden rounded-full bg-[#e6e6e6]">
          <div
            className="h-full bg-[#387440]"
            style={{ width: `${Math.max(1, Math.min(100, (audience.pool / POOL_REF) * 100))}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[16px] leading-[24px] tracking-[0.2px]">
          <span className="flex items-center gap-[8px] text-[#595959]">
            <span aria-hidden="true" className="size-[12px] rounded-full bg-[#387440]" />
            talents match
          </span>
          <span className="text-[#387440]">{formatCount(audience.match)}</span>
        </div>
      </div>
      <div className="flex flex-col gap-[12px] border-0 border-t border-solid border-[#e6e2d6] pt-[23px]">
        <p className="m-0 text-center text-[16px] leading-[24px] tracking-[0.2px] text-[#1c2a21]">
          {ready}
        </p>
        <div
          role="img"
          aria-label={`${audience.stars} of 5 stars`}
          className="flex items-center justify-center gap-[4px]"
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <ProgrammesIconStar
              key={i}
              className={classNames(
                'h-[19px] w-[20px]',
                i < audience.stars ? 'text-[#eab308]' : 'text-[#d6d1c2]'
              )}
            />
          ))}
          <span className="ml-[8px] text-[16px] leading-[24px] tracking-[0.2px] text-[#1c2a21]">
            {blocked ? formatCount(audience.readyNow) : `${audience.readyPct}%`}
          </span>
        </div>
        <p className="m-0 pt-[4px] text-center text-[16px] leading-[24px] tracking-[0.2px] text-[#999999]">
          {audienceNote(audience, formatCount)}
        </p>
      </div>
      <div className="flex flex-col gap-[12px] pt-[16px]">
        <Button
          type="button"
          variant="primary"
          size="sm"
          disabled={blocked}
          onClick={onContinue}
          className="!w-full !py-[8.5px] !text-[14px] !font-semibold"
        >
          Save and continue
        </Button>
        <Button
          type="button"
          variant="tertiary"
          size="sm"
          onClick={onTemplate}
          className="!w-full !rounded-[14px] !py-[8.5px] !text-[14px] !font-semibold"
        >
          Save as Template
        </Button>
      </div>
    </section>
  );
};

export default AudiencePreviewCard;
