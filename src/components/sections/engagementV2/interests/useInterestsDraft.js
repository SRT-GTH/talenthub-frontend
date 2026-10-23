import { useCallback, useEffect, useRef, useState } from 'react';
import {
  fetchMyProfile,
  isLiveProfile,
  saveProfileFields,
} from '../../../../services/profileStages.api.js';
import { debug } from '../../../../utils/debug.js';
import {
  EMPTY_DRAFT,
  MAX_AREAS,
  SEED_DRAFT,
  interestsFromProfile,
  interestsToProfile,
} from './interestsData.js';

const log = debug('useInterestsDraft');
const KEY = 'gth:interests-draft';
const SAVE_DELAY_MS = 600;

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

/*
 * The talent's interest areas + specifics.
 *   Live (signed in): loaded from the profile `interests` (interestsFromProfile). `status` is 'loading' | 'ready' | 'error';
 *     until it is 'ready' every change is ignored and nothing is saved (a failed load never turns into an empty list that
 *     could be saved over the real one). Every change (pick / unpick, add area, add / remove specific) is saved to the
 *     profile, debounced so rapid picks write once; save() writes straight away and resolves true / false so Continue and
 *     stage complete can wait for it. After each successful save the profile is re-read so new items get their `_id`
 *     (applied only when no other save or edit started since). Items other surfaces wrote are preserved
 *     (interestsToProfile). saveError is a message for the page when the last save failed (the local edit is kept).
 *   Demo (signed out): the draft lives in localStorage; before anything is saved the pick step starts empty and every later
 *     step shows the Figma seed.
 */
export const useInterestsDraft = (step) => {
  const [live] = useState(isLiveProfile);
  const [stored, setStored] = useState(() => (live ? null : read()));
  const [status, setStatus] = useState(live ? 'loading' : 'ready');
  const [saveError, setSaveError] = useState(null);
  const draft = stored ?? (live || step === 'pick' ? EMPTY_DRAFT : SEED_DRAFT);

  const originalRef = useRef([]); // the profile's interests as last read (keeps _ids + other surfaces' items)
  const readyRef = useRef(!live);
  const pendingRef = useRef(null);
  const timerRef = useRef(null);
  const saveSeqRef = useRef(0);
  const editSeqRef = useRef(0);

  useEffect(() => {
    if (!live) return undefined;
    let cancelled = false;
    fetchMyProfile()
      .then((profile) => {
        if (cancelled) return;
        originalRef.current = Array.isArray(profile?.interests) ? profile.interests : [];
        const { draft: loaded, foreign } = interestsFromProfile(originalRef.current);
        log('loaded from profile', {
          areas: loaded.areas.map((a) => a.id),
          foreign: foreign.length,
        });
        setStored(loaded);
        readyRef.current = true;
        setStatus('ready');
      })
      .catch((err) => {
        if (cancelled) return;
        log.error('profile load failed:', err?.response?.status || err?.message);
        setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, [live]);

  const saveNow = useCallback(async (next) => {
    if (!readyRef.current) {
      log('save blocked: profile not loaded');
      return false;
    }
    const interests = interestsToProfile(next, originalRef.current);
    saveSeqRef.current += 1;
    const seq = saveSeqRef.current;
    const edit = editSeqRef.current;
    log('save to profile', { items: interests.length, seq });
    try {
      await saveProfileFields({ interests });
      setSaveError(null);
    } catch (err) {
      log.error('save failed:', err?.response?.status || err?.message);
      setSaveError("Couldn't save your interests. Your picks are kept here; try again.");
      return false;
    }
    // Re-read so newly created items pick up their server _id; skip when a newer save / edit started meanwhile.
    try {
      const fresh = await fetchMyProfile();
      if (seq === saveSeqRef.current && Array.isArray(fresh?.interests)) {
        originalRef.current = fresh.interests;
        if (edit === editSeqRef.current) setStored(interestsFromProfile(fresh.interests).draft);
      }
    } catch (err) {
      log.warn('re-read after save failed:', err?.message);
    }
    return true;
  }, []);

  const flush = useCallback(
    (current) => {
      if (!live) return Promise.resolve(true);
      if (!readyRef.current) return Promise.resolve(false);
      clearTimeout(timerRef.current);
      timerRef.current = null;
      const next = pendingRef.current ?? current;
      pendingRef.current = null;
      return saveNow(next);
    },
    [live, saveNow]
  );

  // Save anything still pending when the page unmounts.
  useEffect(
    () => () => {
      if (pendingRef.current) {
        clearTimeout(timerRef.current);
        saveNow(pendingRef.current);
        pendingRef.current = null;
      }
    },
    [saveNow]
  );

  const commit = useCallback(
    (next) => {
      if (!readyRef.current) {
        log('change ignored: profile not loaded');
        return false;
      }
      log('save', { areas: next.areas.map((a) => a.id) });
      setStored(next);
      if (!live) {
        write(next);
        return true;
      }
      editSeqRef.current += 1;
      pendingRef.current = next;
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        const pending = pendingRef.current;
        pendingRef.current = null;
        if (pending) saveNow(pending);
      }, SAVE_DELAY_MS);
      return true;
    },
    [live, saveNow]
  );

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
      return commit({
        areas: draft.areas.map((a) =>
          a.id === areaId ? { ...a, specifics: [...a.specifics, t] } : a
        ),
      });
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

  const save = useCallback(() => flush(draft), [flush, draft]);

  return {
    draft,
    live,
    status,
    saveError,
    save,
    setAreas,
    addAreas,
    addSpecific,
    removeSpecific,
  };
};
