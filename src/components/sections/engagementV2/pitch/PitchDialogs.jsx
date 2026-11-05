import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { usePlayfulDialogA11y } from '../../../ui/PlayfulDialogA11y.js';
import Button from '../../../ui/Button.jsx';
import { ArrowRightIcon } from '../../../shared/assets.jsx';
import {
  PITCH_COMPLETE as PITCH_COMPLETE_MOCK,
  PITCH_DELETE,
  PITCH_FILE,
  pitchCompleteLive,
} from './pitchData.js';
import {
  PitchCloseIcon,
  PitchEditIcon,
  PitchTrophyIcon,
  PitchVideoCameraIcon,
} from './pitchIcons.jsx';
import { CARD_SHADOW, Card, Chip, Eyebrow, HEAD_FONT, PitchGlyph, Sticker } from './PitchParts.jsx';

const log = debug('PitchDialogs');

/* Modal shell: scrim rgba(11,26,15,.55), focus trap + Esc + restore via usePlayfulDialogA11y. */
const Shell = ({ labelId, onClose, className, children }) => {
  const ref = useRef(null);
  usePlayfulDialogA11y({ open: true, dialogRef: ref, onEscape: onClose, lockScroll: true });
  return createPortal(
    <div
      data-pf-portal=""
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-[#0b1a0f]/55 px-3 py-6 sm:py-[clamp(28px,2.6vw,44px)]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelId}
        tabIndex={-1}
        className={classNames('relative w-full bg-white outline-none', CARD_SHADOW, className)}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] border border-[rgba(28,42,33,0.1)] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)]"
        />
        {children}
      </div>
    </div>,
    document.body
  );
};

const CloseButton = ({ onClose, size, className }) => (
  <button
    type="button"
    aria-label="Close"
    onClick={onClose}
    className={classNames(
      'absolute z-10 flex cursor-pointer items-center justify-center rounded-full border-0 bg-[#f3f3ef] p-0 text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
      size,
      className
    )}
  >
    <PitchCloseIcon className="size-[18px]" />
  </button>
);

/* Confetti rects from the Art frame (x, y, w, h, colour, opacity). */
const CONFETTI = [
  [424, 28, 11, 11, '#c0392b', 0.9],
  [403, 18, 12, 9, '#c0392b', 0.9],
  [114, 47, 12, 11, '#ffd86b', 0.9],
  [52, 81, 12, 11, '#ffd86b', 0.9],
  [102, 90, 5, 11, '#387440', 1],
  [46, 138, 11, 6, '#c8951a', 0.9],
  [122, 145, 12, 10, '#387440', 1],
  [419, 106, 11, 12, '#c0392b', 0.9],
  [524, 74, 12, 11, '#c8951a', 0.9],
  [72, 29, 12, 11, '#ffd86b', 0.9],
  [82, 18, 12, 7, '#c0392b', 0.9],
  [472, 77, 11, 11, '#c8951a', 0.9],
  [109, 115, 10, 12, '#ffd86b', 0.9],
  [126, 75, 12, 8, '#387440', 1],
  [114, 105, 9, 12, '#387440', 1],
  [69, 73, 5, 11, '#3062d4', 0.9],
  [454, 75, 7, 12, '#c0392b', 0.9],
  [133, 116, 12, 9, '#c8951a', 0.9],
  [419, 127, 11, 6, '#c8951a', 0.9],
  [467, 114, 9, 12, '#3062d4', 0.9],
];
const STAT_BG = ['!bg-[#f7f8f4]', '!bg-[#e8f2ed]', '!bg-[#faf4e8]'];
const STAT_FG = ['text-[#1c2a21]', 'text-[#165d3a]', 'text-[#785910]'];

