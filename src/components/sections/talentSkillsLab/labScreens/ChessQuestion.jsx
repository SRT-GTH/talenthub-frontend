import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { HintCard } from '../LabQuestionParts.jsx';
import { LabCheckIcon } from '../LabPlayIcons.jsx';
import { INK_CARD } from '../labPlayStyles.js';
import playerKofi from '../../../../assets/talent-skills-lab/labs/player-kofi.png';
import ChessBoard from './ChessBoard.jsx';
import { CHESS_PUZZLES, CHESS_RULES_TAIL, CHESS_WHY } from './chessData.js';
import { chessView, tapSquare } from './chessLogic.js';
import { useBoardFont } from './extHooks.js';
import { LabCompassIcon } from './ExtIcons.jsx';
import { ExtFeedback } from './ExtParts.jsx';

const log = debug('ChessQuestion');

/*
 * ChessQuestion — Strategic thinking challenge column (Figma SL-L18a Playful 7851:13321 / Focused 8110:485250; hint L18b, checkmate L18c,
 * not mate L18d). Board column (player bars + board) on the left, panel (title, status, hint / feedback, "What this shows recruiters",
 * rules) on the right; stacks on phones. Interaction + outcomes: chessLogic.js, data: chessData.js.
 */
const STATUS_TONE = {
  ok: { bg: 'bg-[#f5f9f5]', dot: 'bg-[#387440]', text: 'text-[#2a5730]' },
  amber: { bg: 'bg-[#faf4e8]', dot: 'bg-[#c8951a]', text: 'text-[#785910]' },
  bad: { bg: 'bg-[#f9ebea]', dot: 'bg-[#c0392b]', text: 'text-[#902b20]' },
};

const PlayerBar = ({ name, sub, avatar }) => (
  <div className="flex items-center gap-[10px] rounded-[12px] border border-solid border-[#c1d4c4] bg-[#f5f9f5] py-[8px] pr-[12px] pl-[8px]">
    {avatar ? (
      <img
        src={avatar}
        alt=""
        draggable="false"
        className="size-[32px] shrink-0 rounded-full object-cover"
      />
    ) : (
      <span
        aria-hidden="true"
        className="inline-flex size-[32px] shrink-0 items-center justify-center rounded-full border border-solid border-[#e7e7e7] bg-white text-[#387440]"
      >
        <LabCompassIcon className="size-[18px]" />
      </span>
    )}
    <span className="flex min-w-0 flex-col gap-[1px]">
      <span className="font-sans text-[14px] leading-[17px] font-semibold text-[#1c2a21]">
        {name}
      </span>
      <span className="font-sans text-[12px] leading-[14px] font-normal text-[#595959]">{sub}</span>
    </span>
  </div>
);

