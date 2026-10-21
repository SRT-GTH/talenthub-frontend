import { useNavigate } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { ArrowLeftIcon } from '../../shared/assets.jsx';
import { ENGAGEMENT_STAGES, JOURNEY_MAP_ROUTE } from './engagementShellData.js';

const log = debug('EngagementStageBar');

const SEGMENT_FILL = { done: 'bg-[#387440]', current: 'bg-[#c8951a]', todo: 'bg-[#e7e7e7]' };

/*
 * EngagementStageBar — the 64px bar under the nav on every stage screen (Figma "Stage bar", e.g. IN-01 Focused 8285:9915 /
 * Playful 7706:68): left "← Journey map" link (#387440, 14/600), centred chip "STAGE n OF 9" (#ebf1ec, 11/600 #387440,
 * 1px ink@.10 border — ink@.35 in Playful) + the stage name (15/600), right "<done> of 9 done · <pct>%" (13/500 #595959)
 * + 9 segments (18x6, gap 4, r3: done #387440, in progress #c8951a, todo #e7e7e7) + "Auto-saved" (12/500).
 * Props: stageNumber, stageName, segments (array of 9 'done'|'current'|'todo'), doneCount, autoSaved, className.
 * Phones (< md): the progress text and "Auto-saved" fold away, keeping link · chip + name · segments.
 */
const EngagementStageBar = ({
  stageNumber,
  stageName,
  segments,
  doneCount = 0,
  autoSaved = true,
  backLabel = 'Journey map',
  backTo = JOURNEY_MAP_ROUTE,
  className,
}) => {
  const navigate = useNavigate();
  const total = ENGAGEMENT_STAGES.length;
  const pct = Math.round((doneCount / total) * 100);
  const segs = segments ?? ENGAGEMENT_STAGES.map((s) => (s.n <= doneCount ? 'done' : 'todo'));
  log('render', { stageNumber, stageName, doneCount, pct });

  return (
    <div
      className={classNames(
        'grid w-full grid-cols-[1fr_auto_1fr] items-center gap-3 border-b border-[#e7e7e7] bg-white',
        'min-h-[64px] px-4 py-2 md:px-[clamp(20px,3.7vw,64px)]',
        className
      )}
    >
      <button
        type="button"
        onClick={() => {
          log('back to map');
          navigate(backTo);
        }}
        className="inline-flex min-h-[24px] w-fit cursor-pointer items-center gap-[8px] border-0 bg-transparent p-0 font-sans text-[14px] font-semibold leading-[17px] text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
      >
        <ArrowLeftIcon className="size-[16px]" />
        {backLabel}
      </button>

      <div className="flex items-center justify-center gap-[10px]">
        <span className="inline-flex items-center rounded-full border border-solid border-[rgba(28,42,33,0.1)] bg-[#ebf1ec] px-[10px] py-[4px] font-sans text-[11px] font-semibold leading-[13px] text-[#387440] playful:border-[rgba(28,42,33,0.35)] max-lg:text-[12px]">
          STAGE {stageNumber} OF {total}
        </span>
        <span className="font-sans text-[15px] font-semibold leading-[18px] text-[#1c2a21]">
          {stageName}
        </span>
      </div>

      <div className="flex items-center justify-end gap-[12px]">
        <span className="font-sans text-[13px] font-medium leading-[16px] text-[#595959] max-md:hidden">
          {doneCount} of {total} done · {pct}%
        </span>
        <span
          className="flex gap-[4px]"
          role="img"
          aria-label={`${doneCount} of ${total} stages done`}
        >
          {segs.map((state, i) => (
            <span
              key={i}
              className={classNames(
                'h-[6px] w-[18px] rounded-[3px] max-md:w-[10px]',
                SEGMENT_FILL[state] ?? SEGMENT_FILL.todo
              )}
            />
          ))}
        </span>
        {autoSaved ? (
          <span className="font-sans text-[12px] font-medium leading-[14px] text-[#595959] max-lg:hidden">
            Auto-saved
          </span>
        ) : null}
      </div>
    </div>
  );
};

export default EngagementStageBar;
