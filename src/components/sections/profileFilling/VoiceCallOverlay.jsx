import { useEffect, useState } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import Button from '../../ui/Button.jsx';
import CareerBuddyVoiceAvatar from '../../shared/CareerBuddyVoiceAvatar.jsx';
import AvatarPreview from '../engagement/avatar/AvatarPreview.jsx';
import useVoiceCapture from '../../../hooks/useVoiceCapture.js';
import { getVoiceById } from './careerBuddyVoices.js';
import { ChatMicIcon, ChatSettingsSlidersIcon, ChatVoiceCloseIcon } from '../../shared/assets.jsx';

const log = debug('VoiceCallOverlay');

/**
 * Dual-avatar live voice call — Figma 5146:75913 / 75964.
 * AI: CareerBuddyVoiceAvatar (5146:76042 — no badge fill).
 * User: AvatarPreview badgeBg="voice" (5146:76040 radial #387440).
 * Controls reuse Button icon/ghost-icon (hover gradient from design system).
 */
const VoiceCallOverlay = ({ open, voiceId, userName = 'Emma', onHangUp, onOpenSettings }) => {
  const [muted, setMutedLocal] = useState(false);
  const { level, setMuted, active, error } = useVoiceCapture({
    enabled: open,
    listen: false,
  });

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
      className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#f8f8f4]/92"
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
          className="!size-10"
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

export default VoiceCallOverlay;
