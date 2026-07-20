import { debug } from '../../../utils/debug.js';
import Modal from '../../ui/Modal.jsx';
import Button from '../../ui/Button.jsx';
import { SLCloseIcon, SLClockIcon } from '../../shared/assets.jsx';

const log = debug('HintModal');

const MODAL_CONTENT_CLASS =
  'rounded-[24px]! shadow-[0px_32px_80px_0px_rgba(0,0,0,0.45)]! overflow-hidden max-w-[520px]!';

const COLOR_MAP = {
  variable: '#c0392b',
  value: '#387440',
  function: '#3062d4',
  number: '#fef08a',
  comment: '#595959',
};

function renderHeadingWithEmphasis(heading) {
  const words = heading.split(' ');
  if (words.length <= 2) return <em className="italic">{heading}</em>;
  const plain = words.slice(0, -2).join(' ') + ' ';
  const emphasis = words.slice(-2).join(' ');
  return (
    <>
      <span>{plain}</span>
      <em className="italic">{emphasis}</em>
    </>
  );
}

export default function HintModal({
  isOpen,
  onClose,
  onUseHint,
  hint,
  challenge,
  skillName,
  currentIndex,
  total,
  score,
  passThreshold,
  renderBody,
}) {
  log('rendering hint modal, open:', isOpen);

  if (!hint) return null;

  const stepCount = hint.steps?.length || 0;
  const description =
    hint.description ||
    `The code does ${stepCount === 1 ? 'one thing' : stepCount === 2 ? 'two things' : stepCount === 3 ? 'three things' : `${stepCount} things`} in order. Understand each one and the answer becomes obvious.`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showClose={false}
      size="md"
      ariaLabel="Hint"
      contentClassName={MODAL_CONTENT_CLASS}
      footer={
        <div className="flex items-center justify-between border-t border-[#e7e7e7] px-[28px] py-[24px]">
          <p className="text-[#595959] text-[11px] font-sans leading-[14px] m-0 max-w-[159px]">
            Q{currentIndex + 1} of {total} · {score} correct so far · need {passThreshold}+ to pass
          </p>
          <div className="flex items-center gap-[5px]">
            <Button variant="tertiary" size="md" onClick={onClose} className="w-[116px]">
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={onUseHint}>
              Use hint −1pt
            </Button>
          </div>
        </div>
      }
    >
      {/* ── Header with gradient ── */}
      <div
        className="relative px-[28px] pt-[24px] pb-[20px]"
        style={{
          backgroundImage:
            'linear-gradient(135deg, rgb(239, 249, 241) 0%, rgb(255, 255, 255) 100%)',
        }}
      >
        <div className="inline-flex items-center px-[12px] py-[5px] rounded-[4px] bg-[#ebf1ec] border border-[#c1d4c4]">
          <span className="text-[#387440] text-[10px] font-sans font-bold uppercase tracking-[1px] leading-normal text-center">
            {skillName || 'Python'} · {challenge?.topic || 'Topic'}
          </span>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-[30px] top-[14px] size-[28px] rounded-full bg-[#ebf1ec] flex items-center justify-center cursor-pointer border-none"
        >
          <SLCloseIcon className="text-[#387440]" />
        </button>

        <div className="flex flex-col items-center gap-[8px] mt-[20px]">
          <span className="text-[48px] leading-none">💡</span>
          <h3
            className="text-[#111] text-[clamp(22px,2.1vw,26px)] tracking-[-1px] text-center"
            style={{ fontFamily: 'Instrument Serif, serif' }}
          >
            {renderHeadingWithEmphasis(hint.heading)}
          </h3>
          <p className="text-[#959592] text-[12px] font-sans leading-[19.8px] text-center max-w-[354px]">
            {description}
          </p>
          <div className="flex items-center gap-[4px] px-[8px] py-[6px] rounded-[4px] bg-[#faf4e8] border border-[#eedeb8]">
            <SLClockIcon className="text-[#c8951a]" />
            <span className="text-[#c8951a] text-[12px] font-sans leading-none text-center">
              Using this hint costs 1 point
            </span>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      {renderBody ? (
        renderBody(hint, challenge)
      ) : (
        <div className="px-[28px] pt-[12px]">
          {challenge?.code && (
            <div className="bg-[rgba(235,241,236,0.5)] border-l-[3px] border-[#387440] rounded-tr-[10px] rounded-br-[10px] h-[45px] flex items-center px-[10px] mb-[16px]">
              <code className="font-sans text-[12px] leading-[18px] tracking-[0.2px] whitespace-nowrap overflow-x-auto">
                {challenge.code.map((token, i) => (
                  <span key={i} style={{ color: COLOR_MAP[token.color] || '#387440' }}>
                    {token.text}
                  </span>
                ))}
              </code>
            </div>
          )}

          <div className="flex flex-col">
            {hint.steps.map((step, i) => (
              <div
                key={i}
                className="flex items-start gap-[12px] border-b border-[#ebf1ec] py-[12px]"
              >
                <div className="size-[26px] rounded-full bg-[#387440] flex items-center justify-center shrink-0">
                  <span className="text-white text-[11px] font-sans font-bold leading-none">
                    {i + 1}
                  </span>
                </div>
                <div className="flex flex-col gap-[5px] flex-1 min-w-0">
                  <span className="text-[#142916] text-[12px] font-sans font-semibold leading-normal">
                    {step.title}
                  </span>
                  <p className="text-[#70706e] text-[12px] font-sans leading-[18.6px] m-0">
                    {step.body}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {hint.keyInsight && (
            <div className="bg-[#faf4e8] border border-[#eedeb8] rounded-[10px] px-[14px] py-[12px] my-[12px]">
              <p className="text-[#a07715] text-[12px] font-sans leading-[19.2px] m-0">
                <span className="font-bold">Key insight: </span>
                {hint.keyInsight}
              </p>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
