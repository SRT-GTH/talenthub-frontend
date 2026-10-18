import { debug } from '../../../utils/debug.js';
import { CARD_PERSON, CARD_STYLE_TOKENS, QR_ROWS, QR_SIZE } from './talentProfileShareData.js';

const log = debug('ShareProfileFile');

/*
 * Local mock "backend" for the share flow: clipboard, file downloads (QR PNG, card PNG, CV PDF) and the
 * persisted custom slug. Nothing leaves the browser. Each helper never throws — callers get a boolean.
 */

export const copyText = async (text) => {
  log('copy', { chars: String(text).length });
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    log.warn('clipboard API failed, trying fallback', err?.message);
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch (err) {
    log.error('copy failed', err);
    return false;
  }
};

const saveBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1500);
  log('download', { filename, bytes: blob.size });
};

const drawQr = (ctx, x, y, size, ink = '#1c2a21') => {
  const cell = size / QR_SIZE;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x, y, size, size);
  ctx.fillStyle = ink;
  QR_ROWS.forEach((cols, row) => {
    cols.forEach((col) => ctx.fillRect(x + col * cell, y + row * cell, cell + 0.5, cell + 0.5));
  });
};

const canvasToPng = (canvas, filename) =>
  new Promise((resolve) => {
    try {
      canvas.toBlob((blob) => {
        if (!blob) return resolve(false);
        saveBlob(blob, filename);
        resolve(true);
      }, 'image/png');
    } catch (err) {
      log.error('png export failed', err);
      resolve(false);
    }
  });

/* "Download PNG ↓" on the QR card. */
export const downloadQrPng = (filename = 'gth-profile-qr.png') => {
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 600;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 600, 600);
  drawQr(ctx, 40, 40, 520);
  return canvasToPng(canvas, filename);
};

const SIZES = { story: [1080, 1920], post: [1080, 1080], banner: [1584, 396] };

/* Simplified canvas render of the share card (the on-screen card is DOM art; this is the exported file). */
export const downloadCardPng = ({ style, size, filename }) => {
  const [w, h] = SIZES[size] ?? SIZES.story;
  const tokens = CARD_STYLE_TOKENS[style] ?? CARD_STYLE_TOKENS.forest;
  const light = style === 'sunshine';
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = tokens.bg;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = light ? '#1c2a21' : '#ffffff';
  ctx.font = `600 ${Math.round(Math.min(w, h) * 0.11)}px "SF Pro Rounded", system-ui, sans-serif`;
  ctx.textBaseline = 'top';
  if (size === 'banner') {
    ctx.fillText(CARD_PERSON.fullName, 400, 70);
    ctx.font = '600 34px "SF Pro Rounded", system-ui, sans-serif';
    ctx.fillText(CARD_PERSON.bannerHeadline, 400, 190);
    drawQr(ctx, w - 330, 60, 270);
  } else {
    const top = Math.round(h * 0.2);
    ctx.fillText(CARD_PERSON.firstName, 80, top);
    ctx.fillText(CARD_PERSON.lastName, 80, top + Math.round(Math.min(w, h) * 0.13));
    ctx.font = '600 44px "SF Pro Rounded", system-ui, sans-serif';
    ctx.fillText(CARD_PERSON.headline, 80, top + Math.round(Math.min(w, h) * 0.28));
    ctx.fillStyle = '#ffffff';
    const footerH = 220;
    ctx.fillRect(80, h - footerH - 80, w - 160, footerH);
    drawQr(ctx, 100, h - footerH - 60, 180);
    ctx.fillStyle = '#1c2a21';
    ctx.font = '700 44px "SF Pro Rounded", system-ui, sans-serif';
    ctx.fillText(CARD_PERSON.brand, 320, h - footerH - 20);
    ctx.fillStyle = '#387440';
    ctx.font = '500 36px "SF Pro Rounded", system-ui, sans-serif';
    ctx.fillText(CARD_PERSON.url, 320, h - footerH + 50);
  }
  return canvasToPng(canvas, filename);
};

/* A tiny single-page PDF (Helvetica text) so "Download CV (PDF)" really downloads a file. */
export const downloadCvPdf = ({ lines, filename = 'kofi-agyekum-cv.pdf' }) => {
  const esc = (s) => s.replace(/[\\()]/g, '\\$&').replace(/[^\x20-\x7e]/g, '?');
  const content = [
    'BT /F1 20 Tf 56 780 Td',
    ...lines.map((line, i) => `${i === 0 ? '' : '0 -22 Td '}(${esc(line)}) Tj`),
    'ET',
  ].join('\n');
  const objs = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>',
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  ];
  let pdf = '%PDF-1.4\n';
  const offsets = [];
  objs.forEach((o, i) => {
    offsets.push(pdf.length);
    pdf += `${i + 1} 0 obj\n${o}\nendobj\n`;
  });
  const xref = pdf.length;
  pdf += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n`;
  offsets.forEach((o) => {
    pdf += `${String(o).padStart(10, '0')} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  saveBlob(new Blob([pdf], { type: 'application/pdf' }), filename);
  return true;
};

/* The saved custom link (mock persistence — swap for an API call). */
const SLUG_KEY = 'gth:profile-slug';
export const readSavedSlug = (fallback) => {
  try {
    return window.sessionStorage.getItem(SLUG_KEY) || fallback;
  } catch {
    return fallback;
  }
};
export const saveSlug = (slug) => {
  try {
    window.sessionStorage.setItem(SLUG_KEY, slug);
  } catch {
    /* storage can be blocked (private mode) — the in-memory flow still works */
  }
};
