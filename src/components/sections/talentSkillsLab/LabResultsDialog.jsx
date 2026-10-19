import { useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import Button from '../../ui/Button.jsx';
import { usePlayfulDialogA11y } from '../../ui/PlayfulDialogA11y.js';
import {
  LabArrowRightIcon,
  LabCheckIcon,
  LabCloseSmIcon,
  LabMortarIcon,
  LabModalCloseIcon,
  LabResultCheckIcon,
  LabResultMortarIcon,
  LabResultRefreshIcon,
  LabResultStarIcon,
} from './LabPlayIcons.jsx';
import { useLabText } from './labFormat.js';
import { DOODLE_STAR_PATH, FOCUS_RING, INK_CARD } from './labPlayStyles.js';
import { CONFETTI } from './skillsLabLabsData.js';

const log = debug('LabResultsDialog');

/*
 * LabResultsDialog — the end-of-lab results modal, all four variants (Figma SL-L10 verified 7851:2518 / 8110:474472,
 * SL-L10b perfect 7851:2824 / 8110:474705, SL-L11 not verified yet 7851:3130 / 8110:474941, SL-L11b tough run
 * 7851:3416 / 8110:475154). Any lab uses it: pass `result` = useLabAttempt().result (a view-model, see buildResultView).
 *
 * Props:
 *   result      { id, tone:'pass'|'retry', medallion:'check'|'star'|'refresh'|'mortar', sticker, confetti, eyebrow,
 *                 heading:[[text, accent?]], body, stats:[{value,label,tone:'green'|'gold'|'plain'}], dots:['ok'|'bad'],
 *                 topics:[{label, qs, strong}], refresher:{title, sub, cta}|null, actions:{secondary, primary} }
 *   onClose     × / Esc / scrim          onSecondary  "Back to Skills Lab" / "Retake now"
 *   onPrimary   "See it on my skills" / "Retake with new questions" / "Start the refresher"
 *   onRefresher the "Open" link in the refresher row
 * Strings may contain the {xp} token (XP in Playful, pts in Focused). Focused = hairline + soft shadows and no stickers /
 * doodles; Playful = ink-55 border + 4px shelf, stickers and doodle stars. Confetti exists in both (colours differ).
 */
const STAT_TONE = {
  green: { box: 'bg-[#e8f2ed]', value: 'text-[#165d3a]' },
  gold: { box: 'bg-[#faf4e8]', value: 'text-[#785910]' },
  plain: { box: 'bg-[#f7f8f4]', value: 'text-[#1c2a21]' },
};

const MEDALLION = {
  check: { icon: LabResultCheckIcon, fill: 'bg-[#387440] text-white', size: 'size-[50px]' },
  star: { icon: LabResultStarIcon, fill: 'bg-[#387440] text-white', size: 'size-[42px]' },
  refresh: { icon: LabResultRefreshIcon, fill: 'bg-white text-[#387440]', size: 'size-[42px]' },
  mortar: { icon: LabResultMortarIcon, fill: 'bg-white text-[#387440]', size: 'size-[42px]' },
};

const Star = ({ className }) => (
  <svg
    viewBox="0 0 22 22"
    aria-hidden="true"
    className={classNames('absolute text-[#ffd86b]', className)}
  >
    <path d={DOODLE_STAR_PATH} fill="currentColor" />
  </svg>
);

const Confetti = ({ kind }) => {
  const { isPlayful } = useLabText();
  const pieces = CONFETTI[kind] ?? [];
  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map(([x, y, rot, pFill, pOp, fFill, fOp], i) => (
        <span
          key={i}
          className="absolute h-[11px] w-[5px] rounded-[2px]"
          style={{
            left: `calc(50% + ${x - 280}px)`,
            top: y,
            transform: `rotate(${rot}deg)`,
            background: isPlayful ? pFill : fFill,
            opacity: isPlayful ? pOp : fOp,
          }}
        />
      ))}
    </span>
  );
};

const Answers = ({ dots }) => (
  <ol
    className="m-0 flex list-none flex-wrap items-center justify-center gap-[8px] p-0"
    aria-label="Your answers"
  >
    {dots.map((state, i) => (
      <li
        key={i}
        aria-label={`Challenge ${i + 1}: ${state === 'ok' ? 'correct' : 'to review'}`}
        className={classNames(
          'inline-flex size-[26px] items-center justify-center rounded-full',
          state === 'ok'
            ? 'bg-[#387440] text-white'
            : 'border-[1.5px] border-solid border-[#c0392b] bg-[#f9ebea] text-[#c0392b]'
        )}
      >
        {state === 'ok' ? (
          <LabCheckIcon className="size-[13px]" />
        ) : (
          <LabCloseSmIcon className="size-[12px]" />
        )}
      </li>
    ))}
  </ol>
);

