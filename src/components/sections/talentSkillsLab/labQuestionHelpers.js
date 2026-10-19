import { OPTION_LETTERS } from './labFormat.js';

/*
 * Feedback headline. The engine writes the Python wording ("Not quite. The answer is B."); these two labs draw
 * "Close, but not quite. It’s B." (Data analysis) and "Close, but not quite. It’s Amber." (UI/UX). `question.answerLabel` overrides
 * the letter (the palette answer is a colour name).
 */
export const feedbackTitle = (attempt, t) => {
  const { feedback, question } = attempt;
  if (feedback.tone !== 'wrong') return t(feedback.title);
  return `Close, but not quite. It’s ${question.answerLabel ?? OPTION_LETTERS[question.answer]}.`;
};
