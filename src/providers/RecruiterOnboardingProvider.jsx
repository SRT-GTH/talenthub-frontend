import { useCallback, useEffect, useMemo, useState } from 'react';
import { isLoggedIn } from '../services/auth.api.js';
import { getOnboarding, onboardingToSections } from '../services/recruiterOnboarding.api.js';
import { RecruiterOnboardingContext } from './RecruiterOnboardingContext.js';
import { debug } from '../utils/debug.js';

const log = debug('RecruiterOnboardingProvider');

/*
 * RecruiterOnboardingProvider - in-memory state for the recruiter onboarding
 * flow. Since 2026-10-18 each step also saves to the backend
 * (services/recruiterOnboarding.api.js); this context is the UI copy, and is
 * restored from GET /api/recruiter/onboarding after a refresh.
 *
 * Shape is a plain object keyed by step section, e.g.
 *   data.profile       { fullName, email, phone, passwordSet }
 *   data.recruiterType 'dedicated' | 'freelance'
 *   data.organisation  { ... }           data.plan        { tier, billing }
 *   data.payment       { method, status } data.preferences { ... }
 *   data.terms         { accepted }
 * Each step owns the shape of ITS section (documented in its page file) and
 * writes it through setSection(key, patch) - shallow-merged, so a step never
 * has to touch another step's slice. Passwords are NEVER stored: only a
 * `passwordSet` boolean. Card numbers are NEVER stored either: only the last
 * four digits / brand.
 *
 * INTEGRATION: when the backend lands, call the service inside each page's
 * submit handler (or swap setSection's body). Pages read `data` and write via
 * setSection only, so nothing else changes.
 *
 * There are deliberately NO route guards: the DemoNavigator and direct links
 * must be able to open any step, so every page has demo-safe defaults.
 */
export const RecruiterOnboardingProvider = ({ children }) => {
  const [data, setData] = useState({});

  // 2026-10-18: resume after a refresh - a logged-in recruiter's progress is
  // loaded from GET /api/recruiter/onboarding (sections typed this session win).
  useEffect(() => {
    if (!isLoggedIn()) return;
    let alive = true;
    getOnboarding()
      .then((o) => {
        if (!alive || !o) return;
        const restored = onboardingToSections(o);
        log('restored from backend', Object.keys(restored));
        setData((prev) => ({ ...restored, ...prev }));
      })
      .catch((err) => log('no onboarding to restore', err?.code));
    return () => {
      alive = false;
    };
  }, []);

  const setSection = useCallback((key, patch) => {
    log('setSection', { key, patchType: Array.isArray(patch) ? 'array' : typeof patch });
    setData((prev) => ({
      ...prev,
      [key]:
        patch && typeof patch === 'object' && !Array.isArray(patch)
          ? { ...(prev[key] && typeof prev[key] === 'object' ? prev[key] : {}), ...patch }
          : patch,
    }));
  }, []);

  const reset = useCallback(() => {
    log('reset');
    setData({});
  }, []);

  const value = useMemo(() => ({ data, setSection, reset }), [data, setSection, reset]);

  return (
    <RecruiterOnboardingContext.Provider value={value}>
      {children}
    </RecruiterOnboardingContext.Provider>
  );
};
