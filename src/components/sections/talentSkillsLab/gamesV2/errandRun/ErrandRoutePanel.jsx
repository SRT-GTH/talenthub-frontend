import { classNames } from '../../../../../utils/classNames.js';
import { debug } from '../../../../../utils/debug.js';
import { FOCUS_RING } from '../../labPlayStyles.js';
import GameV2FeedbackChip from '../planningShared/GameV2FeedbackChip.jsx';
import { GameUndoIcon } from '../planningShared/PlanningChessIcons.jsx';

/*
 * ErrandRoutePanel — the Figma "route panel" (380 wide, white, r24 / Focused r18, padding 20, gap 14):
 *   YOUR ROUTE label · one row per stop slot (filled: #f2f5f4 + green number + "+3 blocks"; next: "Tap the next stop on the map";
 *   later: "—") · total row (14 / 27 px) · optional "Shortest route" gold row · feedback chip · "Undo last stop" tool.
 * Props: slots (stop count), legs [{ stop, cost }], totalLabel, total, totalTone ('amber'|'red'|'green'), best (number | null),
 *        feedback { tone, text } | null, onUndo (omit once the map is done).
 */
const TOTAL_TONES = { amber: 'bg-[#fef8ec]', red: 'bg-[#fcebe8]', green: 'bg-[#e2f1e4]' };
const TOTAL_NUMBER =
  'font-sans text-[22px] leading-[26px] font-semibold text-[#1c2a21] playful:font-heading playful:text-[24px] playful:leading-[29px]';

const Leg = ({ index, leg, next }) => {
  if (leg) {
    return (
      <li className="flex min-h-[46px] items-center gap-[12px] rounded-[12px] bg-[#f2f5f4] py-[10px] pr-[12px] pl-[10px]">
        <span className="inline-flex size-[26px] shrink-0 items-center justify-center rounded-full bg-[#387440] font-sans text-[12px] leading-[14px] font-bold text-white">
          {index + 1}
        </span>
        <span className="min-w-0 flex-1 font-sans text-[14px] leading-[17px] font-semibold text-[#1c2a21]">
          {leg.stop.name}
        </span>
        <span className="font-sans text-[13px] leading-[16px] font-bold whitespace-nowrap text-[#27522e]">
          +{leg.cost} {leg.cost === 1 ? 'block' : 'blocks'}
        </span>
      </li>
    );
  }
  return (
    <li className="flex min-h-[48px] items-center gap-[12px] rounded-[12px] border border-solid border-[#dee5e0] bg-white py-[10px] pr-[12px] pl-[10px]">
      <span className="inline-flex size-[26px] shrink-0 items-center justify-center rounded-full bg-[#f2f5f4] font-sans text-[12px] leading-[14px] font-bold text-[#6b6b6b]">
        {index + 1}
      </span>
      <span className="min-w-0 flex-1 font-sans text-[14px] leading-[17px] font-semibold text-[#6b6b6b]">
        {next ? 'Tap the next stop on the map' : '—'}
      </span>
    </li>
  );
};

const log = debug('ErrandRoutePanel');

const ErrandRoutePanel = ({
  slots,
  legs,
  totalLabel,
  total,
  totalTone,
  best,
  feedback,
  onUndo,
}) => {
  log('render', { slots, legs: legs.length, total, totalTone, best });
  return (
    <section
      aria-label="Your route"
      className={classNames(
        'flex w-full max-w-[380px] flex-col gap-[14px] rounded-[18px] border border-solid border-[#dee5e0] bg-white p-[20px]',
        'playful:rounded-[24px] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[0_4px_0_rgba(28,42,33,0.45)]'
      )}
    >
      <h2 className="m-0 font-sans text-[12px] leading-[14px] font-bold tracking-[0.72px] text-[#6b706e]">
        YOUR ROUTE
      </h2>
      <ol className="m-0 flex list-none flex-col gap-[8px] p-0">
        {Array.from({ length: slots }, (_, i) => (
          <Leg key={i} index={i} leg={legs[i]} next={i === legs.length} />
        ))}
      </ol>
      <div
        className={classNames(
          'flex min-h-[54px] items-center justify-between gap-[8px] rounded-[14px] p-[14px] playful:min-h-[57px]',
          TOTAL_TONES[totalTone]
        )}
      >
        <span className="font-sans text-[14px] leading-[17px] font-semibold text-[#1c2a21]">
          {totalLabel}
        </span>
        <span className={TOTAL_NUMBER}>{total}</span>
      </div>
      {best !== null ? (
        <div className="flex min-h-[54px] items-center justify-between gap-[8px] rounded-[14px] bg-[#fef8ec] p-[14px] playful:min-h-[57px]">
          <span className="flex items-center gap-[10px]">
            <span aria-hidden="true" className="h-[5px] w-[22px] rounded-[3px] bg-[#e0a526]" />
            <span className="font-sans text-[14px] leading-[17px] font-semibold text-[#8a6100]">
              Shortest route
            </span>
          </span>
          <span className={classNames(TOTAL_NUMBER, '!text-[#8a6100]')}>{best}</span>
        </div>
      ) : null}
      {feedback ? (
        <GameV2FeedbackChip tone={feedback.tone}>{feedback.text}</GameV2FeedbackChip>
      ) : null}
      {onUndo ? (
        <div>
          <button
            type="button"
            onClick={onUndo}
            disabled={!legs.length}
            className={classNames(
              'inline-flex min-h-[34px] cursor-pointer items-center gap-[6px] rounded-full border-0 bg-[#f2f5f4] py-[9px] pr-[14px] pl-[12px] font-sans text-[13.5px] leading-[16px] font-semibold text-[#1c2a21] disabled:cursor-default disabled:opacity-50',
              FOCUS_RING
            )}
          >
            <GameUndoIcon className="size-[16px]" />
            Undo last stop
          </button>
        </div>
      ) : null}
    </section>
  );
};

export default ErrandRoutePanel;
