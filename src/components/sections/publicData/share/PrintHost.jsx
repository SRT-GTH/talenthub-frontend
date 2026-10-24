import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { debug } from '../../../../utils/debug.js';
import FitToWidth from './FitToWidth.jsx';
import PrintOutcomes from './PrintOutcomes.jsx';
import PrintOverview from './PrintOverview.jsx';
import ReportDocument from './report/ReportDocument.jsx';
import './publicPrint.css';

const log = debug('PrintHost');

/*
 * PrintHost — mounts a print layout on <body> (Theme 8). kind: 'overview' (Figma 8.2.1h, A4 portrait) · 'outcomes' (8.5.1e, A4 portrait)
 * · 'report' (the 8-page A4 landscape report kit).
 *   mode "screen" : the ?print=1 preview — a full-screen white sheet over the page (scrolls inside itself, scaled down on narrow screens)
 *   mode "print"  : rendered but hidden; once mounted it waits for fonts + images, calls window.print() and reports onDone() after the dialog
 *                   closes (afterprint). Rules live in publicPrint.css (@page A4, margin 0, everything else on <body> hidden while printing).
 * Props: kind, mode ('screen' | 'print'), onDone().
 */

const PORTRAIT = { width: 794, height: 1123 };

const waitForImages = () =>
  Promise.all(
    [...document.querySelectorAll('[data-print-host] img')].map((img) =>
      img.complete
        ? Promise.resolve()
        : new Promise((resolve) => img.addEventListener('load', resolve, { once: true }))
    )
  );

const PrintHost = ({ kind, mode, onDone }) => {
  // Screen preview: Esc leaves it (the ?print=1 key is removed by the owner of onDone).
  useEffect(() => {
    if (mode !== 'screen') return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') onDone?.();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [mode, onDone]);

  useEffect(() => {
    if (mode !== 'print') return undefined;
    let cancelled = false;
    const finish = () => {
      log('afterprint');
      onDone?.();
    };
    window.addEventListener('afterprint', finish, { once: true });
    Promise.all([document.fonts?.ready, waitForImages()]).then(() => {
      if (cancelled) return;
      log('window.print', kind);
      window.print();
    });
    return () => {
      cancelled = true;
      window.removeEventListener('afterprint', finish);
    };
  }, [kind, mode, onDone]);

  const layout =
    kind === 'report' ? (
      <ReportDocument />
    ) : (
      <FitToWidth {...PORTRAIT}>
        {kind === 'outcomes' ? <PrintOutcomes /> : <PrintOverview />}
      </FitToWidth>
    );

  return createPortal(
    <div
      data-print-host={mode}
      className={
        mode === 'screen' ? 'fixed inset-0 z-[80] overflow-auto bg-[#ecece7] font-sans' : undefined
      }
    >
      {layout}
    </div>,
    document.body
  );
};

export default PrintHost;
