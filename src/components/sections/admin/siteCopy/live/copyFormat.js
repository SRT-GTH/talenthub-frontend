import { fromStoredText, toStoredText } from '../../../../../copy/copySections.js';
/*
 * copyFormat — the translation between the Site copy screens and the backend (srt-backend utils/platformCopy.js).
 *
 *   ids     screen section ids are kebab-case (`public.home.how-it-works`); backend keys are lower camel, dot separated
 *           (`public.home.howItWorks`, KEY_RE). Field keys likewise (`primary_cta` → `primaryCta`, PATH_RE).
 *   rich    the editor keeps rich text as restricted HTML (<b> <i> <ul>/<ol><li> <br> <a href> and name chips
 *           <span data-chip="Career Buddy"></span>, see editor/richText.js); the backend refuses HTML and keeps a restricted
 *           Markdown: **bold**, _italic_, "- " / "1. " list lines, [label](url), line breaks, and name tokens {assistant},
 *           {assistant.short}, {community.plural}. htmlToMd / mdToHtml convert one into the other (round trip is stable for the
 *           markup cleanHtml produces).
 */

const camelSeg = (s) => String(s).replace(/[-_]+([a-zA-Z0-9])/g, (_, c) => c.toUpperCase());
const kebabSeg = (s) =>
  String(s)
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase();

/** Screen section id → backend copy key. */
export const toCopyKey = (sectionId) => String(sectionId).split('.').map(camelSeg).join('.');
/** Screen field key → backend field path. */
export const toFieldPath = (fieldKey) => camelSeg(fieldKey);

// Ids the manifest registered, so the reverse mapping keeps the screen's own spelling (kebab or snake).
const sectionIds = new Map();
const fieldKeys = new Map();
export const rememberSection = (sectionId, fields = []) => {
  sectionIds.set(toCopyKey(sectionId), sectionId);
  fields.forEach((f) => fieldKeys.set(`${toCopyKey(sectionId)}#${toFieldPath(f.key)}`, f.key));
};
/** Backend copy key → screen section id. */
export const toSectionId = (key) =>
  sectionIds.get(key) ?? String(key).split('.').map(kebabSeg).join('.');
/** Backend field path of a block → screen field key. */
export const toFieldKey = (key, path) => fieldKeys.get(`${key}#${path}`) ?? path;

/* ------------------------------------------------------------------ name chips */

// Screen chip name → backend term token (backend DEFAULT_TERMS keys; forms name | short | plural).
export const CHIP_TOKENS = {
  'Career Buddy': 'assistant',
  Buddy: 'assistant.short',
  'Ghana Talent Hub': 'platform',
  GTH: 'platform.short',
  Community: 'community',
  Communities: 'community.plural',
  'My circle': 'circle',
  'Skills Lab': 'skillsLab',
  'Profile journey': 'journey',
  Wallet: 'wallet',
};
const TOKEN_CHIPS = Object.fromEntries(Object.entries(CHIP_TOKENS).map(([n, t]) => [t, n]));

/** Product name row id (names/productNamesData.js) → backend term key. */
export const NAME_TERMS = {
  'career-buddy': 'assistant',
  'ghana-talent-hub': 'platform',
  community: 'community',
  'my-circle': 'circle',
  'skills-lab': 'skillsLab',
  'profile-journey': 'journey',
  wallet: 'wallet',
};

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/* ------------------------------------------------------------- HTML → Markdown */

