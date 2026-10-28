import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import ParentToast from '../wards/dialogs/ParentToast.jsx';
import { focusAfterRender } from '../focusAfterRender.js';
import WardProfileTab from './WardProfileTab.jsx';
import WardFlagsTab from './WardFlagsTab.jsx';
import FlagFieldDialog from './FlagFieldDialog.jsx';
import RecheckDialog from './RecheckDialog.jsx';
import { flagsActions, useWardFlags } from './flagsStore.js';
import { FLAGS_COPY, PROFILE_GROUPS } from './data/flagsData.js';

const log = debug('WardFlagsSection');

/*
 * WardFlagsSection — the Profile and Flags tabs of a ward with their dialogs and toasts (Figma file SCXc457vwiq6o7d9g4jVbh, canvas "Parent · 03 Flags and corrections" 10057:604), rendered by ParentWardPage
 * under <WardShell> when `?tab=profile` or `?tab=flags` (Abena only: the mock holds her flags). State lives in the URL:
 *   /parent/wards/abena?tab=profile                                       PW-03   10034:4197  Review profile (flag a field)
 *     &modal=flag&field=volunteering[&note=…][&check=1]                   PW-04   10034:5128 / PW-04c 10077:18202 (note too short)
 *     &toast=flag-sent                                                    PW-04b  10051:22618 "Flag sent to Abena" toast (Flags chip 3)
 *   /parent/wards/abena?tab=flags                                         PW-05   10034:140037 Flags tracker
 *     &modal=recheck&flag=dob                                             PW-06   10034:140801 Abena fixed “Date of birth”
 *     &modal=flag-again&flag=dob[&note=…]                                 PW-06c  10056:923   Flag “Date of birth” again
 *     &toast=fix-approved                                                 PW-06b  10051:23020 "Fix approved" toast (Date of birth approved, Flags chip 1)
 * `sev` (know | correcting | critical) and `note` seed the dialog form; `check=1` shows the error at once. The two toast URLs apply their drawn state on load (flagsStore ensureSent / ensureApproved) so a frame
 * reproduces from a fresh load. Real flow: Flag button -> PW-04 -> Send -> toast (Undo reverts) · Review fix -> PW-06 -> Approve fix -> toast, or Flag again -> PW-06c -> Send flag again.
 * Props: ward (wardsData entry), tab ('profile' | 'flags').
 * ⚠️ ASSUMPTION: the toasts reuse ParentToast (4 s); a flag-again send shows the same "Flag sent to Abena" toast (no frame).
 */
const WardFlagsSection = ({ ward, tab }) => {
  const [params, setParams] = useSearchParams();
  const [toast, setToast] = useState(null);
  const { flags } = useWardFlags();
  const seeded = useRef(false);
  const modal = params.get('modal');
  const seedToast = params.get('toast');
  const field = PROFILE_GROUPS.flatMap((g) => g.fields).find((f) => f.id === params.get('field'));
  const flag = flags.find((f) => f.id === params.get('flag'));

  useEffect(() => {
    log('mount', { ward: ward.id, tab, modal, seedToast });
  }, [ward.id, tab, modal, seedToast]);

  // Frame URLs PW-04b / PW-06b: apply the drawn state once on load, then show the toast.
  useEffect(() => {
    if (seeded.current) return;
    seeded.current = true;
    if (seedToast === 'flag-sent') {
      flagsActions.ensureSent();
      log('seed flag-sent');
      setToast(FLAGS_COPY.toast.sent({ label: 'Volunteering' }, ward));
    }
    if (seedToast === 'fix-approved') {
      flagsActions.ensureApproved('dob');
      setToast(FLAGS_COPY.toast.approved({ label: 'Date of birth' }, ward));
    }
  }, [seedToast, ward]);

  // Opens a dialog (next = { modal, … }) or closes it (null) while keeping the tab.
  const setModal = (next) => {
    const p = new URLSearchParams({ tab });
    if (next) Object.entries(next).forEach(([k, v]) => p.set(k, v));
    setParams(p, { replace: true });
  };
  const close = () => setModal(null);
  const seed = {
    severity: params.get('sev') ?? undefined,
    note: params.get('note') ?? '',
    check: params.get('check') === '1',
  };

  return (
    <>
      {tab === 'profile' ? (
        <WardProfileTab flags={flags} onFlag={(f) => setModal({ modal: 'flag', field: f.id })} />
      ) : (
        <WardFlagsTab
          ward={ward}
          flags={flags}
          onReview={(f) => setModal({ modal: 'recheck', flag: f.id })}
        />
      )}

      {modal === 'flag' && field ? (
        <FlagFieldDialog
          ward={ward}
          mode="field"
          label={field.label}
          current={field.value}
          initial={seed}
          onClose={close}
          onSend={(values) => {
            const token = flagsActions.sendFlag(field.id, values);
            log('sent', { field: field.id });
            close();
            setToast({
              ...FLAGS_COPY.toast.sent({ label: field.label }, ward),
              onAction: () => flagsActions.undoSend(token),
            });
          }}
        />
      ) : null}

      {modal === 'flag-again' && flag ? (
        <FlagFieldDialog
          ward={ward}
          mode="again"
          label={flag.label}
          initial={seed}
          onClose={close}
          onSend={(values) => {
            flagsActions.flagAgain(flag.id, values);
            close();
            // "Review fix" is gone from the row: keep focus in the list
            focusAfterRender('#flags-list');
            setToast(FLAGS_COPY.toast.sent({ label: flag.label }, ward));
          }}
        />
      ) : null}

      {modal === 'recheck' && flag ? (
        <RecheckDialog
          ward={ward}
          flag={flag}
          onClose={close}
          onApprove={() => {
            flagsActions.approveFix(flag.id);
            close();
            focusAfterRender('#flags-list');
            setToast(FLAGS_COPY.toast.approved(flag, ward));
          }}
          onFlagAgain={() => setModal({ modal: 'flag-again', flag: flag.id })}
        />
      ) : null}

      {toast ? <ParentToast {...toast} onClose={() => setToast(null)} /> : null}
    </>
  );
};

export default WardFlagsSection;
