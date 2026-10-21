import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CV_STEPS } from './cvData.js';

/*
 * Upload my CV — URL-driven state (route /profile/filling/cv). Frames (Figma section "Upload my CV (new)"):
 *   CV-01   /profile/filling/cv                          Choose a file
 *   CV-02   /profile/filling/cv?step=uploading           Uploading (64%)
 *   CV-02b  /profile/filling/cv?step=unsupported         File not supported (error)
 *   CV-03   /profile/filling/cv?step=reading             Reading your CV
 *   CV-03b  /profile/filling/cv?step=failed              Couldn’t read it (photo too blurry)
 *   CV-04   /profile/filling/cv?step=review              Check what we found
 *   CV-04b  /profile/filling/cv?step=review&fix=1        Fix a role   (optional &role=<role id>, default the flagged role)
 *   CV-05   /profile/filling/cv?step=done                Added to your profile
 * update(patch): null / '' / false removes a key.
 */
export const useCvState = () => {
  const [params, setParams] = useSearchParams();
  const rawStep = params.get('step');
  const step = CV_STEPS.includes(rawStep) ? rawStep : 'choose';
  const fix = params.get('fix') === '1';
  const role = params.get('role') || '';

  const update = useCallback(
    (patch) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          Object.entries(patch).forEach(([k, v]) => {
            if (v === null || v === '' || v === false || v === undefined) next.delete(k);
            else next.set(k, v === true ? '1' : String(v));
          });
          return next;
        },
        { replace: false }
      );
    },
    [setParams]
  );

  return useMemo(() => ({ step, fix, role, update }), [step, fix, role, update]);
};
