import { useEffect, useState } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { useUiStyle } from '../../../hooks/useUiStyle.js';
import PlayfulVoiceCall from './PlayfulVoiceCall.jsx';
import VoiceCaptionsCall from './voiceCaptions/VoiceCaptionsCall.jsx';
import Button from '../../ui/Button.jsx';
import CareerBuddyVoiceAvatar from '../../shared/CareerBuddyVoiceAvatar.jsx';
import AvatarPreview from '../engagement/avatar/AvatarPreview.jsx';
import useVoiceCapture from '../../../hooks/useVoiceCapture.js';
import useUtteranceSender, { DEFAULT_PAUSE_MS } from '../../../hooks/useUtteranceSender.js';
import { getVoiceById } from './careerBuddyVoices.js';
import { ChatMicIcon, ChatSettingsSlidersIcon, ChatVoiceCloseIcon } from '../../shared/assets.jsx';

const log = debug('VoiceCallOverlay');

/**
 * Dual-avatar live voice call — Figma 5146:75913 / 75964.
 * AI: CareerBuddyVoiceAvatar (5146:76042 — no badge fill).
 * User: AvatarPreview badgeBg="voice" (5146:76040 radial #387440).
 * Controls reuse Button icon/ghost-icon (hover gradient from design system).
 *
 * 2026-10-16 (live Career Buddy): pass onUtterance(text) to make the call
 * real - speech is transcribed and, after a short pause, handed to the
 * caller (which sends it as a turn and speaks the reply). paused stops the
 * mic while Career Buddy is thinking or speaking; status is shown under
 * the name. Without onUtterance it behaves exactly as before (demo).
 * pauseMs (2026-10-17): silence before a turn is sent - longer during a
 * practice interview.
 */

const FocusedVoiceCallOverlay = ({
  open,
  voiceId,
  userName = 'Emma',
  onHangUp,
  onOpenSettings,
  onUtterance,
  paused = false,
  status,
  pauseMs = DEFAULT_PAUSE_MS,
}) => {
  const [muted, setMutedLocal] = useState(false);
  const live = typeof onUtterance === 'function';
  const { level, setMuted, active, error, transcript } = useVoiceCapture({
    enabled: open && !(live && paused),
    listen: live,
  });
  useUtteranceSender({ live, open, paused, muted, transcript, onUtterance, pauseMs });

  useEffect(() => {
    if (open) {
      log('mount', { open, voiceId, userName });
      setMutedLocal(false);
      setMuted(false);
    }
  }, [open, voiceId, userName, setMuted]);

  if (!open) return null;

  const voice = getVoiceById(voiceId);
  const speaking = !muted && level > 0.04;

  return (
    <div
      className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#f8f8f4]/92 max-lg:bg-[#f8f8f4]"
      role="dialog"
      aria-modal="true"
      aria-label={`Voice call with ${voice.name}`}
    >
      <div className="flex flex-col items-center gap-[clamp(1.25rem,3vw,1.5rem)]">
        <div className="flex flex-col items-center gap-[clamp(1.25rem,3vw,1.375rem)]">
          {/* Overlapping avatars — gap -12px Figma Frame 14690 */}
          <div className="flex items-center">
            <span className="relative z-[1] shrink-0">
              <CareerBuddyVoiceAvatar size={100} speaking={speaking} />
            </span>
            <span
              className="relative z-[2] shrink-0"
              style={{ marginLeft: '-12px' /* Figma gap=-12 */ }}
              aria-label={userName}
            >
              <AvatarPreview size={100} badgeBg="voice" />
            </span>
          </div>

          <p className="font-sans text-[clamp(1.5rem,2.5vw,2rem)] font-medium leading-none tracking-[0.02em] text-[#111]">
            {voice.callLabel}
          </p>
          {live && (
            <p
              className="max-w-[420px] px-4 text-center font-sans text-[15px] text-[#595959]"
              aria-live="polite"
            >
              {status || (paused ? '' : transcript || 'Listening…')}
            </p>
          )}
        </div>

        <div className="flex items-center gap-[22px]">
          {/* Mic / X — Button icon lg; Figma fill #e6e6e6 (vs chat #f0f0f0) */}
          <Button
            type="button"
            variant="icon"
            size="lg"
            aria-label={muted ? 'Unmute microphone' : 'Mute microphone'}
            aria-pressed={muted}
            onClick={() => {
              const next = !muted;
              log('branch', { mute: next });
              setMutedLocal(next);
              setMuted(next);
            }}
            className={classNames('!bg-[#e6e6e6]', muted && 'opacity-50')}
          >
            <ChatMicIcon className="size-[27px]" />
          </Button>
          <Button
            type="button"
            variant="icon"
            size="lg"
            aria-label="End voice call"
            onClick={() => {
              log('branch', { hangUp: true });
              onHangUp?.();
            }}
            className="!bg-[#e6e6e6]"
          >
            <ChatVoiceCloseIcon className="size-[18px]" />
          </Button>
        </div>

        {/* Settings — ghost-icon reuses hover colour shift (Figma 5146:76111) */}
        <Button
          type="button"
          variant="ghost-icon"
          size="md"
          aria-label="Voice settings"
          onClick={() => {
            log('branch', { openSettingsFromCall: true });
            onOpenSettings?.();
          }}
          className="!size-10 max-lg:!size-11"
        >
          <ChatSettingsSlidersIcon className="size-[18px]" />
        </Button>
      </div>

      {!active && error && (
        <p className="mt-4 font-sans text-[13px] text-danger">
          Microphone unavailable — check browser permissions.
        </p>
      )}
    </div>
  );
};

/** Playful appearance renders its own call UI (same props); Focused markup is untouched. */
const VoiceCallOverlay = (props) => {
  const { uiStyle } = useUiStyle();
  // Live captions (Figma 9149:83053, added 2026-10-23): a live call (onUtterance) and the demo frames (captionScene)
  // use the captions layout in both styles; the plain demo call above stays as it was.
  if (props.captionScene || typeof props.onUtterance === 'function') {
    return <VoiceCaptionsCall {...props} />;
  }
  return uiStyle === 'playful' ? (
    <PlayfulVoiceCall {...props} />
  ) : (
    <FocusedVoiceCallOverlay {...props} />
  );
};

export default VoiceCallOverlay;
