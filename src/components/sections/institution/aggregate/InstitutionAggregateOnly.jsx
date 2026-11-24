import { Link } from 'react-router-dom';

/*
 * InstitutionAggregateOnly — the page body where a named-student page would be, for an institution in the aggregate student data mode
 * (ADR-14): a student record (/institution/students/:id), one student's progress (/institution/progress/students/:id) and Credentials,
 * which need the named roster. The backend refuses those calls (403 STUDENT_DATA_AGGREGATE_ONLY); this says why and where to go instead.
 * Props: what ('student' | 'progress' | 'credentials'), school (short name).
 */

const COPY = {
  student: {
    title: 'Student records aren’t shown',
    body: '{school} sees student data as totals, so individual students and their records are not shown.',
    to: '/institution/students',
    cta: 'See student totals',
  },
  progress: {
    title: 'One student’s progress isn’t shown',
    body: '{school} sees student data as totals, so progress is shown by year group, programme and region, not per student.',
    to: '/institution/progress',
    cta: 'See progress totals',
  },
  credentials: {
    title: 'Credentials need named students',
    body: 'Issuing and managing credentials needs your named roster. {school} sees student data as totals, so credentials are not available.',
    to: '/institution',
    cta: 'Back to home',
  },
};

const InstitutionAggregateOnly = ({ what = 'student', school }) => {
  const c = COPY[what] ?? COPY.student;
  return (
    <section className="flex max-w-[720px] flex-col gap-[10px] rounded-[20px] border border-solid border-[#e6e6e6] bg-white p-[24px] font-sans">
      <h1 className="m-0 text-[23px] leading-[29px] font-semibold text-[#1c2a21]">{c.title}</h1>
      <p className="m-0 text-[15px] leading-[23px] text-[#595959]">
        {c.body.replace('{school}', school || 'Your institution')} The GTH team sets this; ask them
        if your institution should see students by name.
      </p>
      <p className="m-0 flex flex-wrap gap-x-[18px] gap-y-[6px] text-[14px]">
        <Link
          to={c.to}
          className="font-semibold text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          {c.cta}
        </Link>
        <Link
          to="/institution/settings/data"
          className="font-semibold text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          About student data
        </Link>
      </p>
    </section>
  );
};

export default InstitutionAggregateOnly;
