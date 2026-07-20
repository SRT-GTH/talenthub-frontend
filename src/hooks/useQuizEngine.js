import { useState, useCallback, useMemo } from 'react';
import { debug } from '../utils/debug.js';

const log = debug('useQuizEngine');

const PHASES = {
  PLAYING: 'playing',
  SELECTED: 'selected',
  CORRECT: 'correct',
  WRONG: 'wrong',
  RESULTS: 'results',
};

export default function useQuizEngine(quizConfig) {
  const { challenges, passThreshold, initialLives } = quizConfig;
  const total = challenges.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState(PHASES.PLAYING);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
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

  const selectAnswer = useCallback(
    (idx) => {
      if (phase !== PHASES.PLAYING) return;
      log('answer selected:', idx);
      setSelectedAnswer(idx);
      setPhase(PHASES.SELECTED);
    },
    [phase]
  );

  const checkAnswer = useCallback(() => {
    if (phase !== PHASES.SELECTED || selectedAnswer === null) return;
    const isCorrect = selectedAnswer === currentChallenge.correctIndex;
    log('checking answer:', selectedAnswer, 'correct:', isCorrect);

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
  }, [phase, selectedAnswer, currentChallenge]);

  const nextQuestion = useCallback(() => {
    const nextIdx = currentIndex + 1;
    if (nextIdx >= total) {
      log('quiz complete — score:', score + (phase === PHASES.CORRECT ? 0 : 0), '/', total);
      setPhase(PHASES.RESULTS);
      return;
    }
    log('advancing to question:', nextIdx + 1, 'of', total);
    setCurrentIndex(nextIdx);
    setSelectedAnswer(null);
    setPhase(PHASES.PLAYING);
  }, [currentIndex, total, score, phase]);

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
    setSelectedAnswer(null);
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
    selectedAnswer,
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

    selectAnswer,
    checkAnswer,
    nextQuestion,
    useHint,
    openHint,
    closeHint,
    retry,

    PHASES,
  };
}
