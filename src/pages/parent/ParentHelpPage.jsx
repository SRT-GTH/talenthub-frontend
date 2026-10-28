import { useNavigate, useSearchParams } from 'react-router-dom';
import { debug } from '../../utils/debug.js';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import ParentFrame from '../../components/sections/parent/ParentFrame.jsx';
import { WARDS } from '../../components/sections/parent/wards/data/wardsData.js';
import HelpGuides from '../../components/sections/parent/help/HelpGuides.jsx';
import ReportConcernLayer from '../../components/sections/parent/optout/ReportConcernLayer.jsx';

const log = debug('ParentHelpPage');

/*
 * ParentHelpPage — /parent/help "Help and guides" (Figma file SCXc457vwiq6o7d9g4jVbh, drawn behind PH-03 10057:1591 and PH-03b 10057:1806 of canvas "Parent · 05 Opt out and restore" 10057:1302).
 *   (none)                                                 the page: search, six topics, "Talk to the GTH parent team"
 *   ?modal=report[&who=abena&worry=contacted&note=…]       PH-03   "Report a safety concern" over the page
 *   ?modal=report-sent&about=abena                         PH-03b  "Thank you, Emma. We’re on it."; "Opt Abena out" goes to /parent/wards/abena?modal=opt-out
 * The dialogs are parent/optout/ReportConcernLayer (shared with the ward page). Mock data only.
 */
const LINKED_WARDS = [WARDS.abena, WARDS.elliot];
const LINKED_IDS = LINKED_WARDS.map((w) => w.id);

const ParentHelpPage = () => {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  useDocumentTitle('Help and guides');
  log('render', { modal: params.get('modal') });

  const openReport = () => {
    const p = new URLSearchParams(params);
    p.set('modal', 'report');
    setParams(p, { replace: true });
  };

  return (
    <ParentFrame active="help" sidebar="linked">
      <HelpGuides onReport={openReport} />
      <ReportConcernLayer
        defaultWho={WARDS.abena.id}
        linkedWards={LINKED_WARDS}
        optOutIds={LINKED_IDS}
        onOptOut={(ward) => navigate(`/parent/wards/${ward.id}?modal=opt-out`)}
      />
    </ParentFrame>
  );
};

export default ParentHelpPage;
