import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { debug } from '../../../utils/debug.js';
import { useUiStyle } from '../../../hooks/useUiStyle.js';
import vibeRadioOn from '../../../assets/playful/vibe-radio-on.svg';
import vibeInfo from '../../../assets/playful/vibe-info.svg';
import vibeStar from '../../../assets/playful/vibe-star.svg';
import vibeIconSmile from '../../../assets/playful/vibe-icon-smile.svg';
import vibeIconSuitcase from '../../../assets/playful/vibe-icon-suitcase.svg';

const log = debug('PickYourVibeModal');

/*
 * PickYourVibeModal — first-visit "Pick your vibe" dialog.
 * Figma 7883:86839 (Playful selected) / 7883:87151 (Focused selected); modal node
 * 7883:87077 / 7883:87389 (760px, r28, 1.5px ink@55%, soft + 5px hard shelf shadow).
 *
 * Behaviour (wiki/playful-mode.md):
 *   - mounted by CareerBuddySection for the talent role only, shown while `!vibeChosen`
 *   - selecting a card only moves the selection (nothing is applied until confirm)
 *   - "Keep <Selected>" -> markVibeChosen(selected);  "Not now" / Esc -> markVibeChosen()
 *     (keeps the default style, stops asking)
 *
 * Accessibility: role="dialog" aria-modal, labelled + described; the two cards are
 * NATIVE radio inputs inside a role="radiogroup" (arrow keys / Space for free);
 * Tab is trapped inside the dialog, the app root is `inert` behind it, focus lands on
 * the selected radio and returns to the previously focused element on close.
 * The dialog uses its Figma look regardless of the stored style, so it never depends
 * on the `playful:` variant (it is only ever shown to talent first-time visitors).
 */

// Optical size is left on auto: Figma's metadata says opsz 14, but the rendered frames match
// opsz = font-size (44px headline measures 740px in Figma, 739px at opsz 44 here).
const DISPLAY = "font-[family-name:var(--pf-font-display)] [font-variation-settings:'wdth'_100]";

const STICKER =
  'inline-flex items-center rounded-full border-[1.2px] border-solid border-[#1c2a21] px-[11px] py-[5px] font-sans text-[11px] font-bold leading-[normal] whitespace-nowrap text-[#1c2a21] shadow-[2px_2px_0_#1c2a21]';

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])';

const OPTIONS = [
  {
    id: 'playful',
    name: 'Playful',
    description: 'Stickers, bold colour, XP and little celebrations.',
    icon: vibeIconSmile,
    tileClass: 'bg-[#387440]',
  },
  {
    id: 'focused',
    name: 'Focused',
    description: 'Calm colours, no stickers, quieter wording.',
    icon: vibeIconSuitcase,
    tileClass: 'bg-[#ebf1ec]',
  },
];

const PlayfulPreview = () => (
  <div
    aria-hidden="true"
    className="relative flex flex-col gap-[10px] overflow-clip rounded-[16px] bg-[#fbf4e0] p-[16px]"
  >
    <div className="flex items-start">
      <div className="rounded-[12px] bg-[rgba(229,229,229,0.5)] px-[12px] py-[8px] font-sans text-[12.5px] leading-[15px] text-[#1c2a21]">
        Hey! Ready to build your profile?
      </div>
    </div>
    <div className="flex items-start justify-end">
      <div className="rounded-[12px] bg-[#32683a] px-[12px] py-[8px] font-sans text-[12.5px] leading-[15px] text-white">
        Let&apos;s go
      </div>
    </div>
    <div className="flex items-center gap-[8px]">
      <span className={`${STICKER} rotate-[4deg] bg-[#ffd86b]`}>+20 XP</span>
      <span className={`${STICKER} -rotate-3 bg-[#c1d4c4]`}>SECTION DONE</span>
    </div>
    <img
      src={vibeStar}
      alt=""
      draggable="false"
      className="absolute right-[18px] top-[8px] size-[22px] max-[340px]:hidden"
    />
  </div>
);

const FocusedPreview = () => (
  <div
    aria-hidden="true"
    className="flex flex-col gap-[10px] overflow-clip rounded-[16px] bg-[#f8f8f4] p-[16px]"
  >
    <div className="flex items-start">
      <div className="py-[8px] pr-[12px] font-sans text-[12.5px] leading-[15px] text-[#1c2a21]">
        Hey! Ready to build your profile?
      </div>
    </div>
    <div className="flex items-start justify-end">
      <div className="rounded-[12px] bg-white px-[12px] py-[8px] font-sans text-[12.5px] leading-[15px] text-[#1c2a21] shadow-[0_2px_3px_rgba(28,42,33,0.08)]">
        Let&apos;s go
      </div>
    </div>
    <div className="flex items-center">
      <span className="inline-flex h-[32px] items-center rounded-full border border-solid border-[#c1d4c4] bg-[#ebf1ec] px-[14px] font-sans text-[13px] font-semibold leading-[normal] text-[#387440]">
        Section complete
      </span>
    </div>
  </div>
);

