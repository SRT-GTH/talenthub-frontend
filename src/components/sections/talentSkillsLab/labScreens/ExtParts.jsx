import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import Button from '../../../ui/Button.jsx';
import {
  LabArrowRightIcon,
  LabBulbIcon,
  LabCheckCircleFillIcon,
  LabTileCheckIcon,
  LabTileCloseIcon,
} from '../LabPlayIcons.jsx';
import { OPTION_LETTERS } from '../labFormat.js';
import { FOCUS_RING, INK_CARD } from '../labPlayStyles.js';
import { LabInfoCircleIcon, LabThumbUpIcon } from './ExtIcons.jsx';

const log = debug('ExtParts');

/*
 * ExtParts — pieces shared by the Public speaking / Team leadership / Strategic thinking lab flows (labScreens/).
 * Figma: Playful 7851:10551 … 7851:15065, Focused 8110:482533 … 8110:486758. Focused = default classes, Playful = `playful:`.
 *   ExtHead          eyebrow + Bricolage title + optional prompt (title = [[text, accent?]])
 *   ExtOptionList    answer cards A–D: idle | selected | correct | wrong | mid(amber) | dim, chips ("Strongest answer", "Your answer")
 *   ExtNote          grey info row ("Scored by experienced team leads in Ghana…")
 *   ExtFeedback      green / red / amber explanation card; green carries the Playful "+10 XP" sticker
 *   ExtFooter        sticky footer: hint link / "Hint used" · optional note · optional link ("Give up…") · primary button
 */

/* ---------- head ---------- */
export const ExtHead = ({ eyebrow, title, prompt }) => (
  <>
    <p className="m-0 font-sans text-[11px] leading-[13px] font-bold tracking-[1.2px] text-[#387440] uppercase max-lg:text-[12px]">
      {eyebrow}
    </p>
    <h2 className="m-0 font-sans text-[clamp(28px,2.3vw,40px)] leading-[1.2] font-semibold text-[#1c2a21] playful:font-heading">
      {title.map(([text, accent], i) => (
        <span key={i} className={accent ? 'text-[#387440]' : undefined}>
          {text}
        </span>
      ))}
    </h2>
    {prompt ? (
      <p className="m-0 font-sans text-[15px] leading-[22px] font-normal text-[#595959]">
        {prompt}
      </p>
    ) : null}
  </>
);

/* ---------- options ---------- */
const CARD_SHADOW =
  'shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]';
const OPTION_TONE = {
  idle: 'border-[#e7e7e7] bg-white',
  dim: 'border-[#e7e7e7] bg-white opacity-50',
  selected: `border-[rgba(28,42,33,0.1)] bg-[#f5f9f5] ${CARD_SHADOW}`,
  correct: `border-[rgba(28,42,33,0.1)] bg-[#e8f2ed] ${CARD_SHADOW}`,
  wrong: `border-[rgba(28,42,33,0.1)] bg-[#f9ebea] ${CARD_SHADOW}`,
  mid: `border-[rgba(28,42,33,0.1)] bg-[#faf4e8] ${CARD_SHADOW}`,
};
const LETTER_TONE = {
  idle: 'bg-white text-[#1c2a21]',
  dim: 'bg-white text-[#1c2a21]',
  selected: 'bg-[#387440] text-white',
  correct: 'bg-[#1d7c4d] text-white',
  wrong: 'bg-[#c0392b] text-white',
  mid: 'bg-[#c8951a] text-white',
};

const OptionChip = ({ label, icon }) => (
  <span className="inline-flex h-[32px] shrink-0 items-center gap-[6px] rounded-full border border-solid border-[#e1eae2] bg-white px-[14px] font-sans text-[13px] leading-[16px] font-semibold whitespace-nowrap text-[#595959] max-lg:text-[13px]">
    {icon === 'info' ? (
      <LabInfoCircleIcon className="size-[14px] text-[#387440]" />
    ) : (
      <LabCheckCircleFillIcon className="size-[14px] text-[#387440]" />
    )}
    {label}
  </span>
);

/* options: [string]; states: [{ tone, chip, chipIcon }]; the answer text weighs 600 when selected / correct / mid, 500 otherwise. */
export const ExtOptionList = ({ options, states, locked, onSelect, label }) => (
  <div role="radiogroup" aria-label={label} className="flex flex-col gap-[10px]">
    {options.map((text, i) => {
      const { tone, chip, chipIcon } = states[i];
      const checked = tone === 'selected' || (locked && tone !== 'idle' && tone !== 'dim');
      const strong = tone === 'selected';
      return (
        <button
          key={i}
          type="button"
          role="radio"
          aria-checked={checked}
          aria-disabled={locked || undefined}
          data-tone={tone}
          onClick={() => {
            if (locked) return;
            log('select option', i);
            onSelect(i);
          }}
          className={classNames(
            'flex w-full items-center gap-[16px] rounded-[16px] border border-solid py-[16px] pr-[20px] pl-[16px] text-left max-sm:flex-wrap max-sm:gap-y-[8px]',
            OPTION_TONE[tone],
            locked ? 'cursor-default' : 'cursor-pointer',
            FOCUS_RING
          )}
        >
          <span
            aria-hidden="true"
            className={classNames(
              'inline-flex size-[34px] shrink-0 items-center justify-center rounded-[9px] border border-solid border-[rgba(28,42,33,0.12)] font-sans text-[13px] leading-[16px] font-bold playful:border-[1.2px] playful:border-[#1c2a21] playful:shadow-[2px_2px_0_#1c2a21]',
              LETTER_TONE[tone]
            )}
          >
            {OPTION_LETTERS[i]}
          </span>
          <span
            className={classNames(
              'min-w-0 flex-1 font-sans text-[15px] leading-[22px] break-words text-[#1c2a21]',
              strong ? 'font-semibold' : 'font-medium'
            )}
          >
            {text}
          </span>
          {chip ? <OptionChip label={chip} icon={chipIcon} /> : null}
        </button>
      );
    })}
  </div>
);

