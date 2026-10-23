import { lazy, Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';
import CommunitiesSwitchSlot from './CommunitiesSwitchSlot.jsx';

const CirclePage = lazy(() => import('../../../../pages/talentCommunity/circle/CirclePage.jsx'));

/*
 * CircleViewGate — the one door to My circle (flow step 2). `/community` keeps rendering the Communities page exactly as before
 * (children) with the "Communities | My circle" switch added on top; `/community?view=circle` renders My circle instead.
 * Props: children (the Communities page: demo or live), rail ('collapsed' | 'expanded').
 */
const CircleViewGate = ({ children, rail }) => {
  const [params] = useSearchParams();
  if (params.get('view') === 'circle') {
    return (
      <Suspense fallback={null}>
        <CirclePage />
      </Suspense>
    );
  }
  // `?nocircle=1` hides the switch (the 14 Oct Community v2 frames C-01…C-17 do not draw it; use it to audit them as drawn).
  if (params.get('nocircle') === '1') return children;
  return <CommunitiesSwitchSlot rail={rail}>{children}</CommunitiesSwitchSlot>;
};

export default CircleViewGate;
