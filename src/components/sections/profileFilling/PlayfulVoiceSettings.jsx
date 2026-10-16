import { useEffect, useId, useRef, useState } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import CareerBuddyVoiceAvatar from '../../shared/CareerBuddyVoiceAvatar.jsx';
import usePlayfulOverlayA11y from '../../ui/PlayfulOverlayA11y.js';
import chevronAsset from '../../../assets/playful/overlays/voice-chevron-prev.svg';
import { cycleVoiceId, getVoiceById } from './careerBuddyVoices.js';

const log = debug('PlayfulVoiceSettings');

/*
 * Playful "Choose a voice" — Figma 7887:89939 (frame 7887:89992). Same props and
 * callbacks as VoiceSettingsOverlay, which renders this when uiStyle === 'playful'.
 *
 * Playful shows all three voices with their taglines at once: Sol (left) /
 * Bruce (right) under the 200px mascot, Tali centred below, then chevrons and
 * Done / Cancel shelf buttons.
 * Figma draws no selected state, so none is drawn (aria-pressed only).
 * Sol's tagline keeps the product-confirmed "and" (Figma typo "ad").
 */

const NAME_CLASS =
  'pf-ov-display text-[clamp(1.125rem,1rem+0.5vw,1.375rem)] leading-[1.25] underline-offset-[5px] decoration-2';

const VoiceChoice = ({ voice, selected, onPick, className }) => (
  <button
    type="button"
    aria-pressed={selected}
    data-autofocus={selected ? '' : undefined}
    onClick={() => onPick(voice.id)}
    className={classNames(
      'pf-ov-focus flex flex-col items-center gap-[7px] rounded-[8px] px-1 text-center',
      className
    )}
  >
    <span className={classNames(NAME_CLASS, 'no-underline')}>{voice.name}</span>
    <span className="font-sans text-[16px] leading-normal text-[#737373]">{voice.tagline}</span>
  </button>
);

const PlayfulVoiceSettings = ({ open, voiceId, onDone, onCancel }) => {
  const [draftId, setDraftId] = useState(voiceId);
  const [announce, setAnnounce] = useState('');
  const rootRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    setDraftId(voiceId);
    setAnnounce('');
    log('mount', { open, voiceId });
  }, [open, voiceId]);

  usePlayfulOverlayA11y({
    open,
    rootRef,
    onEscape: () => {
      log('branch', { cancel: 'escape' });
      onCancel?.();
    },
  });

  if (!open) return null;

  const pick = (id) => {
    log('branch', { selectVoice: id });
    setDraftId(id);
    setAnnounce(`${getVoiceById(id).name} selected. ${getVoiceById(id).tagline}.`);
  };
  const voices = {
    sol: getVoiceById('sol'),
    bruce: getVoiceById('bruce'),
    tali: getVoiceById('tali'),
  };
  const arrow =
    'pf-ov-focus flex size-7 items-center justify-center rounded-full hover:bg-[#ebf1ec] max-lg:size-11';

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="absolute inset-0 z-30 flex flex-col items-center justify-center overflow-y-auto bg-[#f8f8f4]/95 px-[clamp(1.5rem,4vw,3rem)] py-6 max-lg:bg-[#f8f8f4]"
    >
      <div className="flex w-full max-w-[481px] flex-col items-center gap-[clamp(2rem,5vw,4rem)]">
        <h2
          id={titleId}
          className="pf-ov-display text-center text-[clamp(1.5rem,1.1rem+0.9vw,1.8125rem)] leading-[1.2]"
        >
          Choose a voice
        </h2>

        <div className="flex w-full flex-col items-center">
          <div className="relative z-[1] mb-[-10px] aspect-square w-[clamp(7.5rem,14vw,12.5rem)]">
            <CareerBuddyVoiceAvatar size={null} className="size-full" />
          </div>
          <div className="flex w-full flex-col items-center gap-8">
            <div className="flex w-full flex-col items-center gap-[14px]">
              <div className="flex w-full items-start justify-between">
                <VoiceChoice voice={voices.sol} selected={draftId === 'sol'} onPick={pick} />
                <VoiceChoice voice={voices.bruce} selected={draftId === 'bruce'} onPick={pick} />
              </div>
              <VoiceChoice voice={voices.tali} selected={draftId === 'tali'} onPick={pick} />
            </div>
            <div className="flex items-center gap-6">
              <button
                type="button"
                aria-label="Previous voice"
                onClick={() => pick(cycleVoiceId(draftId, 'prev'))}
                className={arrow}
              >
                <img src={chevronAsset} alt="" aria-hidden="true" className="size-7 rotate-90" />
              </button>
              <button
                type="button"
                aria-label="Next voice"
                onClick={() => pick(cycleVoiceId(draftId, 'next'))}
                className={arrow}
              >
                <img src={chevronAsset} alt="" aria-hidden="true" className="size-7 -rotate-90" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 max-sm:w-full">
          <button
            type="button"
            onClick={() => {
              log('branch', { done: draftId });
              onDone?.(draftId);
            }}
            className="pf-ov-btn pf-ov-btn--primary min-w-[80px] max-sm:flex-1"
          >
            <span className="pf-ov-btn__grad">Done</span>
          </button>
          <button
            type="button"
            aria-label="Cancel"
            onClick={() => {
              log('branch', { cancel: true });
              onCancel?.();
            }}
            className="pf-ov-btn pf-ov-btn--secondary max-sm:w-11 max-sm:px-0!"
          >
            <span className="max-sm:hidden">Cancel</span>
            <svg
              viewBox="0 0 12 12"
              className="size-4 sm:hidden"
              aria-hidden="true"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M2 2l8 8M10 2l-8 8" />
            </svg>
          </button>
        </div>
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        {announce || `Selected voice: ${getVoiceById(draftId).name}`}
      </p>
    </div>
  );
};

export default PlayfulVoiceSettings;
