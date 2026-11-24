import { useCallback, useEffect, useRef, useState } from 'react';
import { institutionImportStatus } from '../../../../services/institutionPortal.api.js';
import { debug } from '../../../../utils/debug.js';
import InstitutionDialogShell from './InstitutionDialogShell.jsx';
import InstitutionUploadChecking from './InstitutionUploadChecking.jsx';
import InstitutionUploadDone from './InstitutionUploadDone.jsx';
import InstitutionUploadErrors from './InstitutionUploadErrors.jsx';
import InstitutionUploadPick from './InstitutionUploadPick.jsx';
import InstitutionUploadReview from './InstitutionUploadReview.jsx';
import { FIELDS, FIX_LIMIT, detectMapping, readTable, rowsFromTable } from './csvImport.js';
import { formatRosterCount } from './rosterFormat.js';
import { rosterActions } from './rosterStore.js';
import { loadUploadRules } from './rosterTemplate.js';

const log = debug('InstitutionUploadDialog');

/*
 * InstitutionUploadDialog — the class-list upload of the roster (Figma 11.2.2c pick, 11.2.2g checking, 11.2.2h review, 11.2.2d errors, plus the
 * processing summary), one dialog whose body changes with the URL (`?modal=upload` + `state=checking|review|errors`, written with replace so Back
 * leaves the flow). Works for every education level the platform config lists (ADR-11), email OR phone (ADR-12), opt-out for minors (ADR-13).
 *   pick      choose the level, download its template, drop a CSV / .xlsx, match the columns → "Check file"
 *   checking  POST /api/institution/students/import {commit: false}: every row checked on the server; the four check rows tick while it runs
 *   review    ≤ 5 rows to fix: tiles that add up to the file + every problem of each row → "Add N students"
 *   errors    more than 5 rows to fix: "Fix N rows first" → "Add N students" (skip the rest)
 *   summary   POST …/import {commit: true}: the server checks again, adds the ready rows and processes them (invites by email or SMS, link
 *             requests, parent opt-out notices); big files finish in the background (GET /institution/roster/imports/:id, polled).
 * A review / errors / checking URL without a checked file goes back to the pick step.
 * Props: stage ('pick' | 'checking' | 'review' | 'errors'), onStage(stage), onClose.
 */

