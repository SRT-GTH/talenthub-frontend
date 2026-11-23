import { debug } from '../../../utils/debug.js';
import { PersonaCard } from '../agency/AgencyPersonaCard.jsx';
import { INSTITUTION_BASE } from './institutionNav.js';

const log = debug('InstitutionPersonaCard');

/*
 * InstitutionPersonaCard — "Persona card" of the institution rail (Figma 8602:399301, 279 x 327, r16, border #e1eae2): the same card as the
 * agency rail (the shared PersonaCard in ../agency/AgencyPersonaCard.jsx) with institution content: "Registrar · Savannah Hills SHS",
 * verification status line, "Students on GTH" readiness bar, "View institution profile →", stats strip (Students · Pending · Credentials).
 * Props: session (useInstitutionSession()). The status line, readiness % and stats follow the accreditation gate (?verify=, ?state=new).
 */

const InstitutionPersonaCard = ({ session, onNavigate, className }) => {
  const { admin, institution, verify, readiness, stats } = session;
  log('render', { status: verify.status, pct: readiness.pct });
  return (
    <PersonaCard
      monogram={admin.monogram}
      name={admin.name}
      role={admin.role}
      subtitle={`${admin.title} · ${institution.short}`}
      status={verify.label}
      meter={{ label: 'Students on GTH', pct: readiness.pct }}
      link={{ to: `${INSTITUTION_BASE}/settings`, label: 'View institution profile →' }}
      stats={[
        { value: stats.students, label: 'Students' },
        { value: stats.pending, label: 'Pending' },
        { value: stats.credentials, label: 'Credentials' },
      ]}
      statsLabel="Your institution in numbers"
      onNavigate={onNavigate}
      className={className}
    />
  );
};

export default InstitutionPersonaCard;
