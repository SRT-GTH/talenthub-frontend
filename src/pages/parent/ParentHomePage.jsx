import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { debug } from '../../utils/debug.js';
import ParentFrame from '../../components/sections/parent/ParentFrame.jsx';
import ParentOverview from '../../components/sections/parent/home/ParentOverview.jsx';
import ParentNoWard from '../../components/sections/parent/states/ParentNoWard.jsx';
import WardLinkedDialog from '../../components/sections/parent/link/WardLinkedDialog.jsx';
import ParentFirstVisit from '../../components/sections/parent/states/ParentFirstVisit.jsx';
import ParentHomeError from '../../components/sections/parent/states/ParentHomeError.jsx';
import {
  ParentLoadingMain,
  ParentLoadingNote,
  ParentLoadingSidebar,
} from '../../components/sections/parent/states/ParentHomeLoading.jsx';

const log = debug('ParentHomePage');

/*
 * ParentHomePage — /parent (Figma file SCXc457vwiq6o7d9g4jVbh, canvas "Parent · 01 Home and dashboard" 10057:530; persona Emma Mensah). One page, seven states chosen by `?state=`:
 *   (none) / busy        PD-01   10027:1458  everyday home, three wards, four things waiting
 *   caught-up            PD-01d  10056:158090  nothing needs the parent
 *   offline              PD-07   10077:20066   the everyday home with the "You're offline" banner
 *   first                PD-01b  10034:1556    first visit after Abena is linked
 *   none                 PD-01c  10034:2499    no linked ward yet
 *   loading              PD-05   10047:147949  skeleton while the wards load
 *   error                PD-06   10047:148153  couldn't load (offline note)
 * "Try again" on the error state plays the loading skeleton for 1.2 s, then shows the everyday home. Mock data only; no backend.
 */
const STATES = ['busy', 'caught-up', 'offline', 'first', 'none', 'loading', 'error'];

const ParentHomePage = () => {
  const [params, setParams] = useSearchParams();
  const raw = params.get('state');
  const state = STATES.includes(raw) ? raw : 'busy';
  const timer = useRef();

  useEffect(() => {
    log('mount', { state });
  }, [state]);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const retry = () => {
    setParams({ state: 'loading' }, { replace: true });
    timer.current = window.setTimeout(() => setParams({}, { replace: true }), 1200);
  };

  if (state === 'loading') {
    return (
      <ParentFrame sidebarSlot={<ParentLoadingSidebar className="max-lg:hidden" />}>
        <ParentLoadingNote />
        <ParentLoadingMain />
      </ParentFrame>
    );
  }

  const sidebar = state === 'none' ? 'none' : state === 'caught-up' ? 'caughtUp' : 'linked';
  return (
    <ParentFrame sidebar={sidebar}>
      {state === 'busy' ? <ParentOverview /> : null}
      {state === 'caught-up' ? <ParentOverview variant="caughtUp" /> : null}
      {state === 'offline' ? <ParentOverview offline /> : null}
      {state === 'none' ? <ParentNoWard /> : null}
      {state === 'first' ? <ParentFirstVisit /> : null}
      {state === 'error' ? <ParentHomeError onRetry={retry} /> : null}
      {params.get('modal') === 'ward-linked' ? (
        <WardLinkedDialog
          onClose={() =>
            setParams(
              (prev) => {
                const next = new URLSearchParams(prev);
                next.delete('modal');
                return next;
              },
              { replace: true }
            )
          }
        />
      ) : null}
    </ParentFrame>
  );
};

export default ParentHomePage;
