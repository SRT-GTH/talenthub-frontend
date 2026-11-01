import { useMemo, useState } from 'react';
import { OnboardingContext } from './OnboardingContext.js';
import { debug } from '../utils/debug.js';

const log = debug('OnboardingProvider');

/*
 * OnboardingProvider — ephemeral state for the talent onboarding flow.
 *
 * Holds whatever needs to span pages but doesn't belong in Redux yet
 * (the slice would be empty 95% of the time since the flow tears down
 * once the user lands on the dashboard). DOB is captured on step 01;
 * the rest of the flow reads `isMinor` to decide which step list to
 * render and whether the Parent Info page is part of the journey.
 *
 * Wrap the onboarding subtree (or the whole app — the provider stays
 * cheap if unused) in <OnboardingProvider>; consumers call
 * `useOnboarding()` to read or update.
 *
 * The context object + hook live in sibling modules
 * (OnboardingContext.js, useOnboarding.js) so this file only exports
 * components — keeps react-refresh happy.
 */

const initialState = {
  // Captured on /onboarding/talent/dob, drives age-gating downstream.
  dob: '',
  age: null,
  // Derived from age — `null` until DOB is set.
  isMinor: null,
};

// The DOB is kept in sessionStorage next to the onboarding session token (onboarding.api.js), so a page refresh
// mid-flow keeps the under-18 path (Parent step, step count). Without it a refreshed minor was treated as an adult.
const STORE_KEY = 'th:onboarding-dob';

const readStored = () => {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORE_KEY) || 'null');
    if (saved && typeof saved.age === 'number') {
      return { dob: saved.dob || '', age: saved.age, isMinor: saved.age < 18 };
    }
  } catch {
    /* storage unavailable: start empty */
  }
  return initialState;
};

const writeStored = (value) => {
  try {
    if (value) sessionStorage.setItem(STORE_KEY, JSON.stringify(value));
    else sessionStorage.removeItem(STORE_KEY);
  } catch {
    /* storage unavailable: in-memory only */
  }
};

export const OnboardingProvider = ({ children }) => {
  const [state, setState] = useState(readStored);

  const value = useMemo(
    () => ({
      ...state,
      // Single setter for the DOB step. Pages should call this instead
      // of poking at `setState` directly so the derived `isMinor` flag
      // stays consistent with the captured age.
      setDateOfBirth: ({ dob, age }) => {
        log('setDateOfBirth:', { dob, age });
        writeStored(typeof age === 'number' ? { dob, age } : null);
        setState((prev) => ({
          ...prev,
          dob,
          age,
          isMinor: typeof age === 'number' ? age < 18 : null,
        }));
      },
      reset: () => {
        log('reset');
        writeStored(null);
        setState(initialState);
      },
    }),
    [state]
  );

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
};
