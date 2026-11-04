import { debug } from '../../../../../utils/debug.js';
import { seedHistory } from '../preview/previewHistoryData.js';

const log = debug('publishStore');

/*
 * publishStore — what publishing / discarding really does to the mock "server" (the useCopyKv keys, see ../useCopyKv.js):
 *   site-copy.drafts                  { [sectionId]: { [fieldKey]: draftValue } }      (⚠️ ASSUMPTION: the editor, B1, writes this shape)
 *   site-copy.published               { [sectionId]: { [fieldKey]: publishedValue } }
 *   site-copy.history.<sectionId>     [{ version, who, when, why, fields: { [fieldKey]: { before, after } } }]  oldest first (append)
 * It writes through the same sessionStorage key (`gth:copy:<key>`) and event (`gth:copy-kv`) as useCopyKv so every screen that holds the
 * hook updates. The helpers are duplicated here because useCopyKv does not export a plain writer (request in the report: export `readCopyKv` / `writeCopyKv`).
 */
const NAME = (key) => `gth:copy:${key}`;
const EVENT = 'gth:copy-kv';

const read = (key, initial) => {
  try {
    const raw = window.sessionStorage.getItem(NAME(key));
    return raw === null ? initial : JSON.parse(raw);
  } catch {
    return initial;
  }
};

const write = (key, value) => {
  try {
    window.sessionStorage.setItem(NAME(key), JSON.stringify(value));
    window.dispatchEvent(new CustomEvent(EVENT, { detail: { key } }));
  } catch {
    log('storage unavailable', key);
  }
};

export const historyKey = (sectionId) => `site-copy.history.${sectionId}`;

/** Publish every section of `changes`: history entry (version + 1), published values, drafts emptied. Returns { versions }. */
export const publishChanges = ({ changes, reason, who }) => {
  const drafts = { ...read('site-copy.drafts', {}) };
  const published = { ...read('site-copy.published', {}) };
  const versions = {};
  const when = new Date().toISOString();
  changes.forEach((c) => {
    // Start from the same seed the history screen shows (the drawn versions of the hero), so the new entry is version N + 1.
    const history = read(historyKey(c.sectionId), seedHistory(c.sectionId));
    const last = history.reduce((m, h) => Math.max(m, h.version ?? 0), c.currentVersion ?? 0);
    const version = last + 1;
    versions[c.sectionId] = version;
    write(historyKey(c.sectionId), [
      ...history,
      {
        version,
        who,
        when,
        why: reason,
        fields: Object.fromEntries(
          c.fields.map((f) => [f.key, { before: f.before, after: f.after }])
        ),
      },
    ]);
    published[c.sectionId] = {
      ...published[c.sectionId],
      ...Object.fromEntries(c.fields.map((f) => [f.key, f.after])),
    };
    delete drafts[c.sectionId];
  });
  write('site-copy.published', published);
  write('site-copy.drafts', drafts);
  log('published', { sections: changes.map((c) => c.sectionId), versions, reason });
  return { versions };
};

/** Throw away the drafts of the given sections (the editor then shows the published text again). */
export const discardChanges = ({ changes }) => {
  const drafts = { ...read('site-copy.drafts', {}) };
  changes.forEach((c) => {
    delete drafts[c.sectionId];
  });
  write('site-copy.drafts', drafts);
  log('discarded', { sections: changes.map((c) => c.sectionId) });
};
