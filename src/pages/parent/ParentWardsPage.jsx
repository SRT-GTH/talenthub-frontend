import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
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
  const [toast, setToast] = useState(gone ? unlinkToast(gone) : null);
  return (
    <ParentFrame active="wards" sidebar={gone ? 'oneWard' : 'linked'}>
      <WardsAll hide={gone ? [gone.id] : []} />
      {toast ? <ParentToast {...toast} onClose={() => setToast(null)} /> : null}
    </ParentFrame>
  );
};

export default ParentWardsPage;
