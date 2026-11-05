import { canonicalName, cleanHtml, isKnownName } from './richText.js';

/*
 * chipDom — product-name chips inside the contenteditable of the rich-text editor (frames 7.8.2f chip, 7.8.2n unknown chip). The stored markup
 * keeps a bare <span data-chip="Name"></span>; the editor shows it as a pill (tag icon + name, green; red with a warning icon when the name
 * is not in Product names). Glyph paths are the Figma 20-label / 20-warning exports (see siteCopyIcons.jsx / EditorIcons.jsx).
 */
const LABEL_PATH =
  'M13.7938 5.54818C13.6444 5.50654 13.4709 5.50007 12.8379 5.50007H5.00067C4.41956 5.50007 4.02814 5.50064 3.7264 5.52491C3.43308 5.5485 3.29057 5.59081 3.19557 5.63845C2.95343 5.75991 2.75877 5.95256 2.63751 6.18684C2.59117 6.27637 2.54886 6.41233 2.52511 6.69851C2.5006 6.9938 2.5 7.37745 2.5 7.95007V12.0501C2.5 12.6227 2.5006 13.0063 2.52511 13.3016C2.54886 13.5878 2.59117 13.7238 2.63751 13.8133C2.75877 14.0476 2.95343 14.2402 3.19557 14.3617C3.29057 14.4093 3.43308 14.4516 3.7264 14.4752C4.02814 14.4995 4.41956 14.5001 5.00067 14.5001H12.8379C13.4709 14.5001 13.6444 14.4936 13.7938 14.452C13.9466 14.4094 14.0895 14.3396 14.2155 14.2465C14.3378 14.1561 14.4465 14.0266 14.8305 13.5304L17.1677 10.5107C17.3086 10.3286 17.3899 10.2228 17.4452 10.1396C17.4784 10.0899 17.4895 10.0663 17.4923 10.0597C17.5026 10.0205 17.5026 9.97962 17.4923 9.94044C17.4895 9.93381 17.4784 9.9103 17.4452 9.86051C17.3899 9.77732 17.3086 9.67151 17.1677 9.48945L14.8305 6.46978C14.4465 5.97357 14.3378 5.844 14.2155 5.75367C14.0895 5.66058 13.9466 5.59077 13.7938 5.54818ZM17.4931 9.94247C17.493 9.94246 17.4926 9.94145 17.4923 9.94044ZM17.4931 10.0577C17.4931 10.0577 17.4928 10.0586 17.4923 10.0597ZM12.9247 4.00004C13.4306 3.99971 13.8241 3.99946 14.1965 4.10326C14.5245 4.19468 14.8332 4.34503 15.1068 4.5472C15.4181 4.77712 15.6579 5.08744 15.9638 5.48321C15.9812 5.50575 15.9989 5.52858 16.0167 5.55169L18.3539 8.57136C18.3719 8.59463 18.3901 8.61803 18.4084 8.64156C18.6206 8.91399 18.8472 9.205 18.9397 9.5466C19.0201 9.84366 19.0201 10.1565 18.9397 10.4535C18.8472 10.7951 18.6206 11.0862 18.4084 11.3586C18.3901 11.3821 18.3719 11.4055 18.3539 11.4288L16.0167 14.4485C15.9989 14.4716 15.9812 14.4944 15.9638 14.517C15.6579 14.9127 15.418 15.223 15.1068 15.4529C14.8332 15.6551 14.5245 15.8055 14.1965 15.8969C13.8241 16.0007 13.4306 16.0004 12.9247 16.0001C12.8962 16.0001 12.8672 16.0001 12.8379 16.0001H4.97055C4.42725 16.0001 3.97518 16.0001 3.60614 15.9704C3.2219 15.9395 2.86265 15.8728 2.52305 15.7025C2.00062 15.4404 1.57368 15.0212 1.30537 14.5028C1.13027 14.1645 1.06186 13.8065 1.03025 13.4257C0.99998 13.061 0.999989 12.6147 1 12.0809V7.91924C0.999989 7.38543 0.99998 6.93916 1.03025 6.57444C1.06186 6.19361 1.13027 5.83563 1.30537 5.49734C1.57368 4.97897 2.00062 4.55971 2.52305 4.29766C2.86265 4.12733 3.2219 4.06064 3.60614 4.02973C3.97518 4.00005 4.42725 4.00006 4.97056 4.00007L12.8379 4.00007C12.8672 4.00007 12.8962 4.00005 12.9247 4.00004Z';
