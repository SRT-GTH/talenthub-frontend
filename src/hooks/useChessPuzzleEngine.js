import { useState, useCallback, useMemo, useRef } from 'react';
import { Chess } from 'chess.js';
import { debug } from '../utils/debug.js';

const log = debug('useChessPuzzleEngine');

const PHASES = {
  PLAYING: 'playing',
  CORRECT: 'correct',
  WRONG: 'wrong',
  SHOWING_SOLUTION: 'showing-solution',
  RESULTS: 'results',
};

export default function useChessPuzzleEngine(quizConfig) {
  const { challenges, passThreshold, initialLives } = quizConfig;
  const total = challenges.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState(PHASES.PLAYING);
  const [answers, setAnswers] = useState([]);
  const [lives, setLives] = useState(initialLives);
  const [streak, setStreak] = useState(0);
  const [xp, setXp] = useState(0);
  const [hintsUsed, setHintsUsed] = useState([]);
  const [hintOpen, setHintOpen] = useState(false);
  const [moveHistory, setMoveHistory] = useState([]);
  const [solutionMove, setSolutionMove] = useState(null);

  const gameRef = useRef(null);

  const currentChallenge = challenges[currentIndex] ?? null;

  if (currentChallenge && (!gameRef.current || gameRef.current._fen !== currentChallenge.fen)) {
    log('initializing chess from FEN:', currentChallenge.fen);
    const g = new Chess(currentChallenge.fen);
    g._fen = currentChallenge.fen;
    gameRef.current = g;
  }

  const game = gameRef.current;
  const fen = game ? game.fen() : null;

  const score = useMemo(() => answers.filter((a) => a === 'correct').length, [answers]);
  const progress = total > 0 ? Math.round((currentIndex / total) * 100) : 0;
  const passed = score >= passThreshold;

  const makeMove = useCallback(
    (from, to) => {
      if (phase !== PHASES.PLAYING || !game || !currentChallenge) return false;

      const sol = currentChallenge.solutionMove;
      log('attempting move:', from, '->', to, 'solution:', sol.from, '->', sol.to);

      const move = game.move({ from, to, promotion: 'q' });
      if (!move) {
        log('illegal move rejected');
        return false;
      }

      setMoveHistory((prev) => [...prev, move.san]);

      const isCorrect = from === sol.from && to === sol.to;

      if (isCorrect) {
        log('correct move!');
        setPhase(PHASES.CORRECT);
        setAnswers((prev) => [...prev, 'correct']);
        setStreak((s) => s + 1);
        setXp((x) => x + 30);
      } else {
        log('wrong move');
        game.undo();
        setMoveHistory((prev) => prev.slice(0, -1));
        setPhase(PHASES.WRONG);
        setAnswers((prev) => [...prev, 'wrong']);
        setLives((l) => Math.max(0, l - 1));
        setStreak(0);
      }

      return true;
    },
    [phase, game, currentChallenge]
  );

  const giveUp = useCallback(() => {
    if (phase !== PHASES.PLAYING || !game || !currentChallenge) return;
    log('giving up, showing solution');

    const sol = currentChallenge.solutionMove;
    try {
      const move = game.move({ from: sol.from, to: sol.to, promotion: 'q' });
      if (move) {
        setMoveHistory((prev) => [...prev, move.san]);
      }
    } catch (e) {
      log.error('solution move failed:', e.message);
    }
    setSolutionMove(sol);
    setPhase(PHASES.SHOWING_SOLUTION);
    setAnswers((prev) => [...prev, 'wrong']);
    setLives((l) => Math.max(0, l - 1));
    setStreak(0);
  }, [phase, game, currentChallenge]);

  const nextPuzzle = useCallback(() => {
    const nextIdx = currentIndex + 1;
    if (nextIdx >= total) {
      log('all puzzles complete, score:', score, '/', total);
      setPhase(PHASES.RESULTS);
      return;
    }
    log('advancing to puzzle:', nextIdx + 1, 'of', total);
    setCurrentIndex(nextIdx);
    setPhase(PHASES.PLAYING);
    setMoveHistory([]);
    setSolutionMove(null);
    gameRef.current = null;
  }, [currentIndex, total, score]);

  const useHint = useCallback(() => {
    if (hintsUsed.includes(currentIndex)) return;
    log('hint used for puzzle:', currentIndex);
    setHintsUsed((prev) => [...prev, currentIndex]);
    setXp((x) => Math.max(0, x - 1));
    setHintOpen(false);
  }, [currentIndex, hintsUsed]);

  const openHint = useCallback(() => setHintOpen(true), []);
  const closeHint = useCallback(() => setHintOpen(false), []);

  const retry = useCallback(() => {
    log('retrying chess puzzles');
    setCurrentIndex(0);
    setPhase(PHASES.PLAYING);
    setAnswers([]);
    setLives(initialLives);
    setStreak(0);
    setXp(0);
    setHintsUsed([]);
    setHintOpen(false);
    setMoveHistory([]);
    setSolutionMove(null);
    gameRef.current = null;
  }, [initialLives]);

  return {
    phase,
    currentIndex,
    currentChallenge,
    answers,
    score,
    lives,
    streak,
    xp,
    progress,
    total,
    passed,
    passThreshold,
    hintOpen,
    hintsUsed,
    hintUsedForCurrent: hintsUsed.includes(currentIndex),
    fen,
    moveHistory,
    solutionMove,

    makeMove,
    giveUp,
    nextPuzzle,
    useHint,
    openHint,
    closeHint,
    retry,

    PHASES,
  };
}
