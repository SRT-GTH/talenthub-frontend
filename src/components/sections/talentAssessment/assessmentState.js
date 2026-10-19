import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { debug } from '../../../utils/debug.js';

const log = debug('assessmentState');

/*
 * Talent My Assessment — mock state source (frontend-only; swap for an API later and keep the shape).
 * Figma canvas "Talent My Assessment" 7962:530 (Playful 79xx:*, Focused 8110:28603…). Frame → URL table: wiki/talent-assessment.md.
 *
 *   /my-assessment                           MA-01 overview (3 of 4)
 *   /my-assessment?state=first|loading|error MA-01b first visit · MA-01c loading · MA-01d could not load
 *   /my-assessment?view=recruiter            MA-07 recruiter view (preview)
 *   /my-assessment?modal=retake              MA-08 retake cooldown pop-up
 *   /my-assessment/personality               MA-02
 *   /my-assessment/skills/:skillId           MA-03 (python, assessment/game evidenced) · MA-03b (firebase, self-reported)
 *   /my-assessment/library                   MA-09 assessments library
 *   /my-assessment/full/:skillId?f=MA-04…    full assessment flow (TypeScript): MA-04 intro · MA-05 question 12 · MA-06 passed ·
 *                                            MA-10 not passed · MA-11 connection lost · MA-12 time up · MA-13 leave confirm
 *   &rail=collapsed | &help=1                icon rail / Help pop-over (HP)
 *   &demo=1                                  the drawn mock data (design QA). Live data otherwise (2026-10-19,
 *                                            liveAssessments.js / liveOverview.js); `state` / `view` frames imply demo.
 *
 * The lead owns this file. Section agents may ADD derived fields but must not rename existing ones.
 */
export const ASSESSMENT_STATES = ['first', 'loading', 'error'];
export const ASSESSMENT_VIEWS = ['recruiter'];
export const ASSESSMENT_MODALS = ['retake'];

const pick = (value, allowed, fallback = null) => (allowed.includes(value) ? value : fallback);

export const useAssessmentState = () => {
  const [params, setParams] = useSearchParams();
  const state = pick(params.get('state'), ASSESSMENT_STATES);
  const view = pick(params.get('view'), ASSESSMENT_VIEWS);
  const modal = pick(params.get('modal'), ASSESSMENT_MODALS);
  const rail = params.get('rail') === 'collapsed' ? 'collapsed' : 'expanded';
  const help = params.get('help') === '1';
  const a11yParam = params.get('a11y') === '1';
  // Figma state frames (first / loading / error) and the recruiter preview are mock-only.
  const demo = params.get('demo') === '1' || Boolean(state) || view === 'recruiter';

  return useMemo(() => {
    log('state', { state, view, modal, rail });
    // Merge a patch into the query string (null/undefined/false/'' removes a key).
    const update = (patch) => {
      const next = new URLSearchParams(params);
      Object.entries(patch).forEach(([k, v]) => {
        if (v === null || v === undefined || v === false || v === '') next.delete(k);
        else next.set(k, v === true ? '1' : String(v));
      });
      setParams(next, { replace: true });
    };
    return {
      // `stateKey` / `tab` mirror the talent-home contract so the shared shell keeps working.
      stateKey: 'top',
      tab: 'home',
      state,
      view,
      modal,
      rail,
      help,
      a11yMode: a11yParam,
      a11yParam,
      demo,
      update,
      searchOpen: params.get('search') === '1',
      editOpen: false,
      loading: null,
      newUser: null,
      journeyMin: false,
    };
  }, [params, setParams, state, view, modal, rail, help, a11yParam, demo]);
};
