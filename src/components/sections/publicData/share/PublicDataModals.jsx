import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import DigestDialog from './DigestDialog.jsx';
import DownloadDialog from './DownloadDialog.jsx';
import PrintHost from './PrintHost.jsx';
import ShareDialog from './ShareDialog.jsx';
import ShareToast from './ShareToast.jsx';

const log = debug('PublicDataModals');

/*
 * PublicDataModals — the ONE entry point of the share / download / digest package (Theme 8, Figma 8.1.2, 8.8.1, 8.8.2, 8.8.3, print layouts).
 * A page renders it once, next to its content:
 *
 *     const data = usePublicDataState();
 *     …
 *     <PublicDataModals data={data} scope={{ title: 'National snapshot', filtersLabel: undefined, reportKind: 'overview' }} />
 *
 * PROPS
 *   data   usePublicDataState() of the page (required): `modal`, `state`, `params`, `update` are read. The top bar / footer already set
 *          ?modal=share | download | digest; this component mounts the matching dialog and removes the keys again on close.
 *   scope  what the current page can share and download (optional, all keys optional):
 *            title        page name used in the share title, the phone sheet and "This view · <title> · 4 pages"   (default "National snapshot")
 *            filtersLabel overrides the "Volta · Technology · 18–24" label built from the five filter keys in the URL
 *            reportKind   'overview' | 'outcomes' — the A4 print layout of this page ("This view" download, "Print this page", ?print=1)
 *                         (default 'overview'; the other pages may pass 'overview' too until they have a layout of their own)
 *            sharePath    path of the shared link on the vanity host (default 'snapshot' → gh-talenthub.gov.gh/snapshot?…&src=share)
 *
 * URL KEYS (all documented in wiki/public-data.md when the lead wires them)
 *   modal=share|download|digest   which dialog is open
 *   state=fallback                Share: the manual-copy dialog (8.1.2c)          scope=filtered|view|national|region  Share: chosen option
 *   state=generating|failed       Download: "Building your PDF…" (8.8.1e) / failure (8.8.1f)          pdf=fail  make the mocked build fail
 *   state=success                 Digest: "Check your inbox" (8.8.3b)
 *   toast=copied                  the "Link copied" toast on the page (8.1.2b)       preview=1  link-unfurl specimen (8.8.2b)
 *   print=1                       the A4 print layout of scope.reportKind drawn full-screen over the page (8.2.1h / 8.5.1e); Esc leaves it
 *
 * BEHAVIOUR: focus trap, Esc, scrim click and scroll lock (useDialogBehaviour); focus returns to the element that opened the dialog;
 * phones (< 768px) get the drawn bottom sheets (Share / Download), and the Web Share API when the phone and the gesture allow it.
 */

const CLEARED_STATES = ['fallback', 'generating', 'failed', 'success'];

const PublicDataModals = ({ data, scope }) => {
  const { modal, state, params, update } = data;
  const openerRef = useRef(null);
  const [printKind, setPrintKind] = useState(null);

  const toastCopied = params.get('toast') === 'copied';
  const printScreen = params.get('print') === '1';
  const reportKind = scope?.reportKind ?? 'overview';

  // Remember the last focused element outside the dialogs: that is the opener to give focus back to.
  useEffect(() => {
    const onFocusIn = (event) => {
      if (!event.target.closest?.('[data-share-dialog]')) openerRef.current = event.target;
    };
    document.addEventListener('focusin', onFocusIn);
    return () => document.removeEventListener('focusin', onFocusIn);
  }, []);

  const restoreFocus = useCallback(() => {
    window.requestAnimationFrame(() => {
      const opener = openerRef.current;
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    });
  }, []);

  // The patch that removes every key the dialogs own (`state` only when it is one of theirs).
  const clearModalKeys = useMemo(
    () => ({
      modal: null,
      scope: null,
      preview: null,
      toast: null,
      pdf: null,
      ...(CLEARED_STATES.includes(state) ? { state: null } : {}),
    }),
    [state]
  );

  const close = useCallback(() => {
    log('close');
    update(clearModalKeys, { replace: true });
    restoreFocus();
  }, [update, clearModalKeys, restoreFocus]);

  const copied = useCallback(() => {
    log('copied → toast');
    update({ ...clearModalKeys, toast: 'copied' }, { replace: true });
  }, [update, clearModalKeys]);

  const dismissToast = useCallback(() => update({ toast: null }, { replace: true }), [update]);
  const undoToast = useCallback(() => update({ toast: null, modal: 'share' }), [update]);

  const startPrint = useCallback((kind) => {
    log('print', kind);
    setPrintKind(kind);
  }, []);
  const endPrint = useCallback(() => setPrintKind(null), []);
  const endPrintScreen = useCallback(() => update({ print: null }, { replace: true }), [update]);

  const shareFromDownload = useCallback(
    () => update({ modal: 'share', state: null, pdf: null }, { replace: true }),
    [update]
  );

  return (
    <>
      {modal === 'share' && !toastCopied ? (
        <ShareDialog data={data} scope={scope} onClose={close} onCopied={copied} />
      ) : null}
      {modal === 'download' ? (
        <DownloadDialog
          data={data}
          scope={scope}
          onClose={close}
          onPrint={startPrint}
          onShare={shareFromDownload}
        />
      ) : null}
      {modal === 'digest' ? <DigestDialog data={data} onClose={close} /> : null}
      {toastCopied ? <ShareToast onUndo={undoToast} onDismiss={dismissToast} /> : null}
      {printScreen ? <PrintHost kind={reportKind} mode="screen" onDone={endPrintScreen} /> : null}
      {printKind ? <PrintHost kind={printKind} mode="print" onDone={endPrint} /> : null}
    </>
  );
};

export default PublicDataModals;
