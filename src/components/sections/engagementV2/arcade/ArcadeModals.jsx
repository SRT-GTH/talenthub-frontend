import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { useUiStyle } from '../../../../hooks/useUiStyle.js';
import { usePlayfulDialogA11y } from '../../../ui/PlayfulDialogA11y.js';
import Button from '../../../ui/Button.jsx';
import { DISPLAY } from '../personality/personalityStyles.js';
import { PlayfulStar } from '../personality/PersonalityParts.jsx';
import { ArrowRightIcon, CloseIcon, LockIcon, PlayIcon } from '../personality/personalityIcons.jsx';
import { ArrowLeftIcon } from './arcadeIcons.jsx';
import coverMakolaModal from '../../../../assets/engagement-v2/arcade/makola-modal-cover.png';
import { ARCHETYPE, DETAILS, GAME_BY_ID } from './arcadeData.js';

const log = debug('ArcadeModals');
const xpWord = (uiStyle, s) => s.replace('{xp}', uiStyle === 'playful' ? 'XP' : 'pts');

const MODAL_EDGE =
  'shadow-[0_24px_64px_rgba(11,26,15,0.28)] playful:shadow-[6px_6px_0_rgba(28,42,33,0.45),0_24px_64px_rgba(11,26,15,0.28)]';

/* Modal shell: scrim rgba(11,26,15,.55), focus trap + Esc + restore via usePlayfulDialogA11y. */
const Shell = ({ labelId, onClose, className, children }) => {
  const ref = useRef(null);
  usePlayfulDialogA11y({ open: true, dialogRef: ref, onEscape: onClose, lockScroll: true });
  return createPortal(
    <div
      data-pf-portal=""
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-[#0b1a0f]/55 px-3 py-6 sm:py-[clamp(28px,4vh,60px)]"
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
        className={classNames(
          'relative w-full overflow-hidden rounded-[24px] bg-white outline-none',
          MODAL_EDGE,
          className
        )}
      >
        {children}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] border border-[rgba(28,42,33,0.1)] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)]"
        />
      </div>
    </div>,
    document.body
  );
};

const Sticker = ({ children }) => (
  <span className="hidden rounded-full border-[1.2px] border-solid border-[#1c2a21] bg-[#ffd86b] px-[11px] py-[5px] font-sans text-[11px] leading-[13px] font-bold whitespace-nowrap text-[#1c2a21] shadow-[2px_2px_0_#1c2a21] playful:inline-block">
    {children}
  </span>
);

const Pill = ({ children }) => (
  <span className="inline-flex h-[32px] items-center rounded-full border border-solid border-[#e1eae2] bg-white px-[14px] font-sans text-[13px] leading-[16px] font-semibold text-[#595959] max-lg:text-[12px]">
    {children}
  </span>
);

const Eyebrow = ({ children }) => (
  <p className="m-0 font-sans text-[11.5px] leading-[14px] font-bold tracking-[0.69px] text-[#387440] max-lg:text-[12px]">
    {children}
  </p>
);

