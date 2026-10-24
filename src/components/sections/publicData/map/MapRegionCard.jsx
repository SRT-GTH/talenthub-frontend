import { useEffect, useRef } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { formatChange, formatCount, isSuppressed, safeShare } from '../publicDataFormat.js';
import Button from '../../../ui/Button.jsx';

/*
 * MapRegionCard — the two cards of the Ghana map (Figma "T8 · Map hover card" 8485:60 / 8489:346227 and the expanded card 8489:346296).
 *   hover  : 240 wide, p 14/16, gap 14, white, 1px #e7e7e7, r14, shadow 0 8 24 rgba(0,0,0,.12):
 *            name 16/19 600 · "38,540 talents" 14/17 500 · "▲ +8% last 30 days" 13/16 600 #387440
 *   pinned : 315 wide, gap 15: name · "42,310 talents · ranked #1" · trend · EDUCATION caps (11/13 600 +0.66 #595959) + 10px stack bar
 *            (#224626 / #6ca271 / #c1d4c4, r4, gap 2) + "Pre-tertiary 46% · In-tertiary 32% · Post 22%" (12/14 #595959) ·
 *            TOP INTERESTS caps + "1  Technology   ·   2  Business   ·   3  Health" (13/16 500) · button "View Greater Accra details →"
 *   low-data (count under 5, 8.2.2d): "<5 talents" and "Not enough data yet" (600 #595959); the pinned card then omits education / interests
 *            and keeps the button (it opens the region page in its low-data state).
 * Props
 *   region   { id, name, count, trendPct, rank, education: {pre,in,post}|null, topInterests: string[] }
 *   variant  'hover' | 'pinned'
 *   onOpen   fn(id)      the "View … details →" button of the pinned card
 *   focusAction boolean  pinned: move focus to the button on mount (keyboard pin)
 *   onEscape fn()        Esc pressed inside the pinned card
 *   id       string      DOM id (aria-describedby / aria-controls target)
 *   style / className    positioning is done by the owner (GhanaMap)
 * Privacy: counts via formatCount(), shares via safeShare(); education shares are only drawn when every bucket passes the rule.
 */

const SEGMENTS = [
  { key: 'pre', label: 'Pre-tertiary', short: 'Pre-tertiary', fill: '#224626' },
  { key: 'in', label: 'In-tertiary', short: 'In-tertiary', fill: '#6ca271' },
  { key: 'post', label: 'Post-tertiary', short: 'Post', fill: '#c1d4c4' },
];

const MapRegionCard = ({
  region,
  variant = 'hover',
  onOpen,
  focusAction = false,
  onEscape,
  id,
  style,
  className,
  cardRef,
}) => {
  const actionRef = useRef(null);
  const suppressed =
    isSuppressed(region.count) || region.count === null || region.count === undefined;
  const pinned = variant === 'pinned';

  useEffect(() => {
    if (pinned && focusAction) actionRef.current?.focus();
  }, [pinned, focusAction]);

  const countText = suppressed
    ? '<5 talents'
    : `${formatCount(region.count)} talents${pinned && region.rank ? ` · ranked #${region.rank}` : ''}`;
  const trendOk = !suppressed && typeof region.trendPct === 'number';
  const trendText = trendOk
    ? `${formatChange(region.trendPct)} last 30 days`
    : 'Not enough data yet';

  const edu = region.education;
  const eduTotal = edu ? edu.pre + edu.in + edu.post : 0;
  const eduShares = edu ? SEGMENTS.map((s) => safeShare(edu[s.key], eduTotal)) : [];
  const showEdu = pinned && !suppressed && edu && eduShares.every((v) => v !== null);
  const showInterests = pinned && !suppressed && region.topInterests?.length > 0;

  return (
    <div
      id={id}
      ref={cardRef}
      role={pinned ? 'dialog' : 'tooltip'}
      aria-label={pinned ? `${region.name} details` : undefined}
      onKeyDown={(e) => {
        if (pinned && e.key === 'Escape') {
          e.stopPropagation();
          onEscape?.();
        }
      }}
      style={style}
      className={classNames(
        'z-20 flex flex-col rounded-[14px] border border-solid border-[#e7e7e7] bg-white px-[16px] py-[14px] font-sans shadow-[0_8px_24px_rgba(0,0,0,0.12)]',
        pinned
          ? 'w-[315px] max-w-[calc(100vw-16px)] gap-[15px]'
          : 'pointer-events-none w-[240px] gap-[14px]',
        className
      )}
    >
      <p className="m-0 text-[16px] leading-[19px] font-semibold text-[#1c2a21]">{region.name}</p>
      <p className="m-0 text-[14px] leading-[17px] font-medium text-[#1c2a21]">{countText}</p>
      <p
        className={classNames(
          'm-0 text-[13px] leading-[16px] font-semibold',
          trendOk ? 'text-[#387440]' : 'text-[#595959]'
        )}
      >
        {trendText}
      </p>
      {showEdu && (
        <div className="mt-[1px] flex flex-col gap-[15px] pt-[0px]">
          <p className="m-0 text-[length:var(--fs-11)] leading-[13px] font-semibold tracking-[0.66px] text-[#595959] uppercase">
            Education
          </p>
          <div
            aria-hidden="true"
            className="flex h-[10px] w-full gap-[2px] overflow-hidden rounded-[4px]"
          >
            {SEGMENTS.map((s) => (
              <span key={s.key} style={{ flex: `${edu[s.key]} 1 0`, background: s.fill }} />
            ))}
          </div>
          <p className="m-0 text-[12px] leading-[14px] text-[#595959]">
            {SEGMENTS.map((s, i) => `${s.short} ${eduShares[i]}%`).join(' · ')}
          </p>
        </div>
      )}
      {showInterests && (
        <div className="flex flex-col gap-[15px]">
          <p className="m-0 text-[length:var(--fs-11)] leading-[13px] font-semibold tracking-[0.66px] text-[#595959] uppercase">
            Top interests
          </p>
          <p className="m-0 text-[13px] leading-[16px] font-medium whitespace-pre-wrap text-[#1c2a21]">
            {region.topInterests
              .slice(0, 3)
              .map((t, i) => `${i + 1}  ${t}`)
              .join('   ·   ')}
          </p>
        </div>
      )}
      {pinned && (
        <Button
          ref={actionRef}
          type="button"
          variant="tertiary-subtle"
          size="xs"
          onClick={() => onOpen?.(region.id)}
          className="!w-fit !rounded-[14px] !px-[14px] !py-[8px] !text-[13px] !leading-[20px]"
        >
          {`View ${region.name} details →`}
        </Button>
      )}
    </div>
  );
};

export default MapRegionCard;
