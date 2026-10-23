import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';

const log = debug('personalityState');

/*
 * URL contract for /profile/filling/personality (read with URLSearchParams, every screen reachable by URL):
 *   ?step=intro                       PE-01 Intro (default)
 *   ?step=quiz&q=7                    PE-02 Question 7, nothing picked (demo: only question 7 is drawn in Figma)
 *   ?step=quiz&q=7&answer=1           PE-03 answer picked (demo; answer = 0-based option index: 0=A 1=B 2=C 3=D; Figma draws B)
 *   ?step=quiz&q=n                    live (signed in): question n (1-based) of the Big Five bank, default 1; answers live
 *                                     in page state + sessionStorage, not in the URL (`liveQ`)
 *   ?step=working                     PE-04 Working out your result
 *   ?step=result                      PE-05 Your result
 *   ?step=path                        PA-00 Choose your path   (&path=games|quiz|chat = highlighted card, default games)
 *   ?step=overview                    "interests(intro page(optional)" stage overview (optional page before PE-01)
 * update(patch): null / '' / false remove a key.
 */
export const STEPS = ['intro', 'quiz', 'working', 'result', 'path', 'overview'];
export const PATH_IDS = ['games', 'quiz', 'chat'];

const usePersonalityState = () => {
  const [params, setParams] = useSearchParams();
  const rawStep = params.get('step');
  const step = STEPS.includes(rawStep) ? rawStep : 'intro';
  const q = Number(params.get('q')) || 7;
  const liveQ = Math.max(1, Math.floor(Number(params.get('q'))) || 1);
  const answerRaw = params.get('answer');
  const answerNum = answerRaw === null || answerRaw === '' ? null : Number(answerRaw);
  const answer = Number.isInteger(answerNum) && answerNum >= 0 && answerNum <= 3 ? answerNum : null;
  const rawPath = params.get('path');
  const path = PATH_IDS.includes(rawPath) ? rawPath : 'games';

  const update = useCallback(
    (patch, options) => {
      log('update', patch);
      const next = new URLSearchParams(params);
      Object.entries(patch).forEach(([key, value]) => {
        if (value === null || value === '' || value === false || value === undefined)
          next.delete(key);
        else next.set(key, String(value));
      });
      setParams(next, options);
    },
    [params, setParams]
  );

  return useMemo(
    () => ({ step, q, liveQ, answer, path, update }),
    [step, q, liveQ, answer, path, update]
  );
};

export default usePersonalityState;
