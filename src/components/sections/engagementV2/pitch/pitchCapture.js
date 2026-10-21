import { useCallback, useEffect, useRef, useState } from 'react';
import { debug } from '../../../../utils/debug.js';

const log = debug('pitchCapture');

export const MAX_PITCH_SECONDS = 60;

/*
 * Camera + microphone capture for the Record screens (PI-02 / PI-03). Real getUserMedia + MediaRecorder where the browser
 * has them; graceful otherwise (permission denied, no device, no MediaRecorder) — the screens then show the still frame as
 * drawn and nothing breaks. Returns { stream, elapsed, error, request, stop, discard }.
 *   request()  asks for permission, resolves true when a live stream is running
 *   stop()     stops recording, resolves { name, size, url, seconds } (or null when nothing was recorded)
 */
export const usePitchCapture = () => {
  const [stream, setStream] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState(null);
  const recRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const streamRef = useRef(null);

  const release = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setStream(null);
  }, []);

  useEffect(() => () => release(), [release]);

  const request = useCallback(async () => {
    log('request camera');
    if (!navigator.mediaDevices?.getUserMedia) {
      log('branch: getUserMedia unavailable');
      setError('unavailable');
      return false;
    }
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      log('stream ready', s.getTracks().length);
      streamRef.current = s;
      setStream(s);
      setError(null);
      if (typeof MediaRecorder !== 'undefined') {
        chunksRef.current = [];
        const rec = new MediaRecorder(s);
        rec.ondataavailable = (e) => e.data.size && chunksRef.current.push(e.data);
        rec.start();
        recRef.current = rec;
      } else {
        log('branch: MediaRecorder unavailable');
      }
      setElapsed(0);
      timerRef.current = setInterval(() => setElapsed((n) => n + 1), 1000);
      return true;
    } catch (err) {
      log.error('getUserMedia failed', err?.name);
      setError(err?.name ?? 'error');
      return false;
    }
  }, []);

  const stop = useCallback(
    () =>
      new Promise((resolve) => {
        const seconds = elapsed;
        const rec = recRef.current;
        recRef.current = null;
        if (!rec || rec.state === 'inactive') {
          release();
          resolve(null);
          return;
        }
        rec.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: rec.mimeType || 'video/webm' });
          log('recorded', blob.size);
          release();
          resolve({
            name: 'pitch-recording.webm',
            size: blob.size,
            url: URL.createObjectURL(blob),
            seconds,
          });
        };
        rec.stop();
      }),
    [elapsed, release]
  );

  return { stream, elapsed, error, request, stop };
};
