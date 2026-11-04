import { useCallback, useEffect, useRef, useState } from 'react';
import { debug } from '../../../../../utils/debug.js';
import { MEDIA_MAX_DOCUMENT_BYTES, MEDIA_MAX_IMAGE_BYTES } from './mediaLibraryData.js';
import {
  FAKE_IMAGE_MESSAGE,
  kindOfName,
  refusedByName,
  tooLargeMessage,
} from './mediaLibraryModel.js';

const log = debug('useMediaUploads');

/*
 * useMediaUploads — the upload session of the Media library (Platform Admin 7.8.9b-d): files picked or dropped are checked (extension, size, and the real
 * file signature so a renamed file is refused as "This file isn’t really an image", 7.8.9d), the accepted ones get a simulated upload progress bar
 * (⚠️ ASSUMPTION: nothing is sent anywhere; progress is mock) and, for images, their real width / height and a downscaled preview (≤ 1000 px, JPEG data URL
 * so the sessionStorage-backed list stays small). Returns { queue, refused, addFiles, completeAll, discard, clearRefused, update }.
 * queue item: { id, name, bytes, kind, format, progress, held, status 'uploading' | 'done', src, width, height, title, alt, pages }.
 */
const SIGNATURES = {
  jpg: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  jpeg: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  png: (b) => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47,
  gif: (b) => b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x38,
  webp: (b) =>
    String.fromCharCode(...b.slice(0, 4)) === 'RIFF' &&
    String.fromCharCode(...b.slice(8, 12)) === 'WEBP',
  avif: (b) => String.fromCharCode(...b.slice(4, 8)) === 'ftyp',
  pdf: (b) => String.fromCharCode(...b.slice(0, 4)) === '%PDF',
};

const extOf = (name) => (String(name).split('.').pop() || '').toLowerCase();

const readHead = async (file) => {
  try {
    return new Uint8Array(await file.slice(0, 16).arrayBuffer());
  } catch {
    return new Uint8Array(16);
  }
};

export const describeImageFile = (file) =>
  new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const { naturalWidth: width, naturalHeight: height } = img;
      let src = url;
      try {
        const scale = Math.min(1, 1000 / Math.max(width, height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(width * scale));
        canvas.height = Math.max(1, Math.round(height * scale));
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        src = canvas.toDataURL('image/jpeg', 0.8);
        URL.revokeObjectURL(url);
      } catch (err) {
        log.error('preview failed, keeping the object URL', err);
      }
      resolve({ width, height, src });
    };
    img.onerror = () => resolve({ width: 0, height: 0, src: url });
    img.src = url;
  });

const titleOf = (name) =>
  String(name)
    .replace(/\.[a-z0-9]+$/i, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^./, (c) => c.toUpperCase());

let counter = 0;

export const useMediaUploads = (initial = {}) => {
  const [queue, setQueue] = useState(initial.queue ?? []);
  const [refused, setRefused] = useState(initial.refused ?? []);
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  // Simulated progress: one tick every 160 ms until 100 %.
  const running = queue.some((q) => q.status === 'uploading' && !q.held);
  useEffect(() => {
    if (!running) return undefined;
    const t = setInterval(() => {
      setQueue((list) =>
        list.map((q) => {
          if (q.status !== 'uploading' || q.held) return q;
          const progress = Math.min(100, q.progress + 6 + Math.round(Math.random() * 10));
          return progress >= 100 ? { ...q, progress: 100, status: 'done' } : { ...q, progress };
        })
      );
    }, 160);
    return () => clearInterval(t);
  }, [running]);

  const addFiles = useCallback(async (fileList) => {
    const files = Array.from(fileList ?? []);
    log(
      'files picked',
      files.map((f) => `${f.name} (${f.size} B)`)
    );
    const bad = [];
    const good = [];
    for (const file of files) {
      const byName = refusedByName(file.name);
      if (byName) {
        log('refused by type', file.name);
        bad.push({ name: file.name, message: byName });
        continue;
      }
      const kind = kindOfName(file.name);
      const ext = extOf(file.name);
      const head = await readHead(file);
      if (!SIGNATURES[ext]?.(head)) {
        log('refused by signature', file.name);
        bad.push({
          name: file.name,
          message:
            kind === 'document'
              ? FAKE_IMAGE_MESSAGE.replace('an image', 'a PDF')
              : FAKE_IMAGE_MESSAGE,
        });
        continue;
      }
      if (file.size > (kind === 'document' ? MEDIA_MAX_DOCUMENT_BYTES : MEDIA_MAX_IMAGE_BYTES)) {
        log('refused by size', file.name);
        bad.push({ name: file.name, message: tooLargeMessage(kind) });
        continue;
      }
      good.push({ file, kind, ext });
    }
    const items = await Promise.all(
      good.map(async ({ file, kind, ext }) => {
        counter += 1;
        const meta =
          kind === 'image'
            ? await describeImageFile(file)
            : { width: null, height: null, src: null };
        return {
          id: `up-${Date.now()}-${counter}`,
          name: file.name,
          bytes: file.size,
          kind,
          format: ext === 'jpeg' ? 'JPG' : ext.toUpperCase(),
          progress: 0,
          held: false,
          status: 'uploading',
          title: titleOf(file.name),
          alt: '',
          pages: kind === 'document' ? Math.max(1, Math.round(file.size / 180_000)) : null,
          ...meta,
        };
      })
    );
    if (!alive.current) return { added: 0, refused: bad.length };
    if (items.length) setQueue((q) => [...q, ...items]);
    if (bad.length) setRefused(bad);
    log('queued', items.length, 'refused', bad.length);
    return { added: items.length, refused: bad.length };
  }, []);

  const completeAll = useCallback(() => {
    setQueue((list) => list.map((q) => ({ ...q, progress: 100, held: false, status: 'done' })));
  }, []);
  const discard = useCallback(() => setQueue([]), []);
  const clearRefused = useCallback(() => setRefused([]), []);
  const update = useCallback(
    (id, patch) => setQueue((list) => list.map((q) => (q.id === id ? { ...q, ...patch } : q))),
    []
  );
  const remove = useCallback((id) => setQueue((list) => list.filter((q) => q.id !== id)), []);

  return {
    queue,
    refused,
    addFiles,
    completeAll,
    discard,
    clearRefused,
    update,
    remove,
    setQueue,
    setRefused,
  };
};
