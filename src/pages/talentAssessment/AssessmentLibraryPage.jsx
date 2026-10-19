import { useEffect } from 'react';
import { debug } from '../../utils/debug.js';
import AssessmentFrame from '../../components/sections/talentAssessment/AssessmentFrame.jsx';
import AssessmentLibrary from '../../components/sections/talentAssessment/AssessmentLibrary.jsx';
import { useAssessmentState } from '../../components/sections/talentAssessment/assessmentState.js';
import { ASSESSMENT_LIBRARY } from '../../components/sections/talentAssessment/assessmentData.js';

const log = debug('AssessmentLibraryPage');

/* AssessmentLibraryPage — `/my-assessment/library` (MA-09): the talent shell around the assessments library. */
const AssessmentLibraryPage = () => {
  const assessment = useAssessmentState();
  useEffect(() => {
    log('mount');
  }, []);
  return (
    <AssessmentFrame assessment={assessment}>
      <AssessmentLibrary data={ASSESSMENT_LIBRARY} />
    </AssessmentFrame>
  );
};

export default AssessmentLibraryPage;
