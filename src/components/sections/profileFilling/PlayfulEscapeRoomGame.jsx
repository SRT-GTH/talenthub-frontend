import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { debug } from '../../../utils/debug.js';
import { usePlayfulDialogA11y } from '../../ui/PlayfulDialogA11y.js';
import { ClockIcon, SuccessCheckIcon } from '../../shared/assets.jsx';
import escapeRoomThumb from '../../../assets/games/game-store/escape-room-thumb.png';
import saveIconUrl from '../../../assets/playful/games/save-icon.svg';
import {
  PLAYFUL_BUBBLE_SHAPES,
  PLAYFUL_FRAME,
  PLAYFUL_STAGE_BUBBLES,
  formatPlayfulTime,
} from './PlayfulEscapeRoomData.js';

const log = debug('PlayfulEscapeRoomGame');

/*
 * PlayfulEscapeRoomGame — Playful look of the escape-room interface (Figma "Game Interface –
 * Stage 2/3/4": 7873:69410 / 69773 / 70136). Rendered by EscapeRoomGame when uiStyle ===
 * 'playful'. Same props (open, onExit) plus `stages` (the Focused game's stage copy — the text
 * is identical in both looks, so it is passed in rather than duplicated).
 *
 * Desktop (>= 1024px): the 1728x1117 frame is drawn "cover"-scaled (art + speech bubbles keep the
 * exact Figma geometry); the chrome (title, Save & Exit, timer, narrator, stage pill) is laid out
 * at the same proportions but with floors (>= 12px text, >= 44px controls) so it stays usable at
 * 1024. Phones/tablets (< 1024px): bubbles become a full-width answer stack in the thumb zone.
 *
 * Keyboard: Tab through the answers, Arrow keys move between them, A-D pick an answer directly
 * (the "Use arrow keys to navigate through the game" hint from the Game details footer).
 *
 * ⚠️ ASSUMPTIONS: stage 1 has no Playful frame (bubbles use the Focused percentage anchors with a
 * tail-less version of the same glass look); the "You made it out" end screen is restyled only;
 * bubble keyboard-focus mirrors the Figma hover state (light glass).
 */

const GAME_DURATION_SECONDS = 5 * 60;
const COMPACT_BELOW = 1024;
const UI = 'font-[family-name:var(--pf-font-ui)]';

const CHROME_GLASS =
  'border border-[rgba(198,194,194,0.25)] bg-[rgba(28,42,33,0.43)] backdrop-blur-[3.05px]';

// Figma's text boxes are sized for SF Pro Rounded; when the fallback face is wider, shrink the
// label (never wrap, never clip) so it always stays inside its speech bubble.
const useFitFont = (ref, targetWidth, base, deps) => {
  const [fs, setFs] = useState(base);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const fit = () => {
      el.style.fontSize = `${base}px`;
      const natural = el.scrollWidth;
      const next =
        natural > targetWidth ? Math.floor(base * (targetWidth / natural) * 10) / 10 : base;
      el.style.fontSize = '';
      setFs(next);
    };
    fit();
    document.fonts?.ready?.then(fit);
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return fs;
};

const Bubble = ({ spec, choice, onSelect }) => {
  const textRef = useRef(null);
  const fs = useFitFont(textRef, spec.tw, 24, [spec.tw, choice.text]);
  const shape = PLAYFUL_BUBBLE_SHAPES[spec.shape];
  const rotated = spec.rot !== 0;
  const iw = rotated ? spec.vh : spec.vw;
  const ih = rotated ? spec.vw : spec.vh;
  return (
    <button
      type="button"
      data-choice={choice.letter}
      onClick={() => onSelect(choice)}
      className="pf-bubble absolute block cursor-pointer rounded-[20px] p-0 text-left outline-none"
      style={{ left: spec.x, top: spec.y, width: spec.vw, height: spec.vh }}
    >
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 block"
        style={{
          width: iw,
          height: ih,
          transform: `translate(-50%,-50%) rotate(${spec.rot}deg)${spec.flip ? ' scaleY(-1)' : ''}`,
        }}
      >
        <span
          className="absolute left-0 top-0 block"
          style={{
            width: shape.w,
            height: shape.h,
            backdropFilter: 'blur(5px)',
            clipPath: `path('${shape.d}')`,
          }}
        />
        <svg
          width={shape.w}
          height={shape.h}
          viewBox={`0 0 ${shape.w} ${shape.h}`}
          className="absolute left-0 top-0 overflow-visible"
          fill="none"
        >
          <path
            d={shape.d}
            className="pf-bubble-fill fill-[rgba(28,42,33,0.36)] motion-safe:transition-[fill] forced-colors:stroke-[CanvasText]"
          />
        </svg>
      </span>
      <span
        ref={textRef}
        className={`pf-gradtext pf-bubble-text absolute whitespace-nowrap leading-[normal] tracking-[0.1px]`}
        style={{
          left: spec.tx - spec.x,
          top: spec.cy - spec.y,
          fontSize: fs,
          transform: 'translateY(-50%)',
        }}
      >
        {choice.letter}. {choice.text}
      </span>
    </button>
  );
};

