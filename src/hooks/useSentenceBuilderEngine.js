import { useState, useCallback, useMemo } from 'react';
import { debug } from '../utils/debug.js';

const log = debug('useSentenceBuilderEngine');

const PHASES = {
  PLAYING: 'playing',
  SELECTED: 'selected',
  CORRECT: 'correct',
  WRONG: 'wrong',
  RESULTS: 'results',
};

export default function useSentenceBuilderEngine(quizConfig) {
  const { challenges, passThreshold, initialLives } = quizConfig;
  const total = challenges.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState(PHASES.PLAYING);
  const [placed, setPlaced] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [lives, setLives] = useState(initialLives);
  const [streak, setStreak] = useState(0);
  const [xp, setXp] = useState(0);
  const [hintsUsed, setHintsUsed] = useState([]);
  const [hintOpen, setHintOpen] = useState(false);

  const score = useMemo(() => answers.filter((a) => a === 'correct').length, [answers]);
  const wrongCount = useMemo(() => answers.filter((a) => a === 'wrong').length, [answers]);
  const currentChallenge = challenges[currentIndex] ?? null;
  const progress = total > 0 ? Math.round((currentIndex / total) * 100) : 0;
  const passed = score >= passThreshold;

  const bank = useMemo(() => {
    if (!currentChallenge) return [];
    return currentChallenge.wordBank.filter((w) => !placed.includes(w));
  }, [currentChallenge, placed]);

  const isComplete = currentChallenge
    ? placed.length === currentChallenge.correctOrder.length
    : false;

  const placeWord = useCallback(
    (word) => {
      if (phase !== PHASES.PLAYING && phase !== PHASES.SELECTED) return;
      log('placing word:', word);
      setPlaced((prev) => {
        const next = [...prev, word];
        const complete = currentChallenge && next.length === currentChallenge.correctOrder.length;
        if (complete) {
          setPhase(PHASES.SELECTED);
        }
        return next;
      });
    },
    [phase, currentChallenge]
  );

  const removeWord = useCallback(
    (word) => {
      if (phase !== PHASES.PLAYING && phase !== PHASES.SELECTED) return;
      log('removing word:', word);
      setPlaced((prev) => {
        const next = prev.filter((w) => w !== word);
        if (next.length < (currentChallenge?.correctOrder.length ?? 0)) {
          setPhase(PHASES.PLAYING);
        }
        return next;
      });
    },
    [phase, currentChallenge]
  );

  const checkAnswer = useCallback(() => {
    if (phase !== PHASES.SELECTED || !currentChallenge) return;
    const correct = currentChallenge.correctOrder;
    const isCorrect = placed.length === correct.length && placed.every((w, i) => w === correct[i]);
    log('checking sentence, correct:', isCorrect);

    if (isCorrect) {
      setPhase(PHASES.CORRECT);
      setAnswers((prev) => [...prev, 'correct']);
      setStreak((s) => s + 1);
      setXp((x) => x + 30);
    } else {
      setPhase(PHASES.WRONG);
      setAnswers((prev) => [...prev, 'wrong']);
      setLives((l) => Math.max(0, l - 1));
      setStreak(0);
    }
  }, [phase, placed, currentChallenge]);

  const nextQuestion = useCallback(() => {
    const nextIdx = currentIndex + 1;
    if (nextIdx >= total) {
      log('quiz complete — score:', score, '/', total);
      setPhase(PHASES.RESULTS);
      return;
    }
    log('advancing to challenge:', nextIdx + 1, 'of', total);
    setCurrentIndex(nextIdx);
    setPlaced([]);
    setPhase(PHASES.PLAYING);
  }, [currentIndex, total, score]);

  const useHint = useCallback(() => {
    if (hintsUsed.includes(currentIndex)) return;
    log('hint used for challenge:', currentIndex);
    setHintsUsed((prev) => [...prev, currentIndex]);
    setXp((x) => Math.max(0, x - 1));
    setHintOpen(false);
  }, [currentIndex, hintsUsed]);

  const openHint = useCallback(() => setHintOpen(true), []);
  const closeHint = useCallback(() => setHintOpen(false), []);

  const retry = useCallback(() => {
    log('retrying quiz');
    setCurrentIndex(0);
    setPhase(PHASES.PLAYING);
    setPlaced([]);
    setAnswers([]);
    setLives(initialLives);
    setStreak(0);
    setXp(0);
    setHintsUsed([]);
    setHintOpen(false);
  }, [initialLives]);

  return {
    phase,
    currentIndex,
    currentChallenge,
    placed,
    bank,
    isComplete,
    answers,
    score,
    wrongCount,
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

    placeWord,
    removeWord,
    checkAnswer,
    nextQuestion,
    useHint,
    openHint,
    closeHint,
    retry,

    PHASES,
  };
}
