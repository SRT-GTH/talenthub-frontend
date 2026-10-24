import { useCallback, useEffect, useRef, useState } from 'react';
import { useMediaQuery } from '../../../../hooks/useMediaQuery.js';
import { debug } from '../../../../utils/debug.js';
import DownloadChooseDialog from './DownloadChooseDialog.jsx';
import DownloadFailedDialog from './DownloadFailedDialog.jsx';
import DownloadProgressDialog from './DownloadProgressDialog.jsx';
import {
  DOWNLOAD_DEFAULT_NOTE,
  DOWNLOAD_MOCK_DURATION_MS,
  DOWNLOAD_REGIONAL_MAX,
  DOWNLOAD_RESUME_PROGRESS,
  requestPdfExport,
} from './data/shareData.js';

const log = debug('DownloadDialog');

/*
 * DownloadDialog — controller of the Download PDF flow (Figma 8.8.1a / e / f, mobile sheet 8515:2461), mounted by PublicDataModals for
 * ?modal=download. URL keys: state=generating (resume the build at step 3 of 4, as drawn) · state=failed (the fallback dialog)
 * · pdf=fail (make the mocked build fail so the real flow reaches 8.8.1f).
 * Flow: choose what (this view · full snapshot · regional pack) → Download PDF → "Building your PDF…" (timer + progress, MOCK) →
 *       done: the A4 print layout is handed to the browser's print dialog ("Save as PDF")  /  failed: 8.8.1f with print, share, retry.
 * ⚠️ ASSUMPTION: a real PDF needs a backend (POST /api/public/pdf-exports). Until then the finished mock opens the browser print dialog on
 *   the A4 layout of what was chosen: This view → the page's own print layout (scope.reportKind: overview | outcomes);
 *   Full snapshot / Regional pack → the 8-page A4 landscape report. The cover note is kept in the request payload only.
 * Props: data (usePublicDataState()), scope ({ title, reportKind, pages }), onClose(), onPrint(kind), onShare().
 */

const viewKind = (scope) => scope?.reportKind ?? 'overview';

const DownloadDialog = ({ data, scope, onClose, onPrint, onShare }) => {
  const { params, state } = data;
  const isPhone = useMediaQuery('(max-width: 767px)');
  const [phase, setPhase] = useState(
    state === 'generating' ? 'generating' : state === 'failed' ? 'failed' : 'choose'
  );
  const [option, setOption] = useState('view');
  const [regions, setRegions] = useState([]);
  const [note, setNote] = useState(DOWNLOAD_DEFAULT_NOTE);
  const [progress, setProgress] = useState(state === 'generating' ? DOWNLOAD_RESUME_PROGRESS : 0);
  const runRef = useRef(0);

  const kind = option === 'view' ? viewKind(scope) : 'report';

  const finish = useCallback(() => {
    log('finished', { kind });
    onClose();
    onPrint(kind);
  }, [kind, onClose, onPrint]);

  // The mocked build: a timer drives the progress bar; the mock request decides success or failure.
  useEffect(() => {
    if (phase !== 'generating') return undefined;
    const run = ++runRef.current;
    const startFrom = progress;
    const started = performance.now();
    log('generating', { option, regions, startFrom });
    const tick = window.setInterval(() => {
      const next =
        startFrom + ((performance.now() - started) / DOWNLOAD_MOCK_DURATION_MS) * (1 - startFrom);
      setProgress(Math.min(0.99, next));
    }, 120);
    requestPdfExport({ shouldFail: params.get('pdf') === 'fail' })
      .then(() => {
        if (runRef.current === run) {
          setProgress(1);
          finish();
        }
      })
      .catch((error) => {
        log.error('export failed', error?.code);
        if (runRef.current === run) setPhase('failed');
      });
    return () => {
      window.clearInterval(tick);
      runRef.current += 1;
    };
    // The build restarts only when `phase` flips to generating (progress / finish are read once on entry).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const start = () => {
    setProgress(0);
    setPhase('generating');
  };

  const toggleRegion = (id) =>
    setRegions((prev) =>
      prev.includes(id)
        ? prev.filter((r) => r !== id)
        : prev.length >= DOWNLOAD_REGIONAL_MAX
          ? prev
          : [...prev, id]
    );

  if (phase === 'generating') {
    return <DownloadProgressDialog progress={progress} onCancel={onClose} />;
  }

  if (phase === 'failed') {
    return (
      <DownloadFailedDialog
        onPrint={() => {
          onClose();
          onPrint(viewKind(scope));
        }}
        onShare={onShare}
        onRetry={start}
        onClose={onClose}
      />
    );
  }

  return (
    <DownloadChooseDialog
      sheet={isPhone}
      viewDetail={`${scope?.title ?? 'National snapshot'} · 4 pages`}
      option={option}
      onOption={setOption}
      regions={regions}
      onToggleRegion={toggleRegion}
      note={note}
      onNote={setNote}
      onSubmit={start}
      onClose={onClose}
    />
  );
};

export default DownloadDialog;
