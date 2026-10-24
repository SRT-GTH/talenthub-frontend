import api from './api.js';
import { ensureEngagementId } from './assessment.api.js';
import { debug } from '../utils/debug.js';

const log = debug('videoPitch.api');

/*
 * Video pitch (engagement stage 9, Record / Upload modes).
 *
 *   POST   /media/upload                          multipart: file + type=video, entityType=talent, category=video_pitch
 *                                                 → { success, file: { id, url, format, resourceType, size, width, height } }
 *   POST   /engagement/video-pitch                { engagementId, videoUrl, duration, format, fileSizeMB, thumbnailUrl?, title? }
 *                                                 records collectedData.video_pitch (the journey counts it as the Pitch stage)
 *   GET    /engagement/video-pitch/:engagementId  the current video pitch (or none)
 *   DELETE /engagement/video-pitch                removes it
 *
 * The backend accepts mp4 / mov / avi / webm up to 100 MB and 15–120 s (duration is measured on the client: the upload
 * response carries none). upload-base64 is not used (broken server side).
 */
export const PITCH_MIN_SECONDS = 15;
export const PITCH_MAX_SECONDS = 120;
export const PITCH_MAX_BYTES = 100 * 1024 * 1024;
// AVI is accepted by the backend but browsers can't read its duration, so the picker leaves it out.
export const PITCH_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/webm'];
const PITCH_VIDEO_EXT = /\.(mp4|mov|webm)$/i;

const unwrap = (res) => (res?.data?.data !== undefined ? res.data.data : res?.data);

/* Client-side checks before anything is sent. Returns a talent-facing message, or null when the file is fine. */
export const pitchFileProblem = ({ type, name, size }) => {
  if (!(PITCH_VIDEO_TYPES.includes(type) || PITCH_VIDEO_EXT.test(name || '')))
    return 'That file isn’t a video we can use. Choose an MP4, MOV, WebM or AVI file.';
  if (size > PITCH_MAX_BYTES)
    return `That video is ${(size / (1024 * 1024)).toFixed(0)} MB. Pitch videos can be up to 100 MB, so trim it or save it at a lower quality.`;
  if (!size) return 'That video is empty. Choose another file.';
  return null;
};

export const pitchDurationProblem = (seconds) => {
  if (!Number.isFinite(seconds) || seconds <= 0)
    return 'We couldn’t read how long that video is. Try another file, or save it as an MP4.';
  if (seconds < PITCH_MIN_SECONDS)
    return `Your pitch is ${Math.round(seconds)} seconds long. It needs to be at least ${PITCH_MIN_SECONDS} seconds, so add a little more and try again.`;
  if (seconds > PITCH_MAX_SECONDS)
    return `Your pitch is ${Math.round(seconds)} seconds long. Keep it to 2 minutes (${PITCH_MAX_SECONDS} seconds) or less.`;
  return null;
};

/*
 * Upload the video file (File or Blob) to media storage. onProgress(0–100) follows the bytes sent.
 * Resolves { id, url, format, size }. The instance's JSON Content-Type is replaced with multipart/form-data so axios
 * sends the FormData as-is; the browser then writes the real header (with its boundary) itself.
 */
export const uploadPitchVideo = async (file, { onProgress, name } = {}) => {
  const form = new FormData();
  // Fields BEFORE the file: the backend's multipart parser streams the file to the action as soon as it arrives, so
  // fields sent after it never reach ctx.meta.$multipart ("entityType and category are required").
  form.append('type', 'video');
  form.append('entityType', 'talent');
  form.append('category', 'video_pitch');
  form.append('file', file, name || file.name || 'pitch-recording.webm');
  log('upload', { bytes: file.size, type: file.type });
  const res = await api.post('/media/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 10 * 60 * 1000, // up to 100 MB on a slow line
    onUploadProgress: (e) => {
      if (onProgress && e.total) onProgress(Math.min(100, Math.round((e.loaded / e.total) * 100)));
    },
  });
  // A moleculer-web multipart alias answers with one result per uploaded file (an array), so take the first.
  const body = Array.isArray(res?.data) ? res.data[0] : res?.data;
  const data = body?.data !== undefined ? body.data : body;
  const uploaded = data?.file || body?.file;
  if (!uploaded?.url) throw new Error('Upload response has no file url');
  log('uploaded', { id: uploaded.id, format: uploaded.format, size: uploaded.size });
  return uploaded;
};

/* Normalise whatever shape the engagement endpoints answer with to { url, duration, format, fileSizeMB, thumbnailUrl, title }. */
const toPitch = (raw) => {
  const v = raw?.videoPitch ?? raw?.video_pitch ?? raw?.pitch ?? raw;
  const url = v?.videoUrl || v?.url;
  if (!url) return null;
  return {
    url,
    duration: Number(v.duration) || null,
    format: v.format || null,
    fileSizeMB: Number(v.fileSizeMB) || null,
    thumbnailUrl: v.thumbnailUrl || null,
    title: v.title || null,
    createdAt: v.uploadedAt || v.createdAt || v.submittedAt || null,
  };
};

/* Record the uploaded video as the talent's pitch. Resolves the saved pitch (falls back to what was sent). */
export const submitVideoPitch = async ({
  videoUrl,
  duration,
  format,
  fileSizeMB,
  thumbnailUrl,
  title,
}) => {
  const engagementId = await ensureEngagementId();
  const body = { engagementId, videoUrl, duration, format, fileSizeMB };
  if (thumbnailUrl) body.thumbnailUrl = thumbnailUrl;
  if (title) body.title = title;
  log('submit', { duration, format, fileSizeMB });
  const data = unwrap(await api.post('/engagement/video-pitch', body));
  return toPitch(data) || toPitch(body);
};

/* The talent's current video pitch, or null when there is none (404 counts as none). Other failures throw. */
export const fetchVideoPitch = async () => {
  const engagementId = await ensureEngagementId();
  try {
    const pitch = toPitch(
      unwrap(await api.get(`/engagement/video-pitch/${encodeURIComponent(engagementId)}`))
    );
    log('fetched', { found: Boolean(pitch) });
    return pitch;
  } catch (err) {
    if (err?.response?.status === 404) {
      log('fetched: none (404)');
      return null;
    }
    throw err;
  }
};

export const deleteVideoPitch = async () => {
  const engagementId = await ensureEngagementId();
  log('delete');
  await api.delete('/engagement/video-pitch', { data: { engagementId } });
};
