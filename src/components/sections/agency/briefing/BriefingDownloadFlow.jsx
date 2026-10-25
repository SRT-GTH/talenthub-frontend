import { useCallback, useEffect, useRef, useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import BriefingBuildingDialog from './BriefingBuildingDialog.jsx';
import BriefingDownloadDialog from './BriefingDownloadDialog.jsx';
import BriefingFailedDialog from './BriefingFailedDialog.jsx';
import {
  BRIEFING_BUILD_MS,
  BRIEFING_DEFAULT_NOTE,
  BRIEFING_REGIONAL_MAX,
  BRIEFING_RESUME_PROGRESS,
  requestBriefingBuild,
} from './data/briefingData.js';

const log = debug('BriefingDownloadFlow');

/*
 * BriefingDownloadFlow — controller of the briefing-pack download (Figma 11.4.4a → b → h), mounted by AgencyBriefingModals for ?modal=download.
 * URL: state=building (resume at step 3, as drawn) · state=failed (the failure dialog) · pdf=fail (make the MOCK build fail so a real run reaches it).
 * Flow: choose → "Download briefing pack" → building (timer + progress, MOCK job) → done: the dialog closes and the A4 agency report opens in a new
 * tab with the browser print dialog ("Save as PDF"); failed: print / share / retry.
 * ⚠️ ASSUMPTION: a real PDF needs the backend (POST /agency/briefing-packs); until then "done" opens /agency/report?print=1 (the 8-page A4 report).
 * Props: data (useAgencyState()), onClose(), onShare().
 */

const REPORT_URL = '/agency/report?page=1&print=1';

const BriefingDownloadFlow = ({ data, onClose, onShare }) => {
  const { state, params } = data;
  const [phase, setPhase] = useState(
    state === 'building' ? 'building' : state === 'failed' ? 'failed' : 'choose'
  );
  const [option, setOption] = useState('view');
  const [regions, setRegions] = useState([]);
  const [note, setNote] = useState(BRIEFING_DEFAULT_NOTE);
  const [progress, setProgress] = useState(state === 'building' ? BRIEFING_RESUME_PROGRESS : 0);
  const runRef = useRef(0);

  const toggleRegion = useCallback((id) => {
    setRegions((prev) => {
      if (prev.includes(id)) return prev.filter((r) => r !== id);
      return prev.length >= BRIEFING_REGIONAL_MAX ? prev : [...prev, id];
    });
  }, []);

  useEffect(() => {
    if (phase !== 'building') return undefined;
    const run = ++runRef.current;
    const startFrom = progress;
    const started = performance.now();
    log('building', { option, regions, startFrom });
    const tick = window.setInterval(() => {
      const next =
        startFrom + ((performance.now() - started) / BRIEFING_BUILD_MS) * (1 - startFrom);
      setProgress(Math.min(0.99, next));
    }, 120);
    requestBriefingBuild({ shouldFail: params.get('pdf') === 'fail', option, regions, note })
      .then(() => {
        if (runRef.current !== run) return;
        log('built');
        setProgress(1);
        onClose();
        window.open(REPORT_URL, '_blank', 'noopener');
      })
      .catch((error) => {
        if (runRef.current !== run) return;
        log('failed', error.message);
        setPhase('failed');
      });
    return () => {
      window.clearInterval(tick);
      runRef.current += 1;
    };
    // The build restarts only when the phase changes; progress / inputs are read from the render that started it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const start = () => {
    setProgress(0);
    setPhase('building');
  };
  const printPage = () => {
    log('print this page');
    onClose();
    window.setTimeout(() => window.print(), 50);
  };

  if (phase === 'building') {
    return <BriefingBuildingDialog progress={progress} onCancel={onClose} />;
  }
  if (phase === 'failed') {
    return (
      <BriefingFailedDialog
        onPrint={printPage}
        onShare={onShare}
        onRetry={start}
        onClose={onClose}
      />
    );
  }
  return (
    <BriefingDownloadDialog
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

export default BriefingDownloadFlow;
