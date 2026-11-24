import { useLocation, useParams } from 'react-router-dom';
import InstitutionFrame from '../../components/sections/institution/InstitutionFrame.jsx';
import { useInstitutionState } from '../../components/sections/institution/institutionState.js';
import ProgressOutcomesView from '../../components/sections/institution/progress/ProgressOutcomesView.jsx';
import ProgressStudentDetail from '../../components/sections/institution/progress/ProgressStudentDetail.jsx';
import ProgressStudentsView from '../../components/sections/institution/progress/ProgressStudentsView.jsx';
import InstitutionAggregateOnly from '../../components/sections/institution/aggregate/InstitutionAggregateOnly.jsx';
import InstitutionAggregateView from '../../components/sections/institution/aggregate/InstitutionAggregateView.jsx';
import { useInstitutionSession } from '../../components/sections/institution/useInstitutionSession.js';

/*
 * InstitutionProgressPage — Theme 11 "Progress" (Figma 11.3.2a-e), three views under /institution/progress:
 *   /institution/progress                         11.3.2a students list   ?tab=form-1|form-2|form-3 ?filter=on-track|needs-support ?view=cards ?sort= ?q=
 *   /institution/progress/students/:studentId     11.3.2b student detail  ?modal=flag = 11.3.2c (Figma draws Kofi Danso: /students/kofi-danso)
 *   /institution/progress/class-outcomes          11.3.2d class outcomes  ?modal=download = 11.3.2e   ?story=<id>
 * The v1 PDF cover 11.3.2f is superseded (the 8-page board report is /institution/report).
 * Aggregate student data mode (ADR-14): the list becomes totals by year group, programme, level and home region (InstitutionAggregateView),
 * a student's page says it isn't shown, and class outcomes stay (masked by the backend).
 */

const InstitutionProgressPage = () => {
  const data = useInstitutionState();
  const { studentId } = useParams();
  const { pathname } = useLocation();
  const outcomes = pathname.endsWith('/class-outcomes');
  const session = useInstitutionSession();
  const aggregate = session.studentData.aggregate;
  const school = session.institution.short || session.institution.name;
  return (
    <InstitutionFrame data={data} title={outcomes ? 'Class outcomes' : 'Progress'}>
      {studentId ? (
        aggregate ? (
          <InstitutionAggregateOnly what="progress" school={school} />
        ) : (
          <ProgressStudentDetail studentId={studentId} data={data} />
        )
      ) : outcomes ? (
        <ProgressOutcomesView data={data} />
      ) : aggregate ? (
        <InstitutionAggregateView variant="progress" school={school} />
      ) : (
        <ProgressStudentsView data={data} />
      )}
    </InstitutionFrame>
  );
};

export default InstitutionProgressPage;
