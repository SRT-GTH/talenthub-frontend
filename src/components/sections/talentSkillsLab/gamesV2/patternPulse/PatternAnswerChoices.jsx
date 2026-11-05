import PatternAnswerCard from './PatternAnswerCard.jsx';

/*
 * PatternAnswerChoices — Figma "answers": four 180x96 cards, gap 18, 774 wide, centred (2 x 2 below 640px).
 *   tones[i]  see PatternAnswerCard      disabled   true once an answer is in
 */
const PatternAnswerChoices = ({ choices, tones, disabled, onPick }) => (
  <div
    role="group"
    aria-label="Answers. Press 1 to 4 on your keyboard, or click an answer."
    className="mx-auto grid w-full max-w-[774px] grid-cols-2 gap-[12px] sm:grid-cols-4 sm:gap-[18px]"
  >
    {choices.map((value, i) => (
      <PatternAnswerCard
        key={value}
        index={i}
        value={value}
        tone={tones[i]}
        disabled={disabled}
        onPick={onPick}
      />
    ))}
  </div>
);

export default PatternAnswerChoices;
