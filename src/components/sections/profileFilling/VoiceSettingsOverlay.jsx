import { useEffect, useState } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import CareerBuddyVoiceAvatar from '../../shared/CareerBuddyVoiceAvatar.jsx';
import { cycleVoiceId, getVoiceById } from './careerBuddyVoices.js';

const log = debug('VoiceSettingsOverlay');

const ChevronIcon = ({ dir = 'left', className = '' }) => (
  <svg viewBox="0 0 28 28" fill="none" aria-hidden="true" className={className}>
    <path
      d={dir === 'left' ? 'M17 8L11 14l6 6' : 'M11 8l6 6-6 6'}
      stroke="#111111"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Choose-a-voice overlay — Figma 5146:76230 / 76269.
 * Sol (left) / Bruce (right) / Tali (bottom) around the 200px mascot.
 */
const VoiceSettingsOverlay = ({ open, voiceId, onDone, onCancel }) => {
  const [draftId, setDraftId] = useState(voiceId);

  useEffect(() => {
    if (open) {
      setDraftId(voiceId);
      log('mount', { open, voiceId });
    }
  }, [open, voiceId]);

  if (!open) return null;

  const voice = getVoiceById(draftId);

  return (
    <div
      className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#f8f8f4]/95 px-[clamp(1.5rem,4vw,3rem)]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="voice-settings-title"
    >
      <div className="flex w-full max-w-[481px] flex-col items-center gap-[clamp(2rem,5vw,4rem)]">
        <h2
          id="voice-settings-title"
          className="font-display text-center leading-[1.3] text-[#404040]"
          style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)' }}
        >
          Choose a voice
        </h2>

        <div className="relative flex w-full flex-col items-center">
          {/* Name row above/beside avatar — Sol left, Bruce right */}
          <div className="relative flex w-full items-start justify-between px-[clamp(0.5rem,2vw,1rem)]">
            <button
              type="button"
              onClick={() => {
                log('branch', { selectVoice: 'sol' });
                setDraftId('sol');
              }}
              className="flex flex-col items-start gap-1 text-left"
              aria-pressed={draftId === 'sol'}
            >
              <span
                className={classNames(
                  'font-display leading-none',
                  draftId === 'sol' ? 'text-[#111]' : 'text-[#111]/50'
                )}
                style={{ fontSize: 'clamp(1.125rem, 1.8vw, 1.5rem)' }}
              >
                Sol
              </span>
              {draftId === 'sol' && (
                <span className="font-sans text-[16px] text-[#737373]">Savvy and relaxed</span>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                log('branch', { selectVoice: 'bruce' });
                setDraftId('bruce');
              }}
              className="flex flex-col items-end gap-1 text-right"
              aria-pressed={draftId === 'bruce'}
            >
              <span
                className={classNames(
                  'font-display leading-none',
                  draftId === 'bruce' ? 'text-[#111]' : 'text-[#111]/50'
                )}
                style={{ fontSize: 'clamp(1.125rem, 1.8vw, 1.5rem)' }}
              >
                Bruce
              </span>
              {draftId === 'bruce' && (
                <span className="font-sans text-[16px] text-[#737373]">Calm and affirming</span>
              )}
            </button>
          </div>

          {/* Robot — Figma 5146:76286 200px (Frame 14220 voice mascot) */}
          <div className="relative z-[1] mt-[-10px] aspect-square w-[clamp(7.5rem,14vw,12.5rem)]">
            <CareerBuddyVoiceAvatar size={null} className="size-full" />
          </div>

          <div className="mt-[clamp(0.5rem,1.5vw,1rem)] flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={() => {
                log('branch', { selectVoice: 'tali' });
                setDraftId('tali');
              }}
              className="flex flex-col items-center gap-1"
              aria-pressed={draftId === 'tali'}
            >
              <span
                className={classNames(
                  'font-display leading-none',
                  draftId === 'tali' ? 'text-[#111]' : 'text-[#111]/50'
                )}
                style={{ fontSize: 'clamp(1.125rem, 1.8vw, 1.5rem)' }}
              >
                Tali
              </span>
              {draftId === 'tali' && (
                <span className="font-sans text-[16px] text-[#737373]">Jovial and cheerful</span>
              )}
            </button>

            <div className="flex items-center gap-[24px] pt-2">
              <button
                type="button"
                aria-label="Previous voice"
                onClick={() => {
                  const next = cycleVoiceId(draftId, 'prev');
                  log('branch', { cycle: 'prev', next });
                  setDraftId(next);
                }}
                className="flex size-7 items-center justify-center rounded-full bg-white"
              >
                <ChevronIcon dir="left" className="size-7" />
              </button>
              <button
                type="button"
                aria-label="Next voice"
                onClick={() => {
                  const next = cycleVoiceId(draftId, 'next');
                  log('branch', { cycle: 'next', next });
                  setDraftId(next);
                }}
                className="flex size-7 items-center justify-center rounded-full bg-white"
              >
                <ChevronIcon dir="right" className="size-7" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-[8px]">
          <button
            type="button"
            onClick={() => {
              log('branch', { done: draftId });
              onDone?.(draftId);
            }}
            className="inline-flex h-11 items-center justify-center rounded-[10px] border-2 border-[#2a5730] bg-brand-green px-[18px] font-sans text-[14px] font-medium text-white"
          >
            Done
          </button>
          <button
            type="button"
            onClick={() => {
              log('branch', { cancel: true });
              onCancel?.();
            }}
            className="inline-flex h-11 items-center justify-center rounded-[14px] border-2 border-[#111] bg-white px-[18px] font-sans text-[14px] font-medium text-[#111]"
          >
            Cancel
          </button>
        </div>
      </div>

      <p className="sr-only">Selected voice: {voice.name}</p>
    </div>
  );
};

export default VoiceSettingsOverlay;
