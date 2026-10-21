import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';

const log = debug('pitchState');

/*
 * Pitch stage URL state — route /profile/filling/pitch (frames PI-01 … PI-08, Figma section Pitch).
 *
 *   PI-01  /profile/filling/pitch                          Choose a way
 *   PI-02  /profile/filling/pitch?mode=record&step=camera  Record · camera access
 *   PI-03  /profile/filling/pitch?mode=record&step=recording  Record · recording
 *   PI-04  /profile/filling/pitch?mode=upload              Upload (drop zone)
 *   PI-04b /profile/filling/pitch?mode=upload&step=ready   Upload · file ready
 *   PI-05  /profile/filling/pitch?mode=write               Write
 *   PI-06  /profile/filling/pitch?step=review              Review and publish
 *   PI-07  /profile/filling/pitch?step=published           Published · Profile 100% (modal over the review screen)
 *   PI-08  /profile/filling/pitch?modal=delete             Delete pitch (modal over the review screen)
 *
 * `screen` is derived: 'choose' | 'camera' | 'recording' | 'upload' | 'uploadReady' | 'write' | 'review'.
 * `update(patch)` merges into the query string; null / '' / false remove a key.
 */
const MODES = ['record', 'upload', 'write'];

export const usePitchState = () => {
  const [params, setParams] = useSearchParams();
  const mode = MODES.includes(params.get('mode')) ? params.get('mode') : null;
  const stepRaw = params.get('step');
  const modal = params.get('modal') === 'delete' ? 'delete' : null;
  const published = stepRaw === 'published';

  const state = useMemo(() => {
    let screen = 'choose';
    if (stepRaw === 'review' || published || modal) screen = 'review';
    else if (mode === 'record') screen = stepRaw === 'recording' ? 'recording' : 'camera';
    else if (mode === 'upload') screen = stepRaw === 'ready' ? 'uploadReady' : 'upload';
    else if (mode === 'write') screen = 'write';
    return { screen, mode, step: stepRaw, modal, published };
  }, [mode, stepRaw, modal, published]);

  const update = useCallback(
    (patch) => {
      const next = new URLSearchParams(params);
      Object.entries(patch).forEach(([k, v]) => {
        if (v === null || v === undefined || v === '' || v === false) next.delete(k);
        else next.set(k, v === true ? '1' : String(v));
      });
      log('update', patch);
      setParams(next);
    },
    [params, setParams]
  );

  return { ...state, update };
};
