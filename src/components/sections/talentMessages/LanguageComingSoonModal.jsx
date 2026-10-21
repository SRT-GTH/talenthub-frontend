import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { debug } from '../../../utils/debug.js';
import Button from '../../ui/Button.jsx';
import { usePlayfulDialogA11y } from '../../ui/PlayfulDialogA11y.js';
import {
  BUBBLE_SLOTS,
  HERO_BOX,
  LANGUAGE_BY_ID,
  LANGUAGE_MODAL_COPY as COPY,
  STEP_LABELS,
  bubbleSlotsFor,
} from './LanguageData.js';
import {
  BellIcon,
  CloseIcon,
  GhanaFlagIcon,
  SparkleSmallIcon,
  SparkleWhiteIcon,
  SparkleYellowIcon,
  SquiggleGoldIcon,
  SquiggleGreenIcon,
  WarningIcon,
} from './dIcons.jsx';

const log = debug('LanguageComingSoonModal');

/*
 * LanguageComingSoonModal — Figma component set "GTH · Language coming soon modal" 7499:7150 (Language = Twi / Ga /
 * Ewe / Dagbani / Hausa), frames L-02 7497:6992 (Twi) · L-02b 7499:135369 (Ga) · L-02c 7499:136038 (Ewe) ·
 * L-02d 7499:136707 (Dagbani) · L-02e 7499:137376 (Hausa) — Focused twins 8110:456342 …
 * 560px card, art band 210px (language bubbles + doodles, Playful-only doodles), body with status pill, title + Ghana
 * flag, copy, progress card (bar + Menus / Messages & jobs / Career Buddy steps), "Ping me when X is ready", "Keep
 * using English" and the "Speak X fluently?" footer. Every string is verbatim from the node `characters`.
 *
 * Props: language ('twi'|'ga'|'ewe'|'dagbani'|'hausa'), onClose() (X, Esc, backdrop, "Keep using English"),
 *        onNotify(languageId) ("Ping me when X is ready" -> the lead opens the "On the list" toast),
 *        onHelp(languageId) optional ("Help us translate →" is drawn as a link only; no flow is drawn).
 */
const BAND = 557;
// Figma px of the 557px art band -> container-width units so the whole band scales as the modal narrows.
const cq = (px) => `${((px / BAND) * 100).toFixed(3)}cqw`;
const cqFont = (px) => `max(12px, ${cq(px)})`;

const Bubble = ({ id, className, style, textStyle, children }) => (
  <span
    data-lang={id}
    aria-hidden="true"
    style={style}
    className={`absolute inline-flex items-center justify-center whitespace-nowrap ${className}`}
  >
    <span style={textStyle}>{children}</span>
  </span>
);

const HERO_BASE =
  'rounded-[999px] border border-[rgba(28,42,33,0.1)] bg-white font-heading font-semibold text-[#1c2a21] shadow-[0_4px_16px_rgba(28,42,33,0.1),0_1px_2px_rgba(28,42,33,0.1)]';

