import OnboardingPanel from '../../shared/OnboardingPanel.jsx';

/*
 * ParentLoginRightPanel — gold (#967014) right panel for all parent onboarding
 * screens. Thin wrapper: the implementation (and the responsiveness contract)
 * lives in shared/OnboardingPanel.jsx; this only pins the parent colourway and
 * tutorial label so every existing call site behaves exactly as before.
 * Props pass straight through (variant, photoCards, overlayContent,
 * centerContent, showWatchTutorial).
 */
const ParentLoginRightPanel = (props) => (
  <OnboardingPanel
    bgColor="#967014"
    ellipseColor="#F9EBEA"
    tutorialAriaLabel="Watch parent onboarding tutorial"
    {...props}
  />
);

export default ParentLoginRightPanel;