/* ---------- note ---------- */
export const ExtNote = ({ children }) => (
  <p className="m-0 flex items-center gap-[10px] rounded-[12px] bg-[#f7f8f4] py-[12px] pr-[16px] pl-[14px] font-sans text-[13px] leading-[16px] font-medium text-[#595959] max-lg:text-[13px]">
    <LabInfoCircleIcon className="size-[16px] shrink-0 text-[#595959]" />
    {children}
  </p>
);

/* ---------- feedback ---------- */
const FEEDBACK = {
  correct: { bg: 'bg-[#e8f2ed]', tile: 'bg-[#1d7c4d]', title: 'text-[#165d3a]' },
  wrong: { bg: 'bg-[#f9ebea]', tile: 'bg-[#c0392b]', title: 'text-[#902b20]' },
  mid: { bg: 'bg-[#faf4e8]', tile: 'bg-[#c8951a]', title: 'text-[#785910]' },
};

/* tone: correct (green, + Playful sticker) | wrong (red) | mid (amber, "Not the strongest move") */
export const ExtFeedback = ({ tone, title, body, sticker, className }) => {
  const c = FEEDBACK[tone];
  return (
    <div
      role="status"
      aria-live="polite"
      className={classNames(
        'relative flex items-start gap-[14px] rounded-[16px] py-[16px] pr-[20px] pl-[16px]',
        INK_CARD,
        c.bg,
        className
      )}
    >
      <span
        aria-hidden="true"
        className={classNames(
          'inline-flex size-[36px] shrink-0 items-center justify-center rounded-full text-white',
          c.tile
        )}
      >
        {tone === 'correct' ? <LabTileCheckIcon className="size-[18px]" /> : null}
        {tone === 'wrong' ? <LabTileCloseIcon className="size-[16px]" /> : null}
        {tone === 'mid' ? <LabThumbUpIcon className="size-[18px]" /> : null}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-[4px]">
        <p
          className={classNames('m-0 font-sans text-[16px] leading-[19px] font-semibold', c.title)}
        >
          {title}
        </p>
        <p className="m-0 font-sans text-[14px] leading-[21px] font-normal text-[#1c2a21]">
          {body}
        </p>
      </div>
      {sticker ? (
        <span
          data-sticker=""
          className="absolute top-[-21px] right-[41px] hidden -rotate-[6deg] rounded-[8px] border-[1.2px] border-solid border-[#1c2a21] bg-[#ffd86b] px-[11px] py-[5px] font-sans text-[12px] leading-[14px] font-bold tracking-[0.4px] whitespace-nowrap text-[#1c2a21] shadow-[2px_2px_0_#1c2a21] playful:inline-block"
        >
          {sticker}
        </span>
      ) : null}
    </div>
  );
};

/* ---------- footer ---------- */
const HintArea = ({ hint }) => (
  <p className="m-0 inline-flex min-w-0 flex-wrap items-center gap-x-[8px] font-sans text-[14px] leading-[17px]">
    <LabBulbIcon className="size-[16px] shrink-0 text-[#785910]" />
    {hint.mode === 'used' ? (
      <>
        <span className="font-medium text-[#1c2a21]">{hint.usedLabel}</span>
        <span className="font-semibold text-[#785910]">{hint.cost}</span>
      </>
    ) : (
      <>
        <span className="font-medium text-[#1c2a21]">{hint.prompt}</span>
        <button
          type="button"
          onClick={hint.onClick}
          disabled={hint.disabled}
          className={classNames(
            'min-h-[24px] cursor-pointer rounded font-sans text-[14px] leading-[17px] font-semibold text-[#387440] underline disabled:cursor-default',
            FOCUS_RING
          )}
        >
          {hint.linkLabel}
        </button>
      </>
    )}
  </p>
);

/*
 * ExtFooter — hint = { mode, prompt, linkLabel, usedLabel, cost, onClick, disabled }
 *             note = "Place 2 more to check" (plain text left of the button), link = { label, onClick } ("Give up and see the answer"),
 *             action = { label, onClick, disabled }
 */
export const ExtFooter = ({ hint, note, link, action }) => (
  <footer className="sticky bottom-0 z-10 flex min-h-[88px] flex-wrap items-center justify-between gap-x-[16px] gap-y-[8px] border-t border-solid border-[#e7e7e7] bg-white px-[clamp(16px,3.7vw,64px)] py-[12px]">
    <HintArea hint={hint} />
    <div className="ml-auto flex flex-wrap items-center justify-end gap-x-[16px] gap-y-[8px]">
      {note ? (
        <span className="font-sans text-[13px] leading-[16px] font-medium text-[#595959] max-lg:text-[13px]">
          {note}
        </span>
      ) : null}
      {link ? (
        <button
          type="button"
          onClick={link.onClick}
          className={classNames(
            'min-h-[24px] cursor-pointer rounded bg-transparent font-sans text-[14px] leading-[17px] font-semibold text-[#595959] underline hover:text-[#1c2a21]',
            FOCUS_RING
          )}
        >
          {link.label}
        </button>
      ) : null}
      <Button
        variant="primary"
        size="md"
        disabled={action.disabled}
        onClick={action.onClick}
        rightIcon={<LabArrowRightIcon className="size-[20px]" />}
      >
        {action.label}
      </Button>
    </div>
  </footer>
);
