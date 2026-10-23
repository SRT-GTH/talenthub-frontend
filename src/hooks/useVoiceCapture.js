import { useCallback, useEffect, useRef, useState } from 'react';
import { debug } from '../utils/debug.js';

const log = debug('useVoiceCapture');

/**
 * Real mic capture: MediaStream + AnalyserNode levels + optional SpeechRecognition.
 * Levels are 0–1; silent ≈ 0 so the waveform can go flat.
 *
 *   enabled  the mic (stream + level meter) is open - the whole voice call
 *   listen   speech recognition runs - the caller turns it off while Career Buddy thinks or speaks
 *
 * 2026-10-23 (voice latency): the mic used to be torn down and re-opened (getUserMedia + a new
 * AudioContext + a new recogniser) around every reply. It now stays open for the call; only the
 * recogniser stops and starts, and it restarts itself when the browser ends it (Chrome ends a
 * continuous session after a silence or a network blip, which used to leave the call deaf).
 * `final` is true when the last words were finalised by the recogniser (a natural pause).
 */
export default function useVoiceCapture({ enabled, listen = true }) {
  const [level, setLevel] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [final, setFinal] = useState(false);
  const [error, setError] = useState(null);
  const [active, setActive] = useState(false);

  const streamRef = useRef(null);
  const ctxRef = useRef(null);
  const analyserRef = useRef(null);
  const rafRef = useRef(null);
  const mutedRef = useRef(false);

  const setMuted = useCallback((muted) => {
    mutedRef.current = muted;
    const stream = streamRef.current;
    if (stream) {
      stream.getAudioTracks().forEach((t) => {
        t.enabled = !muted;
      });
    }
    if (muted) setLevel(0);
    log('branch', { muted });
  }, []);

  // ---- the mic: open for as long as the call is ----
  useEffect(() => {
    if (!enabled) {
      setActive(false);
      setLevel(0);
      return undefined;
    }
    let cancelled = false;

    const start = async () => {
      log('async', { micStart: true });
      setError(null);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: true },
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        stream.getAudioTracks().forEach((t) => {
          t.enabled = !mutedRef.current;
        });

        const Ctx = window.AudioContext || window.webkitAudioContext;
        const ctx = new Ctx();
        ctxRef.current = ctx;
        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.75;
        source.connect(analyser);
        analyserRef.current = analyser;

        const data = new Uint8Array(analyser.frequencyBinCount);
        const tick = () => {
          if (cancelled || !analyserRef.current) return;
          if (mutedRef.current) {
            setLevel(0);
          } else {
            analyserRef.current.getByteTimeDomainData(data);
            let sum = 0;
            for (let i = 0; i < data.length; i += 1) {
              const v = (data[i] - 128) / 128;
              sum += v * v;
            }
            const rms = Math.sqrt(sum / data.length);
            // Gate noise floor so silence stays visually flat.
            const gated = rms < 0.02 ? 0 : Math.min(1, (rms - 0.02) / 0.25);
            setLevel(gated);
          }
          rafRef.current = requestAnimationFrame(tick);
        };
        tick();
        setActive(true);
        log('async', { micReady: true });
      } catch (err) {
        log.error('getUserMedia', err);
        setError(err?.message || 'mic-denied');
        setActive(false);
      }
    };

    start();

    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      if (ctxRef.current) {
        ctxRef.current.close().catch(() => {});
        ctxRef.current = null;
      }
      analyserRef.current = null;
      setActive(false);
      setLevel(0);
      log('async', { micStop: true });
    };
  }, [enabled]);

  // ---- speech recognition: only while the talent has the floor ----
  useEffect(() => {
    if (!enabled || !listen) return undefined;
    const SR =
      typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
    if (!SR) {
      log('branch', { speechRecognitionUnsupported: true });
      return undefined;
    }
    let stopped = false;
    let recognition = null;
    let restarts = 0;
    setTranscript('');
    setFinal(false);

    const begin = () => {
      recognition = new SR();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      // One recogniser session can end and restart within a turn; keep what was already heard.
      let heardBefore = '';
      let heard = '';
      recognition.onresult = (event) => {
        let text = '';
        for (let i = 0; i < event.results.length; i += 1) {
          text += event.results[i][0].transcript;
        }
        const last = event.results[event.results.length - 1];
        heard = [heardBefore, text.trim()].filter(Boolean).join(' ');
        setTranscript(heard);
        setFinal(Boolean(last?.isFinal));
        restarts = 0;
      };
      recognition.onerror = (event) => {
        if (event.error !== 'aborted' && event.error !== 'no-speech') {
          log.error('speechRecognition', event.error);
          setError(event.error);
        }
      };
      recognition.onend = () => {
        if (stopped) return;
        // Chrome ended the session (silence / network): start again so the call keeps listening.
        restarts += 1;
        if (restarts > 20) {
          log.error('speechRecognition', 'gave up restarting');
          return;
        }
        log('branch', { recognitionRestart: restarts });
        heardBefore = heard;
        try {
          recognition.start();
        } catch (err) {
          log.error('speechRestart', err);
        }
      };
      try {
        recognition.start();
        log('async', { recognitionStart: true });
      } catch (err) {
        log.error('speechStart', err);
      }
    };
    begin();

    return () => {
      stopped = true;
      if (recognition) {
        recognition.onresult = null;
        recognition.onerror = null;
        recognition.onend = null;
        try {
          recognition.abort();
        } catch {
          /* ignore */
        }
      }
      log('async', { recognitionStop: true });
    };
  }, [enabled, listen]);

  return { level, transcript, final, error, active, setMuted };
}
