import AgencyFrame from '../../components/sections/agency/AgencyFrame.jsx';
import AgencyBriefingModals from '../../components/sections/agency/briefing/AgencyBriefingModals.jsx';
import { useAgencyState } from '../../components/sections/agency/agencyState.js';
import AgencyNationalView from '../../components/sections/agency/national/AgencyNationalView.jsx';

/*
 * AgencyBriefingPage — /agency/briefing (Figma 11.4.4a–e, h): the briefing-pack dialogs drawn over the National data view.
 * URL: modal=download (state=building | failed, pdf=fail) · modal=share (state=copied) · modal=digest — see AgencyBriefingModals for the contract.
 * Without a modal it is the plain National data page (package B's AgencyNationalView), so the rail keeps "National data" active.
 */
const AgencyBriefingPage = () => {
  const data = useAgencyState();
  return (
    <AgencyFrame data={data} title="National data">
      {/* 11.4.4a-e draw the older National data layout behind the dialogs; 11.4.4h (build failed) draws the current one */}
      <AgencyNationalView
        data={data}
        classic={!(data.modal === 'download' && data.state === 'failed')}
      />
      <AgencyBriefingModals data={data} />
    </AgencyFrame>
  );
};

export default AgencyBriefingPage;
