import { debug } from '../utils/debug.js';

const log = debug('stepUpBridge');

/*
 * stepUpBridge — connects the api client to the "Confirm it's you" sheet (MFA Phase 3) without an import cycle.
 *   services/api.js     on 403 STEP_UP_REQUIRED: `await requestStepUp(info)`; true -> retry the request once.
 *   StepUpSheet.jsx     registers itself with setStepUpHandler(fn); fn(info) resolves true once the user has confirmed
 *                       (POST /security/step-up), false if they cancel.
 * Requests that fail together share one sheet. With no sheet mounted the answer is false (the original error stands).
 */

let handler = null;
let pending = null;

export const setStepUpHandler = (fn) => {
  handler = fn;
  return () => {
    if (handler === fn) handler = null;
  };
};

export const requestStepUp = (info = {}) => {
  if (!handler) {
    log('no sheet mounted');
    return Promise.resolve(false);
  }
  if (!pending) {
    log('asking', { maxAgeMin: info.maxAgeMin, methods: info.methods });
    pending = Promise.resolve(handler(info))
      .catch(() => false)
      .finally(() => {
        pending = null;
      });
  }
  return pending;
};
