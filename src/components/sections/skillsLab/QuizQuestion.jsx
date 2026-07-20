import { debug } from '../../../utils/debug.js';
import Button from '../../ui/Button.jsx';
import { LightbulbIcon, SLArrowRightSmIcon } from '../../shared/assets.jsx';
import AnswerDots from './AnswerDots.jsx';
import CodeSnippet from './CodeSnippet.jsx';
import AnswerCard from './AnswerCard.jsx';
import {
  BarChartVisual,
  LineChartVisual,
  ScatterPlotVisual,
  ColorPaletteVisual,
  GanttChartVisual,
  NetworkDiagramVisual,
} from './visuals/index.js';

const log = debug('QuizQuestion');

const VISUAL_COMPONENTS = {
  'bar-chart': BarChartVisual,
  'line-chart': LineChartVisual,
  'scatter-plot': ScatterPlotVisual,
  'color-palette': ColorPaletteVisual,
  'gantt-chart': GanttChartVisual,
  'network-diagram': NetworkDiagramVisual,
};

function ColorSwatchCard({ color, label, state, onClick }) {
  const borderColor =
    state === 'selected'
      ? '#387440'
      : state === 'correct'
        ? '#387440'
        : state === 'wrong'
          ? '#c0392b'
          : '#e8e8e4';
  const shadowColor =
    state === 'selected'
      ? '#c1d4c4'
      : state === 'correct'
        ? '#c1d4c4'
        : state === 'wrong'
          ? '#ebc2bd'
          : '#e8e8e4';

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-[6px] cursor-pointer transition-all"
      style={{ flex: '1 1 0', minWidth: 0 }}
    >
      <div
        className="w-full h-[clamp(60px,6vw,80px)] rounded-[8px] transition-all"
        style={{
          backgroundColor: color,
          border: `2px solid ${borderColor}`,
          boxShadow: state !== 'default' ? `0px 4px 0px ${shadowColor}` : '0px 4px 0px #e8e8e4',
        }}
      />
      <span
        className={`text-[10px] font-sans font-medium ${state === 'selected' ? 'text-[#387440]' : state === 'wrong' ? 'text-[#c0392b]' : 'text-[#575755]'}`}
      >
        {state === 'selected' || state === 'correct' ? `${label} ✓` : label}
      </span>
    </button>
  );
}

export default function QuizQuestion({
  challenge,
  phase,
  selectedAnswer,
  correctIndex,
  answers,
  currentIndex,
  total,
  hintsUsed,
  skillName,
  onSelect,
  onCheck,
  onNext,
  onOpenHint,
}) {
  log('rendering question:', challenge?.topic, 'phase:', phase);

  const hasVisual = !!challenge.visual;
  const hasCode = !!challenge.code;
  const isColorPalette = challenge.visual?.type === 'color-palette';
  const hasColorOptions =
    isColorPalette && Array.isArray(challenge.options) && challenge.options[0]?.hex;

  const getCardState = (i) => {
    if (phase === 'playing') return 'default';
    if (phase === 'selected' && i === selectedAnswer) return 'selected';
    if (phase === 'correct' && i === selectedAnswer) return 'correct';
    if (phase === 'wrong') {
      if (i === selectedAnswer) return 'wrong';
      if (i === correctIndex) return 'correct';
    }
    return 'default';
  };

  const hintAlreadyUsed = hintsUsed.includes(currentIndex);

  const VisualComponent = hasVisual ? VISUAL_COMPONENTS[challenge.visual.type] : null;

  return (
    <div className="flex flex-col flex-1 px-[clamp(24px,3.9vw,57px)] py-[clamp(16px,2.2vw,32px)] overflow-y-auto">
      {/* Question indicator */}
      <div className="flex flex-col gap-[16px] mb-[clamp(14px,1.8vw,24px)]">
        <div className="flex items-center gap-[8px]">
          <span className="text-[#888] text-[10px] font-sans font-bold uppercase tracking-[0.2px] leading-[16px] whitespace-nowrap shrink-0">
            Challenge {currentIndex + 1} of {total} · {challenge.topic} · {skillName || 'Python'}
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

      {/* Context bar — green left-border box per Figma */}
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

      {/* Visual component (charts, palettes, Gantt, network) */}
      {VisualComponent && (
        <VisualComponent
          visual={challenge.visual}
          options={challenge.options}
          selectedAnswer={selectedAnswer}
          phase={phase}
        />
      )}

      {/* Code snippet (Python-style) */}
      {hasCode && (
        <div className="mb-[clamp(14px,1.8vw,26px)]">
          <CodeSnippet tokens={challenge.code} />
        </div>
      )}

      {/* Answer cards — standard A/B/C/D or color swatches */}
      {hasColorOptions ? (
        <div className="flex gap-[clamp(8px,1vw,12px)] mb-[clamp(16px,2.2vw,32px)]">
          {challenge.options.map((opt, i) => (
            <ColorSwatchCard
              key={i}
              color={opt.hex}
              label={opt.label}
              index={i}
              state={getCardState(i)}
              onClick={() => {
                if (phase === 'playing') onSelect(i);
              }}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-[clamp(8px,0.9vw,12px)] mb-[clamp(16px,2.2vw,32px)]">
          {challenge.options.map((opt, i) => (
            <AnswerCard
              key={i}
              index={i}
              text={typeof opt === 'string' ? opt : opt.label}
              state={getCardState(i)}
              onClick={() => {
                if (phase === 'playing') onSelect(i);
              }}
            />
          ))}
        </div>
      )}

      {/* Structure hint bar (for sentence builder mode, shown at bottom of visual-mcq too) */}
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

        {phase === 'selected' && (
          <Button
            variant="tertiary"
            size="md"
            onClick={onCheck}
            rightIcon={<SLArrowRightSmIcon className="size-[14px]" />}
            className="text-[14px]!"
          >
            Check Answer
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
            {currentIndex < total - 1 ? 'Next Question' : 'See Results'}
          </Button>
        )}
      </div>
    </div>
  );
}
