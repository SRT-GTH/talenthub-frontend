import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { classNames } from '../../../../../utils/classNames.js';
import { debug } from '../../../../../utils/debug.js';
import Button from '../../../../ui/Button.jsx';
import { LabTopBar } from '../../LabPlayChrome.jsx';
import { useLabText } from '../../labFormat.js';
import { DOODLE_STAR_PATH, FOCUS_RING } from '../../labPlayStyles.js';
import {
  PgArrowRightIcon,
  PgBoltIcon,
  PgCloseIcon,
  PgInfoCircleIcon,
} from './PersonalityIcons.jsx';

const log = debug('PersonalityChrome');

/*
 * PersonalityChrome — the page frame shared by every personality game (Figma "Talent - Skills Lab" SL-GP03 … SL-GP12;
 * Playful 7943:9243 / Focused 8110:496930 is the reference). It reuses LabPlayChrome's `LabTopBar` (logo · style switch ·
 * Save & Exit · Help · avatar) and re-draws the three bands the games need, because they differ from the lab flow's:
 *
 *   GameHeaderBar  dark green bar: close ×, "Personality game · <Name>", subtitle, Playful sticker (rotated, ink shelf),
 *                  Playful doodle stars, GOLD xp "HUD" pill with a bolt (the lab flow's is green + star)        (80px)
 *   GameProgress   "Round 2 of 4" · n flat segments (green done / gold now / grey todo) · right-aligned note   (64px)
 *   GameFooter     info icon + hint · [link] [secondary] [primary]                                            (88px, sticky)
 *
 * Props of <GameShell>:
 *   title* subtitle sticker           header text; `sticker` is Playful-only ("ROUND 2")
 *   xp, hud                           header pill value; `hud` 'green' (default, GP05–GP12) or 'gold' (Makola Haggle frames)
 *   (xp)                              header pill value with the {xp} token ("+20 {xp}" -> "+20 XP" / "+20 pts")
 *   progress { label, segments:['done'|'now'|'todo'], note, segmentWidth }   segmentWidth 140 (default) or 123 (Ludo)
 *   footer   { info, link:{label,onClick,disabled}, secondary:{label,onClick}, action:{label,onClick,disabled,icon} }
 *   overlay                           dialogs rendered after the page (the page behind stays visible)
 *   exitTo                            where × / Save & Exit / Pause go (default the Games tab)
 */

export const GAMES_TAB_PATH = '/skills-lab?tab=games';

const Star = ({ className }) => (
  <svg viewBox="0 0 22 22" aria-hidden="true" className={classNames('absolute', className)}>
    <path d={DOODLE_STAR_PATH} fill="currentColor" />
  </svg>
);

