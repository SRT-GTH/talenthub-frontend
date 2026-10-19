import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import Button from '../../ui/Button.jsx';
import StyleSwitch from '../../ui/StyleSwitch.jsx';
import navHelp from '../../../assets/playful/nav-help.svg';
import gthLogo from '../../../assets/engagement/GTHLogo 1.svg';
import { StreakMark } from '../talentProfile/ProfileTabsUi.jsx';
import {
  LabArrowRightIcon,
  LabBulbIcon,
  LabCheckIcon,
  LabCloseIcon,
  LabCloseSmIcon,
  LabFlagIcon,
  LabStarIcon,
} from './LabPlayIcons.jsx';
import { DOODLE_STAR_PATH, FOCUS_RING } from './labPlayStyles.js';

const log = debug('LabPlayChrome');

/*
 * LabPlayChrome — the focused chrome shared by EVERY lab flow and every game (Figma "Talent - Skills Lab" SL-L05 …
 * SL-L18h, SL-GS*, SL-GP*; Playful 7851:1617 / Focused 8110:473758 are the reference). It knows nothing about any lab:
 * a lab or game passes its own children (the challenge column) and plain props. Build order top to bottom:
 *
 *   LabTopBar       logo · Style switch ("Switch Modes") · Save & Exit · Help · avatar          (nav, 90px)
 *   LabHeaderBar    dark green lab header: close ×, title, subtitle, sticker (Playful), XP pill, streak pill   (80px)
 *   LabProgressStrip count + summary · challenge dots · "Pass mark: 6 of 8"                       (72px)
 *   children        the challenge column (max 1040 wide, centred)
 *   LabFooterBar    hint link / "Hint used" on the left, primary action button on the right       (88px, sticky)
 *   overlay         results / confirm dialogs render here (scrim + dialog), the page behind stays visible.
 *
 * Props (all optional unless noted; a game can omit progress / footer):
 *   title* subtitle sticker                  lab header text; `sticker` is Playful-only ("PASS 6 = VERIFIED")
 *   xp (string "240 XP"/"240 pts"), streak   header pills, pre-formatted by the caller (see useLabText().t)
 *   userName userInitials                    avatar chip, defaults "Kofi A." / "KA"
 *   onExit onSaveExit onHelp                 close × / Save & Exit / Help handlers
 *   progress { countLabel, summary, dots:[{state:'ok'|'bad'|'now'|'todo', label}], passMark }
 *   footer   { hint, action }  hint = { mode:'link'|'used'|'none', prompt, linkLabel, usedLabel, cost, onClick, disabled }
 *                              action = { label, onClick, disabled, icon:true|false }   (Check answer / Next challenge)
 *   decorations                              Playful doodle stars beside the challenge column (default true)
 *   contentClassName                         extra classes for the column (games that need a different width)
 *   overlay                                  node rendered after the page (dialogs)
 */

/* ---------- top bar ---------- */
export const LabTopBar = ({
  userName = 'Kofi A.',
  userInitials = 'KA',
  onSaveExit,
  onHelp,
  className,
}) => (
  <header
    className={classNames(
      'flex w-full items-center justify-between gap-[12px] border-b border-solid border-[#e7e7e7] bg-[#f8f8f4]',
      'px-[clamp(16px,3.7vw,64px)] py-[clamp(6px,0.7vw,12px)] shadow-[0_1px_1px_rgba(27,36,44,0.12)]',
      className
    )}
  >
    <img
      src={gthLogo}
      alt="Ghana Talent Hub"
      draggable="false"
      className="block h-[40px] w-auto select-none md:h-[clamp(44px,3.82vw,66px)]"
    />
    <div className="flex items-center gap-[clamp(10px,1.4vw,24px)]">
      <StyleSwitch />
      {/* Figma keeps the (hidden) "Switch Modes" button's 162px slot between the style switch and Save & Exit. */}
      <span aria-hidden="true" className="hidden w-[clamp(0px,9.4vw,162px)] lg:block" />
      <button
        type="button"
        onClick={onSaveExit}
        className={classNames(
          'inline-flex min-h-[44px] items-center rounded font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-transparent underline decoration-[#2a5730] underline-offset-4 hover:opacity-80',
          'bg-[linear-gradient(135deg,#142916_0%,#2a5730_100%)] bg-clip-text',
          FOCUS_RING
        )}
      >
        Save &amp; Exit
      </button>
      <button
        type="button"
        onClick={onHelp}
        aria-label="Help"
        className={classNames(
          'hidden size-[36px] items-center justify-center rounded-[18px] border border-solid border-[#e2e8f0] bg-[#f8fafc] hover:bg-white md:inline-flex',
          FOCUS_RING
        )}
      >
        <img src={navHelp} alt="" aria-hidden="true" draggable="false" className="size-[16px]" />
      </button>
      <div className="inline-flex items-center gap-[7px] rounded-[10px] border border-solid border-[#c1d4c4] bg-[#fffefc] px-[8px] py-[8px] md:px-[16px]">
        <span
          aria-hidden="true"
          className="inline-flex size-[24px] shrink-0 items-center justify-center rounded-[12px] bg-[linear-gradient(135deg,#142916_0%,#2a5730_100%)] font-bold text-[10px] text-white max-lg:text-[12px]"
          style={{ fontFamily: "'Instrument Sans', sans-serif" }}
        >
          {userInitials}
        </span>
        <span className="font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#1c2a21] max-md:sr-only">
          {userName}
        </span>
      </div>
    </div>
  </header>
);

