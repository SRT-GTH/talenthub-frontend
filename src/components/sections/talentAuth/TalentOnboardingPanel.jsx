import { useState } from 'react';
import OnboardingPanel from '../../shared/OnboardingPanel.jsx';
import LoginTutorialModal from './LoginTutorialModal.jsx';
import { TalentTutorialContext } from './talentTutorialContext.js';
import { debug } from '../../../utils/debug.js';

const log = debug('TalentOnboardingPanel');

/*
 * TalentOnboardingPanel - green (#387440) right panel for the talent flow, on
 * the shared OnboardingPanel (parent-flow responsiveness contract). Talent's
 * two ellipse tints are kept: amber top-right, coral bottom-left.
 * Pass `photoCards` + `overlayContent` from the step's *PanelContent file.
 * The panel's Watch Tutorial button opens the onboarding tutorial (the same one as on login) on every step,
 * unless a step passes its own onWatchTutorial.
 */
const TalentOnboardingPanel = (props) => {
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const openTutorial = () => {
    log('open tutorial');
    setTutorialOpen(true);
  };
  // The steps draw their own tutorial button inside the panel art; the context hands it openTutorial.
  return (
    <TalentTutorialContext.Provider value={openTutorial}>
      <OnboardingPanel
        bgColor="#387440"
        ellipseTopRightColor="#F7EFDD"
        ellipseBottomLeftColor="#F9EBEA"
        tutorialAriaLabel="Watch talent onboarding tutorial"
        onWatchTutorial={openTutorial}
        {...props}
      />
      <LoginTutorialModal isOpen={tutorialOpen} onClose={() => setTutorialOpen(false)} />
    </TalentTutorialContext.Provider>
  );
};

export default TalentOnboardingPanel;
