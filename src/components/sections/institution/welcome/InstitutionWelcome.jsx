import { useEffect } from 'react';
import { debug } from '../../../../utils/debug.js';
import { useInstitutionSession } from '../useInstitutionSession.js';
import InstitutionTour from './InstitutionTour.jsx';
import InstitutionWelcomeModal from './InstitutionWelcomeModal.jsx';

const log = debug('InstitutionWelcome');

/*
 * InstitutionWelcome — the first-login overlay of the home page (Figma 11.1.3a welcome modal 8744:428914, 11.1.3b-d tour 8744:429486 / 430003 / 430559).
 * Mount it ONCE inside the home page: <InstitutionWelcome data={data} /> (data = useInstitutionState()). It renders nothing unless the URL asks for it:
 *   ?modal=welcome   the "Akwaaba" modal  (Take the tour → ?tour=1 · Look around first / close / Esc → removes the key)
 *   ?tour=1|2|3      the spotlight tour   (Next → next step · Finish tour / Skip tour / Esc → removes the key)
 * The tour spotlights [data-tour-target="students"] (the "Add your students" quick-action card), the rail links and [data-tour-target="checklist"] (the "Get set up" card).
 * Props: data (useInstitutionState()).
 */

const InstitutionWelcome = ({ data }) => {
  const session = useInstitutionSession();
  const welcome = data.modal === 'welcome';

  useEffect(() => {
    if (welcome || data.tour) log('open', { welcome, tour: data.tour });
  }, [welcome, data.tour]);

  return (
    <>
      {welcome ? (
        <InstitutionWelcomeModal
          firstName={session.admin.firstName}
          institutionName={session.institution.short}
          onClose={() => data.update({ modal: null })}
          onTour={() => data.update({ modal: null, tour: 1 })}
        />
      ) : null}
      {data.tour ? (
        <InstitutionTour
          step={data.tour}
          onStep={(n) => data.update({ tour: n })}
          onClose={() => data.update({ tour: null })}
        />
      ) : null}
    </>
  );
};

export default InstitutionWelcome;