/** Restricted editor HTML → backend Markdown. Plain (non-rich) values pass through untouched. */
export const htmlToMd = (html) => {
  if (html === null || html === undefined) return html;
  const doc = new DOMParser().parseFromString(`<body>${html}</body>`, 'text/html');
  const nl = (out) => (out && !out.endsWith('\n') ? `${out}\n` : out);
  const walk = (node) => {
    let out = '';
    node.childNodes.forEach((c) => {
      if (c.nodeType === 3) {
        out += c.nodeValue.replace(/\u00a0/g, ' ');
        return;
      }
      if (c.nodeType !== 1) return;
      const tag = c.tagName;
      if (tag === 'SPAN' && c.hasAttribute('data-chip')) {
        const name = c.getAttribute('data-chip');
        const token = CHIP_TOKENS[name];
        out += token ? `{${token}}` : `{{${name}}}`;
      } else if (tag === 'B' || tag === 'STRONG') out += `**${walk(c)}**`;
      else if (tag === 'I' || tag === 'EM') out += `_${walk(c)}_`;
      else if (tag === 'BR') out += '\n';
      else if (tag === 'A') out += `[${walk(c)}](${c.getAttribute('href') ?? ''})`;
      else if (tag === 'UL' || tag === 'OL') {
        out = nl(out);
        let n = 0;
        c.childNodes.forEach((li) => {
          if (li.nodeType !== 1) return;
          n += 1;
          out += `${tag === 'OL' ? `${n}.` : '-'} ${walk(li).replace(/\n+/g, ' ').trim()}\n`;
        });
      } else out += walk(c);
    });
    return out;
  };
  return walk(doc.body)
    .replace(/\n{3,}/g, '\n\n')
    .replace(/^\n+|\n+$/g, '');
};

/* ------------------------------------------------------------- Markdown → HTML */

const inline = (text) => {
  const links = [];
  let s = String(text).replace(/\[([^\]\n]{1,120})\]\(([^)\s]{1,500})\)/g, (_, label, url) => {
    links.push({ label, url });
    return `\u0000${links.length - 1}\u0000`;
  });
  s = esc(s)
    .replace(/\{([a-z][a-zA-Z0-9]*(?:\.(?:name|short|plural))?)\}/g, (all, t) => {
      const name = TOKEN_CHIPS[t.replace(/\.name$/, '')];
      return name ? `<span data-chip="${esc(name)}"></span>` : all;
    })
    .replace(/\{\{\s*([^{}]+?)\s*\}\}/g, (_, n) => `<span data-chip="${esc(n)}"></span>`)
    .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
    .replace(/(^|[^\w])_([^_]+)_(?=[^\w]|$)/g, '$1<i>$2</i>');
  // eslint-disable-next-line no-control-regex
  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => {
    const l = links[Number(i)];
    return `<a href="${esc(l.url)}">${inline(l.label)}</a>`;
  });
};

/** Backend Markdown → the editor's restricted HTML. */
export const mdToHtml = (md) => {
  if (md === null || md === undefined) return md;
  const lines = String(md).replace(/\r\n/g, '\n').split('\n');
  let out = '';
  let list = null; // 'ul' | 'ol'
  let textOpen = false; // a text line was written and may need a <br> before the next one
  const close = () => {
    if (list) out += `</${list}>`;
    list = null;
  };
  lines.forEach((line) => {
    const ul = /^\s*[-*] (.*)$/.exec(line);
    const ol = /^\s*\d+[.)] (.*)$/.exec(line);
    if (ul || ol) {
      const kind = ul ? 'ul' : 'ol';
      if (list !== kind) {
        close();
        out += `<${kind}>`;
        list = kind;
      }
      out += `<li>${inline((ul || ol)[1])}</li>`;
      textOpen = false;
      return;
    }
    if (list) close();
    if (textOpen) out += '<br>';
    out += inline(line);
    textOpen = true;
  });
  close();
  return out.replace(/(<br>)+$/g, '');
};

/** Screen value → backend value for a field kind. */
export const toBackendValue = (field, value) => {
  if (value === null || value === undefined) return null;
  return field?.kind === 'rich' ? htmlToMd(value) : toStoredText(String(value));
};

/** Backend value → screen value for a field kind. */
export const fromBackendValue = (field, value) => {
  if (value === null || value === undefined) return value;
  return field?.kind === 'rich' ? mdToHtml(value) : fromStoredText(String(value));
};

/** "Today 15:12" · "Yesterday 17:40" · "28 Oct 14:02" (the History rows' style). */
export const whenLabel = (at, now = new Date()) => {
  if (!at) return '';
  const d = new Date(at);
  if (Number.isNaN(d.getTime())) return String(at);
  const hm = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  const day = (x) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diff = Math.round((day(now) - day(d)) / 86400000);
  if (diff === 0) return `Today ${hm}`;
  if (diff === 1) return `Yesterday ${hm}`;
  return `${d.getDate()} ${d.toLocaleString('en-GB', { month: 'short' })} ${hm}`;
};
