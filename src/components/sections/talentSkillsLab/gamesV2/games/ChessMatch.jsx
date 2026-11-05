import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Chess } from 'chess.js';
import { debug } from '../../../../../utils/debug.js';
import GameV2Shell from '../GameV2Shell.jsx';
import { useGameV2Params } from '../gamesV2State.js';
import ChessBoard from '../chess/ChessBoard.jsx';
import ChessClockCards from '../chess/ChessClockCards.jsx';
import ChessMoveList from '../chess/ChessMoveList.jsx';
import ChessTipCard from '../chess/ChessTipCard.jsx';
import {
  MATCH_COPY,
  MATCH_MEASURES,
  MATCH_MOVES,
  MATCH_SEEDS,
  MATCH_START_FEN,
} from '../chess/chessData.js';
import {
  PIECE_NAME,
  gradeMove,
  kwakuMove,
  legalMoves,
  materialDiff,
} from '../chess/chessEngine.js';
import GameV2FeedbackChip from '../planningShared/GameV2FeedbackChip.jsx';
import GameV2Head from '../planningShared/GameV2Head.jsx';
import { GameCheckCircleIcon, GameClockIcon } from '../planningShared/PlanningChessIcons.jsx';

const log = debug('ChessMatch');

// eslint-disable-next-line react-refresh/only-export-components
export const GAMES_V2_META = {
  'chess-match': {
    name: 'Chess Match',
    subtitleLead: `Strategic thinking · full game against Kwaku · ${MATCH_MOVES} moves`,
    resultProgress: {
      countLabel: `Move ${MATCH_MOVES} of ${MATCH_MOVES}`,
      summary: 'Game finished',
      dots: [],
      passMark: MATCH_COPY.plays,
    },
  },
};

const GRADE_POINTS = { best: 100, good: 80, inaccuracy: 50, blunder: 10 }; // ⚠️ ASSUMPTION
const KWAKU_DELAY = 450;

const materialLabel = (diff) => (diff > 0 ? `You +${diff}` : diff < 0 ? `Kwaku +${-diff}` : 'Even');
const materialSummary = (diff) =>
  diff > 0
    ? `You’re ahead by ${diff} points`
    : diff < 0
      ? `Kwaku is ahead by ${-diff}`
      : 'Material is even'; // ⚠️ ASSUMPTION for the even case

