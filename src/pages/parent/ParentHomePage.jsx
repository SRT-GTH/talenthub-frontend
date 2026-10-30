import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { debug } from '../../utils/debug.js';
import { loadParentMe, useParentMe } from '../../components/sections/parent/live/parentLive.js';
import ParentFrame from '../../components/sections/parent/ParentFrame.jsx';
import ParentOverview from '../../components/sections/parent/home/ParentOverview.jsx';
import ParentNoWard from '../../components/sections/parent/states/ParentNoWard.jsx';
import WardLinkedDialog from '../../components/sections/parent/link/WardLinkedDialog.jsx';
import AbenaJoinedNotice from '../../components/sections/parent/notifications/AbenaJoinedNotice.jsx';
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
 * "Try again" on the error state plays the loading skeleton for 1.2 s, then shows the everyday home.
 * Live (signed in, no `?state=`): the state follows GET /parent/me instead: loading -> PD-05, failed -> PD-06 (Try again
 * re-reads), no ward -> PD-01c, otherwise the everyday home with the parent's real data.
 */
// The dashboard frames (PD-01 / 01d / 05 / 07) put the 1376 main column at x 328 .. 1704 (24 / 25 px side margins); the other canvases use a 1329 column.
const DASH_MAIN =
  'min-w-0 flex-1 overflow-y-auto px-[clamp(16px,1.42vw,25px)] pt-[23px] pb-[40px] outline-none';

const STATES = ['busy', 'caught-up', 'offline', 'first', 'none', 'loading', 'error'];

const ParentHomePage = () => {
  const [params, setParams] = useSearchParams();
  const me = useParentMe();
  const raw = params.get('state');
  let state = STATES.includes(raw) ? raw : 'busy';
  if (me.live) {
    if (!me.data) state = me.status === 'error' ? 'error' : 'loading';
    else state = me.data.wards?.length ? 'busy' : 'none';
  }
  const timer = useRef();

  useEffect(() => {
    log('mount', { state });
  }, [state]);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const retry = () => {
    if (me.live) {
      loadParentMe(true);
      return;
    }
    setParams({ state: 'loading' }, { replace: true });
    timer.current = window.setTimeout(() => setParams({}, { replace: true }), 1200);
  };

  if (state === 'loading') {
    return (
      <ParentFrame
        sidebarSlot={<ParentLoadingSidebar className="max-lg:hidden" />}
        mainClassName={DASH_MAIN}
      >
        <ParentLoadingNote />
        <ParentLoadingMain />
      </ParentFrame>
    );
  }

  const sidebar = state === 'none' ? 'none' : state === 'caught-up' ? 'caughtUp' : 'linked';
  return (
    <ParentFrame
      sidebar={sidebar}
      mainClassName={['busy', 'caught-up', 'offline'].includes(state) ? DASH_MAIN : undefined}
    >
      {state === 'busy' ? <ParentOverview live={me.live ? me.data : null} /> : null}
      {state === 'caught-up' ? <ParentOverview variant="caughtUp" /> : null}
      {state === 'offline' ? <ParentOverview offline /> : null}
      {state === 'none' ? <ParentNoWard /> : null}
      {state === 'first' ? <ParentFirstVisit /> : null}
      {state === 'error' ? <ParentHomeError onRetry={retry} /> : null}
      {/* PN-05b (Figma 10079:1025): the in-app notice over the home, `?notice=abena-joined`. */}
      {params.get('notice') === 'abena-joined' ? (
        <AbenaJoinedNotice
          onClose={() =>
            setParams(
              (prev) => {
                const next = new URLSearchParams(prev);
                next.delete('notice');
                return next;
              },
              { replace: true }
            )
          }
        />
      ) : null}
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
