import { classNames } from '../../../../../utils/classNames.js';
import { debug } from '../../../../../utils/debug.js';
import { FOCUS_RING } from '../../labPlayStyles.js';
import GameV2Shell from '../GameV2Shell.jsx';
import { useGameV2Params } from '../gamesV2State.js';

const log = debug('GameV2LiveGate');

const BTN =
  'inline-flex min-h-[24px] cursor-pointer items-center justify-center rounded-[12px] px-[20px] py-[12px] font-sans text-[15px] leading-[18px] font-semibold playful:rounded-[14px]';
const BTN_PRIMARY = classNames(
  BTN,
  'border-0 bg-[#387440] text-white playful:border-[1.5px] playful:border-solid playful:border-[#27522e] playful:shadow-[0_3px_0_#27522e]',
  FOCUS_RING
);
const BTN_BACK = classNames(
  BTN,
  'border border-solid border-[#dee5e0] bg-white text-[#1c2a21] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[0_3px_0_rgba(28,42,33,0.45)]',
  FOCUS_RING
);
const CARD =
  'mx-auto flex w-[min(560px,100%)] flex-col gap-[14px] rounded-[20px] border border-solid border-[#dee5e0] bg-white p-[28px] font-sans max-sm:p-[20px] ' +
  'playful:rounded-[28px] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45)]';

const levelName = (l) => (l ? l.charAt(0).toUpperCase() + l.slice(1) : '');
const whenLabel = (iso) => {
  if (!iso) return 'next week';
  const d = new Date(iso);
  return d.toLocaleString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/*
 * GameV2LiveGate — what a live game shows before its board can be drawn (none of these states is drawn in Figma; ⚠️ ASSUMPTION:
 * same card style as the result card):
 *   loading   "Setting up your game…"
 *   conflict  another level / mode of this game is open (409 GAME_IN_PROGRESS) → Resume it · Start over
 *   cooldown  ranked used this week (409 GAME_COOLDOWN) → Play practice · Back to games
 *   error     the message + Try again
 * Props: run (useGameRun), name, subtitleLead.
 */
const GameV2LiveGate = ({ run, name, subtitleLead }) => {
  const g = useGameV2Params();
  let body;
  if (run.status === 'conflict') {
    const c = run.conflict ?? {};
    body = (
      <>
        <h2 className="m-0 text-[20px] leading-[25px] font-semibold text-[#1c2a21]">
          You have this game open already
        </h2>
        <p className="m-0 text-[15px] leading-[22px] text-[#1c2a21]">
          Your {c.mode === 'practice' ? 'practice' : 'ranked'} game at {levelName(c.difficulty)} is
          saved. Pick it up, or start over at {levelName(g.level)} ({g.mode}). Starting over ends
          the saved game.
        </p>
        <div className="flex flex-wrap gap-[12px]">
          <button
            type="button"
            className={BTN_PRIMARY}
            onClick={() => run.resolveConflict('resume')}
          >
            Resume my game
          </button>
          <button type="button" className={BTN_BACK} onClick={() => run.resolveConflict('restart')}>
            Start over
          </button>
        </div>
      </>
    );
  } else if (run.status === 'cooldown') {
    body = (
      <>
        <h2 className="m-0 text-[20px] leading-[25px] font-semibold text-[#1c2a21]">
          Your ranked play of this game is used for this week
        </h2>
        <p className="m-0 text-[15px] leading-[22px] text-[#1c2a21]">
          The next ranked play opens {whenLabel(run.nextRankedAt)}. You can practise as much as you
          like until then.
        </p>
        <div className="flex flex-wrap gap-[12px]">
          <button type="button" className={BTN_PRIMARY} onClick={run.playPractice}>
            Play practice
          </button>
          <button type="button" className={BTN_BACK} onClick={g.exit}>
            Back to games
          </button>
        </div>
      </>
    );
  } else if (run.status === 'error') {
    body = (
      <>
        <h2 className="m-0 text-[20px] leading-[25px] font-semibold text-[#1c2a21]">
          We couldn’t start the game
        </h2>
        <p role="alert" className="m-0 text-[15px] leading-[22px] text-[#1c2a21]">
          {run.error}
        </p>
        <div className="flex flex-wrap gap-[12px]">
          <button
            type="button"
            className={BTN_PRIMARY}
            onClick={() => run.reload?.() ?? window.location.reload()}
          >
            Try again
          </button>
          <button type="button" className={BTN_BACK} onClick={g.exit}>
            Back to games
          </button>
        </div>
      </>
    );
  } else {
    body = (
      <p role="status" className="m-0 text-[15px] leading-[22px] text-[#6b6b6b]">
        Setting up your game…
      </p>
    );
  }
  log('gate', run.status);
  return (
    <GameV2Shell name={name} subtitleLead={subtitleLead} progress={null} footer={{ note: null }}>
      <section aria-label="Game status" className={CARD}>
        {body}
      </section>
    </GameV2Shell>
  );
};

export default GameV2LiveGate;