/* ---------- header ---------- */
export const GameHeaderBar = ({ title, subtitle, sticker, xp, hud = 'green', onExit }) => {
  const { t } = useLabText();
  return (
    <section
      aria-label="Game"
      className="relative flex flex-wrap items-center gap-x-[clamp(12px,1.3vw,22px)] gap-y-[10px] bg-[#2a5730] px-[clamp(16px,3.7vw,64px)] py-[clamp(12px,0.95vw,16.5px)]"
    >
      <button
        type="button"
        onClick={onExit}
        aria-label="Close game"
        className={classNames(
          'inline-flex size-[40px] shrink-0 items-center justify-center rounded-full bg-[rgba(255,255,255,0.12)] text-white hover:bg-[rgba(255,255,255,0.2)]',
          FOCUS_RING,
          'focus-visible:outline-white'
        )}
      >
        <PgCloseIcon className="size-[16px]" />
      </button>
      <div className="flex min-w-0 flex-col gap-[2px]">
        <h1 className="m-0 font-sans text-[clamp(19px,1.33vw,23px)] leading-[1.27] font-semibold text-white playful:font-heading">
          {title}
        </h1>
        {subtitle ? (
          <p className="m-0 font-sans text-[13px] leading-[16px] font-medium text-[rgba(255,255,255,0.8)] max-lg:text-[12px]">
            {subtitle}
          </p>
        ) : null}
      </div>
      {sticker ? (
        <span
          data-sticker=""
          className="hidden shrink-0 -rotate-[4deg] rounded-[8px] border-[1.2px] border-solid border-[#1c2a21] bg-[#ffd86b] px-[11px] py-[5px] font-sans text-[12px] leading-[14px] font-bold tracking-[0.4px] whitespace-nowrap text-[#1c2a21] shadow-[2px_2px_0_#1c2a21] playful:inline-block"
        >
          {sticker}
        </span>
      ) : null}
      {xp ? (
        <span
          className={classNames(
            'ml-auto inline-flex shrink-0 items-center gap-[6px] rounded-full px-[12px] py-[7px] font-sans text-[14px] leading-[17px] font-bold',
            hud === 'gold' ? 'bg-[#ffd86b] text-[#1c2a21]' : 'bg-[#387440] text-white',
            'border border-solid border-[rgba(28,42,33,0.12)] playful:border-[1.5px] playful:border-[#1c2a21]'
          )}
        >
          <PgBoltIcon className="size-[16px]" />
          {t(xp)}
        </span>
      ) : null}
      {/* Playful header doodles (Figma: gold 16, green 8, green 7) */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 hidden xl:block">
        <span className="hidden playful:block">
          <Star className="top-[14px] right-[332px] size-[16px] text-[#ffd86b]" />
          <Star className="top-[46px] right-[370px] size-[8px] text-[#387440]" />
          <Star className="top-[42px] right-[311px] size-[7px] text-[#387440]" />
        </span>
      </span>
    </section>
  );
};

/* ---------- progress ---------- */
const SEG_TONE = { done: 'bg-[#387440]', now: 'bg-[#c8951a]', todo: 'bg-[#e5e5e0]' };

export const GameProgress = ({ label, segments = [], note, segmentWidth = 140 }) => (
  <section
    aria-label="Progress"
    className="flex flex-wrap items-center gap-x-[16px] gap-y-[10px] border-b border-solid border-[#e7e7e7] bg-white px-[clamp(16px,3.7vw,64px)] py-[clamp(10px,1.1vw,19px)] lg:min-h-[64px]"
  >
    <p className="m-0 font-sans text-[15px] leading-[18px] font-semibold whitespace-nowrap text-[#1c2a21] lg:w-[calc(176px-16px)]">
      {label}
    </p>
    <ol
      aria-label="Steps"
      className="m-0 flex min-w-0 list-none gap-[4px] p-0 max-md:order-last max-md:w-full md:flex-1"
      style={{ maxWidth: segments.length * segmentWidth + (segments.length - 1) * 4 }}
    >
      {segments.map((state, i) => (
        <li
          key={i}
          aria-label={`Step ${i + 1}: ${state === 'done' ? 'done' : state === 'now' ? 'current' : 'not started'}`}
          aria-current={state === 'now' ? 'step' : undefined}
          className={classNames('h-[8px] min-w-0 flex-1 rounded-[4px]', SEG_TONE[state])}
        />
      ))}
    </ol>
    {note ? (
      <p className="m-0 ml-auto font-sans text-[13px] leading-[16px] font-medium text-[#595959] max-lg:text-[12px]">
        {note}
      </p>
    ) : null}
  </section>
);

/* ---------- footer ---------- */
export const GameFooter = ({ info, link, secondary, action }) => (
  <footer className="sticky bottom-0 z-10 flex min-h-[88px] flex-wrap items-center justify-between gap-x-[16px] gap-y-[8px] border-t border-solid border-[#e7e7e7] bg-white px-[clamp(16px,3.7vw,64px)] py-[12px]">
    <p className="m-0 inline-flex min-w-0 items-start gap-[8px] font-sans text-[13px] leading-[16px] font-medium text-[#595959] max-lg:text-[12px]">
      <PgInfoCircleIcon className="mt-[1px] size-[14px] shrink-0 text-[#595959]" />
      <span>{info}</span>
    </p>
    <div className="ml-auto flex flex-wrap items-center justify-end gap-[12px]">
      {link ? (
        <button
          type="button"
          onClick={link.onClick}
          disabled={link.disabled}
          className={classNames(
            'min-h-[24px] cursor-pointer rounded px-[8px] font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21] underline disabled:cursor-default',
            FOCUS_RING
          )}
        >
          {link.label}
        </button>
      ) : null}
      {secondary ? (
        <Button
          variant="tertiary"
          size="lg"
          onClick={secondary.onClick}
          disabled={secondary.disabled}
        >
          {secondary.label}
        </Button>
      ) : null}
      {action ? (
        <Button
          variant="primary"
          size="lg"
          disabled={action.disabled}
          onClick={action.onClick}
          rightIcon={
            action.icon === false ? undefined : <PgArrowRightIcon className="size-[20px]" />
          }
        >
          {action.label}
        </Button>
      ) : null}
    </div>
  </footer>
);

/* ---------- page ---------- */
const GameShell = ({
  title,
  subtitle,
  sticker,
  xp,
  hud,
  progress,
  footer,
  overlay,
  exitTo = GAMES_TAB_PATH,
  contentClassName,
  children,
}) => {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  useEffect(() => {
    log('mount', { title });
  }, [title]);
  const exit = () => {
    log('exit', exitTo);
    navigate(exitTo);
  };
  const openHelp = () => {
    const next = new URLSearchParams(params);
    next.set('help', '1');
    setParams(next, { replace: true });
  };
  return (
    <div className="flex min-h-screen min-h-dvh flex-col bg-[#f7f8f4] playful:bg-[linear-gradient(180deg,#fbf6ea_0%,#f4f6ec_100%)]">
      <LabTopBar onSaveExit={exit} onHelp={openHelp} />
      <GameHeaderBar
        title={title}
        subtitle={subtitle}
        sticker={sticker}
        xp={xp}
        hud={hud}
        onExit={exit}
      />
      {progress ? <GameProgress {...progress} /> : null}
      <main className="flex-1 px-[clamp(16px,3.7vw,64px)] pt-[clamp(20px,2.3vw,40px)] pb-[clamp(24px,2.8vw,48px)]">
        <div
          className={classNames(
            'mx-auto flex w-full max-w-[1040px] flex-col gap-[22px]',
            contentClassName
          )}
        >
          {children}
        </div>
      </main>
      {footer ? <GameFooter {...footer} /> : null}
      {overlay}
    </div>
  );
};

export default GameShell;
