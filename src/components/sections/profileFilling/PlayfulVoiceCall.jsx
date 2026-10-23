import { useEffect, useRef, useState } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import Button from '../../ui/Button.jsx';
import CareerBuddyVoiceAvatar from '../../shared/CareerBuddyVoiceAvatar.jsx';
import AvatarPreview from '../engagement/avatar/AvatarPreview.jsx';
import useVoiceCapture from '../../../hooks/useVoiceCapture.js';
import useUtteranceSender, { DEFAULT_PAUSE_MS } from '../../../hooks/useUtteranceSender.js';
import usePlayfulOverlayA11y, { usePlayfulPaneReach } from '../../ui/PlayfulOverlayA11y.js';
import { getVoiceById } from './careerBuddyVoices.js';
import { ChatMicIcon, ChatSettingsSlidersIcon, ChatVoiceCloseIcon } from '../../shared/assets.jsx';

const log = debug('PlayfulVoiceCall');

/*
 * Playful voice call — Figma 7887:89621 (cluster 7887:89747). Same props and
 * callbacks as VoiceCallOverlay, which renders this when uiStyle === 'playful'.
 *
 * Differences from Focused: the chat above the cluster stays visible (the
 * overlay only fades to the canvas colour behind the cluster + hidden composer,
 * ≥ lg); name label is 32px Medium #1c2a21; 64px between name and controls.
 * a11y: inert background + focus trap + Esc ends the call; state changes
 * (started / muted / unmuted / mic unavailable) go through a polite live region;
 * the speaking pulse is dropped under prefers-reduced-motion.
 *
 * 2026-10-17: live like Focused - with onUtterance, speech is transcribed and
 * sent as a turn after a pause (pauseMs; longer during a practice interview);
 * paused holds the mic while Career Buddy thinks or speaks; status shows under
 * the name. Without onUtterance it stays the demo.
 */
const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const PlayfulVoiceCall = ({
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
  const [announce, setAnnounce] = useState('');
  const rootRef = useRef(null);
  const live = typeof onUtterance === 'function';
  // The mic stays open for the whole call; only listening pauses while Career Buddy thinks or speaks.
  const { level, setMuted, active, error, transcript, final } = useVoiceCapture({
    enabled: open,
    listen: live && !paused,
  });
  useUtteranceSender({ live, open, paused, muted, transcript, final, onUtterance, pauseMs });

  const voice = getVoiceById(voiceId);
  const reach = usePlayfulPaneReach(rootRef, open);

  useEffect(() => {
    if (!open) return;
    log('mount', { open, voiceId, userName });
    setMutedLocal(false);
    setMuted(false);
    setAnnounce(`Voice call with ${getVoiceById(voiceId).name} started. Microphone on.`);
  }, [open, voiceId, userName, setMuted]);

  useEffect(() => {
    if (open && !active && error) {
      log('branch', { micUnavailable: true });
      setAnnounce('Microphone unavailable. Check your browser permissions.');
    }
  }, [open, active, error]);

  usePlayfulOverlayA11y({
    open,
    rootRef,
    onEscape: () => {
      log('branch', { hangUp: 'escape' });
      onHangUp?.();
    },
  });

  if (!open) return null;

  const speaking = !muted && !(live && paused) && level > 0.04 && !reducedMotion();

  return (
    <div
      ref={rootRef}
      className={classNames(
        'absolute inset-x-0 bottom-0 z-20 flex flex-col items-center overflow-y-auto bg-[#f8f8f4]',
        // ≥ lg: chat stays visible above; only the cluster zone + composer fade to canvas.
        'lg:pb-[clamp(20px,calc(8vh+4px),94px)] lg:bg-[linear-gradient(to_bottom,transparent_calc(100%-500px),#f8f8f4_calc(100%-460px))]'
      )}
      style={{ top: -reach }}
      role="dialog"
      aria-modal="true"
      aria-label={`Voice call with ${voice.name}`}
    >
      <div className="my-auto flex flex-col items-center gap-[24px] lg:mb-0 lg:mt-auto">
        <div className="flex flex-col items-center gap-[22px]">
          {/* Overlapping avatars — Figma Frame 14690, gap -12 */}
          <div className="flex items-center">
            <span className="relative z-[1] shrink-0">
              <CareerBuddyVoiceAvatar size={100} speaking={speaking} />
            </span>
            <span className="relative z-[2] ml-[-12px] shrink-0" aria-label={userName}>
              <AvatarPreview size={100} badgeBg="voice" />
            </span>
          </div>
          <p className="font-sans text-[clamp(1.5rem,1.2rem+1vw,2rem)] font-medium leading-normal text-[#1c2a21]">
            {voice.callLabel}
          </p>
          {live && (
            <p
              className="max-w-[420px] px-4 text-center font-sans text-[15px] text-[#595959]"
              aria-live="polite"
            >
              {status || (paused ? '' : transcript || 'Listening\u2026')}
            </p>
          )}
        </div>

        <div className="mt-[clamp(1rem,2.3vw,2.5rem)] flex items-center gap-[22px]">
          <Button
            type="button"
            variant="icon"
            size="lg"
            data-autofocus=""
            aria-label={muted ? 'Unmute microphone' : 'Mute microphone'}
            aria-pressed={muted}
            onClick={() => {
              const next = !muted;
              log('branch', { mute: next });
              setMutedLocal(next);
              setMuted(next);
              setAnnounce(next ? 'Microphone muted' : 'Microphone on');
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
        <p role="alert" className="mt-4 px-4 text-center font-sans text-[13px] text-danger">
          Microphone unavailable — check browser permissions.
        </p>
      )}
      <p className="sr-only" role="status" aria-live="polite">
        {announce}
      </p>
    </div>
  );
};

export default PlayfulVoiceCall;
