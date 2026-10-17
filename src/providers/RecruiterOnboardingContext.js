import { createContext } from 'react';

// Split from the provider so the provider file only exports a component
// (keeps react-refresh's only-export-components rule happy).
export const RecruiterOnboardingContext = createContext(null);
