import { useCallback, useEffect, useRef, useState } from 'react';
import { debug } from '../utils/debug.js';

const log = debug('useVoiceCapture');

/**
 * Real mic capture: MediaStream + AnalyserNode levels + optional SpeechRecognition.
 * Levels are 0–1; silent ≈ 0 so the waveform can go flat.
 */
export default function useVoiceCapture({ enabled, listen = true }) {
  const [level, setLevel] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);
  const [active, setActive] = useState(false);

  const streamRef = useRef(null);
  const ctxRef = useRef(null);
  const analyserRef = useRef(null);
  const rafRef = useRef(null);
  const recognitionRef = useRef(null);
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

  useEffect(() => {
    if (!enabled) {
      setActive(false);
      setLevel(0);
      return undefined;
    }

    let cancelled = false;

    const stopAll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.onresult = null;
          recognitionRef.current.onerror = null;
          recognitionRef.current.stop();
        } catch {
          /* ignore */
        }
        recognitionRef.current = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      if (ctxRef.current) {
        ctxRef.current.close().catch(() => {});
        ctxRef.current = null;
      }
      analyserRef.current = null;
    };

    const start = async () => {
      log('async', { voiceCaptureStart: true, listen });
      setTranscript('');
      setError(null);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
          },
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;

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

        if (listen) {
          const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
          if (SR) {
            const recognition = new SR();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-US';
            recognition.onresult = (event) => {
              let text = '';
              for (let i = 0; i < event.results.length; i += 1) {
                text += event.results[i][0].transcript;
              }
              setTranscript(text.trim());
              log('async', { transcriptLen: text.trim().length });
            };
            recognition.onerror = (event) => {
              log.error('speechRecognition', event.error);
              if (event.error !== 'aborted' && event.error !== 'no-speech') {
                setError(event.error);
              }
            };
            recognitionRef.current = recognition;
            try {
              recognition.start();
            } catch (err) {
              log.error('speechStart', err);
            }
          } else {
            log('branch', { speechRecognitionUnsupported: true });
          }
        }

        setActive(true);
        log('async', { voiceCaptureReady: true });
      } catch (err) {
        log.error('getUserMedia', err);
        setError(err?.message || 'mic-denied');
        setActive(false);
      }
    };

    start();

    return () => {
      cancelled = true;
      stopAll();
      setActive(false);
      setLevel(0);
      log('async', { voiceCaptureStop: true });
    };
  }, [enabled, listen]);

  return { level, transcript, error, active, setMuted };
}
