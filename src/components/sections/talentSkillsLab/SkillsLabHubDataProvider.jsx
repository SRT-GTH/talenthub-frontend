import { HubDataContext, MOCK_HUB } from './skillsLabHubData.js';

/* Hands the hub data (useLiveHub() result, or the mock when null) to HubScreens / the Games tab via useHubData(). */
const SkillsLabHubDataProvider = ({ value, children }) => (
  <HubDataContext.Provider value={value ?? MOCK_HUB}>{children}</HubDataContext.Provider>
);

export default SkillsLabHubDataProvider;