/* ---------- lab header ---------- */
const PILL =
  'inline-flex items-center gap-[5px] rounded-full border border-solid border-[rgba(28,42,33,0.12)] py-[7px] pr-[10px] pl-[8px] font-sans text-[13px] leading-[16px] font-bold text-white ' +
  'playful:border-[1.2px] playful:border-[#1c2a21] playful:shadow-[2px_2px_0_#1c2a21]';

export const LabHeaderBar = ({ title, subtitle, sticker, xp, streak, onExit }) => (
  <section
    aria-label="Lab"
    className="relative flex flex-wrap items-center gap-x-[clamp(12px,1.3vw,22px)] gap-y-[10px] bg-[#2a5730] px-[clamp(16px,3.7vw,64px)] py-[clamp(12px,0.95vw,16.5px)]"
  >
    <button
      type="button"
      onClick={onExit}
      aria-label="Close lab"
      className={classNames(
        'inline-flex size-[40px] shrink-0 items-center justify-center rounded-full bg-[rgba(255,255,255,0.12)] text-white hover:bg-[rgba(255,255,255,0.2)]',
        FOCUS_RING,
        'focus-visible:outline-white'
      )}
    >
      <LabCloseIcon className="size-[16px]" />
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
        className="hidden shrink-0 rotate-[3deg] rounded-[8px] border-[1.2px] border-solid border-[#1c2a21] bg-[#ffd86b] px-[11px] py-[5px] font-sans text-[12px] leading-[14px] font-bold tracking-[0.4px] whitespace-nowrap text-[#1c2a21] shadow-[2px_2px_0_#1c2a21] playful:inline-block"
      >
        {sticker}
      </span>
    ) : null}
    <div className="ml-auto flex shrink-0 items-center gap-[8px]">
      {xp ? (
        <span
          className={classNames(
            PILL,
            'bg-[#387440] playful:bg-[linear-gradient(90deg,#387440_0%,#7aa870_100%)]'
          )}
        >
          <LabStarIcon className="size-[15px]" />
          {xp}
        </span>
      ) : null}
      {streak ? (
        <span
          className={classNames(
            PILL,
            'bg-[linear-gradient(90deg,#f59638_0%,#c0392b_100%)] playful:min-h-[36px]'
          )}
        >
          <StreakMark className="size-[15px] shrink-0 playful:size-[26px]" />
          {streak}
        </span>
      ) : null}
    </div>
    {/* Playful header doodles (SL-L05: gold 16, gold 10, white 8) */}
    <span aria-hidden="true" className="pointer-events-none absolute inset-0 hidden xl:block">
      <span className="hidden playful:block">
        <svg
          viewBox="0 0 22 22"
          className="absolute top-[14px] right-[314px] size-[16px] text-[#ffd86b]"
        >
          <path d={DOODLE_STAR_PATH} fill="currentColor" />
        </svg>
        <svg
          viewBox="0 0 22 22"
          className="absolute top-[48px] right-[294px] size-[10px] text-[#ffd86b] opacity-90"
        >
          <path d={DOODLE_STAR_PATH} fill="currentColor" />
        </svg>
        <svg
          viewBox="0 0 22 22"
          className="absolute top-[44px] right-[352px] size-[8px] text-white opacity-60"
        >
          <path d={DOODLE_STAR_PATH} fill="currentColor" />
        </svg>
      </span>
    </span>
  </section>
);

/* ---------- progress strip ---------- */
const DOT_BASE =
  'inline-flex size-[26px] shrink-0 items-center justify-center rounded-full font-sans text-[12px] leading-[14px] min-[480px]:size-[30px]';
const DOT_TONE = {
  ok: 'bg-[#387440] text-white playful:shadow-[2px_2px_0_#1c2a21]',
  bad: 'border-[1.2px] border-solid border-[#c0392b] bg-[#f9ebea] text-[#c0392b] playful:shadow-[2px_2px_0_#1c2a21]',
  now: 'border border-solid border-[rgba(28,42,33,0.12)] bg-[#ffd86b] font-bold text-[#1c2a21] playful:border-[1.2px] playful:border-[#1c2a21] playful:shadow-[2px_2px_0_#1c2a21]',
  todo: 'border-[1.5px] border-solid border-[#e7e7e7] bg-white font-semibold text-[#737373]',
};
const DOT_NAME = {
  ok: 'correct',
  bad: 'to review',
  now: 'current',
  todo: 'not started',
};

