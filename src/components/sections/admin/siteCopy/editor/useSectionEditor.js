import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { debug } from '../../../../../utils/debug.js';
import { useCopyKv } from '../useCopyKv.js';
import { countChars, sameValue, unknownChips } from './richText.js';
import { resolveSection } from './sectionEditorData.js';
import { savedLabel } from './editorTime.js';
import { saveDraftField } from '../live/copyLive.js';

const log = debug('useSectionEditor');

/*
 * useSectionEditor — the state of the Site copy section editor (Platform Admin 7.8.2).
 *   value(f)        what the field shows: the unsaved edit, else the saved draft, else what is live (published), else the original
 *   setValue(f, v)  typing: the edit shows at once; a valid one is saved as a draft 500 ms later (kv `site-copy.drafts`), an invalid one
 *                   (over the limit, unknown product-name chip) stays unsaved and the field says why (7.8.2g, 7.8.2n)
 *   resetField(f)   "Reset to default": the original comes back (7.8.2h)
 *   saveFailed / retry   the connection is lost (7.8.2m): `navigator.onLine === false`, or the `offline` frame state; retry saves what is pending
 *   conflict / keepMine / takeTheirs   someone else changed the section (7.8.2k, 2l; mock, fixed fixture)
 * With a frame `preset` the stores are non-persistent (a frame URL never depends on storage).
 */
