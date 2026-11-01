import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import Button from '../../../ui/Button.jsx';
import AgencyDialog from '../../agency/onboarding/AgencyDialog.jsx';
import { FOCUS_RING } from '../labPlayStyles.js';
import {
  GameV2CloseIcon,
  GameV2HourglassIcon,
  GameV2NoteCheckIcon,
  GameV2RefreshIcon,
  GameV2WarningIcon,
} from './GameV2PlatformIcons.jsx';

const log = debug('GameV2Dialogs');

/*
 * GameV2Dialogs — GV-06 Quit confirm (ranked), GV-07 Time's up, GV-08 Connection lost. Mounted by GameV2Shell; works for every game.
 *   <GameV2QuitDialog  ranked onKeep onLeave />      `?modal=quit`     "Leave this ranked game?" (practice: the shell leaves straight away)
 *   <GameV2TimeUpCard  summary onSeeResult />        `?modal=timeup`   "Time’s up"; `summary` = ONE sentence about the unfinished run,
 *                                                                      the card adds " We’re adding up your score now."
 *   <GameV2OfflineBanner onRetry />                  `?modal=offline`  "Connection lost…" banner laid over the head (above the board)
 * Figma: scrim #1c2a21 at 55 %; modal 500 wide, padding 28, gap 16, r24, top at 23 % of the viewport (not centred). Playful = 1.5px
 * ink@.55 border + 4px hard shelf + soft lift; Focused = 1px ink@.10 hairline + two soft shadows. Tile #ffd86b (44, r13) with the
 * icon, title Bricolage 24/29 (Focused SF), 30px round close, body 15/22, note #ebf1ec r12, button(s) 56 / 48 high.
 * ⚠️ ASSUMPTION: Esc / × / scrim-tap = "Keep playing" on the quit dialog; the Time's up card cannot be dismissed (only "See my result").
 */
const SCRIM =
  'bg-[#1c2a21]/55 items-start! pt-[clamp(16px,23.3vh,248px)]! pb-[16px] max-sm:p-[12px]!';
const CARD =
  'relative flex focus-visible:outline-none! w-[min(500px,calc(100vw-24px))] flex-col gap-[16px] rounded-[24px] bg-white p-[28px] font-sans max-sm:p-[20px] ' +
  'border border-solid border-[rgba(28,42,33,0.1)] shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)] ' +
  'playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]';

const ModalHead = ({ icon, title, onClose, closeLabel }) => {
  const Glyph = icon;
  return (
    <div className="flex items-center gap-[12px]">
      <span
        aria-hidden="true"
        className="inline-flex size-[44px] shrink-0 items-center justify-center rounded-[13px] bg-[#ffd86b] text-[#1c2a21]"
      >
        <Glyph className="size-[20px]" />
      </span>
      <h2 className="m-0 min-w-0 flex-1 font-sans text-[24px] leading-[29px] font-semibold tracking-[-0.01em] text-[#1c2a21] max-sm:text-[20px] max-sm:leading-[24px] playful:font-heading">
        {title}
      </h2>
      {onClose ? (
        <button
          type="button"
          aria-label={closeLabel}
          onClick={onClose}
          className={classNames(
            'relative inline-flex size-[30px] shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-[#f8f8f4] p-0 text-[#1c2a21] before:absolute before:-inset-[1px] before:content-[""]',
            FOCUS_RING
          )}
        >
          <GameV2CloseIcon className="size-[18px]" />
        </button>
      ) : null}
    </div>
  );
};

const ModalNote = ({ children }) => (
  <p className="m-0 flex items-start gap-[10px] rounded-[12px] bg-[#ebf1ec] p-[12px] font-sans text-[13.5px] leading-[16px] font-medium text-[#2a5730]">
    <GameV2NoteCheckIcon className="size-[18px] shrink-0 text-[#387440]" />
    <span className="min-w-0">{children}</span>
  </p>
);

