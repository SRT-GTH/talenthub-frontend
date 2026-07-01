import { useCallback, useEffect, useState } from 'react';
import { debug } from '../utils/debug.js';

const log = debug('useEngagementProgress');

/*
 * useEngagementProgress — tracks which Section-1 stages the user has
 * completed, persisted in localStorage so progress survives a refresh.
 *
 * Stages move through three states:
 *   • 'locked'   — user can't access yet (greyed out, unclickable)
 *   • 'active'   — the single stage the user is currently working on
 *   • 'done'     — stage completed (clickable to revisit)
 *
 * Exactly ONE stage is `active` at a time. When the user completes the
 * active stage, that stage flips to `done` and the next stage in
 * STAGE_ORDER flips to `active`. Stages further along stay `locked`.
 *
 * For a brand-new user the FIRST stage (avatar) starts as active.
 *
 * Consumers:
 *   const { progress, markStageComplete, getStageStatus } = useEngagementProgress();
 *   getStageStatus('avatar')        // → 'done' | 'active' | 'locked'
 *   markStageComplete('avatar')     // flip avatar→done, next stage→active
 */

// Bumped to v3 after the temporary "all unlocked" test-state (v2)
// was reverted to production locking. Any user who tested with v2
// will get a fresh state on their next load.
const STORAGE_KEY = 'engagement-progress-v3';

// Order matters — it's how the trail flows on the map. Drives both the
// "what's next" logic and the rendering sequence.
export const STAGE_ORDER = [
  'avatar',
  'personal-interests',
  'personality',
  'skills',
  'work-experience',
  'project-portfolio',
  'certifications',
  'desired-career',
];

const buildInitialProgress = () => {
  // First stage active, everything else locked.
  const initial = {};
  STAGE_ORDER.forEach((id, index) => {
    initial[id] = index === 0 ? 'active' : 'locked';
  });
  return initial;
};

const loadFromStorage = () => {
  if (typeof window === 'undefined') return buildInitialProgress();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return buildInitialProgress();
    const parsed = JSON.parse(raw);
    // Sanity check: every known stage must be present. If the persisted
    // shape is from an older version (missing keys), fall back to the
    // initial state rather than render with `undefined` statuses.
    for (const id of STAGE_ORDER) {
      if (!parsed[id]) return buildInitialProgress();
    }
    return parsed;
  } catch (err) {
    log.error('failed to parse stored progress', err);
    return buildInitialProgress();
  }
};

const saveToStorage = (progress) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (err) {
    log.error('failed to persist progress', err);
  }
};

export const useEngagementProgress = () => {
  const [progress, setProgress] = useState(loadFromStorage);

  // Persist every change.
  useEffect(() => {
    saveToStorage(progress);
  }, [progress]);

  // Mark a stage complete. The next stage in STAGE_ORDER becomes active.
  // No-op if the stage doesn't exist or is already done.
  const markStageComplete = useCallback((stageId) => {
    setProgress((prev) => {
      if (!Object.prototype.hasOwnProperty.call(prev, stageId)) {
        log('markStageComplete: unknown stage', stageId);
        return prev;
      }
      if (prev[stageId] === 'done') {
        log('markStageComplete: already done', stageId);
        return prev;
      }
      const next = { ...prev, [stageId]: 'done' };
      const completedIndex = STAGE_ORDER.indexOf(stageId);
      const nextStageId = STAGE_ORDER[completedIndex + 1];
      if (nextStageId && next[nextStageId] === 'locked') {
        next[nextStageId] = 'active';
      }
      log('markStageComplete', stageId, '→ done; unlocked:', nextStageId);
      return next;
    });
  }, []);

  const getStageStatus = useCallback((stageId) => progress[stageId] || 'locked', [progress]);

  // Convenience: how many stages are done. Used for the "X of N done" pill.
  const doneCount = Object.values(progress).filter((s) => s === 'done').length;

  return {
    progress,
    markStageComplete,
    getStageStatus,
    doneCount,
    totalCount: STAGE_ORDER.length,
  };
};

export default useEngagementProgress;
