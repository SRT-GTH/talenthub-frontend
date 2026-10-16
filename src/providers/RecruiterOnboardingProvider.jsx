import { useCallback, useMemo, useState } from 'react';
import { RecruiterOnboardingContext } from './RecruiterOnboardingContext.js';
import { debug } from '../utils/debug.js';

const log = debug('RecruiterOnboardingProvider');

/*
 * RecruiterOnboardingProvider - in-memory MOCK state for the recruiter
 * onboarding flow (frontend only: nothing here calls an API).
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
