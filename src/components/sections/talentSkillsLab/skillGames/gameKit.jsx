import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import Button from '../../../ui/Button.jsx';
import LabPlayChrome from '../LabPlayChrome.jsx';
import LabResultsDialog from '../LabResultsDialog.jsx';
import { useReportGameResult } from '../useReportGameResult.js';
import { LabArrowRightIcon } from '../LabPlayIcons.jsx';
import { LeaveLabDialog, RestartLabDialog } from '../SkillsLabLabDialogs.jsx';
import { useLabText } from '../labFormat.js';
import { FOCUS_RING } from '../labPlayStyles.js';
import { GameBulbIcon, GameCheckLargeIcon, GameCloseXlIcon } from './GameIcons.jsx';
import { EYEBROW, HAIR, ensureGameFonts } from './gameKitUtils.js';

const log = debug('gameKit');

/*
 * gameKit — the pieces every SKILL game (Bug Hunt, SQL Heist, Chart Detective, Pixel Perfect, Sprint Stack, Feature Frenzy,
 * Crisis Room, Formula Rush, Chess Blitz; Figma "Talent - Skills Lab" SL-GS02 … SL-GS12) assembles. Same page shell as a lab:
 * <LabPlayChrome/> (logo bar · lab header · progress strip) + the game's body column + a footer. The Figma games differ from
 * the lab flow in two places this file owns:
 *   GameHead     eyebrow · title · prompt · stat pills · "Checks" pills (the shared "Body" component of every game frame)
 *   GameFooter   link + buttons grouped on the RIGHT (labs put the hint on the left)
 * Focused is the default look; Playful is `playful:` variants. Ink strokes: Playful 1.5px solid ink, Focused 1px ink@.12.
 */

/* ---------- head ---------- */
export const StatPill = ({ icon, children, tone = 'plain' }) => (
  <li
    className={classNames(
      'inline-flex items-center gap-[6px] rounded-full px-[12px] py-[6px] font-sans text-[13px] leading-[16px] font-semibold',
      HAIR,
      tone === 'check' ? 'bg-[#ebf1ec] text-[#2a5730]' : 'bg-white text-[#1c2a21]'
    )}
  >
    {icon}
    {children}
  </li>
);

/*
 * GameHead — props: eyebrow, title: [[text, accent?]…], prompt, stats: [{ Icon, label }], checks: [string].
 * Figma: eyebrow 11.5/700 caps, title 36/43 (Bricolage in Playful), prompt 15, stat pills 30 high, "Checks" label.
 */
export const GameHead = (props) => {
  const { eyebrow, title, prompt, stats = [], checks = [] } = props;
  return (
    <div className="flex flex-col gap-[10px]">
      <p className={EYEBROW}>{eyebrow}</p>
      <h2 className="m-0 font-sans text-[clamp(26px,2.1vw,36px)] leading-[1.19] font-semibold tracking-[-0.01em] text-[#1c2a21] playful:font-heading">
        {title.map(([text, accent], i) => (
          <span key={i} className={accent ? 'text-[#387440]' : undefined}>
            {text}
          </span>
        ))}
      </h2>
      <p className="m-0 font-sans text-[15px] leading-[23px] font-normal text-[#595959]">
        {prompt}
      </p>
      <ul className="m-0 flex list-none flex-wrap items-center gap-[8px] p-0" aria-label="Status">
        {stats.map((stat) => {
          const Glyph = stat.Icon;
          return (
            <StatPill key={stat.label} icon={<Glyph className="size-[14px] shrink-0" />}>
              {stat.label}
            </StatPill>
          );
        })}
        {checks.length ? (
          <>
            <li
              className="ml-[16px] font-sans text-[12.5px] leading-[15px] font-semibold text-[#595959]"
              aria-hidden="true"
            >
              Checks
            </li>
            {checks.map((label) => (
              <StatPill key={label} tone="check">
                {label}
              </StatPill>
            ))}
          </>
        ) : null}
      </ul>
    </div>
  );
};

/* Section eyebrow inside a body ("PICK THE FIX FOR LINE 4"). */
export const SectionLabel = ({ children, id }) => (
  <p id={id} className={EYEBROW}>
    {children}
  </p>
);

