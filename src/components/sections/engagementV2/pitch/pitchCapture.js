import { useCallback, useEffect, useRef, useState } from 'react';
import { debug } from '../../../../utils/debug.js';

const log = debug('pitchCapture');

/* Recording auto-stops here (the design's "up to 60 seconds"); the backend accepts 15–120 s (see videoPitch.api.js). */
export const MAX_PITCH_SECONDS = 60;

/*
 * Camera + microphone capture for the Record screens (PI-02 / PI-03). Real getUserMedia + MediaRecorder where the browser
 * has them; graceful otherwise (permission denied, no device, no MediaRecorder) — the screens then show the still frame as
 * drawn and nothing breaks. Returns { stream, elapsed, error, request, stop, discard }.
 *   request()  asks for permission, resolves true when a live stream is running
 *   stop()     stops recording, resolves { name, size, url, seconds, blob, type } (or null when nothing was recorded;
 *              seconds is the on-screen timer: MediaRecorder WebM files carry no duration of their own)
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
            blob,
            type: blob.type,
          });
        };
        rec.stop();
      }),
    [elapsed, release]
  );

  return { stream, elapsed, error, request, stop };
};

/*
 * Duration (seconds) of a video file, read from a detached <video> on loadedmetadata. Files whose header carries no
 * duration (Infinity, e.g. browser-recorded WebM) are seeked far past the end so the browser works it out. Resolves
 * null when the browser can't read the file or takes longer than 15 s.
 */
export const readVideoDuration = (url) =>
  new Promise((resolve) => {
    const video = document.createElement('video');
    let done = false;
    const finish = (value) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      video.removeAttribute('src');
      video.load();
      log('duration', value);
      resolve(value);
    };
    const timer = setTimeout(() => finish(null), 15000);
    video.preload = 'metadata';
    video.muted = true;
    video.onerror = () => finish(null);
    video.onloadedmetadata = () => {
      if (Number.isFinite(video.duration) && video.duration > 0) {
        finish(video.duration);
        return;
      }
      video.ontimeupdate = () => {
        if (Number.isFinite(video.duration) && video.duration > 0) finish(video.duration);
      };
      video.currentTime = 1e7;
    };
    video.src = url;
  });
