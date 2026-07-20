import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { debug } from '../../../utils/debug.js';
import Modal from '../../ui/Modal.jsx';
import Button from '../../ui/Button.jsx';
import { SLCloseIcon, SLStarIcon, SLArrowRightIcon } from '../../shared/assets.jsx';

const log = debug('QuizResults');

const MODAL_CONTENT_CLASS =
  'rounded-[24px]! shadow-[0px_32px_80px_0px_rgba(0,0,0,0.45)]! overflow-hidden max-w-[520px]!';

function AnswerDot({ result }) {
  if (result === 'correct') {
    return (
      <div
        className="size-[28px] rounded-[14px] border-2 border-[#387440] flex items-center justify-center"
        style={{
          backgroundImage:
            'linear-gradient(216.136deg, rgb(254, 241, 231) 0%, rgb(232, 242, 237) 20.192%)',
        }}
      >
        <span className="text-[#1d7c4d] text-[12px] font-sans font-black leading-none">✓</span>
      </div>
    );
  }
  return (
    <div className="size-[28px] rounded-[14px] border-2 border-[#ebc2bd] bg-[#fff1f2] flex items-center justify-center">
      <span className="text-[#c0392b] text-[12px] font-sans font-black leading-none">✕</span>
    </div>
  );
}

function buildTopicBreakdown(answers, challenges) {
  const topicMap = {};
  answers.forEach((result, i) => {
    const topic = challenges[i]?.topic || 'Unknown';
    if (!topicMap[topic]) topicMap[topic] = { correct: 0, total: 0 };
    topicMap[topic].total += 1;
    if (result === 'correct') topicMap[topic].correct += 1;
  });
  return Object.entries(topicMap).map(([topic, stats]) => ({
    topic,
    correct: stats.correct,
    total: stats.total,
    strong: stats.correct === stats.total,
  }));
}