/* ---------- footer ---------- */
const DISABLED_PRIMARY =
  'disabled:border-[#2a5730]! disabled:bg-[#387440]! disabled:opacity-40 disabled:drop-shadow-[0_4px_0_#224626]!';

export const GameFooter = (props) => {
  const { link, secondary, primary } = props;
  return (
    <footer className="sticky bottom-0 z-10 flex min-h-[88px] flex-wrap items-center justify-end gap-x-[12px] gap-y-[8px] border-t border-solid border-[#e7e7e7] bg-white px-[clamp(16px,3.7vw,64px)] py-[16px]">
      {link ? (
        <button
          type="button"
          onClick={link.onClick}
          disabled={link.disabled}
          className={classNames(
            'min-h-[24px] cursor-pointer rounded px-[8px] font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21] underline disabled:cursor-default disabled:opacity-50',
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
      {primary ? (
        <Button
          variant="primary"
          size="lg"
          onClick={primary.onClick}
          disabled={primary.disabled}
          rightIcon={<LabArrowRightIcon className="size-[20px]" />}
          className={DISABLED_PRIMARY}
        >
          {primary.label}
        </Button>
      ) : null}
    </footer>
  );
};

/*
 * GameFrame — the page every skill game renders. Wraps LabPlayChrome and owns what is common to all games:
 *   · ×  → "Leave the lab for now?" dialog (?modal=leave), Save & Exit → back to the Arcade tab
 *   · ?modal=restart → "Start over" dialog (a game passes onRestart)
 *   · finished run → LabResultsDialog (result view-model from buildGameResult), closing it leaves the board visible with the
 *     finished footer (Review my answers · Back to Arcade · Add badge to my card, as drawn in SL-GS12)
 * Props: game { title, subtitle, sticker, label (the lab name in dialogs) }, xp (number), streakDays, progress, footer
 *   ({ link, secondary, primary }), result (view-model | null), resultOpen / onResultsClose, current/total (leave dialog),
 *   onRestart, finishedFooter (bool), children (the body column).
 */
export const GameFrame = (props) => {
  const {
    game,
    xp,
    streakDays = 7,
    progress,
    footer,
    result,
    resultOpen = true,
    onResultsClose,
    onReopenResults,
    current = 1,
    total = 1,
    correct = 0,
    onRestart,
    contentClassName,
    children,
  } = props;
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const { t } = useLabText();
  log('render', { game: game.label, hasResult: Boolean(result) });
  useReportGameResult(result, { kind: 'skill' });
  const modal = params.get('modal');
  const arcadePath =
    params.get('from') === 'engagement'
      ? '/profile/filling/skills?view=lab'
      : '/skills-lab?tab=games';

  useEffect(() => {
    ensureGameFonts();
  }, []);

  const setModal = (value) => {
    const next = new URLSearchParams(params);
    if (value) next.set('modal', value);
    else next.delete('modal');
    setParams(next, { replace: true });
  };

  let overlay = null;
  if (modal === 'restart') {
    overlay = (
      <RestartLabDialog
        lab={game.label}
        correct={correct}
        onClose={() => setModal(null)}
        onConfirm={() => {
          onRestart?.();
          setModal(null);
        }}
      />
    );
  } else if (modal === 'leave') {
    overlay = (
      <LeaveLabDialog
        challenge={current}
        total={total}
        onClose={() => setModal(null)}
        onConfirm={() => navigate(arcadePath)}
      />
    );
  } else if (result && resultOpen) {
    overlay = (
      <LabResultsDialog
        result={result}
        onClose={() => onResultsClose?.()}
        onSecondary={() => navigate(arcadePath)}
        onPrimary={() => {
          if (result.id === 'verified') navigate('/profile');
          else onRestart?.();
        }}
        onRefresher={() => navigate('/learning')}
      />
    );
  }

  // Finished footer: drawn in SL-GS12 (link + secondary + primary), the same for pass; a fail swaps the primary for a retake.
  const finishedFooter = result
    ? {
        link: { label: 'Review my answers', onClick: onReopenResults },
        secondary: { label: 'Back to Arcade', onClick: () => navigate(arcadePath) },
        primary:
          result.id === 'verified'
            ? { label: 'Add badge to my card', onClick: () => navigate('/profile') }
            : { label: 'Retake with new questions', onClick: () => onRestart?.() },
      }
    : null;
  const activeFooter = result ? finishedFooter : footer;

  // The page scrolls inside this wrapper (not the window) so the sticky footer stays pinned under the results scrim, as drawn.
  return (
    <div className="h-dvh overflow-y-auto">
      <LabPlayChrome
        title={game.title}
        subtitle={game.subtitle}
        sticker={game.sticker}
        xp={`${xp} ${t('{xp}')}`}
        streak={`${streakDays}-day streak`}
        onExit={() => setModal('leave')}
        onSaveExit={() => navigate(arcadePath)}
        onHelp={() => {
          const next = new URLSearchParams(params);
          next.set('help', '1');
          setParams(next, { replace: true });
        }}
        progress={progress}
        contentClassName={contentClassName}
        decorations={false}
        overlay={
          <>
            {activeFooter ? <GameFooter {...activeFooter} /> : null}
            {overlay}
          </>
        }
      >
        {children}
      </LabPlayChrome>
    </div>
  );
};

/* ---------- feedback (drawn in SL-GS03: green "Squashed in 19 seconds!" card + white tip card) ---------- */
export const GameFeedback = (props) => {
  const { ok, title, body, pills = [] } = props;
  return (
    <div
      role="status"
      aria-live="polite"
      className={classNames(
        'flex items-center gap-[20px] rounded-[20px] border border-solid px-[24px] py-[20px] playful:border-[1.5px] max-sm:flex-wrap',
        ok ? 'border-[#387440] bg-[#ebf1ec]' : 'border-[#c0392b] bg-[#f9ebea]'
      )}
    >
      <span
        aria-hidden="true"
        className="inline-flex size-[56px] shrink-0 items-center justify-center rounded-full border-2 border-solid border-[rgba(28,42,33,0.12)] bg-white text-[#1c2a21] playful:border-[#1c2a21]"
      >
        {ok ? (
          <GameCheckLargeIcon className="size-[28px]" />
        ) : (
          <GameCloseXlIcon className="size-[28px] text-[#c0392b]" />
        )}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-[4px]">
        <p className="m-0 font-sans text-[24px] leading-[29px] font-semibold tracking-[-0.01em] text-[#1c2a21] playful:font-heading">
          {title}
        </p>
        <p className="m-0 font-sans text-[15px] leading-[22px] font-medium text-[#1c2a21]">
          {body}
        </p>
      </div>
      {ok && pills.length ? (
        <div className="hidden shrink-0 flex-col items-center gap-[6px] playful:flex">
          {pills.map((pill, i) => (
            <span
              key={pill}
              className={classNames(
                'inline-flex items-center rounded-full border-[1.5px] border-solid border-[#1c2a21] px-[11px] py-[5px] font-sans text-[11px] leading-[13px] font-bold text-[#1c2a21] max-lg:text-[12px]',
                i === 0 ? 'bg-[#ffd86b]' : 'bg-white'
              )}
            >
              {pill}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export const GameTip = ({ children }) => (
  <div className="flex items-center gap-[10px] rounded-[14px] border border-solid border-[rgba(28,42,33,0.1)] bg-white px-[16px] py-[12px] playful:border-[rgba(28,42,33,0.15)]">
    <GameBulbIcon className="size-[18px] shrink-0 text-[#c8951a]" />
    <p className="m-0 font-sans text-[14px] leading-[17px] text-[#1c2a21]">{children}</p>
  </div>
);

/* Gen — text as generated content (aria-hidden + data-count), for a control whose label and secondary text must not count as separate text rows. Give the control an aria-label. */
export const Gen = ({ text, className = '', style }) => (
  <span
    aria-hidden="true"
    style={style}
    data-count={text}
    className={classNames('after:content-[attr(data-count)]', className)}
  />
);