const ArtBand = ({ id, onClose, closeRef }) => {
  const lang = LANGUAGE_BY_ID[id];
  const slots = bubbleSlotsFor(id);
  const hero = HERO_BOX[id];
  const name = (slot) => LANGUAGE_BY_ID[slot].name;
  return (
    // The container must be an ANCESTOR of the elements that use cqw (an element's own cq units resolve against its
    // parent container), so the wrapper is the container and the band inside it sets the height.
    <div style={{ containerType: 'inline-size' }}>
      <div className="relative overflow-hidden bg-[#ebf1ec]" style={{ height: cq(210) }}>
        <span
          aria-hidden="true"
          className="absolute hidden rounded-full border-[1.5px] border-dashed border-[#c1d4c4] playful:block"
          style={{ left: cq(400), top: cq(-40), width: cq(120), height: cq(120) }}
        />
        <span
          aria-hidden="true"
          className="absolute hidden rounded-full border-[1.5px] border-dashed border-[#c1d4c4] playful:block"
          style={{ left: cq(40), top: cq(150), width: cq(70), height: cq(70) }}
        />
        <SquiggleGoldIcon
          className="absolute hidden playful:block"
          style={{ left: cq(72), top: cq(36), width: cq(70), height: cq(14) }}
        />
        <SquiggleGreenIcon
          className="absolute hidden playful:block"
          style={{ left: cq(430), top: cq(170), width: cq(50), height: cq(10) }}
        />
        <SparkleYellowIcon
          className="absolute hidden playful:block"
          style={{ left: cq(168), top: cq(26), width: cq(26), height: cq(26) }}
        />
        <SparkleWhiteIcon
          className="absolute hidden playful:block"
          style={{ left: cq(372), top: cq(30), width: cq(16), height: cq(16) }}
        />
        <SparkleSmallIcon
          className="absolute hidden playful:block"
          style={{ left: cq(470), top: cq(112), width: cq(14), height: cq(14) }}
        />

        {/* slot 1 (big white) */}
        <Bubble
          id={slots[0]}
          className={`${HERO_BASE} !rounded-[22px] !rounded-bl-[6px] text-[#1c2a21]`}
          style={{
            left: cq(54),
            top: cq(92),
            padding: `${cq(8.8)} ${cq(16)}`,
            transform: 'rotate(10deg)',
          }}
          textStyle={{ fontSize: cqFont(21), lineHeight: 1.24 }}
        >
          {name(slots[0])}
        </Bubble>
        {/* hero */}
        <Bubble
          id={id}
          className={`${HERO_BASE} !rounded-[64px] !rounded-bl-[6px]`}
          style={{
            left: cq(hero.x),
            top: cq(hero.y),
            padding: `${cq(16.5)} ${cq(30)}`,
            transform: 'rotate(5deg)',
          }}
          textStyle={{ fontSize: cqFont(lang.heroSize), lineHeight: 1.09 }}
        >
          {lang.name}
        </Bubble>
        {/* slot 2 (yellow) */}
        <Bubble
          id={slots[1]}
          className="rounded-[24px] rounded-bl-[6px] border border-[rgba(28,42,33,0.1)] bg-[#ffd86b] font-heading font-semibold text-[#1c2a21] shadow-[0_4px_16px_rgba(28,42,33,0.1),0_1px_2px_rgba(28,42,33,0.1)]"
          style={{
            left: cq(396),
            top: cq(53),
            padding: `${cq(8.8)} ${cq(16)}`,
            transform: 'rotate(-9deg)',
          }}
          textStyle={{ fontSize: cqFont(22), lineHeight: 1.27 }}
        >
          {name(slots[1])}
        </Bubble>
        {/* slot 3 (small green) */}
        <Bubble
          id={slots[2]}
          className="rounded-[15px] rounded-bl-[6px] border-[1.2px] border-[#1c2a21] bg-[#387440] font-bold text-white shadow-[2px_2px_0_#1c2a21]"
          style={{
            left: cq(406),
            top: cq(138),
            padding: `${cq(6.6)} ${cq(12)}`,
            transform: 'rotate(4deg)',
          }}
          textStyle={{ fontSize: cqFont(15), lineHeight: 1.2 }}
        >
          {name(slots[2])}
        </Bubble>
        {/* slot 4 (small white) */}
        <Bubble
          id={slots[3]}
          className="rounded-[15px] rounded-bl-[6px] border-[1.2px] border-[#1c2a21] bg-white font-bold text-[#1c2a21] shadow-[2px_2px_0_#1c2a21]"
          style={{
            left: cq(112),
            top: cq(153),
            padding: `${cq(6.6)} ${cq(12)}`,
            transform: 'rotate(-5deg)',
          }}
          textStyle={{ fontSize: cqFont(15), lineHeight: 1.2 }}
        >
          {name(slots[3])}
        </Bubble>

        <button
          ref={closeRef}
          type="button"
          aria-label={COPY.close}
          onClick={onClose}
          className="absolute flex size-[36px] cursor-pointer items-center justify-center rounded-full border border-[rgba(28,42,33,0.12)] bg-white text-[#1c2a21] shadow-[0_1px_2px_rgba(28,42,33,0.08)] playful:border-[1.2px] playful:border-[#1c2a21] playful:shadow-[2px_2px_0_#1c2a21]"
          style={{ right: cq(17), top: cq(16) }}
        >
          <CloseIcon className="size-[16px]" />
        </button>
      </div>
    </div>
  );
};

const STEP_STYLE = {
  done: { chip: 'border-[#c1d4c4] bg-[#ebf1ec] text-[#1c2a21]', dot: 'bg-[#387440]' },
  wip: { chip: 'border-[#eedeb8] bg-[#faf4e8] text-[#1c2a21]', dot: 'bg-[#c8951a]' },
  todo: { chip: 'border-[#e1eae2] bg-white text-[#737373]', dot: 'bg-[#c1c1c1]' },
};

