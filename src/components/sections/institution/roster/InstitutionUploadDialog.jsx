import { useCallback, useEffect, useRef, useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import InstitutionDialogShell from './InstitutionDialogShell.jsx';
import InstitutionUploadChecking from './InstitutionUploadChecking.jsx';
import InstitutionUploadErrors from './InstitutionUploadErrors.jsx';
import InstitutionUploadPick from './InstitutionUploadPick.jsx';
import InstitutionUploadReview from './InstitutionUploadReview.jsx';
import { FIX_LIMIT, checkCsv, parseCsv, sampleResult } from './csvImport.js';
import { rosterActions } from './rosterStore.js';

const log = debug('InstitutionUploadDialog');

/*
 * InstitutionUploadDialog — the CSV upload flow of the roster (Figma 11.2.2c pick, 11.2.2g checking, 11.2.2h review, 11.2.2d errors), one dialog whose body changes with the URL
 * (`?modal=upload` + `state=checking|review|errors`, written with replace so Back leaves the flow):
 *   pick      choose / drop a CSV and map its columns → "Check file"
 *   checking  progress with the four checks; "Run in background" closes the dialog (a status line says so), "Cancel upload" returns to the pick step
 *   review    ≤ 5 rows to fix: summary tiles + the table → "Add N students"          errors    more than 5 rows to fix: "Fix N rows first" → "Add N students" (skip the rest)
 * The check is the browser-side MOCK of csvImport.js; with no file chosen the sample file of the Figma frames is checked. Landing on state=checking|review|errors without a flow in
 * progress shows the frame as drawn (sample results).
 * Props: stage ('pick' | 'checking' | 'review' | 'errors'), onStage(stage), onClose, onAdded.
 */

const SAMPLE_DURATION = 2600;

const InstitutionUploadDialog = ({ stage, onStage, onClose }) => {
  const [file, setFile] = useState(null);
  const [headers, setHeaders] = useState([]);
  const [mapping, setMapping] = useState({});
  const [invite, setInvite] = useState(false);
  const [result, setResult] = useState(null);
  const [progress, setProgress] = useState(null); // null = static frame, 0..1 = a running job
  const jobRef = useRef(null);
  const running = progress !== null;

  const onFile = useCallback(async (f) => {
    setFile(f);
    try {
      const text = await f.text();
      setHeaders((parseCsv(text)[0] ?? []).map((h) => h.trim()).filter(Boolean));
    } catch (e) {
      log('read failed', e);
      setHeaders([]);
    }
  }, []);

  const finish = useCallback(
    (r) => {
      onStage(r.failing > FIX_LIMIT ? 'errors' : 'review');
    },
    [onStage]
  );

  // Runs the checking animation of a started job; at 100 % the dialog moves to review / errors.
  useEffect(() => {
    if (stage !== 'checking' || !running) return undefined;
    const job = jobRef.current;
    if (!job) return undefined;
    const t = window.setInterval(() => {
      const p = Math.min(1, (Date.now() - job.start) / job.duration);
      setProgress(p);
      if (p >= 1) {
        window.clearInterval(t);
        log('checked', job.result.fileName);
        finish(job.result);
      }
    }, 80);
    return () => window.clearInterval(t);
  }, [stage, running, finish]);

  const check = async () => {
    let r;
    if (file) {
      const text = await file.text();
      r = {
        ...checkCsv(text, mapping),
        fileName: file.name,
        size: `${Math.max(1, Math.round(file.size / 1024))} KB`,
      };
    } else {
      r = { ...sampleResult('review'), size: '41 KB' };
    }
    log('check', { rows: r.fileRows, ready: r.ready, failing: r.failing });
    setResult(r);
    jobRef.current = { start: Date.now(), duration: file ? 1800 : SAMPLE_DURATION, result: r };
    setProgress(0);
    onStage('checking');
  };

  const back = () => {
    jobRef.current = null;
    setProgress(null);
    onStage(null);
  };

  const add = () => {
    const r = result ?? sampleResult(stage === 'errors' ? 'errors' : 'review');
    rosterActions.importBatch({ count: r.ready, rows: r.rows });
    rosterActions.toast(`${r.ready} students were added to your roster.`);
    log('added (mock)', r.ready);
    onClose();
  };

  const shown = result ?? sampleResult(stage === 'errors' ? 'errors' : 'review');
  const label =
    stage === 'checking'
      ? `Checking ${shown.fileName}`
      : stage === 'review'
        ? `Ready to add ${shown.ready} students`
        : stage === 'errors'
          ? `Fix ${shown.failing} rows first`
          : 'Upload a class list';

  return (
    <InstitutionDialogShell label={label} onClose={onClose}>
      {stage === 'checking' ? (
        <InstitutionUploadChecking
          name={shown.fileName}
          rows={shown.fileRows}
          size={shown.size ?? '41 KB'}
          progress={progress ?? 184 / 312}
          result={{
            okCards: progress === null ? 184 : shown.ready + shown.duplicates,
            duplicates: shown.duplicates,
            elsewhere: shown.elsewhere,
          }}
          onCancel={back}
          onBackground={() => {
            log('background');
            rosterActions.toast(
              'Your upload is running in the background. We’ll tell you in the bell when it’s done.'
            );
            onClose();
          }}
        />
      ) : stage === 'review' ? (
        <InstitutionUploadReview result={shown} onBack={back} onAdd={add} onFix={back} />
      ) : stage === 'errors' ? (
        <InstitutionUploadErrors result={shown} onReupload={back} onCancel={onClose} onAdd={add} />
      ) : (
        <InstitutionUploadPick
          file={file}
          onFile={onFile}
          headers={headers}
          mapping={mapping}
          onMapping={setMapping}
          invite={invite}
          onInvite={setInvite}
          onCheck={check}
        />
      )}
    </InstitutionDialogShell>
  );
};

export default InstitutionUploadDialog;
