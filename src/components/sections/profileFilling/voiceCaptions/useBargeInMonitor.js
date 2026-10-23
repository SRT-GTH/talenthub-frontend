import { useEffect, useRef } from 'react';
import { debug } from '../../../../utils/debug.js';
import { BARGE_IN_HOLD_MS, BARGE_IN_LEVEL } from './voiceCaptionData.js';

const log = debug('useBargeInMonitor');

/**
 * Watches the microphone WHILE Buddy is speaking. When the talent talks over Buddy (level above
 * BARGE_IN_LEVEL for BARGE_IN_HOLD_MS) it calls onBargeIn once.
 *
 * ⚠️ ASSUMPTION: the main capture hook is switched off while Buddy speaks (so Buddy's own voice is never
 * sent as a turn), so this opens its own short-lived mic stream with echo cancellation just to read the
 * level. Speakers without echo cancellation can trigger it; the threshold is deliberately high.
 */
export default function useBargeInMonitor({ active, onBargeIn }) {
  const callbackRef = useRef(onBargeIn);
  callbackRef.current = onBargeIn;

  useEffect(() => {
    if (!active || !navigator.mediaDevices?.getUserMedia) return undefined;
    let cancelled = false;
    let raf = null;
    let stream = null;
    let ctx = null;
    let loudSince = 0;

    const start = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: true },
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        const Ctx = window.AudioContext || window.webkitAudioContext;
        ctx = new Ctx();
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        ctx.createMediaStreamSource(stream).connect(analyser);
        const data = new Uint8Array(analyser.frequencyBinCount);
        log('async', { monitorReady: true });
        const tick = () => {
          if (cancelled) return;
          analyser.getByteTimeDomainData(data);
          let sum = 0;
          for (let i = 0; i < data.length; i += 1) {
            const v = (data[i] - 128) / 128;
            sum += v * v;
          }
          const level = Math.min(1, Math.max(0, (Math.sqrt(sum / data.length) - 0.02) / 0.25));
          const now = performance.now();
          if (level >= BARGE_IN_LEVEL) {
            if (!loudSince) loudSince = now;
            if (now - loudSince >= BARGE_IN_HOLD_MS) {
              log('branch', { bargeIn: true, level: Number(level.toFixed(2)) });
              callbackRef.current?.();
              return;
            }
          } else {
            loudSince = 0;
          }
          raf = requestAnimationFrame(tick);
        };
        tick();
      } catch (err) {
        log.error('bargeInMonitor', err);
      }
    };
    start();

    return () => {
      cancelled = true;
      if (raf) cancelAnimationFrame(raf);
      if (stream) stream.getTracks().forEach((t) => t.stop());
      if (ctx) ctx.close().catch(() => {});
    };
  }, [active]);
}
