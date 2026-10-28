import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ParentFrame from '../../components/sections/parent/ParentFrame.jsx';
import WardsAll from '../../components/sections/parent/wards/WardsAll.jsx';
import ParentToast from '../../components/sections/parent/wards/dialogs/ParentToast.jsx';
import { unlinkToast } from '../../components/sections/parent/wards/dialogs/data/dialogsData.js';
import { WARDS } from '../../components/sections/parent/wards/data/wardsData.js';

/*
 * ParentWardsPage — /parent/wards (Figma PW-01 "My wards · All" 10033:5115). `?unlinked=elliot` is PW-15b "Elliot unlinked (toast)" 10078:25861: Elliot is gone from the list, the sidebar
 * says "1 ward linked" and the "Elliot is no longer linked" toast shows for 4 s. ⚠️ ASSUMPTION: the unlink is only in the URL (mock), so a reload without the param brings Elliot back.
 */
const ParentWardsPage = () => {
  const [params] = useSearchParams();
  const gone = WARDS[params.get('unlinked')];
  const navigate = useNavigate();
  // PW-08c (Figma 10056:2958): `?toast=accepted`, where the link flow's good code lands. ⚠️ ASSUMPTION: the sidebar counts three wards; the Kwesi row stays the pending one.
  const accepted = params.get('toast') === 'accepted';
  const [toast, setToast] = useState(
    gone
      ? unlinkToast(gone)
      : accepted
        ? {
            message: 'Kwesi accepted your request',
            detail: 'He now has the same controls as Abena and Elliot.',
            actionLabel: 'Open Kwesi',
            onAction: () => navigate('/parent/wards/kwesi'),
          }
        : null
  );
  return (
    <ParentFrame active="wards" sidebar={gone ? 'oneWard' : accepted ? 'threeWards' : 'linked'}>
      <WardsAll hide={gone ? [gone.id] : []} onLink={() => navigate('/parent/link-ward')} />
      {toast ? <ParentToast {...toast} onClose={() => setToast(null)} /> : null}
    </ParentFrame>
  );
};

export default ParentWardsPage;
