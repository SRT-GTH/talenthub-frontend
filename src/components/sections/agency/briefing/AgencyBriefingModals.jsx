import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import BriefingDigestDialog from './BriefingDigestDialog.jsx';
import BriefingDownloadFlow from './BriefingDownloadFlow.jsx';
import BriefingShareDialog from './BriefingShareDialog.jsx';
import BriefingToast from './BriefingToast.jsx';
import { BRIEFING_SHARE } from './data/briefingData.js';

const log = debug('AgencyBriefingModals');

/*
 * AgencyBriefingModals — the ONE entry point of the briefing-pack dialogs (Figma 11.4.4a–e, h). Render it once, next to a page's content:
 *
 *     const data = useAgencyState();
 *     <AgencyBriefingModals data={data} />
 *
 * Any page can OPEN a dialog by setting the URL, e.g. <AgencyButton to="/agency/briefing?modal=download"> or data.update({ modal: 'share' })
 * when this component is mounted on the same page. /agency/briefing mounts it over the National data view (AgencyBriefingPage).
 *
 * URL KEYS (documented in wiki/agency.md by the lead)
 *   modal=download                 choose → build (MOCK) → report opens in a new tab with the print dialog
 *     state=building               resume the build at step 3 (11.4.4b)       state=failed  the failure dialog (11.4.4h)      pdf=fail  make the MOCK build fail
 *   modal=share                    share with a colleague (11.4.4c)           state=copied  no dialog, the "Link copied" toast (11.4.4d)
 *   modal=digest                   monthly digest (11.4.4e)
 * BEHAVIOUR: focus trap, Esc, scrim click and scroll lock (Theme 8 useDialogBehaviour through ShareDialogShell); focus returns to the element that
 * opened the dialog; the toast is role="status".
 */

const CLEARED_STATES = ['building', 'failed', 'copied'];

const AgencyBriefingModals = ({ data }) => {
  const { modal, state, update } = data;
  const openerRef = useRef(null);
  const [announce, setAnnounce] = useState('');
  const open = modal === 'download' || modal === 'share' || modal === 'digest';
  const toast = modal === 'share' && state === 'copied';

  useEffect(() => {
    const onFocusIn = (event) => {
      if (!event.target.closest?.('[data-share-dialog]')) openerRef.current = event.target;
    };
    document.addEventListener('focusin', onFocusIn);
    return () => document.removeEventListener('focusin', onFocusIn);
  }, []);

  useEffect(() => {
    if (open) log('open', { modal, state });
  }, [open, modal, state]);

  const restoreFocus = useCallback(() => {
    window.requestAnimationFrame(() => {
      const opener = openerRef.current;
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    });
  }, []);

  const clear = useMemo(
    () =>
      CLEARED_STATES.includes(state)
        ? { modal: null, state: null, pdf: null }
        : { modal: null, pdf: null },
    [state]
  );
  const close = useCallback(() => {
    log('close');
    update(clear, { replace: true });
    restoreFocus();
  }, [update, clear, restoreFocus]);

  const copied = useCallback(() => {
    log('copied → toast');
    update({ modal: 'share', state: 'copied' }, { replace: true });
  }, [update]);
  const undo = useCallback(
    () => update({ modal: 'share', state: null }, { replace: true }),
    [update]
  );
  const dismiss = useCallback(
    () => update({ modal: null, state: null }, { replace: true }),
    [update]
  );
  const toShare = useCallback(
    () => update({ modal: 'share', state: null }, { replace: true }),
    [update]
  );
  const subscribed = useCallback(() => {
    log('digest subscribed');
    setAnnounce('Subscribed to the monthly digest.');
    update(clear, { replace: true });
    restoreFocus();
  }, [update, clear, restoreFocus]);

  return (
    <>
      {modal === 'download' ? (
        <BriefingDownloadFlow data={data} onClose={close} onShare={toShare} />
      ) : null}
      {modal === 'share' && !toast ? <BriefingShareDialog onCopy={copied} onClose={close} /> : null}
      {modal === 'digest' ? (
        <BriefingDigestDialog onClose={close} onSubscribed={subscribed} />
      ) : null}
      {toast ? (
        <BriefingToast text={BRIEFING_SHARE.toast} onUndo={undo} onDismiss={dismiss} />
      ) : null}
      <p role="status" aria-live="polite" className="sr-only">
        {announce}
      </p>
    </>
  );
};

export default AgencyBriefingModals;
