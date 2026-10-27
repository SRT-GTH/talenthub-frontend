import { useCallback, useEffect, useRef, useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import InstitutionDialogShell from './InstitutionDialogShell.jsx';
import InstitutionUploadChecking from './InstitutionUploadChecking.jsx';
import InstitutionUploadErrors from './InstitutionUploadErrors.jsx';
import InstitutionUploadPick from './InstitutionUploadPick.jsx';
import InstitutionUploadReview from './InstitutionUploadReview.jsx';
import { FIX_LIMIT, parseCsv, rowsFromCsv } from './csvImport.js';
import { rosterActions } from './rosterStore.js';

const log = debug('InstitutionUploadDialog');

/*
 * InstitutionUploadDialog — the CSV upload flow of the roster (Figma 11.2.2c pick, 11.2.2g checking, 11.2.2h review, 11.2.2d errors), one dialog whose body changes with the URL
 * (`?modal=upload` + `state=checking|review|errors`, written with replace so Back leaves the flow):
 *   pick      choose / drop a CSV and map its columns → "Check file"
 *   checking  the file is sent to POST /api/institution/students/import {commit: false}; the four check rows tick while it runs
 *   review    ≤ 5 rows to fix: summary tiles + the table → "Add N students"          errors    more than 5 rows to fix: "Fix N rows first" → "Add N students" (skip the rest)
 *   add       POST …/import {commit: true}: the server checks again and adds only the good rows (each gets an invite or, with a GTH account, a link request)
 * A review / errors / checking URL without a checked file goes back to the pick step.
 * Props: stage ('pick' | 'checking' | 'review' | 'errors'), onStage(stage), onClose.
 */

const InstitutionUploadDialog = ({ stage, onStage, onClose }) => {
  const [file, setFile] = useState(null);
  const [headers, setHeaders] = useState([]);
  const [mapping, setMapping] = useState({});
  const [invite, setInvite] = useState(true);
  const [rows, setRows] = useState(null);
  const [result, setResult] = useState(null);
  const [progress, setProgress] = useState(null);
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState('');
  const job = useRef(0);

  // a flow step opened without a checked file starts again at the pick step
  useEffect(() => {
    if (stage !== 'pick' && stage !== 'checking' && !result) onStage(null);
    if (stage === 'checking' && progress === null) onStage(null);
  }, [stage, result, progress, onStage]);

  const onFile = useCallback(async (f) => {
    setFile(f);
    setProblem('');
    try {
      const text = await f.text();
      setHeaders((parseCsv(text)[0] ?? []).map((h) => h.trim()).filter(Boolean));
    } catch (e) {
      log('read failed', e);
      setHeaders([]);
    }
  }, []);

  const check = async () => {
    if (!file) {
      setProblem('Choose a CSV file first.');
      return;
    }
    const list = rowsFromCsv(await file.text(), mapping);
    if (!list.length) {
      setProblem('This file has no student rows under its header.');
      return;
    }
    const mine = ++job.current;
    setRows(list);
    setProgress(0.05);
    onStage('checking');
    const tick = window.setInterval(
      () => setProgress((p) => (p === null ? p : Math.min(0.9, p + 0.08))),
      200
    );
    const out = await rosterActions.importRows(list, false);
    window.clearInterval(tick);
    if (mine !== job.current) return;
    if (!out.ok) {
      setProgress(null);
      setProblem(out.message);
      onStage(null);
      return;
    }
    const r = {
      ...out.result,
      fileName: file.name,
      size: `${Math.max(1, Math.round(file.size / 1024))} KB`,
      fileRows: out.result.rows,
      fixes: (out.result.fixes || []).map((f) => ({ ...f, action: 'Fix in file' })),
    };
    log('checked', { rows: r.fileRows, ready: r.ready, failing: r.failing });
    setResult(r);
    setProgress(1);
    window.setTimeout(() => onStage(r.failing > FIX_LIMIT ? 'errors' : 'review'), 400);
  };

  const back = () => {
    job.current += 1;
    setProgress(null);
    setResult(null);
    onStage(null);
  };

  const add = async () => {
    if (!rows || busy) return;
    setBusy(true);
    const out = await rosterActions.importRows(rows, true, invite);
    setBusy(false);
    if (!out.ok) {
      setProblem(out.message);
      return;
    }
    const r = out.result;
    log('imported', r.imported);
    rosterActions.toast(
      `${r.imported} student${r.imported === 1 ? ' was' : 's were'} added to your roster.${r.invited ? ` ${r.invited} got an email invite.` : ''}${r.requested ? ` ${r.requested} already on GTH were asked to confirm your school.` : ''}`
    );
    onClose();
  };

  const shown = result || {
    fileName: file?.name || '',
    fileRows: rows?.length || 0,
    ready: 0,
    duplicates: 0,
    elsewhere: 0,
    failing: 0,
    fixes: [],
  };
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
          rows={rows?.length || 0}
          size={file ? `${Math.max(1, Math.round(file.size / 1024))} KB` : ''}
          progress={progress ?? 0}
          result={{
            okCards: result ? result.ready + result.duplicates : 0,
            duplicates: result ? result.duplicates : 0,
            elsewhere: result ? result.elsewhere : 0,
          }}
          onCancel={back}
          onBackground={back}
        />
      ) : stage === 'review' && result ? (
        <InstitutionUploadReview
          result={shown}
          onBack={back}
          onAdd={add}
          onFix={back}
          busy={busy}
          error={problem}
        />
      ) : stage === 'errors' && result ? (
        <InstitutionUploadErrors
          result={shown}
          onReupload={back}
          onCancel={onClose}
          onAdd={add}
          busy={busy}
          error={problem}
        />
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
          error={problem}
        />
      )}
    </InstitutionDialogShell>
  );
};

export default InstitutionUploadDialog;