const ChessMatch = ({ frame }) => {
  const g = useGameV2Params();
  const seed = frame ? MATCH_SEEDS[frame] : null;
  const [fen, setFen] = useState(seed ? seed.fen : MATCH_START_FEN);
  const [rows, setRows] = useState(seed ? seed.rows : []);
  const [selected, setSelected] = useState(seed ? seed.selected : null);
  const [dots, setDots] = useState(seed ? seed.dots : null);
  const [seeded, setSeeded] = useState(Boolean(seed));
  const [note, setNote] = useState(
    seed ? { tip: seed.tip, chip: seed.chip } : { tip: null, chip: null }
  );
  const [thinking, setThinking] = useState(false);
  const [ended, setEnded] = useState(null); // { text }
  const flipped = false;
  const timer = useRef(null);

  const chess = useMemo(() => new Chess(fen), [fen]);
  const moveNo = Math.min(chess.moveNumber(), MATCH_MOVES);
  const diff = seeded && seed ? null : materialDiff(chess);
  const materialText = seeded && seed ? seed.material : materialLabel(diff);
  const summaryText = seeded && seed ? seed.summary : materialSummary(diff);
  const movesLeft = seeded && seed ? seed.movesLeft : MATCH_MOVES - moveNo;
  const locked = thinking || Boolean(ended) || Boolean(g.modal);

  const targets = useMemo(() => {
    if (!selected) return [];
    if (dots) return dots.map((square) => ({ square, capture: false }));
    return legalMoves(chess)
      .filter((m) => m.from === selected)
      .map((m) => ({ square: m.to, capture: m.isCapture() }));
  }, [chess, selected, dots]);

  useEffect(() => {
    log('mount', { level: g.level, fen, frame, ranked: g.ranked });
    return () => window.clearTimeout(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const buildResult = useCallback((list, outcome, fenNow) => {
    const graded = list.filter((r) => r.grade);
    const avg = graded.length
      ? graded.reduce((n, r) => n + GRADE_POINTS[r.grade], 0) / graded.length
      : 0;
    const blunders = graded.filter((r) => r.grade === 'blunder').length;
    const final = materialDiff(new Chess(fenNow));
    const outcomePoints =
      outcome === 'win'
        ? 30
        : outcome === 'draw'
          ? 15
          : outcome === 'loss'
            ? 0
            : final > 0
              ? 20
              : final === 0
                ? 10
                : 0;
    const bestRate = graded.length
      ? Math.round((100 * graded.filter((r) => r.grade === 'best').length) / graded.length)
      : 0;
    return {
      score: Math.max(0, Math.min(100, Math.round(avg * 0.7 + outcomePoints))),
      skills: [
        { label: 'Strategic thinking', value: Math.round(avg) },
        { label: 'Planning', value: bestRate },
        { label: 'Attention to detail', value: Math.max(0, 100 - blunders * 25) },
      ],
      summary: `Played ${graded.length} graded moves against Kwaku (${blunders} blunder${blunders === 1 ? '' : 's'}); ${
        outcome === 'win'
          ? 'you won'
          : outcome === 'loss'
            ? 'Kwaku won'
            : outcome === 'draw'
              ? 'it ended in a draw'
              : `material ${materialLabel(final).toLowerCase()}`
      }.`,
      verifies: 'Strategic thinking',
    };
  }, []);

  const finishGame = useCallback(
    (list, outcome, fenNow, text) => {
      log('game over', outcome, text);
      setEnded({ text });
      const result = buildResult(list, outcome, fenNow);
      timer.current = window.setTimeout(() => g.finish(result), 1400);
    },
    [buildResult, g]
  );

  const onSquare = useCallback(
    (square) => {
      if (locked) return;
      const piece = chess.get(square);
      const legal = legalMoves(chess);
      if (selected) {
        const move = legal.find((m) => m.from === selected && m.to === square);
        if (!move) {
          if (piece && piece.color === 'w' && square !== selected) {
            setSelected(square);
            setDots(null);
          } else {
            setSelected(null);
            setDots(null);
          }
          return;
        }
        const before = fen;
        const number = chess.moveNumber();
        const { grade, bestSan } = gradeMove(before, move);
        const next = new Chess(before);
        const played = next.move({ from: move.from, to: move.to, promotion: move.promotion });
        log('player move', played.san, { grade, bestSan, number });
        const row = { n: number, san: played.san, grade, reply: null };
        setSeeded(false);
        setSelected(null);
        setDots(null);
        setFen(next.fen());
        const rowsNow = [...rows, row];
        setRows(rowsNow);
        const noteFor = (replied) => {
          if (grade === 'blunder') {
            const lost = replied?.captured ? PIECE_NAME[replied.captured] : null;
            return {
              tip: MATCH_COPY.askTip,
              chip: lost
                ? `Blunder: your ${lost} was open. Kwaku took it.`
                : `Blunder: ${bestSan} was much stronger.`, // ⚠️ ASSUMPTION copy
            };
          }
          if (grade === 'inaccuracy') {
            return { tip: `Inaccuracy on move ${number}: ${bestSan} was stronger.`, chip: null }; // ⚠️ ASSUMPTION copy
          }
          return { tip: null, chip: null };
        };
        if (next.isCheckmate()) {
          setNote({ tip: null, chip: null });
          finishGame(rowsNow, 'win', next.fen(), 'Checkmate. You win.'); // ⚠️ ASSUMPTION copy
          return;
        }
        if (next.isDraw() || next.isStalemate()) {
          finishGame(rowsNow, 'draw', next.fen(), 'The game is drawn.'); // ⚠️ ASSUMPTION copy
          return;
        }
        setThinking(true);
        timer.current = window.setTimeout(() => {
          const reply = kwakuMove(next, g.level);
          const replied = next.move(reply);
          log('kwaku move', replied.san);
          const full = rowsNow.map((r, i) =>
            i === rowsNow.length - 1 ? { ...r, reply: replied.san } : r
          );
          setRows(full);
          setFen(next.fen());
          setThinking(false);
          setNote(noteFor(replied));
          if (next.isCheckmate())
            finishGame(full, 'loss', next.fen(), 'Checkmate. Kwaku wins.'); // ⚠️ ASSUMPTION copy
          else if (next.isDraw() || next.isStalemate())
            finishGame(full, 'draw', next.fen(), 'The game is drawn.');
          else if (next.moveNumber() > MATCH_MOVES)
            finishGame(full, 'moves', next.fen(), 'That’s 30 moves. Game over.'); // ⚠️ ASSUMPTION copy
        }, KWAKU_DELAY);
        return;
      }
      if (piece && piece.color === 'w') {
        log('select', square);
        setSelected(square);
        setDots(null);
      }
    },
    [locked, chess, selected, fen, rows, g.level, finishGame]
  );

  const resign = () => {
    window.clearTimeout(timer.current);
    const result = buildResult(rows, 'loss', fen);
    log('resign', result);
    g.finish(result);
  };

  const shownRows = rows.slice(-2);
  const showCurrent = !note.chip && !ended;
  const diffLabel = materialText;

  return (
    <GameV2Shell
      name="Chess Match"
      subtitleLead={`Strategic thinking · full game against Kwaku · ${MATCH_MOVES} moves`}
      progress={{
        countLabel: `Move ${moveNo} of ${MATCH_MOVES}`,
        summary: summaryText,
        dots: [],
        passMark: MATCH_COPY.plays,
      }}
      footer={{ note: '', link: { label: 'Resign game', size: 'lg', onClick: resign } }}
      timeUp={{ summary: 'The game was left unfinished.' }}
      onSeeResult={resign}
    >
      <GameV2Head
        eyebrow={`GAME AGAINST KWAKU · ${(g.level ?? 'intermediate').toUpperCase()}`}
        title={MATCH_COPY.title}
        lead={MATCH_COPY.lead}
        stats={[
          { icon: GameClockIcon, label: 'Untimed' },
          { icon: GameCheckCircleIcon, label: diffLabel },
        ]}
        measures={MATCH_MEASURES}
      />
      <section
        aria-label="Chess Match"
        className="flex flex-wrap items-center gap-[32px] lg:min-h-[476px]"
      >
        <ChessBoard
          board={chess.board()}
          flipped={flipped}
          selected={selected}
          targets={targets}
          onSquare={onSquare}
          disabled={locked}
        />
        <div className="flex w-full min-w-[min(100%,300px)] max-w-[470px] flex-1 flex-col gap-[16px]">
          <ChessClockCards
            dark={{ label: 'MOVES LEFT', value: `${movesLeft} of ${MATCH_MOVES}` }}
            light={{ label: 'MATERIAL', value: diffLabel }}
          />
          <ChessMoveList
            heading="LAST MOVES"
            rows={shownRows}
            currentNumber={showCurrent ? moveNo : null}
          />
          <ChessTipCard>{note.tip ?? MATCH_COPY.defaultTip}</ChessTipCard>
          {ended ? (
            <GameV2FeedbackChip tone="info">{ended.text}</GameV2FeedbackChip>
          ) : note.chip ? (
            <GameV2FeedbackChip tone="error">{note.chip}</GameV2FeedbackChip>
          ) : null}
        </div>
      </section>
    </GameV2Shell>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const GAMES_V2 = { 'chess-match': ChessMatch };

export default ChessMatch;