export default function QuizResults({
  passed,
  score,
  total,
  xp,
  answers,
  challenges,
  passThreshold,
  skillName,
  onRetry,
  successEmoji,
  successInfoTitle,
  successInfoBody,
  failureBadges,
  retryLabel,
}) {
  const navigate = useNavigate();

  log('rendering results modal, passed:', passed, 'score:', score, '/', total);

  const topicBreakdown = useMemo(
    () => buildTopicBreakdown(answers, challenges),
    [answers, challenges]
  );

  const wrongIndices = answers.map((r, i) => (r === 'wrong' ? i + 1 : null)).filter(Boolean);

  const handleClose = () => navigate(-1);

  if (passed) {
    return (
      <Modal
        isOpen
        onClose={handleClose}
        showClose={false}
        size="md"
        ariaLabel="Quiz Results"
        contentClassName={MODAL_CONTENT_CLASS}
        footer={
          <div className="flex items-center justify-end gap-[8px] border-t border-[#e7e7e7] px-[28px] py-[24px]">
            <Button variant="tertiary" size="lg" onClick={onRetry} className="w-[138px]">
              ↻ Replay
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleClose}
              rightIcon={<SLArrowRightIcon className="size-[20px]" />}
              className="w-[210px]"
            >
              Back to skill labs
            </Button>
          </div>
        }
      >
        {/* ── Header ── */}
        <div
          className="relative px-[28px] pt-[24px] pb-[20px]"
          style={{
            backgroundImage:
              'linear-gradient(131deg, rgb(239, 249, 241) 0%, rgb(255, 255, 255) 100%)',
          }}
        >
          <div className="inline-flex items-center px-[12px] py-[5px] rounded-[4px] bg-[#ebf1ec] border border-[#c1d4c4]">
            <span className="text-[#387440] text-[10px] font-sans font-bold uppercase tracking-[1px] leading-normal">
              ✓ Skill Verified
            </span>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            className="absolute right-[30px] top-[14px] size-[28px] rounded-full bg-[#ebf1ec] flex items-center justify-center cursor-pointer border-none"
          >
            <SLCloseIcon className="text-[#387440]" />
          </button>
          <div className="flex flex-col items-center gap-[8px] mt-[20px]">
            <span className="text-[72px] leading-[80px]">{successEmoji || '🎉'}</span>
            <div className="flex flex-col items-center gap-[8px]">
              <h3
                className="text-[#111] text-[26px] tracking-[-1px] text-center leading-[26px]"
                style={{ fontFamily: 'Instrument Serif, serif' }}
              >
                {skillName} verified!
              </h3>
              <p className="text-[#959592] text-[12px] font-sans leading-[19.8px] text-center max-w-[354px]">
                You passed the {skillName} challenge. The green ✓ badge is now on your recruiter
                card.
              </p>
            </div>
            <div
              className="flex items-end gap-[6px]"
              style={{ fontFamily: 'Instrument Serif, serif' }}
            >
              <span className="text-[#387440] text-[56px] tracking-[-2px] leading-[56px]">
                {score}
              </span>
              <span className="text-[#575755] text-[28px] leading-normal">/ {total}</span>
            </div>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="px-[28px] pt-[16px]">
          {/* Badges */}
          <div className="flex items-center gap-[8px] justify-center mb-[24px]">
            <div className="flex items-center gap-[10px] px-[10px] py-[7px] rounded-[6px] bg-[#faf4e8] border border-[#eedeb8]">
              <SLStarIcon className="text-[#c8951a]" />
              <span className="text-[#3f6212] text-[12px] font-sans font-semibold leading-none">
                +{xp} XP
              </span>
            </div>
            <div className="flex items-center px-[7px] py-[8px] rounded-[6px] bg-[rgba(235,241,236,0.5)] border border-[#c1d4c4]">
              <span className="text-[#1d7c4d] text-[12px] font-sans font-semibold leading-none text-center">
                ✓ {skillName} badge unlocked
              </span>
            </div>
          </div>

          {/* Answer dots */}
          <div className="flex items-center gap-[12px] justify-center mb-[24px]">
            {answers.map((result, i) => (
              <AnswerDot key={i} result={result} />
            ))}
          </div>

          {/* Verified badge info box */}
          <div className="bg-[rgba(235,241,236,0.5)] border-2 border-[#c1d4c4] rounded-[4px] p-[16px] mb-[10px]">
            <p className="text-[#1d7c4d] text-[14px] font-sans font-bold leading-normal m-0">
              {successInfoTitle || '✓ Verified badge added to your card'}
            </p>
            <p className="text-[#2a5730] text-[11px] font-sans leading-[16.5px] mt-[8px] m-0">
              {successInfoBody || (
                <>
                  Your {skillName} skill now shows a green ✓ on your GTH recruiter card. Recruiters
                  click verified skills 4× more often.
                </>
              )}
            </p>
          </div>

          {/* Topic breakdown */}
          {topicBreakdown.map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-[12px] border-b border-[#ebf1ec] py-[12px] last:border-b-0"
            >
              <div className="size-[26px] rounded-full bg-[#387440] flex items-center justify-center shrink-0">
                <span className="text-white text-[11px] font-sans font-bold leading-none">
                  {i + 1}
                </span>
              </div>
              <div className="flex flex-col gap-[5px] flex-1 min-w-0">
                <span className="text-[#142916] text-[12px] font-sans font-semibold leading-normal">
                  {item.topic} : {item.correct}/{item.total} correct.{' '}
                  {item.strong ? 'Solid' : 'Needs review'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    );
  }

  // ── FAILURE ──
  return (
    <Modal
      isOpen
      onClose={handleClose}
      showClose={false}
      size="md"
      ariaLabel="Quiz Results"
      contentClassName={MODAL_CONTENT_CLASS}
      footer={
        <div className="flex items-center justify-end gap-[8px] border-t border-[#e7e7e7] px-[28px] py-[24px]">
          <Button variant="tertiary" size="lg" onClick={handleClose} className="w-[150px]">
            Back to Lab
          </Button>
          <Button variant="primary" size="sm" onClick={onRetry}>
            {retryLabel || '↻ Retry now  fresh questions'}
          </Button>
        </div>
      }
    >
      {/* ── Header ── */}
      <div
        className="relative px-[28px] pt-[24px] pb-[20px]"
        style={{
          backgroundImage:
            'linear-gradient(132deg, rgb(239, 249, 241) 0%, rgb(255, 255, 255) 100%)',
        }}
      >
        <div className="inline-flex items-center px-[12px] py-[5px] rounded-[4px] bg-[#ebf1ec] border border-[#ebc2bd]">
          <span className="text-[#c0392b] text-[10px] font-sans font-bold uppercase tracking-[1px] leading-normal">
            ✕ Not quite
          </span>
        </div>
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close"
          className="absolute right-[30px] top-[14px] size-[28px] rounded-full bg-[#ebf1ec] flex items-center justify-center cursor-pointer border-none"
        >
          <SLCloseIcon className="text-[#387440]" />
        </button>
        <div className="flex flex-col items-center gap-[8px] mt-[20px]">
          <span className="text-[60px] leading-[67px]">💔</span>
          <div className="flex flex-col items-center gap-[8px]">
            <h3
              className="text-[#111] text-[26px] tracking-[-1px] text-center leading-[26px]"
              style={{ fontFamily: 'Instrument Serif, serif' }}
            >
              So close.
            </h3>
            <p className="text-[#959592] text-[12px] font-sans leading-[19.8px] text-center max-w-[354px]">
              You got {score}/{total}. You needed {passThreshold} to pass. That&rsquo;s just{' '}
              {passThreshold - score} more &mdash; you already know{' '}
              {Math.round((score / total) * 100)}% of this. Retake with fresh questions.
            </p>
          </div>
          <div
            className="flex items-end gap-[6px]"
            style={{ fontFamily: 'Instrument Serif, serif' }}
          >
            <span className="text-[#c0392b] text-[56px] tracking-[-2px] leading-[56px]">
              {score}
            </span>
            <span className="text-[#575755] text-[28px] leading-normal">/ {total}</span>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="px-[28px] pt-[16px]">
        {/* Badges */}
        <div className="flex items-center gap-[8px] justify-center mb-[24px]">
          {failureBadges ? (
            failureBadges.map((badge, i) => (
              <div
                key={i}
                className="flex items-center px-[10px] py-[7px] rounded-[6px] bg-[#faf4e8] border border-[#eedeb8]"
              >
                <span className="text-[#c8951a] text-[12px] font-sans font-semibold leading-none text-center">
                  {i === 0 ? '↻ ' : '♟ '}
                  {badge}
                </span>
              </div>
            ))
          ) : (
            <>
              <div className="flex items-center gap-[4px] px-[10px] py-[7px] rounded-[6px] bg-[#faf4e8] border border-[#eedeb8]">
                <SLStarIcon className="text-[#c8951a]" />
                <span className="text-[#c8951a] text-[12px] font-sans font-semibold leading-none text-center">
                  +{xp} XP
                </span>
              </div>
              <div className="flex items-center px-[7px] py-[8px] rounded-[6px] bg-[rgba(235,241,236,0.5)] border border-[#c1d4c4]">
                <span className="text-[#1d7c4d] text-[12px] font-sans font-semibold leading-none text-center">
                  ✓ {skillName} badge unlocked
                </span>
              </div>
            </>
          )}
        </div>

        {/* Answer dots */}
        <div className="flex items-center gap-[12px] justify-center mb-[24px]">
          {answers.map((result, i) => (
            <AnswerDot key={i} result={result} />
          ))}
        </div>

        {/* Where it went wrong box */}
        <div className="bg-[#f9ebea] border-2 border-[#ebc2bd] rounded-[8px] p-[16px] mb-[10px]">
          <p className="text-[#902b20] text-[14px] font-sans font-bold leading-normal m-0">
            Where it went wrong
          </p>
          <p className="text-[#902b20] text-[12px] font-sans leading-[20px] mt-[8px] m-0">
            {wrongIndices.length > 0 && <>Q{wrongIndices.join(', Q')} : </>}
            all from the same area:{' '}
            {topicBreakdown
              .filter((t) => !t.strong)
              .map((t) => t.topic.toLowerCase())
              .join(' and ')}
            . The good news: those are learnable in 15 minutes. Each retake draws fresh questions
            from the same pool.
          </p>
        </div>

        {/* Topic breakdown rows — Figma 4621:17322 / 4621:17327 */}
        <div className="flex flex-col gap-[10px]">
          {topicBreakdown.map((item, i) => (
            <div
              key={i}
              className="flex items-center h-[35px] bg-[rgba(235,241,236,0.5)] border border-[#c1d4c4] rounded-[8px] px-[12px]"
            >
              <div
                className={`size-[8px] rounded-[4px] shrink-0 ${item.strong ? 'bg-[#1d7c4d]' : 'bg-[#c0392b]'}`}
              />
              <span className="text-[#575755] text-[12px] font-sans leading-none ml-[18px] flex-1">
                {item.topic}
              </span>
              <div
                className={`px-[8px] py-[2px] rounded-[4px] ${
                  item.strong ? 'bg-[#e1eae2]' : 'bg-[#f9ebea]'
                }`}
              >
                <span
                  className={`text-[10px] font-sans font-semibold leading-none ${
                    item.strong ? 'text-[#1d7c4d]' : 'text-[#c0392b]'
                  }`}
                >
                  {item.strong ? '✓ Strong' : 'Review needed'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}
