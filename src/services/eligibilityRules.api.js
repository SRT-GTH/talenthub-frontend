import api from './api.js';
import { debug } from '../utils/debug.js';
import { ELIGIBILITY_KEY } from '../utils/opportunityTypes.js';

const log = debug('eligibilityRules.api');

/*
 * The opportunity eligibility rules (platform config opportunity.eligibility_rules, ADR-06), read through
 * GET /api/config/public/:key (any signed-in account). The recruiter job form uses them to offer "Accept applications
 * from talent under 18" only where it counts. Cached for the session; null when they can't be read.
 */
let cached = null;

export const loadEligibilityRules = () => {
  if (!cached) {
    cached = api
      .get(`/config/public/${encodeURIComponent(ELIGIBILITY_KEY)}`)
      .then((res) => res?.data?.value ?? res?.value ?? null)
      .catch((err) => {
        log('rules not available, using the defaults', err?.response?.status);
        cached = null;
        return null;
      });
  }
  return cached;
};