export const CompleteDialog = ({ uiStyle, onClose, onMilestone, onWatch, journey }) => {
  log('mount complete');
  // Signed in: the real journey decides the copy (never "9 of 9 / 100%" for a profile that isn't).
  const PITCH_COMPLETE = journey ? pitchCompleteLive(journey) : PITCH_COMPLETE_MOCK;
  return (
    <Shell
      labelId="pitch-complete-title"
      onClose={onClose}
      className="max-w-[560px] rounded-[28px] pb-7"
    >
      <div
        className="relative h-[176px] overflow-hidden rounded-t-[28px] bg-[radial-gradient(circle_at_50%_50%,#e1eae2_0%,#ffffff_100%)]"
        aria-hidden="true"
      >
        <div className="absolute inset-y-0 left-1/2 w-[560px] -translate-x-1/2 max-[560px]:hidden">
          {CONFETTI.map(([x, y, w, h, c, o]) => (
            <span
              key={`${x}-${y}`}
              className="absolute rounded-[2px]"
              style={{ left: x, top: y, width: w, height: h, background: c, opacity: o }}
            />
          ))}
        </div>
        <span
          className={classNames(
            'absolute top-10 left-1/2 flex size-[100px] -translate-x-1/2 items-center justify-center rounded-full bg-[#387440]',
            CARD_SHADOW
          )}
        >
          <span className="pointer-events-none absolute inset-0 rounded-[inherit] border border-[rgba(28,42,33,0.1)] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)]" />
          <PitchTrophyIcon className="size-11" />
        </span>
        <Sticker className="absolute top-5 left-[calc(50%+20px)]">{PITCH_COMPLETE.sticker}</Sticker>
      </div>
      <CloseButton onClose={onClose} size="size-9 top-[22px] right-[16px]" />
      <div className="flex flex-col gap-[18px] px-[clamp(16px,5.7vw,32px)] pt-[18px]">
        <div className="flex flex-col items-center gap-2 text-center">
          <Eyebrow className="text-[#387440]">{PITCH_COMPLETE.eyebrow}</Eyebrow>
          <h2
            id="pitch-complete-title"
            className={classNames(
              'm-0 font-sans text-[clamp(26px,2.03vw,35px)] leading-[1.19] font-semibold text-[#1c2a21]',
              HEAD_FONT,
              'playful:text-[#111111]'
            )}
          >
            {PITCH_COMPLETE.title[0]}
            <span className="text-[#387440]">{PITCH_COMPLETE.title[1]}</span>
          </h2>
          <p className="m-0 max-w-[470px] font-sans text-[15px] leading-[22px] text-[#595959]">
            {PITCH_COMPLETE.body}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-[10px]">
          {PITCH_COMPLETE.stats.map((s, i) => (
            <Card
              key={s.label}
              className={classNames(
                'flex min-h-[70px] flex-col items-center justify-center gap-[2px] rounded-[16px] px-2 py-3',
                STAT_BG[i]
              )}
            >
              <span
                className={classNames(
                  'font-sans text-[23px] leading-[29px] font-semibold',
                  HEAD_FONT,
                  STAT_FG[i]
                )}
              >
                {uiStyle === 'playful' ? s.value : (s.valueFocused ?? s.value)}
              </span>
              <span className="font-sans text-[10px] leading-[12px] font-semibold tracking-[1px] text-[#595959] max-lg:text-[12px]">
                {s.label}
              </span>
            </Card>
          ))}
        </div>
        <div className="flex flex-col gap-1">
          <Eyebrow className="text-[#595959]">{PITCH_COMPLETE.unlockedLabel}</Eyebrow>
          {PITCH_COMPLETE.unlocked.map((u) => (
            <div key={u.title} className="flex items-center gap-[14px] py-[10px]">
              <span className="flex size-[38px] shrink-0 items-center justify-center rounded-[12px] bg-[#ebf1ec] text-[#387440]">
                <PitchGlyph name={u.icon} className="size-[19px]" />
              </span>
              <span className="flex min-w-0 flex-col gap-[2px]">
                <span className="font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
                  {u.title}
                </span>
                <span className="font-sans text-[13px] leading-[18px] text-[#595959]">{u.sub}</span>
              </span>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="tertiary-subtle" size="lg" className="flex-1" onClick={onWatch}>
            {PITCH_COMPLETE.watch}
          </Button>
          <Button size="lg" className="flex-1" rightIcon={<ArrowRightIcon />} onClick={onMilestone}>
            {PITCH_COMPLETE.milestone}
          </Button>
        </div>
      </div>
    </Shell>
  );
};

/* `file.deleteMeta` (optional) replaces the drawn "Video · 0:54 · published today" line with the real pitch's. */
export const DeleteDialog = ({ file, onClose, onReplace, onConfirm, busy }) => {
  log('mount delete');
  return (
    <Shell
      labelId="pitch-delete-title"
      onClose={onClose}
      className="max-w-[620px] rounded-[28px] px-[clamp(20px,2.3vw,40px)] pt-9 pb-8"
    >
      <CloseButton onClose={onClose} size="size-10 top-6 right-6" />
      <div className="relative flex flex-col gap-5">
        <div className="flex flex-col items-start gap-2 pr-10">
          <Chip>{PITCH_DELETE.chip}</Chip>
          <h2
            id="pitch-delete-title"
            className={classNames(
              'm-0 font-sans text-[clamp(24px,1.85vw,32px)] leading-[1.19] font-semibold text-[#1c2a21]',
              HEAD_FONT,
              'playful:text-[#111111]'
            )}
          >
            {PITCH_DELETE.title}
          </h2>
          <p className="m-0 font-sans text-[15px] leading-[22px] text-[#595959]">
            {PITCH_DELETE.body}
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-[16px] border border-[#e7e7e7] bg-[#f7f8f4] py-[14px] pr-4 pl-[14px]">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-[12px] bg-[#ebf1ec] text-[#387440]">
            <PitchVideoCameraIcon className="size-5" />
          </span>
          <span className="flex min-w-0 flex-col gap-[2px]">
            <span className="truncate font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
              {file.name ?? PITCH_FILE.name}
            </span>
            <span className="font-sans text-[13px] leading-[16px] text-[#595959]">
              {file.deleteMeta ?? PITCH_DELETE.fileMeta}
            </span>
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <Eyebrow className="text-[#595959]">{PITCH_DELETE.whatLabel}</Eyebrow>
          {PITCH_DELETE.effects.map((t) => (
            <div key={t} className="flex items-start gap-2">
              <span
                aria-hidden="true"
                className="mt-[6px] size-[7px] shrink-0 rounded-full bg-[#c0392b]"
              />
              <span className="font-sans text-[14px] leading-[17px] font-medium text-[#1c2a21]">
                {t}
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 rounded-[14px] border border-[#eedeb8] bg-[#faf4e8] py-[14px] pr-4 pl-[14px]">
          <span className="flex size-[34px] shrink-0 items-center justify-center rounded-[10px] bg-[#c8951a] text-[#387440]">
            <PitchEditIcon className="size-[17px]" />
          </span>
          <span className="flex min-w-0 flex-col gap-[2px]">
            <span className="font-sans text-[14px] leading-[17px] font-semibold text-[#1c2a21]">
              {PITCH_DELETE.editTitle}
            </span>
            <span className="font-sans text-[13px] leading-[19px] text-[#595959]">
              {PITCH_DELETE.editBody}
            </span>
          </span>
        </div>
        <div className="flex flex-wrap justify-end gap-3 pt-2">
          <Button
            variant="tertiary-subtle"
            size="lg"
            className="lg:py-[12.5px]"
            onClick={onReplace}
          >
            {PITCH_DELETE.replace}
          </Button>
          <Button
            variant="danger"
            size="md"
            className="lg:py-[12.5px]"
            onClick={onConfirm}
            disabled={busy}
          >
            {PITCH_DELETE.confirm}
          </Button>
        </div>
      </div>
    </Shell>
  );
};
