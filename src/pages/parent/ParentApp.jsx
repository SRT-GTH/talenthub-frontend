import { lazy, Suspense } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import PageLoader from '../../components/ui/gthLoader/PageLoader.jsx';
import ParentFrame from '../../components/sections/parent/ParentFrame.jsx';

const ParentHomePage = lazy(() => import('./ParentHomePage.jsx'));

/*
 * ParentApp — the /parent/* router (Theme: Parents, Figma file SCXc457vwiq6o7d9g4jVbh). Outside MainLayout, like /admin and /agency; the chrome is ParentFrame.
 * Built so far: /parent (home, 7 states). The other sidebar pages (My wards, To review, Evaluate, Ward wallets, Notifications, Settings, Help) are later canvases: they land on a short
 * "not designed yet" note inside the chrome so the nav never dead-ends. Mock session: Emma Mensah, no auth gate yet.
 */
const Fallback = () => <PageLoader look="focused" />;

const NotBuilt = () => {
  const { pathname } = useLocation();
  const name = pathname.replace('/parent/', '').replace(/-/g, ' ');
  return (
    <ParentFrame>
      <div className="mx-auto flex w-full max-w-[1329px] flex-col gap-[8px]">
        <h1 className="m-0 font-sans text-[34px] leading-[1.2] font-semibold tracking-[-0.68px] text-[#1c2a21] capitalize">
          {name}
        </h1>
        <p className="m-0 font-sans text-[16px] leading-[24px] text-[#999]">
          This screen is not designed yet. It arrives with the next parent canvas.
        </p>
      </div>
    </ParentFrame>
  );
};

const ParentApp = () => (
  <Suspense fallback={<Fallback />}>
    <Routes>
      <Route index element={<ParentHomePage />} />
      <Route path="*" element={<NotBuilt />} />
    </Routes>
  </Suspense>
);

export default ParentApp;
