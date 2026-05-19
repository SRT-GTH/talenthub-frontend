import { useContext } from 'react';
import { OnboardingContext } from '../providers/OnboardingContext.js';

// Hook used by every onboarding page to read the captured DOB / age /
// isMinor flags and to call `setDateOfBirth` from the DOB step. Throws
// loudly if used outside <OnboardingProvider> so the age-branching
// logic can't silently no-op.
export const useOnboarding = () => {
  const ctx = useContext(OnboardingContext);
  if (!ctx) {
    throw new Error('useOnboarding must be used within an <OnboardingProvider>');
  }
  return ctx;
};
