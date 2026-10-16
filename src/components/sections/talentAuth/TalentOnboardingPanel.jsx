import OnboardingPanel from '../../shared/OnboardingPanel.jsx';

/*
 * TalentOnboardingPanel - green (#387440) right panel for the talent flow, on
 * the shared OnboardingPanel (parent-flow responsiveness contract). Talent's
 * two ellipse tints are kept: amber top-right, coral bottom-left.
 * Pass `photoCards` + `overlayContent` from the step's *PanelContent file.
 */
const TalentOnboardingPanel = (props) => (
  <OnboardingPanel
    bgColor="#387440"
    ellipseTopRightColor="#F7EFDD"
    ellipseBottomLeftColor="#F9EBEA"
    tutorialAriaLabel="Watch talent onboarding tutorial"
    {...props}
  />
);

export default TalentOnboardingPanel;
