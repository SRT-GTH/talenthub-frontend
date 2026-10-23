import { useCallback, useEffect, useRef, useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { useUiStyle } from '../../../../hooks/useUiStyle.js';
import useVoiceCapture from '../../../../hooks/useVoiceCapture.js';
import useUtteranceSender, { DEFAULT_PAUSE_MS } from '../../../../hooks/useUtteranceSender.js';
import usePlayfulOverlayA11y, { usePlayfulPaneReach } from '../../../ui/PlayfulOverlayA11y.js';
import { getVoiceById } from '../careerBuddyVoices.js';
import VoiceCallCluster from './VoiceCallCluster.jsx';
import VoiceCaptionsStack from './VoiceCaptionsStack.jsx';
import useSettledWords from './useSettledWords.js';
import useBuddyCaptionReveal from './useBuddyCaptionReveal.js';
import useBargeInMonitor from './useBargeInMonitor.js';
import { buddyRuns, DEMO_RUNS, youRuns } from './captionRuns.js';
import { pauseSpeech, resumeSpeech } from './voiceSpeech.js';
import { PAUSE_NOTE_MS, VOICE_COPY, VOICE_DEMO } from './voiceCaptionData.js';

const log = debug('VoiceCaptionsCall');

/*
 * Voice call with live captions - Figma section 9149:83053 (VC-01 ... VC-06, Playful + Focused).
 * Same props as VoiceCallOverlay plus:
 *   captionScene      'you' | 'buddy' | 'off' | 'interrupt' | 'pause' - draws that frame statically (demo URLs, no mic)
 *   captionsOn        boolean - captions shown (default true); with onToggleCaptions the parent owns it (Buddy settings)
 *   onToggleCaptions  () => void
 *   buddySpeaking     boolean - Buddy's reply is being spoken (live call)
 *   buddyText         string  - the reply being spoken (its words are revealed progressively)
 *   onStopSpeaking    () => void - cancels Buddy's speech (used once the talent has talked over it and sent a turn)
 * onUtterance(text, { seconds }) - seconds is the (approximate) speaking time of the turn, for the "Voice · 0:06" meta.
 *
 * Barge-in (talking over Buddy): the mic level is watched while Buddy speaks; when the talent talks over it,
 * Buddy's speech is PAUSED (speechSynthesis.pause), the interrupt UI shows and the capture restarts for the talent.
 * "Let Tali finish" resumes Buddy; otherwise the talent's turn is sent and Buddy answers it as a normal turn.
 *
 * ⚠️ ASSUMPTION: the paused sentence is not picked up again after the talent's turn - the agent answers the new
 * turn instead ("It will answer when you pause"). ⚠️ ASSUMPTION: a barge-in with no recognised words for 6 s
 * resumes Buddy by itself (noise, a cough).
 */
const NO_SPEECH_RESUME_MS = 6000;

const LAYOUT =
  'absolute inset-x-0 bottom-0 z-20 flex flex-col items-center overflow-y-auto bg-[#f8f8f4] lg:bg-transparent lg:pb-[clamp(20px,calc(8vh+4px),94px)] lg:bg-[linear-gradient(to_bottom,transparent_calc(100%-540px),#f8f8f4_calc(100%-500px))]';

const quoteOf = (words, index) => `“${words.slice(0, Math.max(1, index)).join(' ')}…”`;

const VoiceCaptionsCall = ({
  open,
  voiceId,
  userName = 'Emma',
  onHangUp,
  onOpenSettings,
  onUtterance,
  paused = false,
  status,
  pauseMs = DEFAULT_PAUSE_MS,
  captionScene,
  captionsOn: captionsOnProp,
  onToggleCaptions,
  buddySpeaking = false,
  buddyText = '',
  onStopSpeaking,
}) => {
  const { uiStyle } = useUiStyle();
  const playful = uiStyle === 'playful';
  const rootRef = useRef(null);
  const live = typeof onUtterance === 'function';
  const demo = !live && Boolean(captionScene);
  const voice = getVoiceById(voiceId);

  const [muted, setMutedLocal] = useState(false);
  const [announce, setAnnounce] = useState('');
  const [localCaptions, setLocalCaptions] = useState(captionScene !== 'off');
  const [interrupt, setInterrupt] = useState(null); // null | { compact: boolean }
  const speechStartRef = useRef(0);

  const controlled = typeof onToggleCaptions === 'function';
  const captionsOn = controlled ? captionsOnProp !== false : localCaptions;
  const toggleCaptions = useCallback(() => {
    log('branch', { toggleCaptions: !captionsOn });
    if (controlled) onToggleCaptions();
    else setLocalCaptions((v) => !v);
  }, [captionsOn, controlled, onToggleCaptions]);

  const { level, setMuted, active, error, transcript } = useVoiceCapture({
    enabled: open && !demo && !(live && paused && !interrupt),
    listen: live,
  });

  const sendTurn = useCallback(
    (text) => {
      const seconds = speechStartRef.current
        ? Math.max(1, Math.round((Date.now() - speechStartRef.current - pauseMs) / 1000))
        : 1;
      speechStartRef.current = 0;
      if (interrupt) {
        // The talent talked over Buddy: drop the paused sentence; the agent answers the new turn.
        onStopSpeaking?.();
        resumeSpeech();
        setInterrupt(null);
      }
      log('branch', { sendTurn: text.length, seconds });
      onUtterance(text, { seconds });
    },
    [interrupt, onStopSpeaking, onUtterance, pauseMs]
  );
  useUtteranceSender({
    live,
    open,
    paused: paused && !interrupt,
    muted,
    transcript,
    onUtterance: sendTurn,
    pauseMs,
  });

  useEffect(() => {
    if (transcript && !speechStartRef.current) speechStartRef.current = Date.now();
    if (!transcript) speechStartRef.current = 0;
  }, [transcript]);

  const handleBargeIn = useCallback(() => {
    log('branch', { bargeIn: true });
    pauseSpeech();
    setInterrupt({ compact: false });
    setAnnounce('Buddy stopped so you can talk');
  }, []);
  useBargeInMonitor({
    active: live && open && buddySpeaking && !interrupt && !muted,
    onBargeIn: handleBargeIn,
  });

  const handleResume = useCallback(() => {
    log('branch', { resumeBuddy: true });
    resumeSpeech();
    setInterrupt(null);
  }, []);

  // The tooltip layout (VC-06b) gives way to the compact chip layout (VC-06) after a moment.
  const interruptCompact = interrupt?.compact;
  useEffect(() => {
    if (!interrupt || interruptCompact) return undefined;
    const t = setTimeout(() => setInterrupt({ compact: true }), PAUSE_NOTE_MS);
    return () => clearTimeout(t);
  }, [interrupt, interruptCompact]);
  // Nothing recognised after a barge-in: let Buddy carry on.
  useEffect(() => {
    if (!interrupt || transcript) return undefined;
    const t = setTimeout(handleResume, NO_SPEECH_RESUME_MS);
    return () => clearTimeout(t);
  }, [interrupt, transcript, handleResume]);

  useEffect(() => {
    if (!open) return;
    log('mount', { open, voiceId, userName, live, captionScene });
    setMutedLocal(false);
    setMuted(false);
    setInterrupt(null);
    setAnnounce(`Voice call with ${getVoiceById(voiceId).name} started. Microphone on.`);
  }, [open, voiceId, userName, live, captionScene, setMuted]);

  useEffect(() => {
    if (open && !active && error) {
      log('branch', { micUnavailable: true });
      setAnnounce('Microphone unavailable. Check your browser permissions.');
    }
  }, [open, active, error]);

  const reach = usePlayfulPaneReach(rootRef, open);
  usePlayfulOverlayA11y({
    open,
    enabled: playful,
    rootRef,
    onEscape: () => {
      log('branch', { hangUp: 'escape' });
      onHangUp?.();
    },
  });

  const listeningNow = live && open && active && !muted && (!paused || Boolean(interrupt));
  const userWords = useSettledWords(transcript, listeningNow);
  const reveal = useBuddyCaptionReveal({
    text: buddyText,
    active: live && buddySpeaking,
    paused: Boolean(interrupt),
    voiceId,
  });

  // ---- what to draw ----
  let scene = null;
  let listening = false;
  let buddyTalking = false;
  let label = voice.callLabel;
  if (demo) {
    const kind = captionsOn ? (captionScene === 'off' ? 'buddy' : captionScene) : 'off';
    if (kind === 'you') scene = { kind, you: DEMO_RUNS.you };
    else if (kind === 'buddy') scene = { kind, buddy: DEMO_RUNS.buddy };
    else if (kind === 'interrupt')
      scene = { kind, quote: VOICE_DEMO.buddyQuoted, you: DEMO_RUNS.interrupt };
    else if (kind === 'pause')
      scene = { kind, buddyLine: VOICE_DEMO.buddyPausedLine, you: DEMO_RUNS.pause };
    else scene = { kind: 'off' };
    listening = ['you', 'interrupt', 'pause'].includes(kind);
    buddyTalking = kind === 'buddy';
    if (kind === 'you' || kind === 'interrupt') label = VOICE_COPY.listeningLabel;
  } else if (live) {
    listening = listeningNow;
    buddyTalking = buddySpeaking && !interrupt;
    const you = youRuns(userWords.words, userWords.settledCount);
    if (!captionsOn) scene = { kind: 'off' };
    else if (interrupt) {
      scene = interrupt.compact
        ? { kind: 'interrupt', quote: quoteOf(reveal.words, reveal.index), you }
        : {
            kind: 'pause',
            buddyLine: `${reveal.words.slice(0, reveal.index + 1).join(' ')}…`,
            you,
          };
    } else if (buddySpeaking && buddyText) {
      scene = { kind: 'buddy', buddy: buddyRuns(reveal.words, reveal.index) };
    } else if (listeningNow && userWords.words.length) {
      scene = { kind: 'you', you };
    }
    if (listeningNow && !(interrupt && !interrupt.compact)) label = VOICE_COPY.listeningLabel;
  }
  if (demo && scene?.kind === 'pause') label = voice.callLabel;

  if (!open) return null;

  const showStatus = live && (!scene || scene.kind === 'off') ? status : '';

  return (
    <div
      ref={rootRef}
      className={classNames(LAYOUT)}
      style={{ top: -reach }}
      role="dialog"
      aria-modal="true"
      aria-label={`Voice call with ${voice.name}`}
    >
      <div className="my-auto flex w-full flex-col items-center px-4 lg:mb-0 lg:mt-auto">
        <VoiceCaptionsStack
          scene={scene}
          onToggleCaptions={toggleCaptions}
          onResume={handleResume}
        />
        <VoiceCallCluster
          userName={userName}
          label={label}
          compactLabel={label === VOICE_COPY.listeningLabel}
          listening={listening}
          buddySpeaking={buddyTalking}
          level={live ? level : null}
          muted={muted}
          autoFocusMic
          status={showStatus}
          onToggleMute={() => {
            const next = !muted;
            log('branch', { mute: next });
            setMutedLocal(next);
            setMuted(next);
            setAnnounce(next ? 'Microphone muted' : 'Microphone on');
          }}
          onHangUp={() => {
            log('branch', { hangUp: true });
            onHangUp?.();
          }}
          onOpenSettings={() => {
            log('branch', { openSettingsFromCall: true });
            onOpenSettings?.();
          }}
        />
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

export default VoiceCaptionsCall;