const PickYourVibeModal = ({ open }) => {
  const { uiStyle, markVibeChosen } = useUiStyle();
  const [selected, setSelected] = useState(uiStyle);
  const dialogRef = useRef(null);
  const radioRefs = useRef({});
  const titleId = useId();
  const descId = useId();
  const noteId = useId();

  const dismiss = useCallback(() => {
    log('dispatch', { action: 'not-now' });
    markVibeChosen();
  }, [markVibeChosen]);

  const confirm = useCallback(() => {
    log('dispatch', { action: 'keep', selected });
    markVibeChosen(selected);
  }, [markVibeChosen, selected]);

  // Mount/unmount side effects: inert background, scroll lock, focus in + restore.
  useEffect(() => {
    if (!open) return undefined;
    log('mount', { stored: uiStyle });
    setSelected(uiStyle);
    const previouslyFocused = document.activeElement;
    const appRoot = document.getElementById('root');
    const hadInert = appRoot?.hasAttribute('inert');
    if (appRoot) appRoot.setAttribute('inert', '');
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    const focusTimer = window.setTimeout(() => {
      radioRefs.current[uiStyle]?.focus();
    }, 0);
    return () => {
      window.clearTimeout(focusTimer);
      if (appRoot && !hadInert) appRoot.removeAttribute('inert');
      document.body.style.overflow = overflow;
      if (previouslyFocused instanceof HTMLElement && document.contains(previouslyFocused)) {
        previouslyFocused.focus();
      }
      log('unmount');
    };
    // `uiStyle` only seeds the initial selection; re-running on a change would reset it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const onKeyDown = (event) => {
    if (event.key === 'Escape') {
      event.stopPropagation();
      dismiss();
      return;
    }
    if (event.key !== 'Tab') return;
    const nodes = [...(dialogRef.current?.querySelectorAll(FOCUSABLE) ?? [])].filter(
      (node) =>
        (node.offsetParent !== null || node === document.activeElement) &&
        // a native radio group is ONE tab stop - only the checked radio counts
        !(node.type === 'radio' && !node.checked)
    );
    if (nodes.length === 0) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div aria-hidden="true" className="absolute inset-0 bg-[#1c2a21]/60" />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        onKeyDown={onKeyDown}
        className="relative flex max-h-full w-full max-w-[760px] flex-col gap-[24px] overflow-y-auto rounded-[28px] border-[1.5px] border-solid border-[rgba(28,42,33,0.55)] bg-white p-[clamp(20px,2.1vw,36px)] shadow-[0_10px_12px_rgba(28,42,33,0.06),5px_5px_0_rgba(28,42,33,0.55)] max-sm:rounded-[22px] max-sm:shadow-[0_6px_8px_rgba(28,42,33,0.06),3px_3px_0_rgba(28,42,33,0.55)]"
      >
        <div className="flex flex-col items-start gap-[8px]">
          <span className={`${STICKER} rotate-3 bg-[#c1d4c4]`}>NEW HERE?</span>
          <h2
            id={titleId}
            className={`${DISPLAY} text-[clamp(28px,2.1vw,36px)] font-semibold leading-[1.2] tracking-[-0.01em] text-[#1c2a21]`}
          >
            Pick your vibe
          </h2>
          <p id={descId} className="font-sans text-[16px] leading-[1.5] text-[#595959]">
            Same features, same data, just a different look. You can change it any time from the top
            bar or in Settings › Appearance.
          </p>
        </div>

        <div
          role="radiogroup"
          aria-labelledby={titleId}
          aria-describedby={noteId}
          className="flex gap-[20px] max-sm:flex-col max-sm:gap-[26px] max-sm:pt-[10px]"
        >
          {OPTIONS.map((option) => {
            const isOn = selected === option.id;
            const isPlayfulCard = option.id === 'playful';
            const cardClass = isOn
              ? isPlayfulCard
                ? 'border-[1.5px] border-[rgba(28,42,33,0.55)] shadow-[0_10px_12px_rgba(28,42,33,0.06),5px_5px_0_rgba(28,42,33,0.55)]'
                : 'border-2 border-[#387440] shadow-[0_8px_12px_rgba(56,116,64,0.18)]'
              : 'border border-[rgba(28,42,33,0.15)]';
            return (
              <label
                key={option.id}
                className={`relative flex min-w-0 flex-1 cursor-pointer flex-col gap-[16px] rounded-[24px] border-solid bg-white p-[20px] has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-[3px] has-[:focus-visible]:outline-[#387440] motion-safe:transition-shadow ${cardClass}`}
              >
                <input
                  ref={(node) => {
                    radioRefs.current[option.id] = node;
                  }}
                  type="radio"
                  name="ui-style"
                  value={option.id}
                  checked={isOn}
                  onChange={() => {
                    log('branch', { selected: option.id });
                    setSelected(option.id);
                  }}
                  aria-describedby={`${descId}-${option.id}`}
                  className="peer sr-only"
                />
                {isPlayfulCard ? <PlayfulPreview /> : <FocusedPreview />}
                <span className="flex items-center gap-[10px]">
                  <span
                    aria-hidden="true"
                    className={`flex size-[36px] shrink-0 items-center justify-center rounded-[11px] ${option.tileClass}`}
                  >
                    <img src={option.icon} alt="" draggable="false" className="size-[17px]" />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-[2px]">
                    <span
                      className={`${DISPLAY} text-[18px] font-semibold leading-[1.25] tracking-[-0.01em] text-[#1c2a21]`}
                    >
                      {option.name}
                    </span>
                    <span
                      id={`${descId}-${option.id}`}
                      className="font-sans text-[13.5px] leading-[1.4] text-[#595959]"
                    >
                      {option.description}
                    </span>
                  </span>
                  {isOn ? (
                    <img
                      src={vibeRadioOn}
                      alt=""
                      aria-hidden="true"
                      draggable="false"
                      className="size-[22px] shrink-0"
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="size-[22px] shrink-0 rounded-full border-[1.5px] border-solid border-[rgba(28,42,33,0.35)] bg-white"
                    />
                  )}
                </span>
                {isPlayfulCard && (
                  <span
                    aria-hidden="true"
                    className={`${STICKER} absolute right-[79px] top-[-4.7px] translate-x-1/2 -translate-y-1/2 -rotate-[4deg] bg-[#ffd86b]`}
                  >
                    RECOMMENDED
                  </span>
                )}
              </label>
            );
          })}
        </div>

        <div className="flex items-center gap-[12px] max-sm:flex-col max-sm:items-stretch">
          <p
            id={noteId}
            className="flex min-w-0 flex-1 items-center gap-[6px] font-sans text-[13px] leading-[normal] text-[#595959]"
          >
            <img
              src={vibeInfo}
              alt=""
              aria-hidden="true"
              draggable="false"
              className="size-[16px]"
            />
            Your accessibility settings stay the same in both.
          </p>
          <div className="flex items-center gap-[12px] max-sm:justify-end">
            <button
              type="button"
              onClick={dismiss}
              className="h-[56px] cursor-pointer rounded-[14px] border-x-2 border-b-2 border-t border-solid border-[rgba(28,42,33,0.3)] bg-white px-[34px] font-sans text-[16px] font-bold leading-6 tracking-[0.1px] text-[#1c2a21] drop-shadow-[0_4px_0_rgba(17,17,17,0.25)] hover:bg-[#f8f8f4] focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-[#387440] active:translate-y-[2px] active:drop-shadow-[0_2px_0_rgba(17,17,17,0.25)] max-sm:px-[22px] motion-safe:transition-[transform,filter] motion-safe:duration-100"
            >
              Not now
            </button>
            <button
              type="button"
              onClick={confirm}
              className="h-[56px] cursor-pointer rounded-[10px] border-x-2 border-b-2 border-t border-solid border-[#2a5730] bg-[#387440] px-[18px] font-sans text-[16px] font-bold leading-6 tracking-[0.1px] drop-shadow-[0_4px_0_#224626] hover:bg-[#32683a] focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-[#387440] active:translate-y-[2px] active:drop-shadow-[0_2px_0_#224626] motion-safe:transition-[transform,filter] motion-safe:duration-100"
            >
              <span className="bg-[linear-gradient(188.377deg,#fef1e7_0%,#e8f2ed_20.192%)] bg-clip-text text-transparent">
                Keep {selected === 'playful' ? 'Playful' : 'Focused'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PickYourVibeModal;