const TopicRow = ({ topic }) => (
  <li
    className={classNames(
      'flex items-center gap-[10px] rounded-[12px] bg-[#f7f8f4] px-[14px] py-[10px] font-sans'
    )}
  >
    <span
      aria-hidden="true"
      className={classNames(
        'size-[8px] shrink-0 rounded-full',
        topic.strong ? 'bg-[#387440]' : 'bg-[#c0392b]'
      )}
    />
    <span className="min-w-0 flex-1 text-[14px] leading-[17px] font-medium text-[#1c2a21]">
      {topic.label}
    </span>
    <span className="text-[12px] leading-[14px] font-medium whitespace-nowrap text-[#595959]">
      {topic.qs}
    </span>
    <span
      className={classNames(
        'inline-flex items-center rounded-full px-[9px] py-[3px] text-[11px] leading-[13px] font-semibold max-lg:text-[12px] playful:border playful:border-solid playful:border-[rgba(28,42,33,0.35)]',
        topic.strong ? 'bg-[#e8f2ed] text-[#165d3a]' : 'bg-[#f9ebea] text-[#902b20]'
      )}
    >
      {topic.strong ? 'Strong' : 'Review'}
    </span>
  </li>
);

const LabResultsDialog = ({ result, onClose, onSecondary, onPrimary, onRefresher }) => {
  const dialogRef = useRef(null);
  const titleId = useId();
  const { t } = useLabText();
  usePlayfulDialogA11y({
    open: true,
    dialogRef,
    onEscape: onClose,
    initialFocus: () => dialogRef.current,
    lockScroll: true,
  });
  log('render', { id: result.id });

  const medallion = MEDALLION[result.medallion] ?? MEDALLION.check;
  const MedallionIcon = medallion.icon;
  const pass = result.tone === 'pass';

  return createPortal(
    <div
      data-pf-portal=""
      className="fixed inset-0 z-[60] flex overflow-y-auto bg-[rgba(11,26,15,0.55)] p-[12px] sm:p-[16px]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        style={{ outline: 'none' }}
        className={classNames(
          'relative m-auto flex w-full max-w-[560px] flex-col rounded-[28px] bg-white pb-[28px] outline-none',
          // Figma draws the 1.5px ink stroke on the modal frame but its render shows none (the art + body cover it): hairline in Focused, shelf only in Playful.
          'border border-solid border-[rgba(28,42,33,0.1)] shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)] playful:border-transparent playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]'
        )}
      >
        {/* art */}
        <div
          className="relative h-[176px] shrink-0 overflow-hidden rounded-t-[27px]"
          style={{
            backgroundImage: 'radial-gradient(50% 36% at 50% 50%, #e1eae2 0%, #ffffff 100%)',
          }}
        >
          {result.confetti ? <Confetti kind={result.confetti} /> : null}
          <span
            aria-hidden="true"
            className={classNames(
              'absolute top-[40px] left-1/2 inline-flex size-[100px] -translate-x-1/2 items-center justify-center rounded-full',
              medallion.fill,
              INK_CARD
            )}
          >
            <MedallionIcon className={medallion.size} />
          </span>
          {/* Playful-only stickers + doodles */}
          <span aria-hidden="true" className="hidden playful:block">
            <Star className="top-[50px] left-[calc(50%-90px)] size-[18px]" />
            <Star className="top-[110px] left-[calc(50%+72px)] size-[10px] opacity-90" />
          </span>
        </div>
        {result.sticker ? (
          <span
            data-sticker=""
            className={classNames(
              'absolute hidden rounded-[8px] border-[1.2px] border-solid border-[#1c2a21] bg-[#ffd86b] px-[11px] py-[5px] font-sans text-[12px] leading-[14px] font-bold tracking-[0.4px] whitespace-nowrap text-[#1c2a21] shadow-[2px_2px_0_#1c2a21] playful:inline-block',
              pass
                ? 'top-[21px] left-[calc(50%+20px)] -rotate-[8deg]'
                : 'top-[112px] left-[calc(50%+7px)] rotate-[6deg]'
            )}
          >
            {result.sticker}
          </span>
        ) : null}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className={classNames(
            'absolute top-[20px] right-[20px] inline-flex size-[36px] items-center justify-center rounded-full bg-[#f3f3ef] text-[#1c2a21] hover:bg-[#e8e8e2]',
            FOCUS_RING
          )}
        >
          <LabModalCloseIcon className="size-[14px]" />
        </button>

        {/* body */}
        <div className="flex flex-col gap-[18px] px-[clamp(16px,5.7vw,32px)] pt-0">
          <div className="flex flex-col items-center gap-[8px] text-center">
            <p
              className={classNames(
                'm-0 font-sans text-[11px] leading-[13px] font-bold tracking-[1.2px] uppercase max-lg:text-[12px]',
                pass ? 'text-[#387440]' : 'text-[#595959]'
              )}
            >
              {result.eyebrow}
            </p>
            <h2
              id={titleId}
              className="m-0 font-sans text-[clamp(30px,2.55vw,44px)] leading-[1.2] font-semibold text-[#1c2a21] playful:font-heading"
            >
              {result.heading.map(([text, accent], i) => (
                <span key={i} className={accent ? 'text-[#387440]' : undefined}>
                  {text}
                </span>
              ))}
            </h2>
            <p className="m-0 font-sans text-[15px] leading-[22px] font-normal text-[#595959]">
              {result.body}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-[10px]">
            {result.stats.map((stat) => {
              const tone = STAT_TONE[stat.tone] ?? STAT_TONE.plain;
              return (
                <div
                  key={stat.label}
                  className={classNames(
                    'flex min-w-0 flex-col items-center gap-[2px] rounded-[16px] px-[8px] py-[12px] text-center',
                    tone.box,
                    INK_CARD
                  )}
                >
                  <span
                    className={classNames(
                      'font-sans text-[clamp(18px,1.33vw,23px)] leading-[1.27] font-semibold break-words playful:font-heading',
                      tone.value
                    )}
                  >
                    {t(stat.value)}
                  </span>
                  <span className="font-sans text-[10px] leading-[12px] font-semibold tracking-[1px] text-[#595959] uppercase max-lg:text-[12px]">
                    {stat.label}
                  </span>
                </div>
              );
            })}
          </div>

          <Answers dots={result.dots} />

          <ul className="m-0 flex list-none flex-col gap-[8px] p-0" aria-label="Topics">
            {result.topics.map((topic) => (
              <TopicRow key={topic.label} topic={topic} />
            ))}
          </ul>

          {result.refresher ? (
            <div className="flex items-center gap-[12px] rounded-[14px] border border-solid border-[#eedeb8] bg-[#faf4e8] py-[12px] pr-[14px] pl-[12px]">
              <span
                aria-hidden="true"
                className="inline-flex size-[34px] shrink-0 items-center justify-center rounded-[10px] bg-[#c8951a] text-white"
              >
                <LabMortarIcon className="size-[18px]" />
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-[2px] font-sans">
                <span className="text-[14px] leading-[17px] font-semibold text-[#1c2a21]">
                  {result.refresher.title}
                </span>
                <span className="text-[12px] leading-[14px] font-normal text-[#595959]">
                  {result.refresher.sub}
                </span>
              </span>
              <button
                type="button"
                onClick={onRefresher}
                className={classNames(
                  'min-h-[24px] cursor-pointer rounded font-sans text-[13px] leading-[16px] font-semibold text-[#387440] underline max-lg:text-[14px]',
                  FOCUS_RING
                )}
              >
                {result.refresher.cta}
              </button>
            </div>
          ) : null}

          <div className="flex gap-[12px] max-sm:flex-col">
            <button
              type="button"
              onClick={onSecondary}
              className={classNames(
                'inline-flex min-h-[56px] flex-1 cursor-pointer items-center justify-center rounded-[14px] border-t border-r-2 border-b-2 border-l-2 border-solid border-[#c1d4c4] bg-[#e1eae2] px-[16px] py-[16px] font-sans text-[16px] leading-[24px] font-bold tracking-[0.1px] text-[#165d3a] shadow-[0_1px_2px_rgba(27,36,44,0.12)] hover:bg-[#d6e3d8] max-lg:min-h-[44px] max-lg:py-[10px] max-lg:text-[14px]',
                FOCUS_RING
              )}
            >
              {result.actions.secondary}
            </button>
            <Button
              variant="primary"
              size="lg"
              onClick={onPrimary}
              rightIcon={<LabArrowRightIcon className="size-[20px]" />}
              className="flex-1 min-w-0 px-[22px]!"
            >
              {result.actions.primary}
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default LabResultsDialog;
