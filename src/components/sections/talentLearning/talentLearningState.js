import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { debug } from '../../../utils/debug.js';

const log = debug('talentLearningState');

/*
 * Talent My Learning — mock state source (frontend-only; swap for an API later, keep the shape).
 * Every Figma frame is reachable with query params on `/learning`:
 *
 *   /learning                        ML-01 My Learning · In progress
 *   /learning?view=course            ML-02 Course detail · Power BI Basics
 *   /learning?view=lesson            ML-03 Lesson player · SQL Module 4
 *   /learning?quick=question|correct|wrong|passed|retry
 *                                    QC-01 question · QC-02 correct · QC-03 wrong (explained) ·
 *                                    QC-04 passed (module complete) · QC-05 not passed (retry)
 *                                    (the quick check lives inside the lesson player: implies view=lesson)
 *   /learning?view=complete          ML-04 Course complete (SQL verified)
 *   /learning?view=certificates      ML-05 Certificates
 *   /learning?view=recommended       ML-06 Recommended courses
 *   /learning?empty=1                ML-07 My Learning · empty (nothing started)
 *   /learning?loading=1              ML-08 My Learning · loading
 *   /learning?tab=saved              SV-02 My Learning · Saved
 *   /learning?tab=saved&empty=1      SV-03 My Learning · Saved (empty)
 *   /learning?toast=saved            SV-01 Course saved (toast)
 *   /learning?view=explore           EX-01 Explore courses
 *   /learning?view=explore&ex=category|search|none
 *                                    EX-02 Explore · Data & analytics · EX-03 search results · EX-04 no results
 *
 * Live data (2026-10-18): the screens read the training API through LearningDataProvider.
 *   &course=<courseId>               the course open in Course detail / Lesson player (live)
 *   &demo=1                          force the Figma mock data (design QA); `empty` / `loading` imply it
 *
 * The lead owns this file. Section agents may ADD derived fields but must not rename existing ones.
 */

export const LEARNING_VIEWS = [
  'progress',
  'course',
  'lesson',
  'complete',
  'certificates',
  'recommended',
  'explore',
];
export const QUICK_STEPS = ['question', 'correct', 'wrong', 'passed', 'retry'];
export const EXPLORE_STATES = ['category', 'search', 'none'];
export const LEARNING_TABS = ['learning', 'saved'];

const pick = (value, allowed, fallback = null) => (allowed.includes(value) ? value : fallback);

export const useTalentLearningState = () => {
  const [params, setParams] = useSearchParams();
  const quick = pick(params.get('quick'), QUICK_STEPS);
  const view = quick ? 'lesson' : pick(params.get('view'), LEARNING_VIEWS, 'progress');
  const tab = pick(params.get('tab'), LEARNING_TABS, 'learning');
  const ex = pick(params.get('ex'), EXPLORE_STATES);
  const empty = params.get('empty') === '1';
  const loading = params.get('loading') === '1';
  const toast = params.get('toast') === 'saved' ? 'saved' : null;
  const a11yMode = params.get('a11y') === '1';
  const course = params.get('course') || null;
  const demo = params.get('demo') === '1';

  return useMemo(() => {
    log('state', { view, tab, quick, ex, empty, loading, toast });
    // Merge a patch into the query string (null/undefined/false removes a key).
    const update = (patch) => {
      const next = new URLSearchParams(params);
      Object.entries(patch).forEach(([k, v]) => {
        if (v === null || v === undefined || v === false) next.delete(k);
        else next.set(k, v === true ? '1' : String(v));
      });
      setParams(next, { replace: true });
    };
    return {
      // `stateKey` / `tab` mirror the talent-home contract so the shared shell keeps working.
      stateKey: 'top',
      tab,
      learningTab: tab,
      view,
      quick,
      ex,
      empty,
      loading,
      toast,
      a11yMode,
      course,
      demo,
      update,
      // Shell hooks (search/edit are unused here but present for the shared nav).
      searchOpen: params.get('search') === '1',
      editOpen: false,
      newUser: null,
      journeyMin: false,
    };
  }, [params, setParams, view, tab, quick, ex, empty, loading, toast, a11yMode, course, demo]);
};
