import { useSearchParams } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import ReportConcernDialog from './ReportConcernDialog.jsx';
import ReportSentDialog from './ReportSentDialog.jsx';

const log = debug('ReportConcernLayer');

/*
 * ReportConcernLayer — the "Report a safety concern" dialogs of the Opt out and restore canvas (Figma PH-03 10057:1591 and PH-03b 10057:1806), driven by the URL so any page can host them:
 *   ?modal=report[&who=abena&worry=contacted&note=…]      PH-03   the form (Send report stays disabled until the note has text)
 *   ?modal=report-sent&about=abena                        PH-03b  "Thank you, Emma. We’re on it." with the report number
 * Hosts: /parent/help (Figma draws both over the Help and guides page) and /parent/wards/:id (WardOptOutLayer, the ward page's "Report a concern").
 * Props: defaultWho (the ward id the "Who is it about?" chips start on), linkedWards ([{ id, firstName, … }]), optOutIds (ward ids the host can opt out: the "While you wait" card and "Opt <ward> out" only
 * show for a report about one of them), onOptOut(ward) (what "Opt <ward> out" does: the ward page opens its own dialog, the Help page goes to the ward page's).
 */
const KEYS = ['modal', 'who', 'worry', 'note', 'about'];

const ReportConcernLayer = ({ defaultWho, linkedWards, optOutIds, onOptOut }) => {
  const [params, setParams] = useSearchParams();
  const modal = params.get('modal');

  const set = (next) => {
    const p = new URLSearchParams(params);
    KEYS.forEach((k) => p.delete(k));
    if (next) Object.entries(next).forEach(([k, v]) => p.set(k, v));
    setParams(p, { replace: true });
  };

  const about = linkedWards.find((w) => w.id === params.get('about'));
  const reportedWard = about && optOutIds.includes(about.id) ? about : undefined;

  return (
    <>
      {modal === 'report' ? (
        <ReportConcernDialog
          wards={linkedWards}
          initial={{
            who: params.get('who') ?? defaultWho,
            worry: params.get('worry') ?? undefined,
            note: params.get('note') ?? '',
          }}
          onClose={() => set(null)}
          onSend={({ who }) => {
            log('report sent', { who });
            set({ modal: 'report-sent', about: who });
          }}
        />
      ) : null}

      {modal === 'report-sent' ? (
        <ReportSentDialog
          ward={reportedWard}
          onClose={() => set(null)}
          onOptOut={() => onOptOut(reportedWard)}
        />
      ) : null}
    </>
  );
};

export default ReportConcernLayer;