export const useSectionEditor = ({ section, preset, readOnly }) => {
  const sectionId = section.id;
  const [drafts, setDrafts] = useCopyKv('site-copy.drafts', preset?.drafts ?? {}, {
    persist: !preset,
  });
  const [published, setPublished] = useCopyKv('site-copy.published', {}, { persist: !preset });
  const [edits, setEdits] = useState(preset?.edits ?? {});
  const [savedAt, setSavedAt] = useState(null);
  const [saveFailed, setSaveFailed] = useState(preset?.state === 'offline');
  const [conflict, setConflict] = useState(preset?.state === 'conflict');
  const [pasted, setPasted] = useState(Boolean(preset?.pasted));
  const [, setTick] = useState(0);
  const timers = useRef({});
  const forcedOffline = useRef(preset?.state === 'offline');
  const latest = useRef({});
  latest.current = { edits, drafts, published, conflict };

  useEffect(() => {
    log('mount', {
      sectionId,
      preset: preset ? Object.keys(preset) : null,
      drafts: Object.keys(drafts),
    });
    const t = timers.current;
    return () => Object.values(t).forEach((id) => clearTimeout(id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionId]);

  // The saved line ages ("just now" -> "4 s ago" -> "2 min ago").
  useEffect(() => {
    if (!savedAt) return undefined;
    const id = window.setInterval(() => setTick((n) => n + 1), 1000);
    return () => window.clearInterval(id);
  }, [savedAt]);

  const baseValue = useCallback(
    (f) => published[sectionId]?.[f.key] ?? f.original,
    [published, sectionId]
  );

  const value = useCallback(
    (f) => {
      if (Object.prototype.hasOwnProperty.call(edits, f.key)) return edits[f.key];
      const d = drafts[sectionId]?.fields?.[f.key];
      return d ? d.draft : baseValue(f);
    },
    [edits, drafts, sectionId, baseValue]
  );

  const check = useCallback((f, v) => {
    const length = countChars(v, f.kind);
    return {
      length,
      over: length > f.max,
      unknown: f.kind === 'rich' ? unknownChips(v) : [],
    };
  }, []);

  const writeDraft = useCallback(
    (f, v) => {
      setDrafts((prev) => {
        const sec = prev[sectionId] ?? { fields: {} };
        const fields = { ...sec.fields };
        const base = latest.current.published[sectionId]?.[f.key] ?? f.original;
        if (sameValue(v, base, f.kind)) delete fields[f.key];
        else fields[f.key] = { draft: v };
        const next = { ...prev };
        if (Object.keys(fields).length === 0) delete next[sectionId];
        else next[sectionId] = { fields, savedAt: Date.now() };
        return next;
      });
      if (!preset) saveDraftField(sectionId, f, v); // live mode only (no-op on mock data)
    },
    [setDrafts, sectionId, preset]
  );

  const commit = useCallback(
    (f, v) => {
      const c = check(f, v);
      if (c.over || c.unknown.length) {
        log('not saved', f.key, { over: c.over, unknown: c.unknown, length: c.length });
        return false;
      }
      if (latest.current.conflict) {
        log('not saved: waiting for the conflict choice', f.key);
        return false;
      }
      const offline =
        forcedOffline.current || (typeof navigator !== 'undefined' && navigator.onLine === false);
      if (offline) {
        log('save failed: offline', f.key);
        setSaveFailed(true);
        return false;
      }
      log('saved draft', f.key, { length: c.length });
      writeDraft(f, v);
      setEdits((prev) => {
        const next = { ...prev };
        delete next[f.key];
        return next;
      });
      setSavedAt(Date.now());
      setSaveFailed(false);
      return true;
    },
    [check, writeDraft]
  );

  const setValue = useCallback(
    (f, v) => {
      if (readOnly) return;
      setEdits((prev) => ({ ...prev, [f.key]: v }));
      window.clearTimeout(timers.current[f.key]);
      timers.current[f.key] = window.setTimeout(() => commit(f, v), 500);
    },
    [commit, readOnly]
  );

  const resetField = useCallback(
    (f) => {
      if (readOnly) return;
      log('reset to default', f.key);
      window.clearTimeout(timers.current[f.key]);
      setEdits((prev) => ({ ...prev, [f.key]: f.original }));
      commit(f, f.original);
      setSavedAt(null);
    },
    [commit, readOnly]
  );

  const retry = useCallback(() => {
    const offline = typeof navigator !== 'undefined' && navigator.onLine === false;
    log('try again', { offline });
    if (offline) return;
    forcedOffline.current = false;
    setSaveFailed(false);
    section.fields.forEach((f) => {
      if (Object.prototype.hasOwnProperty.call(latest.current.edits, f.key)) {
        commit(f, latest.current.edits[f.key]);
      }
    });
  }, [commit, section.fields]);

  // A real lost connection shows the same banner as frame 7.8.2m.
  useEffect(() => {
    const onOffline = () => {
      log('offline event');
      setSaveFailed(true);
    };
    window.addEventListener('offline', onOffline);
    return () => window.removeEventListener('offline', onOffline);
  }, []);

  const keepMine = useCallback(() => {
    log('conflict: keep mine (their version goes to history, mock)');
    latest.current.conflict = false;
    setConflict(false);
    section.fields.forEach((f) => {
      if (Object.prototype.hasOwnProperty.call(latest.current.edits, f.key)) {
        commit(f, latest.current.edits[f.key]);
      }
    });
  }, [commit, section.fields]);

  const takeTheirs = useCallback(() => {
    log('conflict: use their version (mine goes to history, mock)');
    setConflict(false);
    setEdits({});
    setSavedAt(Date.now());
  }, []);

  const draftCounts = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(drafts).map(([id, sec]) => [id, Object.keys(sec?.fields ?? {}).length])
      ),
    [drafts]
  );

  // The change set the publish bar / dialogs read (publish/publishData.js): one entry per edited SECTION with the changed FIELDS
  // ({ key, label, before, after }); `before` is what is live (published) or the original, `after` the saved draft.
  const changes = useMemo(
    () =>
      Object.entries(drafts)
        .filter(([, sec]) => Object.keys(sec?.fields ?? {}).length > 0)
        .map(([id, sec]) => {
          const s = resolveSection(id, id === sectionId ? undefined : 3);
          return {
            sectionId: id,
            label: `${s.pageLabel} › ${s.label}`,
            name: s.label,
            // ⚠️ ASSUMPTION: a shared section (Footer) is used on 46 public pages (7.8.4d draws "46 public pages")
            ...(s.shared ? { shared: { name: s.label.toLowerCase(), pages: 46 } } : {}),
            fields: Object.entries(sec.fields).map(([key, v]) => {
              const f = s.fields.find((x) => x.key === key);
              return {
                key,
                label: f?.label ?? key,
                before: published[id]?.[key] ?? f?.original ?? '',
                after: v.draft,
              };
            }),
          };
        }),
    [drafts, published, sectionId]
  );

  const status =
    preset && 'savedLabel' in preset && !savedAt ? preset.savedLabel : savedLabel(savedAt);

  const clearDrafts = useCallback(
    (ids) => {
      log('drafts discarded', ids);
      setDrafts((prev) => {
        const next = { ...prev };
        ids.forEach((id) => delete next[id]);
        return next;
      });
      setEdits({});
      setSavedAt(null);
    },
    [setDrafts]
  );

  /** What the publish dialogs reported as done: the snapshot of the drafts goes live (`published`) and the drafts clear. */
  const goLive = useCallback(
    (ids, snapshot) => {
      log('published', ids);
      setPublished((prev) => {
        const next = { ...prev };
        ids.forEach((id) => {
          const fields = snapshot[id]?.fields ?? {};
          next[id] = {
            ...(next[id] ?? {}),
            ...Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, v.draft])),
          };
        });
        return next;
      });
      clearDrafts(ids);
    },
    [setPublished, clearDrafts]
  );

  return {
    drafts,
    published,
    edits,
    value,
    baseValue,
    check,
    setValue,
    resetField,
    status,
    savedAt,
    saveFailed,
    retry,
    conflict,
    keepMine,
    takeTheirs,
    pasted,
    setPasted,
    draftCounts,
    changes,
    clearDrafts,
    goLive,
  };
};
