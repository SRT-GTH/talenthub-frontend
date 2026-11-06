import { useLocation, useNavigate, useParams } from 'react-router-dom';
import InstitutionFrame from '../../components/sections/institution/InstitutionFrame.jsx';
import { useInstitutionState } from '../../components/sections/institution/institutionState.js';
import ApplicantsBoard from '../../components/sections/institution/programmes/ApplicantsBoard.jsx';
import ProgrammePublishedView from '../../components/sections/institution/programmes/ProgrammePublishedView.jsx';
import ProgrammeTalentPreview from '../../components/sections/institution/programmes/ProgrammeTalentPreview.jsx';
import ProgrammesListView from '../../components/sections/institution/programmes/ProgrammesListView.jsx';
import TemplatesView from '../../components/sections/institution/programmes/TemplatesView.jsx';
import WhoCanApplyView from '../../components/sections/institution/programmes/WhoCanApplyView.jsx';

/*
 * InstitutionProgrammesPage — Figma 11.3.1a-d + 11.3.4a-e (canvas 8520:10). One page for every programme route (InstitutionApp.jsx):
 *   /institution/programmes                         list: All 11.3.4a · ?tab=drafts 11.3.4b · ?modal=actions&at=<id> 11.3.4d · ?modal=close&at=<id> 11.3.4e
 *   /institution/programmes/new                     "Who can apply" 11.3.1a · ?modal=templates "Programme templates" 11.3.4c
 *   /institution/programmes/new?modal=preview       "Preview as a student" 11.3.1b (student chrome)
 *   /institution/programmes/:id                     the programme as students see it; ?state=published adds "Programme published!" 11.3.1c
 *   /institution/programmes/:id/applicants          "Applicants" board 11.3.1d
 * URL keys of this page: tab=drafts|live|closed · q= · group= (templates) · programme= · template= · at= (card) · modal=actions|close|templates|preview ·
 * state=policy-block (the "Remove contact details to publish" dialog over the form, ⚠️ ASSUMPTION: not drawn for institutions).
 */

const InstitutionProgrammesPage = () => {
  const data = useInstitutionState();
  const { pathname } = useLocation();
  const params = useParams();
  const navigate = useNavigate();
  const path = pathname.replace(/\/+$/, '');
  const isNew = path.endsWith('/programmes/new');
  const isApplicants = path.endsWith('/applicants');
  const programmeId = params.programmeId;

  if (isNew && data.modal === 'preview') {
    return <ProgrammeTalentPreview programmeId={data.params.get('programme')} />;
  }

  if (isApplicants) {
    return (
      <InstitutionFrame data={data} title="Applicants" active="programmes">
        <ApplicantsBoard
          programmeId={programmeId}
          onProgramme={(id) => navigate(`/institution/programmes/${id}/applicants`)}
        />
      </InstitutionFrame>
    );
  }

  if (programmeId && !isNew) {
    return (
      <InstitutionFrame data={data} title="Programme" active="programmes">
        <ProgrammePublishedView programmeId={programmeId} dialog={data.state === 'published'} />
      </InstitutionFrame>
    );
  }

  if (isNew) {
    const templates = data.modal === 'templates';
    return (
      <InstitutionFrame
        data={data}
        title={templates ? 'Programme templates' : 'Who can apply'}
        active="programmes"
      >
        {templates ? <TemplatesView data={data} /> : <WhoCanApplyView data={data} />}
      </InstitutionFrame>
    );
  }

  return (
    <InstitutionFrame data={data} title="Programmes" active="programmes">
      <ProgrammesListView data={data} />
    </InstitutionFrame>
  );
};

export default InstitutionProgrammesPage;
