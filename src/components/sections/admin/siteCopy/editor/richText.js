import { PRODUCT_NAME_CHIPS } from './sectionEditorData.js';

/*
 * richText — the small rich-text model of the Site copy editor (Platform Admin 7.8.2c-2f, 2i, 2n). A rich value is a restricted HTML string:
 *   <b> <i> <ul><li> <ol><li> <br> <a href> and product-name chips <span data-chip="Career Buddy"></span> — nothing else.
 * Everything that comes from outside (paste, a stored draft) goes through `cleanHtml`, which drops every other tag, class and style and
 * reports whether it removed anything (frame 7.8.2i: "You pasted text from another app…").
 * ⚠️ ASSUMPTION: a product-name chip can also be typed or pasted as {{Name}} (that is how an unknown name such as {{Vault}} can reach the page,
 * frame 7.8.2n); it turns into a chip, red when the name is not in Product names.
 */

export const KNOWN_NAMES = PRODUCT_NAME_CHIPS.map((c) => c.name);

export const isKnownName = (name) =>
  KNOWN_NAMES.some((n) => n.toLowerCase() === String(name).toLowerCase());

/** The canonical spelling of a known product name, or the text as typed. */
export const canonicalName = (name) =>
  KNOWN_NAMES.find((n) => n.toLowerCase() === String(name).toLowerCase()) ?? String(name);

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** A link is accepted when it starts with https://, mailto:, tel: or is a page on GTH like /pricing (frame 7.8.2e). */
export const isValidLink = (url) =>
  /^(https:\/\/\S+|mailto:\S+|tel:\S+|\/[^\s/]\S*|\/)$/i.test(String(url).trim());

export const LINK_ERROR =
  'Links must start with https://, mailto:, tel: or a page on GTH like /pricing';

export const lengthError = (max) =>
  `Keep this under ${max} characters. This change isn’t saved until it fits.`;

export const chipError = (name) =>
  `“${name}” isn’t in Product names, so it can’t be saved. Pick a name from Insert name, or type it as plain text.`;

const NAME_TOKEN = /\{\{\s*([^{}]+?)\s*\}\}/g;

/** Turn {{Name}} tokens of a plain text run into chip markup. */
const tokensToChips = (text) => {
  let out = '';
  let last = 0;
  text.replace(NAME_TOKEN, (m, name, idx) => {
    out += esc(text.slice(last, idx));
    out += `<span data-chip="${esc(canonicalName(name))}"></span>`;
    last = idx + m.length;
    return m;
  });
  return out + esc(text.slice(last));
};

const BLOCKS = new Set(['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'BLOCKQUOTE', 'PRE', 'TR']);
const DROP = new Set(['SCRIPT', 'STYLE', 'META', 'LINK', 'HEAD', 'TITLE', 'NOSCRIPT', 'TEMPLATE']);

/**
 * Clean any HTML (a paste, a stored value) into the restricted markup. Returns { html, removed } — `removed` is true when something
 * other than bold, italic, lists, links, line breaks and chips was thrown away (fonts, colours, classes, headings, tables, bad links …).
 */
export const cleanHtml = (input) => {
  const doc = new DOMParser().parseFromString(`<body>${input ?? ''}</body>`, 'text/html');
  let removed = false;

  const walk = (node, ctx) => {
    let out = '';
    node.childNodes.forEach((child) => {
      if (child.nodeType === 3) {
        out += tokensToChips(child.nodeValue.replace(/\u00a0/g, ' '));
        return;
      }
      if (child.nodeType !== 1) {
        if (child.nodeType !== 8) removed = true;
        return;
      }
      const tag = child.tagName;
      if (DROP.has(tag)) {
        removed = true;
        return;
      }
      const attrs = [...child.attributes].map((a) => a.name);
      const plainAttrs = attrs.every(
        (a) => a === 'href' || a === 'data-chip' || a === 'contenteditable'
      );
      if (tag === 'SPAN' && child.hasAttribute('data-chip')) {
        out += `<span data-chip="${esc(canonicalName(child.getAttribute('data-chip')))}"></span>`;
        return;
      }
      if (tag === 'B' || tag === 'STRONG') {
        if (!plainAttrs) removed = true;
        const inner = walk(child, ctx);
        out += inner ? `<b>${inner}</b>` : '';
        return;
      }
      if (tag === 'I' || tag === 'EM') {
        if (!plainAttrs) removed = true;
        const inner = walk(child, ctx);
        out += inner ? `<i>${inner}</i>` : '';
        return;
      }
      if (tag === 'BR') {
        out += '<br>';
        return;
      }
      if (tag === 'UL' || tag === 'OL') {
        if (!plainAttrs) removed = true;
        const items = walk(child, { ...ctx, list: true });
        out += items ? `<${tag.toLowerCase()}>${items}</${tag.toLowerCase()}>` : '';
        return;
      }
      if (tag === 'LI') {
        if (!plainAttrs) removed = true;
        out += `<li>${walk(child, ctx).replace(/(<br>)+$/, '')}</li>`;
        return;
      }
      if (tag === 'A') {
        const href = child.getAttribute('href') ?? '';
        const inner = walk(child, ctx);
        if (isValidLink(href)) {
          if (attrs.some((a) => a !== 'href')) removed = true;
          out += `<a href="${esc(href.trim())}">${inner}</a>`;
        } else {
          removed = true;
          out += inner;
        }
        return;
      }
      // Anything else (span, font, h1 …) keeps its words but loses its look.
      removed = true;
      const inner = walk(child, ctx);
      if (BLOCKS.has(tag)) {
        out += inner ? `${inner}<br>` : '';
      } else {
        out += inner;
      }
    });
    return out;
  };

  let html = walk(doc.body, {});
  html = html
    .replace(/(<br>)+$/g, '')
    .replace(/^(<br>)+/g, '')
    .replace(/(<br>){3,}/g, '<br><br>');
  return { html, removed };
};

/** The text of a rich value with chips as their names (line breaks and list items as spaces). */
export const toPlainText = (html) => {
  const doc = new DOMParser().parseFromString(`<body>${html ?? ''}</body>`, 'text/html');
  doc.body.querySelectorAll('span[data-chip]').forEach((el) => {
    el.textContent = el.getAttribute('data-chip');
  });
  doc.body.querySelectorAll('br,li').forEach((el) => el.after(doc.createTextNode(' ')));
  return doc.body.textContent.replace(/\s+/g, ' ').trim();
};

/** Characters counted against the limit: the visible text, a chip counting as its name. */
export const countChars = (value, kind) => {
  if (kind === 'rich') {
    const doc = new DOMParser().parseFromString(`<body>${value ?? ''}</body>`, 'text/html');
    doc.body.querySelectorAll('span[data-chip]').forEach((el) => {
      el.textContent = el.getAttribute('data-chip');
    });
    doc.body.querySelectorAll('br').forEach((el) => el.replaceWith(doc.createTextNode('\n')));
    return doc.body.textContent.length;
  }
  return String(value ?? '').length;
};

/** The unknown product names inside a rich value. */
export const unknownChips = (html) => {
  const names = [];
  String(html ?? '').replace(/data-chip="([^"]*)"/g, (m, n) => {
    const name = n.replace(/&quot;/g, '"').replace(/&amp;/g, '&');
    if (!isKnownName(name)) names.push(name);
    return m;
  });
  return names;
};

/** Do two values count as the same text (rich markup compared after cleaning)? */
export const sameValue = (a, b, kind) =>
  kind === 'rich' ? cleanHtml(a ?? '').html === cleanHtml(b ?? '').html : (a ?? '') === (b ?? '');
