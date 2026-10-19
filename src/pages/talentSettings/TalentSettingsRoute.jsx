import { useParams } from 'react-router-dom';
import TalentSettingsPage from './TalentSettingsPage.jsx';

// `/settings` (no section) and unknown sections are handled inside the page (redirect to account).
const TalentSettingsRoute = () => {
  const { section } = useParams();
  return <TalentSettingsPage sectionParam={section} />;
};

export default TalentSettingsRoute;
