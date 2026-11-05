import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import SettingsPage from '../../components/sections/parent/settings/SettingsPage.jsx';

// /parent/settings — see components/sections/parent/settings/SettingsPage.jsx for the frame → URL map.
const ParentSettingsPage = () => {
  useDocumentTitle('Settings');
  return <SettingsPage />;
};

export default ParentSettingsPage;
