import { SECTION_CATALOG } from './previewHistoryData.js';

/*
 * previewModel — pure helpers of the Preview (7.8.3) and History (7.8.5) screens: section lookup, the text a section shows (draft or published),
 * version folding / diffing and the small text utilities (initials, word diff, light markdown blocks). No React, no storage.
 */

export const DEVICES = ['desktop', 'tablet', 'phone'];

const pretty = (slug = '') => {
  const s = slug.replace(/-/g, ' ').trim();
  return s ? s[0].toUpperCase() + s.slice(1) : '';
};

/** The catalog entry of a section id, or one derived from the id (`talent.dashboard.welcome-banner` → page "Dashboard", label "Welcome banner"). */
export const sectionMeta = (sectionId = '') => {
  const known = SECTION_CATALOG[sectionId];
  if (known) return { id: sectionId, ...known };
  const [portal = 'public', page = '', label = ''] = sectionId.split('.');
  return {
    id: sectionId,
    portal,
    page: pretty(page),
    label: pretty(label),
    previewKind: 'generic',
    // ⚠️ ASSUMPTION: an uncatalogued section previews its text as one generic "Text" field.
    fields: [{ key: 'text', label: 'Text', published: '', max: 200, long: true }],
  };
};

const publishedOf = (published, sectionId, field) => {
  // Canonical shape (editor, publish store, browse): { [sectionId]: { [fieldKey]: text } }; the nested { fields: { key: { published } } } is still read.
  const flat = published?.[sectionId]?.[field.key];
  if (typeof flat === 'string') return flat;
  const hit = published?.[sectionId]?.fields?.[field.key];
  if (typeof hit === 'string') return hit;
  if (hit && typeof hit.published === 'string') return hit.published;
  return field.published;
};

/** The text of one field: 'draft' = my draft over the published text, 'published' = what everyone sees now. */
export const fieldValue = ({ drafts, published, sectionId, field, mode }) => {
  const live = publishedOf(published, sectionId, field);
  if (mode === 'published') return live;
  const draft = drafts?.[sectionId]?.fields?.[field.key]?.draft;
  return typeof draft === 'string' ? draft : live;
};

/** Does `field` have unpublished draft text (a draft that differs from what is live)? */
export const hasFieldDraft = ({ drafts, published, sectionId, field }) => {
  const draft = drafts?.[sectionId]?.fields?.[field.key]?.draft;
  return typeof draft === 'string' && draft !== publishedOf(published, sectionId, field);
};

/** The versions newest first (the order of the rows), tolerant of a missing / malformed list. */
export const sortedVersions = (history) =>
  [...(Array.isArray(history) ? history : [])].sort((a, b) => b.version - a.version);

/** The text of every field as it was live at `version` (versions are folded oldest to newest). */
export const stateAt = (history, version) => {
  const out = {};
  [...(history ?? [])]
    .filter((v) => v.version <= version)
    .sort((a, b) => a.version - b.version)
    .forEach((v) =>
      Object.entries(v.fields ?? {}).forEach(([key, { after }]) => {
        out[key] = after;
      })
    );
  return out;
};

/** Fields whose text differs between two states → `{ [key]: { before, after } }`. */
export const diffStates = (before, after) => {
  const out = {};
  Object.keys({ ...before, ...after }).forEach((key) => {
    if (before[key] !== after[key])
      out[key] = { before: before[key] ?? null, after: after[key] ?? null };
  });
  return out;
};

const labelOf = (meta, key) => meta.fields.find((f) => f.key === key)?.label ?? pretty(key);

/** Labels of the fields a version changed ("Headline, Main button text"). */
export const changedLabels = (version, meta) =>
  Object.keys(version.fields ?? {}).map((key) => labelOf(meta, key));

/** Rows of the compare panel for `version`: what it changed against the version before it. */
export const compareRows = (history, version, meta) => {
  const v = (history ?? []).find((x) => x.version === version);
  if (!v) return { rows: [], same: 0 };
  const rows = Object.entries(v.fields ?? {})
    .filter(([, f]) => f.before !== f.after)
    .map(([key, f]) => ({ key, label: labelOf(meta, key), before: f.before, after: f.after }));
  return { rows, same: Math.max(0, meta.fields.length - rows.length) };
};

export const initials = (who) =>
  who
    ? who
        .split(/\s+/)
        .map((p) => p[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '·';

/** "Today 15:12" in the clock of the browser (the row title of a restore is the reason, the meta line carries this). */
export const nowLabel = (d = new Date()) =>
  `Today ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;

/** Word-level diff: the words of `after` that are not in `before` (LCS), as `[{ text, changed }]` (whitespace kept). */
export const wordDiff = (before, after) => {
  const a = String(before ?? '').split(/(\s+)/);
  const b = String(after ?? '').split(/(\s+)/);
  const lcs = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i -= 1)
    for (let j = b.length - 1; j >= 0; j -= 1)
      lcs[i][j] = a[i] === b[j] ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
  const out = [];
  let i = 0;
  let j = 0;
  while (j < b.length) {
    if (i < a.length && a[i] === b[j]) {
      out.push({ text: b[j], changed: false });
      i += 1;
      j += 1;
    } else if (i < a.length && lcs[i + 1][j] >= lcs[i][j + 1]) {
      i += 1;
    } else {
      out.push({ text: b[j], changed: !/^\s+$/.test(b[j]) });
      j += 1;
    }
  }
  return out;
};

/** Light markdown of the FAQ answer: lines starting "- " / "• " are bullets, the rest paragraphs; `**x**` is bold. */
export const richBlocks = (text = '') => {
  const blocks = [];
  String(text)
    .split('\n')
    .forEach((line) => {
      const bullet = /^\s*[-•]\s+(.*)$/.exec(line);
      if (bullet) {
        const last = blocks[blocks.length - 1];
        if (last?.type === 'list') last.items.push(bullet[1]);
        else blocks.push({ type: 'list', items: [bullet[1]] });
      } else if (line.trim()) {
        blocks.push({ type: 'p', text: line });
      }
    });
  return blocks;
};

export const boldRuns = (text = '') =>
  String(text)
    .split(/(\*\*[^*]+\*\*)/)
    .filter(Boolean)
    .map((part) =>
      part.startsWith('**') && part.endsWith('**')
        ? { text: part.slice(2, -2), bold: true }
        : { text: part, bold: false }
    );