/* PA-02 — game details (only Makola Haggle is drawn; other games reuse its layout with their own copy where known). */
export const GameDetailsModal = ({ gameId, onBack, onStart }) => {
  const { uiStyle } = useUiStyle();
  const game = GAME_BY_ID[gameId];
  const d = DETAILS[gameId] ?? DETAILS['makola-haggle'];
  const cover = gameId === 'makola-haggle' || !game ? coverMakolaModal : game.cover;
  log('details', { gameId });
  return (
    <Shell labelId="arcade-details-title" onClose={onBack} className="max-w-[920px]">
      <div className="relative h-[clamp(180px,17.4vw,300px)] w-full">
        <img src={cover} alt="" draggable="false" className="size-full object-cover" />
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#1c2a21]/60 via-transparent to-transparent"
        />
        <button
          type="button"
          aria-label="Close"
          onClick={onBack}
          className="absolute right-[16px] top-[16px] grid size-[40px] cursor-pointer place-items-center rounded-full border border-solid border-[#1c2a21]/[0.12] bg-white text-[#1c2a21] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440] playful:border-[1.5px] playful:border-[#1c2a21]"
        >
          <CloseIcon className="size-[18px]" />
        </button>
        <div className="absolute bottom-[20px] left-[28px] flex items-center gap-[8px]">
          <Sticker>{d.sticker}</Sticker>
          <span className="inline-flex h-[32px] items-center rounded-full bg-white px-[14px] font-sans text-[13px] leading-[16px] font-semibold text-[#595959] max-lg:text-[12px]">
            {d.category}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-[20px] p-[clamp(20px,2.3vw,40px)] pb-[24px]">
        <div className="flex flex-col gap-[12px]">
          <h2
            id="arcade-details-title"
            className={classNames(
              'm-0 font-sans text-[clamp(28px,2.31vw,40px)] leading-[1.1] font-semibold tracking-[-0.02em] text-[#1c2a21]',
              DISPLAY
            )}
          >
            {d.title}
          </h2>
          <div className="flex flex-wrap gap-[8px]">
            {d.chips.map((c) => (
              <Pill key={c}>{xpWord(uiStyle, c)}</Pill>
            ))}
          </div>
        </div>

        <section className="flex flex-col gap-[12px]">
          <Eyebrow>{d.howTitle}</Eyebrow>
          <ol className="m-0 grid list-none grid-cols-1 gap-[12px] p-0 sm:grid-cols-2">
            {d.steps.map(([t, b], i) => (
              <li
                key={t}
                className="flex items-start gap-[12px] rounded-[16px] border border-solid border-[#e1eae2] bg-[#f8f8f4] p-[14px]"
              >
                <span className="grid size-[28px] shrink-0 place-items-center rounded-full bg-[#1c2a21] font-sans text-[13px] leading-[16px] font-bold text-white">
                  {i + 1}
                </span>
                <span className="flex min-w-0 flex-col gap-[2px]">
                  <span className="font-sans text-[15px] leading-[19px] font-semibold text-[#1c2a21]">
                    {t}
                  </span>
                  <span className="font-sans text-[13.5px] leading-[19px] text-[#595959] max-lg:text-[14px]">
                    {b}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </section>

        <section className="flex flex-col gap-[12px]">
          <Eyebrow>{d.readsTitle}</Eyebrow>
          <ul className="m-0 grid list-none grid-cols-1 gap-[12px] p-0 sm:grid-cols-3">
            {d.reads.map(([t, b]) => (
              <li
                key={t}
                className="flex flex-col gap-[2px] rounded-[16px] border border-solid border-[#c1d4c4] bg-[#ebf1ec] p-[14px]"
              >
                <span className="font-sans text-[15px] leading-[19px] font-semibold text-[#1c2a21]">
                  {t}
                </span>
                <span className="font-sans text-[13.5px] leading-[19px] text-[#595959] max-lg:text-[14px]">
                  {b}
                </span>
              </li>
            ))}
          </ul>
          <p className="m-0 flex items-center gap-[8px] font-sans text-[13px] leading-[16px] font-medium text-[#595959] max-lg:text-[12px]">
            <LockIcon className="size-[14px] shrink-0 text-[#387440]" />
            {d.private}
          </p>
        </section>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-[12px] border-t border-solid border-[#e7e7e7] bg-white px-[clamp(20px,2.3vw,40px)] py-[16px]">
        <p className="m-0 font-sans text-[13px] leading-[16px] font-medium text-[#595959] max-lg:text-[12px]">
          {d.hint}
        </p>
        <div className="flex flex-wrap items-center gap-[12px]">
          <Button
            variant="tertiary-subtle"
            size="lg"
            leftIcon={<ArrowLeftIcon />}
            onClick={onBack}
            className="!border-[#c1d4c4] !text-[#165d3a]"
          >
            {d.back}
          </Button>
          <Button size="lg" rightIcon={<PlayIcon />} onClick={onStart}>
            {d.start}
          </Button>
        </div>
      </div>
    </Shell>
  );
};

/* PA-13 — three games played: "Your archetype is ready". */
export const ArchetypeModal = ({ played, onMore, onReveal }) => {
  const { uiStyle } = useUiStyle();
  const tiles = played
    .slice(0, 3)
    .map((id) => GAME_BY_ID[id])
    .filter(Boolean);
  log('archetype', { played });
  return (
    <Shell labelId="arcade-archetype-title" onClose={onMore} className="max-w-[720px]">
      <div className="relative flex flex-col items-center gap-[16px] bg-[#ebf1ec] px-[clamp(20px,2.3vw,40px)] pb-[28px] pt-[32px] text-center">
        <Sticker>{ARCHETYPE.sticker}</Sticker>
        <span className="font-sans text-[11.5px] leading-[14px] font-bold tracking-[0.69px] text-[#387440] playful:hidden max-lg:text-[12px]">
          {ARCHETYPE.sticker}
        </span>
        <h2
          id="arcade-archetype-title"
          className={classNames(
            'm-0 font-sans text-[clamp(30px,2.31vw,40px)] leading-[1.1] font-semibold tracking-[-0.02em] text-[#1c2a21]',
            DISPLAY
          )}
        >
          {ARCHETYPE.title}
        </h2>
        <p className="m-0 max-w-[560px] font-sans text-[16px] leading-[24px] text-[#595959]">
          {ARCHETYPE.text}
        </p>
        <div className="flex w-full flex-wrap items-start justify-center gap-[16px]">
          {tiles.map((g, i) => (
            <div
              key={g.id}
              className="flex w-[clamp(120px,24%,168px)] flex-col items-center gap-[8px]"
            >
              <img
                src={g.cover}
                alt={g.title}
                draggable="false"
                className="aspect-[4/3] w-full rounded-[16px] border-[1.5px] border-solid border-[#1c2a21] object-cover"
              />
              <span className="inline-flex items-center rounded-full border border-solid border-[#c1d4c4] bg-white px-[12px] py-[5px] font-sans text-[12.5px] leading-[15px] font-semibold text-[#165d3a]">
                {ARCHETYPE.chips[i]}
              </span>
            </div>
          ))}
        </div>
        <p className="m-0 rounded-full bg-white px-[16px] py-[8px] font-sans text-[13.5px] leading-[18px] font-medium text-[#1c2a21]">
          {xpWord(uiStyle, ARCHETYPE.xp)}
        </p>
        <PlayfulStar size={30} className="left-[28px] top-[24px]" />
        <PlayfulStar size={20} green className="right-[36px] top-[48px]" />
      </div>
      <div className="flex flex-wrap items-center justify-end gap-[12px] border-t border-solid border-[#e7e7e7] bg-white px-[clamp(20px,2.3vw,40px)] py-[16px]">
        <Button
          variant="tertiary-subtle"
          size="lg"
          onClick={onMore}
          className="!border-[#c1d4c4] !text-[#165d3a]"
        >
          {ARCHETYPE.more}
        </Button>
        <Button size="lg" rightIcon={<ArrowRightIcon />} onClick={onReveal}>
          {ARCHETYPE.reveal}
        </Button>
      </div>
    </Shell>
  );
};
