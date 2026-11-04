import { useCallback, useMemo, useRef } from 'react';
import { debug } from '../../../../../utils/debug.js';
import { useCopyKv } from '../useCopyKv.js';
import { PUBLISHED_KEY, historyKey, seedHistory } from '../preview/previewHistoryData.js';
import { diffStates, nowLabel, sortedVersions, stateAt } from '../preview/previewModel.js';

const log = debug('useSectionHistory');

/*
 * useSectionHistory — the version list of one section from the shared mock KV (`site-copy.history.<sectionId>`, seeded from previewHistoryData.js) and the
 * actions on it. Restoring never overwrites: it appends a NEW version (live version + 1) whose text is the old version's and whose `restoredFrom` names it, and
 * writes the restored text to `site-copy.published` (7.8.5d "Version 6 is live"). `undo()` removes that new version again and brings the previous published text back.
 * Returns { versions (newest first), live, restore(version, reason, actor), undo(), restoredPreview(from, reason, actor) }.
 */
export const useSectionHistory = (sectionId) => {
  const [list, setList] = useCopyKv(historyKey(sectionId), seedHistory(sectionId));
  const [published, setPublished] = useCopyKv(PUBLISHED_KEY, {});
  // The published text each restore replaced, so undo() can bring it back ({ [newVersion]: previous published map of this section }).
  const previousPublished = useRef({});
  const versions = useMemo(() => sortedVersions(list), [list]);
  const live = versions[0]?.version ?? 1;

  const build = useCallback(
    (from, reason, actor) => {
      const now = stateAt(list, live);
      const target = stateAt(list, from);
      return {
        entry: {
          version: live + 1,
          who: actor,
          when: nowLabel(),
          why: reason,
          restoredFrom: from,
          fields: diffStates(now, target),
        },
        target,
      };
    },
    [list, live]
  );

  const restore = useCallback(
    (from, reason, actor) => {
      const { entry, target } = build(from, reason, actor);
      log('restore', {
        from,
        newVersion: entry.version,
        reason,
        changed: Object.keys(entry.fields),
      });
      setList((prev) => [...prev, entry]);
      // Canonical published shape: { [sectionId]: { [fieldKey]: text } } (the same one the editor, publish store and browse use).
      previousPublished.current[entry.version] = published[sectionId] ?? null;
      setPublished((prev) => ({
        ...prev,
        [sectionId]: { ...prev[sectionId], ...target },
      }));
      return entry;
    },
    [build, published, sectionId, setList, setPublished]
  );

  const undo = useCallback(
    (version) => {
      log('undo restore', { version });
      setList((prev) => prev.filter((v) => v.version !== version));
      setPublished((prev) => {
        const previous = previousPublished.current[version];
        const next = { ...prev };
        if (previous) next[sectionId] = previous;
        else delete next[sectionId];
        return next;
      });
    },
    [sectionId, setList, setPublished]
  );

  /** What the list looks like after restoring `from` (used by the 7.8.5d frame URL, which must not depend on stored state). */
  const restoredPreview = useCallback(
    (from, reason, actor) => {
      const { entry } = build(from, reason, actor);
      return sortedVersions([...list, { ...entry, when: 'Today 15:12' }]);
    },
    [build, list]
  );

  return { versions, live, restore, undo, restoredPreview, published };
};
