import { useCallback, useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { debug } from '../../../utils/debug.js';
import Button from '../../ui/Button.jsx';
import { ChessHintIcon, ChessFlagIcon, SLArrowRightSmIcon } from '../../shared/assets.jsx';
import AnswerDots from './AnswerDots.jsx';
import PlayerLabel from './PlayerLabel.jsx';
import DifficultyTabs from './DifficultyTabs.jsx';
import MoveHistory from './MoveHistory.jsx';
import LeadershipInsight from './LeadershipInsight.jsx';

const log = debug('ChessPuzzle');

export default function ChessPuzzle({
  challenge,
  phase,
  fen,
  moveHistory,
  solutionMove,
  answers,
  currentIndex,
  total,
  hintsUsed,
  skillName,
  onMakeMove,
  onGiveUp,
  onNextPuzzle,
  onOpenHint,
}) {
  log('rendering puzzle:', challenge?.topic, 'phase:', phase, 'fen:', fen?.slice(0, 20));

  const [selectedSquare, setSelectedSquare] = useState(null);

  const hintAlreadyUsed = hintsUsed.includes(currentIndex);
  const isWhiteTurn = challenge?.turnToPlay === 'w';
  const canInteract = phase === 'playing';

  const handlePieceDrop = useCallback(
    ({ sourceSquare, targetSquare }) => {
      if (!canInteract) return false;
      return onMakeMove(sourceSquare, targetSquare);
    },
    [canInteract, onMakeMove]
  );

  const handleSquareClick = useCallback(
    ({ square }) => {
      if (!canInteract) return;
      if (selectedSquare) {
        const moved = onMakeMove(selectedSquare, square);
        setSelectedSquare(moved ? null : square);
      } else {
        setSelectedSquare(square);
      }
    },
    [canInteract, selectedSquare, onMakeMove]
  );

  const getHighlightSquares = () => {
    const styles = {};
    if (solutionMove) {
      styles[solutionMove.from] = { backgroundColor: 'rgba(56, 116, 64, 0.4)' };
      styles[solutionMove.to] = { backgroundColor: 'rgba(56, 116, 64, 0.6)' };
    }
    if (selectedSquare) {
      styles[selectedSquare] = { backgroundColor: 'rgba(255, 255, 0, 0.4)' };
    }
    return styles;
  };

  return (
    <div className="flex flex-1 overflow-y-auto">
      {/* Left column — chess board */}
      <div className="flex flex-col items-center justify-center flex-1 px-[clamp(24px,3.9vw,57px)] py-[clamp(16px,2.2vw,32px)] bg-[#fdfdfc]">
        {/* Question indicator */}
        <div className="w-full max-w-[520px] flex flex-col gap-[16px] mb-[clamp(14px,1.8vw,24px)]">
          <div className="flex items-center gap-[8px]">
            <span className="text-[#888] text-[10px] font-sans font-bold uppercase tracking-[0.2px] leading-[16px] whitespace-nowrap shrink-0">
              Puzzle {currentIndex + 1} of {total} · {isWhiteTurn ? 'White' : 'Black'} to play ·{' '}
              {challenge.topic} · {skillName || 'Team Leadership'}
            </span>
            <div className="h-px bg-[rgba(0,0,0,0.07)] flex-1" />
          </div>
          <AnswerDots answers={answers} currentIndex={currentIndex} total={total} />
        </div>

        {/* Puzzle title */}
        <div className="w-full max-w-[520px] flex flex-col gap-[4px] mb-[clamp(10px,1.4vw,20px)]">
          <h2
            className="text-[#111] text-[clamp(18px,1.7vw,24px)] tracking-[-0.4px] leading-[1.3]"
            style={{ fontFamily: 'Instrument Serif, serif' }}
          >
            {challenge.question}
            {challenge.titleEmphasis && <span className="italic"> {challenge.titleEmphasis}</span>}
          </h2>
          {challenge.description && (
            <p className="text-[#70706e] text-[12px] font-sans leading-normal mt-[2px]">
              {challenge.description}
            </p>
          )}
        </div>

        {/* Player label — computer (top) */}
        <div className="w-full max-w-[520px] mb-[8px]">
          <PlayerLabel
            name="GTH Computer"
            role={`Playing ${isWhiteTurn ? 'Black' : 'White'} · Random`}
            isComputer
          />
        </div>

        {/* Chess board — Figma 4515:33634 */}
        <div
          className="w-full max-w-[560px] rounded-[8px] p-[18px]"
          style={{
            backgroundImage:
              'linear-gradient(134.091deg, rgb(20, 41, 22) 0%, rgb(42, 87, 48) 100%)',
          }}
        >
          <div
            className="w-full rounded-[3px]"
            style={{
              backgroundImage:
                'linear-gradient(134.091deg, rgb(20, 41, 22) 0%, rgb(42, 87, 48) 100%)',
              boxShadow:
                'inset 0px 2px 8px 0px rgba(0,0,0,0.6), inset 0px -1px 3px 0px rgba(0,0,0,0.4)',
            }}
          >
            {/* Row: rank numbers + board */}
            <div className="flex">
              {/* Rank numbers — in the left padding of the frame */}
              <div
                className="flex flex-col justify-around shrink-0"
                style={{ width: '18px', paddingTop: '4px', paddingBottom: '4px' }}
              >
                {(isWhiteTurn ? [8, 7, 6, 5, 4, 3, 2, 1] : [1, 2, 3, 4, 5, 6, 7, 8]).map((n) => (
                  <span
                    key={n}
                    className="bg-clip-text text-[transparent] text-[11px] font-medium leading-none text-center"
                    style={{
                      backgroundImage:
                        'linear-gradient(235.788deg, rgb(254, 241, 231) 0%, rgb(232, 242, 237) 20.192%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontFamily: "'DM Mono', monospace",
                    }}
                  >
                    {n}
                  </span>
                ))}
              </div>

              {/* Board with inner border */}
              <div
                className="flex-1"
                style={{
                  border: '1px solid rgba(0,0,0,0.6)',
                  boxShadow:
                    'inset 0px 0px 40px 1px rgba(0,0,0,0.15), inset 0px 0px 0px 2px rgba(255,255,255,0.04)',
                  marginTop: '4px',
                  marginRight: '4px',
                }}
              >
                <Chessboard
                  options={{
                    position: fen,
                    onPieceDrop: handlePieceDrop,
                    onSquareClick: handleSquareClick,
                    arePiecesDraggable: canInteract,
                    boardOrientation: isWhiteTurn ? 'white' : 'black',
                    darkSquareStyle: {
                      backgroundImage:
                        'linear-gradient(135deg, rgb(20, 41, 22) 0%, rgb(42, 87, 48) 100%)',
                    },
                    lightSquareStyle: {
                      backgroundImage:
                        'linear-gradient(160deg, rgb(242, 217, 160) 0%, rgb(232, 201, 122) 40%, rgb(212, 181, 90) 100%)',
                    },
                    squareStyles: getHighlightSquares(),
                    boardStyle: { borderRadius: '0px' },
                    showNotation: false,
                  }}
                />
              </div>
            </div>

            {/* File letters — in the bottom padding of the frame */}
            <div
              className="flex h-[18px] items-center"
              style={{ paddingLeft: '18px', paddingRight: '4px' }}
            >
              {(isWhiteTurn
                ? ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
                : ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a']
              ).map((l) => (
                <span
                  key={l}
                  className="bg-clip-text text-[transparent] text-[11px] font-medium leading-none text-center flex-1"
                  style={{
                    backgroundImage:
                      'linear-gradient(235.788deg, rgb(254, 241, 231) 0%, rgb(232, 242, 237) 20.192%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontFamily: "'DM Mono', monospace",
                  }}
                >
                  {l}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Player label — user (bottom) */}
        <div className="w-full max-w-[520px] mt-[8px]">
          <PlayerLabel
            name="Ben Smith"
            role={`Playing ${isWhiteTurn ? 'White' : 'Black'}`}
            isActive={canInteract}
          />
        </div>
      </div>

      {/* Right column — controls panel */}
      <div className="w-[clamp(340px,30vw,440px)] border-l border-[rgba(0,0,0,0.07)] bg-[#fdfdfc] px-[clamp(20px,2vw,28px)] py-[clamp(16px,2.2vw,32px)] flex flex-col gap-[16px] overflow-y-auto">
        {/* Puzzle title (right panel) */}
        <div className="flex flex-col gap-[4px]">
          <h3
            className="text-[#111] text-[clamp(18px,1.7vw,24px)] tracking-[-0.4px] leading-[1.3]"
            style={{ fontFamily: 'Instrument Serif, serif' }}
          >
            {challenge.title} <em className="italic">{challenge.titleEmphasis}</em>
          </h3>
          <p className="text-[#70706e] text-[12px] font-sans leading-[18px] m-0">
            {challenge.description}
          </p>
        </div>

        <DifficultyTabs />

        {/* Turn indicator */}
        <div className="flex items-center gap-[8px] px-[14px] py-[10px] rounded-[8px] bg-[#f8f8f4] border border-[#e8e8e4]">
          <div
            className={`size-[10px] rounded-full ${canInteract ? 'bg-[#387440]' : 'bg-[#959592]'}`}
          />
          <span className="text-[#575755] text-[13px] font-sans leading-normal">
            {phase === 'correct'
              ? 'Correct! Well done.'
              : phase === 'wrong'
                ? 'Wrong move. Try the next puzzle.'
                : phase === 'showing-solution'
                  ? 'Solution revealed.'
                  : `Your turn · ${isWhiteTurn ? 'White' : 'Black'} to play`}
          </span>
        </div>

        <MoveHistory moves={moveHistory} />

        <LeadershipInsight text={challenge.leadershipInsight} />

        {/* Action buttons */}
        {canInteract && (
          <>
            <button
              type="button"
              onClick={hintAlreadyUsed ? undefined : onOpenHint}
              disabled={hintAlreadyUsed}
              className={`flex items-center justify-center gap-[8px] w-full py-[12px] rounded-[8px] border text-[14px] font-sans font-semibold leading-[24px] transition-all ${
                hintAlreadyUsed
                  ? 'border-[#e8e8e4] text-[#c0bfbd] cursor-not-allowed bg-[#f8f8f4]'
                  : 'border-[#c1d4c4] text-[#387440] cursor-pointer bg-white hover:bg-[#f0f7f1]'
              }`}
            >
              <ChessHintIcon className={hintAlreadyUsed ? 'text-[#c0bfbd]' : 'text-[#387440]'} />
              {hintAlreadyUsed ? 'Hint used' : 'Show hint · costs 1 point'}
            </button>

            <button
              type="button"
              onClick={onGiveUp}
              className="flex items-center justify-center gap-[8px] w-full py-[12px] rounded-[8px] border-none bg-transparent text-[#959592] text-[14px] font-sans font-semibold leading-[24px] cursor-pointer hover:text-[#575755] transition-colors"
            >
              <ChessFlagIcon className="text-[#959592]" />
              Give up · see the solution
            </button>
          </>
        )}

        {/* Next puzzle button */}
        {(phase === 'correct' || phase === 'wrong' || phase === 'showing-solution') && (
          <Button
            variant="tertiary"
            size="md"
            onClick={onNextPuzzle}
            rightIcon={<SLArrowRightSmIcon className="size-[14px]" />}
            className="text-[14px]! w-full"
          >
            {currentIndex < total - 1 ? 'Next Puzzle' : 'See Results'}
          </Button>
        )}
      </div>
    </div>
  );
}
