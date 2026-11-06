import { useNavigate } from 'react-router-dom';
import AdminPanel from '../admin/chrome/AdminPanel.jsx';
import { AdminA11yPanel, AdminLanguagePanel } from '../admin/chrome/AdminSmallPanels.jsx';
import { SUPPORT_EMAIL } from '../agency/dataRequests/data/dataRequestsData.js';
import { INSTITUTION_BASE } from './institutionNav.js';

/*
 * InstitutionTopPanels — what the institution top bar's Help, Language and Accessibility buttons open (?modal=help | language | a11y; the
 * profile menu opens the same three, so they work on phones too). They share the admin top-bar panel shell (phone: full-width sheet under
 * the 73px bar; desktop: a card under the 87px bar).
 *   Help           where things are in the portal (role-aware) + email GTH support
 *   Language       English (GH) in use; the other GTH languages are listed as coming
 *   Accessibility  text size, high contrast, reduce motion, underline links — saved on this device, the same preferences as the admin
 *                  back office (InstitutionFrame applies them; styles/adminA11y.css)
 * Props: modal, onClose, session (useInstitutionSession()).
 */

const TOP = 'lg:top-[88px]';

const ROW =
  'flex w-full flex-col gap-[2px] rounded-[10px] border-0 bg-transparent px-[12px] py-[10px] text-left font-sans hover:bg-[#f4f7f3] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#387440] cursor-pointer no-underline';

const HELP_LINKS = [
  [
    '/accreditation/status',
    'Accreditation',
    'Where your GES accreditation stands and what is next.',
  ],
  [
    '/settings/staff',
    'Staff and roles',
    'Who can add students, verify records and issue credentials.',
  ],
  ['/settings/audit-log', 'Audit log', 'Every change and download, with who did it.'],
  ['/settings/data', 'Data and retention', 'What GTH keeps about your students, and for how long.'],
  ['/public-page', 'Your public page', 'What students and recruiters see about your school.'],
];

const InstitutionHelpPanel = ({ onClose, session }) => {
  const navigate = useNavigate();
  const go = (to) => {
    onClose();
    navigate(`${INSTITUTION_BASE}${to}`);
  };
  return (
    <AdminPanel label="Help" title="Help and support" onClose={onClose} width={380} className={TOP}>
      <div className="flex flex-col gap-[10px] px-[18px] pt-[14px] text-[14px] leading-[20px]">
        <p className="m-0 text-[#595959]">
          Signed in as <strong className="text-[#1c2a21]">{session.admin.role || 'staff'}</strong>
          {session.institution.short ? ` at ${session.institution.short}` : ''}. What you can see
          and change depends on your role.
        </p>
      </div>
      <ul className="m-0 list-none p-[8px]">
        {HELP_LINKS.map(([to, title, sub]) => (
          <li key={to}>
            <button type="button" onClick={() => go(to)} className={ROW}>
              <span className="text-[14px] font-semibold text-[#1c2a21]">{title}</span>
              <span className="text-[13px] text-[#595959]">{sub}</span>
            </button>
          </li>
        ))}
        <li>
          <a href={`mailto:${SUPPORT_EMAIL}`} className={ROW}>
            <span className="text-[14px] font-semibold text-[#1c2a21]">Email GTH support</span>
            <span className="text-[13px] text-[#595959]">{SUPPORT_EMAIL}</span>
          </a>
        </li>
      </ul>
      <p className="m-0 px-[20px] pb-[14px] text-[12.5px] text-[#595959]">
        Press <kbd className="font-sans font-semibold text-[#1c2a21]">Esc</kbd> to close any panel
        or dialog.
      </p>
    </AdminPanel>
  );
};

const InstitutionTopPanels = ({ modal, onClose, session }) => {
  if (modal === 'help') return <InstitutionHelpPanel onClose={onClose} session={session} />;
  if (modal === 'language')
    return (
      <AdminLanguagePanel
        onClose={onClose}
        className={TOP}
        note="The institution portal is in English. Students can already preview these languages in the app."
      />
    );
  if (modal === 'a11y') return <AdminA11yPanel onClose={onClose} className={TOP} />;
  return null;
};

export default InstitutionTopPanels;