const InstitutionUploadDialog = ({ stage, onStage, onClose }) => {
  const [rules, setRules] = useState(null);
  const [level, setLevel] = useState('');
  const [file, setFile] = useState(null);
  const [table, setTable] = useState([]);
  const [mapping, setMapping] = useState({});
  const [invite, setInvite] = useState(true);
  const [rows, setRows] = useState(null);
  const [result, setResult] = useState(null);
  const [progress, setProgress] = useState(null);
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState('');
  const [done, setDone] = useState(null);
  const job = useRef(0);

  useEffect(() => {
    let live = true;
    loadUploadRules().then((r) => {
      if (!live || !r) return;
      setRules(r);
      setLevel((l) => l || r.suggestedLevel || '');
    });
    return () => {
      live = false;
    };
  }, []);

  // a flow step opened without a checked file starts again at the pick step
  useEffect(() => {
    if (done) return;
    if (stage !== 'pick' && stage !== 'checking' && !result) onStage(null);
    if (stage === 'checking' && progress === null) onStage(null);
  }, [stage, result, progress, onStage, done]);

  // a big upload is processed in the background: ask for its summary every few seconds until it is done
  useEffect(() => {
    if (!done || done.status !== 'processing' || !done.id) return undefined;
    const t = window.setTimeout(async () => {
      try {
        setDone(await institutionImportStatus(done.id));
      } catch (err) {
        log('status failed', err?.response?.status);
        setDone((d) => ({ ...d }));
      }
    }, 3000);
    return () => window.clearTimeout(t);
  }, [done]);

  const headers = (table[0] ?? []).map((h) => String(h ?? '').trim()).filter(Boolean);
  const template = rules?.templates?.[level || 'default'] || rules?.templates?.default;
  const requiredKeys = [
    ...(mapping.name ? [] : ['firstName', 'lastName']),
    'dob',
    ...(level ? [] : ['level']),
    'grade',
    ...(mapping.email || mapping.phone ? [] : ['email', 'phone']),
  ];
  const missing = requiredKeys.filter((k) => !mapping[k]);

  const onFile = useCallback(
    async (f) => {
      setFile(f);
      setProblem('');
      try {
        const t = await readTable(f);
        setTable(t);
        const hs = (t[0] ?? []).map((h) => String(h ?? '').trim()).filter(Boolean);
        setMapping(detectMapping(hs, template?.columns ?? []));
      } catch (e) {
        log('read failed', e);
        setTable([]);
        setMapping({});
        setProblem(e?.message || 'We couldn’t read this file.');
      }
    },
    [template]
  );

  const check = async () => {
    if (!file) {
      setProblem('Choose a CSV or Excel file first.');
      return;
    }
    if (missing.length) {
      const names = missing
        .map((k) => FIELDS.find((f) => f.key === k)?.label || k)
        .join(', ')
        .replace('Email, Phone', 'Email or Phone');
      setProblem(
        `We couldn’t find these columns in your file: ${names}. Match them above, or start from the template.`
      );
      return;
    }
    const list = rowsFromTable(table, mapping);
    if (!list.length) {
      setProblem('This file has no student rows under its header.');
      return;
    }
    const max = rules?.maxRows ?? 10000;
    if (list.length > max) {
      setProblem(
        `This file has ${formatRosterCount(list.length)} rows. Upload at most ${formatRosterCount(max)} students per file.`
      );
      return;
    }
    const mine = ++job.current;
    setProblem('');
    setRows(list);
    setProgress(0.05);
    onStage('checking');
    const tick = window.setInterval(
      () => setProgress((p) => (p === null ? p : Math.min(0.9, p + 0.08))),
      200
    );
    const out = await rosterActions.importRows(list, false, invite, {
      defaultLevel: level || undefined,
      fileName: file.name,
    });
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
      skipped: out.result.skipped || [],
      warnings: out.result.warnings || [],
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
    const out = await rosterActions.importRows(rows, true, invite, {
      defaultLevel: level || undefined,
      fileName: file?.name,
    });
    setBusy(false);
    if (!out.ok) {
      setProblem(out.message);
      return;
    }
    const r = out.result;
    log('imported', r.imported, r.status);
    setDone(
      r.result || { id: r.importId, status: r.status, counts: { added: r.imported }, rows: [] }
    );
  };

  const finish = () => {
    const c = done?.counts || {};
    const n = (x) => formatRosterCount(x || 0);
    rosterActions.toast(
      `${n(c.added)} student${c.added === 1 ? ' was' : 's were'} added to your roster.${c.created ? ` ${n(c.created)} got an invite.` : ''}${c.requested ? ` ${n(c.requested)} already on GTH were asked to confirm your school.` : ''}${c.parentNoticesSent ? ` ${n(c.parentNoticesSent)} parents got the opt-out notice.` : ''}`
    );
    if (done?.status !== 'processing') rosterActions.load();
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
    skipped: [],
    warnings: [],
  };
  const label = done
    ? 'Upload summary'
    : stage === 'checking'
      ? `Checking ${shown.fileName}`
      : stage === 'review'
        ? `Ready to add ${shown.ready} students`
        : stage === 'errors'
          ? `Fix ${shown.failing} rows first`
          : 'Upload a class list';

  return (
    <InstitutionDialogShell label={label} onClose={done ? finish : onClose}>
      {done ? (
        <InstitutionUploadDone summary={done} onDone={finish} />
      ) : stage === 'checking' ? (
        <InstitutionUploadChecking
          name={shown.fileName}
          rows={rows?.length || 0}
          size={file ? `${Math.max(1, Math.round(file.size / 1024))} KB` : ''}
          progress={progress ?? 0}
          result={result || {}}
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
          rules={rules}
          level={level}
          onLevel={setLevel}
          file={file}
          onFile={onFile}
          headers={headers}
          mapping={mapping}
          onMapping={setMapping}
          required={requiredKeys}
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
