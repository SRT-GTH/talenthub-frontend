import { debug } from '../../../utils/debug.js';
import Button from '../../ui/Button.jsx';
import { LightbulbIcon, SLArrowRightSmIcon } from '../../shared/assets.jsx';
import AnswerDots from './AnswerDots.jsx';

const log = debug('SentenceBuilder');

function WordChip({ word, onClick, variant = 'bank', state = 'default' }) {
  const base =
    'px-[clamp(12px,1.2vw,16px)] py-[clamp(8px,0.8vw,10px)] rounded-[8px] text-[clamp(12px,1vw,14px)] font-sans font-medium cursor-pointer transition-all select-none border';

  const variants = {
    bank: 'bg-[#faf9f6] border-[#e8e8e4] text-[#575755] hover:border-[#387440] hover:bg-[#f0f7f1]',
    placed: 'bg-[#f0f7f1] border-[#387440] text-[#387440]',
    correct: 'bg-[#e8f5e9] border-[#387440] text-[#387440]',
    wrong: 'bg-[#fff1f2] border-[#c0392b] text-[#c0392b]',
    'correct-position': 'bg-[#e8f5e9] border-[#387440] text-[#387440]',
    'wrong-position': 'bg-[#fff8e1] border-[#c8951a] text-[#c8951a]',
  };

  const stateClass =
    state === 'correct'
      ? variants.correct
      : state === 'wrong'
        ? variants.wrong
        : state === 'correct-position'
          ? variants['correct-position']
          : state === 'wrong-position'
            ? variants['wrong-position']
            : variants[variant];

  return (
    <button type="button" onClick={onClick} className={`${base} ${stateClass}`}>
      {word}
    </button>
  );
}

function getPlacedChipState(word, index, phase, correctOrder) {
  if (phase === 'playing' || phase === 'selected') return 'default';
  if (phase === 'correct') return 'correct';
  if (phase === 'wrong') {
    return word === correctOrder[index] ? 'correct-position' : 'wrong-position';
  }
  return 'default';
}

