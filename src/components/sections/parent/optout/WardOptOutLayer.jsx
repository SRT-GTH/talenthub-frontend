import { useLayoutEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import ParentToast from '../wards/dialogs/ParentToast.jsx';
import { focusAfterRender } from '../focusAfterRender.js';
import OptOutDialog from './OptOutDialog.jsx';
import RestoreDialog from './RestoreDialog.jsx';
import ReportConcernLayer from './ReportConcernLayer.jsx';
import { isOptedOut, useWardAccess, wardAccessActions } from './wardAccessStore.js';
import { OPT_OUT_COPY, OPT_OUT_REASONS, SEED_TIME } from './data/optOutData.js';

const log = debug('WardOptOutLayer');

/*
 * WardOptOutLayer — the dialogs, toast and frame-URL seeds of the Opt out and restore flow on the ward page (Figma file SCXc457vwiq6o7d9g4jVbh, canvas "Parent · 05 Opt out and restore" 10057:1302). Mounted by
 * ParentWardPage next to the ward view; the page itself swaps to <WardOptedOut> while the store says the ward is opted out. URLs (all on /parent/wards/:wardId):
 *   ?modal=opt-out[&reason=safety&note=…&ack=1]        PO-01  10033:5762  "Opt Abena out of GTH?" (reason / note / ack seed the form)
 *   ?state=opted-out                                   PO-02  10034:143423 the paused page (the store is seeded to opted out, reason "Safety concerns", 15:20)
 *   ?state=opted-out&modal=restore                     PO-03  10034:144044 "Restore Abena’s access?"
 *   ?toast=access-restored                             PO-04  10052:3799  "Abena’s access is back" toast over the normal page (the store is seeded to restored)
 *   ?modal=report / ?modal=report-sent                 PH-03 / PH-03b: handled by the shared <ReportConcernLayer> (also used by the Help page)
 * Real flow: Opt out -> PO-01 -> "Opt out Abena" -> paused page (URL gets ?state=opted-out, so a reload keeps it) -> Restore access -> PO-03 -> Restore -> normal page + PO-04 toast (state removed from the URL).
 * Props: ward (wardsData entry), linkedWards ([{ id, firstName, … }] for the report's "Who is it about?").
 * On this page "Opt <ward> out" on PH-03b only shows when the report is about the ward of this page (ReportConcernLayer optOutIds).
 */
const DIALOG_KEYS = ['modal', 'reason', 'note', 'ack', 'who', 'worry', 'about'];

const nowLabel = () => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

const WardOptOutLayer = ({ ward, linkedWards }) => {
  const [params, setParams] = useSearchParams();
  const [toast, setToast] = useState(null);
  const seeded = useRef(false);
  const access = useWardAccess();
  const optedOut = isOptedOut(access, ward.id);
  const modal = params.get('modal');
  const seedState = params.get('state');
  const seedToast = params.get('toast');

  // Frame URLs PO-02 / PO-03 / PH-03 (?state=opted-out) and PO-04 (?toast=access-restored): apply the drawn state before the first paint.
  useLayoutEffect(() => {
    if (seeded.current) return;
    seeded.current = true;
    if (seedState === 'opted-out') {
      const safety = OPT_OUT_REASONS.find((r) => r.id === 'safety');
      wardAccessActions.ensureOptedOut(ward.id, {
        reasonId: safety.id,
        reasonLabel: safety.label,
        at: SEED_TIME,
      });
    }
    if (seedToast === 'access-restored') {
      wardAccessActions.ensureRestored(ward.id);
      setToast(OPT_OUT_COPY.toast.restored(ward));
    }
    log('seeds', { seedState, seedToast, modal });
  }, [seedState, seedToast, modal, ward]);

  // Replace the dialog params (and optionally set / clear `state`) in one URL update.
  const update = ({ next, state }) => {
    const p = new URLSearchParams(params);
    DIALOG_KEYS.forEach((k) => p.delete(k));
    if (next) Object.entries(next).forEach(([k, v]) => p.set(k, v));
    if (state === null) p.delete('state');
    else if (state) p.set('state', state);
    p.delete('toast');
    setParams(p, { replace: true });
  };
  const close = () => update({});

  const seed = {
    reason: params.get('reason') ?? undefined,
    note: params.get('note') ?? '',
    ack: params.get('ack') === '1',
  };

  return (
    <>
      {modal === 'opt-out' ? (
        <OptOutDialog
          ward={ward}
          initial={seed}
          onClose={close}
          onConfirm={(values) => {
            wardAccessActions.optOut(ward.id, { ...values, at: nowLabel() });
            update({ state: 'opted-out' });
            // the opened-from button is gone with the ward view: land on the paused banner (a status, so it is read out)
            focusAfterRender('#access-banner');
          }}
        />
      ) : null}

      {modal === 'restore' && optedOut ? (
        <RestoreDialog
          ward={ward}
          onClose={close}
          onConfirm={() => {
            wardAccessActions.restore(ward.id);
            update({ state: null });
            focusAfterRender('main h1');
            setToast(OPT_OUT_COPY.toast.restored(ward));
          }}
        />
      ) : null}

      <ReportConcernLayer
        defaultWho={ward.id}
        linkedWards={linkedWards}
        optOutIds={[ward.id]}
        onOptOut={() => update({ next: { modal: 'opt-out' } })}
      />

      {toast ? <ParentToast {...toast} onClose={() => setToast(null)} /> : null}
    </>
  );
};

export default WardOptOutLayer;
