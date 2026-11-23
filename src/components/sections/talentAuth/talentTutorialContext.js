import { createContext, useContext } from 'react';

/*
 * talentTutorialContext — lets the "watch tutorial" buttons drawn inside a sign-up step's panel art open the
 * onboarding tutorial. TalentOnboardingPanel provides `open`; outside it the hook returns undefined.
 */
export const TalentTutorialContext = createContext(undefined);

export const useOpenTalentTutorial = () => useContext(TalentTutorialContext);
