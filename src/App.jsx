import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import MainLayout from './layout/MainLayout.jsx';
import LandingPage from './pages/LandingPage.jsx';
import HomePage from './pages/HomePage.jsx';
import OnboardingAddressPage from './pages/OnboardingAddressPage.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* /admin/* slot is reserved for a future lazy-loaded admin subsystem,
            mirroring the elysium pattern. Add it as:
            <Route path="/admin/*" element={<Suspense ...><AdminApp /></Suspense>} /> */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/onboarding/address" element={<OnboardingAddressPage />} />
          {/* /components hosts the design-system playground (HomePage). */}
          <Route path="/components" element={<HomePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