const WARNING_PATH =
  'M11.1621 4.14695C10.6544 3.28435 9.3469 3.28435 8.83915 4.14695L2.6724 14.6236C2.19959 15.4269 2.77389 16.5 3.83388 16.5H16.1674C17.2274 16.5 17.8017 15.4269 17.3289 14.6236L11.1621 4.14695ZM7.54647 3.38605C8.63428 1.53798 11.367 1.53799 12.4548 3.38605L18.6215 13.8627C19.7275 15.7416 18.2988 18 16.1674 18H3.83388C1.70249 18 0.273774 15.7416 1.37972 13.8627L7.54647 3.38605ZM10.0006 6C10.4148 6 10.7506 6.33579 10.7506 6.75L10.7506 10.25C10.7506 10.6642 10.4148 11 10.0006 11C9.58642 11 9.25063 10.6642 9.25063 10.25L9.25063 6.75C9.25063 6.33579 9.58642 6 10.0006 6ZM10.0006 12C10.4148 12 10.7506 12.3358 10.7506 12.75V14.25C10.7506 14.6642 10.4148 15 10.0006 15C9.58642 15 9.25063 14.6642 9.25063 14.25V12.75C9.25063 12.3358 9.58642 12 10.0006 12Z';

const svg = (path, size) =>
  `<svg viewBox="0 0 20 20" width="${size}" height="${size}" fill="none" aria-hidden="true" class="shrink-0"><path d="${path}" fill-rule="evenodd" clip-rule="evenodd" fill="currentColor"/></svg>`;

const KNOWN_CLASS =
  'mx-[1px] inline-flex h-[21px] select-none items-center gap-[4px] rounded-[6px] border border-solid border-[#387440]/50 bg-[#ebf1ec]/50 py-[1px] pr-[6px] pl-[7px] align-baseline text-[14px] leading-[17px] font-semibold text-[#2a5730]';
const UNKNOWN_CLASS =
  'mx-[1px] inline-flex h-[21px] select-none items-center gap-[4px] rounded-[6px] border border-solid border-[#c0392b] bg-[#f9ebea]/50 py-[1px] pr-[6px] pl-[7px] align-baseline text-[14px] leading-[17px] font-semibold text-[#c0392b]';

const escAttr = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/** The visible pill markup of a chip. */
export const chipMarkup = (name) => {
  const known = isKnownName(name);
  return `<span data-chip="${escAttr(name)}" data-chip-state="${known ? 'known' : 'unknown'}" contenteditable="false" class="${known ? KNOWN_CLASS : UNKNOWN_CLASS}">${svg(known ? LABEL_PATH : WARNING_PATH, 12)}<span>${escAttr(name)}</span></span>`;
};

/** Stored markup -> editable markup (chips drawn as pills). */
export const toEditable = (html) =>
  String(html ?? '').replace(/<span data-chip="([^"]*)"><\/span>/g, (m, n) =>
    chipMarkup(
      n
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
    )
  );

/** Editable DOM -> stored markup (clean, chips back to bare spans). */
export const fromEditable = (root) => {
  const clone = root.cloneNode(true);
  clone.querySelectorAll('span[data-chip]').forEach((el) => {
    const bare = document.createElement('span');
    bare.setAttribute('data-chip', canonicalName(el.getAttribute('data-chip')));
    el.replaceWith(bare);
  });
  return cleanHtml(clone.innerHTML).html;
};
