import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import MainLayout from './layout/MainLayout.jsx';
import LandingPage from './pages/LandingPage.jsx';
import HomePage from './pages/HomePage.jsx';
import ProfileEngagementPage from './pages/ProfileEngagementPage.jsx';
import IdentityMapPage from './pages/IdentityMapPage.jsx';
import MilestoneUnlockPage from './pages/MilestoneUnlockPage.jsx';
import Top20MilestonePage from './pages/Top20MilestonePage.jsx';
import { ROUTES } from './constants/routes.js';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* /admin/* slot is reserved for a future lazy-loaded admin subsystem,
            mirroring the elysium pattern. Add it as:
            <Route path="/admin/*" element={<Suspense ...><AdminApp /></Suspense>} /> */}
        <Route element={<MainLayout />}>
          <Route path={ROUTES.home} element={<LandingPage />} />
          {/* /components hosts the design-system playground (HomePage). */}
          <Route path={ROUTES.components} element={<HomePage />} />
        </Route>
        {/* Profile engagement owns its own top/bottom chrome — mounted outside MainLayout. */}
        <Route path={ROUTES.profileEngagement} element={<ProfileEngagementPage />} />
        <Route path={ROUTES.identityMap} element={<IdentityMapPage />} />
        <Route path={ROUTES.milestoneUnlock} element={<MilestoneUnlockPage />} />
        <Route path={ROUTES.top20Milestone} element={<Top20MilestonePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
