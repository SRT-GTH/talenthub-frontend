import { createContext } from 'react';

// Shared context object — split out so the provider component file can
// stay purely component-exporting (keeps react-refresh's
// only-export-components rule happy).
export const OnboardingContext = createContext(null);
