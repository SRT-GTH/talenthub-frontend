import { useContext } from 'react';
import { RecruiterOnboardingContext } from '../providers/RecruiterOnboardingContext.js';

// Read / write the mock recruiter-onboarding state. Throws outside the provider
// so a mis-mounted page fails loudly instead of silently dropping input.
export const useRecruiterOnboarding = () => {
  const ctx = useContext(RecruiterOnboardingContext);
  if (!ctx) {
    throw new Error('useRecruiterOnboarding must be used within a <RecruiterOnboardingProvider>');
  }
  return ctx;
};