export default function SentenceBuilder({
  challenge,
  phase,
  placed,
  bank,
  isComplete,
  answers,
  currentIndex,
  total,
  hintsUsed,
  skillName,
  onPlaceWord,
  onRemoveWord,
  onCheck,
  onNext,
  onOpenHint,
}) {
  log('rendering sentence builder, placed:', placed.length, 'bank:', bank.length, 'phase:', phase);

  const hintAlreadyUsed = hintsUsed.includes(currentIndex);

  return (
    <div className="flex flex-col flex-1 px-[clamp(24px,3.9vw,57px)] py-[clamp(16px,2.2vw,32px)] overflow-y-auto">
      {/* Question indicator */}
      <div className="flex flex-col gap-[16px] mb-[clamp(14px,1.8vw,24px)]">
        <div className="flex items-center gap-[8px]">
          <span className="text-[#888] text-[10px] font-sans font-bold uppercase tracking-[0.2px] leading-[16px] whitespace-nowrap shrink-0">
            Challenge {currentIndex + 1} of {total} · {challenge.topic} ·{' '}
            {skillName || 'Public Speaking'}
          </span>
          <div className="h-px bg-[rgba(0,0,0,0.07)] flex-1" />
        </div>
        <AnswerDots answers={answers} currentIndex={currentIndex} total={total} />
      </div>

      {/* Question text */}
      <div className="flex flex-col gap-[4px] mb-[clamp(10px,1.4vw,20px)]">
        <h2
          className="text-[#111] text-[clamp(18px,1.7vw,24px)] tracking-[-0.4px] leading-[1.3]"
          style={{ fontFamily: 'Instrument Serif, serif' }}
        >
          {challenge.question}
          {challenge.questionEmphasis && (
            <span className="text-[#387440]"> {challenge.questionEmphasis}</span>
          )}
        </h2>
        {challenge.subtitle && (
          <p className="text-[#70706e] text-[12px] font-sans leading-normal mt-[2px]">
            {challenge.subtitle}
          </p>
        )}
      </div>

      {/* Context bar */}
      {challenge.contextBar && (
        <div className="bg-[#faf9f6] border-l-[3px] border-[#387440] rounded-tr-[8px] rounded-br-[8px] px-[16px] py-[12px] mb-[clamp(14px,1.8vw,26px)]">
          <p
            className="text-[#387440] text-[12px] font-sans leading-[18px] m-0"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            {challenge.contextBar}
          </p>
        </div>
      )}

      {/* Arrangement zone */}
      <div className="mb-[clamp(16px,2vw,28px)]">
        <p className="text-[#888] text-[10px] font-sans font-bold uppercase tracking-[0.2px] leading-[16px] mb-[10px]">
          Your sentence
        </p>
        <div
          className="min-h-[clamp(80px,8vw,120px)] rounded-[12px] border-2 border-dashed border-[#e8e8e4] bg-[#faf9f6] p-[clamp(12px,1.2vw,16px)] flex flex-wrap gap-[8px] items-start content-start transition-colors"
          style={{
            borderColor:
              phase === 'correct'
                ? '#387440'
                : phase === 'wrong'
                  ? '#c0392b'
                  : placed.length > 0
                    ? '#c8951a'
                    : '#e8e8e4',
            backgroundColor:
              phase === 'correct' ? '#f0f7f1' : phase === 'wrong' ? '#fff8f8' : '#faf9f6',
          }}
        >
          {placed.length === 0 && (
            <span className="text-[#c0bfbd] text-[13px] font-sans italic">
              Click words below to build your sentence...
            </span>
          )}
          {placed.map((word, i) => (
            <WordChip
              key={`${word}-${i}`}
              word={word}
              variant="placed"
              state={getPlacedChipState(word, i, phase, challenge.correctOrder)}
              onClick={() => {
                if (phase === 'playing' || phase === 'selected') onRemoveWord(word);
              }}
            />
          ))}
        </div>
      </div>

      {/* Correct answer reveal on wrong */}
      {phase === 'wrong' && (
        <div className="mb-[clamp(12px,1.4vw,20px)]">
          <p className="text-[#888] text-[10px] font-sans font-bold uppercase tracking-[0.2px] leading-[16px] mb-[8px]">
            Correct order
          </p>
          <div className="flex flex-wrap gap-[6px]">
            {challenge.correctOrder.map((word, i) => (
              <span
                key={i}
                className="px-[10px] py-[6px] rounded-[6px] bg-[#e8f5e9] border border-[#387440] text-[#387440] text-[12px] font-sans font-medium"
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Word bank */}
      <div className="mb-[clamp(16px,2.2vw,32px)]">
        <p className="text-[#888] text-[10px] font-sans font-bold uppercase tracking-[0.2px] leading-[16px] mb-[10px]">
          Word bank — click to place
        </p>
        <div className="flex flex-wrap gap-[8px]">
          {bank.map((word, i) => (
            <WordChip
              key={`${word}-${i}`}
              word={word}
              variant="bank"
              onClick={() => {
                if (phase === 'playing' || phase === 'selected') onPlaceWord(word);
              }}
            />
          ))}
          {bank.length === 0 && phase === 'playing' && (
            <span className="text-[#c0bfbd] text-[12px] font-sans italic">All words placed</span>
          )}
        </div>
      </div>

      {/* Structure hint */}
      {challenge.structureHint && (
        <div className="bg-[#faf9f6] border border-[#e8e8e4] rounded-[8px] px-[16px] py-[10px] mb-[clamp(8px,1vw,16px)]">
          <p className="text-[#387440] text-[11px] font-sans leading-[16px] m-0">
            {challenge.structureHint}
          </p>
        </div>
      )}

      {/* Bottom action bar */}
      <div className="flex items-center justify-between mt-auto pt-[clamp(8px,1.1vw,16px)]">
        <button
          type="button"
          onClick={onOpenHint}
          disabled={hintAlreadyUsed}
          className={`flex items-center gap-[8px] text-[14px] font-sans font-semibold tracking-[0.1px] leading-[24px] bg-transparent border-none cursor-pointer transition-all ${
            hintAlreadyUsed ? 'text-[#c0bfbd] cursor-not-allowed' : 'text-[#111]'
          }`}
        >
          <span className={hintAlreadyUsed ? 'text-[#c0bfbd]' : 'text-[#c8951a]'}>
            <LightbulbIcon />
          </span>
          {hintAlreadyUsed ? (
            <span>Hint used</span>
          ) : (
            <span>
              Need a hint?{' '}
              <span className="text-[#387440] underline decoration-solid">
                Use a hint (-1 point)
              </span>
            </span>
          )}
        </button>

        {phase === 'selected' && isComplete && (
          <Button
            variant="tertiary"
            size="md"
            onClick={onCheck}
            rightIcon={<SLArrowRightSmIcon className="size-[14px]" />}
            className="text-[14px]!"
          >
            Check Sentence
          </Button>
        )}

        {(phase === 'correct' || phase === 'wrong') && (
          <Button
            variant="tertiary"
            size="md"
            onClick={onNext}
            rightIcon={<SLArrowRightSmIcon className="size-[14px]" />}
            className="text-[14px]!"
          >
            {currentIndex < total - 1 ? 'Next Challenge' : 'See Results'}
          </Button>
        )}
      </div>
    </div>
  );
}