const ChessQuestion = ({ ctx }) => {
  const { attempt, draft, setDraft, t } = ctx;
  useBoardFont();
  const puzzle = CHESS_PUZZLES[attempt.index];
  const view = chessView({ attempt, draft, puzzle, t });
  const tone = STATUS_TONE[view.status.tone];
  const playing = view.state === 'play';
  log('render', { index: attempt.index, state: view.state });

  return (
    <div className="relative flex gap-[40px] max-xl:flex-col max-xl:items-center">
      <div className="flex w-full max-w-[496px] shrink-0 flex-col gap-[10px]">
        <PlayerBar name="GTH Computer" sub="Black" />
        <ChessBoard
          pieces={view.pieces}
          selected={view.selected}
          dots={view.dots}
          marks={view.marks}
          arrow={view.arrow}
          interactive={playing}
          onSquare={(sq) => tapSquare({ sq, draft, puzzle, setDraft })}
        />
        <PlayerBar name="Kofi A." sub={view.kofiSub} avatar={playerKofi} />
      </div>
      <div className="relative flex w-full max-w-[560px] min-w-0 flex-col gap-[18px]">
        <p className="m-0 font-sans text-[11px] leading-[13px] font-bold tracking-[1.2px] text-[#387440] uppercase max-lg:text-[12px]">
          {`PUZZLE ${attempt.index + 1} · ${puzzle.eyebrow}`}
        </p>
        <h2 className="m-0 font-sans text-[clamp(28px,2.3vw,40px)] leading-[1.2] font-semibold text-[#1c2a21] playful:font-heading">
          Find the <span className="text-[#387440]">winning move.</span>
        </h2>
        <p className="m-0 font-sans text-[15px] leading-[22px] font-normal text-[#595959]">
          {puzzle.prompt}
        </p>
        <p
          role="status"
          className={classNames(
            'm-0 flex items-center gap-[10px] rounded-[14px] px-[14px] py-[12px] font-sans text-[14px] leading-[17px] font-semibold',
            INK_CARD,
            tone.bg,
            tone.text
          )}
        >
          <span
            aria-hidden="true"
            className={classNames('size-[10px] shrink-0 rounded-full', tone.dot)}
          />
          {view.status.text}
        </p>
        {attempt.hintUsed && playing ? (
          <HintCard
            title={t('Hint · −{cost} {xp}', { cost: attempt.flow.hintCost })}
            body={puzzle.hint}
            sticker={t('−{cost} {xp}', { cost: attempt.flow.hintCost })}
          />
        ) : null}
        {view.feedback ? <ExtFeedback {...view.feedback} className="max-lg:mt-[8px]" /> : null}
        <div className="flex items-start gap-[12px] rounded-[14px] border border-solid border-[#eedeb8] bg-[#faf4e8] py-[14px] pr-[16px] pl-[14px]">
          <span
            aria-hidden="true"
            className="inline-flex size-[34px] shrink-0 items-center justify-center rounded-[10px] bg-[#c8951a] text-white"
          >
            <LabCompassIcon className="size-[18px]" />
          </span>
          <span className="flex min-w-0 flex-col gap-[3px]">
            <span className="font-sans text-[14px] leading-[17px] font-semibold text-[#1c2a21]">
              {CHESS_WHY.title}
            </span>
            <span className="font-sans text-[13px] leading-[19px] font-normal text-[#595959] max-lg:text-[13px]">
              {CHESS_WHY.body}
            </span>
          </span>
        </div>
        <ul className="m-0 flex list-none flex-col gap-[8px] p-0">
          {[...puzzle.rules, ...CHESS_RULES_TAIL].map((rule) => (
            <li
              key={rule}
              className="flex items-center gap-[8px] font-sans text-[13px] leading-[16px] font-medium text-[#1c2a21]"
            >
              <LabCheckIcon className="size-[14px] shrink-0 text-[#387440]" />
              {rule}
            </li>
          ))}
        </ul>
        {/* Playful doodles beside the title (Figma 20px + 11px gold stars) */}
        <span aria-hidden="true" className="pointer-events-none hidden lg:playful:block">
          <svg
            viewBox="0 0 22 22"
            className="absolute top-[40px] left-[530px] size-[20px] text-[#ffd86b]"
          >
            <path
              d="M11 0C12.1 7.7 14.3 9.9 22 11C14.3 12.1 12.1 14.3 11 22C9.9 14.3 7.7 12.1 0 11C7.7 9.9 9.9 7.7 11 0Z"
              fill="currentColor"
            />
          </svg>
          <svg
            viewBox="0 0 22 22"
            className="absolute top-[72px] left-[554px] size-[11px] text-[#ffd86b]"
          >
            <path
              d="M11 0C12.1 7.7 14.3 9.9 22 11C14.3 12.1 12.1 14.3 11 22C9.9 14.3 7.7 12.1 0 11C7.7 9.9 9.9 7.7 11 0Z"
              fill="currentColor"
            />
          </svg>
        </span>
      </div>
    </div>
  );
};

export default ChessQuestion;