// Stage 1 (no Playful frame): same glass look, anchored by the Focused percentages.
const GenericBubble = ({ choice, onSelect }) => (
  <button
    type="button"
    data-choice={choice.letter}
    onClick={() => onSelect(choice)}
    className="pf-bubble absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer whitespace-nowrap rounded-[20px] bg-[rgba(28,42,33,0.36)] px-[26px] py-[14px] text-left backdrop-blur-[5px] outline-none motion-safe:transition-colors hover:bg-[rgba(255,255,255,0.6)] focus-visible:bg-[rgba(255,255,255,0.6)] forced-colors:border forced-colors:border-[CanvasText]"
    style={{
      left: `${parseFloat(choice.position.left)}%`,
      top: `${parseFloat(choice.position.top)}%`,
    }}
  >
    <span className="pf-gradtext pf-bubble-text text-[24px] tracking-[0.1px]">
      {choice.letter}. {choice.text}
    </span>
  </button>
);

const PlayfulEscapeRoomGame = ({ open, onExit, stages }) => {
  const [stageIndex, setStageIndex] = useState(0);
  const [complete, setComplete] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(GAME_DURATION_SECONDS);
  const [size, setSize] = useState({ w: 1728, h: 1117 });
  const rootRef = useRef(null);
  const dialogRef = useRef(null);
  const intervalRef = useRef(null);
  const boardRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    log('open');
    setStageIndex(0);
    setComplete(false);
    setSecondsLeft(GAME_DURATION_SECONDS);
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => {
      clearInterval(intervalRef.current);
      log('close');
    };
  }, [open]);

  useLayoutEffect(() => {
    if (!open) return undefined;
    const el = rootRef.current;
    if (!el) return undefined;
    const measure = () => {
      const next = { w: el.clientWidth, h: el.clientHeight };
      log('layout', next);
      setSize((prev) => (prev.w === next.w && prev.h === next.h ? prev : next));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [open, complete]);

  const firstChoice = () => boardRef.current?.querySelector('[data-choice]');
  usePlayfulDialogA11y({
    open,
    dialogRef,
    onEscape: onExit,
    initialFocus: () => firstChoice() ?? dialogRef.current,
  });

  // New stage -> focus its first answer so keyboard / screen-reader users continue in place.
  useEffect(() => {
    if (open && stageIndex > 0) firstChoice()?.focus({ preventScroll: true });
  }, [stageIndex, open]);

  const handleSelect = useCallback(
    (choice) => {
      log('branch', { stage: stageIndex + 1, choiceSelected: choice.letter });
      if (stageIndex < stages.length - 1) {
        setStageIndex((i) => i + 1);
      } else {
        clearInterval(intervalRef.current);
        setComplete(true);
      }
    },
    [stageIndex, stages.length]
  );

  if (!open) return null;

  const stage = stages[stageIndex];
  const stageNumber = stageIndex + 1;
  const compact = size.w < COMPACT_BELOW;
  const s = Math.max(size.w / PLAYFUL_FRAME.w, size.h / PLAYFUL_FRAME.h);
  const f = (n, min = 0) => Math.max(min, Math.round(n * s * 100) / 100);
  const specs = PLAYFUL_STAGE_BUBBLES[stageNumber];

  const onBoardKey = (e) => {
    const items = Array.from(boardRef.current?.querySelectorAll('[data-choice]') ?? []);
    if (items.length === 0 || e.altKey || e.ctrlKey || e.metaKey) return;
    const i = items.indexOf(document.activeElement);
    const key = e.key.length === 1 ? e.key.toUpperCase() : e.key;
    if (['ArrowRight', 'ArrowDown'].includes(key)) {
      e.preventDefault();
      items[(i + 1 + items.length) % items.length].focus();
    } else if (['ArrowLeft', 'ArrowUp'].includes(key)) {
      e.preventDefault();
      items[(i - 1 + items.length) % items.length].focus();
    } else if (/^[A-D]$/.test(key)) {
      const target = items.find((b) => b.dataset.choice === key);
      if (target) {
        e.preventDefault();
        log('branch', { hotkey: key });
        target.click();
      }
    }
  };

  const titleId = 'pf-escape-room-title';

  const saveButton = (
    <button
      type="button"
      onClick={onExit}
      className="flex shrink-0 items-center justify-center rounded-[10px] border-x-2 border-b-2 border-t border-[#967014] bg-[#c8951a] [filter:drop-shadow(0_10px_12px_rgba(28,42,33,0.06))_drop-shadow(5px_5px_0_rgba(28,42,33,0.55))] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-white forced-colors:border-[CanvasText] max-lg:[filter:none]"
      style={{
        height: compact ? 44 : f(48, 44),
        gap: 8,
        paddingInline: compact ? 14 : f(28, 16),
      }}
    >
      <img src={saveIconUrl} alt="" aria-hidden="true" className="size-[16px] " />
      <span
        className="pf-gradtext font-sans font-bold leading-[24px] tracking-[0.1px]"
        style={{ fontSize: compact ? 14 : f(14, 14) }}
      >
        Save &amp; Exit
      </span>
    </button>
  );

  return createPortal(
    <div data-pf-portal className="fixed inset-0 z-[60] bg-black">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="size-full outline-none"
      >
        {complete ? (
          <div
            ref={rootRef}
            className="flex size-full flex-col items-center justify-center gap-[16px] bg-[#142916] px-6 text-center"
          >
            <SuccessCheckIcon />
            <h2 id={titleId} className="font-display text-[28px] text-white">
              You made it out ✅
            </h2>
            <p className="max-w-[420px] font-sans text-[15px] text-[#ebf1ec]">
              Nice work — your choices in there have been noted. Head back to your Talent Profile
              Panel and confirm your Personality section whenever you&apos;re ready.
            </p>
            <button
              type="button"
              onClick={onExit}
              className="mt-[8px] min-h-11 rounded-[10px] border-x-2 border-b-2 border-t border-[#2a5730] bg-[#387440] px-[24px] py-[10px] font-sans text-[14px] font-bold text-[#fef1e7] [filter:drop-shadow(5px_5px_0_rgba(28,42,33,0.55))] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              Close
            </button>
          </div>
        ) : (
          <div
            ref={rootRef}
            onKeyDown={onBoardKey}
            className="relative size-full overflow-hidden bg-[#142916]"
          >
            {/* Scene art + speech bubbles (design frame, cover-scaled) */}
            <div
              ref={boardRef}
              className={compact ? 'absolute inset-0' : 'absolute left-1/2 top-1/2'}
              style={
                compact
                  ? undefined
                  : {
                      width: PLAYFUL_FRAME.w,
                      height: PLAYFUL_FRAME.h,
                      transform: `translate(-50%,-50%) scale(${s})`,
                      transformOrigin: 'center',
                    }
              }
            >
              <img
                src={stage.background}
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 size-full object-cover"
              />
              {compact ? (
                <div
                  role="group"
                  aria-label="Choices"
                  className="absolute inset-x-0 bottom-0 flex flex-col gap-2 bg-linear-to-t from-black/80 via-black/50 to-transparent px-3 pb-[max(12px,env(safe-area-inset-bottom))] pt-10"
                >
                  {stage.choices.map((choice) => (
                    <button
                      key={choice.letter}
                      type="button"
                      data-choice={choice.letter}
                      onClick={() => handleSelect(choice)}
                      className="pf-bubble min-h-12 w-full rounded-[20px] border border-[rgba(198,194,194,0.25)] bg-[rgba(28,42,33,0.36)] px-5 py-3 text-left backdrop-blur-[5px] outline-none hover:bg-[rgba(255,255,255,0.6)] focus-visible:bg-[rgba(255,255,255,0.6)]"
                    >
                      <span className="pf-gradtext pf-bubble-text text-[16px] leading-snug tracking-[0.1px]">
                        {choice.letter}. {choice.text}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div role="group" aria-label="Choices" className="absolute inset-0">
                  {stage.choices.map((choice) => {
                    const spec = specs?.find((b) => b.letter === choice.letter);
                    return spec ? (
                      <Bubble
                        key={choice.letter}
                        spec={spec}
                        choice={choice}
                        onSelect={handleSelect}
                      />
                    ) : (
                      <GenericBubble key={choice.letter} choice={choice} onSelect={handleSelect} />
                    );
                  })}
                </div>
              )}
            </div>

            {/* Chrome: title, Save & Exit, timer, narrator, stage pill */}
            <div
              className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between"
              style={{
                paddingInline: compact ? 12 : f(54, 16),
                paddingTop: compact ? 12 : f(44, 16),
              }}
            >
              <div className="flex items-center gap-[12px]">
                <img
                  src={escapeRoomThumb}
                  alt=""
                  aria-hidden="true"
                  className="rounded-full object-cover shadow-[0px_4px_20.1px_4px_rgba(56,116,64,0.23)]"
                  style={{
                    width: compact ? 36 : f(40, 32),
                    height: compact ? 36 : f(40, 32),
                  }}
                />
                <h2
                  id={titleId}
                  className={`pf-gradtext ${UI} font-semibold max-[420px]:sr-only`}
                  style={{ fontSize: compact ? 16 : f(20, 16) }}
                >
                  The Escape Room
                </h2>
              </div>
              <div className="pointer-events-auto">{saveButton}</div>
            </div>

            <div
              className={`pointer-events-none absolute flex items-center rounded-full ${CHROME_GLASS} ${
                compact ? 'right-3' : 'left-1/2 -translate-x-1/2'
              }`}
              style={{
                top: compact ? 12 + 44 + 8 : f(44, 16),
                gap: 8,
                paddingInline: compact ? 14 : f(24, 14),
                paddingBlock: compact ? 8 : f(16, 8),
              }}
            >
              <span
                className="flex text-[#e8f2ed]"
                style={{ width: compact ? 18 : f(24, 18), height: compact ? 18 : f(24, 18) }}
              >
                <ClockIcon className="size-full" />
              </span>
              <span
                role="timer"
                aria-label={`Time left ${formatPlayfulTime(secondsLeft)}`}
                className="pf-gradtext font-semibold tabular-nums tracking-[0.1px]"
                style={{ fontSize: compact ? 16 : f(22, 16) }}
              >
                {formatPlayfulTime(secondsLeft)}
              </span>
            </div>

            <p
              aria-live="polite"
              className={`pointer-events-none absolute left-1/2 -translate-x-1/2 rounded-[100px] text-center font-medium tracking-[0.1px] text-[#e8f2ed] ${CHROME_GLASS} ${
                compact ? 'w-[calc(100%-24px)] rounded-[20px]' : 'whitespace-nowrap'
              }`}
              style={{
                top: compact ? 12 + 44 + 8 + 44 + 12 : f(152, 56),
                fontSize: compact ? 16 : f(24, 14),
                paddingInline: compact ? 16 : f(26, 14),
                paddingBlock: compact ? 10 : f(14, 8),
              }}
            >
              {stage.narrator}
            </p>

            <p
              className={`pointer-events-none absolute rounded-[100px] font-medium tracking-[0.1px] text-[#e8f2ed] ${CHROME_GLASS} ${
                compact ? 'left-3' : ''
              }`}
              style={
                compact
                  ? { top: 12 + 44 + 8, fontSize: 13, paddingInline: 12, paddingBlock: 8 }
                  : {
                      right: f(54, 16),
                      bottom: f(20, 12),
                      fontSize: f(18, 12),
                      paddingInline: f(26, 14),
                      paddingBlock: f(12, 6),
                    }
              }
            >
              {stage.label}
            </p>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default PlayfulEscapeRoomGame;