/* ---------- GV-06 Leave this ranked game? ---------- */
export const GameV2QuitDialog = ({ ranked, onKeep, onLeave }) => {
  log('quit dialog', { ranked });
  const title = ranked ? 'Leave this ranked game?' : 'Leave this game?';
  /* ⚠️ ASSUMPTION: practice never opens it (the shell leaves straight away); the copy below only exists for ranked, as drawn. */
  return (
    <AgencyDialog label={title} onClose={onKeep} scrimClassName={SCRIM} panelClassName="my-0!">
      <div className={CARD} tabIndex={-1} data-autofocus="">
        <ModalHead
          icon={GameV2WarningIcon}
          title={title}
          onClose={onKeep}
          closeLabel="Keep playing"
        />
        <p className="m-0 font-sans text-[15px] leading-[23px] font-normal text-[#1c2a21]">
          Your game is saved for 24 hours, so you can pick up where you left off. If you don’t come
          back, it ends with the pairs you’ve found and uses this week’s ranked play.
        </p>
        <ModalNote>Leaving now never counts as a fail.</ModalNote>
        <div className="flex flex-wrap items-center gap-[12px]">
          <Button
            variant="tertiary"
            size="lg"
            onClick={() => {
              log('keep playing');
              onKeep?.();
            }}
            className="min-w-0 grow basis-[160px]"
          >
            Keep playing
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              log('leave for now');
              onLeave?.();
            }}
            className="min-w-0 grow basis-[160px] sm:grow-0 sm:basis-auto"
          >
            Leave for now
          </Button>
        </div>
      </div>
    </AgencyDialog>
  );
};

/* ---------- GV-07 Time's up ---------- */
export const GameV2TimeUpCard = ({ summary, onSeeResult }) => {
  log('time up card', { summary });
  return (
    <AgencyDialog
      label="Time’s up"
      onClose={() => {}}
      dismissable={false}
      scrimClassName={SCRIM}
      panelClassName="my-0!"
    >
      <div className={CARD} tabIndex={-1} data-autofocus="">
        <ModalHead icon={GameV2HourglassIcon} title="Time’s up" />
        <p className="m-0 font-sans text-[15px] leading-[23px] font-normal text-[#1c2a21]">
          {summary ? `${summary} ` : ''}We’re adding up your score now.
        </p>
        <ModalNote>Unfinished games still count for what you completed.</ModalNote>
        <Button
          variant="tertiary"
          size="lg"
          onClick={() => {
            log('see my result');
            onSeeResult?.();
          }}
          className="w-full"
        >
          See my result
        </Button>
      </div>
    </AgencyDialog>
  );
};

/* ---------- GV-08 Connection lost ---------- */
export const GameV2OfflineBanner = ({ onRetry }) => {
  log('offline banner');
  return (
    <div
      role="alert"
      className={classNames(
        'z-20 flex w-max max-w-full items-center gap-[12px] rounded-[12px] border border-solid border-[#dee5e0] bg-[#fef8ec] py-[12px] pr-[12px] pl-[16px]',
        'playful:rounded-[16px] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)]',
        'max-lg:flex-wrap max-lg:justify-between',
        'lg:absolute lg:top-[-28px] lg:left-1/2 lg:-translate-x-1/2'
      )}
    >
      <GameV2RefreshIcon className="size-[18px] shrink-0 text-[#8a6100]" />
      <p className="m-0 min-w-0 flex-1 font-sans text-[14px] leading-[17px] font-semibold text-[#8a6100] max-lg:basis-[200px] max-lg:text-[13px] max-lg:leading-[18px]">
        Connection lost. Your last move is saved and the timer is paused.
      </p>
      <button
        type="button"
        onClick={() => {
          log('try again');
          onRetry?.();
        }}
        className={classNames(
          'min-h-[24px] shrink-0 cursor-pointer rounded-[12px] border border-solid border-[#dee5e0] bg-white px-[20px] py-[12px] font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]',
          'playful:rounded-[14px] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[0_3px_0_rgba(28,42,33,0.45)]',
          FOCUS_RING
        )}
      >
        Try again
      </button>
    </div>
  );
};