const LanguageComingSoonModal = ({ language, onClose, onNotify, onHelp }) => {
  const lang = LANGUAGE_BY_ID[language] ?? LANGUAGE_BY_ID.twi;
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  log('render', { language: lang.id, progress: lang.progress });

  usePlayfulDialogA11y({
    open: true,
    dialogRef,
    onEscape: onClose,
    initialFocus: () => closeRef.current,
    lockScroll: true,
  });

  return createPortal(
    <div data-pf-portal className="fixed inset-0 z-[70]">
      <div
        aria-hidden="true"
        onMouseDown={onClose}
        className="absolute inset-0 bg-[rgba(28,42,33,0.32)] backdrop-blur-[2px]"
      />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-y-auto p-[12px]">
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="messages-lang-modal-title"
          tabIndex={-1}
          className="pointer-events-auto my-auto w-[560px] max-w-full overflow-hidden rounded-[28px] border border-[rgba(28,42,33,0.1)] bg-[#fffefc] shadow-[0_16px_40px_rgba(28,42,33,0.16),0_2px_6px_rgba(28,42,33,0.06)] outline-none playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]"
        >
          <ArtBand id={lang.id} onClose={onClose} closeRef={closeRef} />

          <div className="flex flex-col gap-[14px] px-[clamp(18px,5.4cqw,30px)] pt-[26px] pb-[28px]">
            <span className="inline-flex w-fit rotate-3 items-center gap-[6px] rounded-full border border-[rgba(28,42,33,0.12)] bg-[#ffd86b] px-[12px] py-[5px] text-[12.5px] leading-[15px] font-bold text-[#1c2a21] playful:border-[1.2px] playful:border-[#1c2a21] playful:shadow-[2px_2px_0_#1c2a21]">
              <WarningIcon className="size-[15px]" />
              {COPY.badge}
            </span>

            <div className="flex items-center gap-[5px]">
              <h2
                id="messages-lang-modal-title"
                className="font-heading text-[clamp(24px,5.7cqw,32px)] leading-[1.19] font-semibold text-[#1c2a21]"
              >
                {COPY.title(lang.name)}
              </h2>
              <GhanaFlagIcon className="size-[41px] shrink-0" />
            </div>

            <p className="text-[15px] leading-[21px] text-[#595959] max-lg:text-[15px]">
              {COPY.body}
            </p>

            <div className="flex flex-col gap-[10px] rounded-[18px] border border-[#e1eae2] bg-[#f8f8f4] px-[16px] py-[14px]">
              <div className="flex items-center justify-between gap-[8px] text-[13.5px] leading-[16px]">
                <span className="font-semibold text-[#1c2a21]">{COPY.progress(lang.name)}</span>
                <span className="font-bold text-[#2d5d33]">{lang.progress}%</span>
              </div>
              <div
                role="progressbar"
                aria-label={COPY.progress(lang.name)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={lang.progress}
                className="h-[8px] w-full overflow-hidden rounded-full bg-[#e1eae2]"
              >
                <div
                  className="h-full rounded-full bg-[#387440]"
                  style={{ width: `${lang.progress}%` }}
                />
              </div>
              <ul className="m-0 flex list-none flex-wrap gap-[8px] p-0">
                {STEP_LABELS.map((label, i) => {
                  const s = STEP_STYLE[lang.steps[i]];
                  return (
                    <li
                      key={label}
                      data-step={lang.steps[i]}
                      className={`inline-flex min-h-[26px] items-center gap-[6px] rounded-full border py-[5px] pr-[10px] pl-[8px] text-[12px] leading-[14px] font-semibold ${s.chip}`}
                    >
                      <span aria-hidden="true" className={`size-[8px] rounded-full ${s.dot}`} />
                      {label}
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="flex flex-col gap-[10px] pt-[4px]">
              <Button
                variant="primary"
                size="lg"
                leftIcon={<BellIcon className="size-[20px]" />}
                onClick={() => {
                  log('ping me', lang.id);
                  onNotify?.(lang.id);
                }}
                className="w-full"
              >
                {COPY.ping(lang.name)}
              </Button>
              <Button
                variant="tertiary"
                size="lg"
                onClick={() => {
                  log('keep using English');
                  onClose?.();
                }}
                className="w-full max-lg:whitespace-normal"
              >
                {COPY.keep}
              </Button>
            </div>

            <p className="m-0 flex flex-wrap items-center gap-x-[6px] pt-[4px] text-[13px] leading-[16px] text-[#737373]">
              {COPY.footerLead(lang.name)}
              <button
                type="button"
                onClick={() => {
                  log('help us translate', lang.id);
                  onHelp?.(lang.id);
                }}
                className="cursor-pointer text-[13px] leading-[16px] font-semibold text-[#2d5d33]"
              >
                {COPY.footerLink}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export { BUBBLE_SLOTS };
export default LanguageComingSoonModal;
