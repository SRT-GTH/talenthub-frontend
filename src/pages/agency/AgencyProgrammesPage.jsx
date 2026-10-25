import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import AgencyFrame from '../../components/sections/agency/AgencyFrame.jsx';
import { useAgencyState } from '../../components/sections/agency/agencyState.js';
import ApplicantsBoard from '../../components/sections/agency/programmes/ApplicantsBoard.jsx';
import ProgrammePublishedView from '../../components/sections/agency/programmes/ProgrammePublishedView.jsx';
import ProgrammeTalentPreview from '../../components/sections/agency/programmes/ProgrammeTalentPreview.jsx';
import ProgrammesListView from '../../components/sections/agency/programmes/ProgrammesListView.jsx';
import TemplatesView from '../../components/sections/agency/programmes/TemplatesView.jsx';
import WhoCanApplyView from '../../components/sections/agency/programmes/WhoCanApplyView.jsx';

/*
 * AgencyProgrammesPage — Figma 11.5.2a-k (canvas 8605:395409). One page for every programme route (AgencyApp.jsx):
 *   /agency/programmes                          list: All 11.5.2e · ?tab=drafts 11.5.2f · ?modal=actions&at=<id> 11.5.2j · ?modal=close&at=<id> 11.5.2k
 *   /agency/programmes/new                      "Who can apply" 11.5.2a · ?state=audience-under-5 11.5.2h · ?state=policy-block 11.5.2i
 *   /agency/programmes/new?modal=template       "Programme templates" 11.5.2g
 *   /agency/programmes/new?view=preview         "Preview as a talent" 11.5.2b (talent chrome)
 *   /agency/programmes/:id?state=published      "Programme published!" over the preview 11.5.2c
 *   /agency/programmes/:id/applicants           "Applicants" pipeline 11.5.2d (also /agency/applicants)
 * URL keys of this page: tab=drafts|live|closed · q= · group= (templates) · programme= · template= · view=preview · at= (card) · state=audience-under-5|
 * policy-block|published · modal=actions|close|template. ⚠️ ASSUMPTION: /agency/programmes/:id without ?state=published opens its applicants.
 */

const AgencyProgrammesPage = () => {
  const data = useAgencyState();
  const { pathname } = useLocation();
  const { programmeId } = useParams();
  const navigate = useNavigate();
  const path = pathname.replace(/\/+$/, '');
  const isNew = path.endsWith('/programmes/new');
  const isApplicants = path.endsWith('/applicants');

  // the preview carries the talent chrome (Figma 11.5.2b), so it is not wrapped in AgencyFrame
  if (isNew && data.view === 'preview') {
    return <ProgrammeTalentPreview programmeId={data.params.get('programme') ?? 'ysd-2026'} />;
  }

  if (isApplicants) {
    return (
      <AgencyFrame data={data} title="Applicants" active="applicants">
        <ApplicantsBoard
          programmeId={programmeId ?? 'ysd-2026'}
          onProgramme={(id) => navigate(`/agency/programmes/${id}/applicants`)}
        />
      </AgencyFrame>
    );
  }

  if (programmeId && !isNew) {
    if (data.state === 'published') {
      return (
        <AgencyFrame data={data} title="Programme published" active="programmes">
          <ProgrammePublishedView programmeId={programmeId} />
        </AgencyFrame>
      );
    }
    return <Navigate to={`/agency/programmes/${programmeId}/applicants`} replace />;
  }

  if (isNew) {
    const templates = data.modal === 'template';
    return (
      <AgencyFrame
        data={data}
        title={templates ? 'Programme templates' : 'Who can apply'}
        active="programmes"
      >
        {templates ? <TemplatesView data={data} /> : <WhoCanApplyView data={data} />}
      </AgencyFrame>
    );
  }

  return (
    <AgencyFrame data={data} title="Programmes" active="programmes">
      <ProgrammesListView data={data} />
    </AgencyFrame>
  );
};

export default AgencyProgrammesPage;