export const LabProgressDot = ({ state, label }) => (
  <li
    className={classNames(DOT_BASE, DOT_TONE[state])}
    aria-label={`Challenge ${label}: ${DOT_NAME[state]}`}
    aria-current={state === 'now' ? 'step' : undefined}
  >
    {state === 'ok' ? <LabCheckIcon className="size-[15px]" /> : null}
    {state === 'bad' ? <LabCloseSmIcon className="size-[14px]" /> : null}
    {state === 'now' || state === 'todo' ? label : null}
  </li>
);

export const LabProgressStrip = ({ countLabel, summary, dots = [], passMark }) => (
  <section
    aria-label="Progress"
    className="relative flex flex-wrap items-center justify-between gap-x-[16px] gap-y-[10px] border-b border-solid border-[#e7e7e7] bg-white px-[clamp(16px,3.7vw,64px)] py-[clamp(10px,0.9vw,16px)] lg:min-h-[72px]"
  >
    <div className="flex min-w-0 flex-col gap-[2px]">
      <p className="m-0 font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
        {countLabel}
      </p>
      {summary ? (
        <p className="m-0 font-sans text-[12px] leading-[14px] font-medium text-[#595959]">
          {summary}
        </p>
      ) : null}
    </div>
    <ol
      className="m-0 flex list-none items-center gap-[6px] p-0 max-md:order-last max-md:w-full max-md:justify-center min-[480px]:gap-[10px] md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2"
      aria-label="Challenges"
    >
      {dots.map((dot, i) => (
        <LabProgressDot key={i} state={dot.state} label={dot.label} />
      ))}
    </ol>
    {passMark ? (
      <span className="inline-flex items-center gap-[5px] rounded-full bg-[#ebf1ec] py-[5px] pr-[10px] pl-[8px] font-sans text-[12px] leading-[14px] font-semibold text-[#387440] playful:border playful:border-solid playful:border-[rgba(28,42,33,0.35)]">
        <LabFlagIcon className="size-[14px]" />
        {passMark}
      </span>
    ) : null}
  </section>
);

/* ---------- footer ---------- */
const HintArea = ({ hint }) => {
  if (!hint || hint.mode === 'none') return <span />;
  return (
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
};

export const LabFooterBar = ({ hint, action }) => (
  <footer className="sticky bottom-0 z-10 flex min-h-[88px] flex-wrap items-center justify-between gap-x-[16px] gap-y-[8px] border-t border-solid border-[#e7e7e7] bg-white px-[clamp(16px,3.7vw,64px)] py-[12px]">
    <HintArea hint={hint} />
    {action ? (
      <Button
        variant="primary"
        size="md"
        disabled={action.disabled}
        onClick={action.onClick}
        rightIcon={
          action.icon === false ? undefined : <LabArrowRightIcon className="size-[20px]" />
        }
        className="ml-auto"
      >
        {action.label}
      </Button>
    ) : null}
  </footer>
);

/* ---------- page ---------- */
const LabPlayChrome = ({
  title,
  subtitle,
  sticker,
  xp,
  streak,
  userName,
  userInitials,
  onExit,
  onSaveExit,
  onHelp,
  progress,
  footer,
  decorations = true,
  contentClassName,
  overlay,
  children,
}) => {
  log('render', { title, hasProgress: Boolean(progress), hasFooter: Boolean(footer) });
  return (
    <div className="flex min-h-screen min-h-dvh flex-col bg-[#f7f8f4] playful:bg-[linear-gradient(180deg,#fbf6ea_0%,#f4f6ec_100%)]">
      <LabTopBar
        userName={userName}
        userInitials={userInitials}
        onSaveExit={onSaveExit}
        onHelp={onHelp}
      />
      <LabHeaderBar
        title={title}
        subtitle={subtitle}
        sticker={sticker}
        xp={xp}
        streak={streak}
        onExit={onExit}
      />
      {progress ? <LabProgressStrip {...progress} /> : null}
      <main className="flex-1 px-[clamp(16px,3.7vw,64px)] pt-[clamp(20px,2.3vw,40px)] pb-[clamp(24px,3.3vw,56px)]">
        <div
          className={classNames(
            'relative mx-auto flex w-full max-w-[1040px] flex-col gap-[20px]',
            contentClassName
          )}
        >
          {decorations ? (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 hidden xl:block"
            >
              <span className="hidden playful:block">
                <svg
                  viewBox="0 0 22 22"
                  className="absolute top-[30px] left-[-46px] size-[22px] text-[#ffd86b]"
                >
                  <path d={DOODLE_STAR_PATH} fill="currentColor" />
                </svg>
                <svg
                  viewBox="0 0 22 22"
                  className="absolute top-[62px] left-[-24px] size-[12px] text-[#ffd86b]"
                >
                  <path d={DOODLE_STAR_PATH} fill="currentColor" />
                </svg>
              </span>
            </span>
          ) : null}
          {children}
        </div>
      </main>
      {footer ? <LabFooterBar hint={footer.hint} action={footer.action} /> : null}
      {overlay}
    </div>
  );
};

export default LabPlayChrome;
