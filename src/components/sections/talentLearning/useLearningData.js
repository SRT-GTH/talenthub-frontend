import { createContext, useContext } from 'react';

/** Context + hook for LearningDataProvider (split out so the provider file only exports a component). */
export const LearningDataContext = createContext(null);

export const useLearningData = () => {
  const ctx = useContext(LearningDataContext);
  if (!ctx) throw new Error('useLearningData must be used inside <LearningDataProvider>');
  return ctx;
};
