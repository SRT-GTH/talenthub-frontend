import { useCallback, useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import { EMPTY_DRAFT, MAX_AREAS, SEED_DRAFT } from './interestsData.js';

const log = debug('useInterestsDraft');
const KEY = 'gth:interests-draft';

const read = () => {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};
const write = (draft) => {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(draft));
  } catch {
    /* storage unavailable: keep in memory only */
  }
};

/* Saved selection; before anything is saved the pick step starts empty and every later step shows the Figma mock. */
export const useInterestsDraft = (step) => {
  const [stored, setStored] = useState(read);
  const draft = stored ?? (step === 'pick' ? EMPTY_DRAFT : SEED_DRAFT);

  const commit = useCallback((next) => {
    log('save', { areas: next.areas.map((a) => a.id) });
    write(next);
    setStored(next);
  }, []);

  const setAreas = useCallback(
    (ids) =>
      commit({
        areas: ids
          .slice(0, MAX_AREAS)
          .map((id) => draft.areas.find((a) => a.id === id) ?? { id, specifics: [] }),
      }),
    [commit, draft]
  );
  const addAreas = useCallback(
    (ids) =>
      setAreas([
        ...draft.areas.map((a) => a.id),
        ...ids.filter((id) => !draft.areas.some((a) => a.id === id)),
      ]),
    [draft, setAreas]
  );
  const addSpecific = useCallback(
    (areaId, text) => {
      const t = text.trim();
      const target = draft.areas.find((a) => a.id === areaId);
      if (!t || !target || target.specifics.some((s) => s.toLowerCase() === t.toLowerCase())) {
        log('addSpecific ignored', { areaId, text: t });
        return false;
      }
      commit({
        areas: draft.areas.map((a) =>
          a.id === areaId ? { ...a, specifics: [...a.specifics, t] } : a
        ),
      });
      return true;
    },
    [commit, draft]
  );
  const removeSpecific = useCallback(
    (areaId, text) =>
      commit({
        areas: draft.areas.map((a) =>
          a.id === areaId ? { ...a, specifics: a.specifics.filter((s) => s !== text) } : a
        ),
      }),
    [commit, draft]
  );

  return { draft, setAreas, addAreas, addSpecific, removeSpecific };
};
