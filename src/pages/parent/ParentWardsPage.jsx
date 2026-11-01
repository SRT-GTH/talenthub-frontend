import { useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import ParentFrame from '../../components/sections/parent/ParentFrame.jsx';
import WardsAll from '../../components/sections/parent/wards/WardsAll.jsx';
import ParentToast from '../../components/sections/parent/wards/dialogs/ParentToast.jsx';
import { unlinkToast } from '../../components/sections/parent/wards/dialogs/data/dialogsData.js';
import { WARDS } from '../../components/sections/parent/wards/data/wardsData.js';
import { useParentMe } from '../../components/sections/parent/live/parentLive.js';
import { wardView } from '../../components/sections/parent/live/parentLiveView.js';

/*
 * ParentWardsPage — /parent/wards (Figma PW-01 "My wards · All" 10033:5115). `?unlinked=elliot` is PW-15b "Elliot unlinked (toast)" 10078:25861: Elliot is gone from the list, the sidebar
 * says "1 ward linked" and the "Elliot is no longer linked" toast shows for 4 s. ⚠️ ASSUMPTION: the unlink is only in the URL (mock), so a reload without the param brings Elliot back.
 * Live (signed in): the parent's real wards (GET /parent/me). After a real unlink the ward page navigates here with
 * `state.unlinked` ({ firstName, pronoun }) for the toast; the list itself already comes without that ward. A link made
 * with a code lands here with `state.linked` ({ firstName }).
 */
const ParentWardsPage = () => {
  const [params] = useSearchParams();
  const { state: navState } = useLocation();
  const me = useParentMe();
  const navigate = useNavigate();
  const gone = me.live ? navState?.unlinked : WARDS[params.get('unlinked')];
  const justLinked = me.live ? navState?.linked : null;
  // PW-08c (Figma 10056:2958): `?toast=accepted`, where the link flow's good code lands. ⚠️ ASSUMPTION: the sidebar counts three wards; the Kwesi row stays the pending one.
  const accepted = !me.live && params.get('toast') === 'accepted';
  const [toast, setToast] = useState(
    gone
      ? {
          ...unlinkToast(gone),
          ...(me.live
            ? { detail: `${gone.firstName} has been told.`, actionLabel: undefined }
            : {}),
        }
      : justLinked
        ? {
            message: `${justLinked.firstName} is linked`,
            detail: 'You now see their profile, flags and activity here.',
            actionLabel: 'Open',
            onAction: () => navigate(`/parent/wards/${justLinked.id}`),
          }
        : accepted
          ? {
              message: 'Kwesi accepted your request',
              detail: 'He now has the same controls as Abena and Elliot.',
              actionLabel: 'Open Kwesi',
              onAction: () => navigate('/parent/wards/kwesi'),
            }
          : null
  );
  const liveWards = me.live ? (me.data?.wards || []).map((w) => wardView(w)) : null;
  return (
    <ParentFrame active="wards" sidebar={gone ? 'oneWard' : accepted ? 'threeWards' : 'linked'}>
      {me.live ? (
        <WardsAll
          wards={liveWards}
          empty={
            me.status === 'error'
              ? me.error
              : me.data
                ? 'No ward linked yet. Link your child with their 6-character code.'
                : 'Loading…'
          }
          onLink={() => navigate('/parent/link-ward')}
        />
      ) : (
        <WardsAll hide={gone ? [gone.id] : []} onLink={() => navigate('/parent/link-ward')} />
      )}
      {toast ? <ParentToast {...toast} onClose={() => setToast(null)} /> : null}
    </ParentFrame>
  );
};

export default ParentWardsPage;
