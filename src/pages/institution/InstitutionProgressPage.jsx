import { useLocation, useParams } from 'react-router-dom';
import InstitutionFrame from '../../components/sections/institution/InstitutionFrame.jsx';
import { useInstitutionState } from '../../components/sections/institution/institutionState.js';
import ProgressOutcomesView from '../../components/sections/institution/progress/ProgressOutcomesView.jsx';
import ProgressStudentDetail from '../../components/sections/institution/progress/ProgressStudentDetail.jsx';
import ProgressStudentsView from '../../components/sections/institution/progress/ProgressStudentsView.jsx';

/*
 * InstitutionProgressPage — Theme 11 "Progress" (Figma 11.3.2a-e), three views under /institution/progress:
 *   /institution/progress                         11.3.2a students list   ?tab=form-1|form-2|form-3 ?filter=on-track|needs-support ?view=cards ?sort= ?q=
 *   /institution/progress/students/:studentId     11.3.2b student detail  ?modal=flag = 11.3.2c (Figma draws Kofi Danso: /students/kofi-danso)
 *   /institution/progress/class-outcomes          11.3.2d class outcomes  ?modal=download = 11.3.2e   ?story=<id>
 * The v1 PDF cover 11.3.2f is superseded (the 8-page board report is /institution/report).
 */

const InstitutionProgressPage = () => {
  const data = useInstitutionState();
  const { studentId } = useParams();
  const { pathname } = useLocation();
  const outcomes = pathname.endsWith('/class-outcomes');
  return (
    <InstitutionFrame data={data} title={outcomes ? 'Class outcomes' : 'Progress'}>
      {studentId ? (
        <ProgressStudentDetail studentId={studentId} data={data} />
      ) : outcomes ? (
        <ProgressOutcomesView data={data} />
      ) : (
        <ProgressStudentsView data={data} />
      )}
    </InstitutionFrame>
  );
};

export default InstitutionProgressPage;
