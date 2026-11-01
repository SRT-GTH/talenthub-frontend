import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CvChooseDialog,
  CvDoneDialog,
  CvFailedDialog,
  CvLiveDoneDialog,
  CvLiveReadingDialog,
  CvReadingDialog,
  CvUploadingDialog,
} from '../../components/sections/engagementV2/cv/CvSteps.jsx';
import {
  CvEditItemDialog,
  CvFixRoleDialog,
  CvReviewDialog,
  CvToast,
} from '../../components/sections/engagementV2/cv/CvReview.jsx';
import {
  FIX_DEEPLINK_END,
  FRAME_READ_PERCENT,
  FRAME_UPLOAD_PERCENT,
  MOCK_FILE,
  MOCK_UNSUPPORTED_NAME,
  certRow,
  countChecked,
  createMockParseResult,
  describeFile,
  educationRow,
  isEmptyResult,
  mergeCvIntoProfile,
  parseMonth,
  resultFromExtraction,
  roleRow,
  validateFiles,
} from '../../components/sections/engagementV2/cv/cvData.js';
import { useCvState } from '../../components/sections/engagementV2/cv/cvState.js';
import JourneyHub from '../../components/sections/engagementV2/journey/JourneyHub.jsx';
import { CV_ERROR, checkCvFile, cvFileType, extractCv } from '../../services/cv.api.js';
import { peekHandedOffCv, takeHandedOffCv } from '../../services/cvHandoff.js';
import {
  fetchMyProfile,
  isLiveProfile,
  saveProfileFields,
} from '../../services/profileStages.api.js';
import { debug } from '../../utils/debug.js';

const log = debug('UploadCvPage');

/*
 * UploadCvPage (Figma "Upload my CV (new)", CV-01 ... CV-05): the dialogs sit over the journey map. URL state in
 * cvState.js.
 *
 * Signed in (live, isLiveProfile()): LiveUploadCv below. The picked PDF / .docx is sent to POST /profiles/cv/extract
 * (services/cv.api.js; nothing is saved by that call); "Reading your CV" lasts exactly as long as that request. The
 * review shows what was found; the talent unticks / fixes items, and "Add N items" loads the profile and writes the
 * ticked items with ONE saveProfileFields call (appended, de-duplicated, nothing removed — cvData mergeCvIntoProfile).
 * CV-05 shows the real counts and "Review Work" opens /profile/filling/work. Steps that need in-memory data fall back
 * to CV-01 when opened by URL.
 *
 * Signed out (demo): every frame opens by URL; choosing a file runs the same screens by interaction with simulated
 * upload / read timers and the mock result. The file never leaves the browser.
 */
const UploadCvPage = () => (isLiveProfile() ? <LiveUploadCv /> : <DemoUploadCv />);

const LIVE_STEPS_NEEDING_DATA = ['uploading', 'reading', 'failed', 'review', 'done', 'unsupported'];

const LiveUploadCv = () => {
  const navigate = useNavigate();
  const st = useCvState();
  const [cvFile, setCvFile] = useState(null);
  const [fileInfo, setFileInfo] = useState(null);
  const [uploadPct, setUploadPct] = useState(0);
  const [reading, setReading] = useState(false);
  const [result, setResult] = useState(null);
  const [failure, setFailure] = useState(null); // 'unreadable' | 'unavailable' | 'limited'
  const [choice, setChoice] = useState('retry');
  const [unsupported, setUnsupported] = useState(null); // { name, reason: 'type' | 'size' }
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [summary, setSummary] = useState(null);
  const [editItem, setEditItem] = useState(null); // { group: 'education' | 'certificates', id }
  const request = useRef({ id: 0, controller: null });

  const toJourney = () => navigate('/profile/engagement');
  const toPicker = () => navigate('/profile/engagement?modal=add-work');

  const abortRead = () => {
    request.current.id += 1;
    request.current.controller?.abort();
    request.current.controller = null;
    setReading(false);
  };

  // Leaving the page cancels a read in flight.
  useEffect(() => () => request.current.controller?.abort(), []);

  // Back / forward away from "Reading" cancels the request too.
  useEffect(() => {
    if (st.step !== 'reading' && reading) {
      log('left reading: cancel');
      abortRead();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [st.step]);

  // A step opened by URL (reload, deep link) without its data goes back to CV-01: never show a mock result as theirs.
  const orphan =
    LIVE_STEPS_NEEDING_DATA.includes(st.step) &&
    !(
      (st.step === 'reading' && reading) ||
      (st.step === 'failed' && failure) ||
      (st.step === 'review' && result) ||
      (st.step === 'done' && summary) ||
      (st.step === 'unsupported' && unsupported)
    );
  useEffect(() => {
    if (!orphan) return;
    log('no data for step, back to choose', st.step);
    st.update({ step: null, fix: null, role: null }, { replace: true });
  }, [orphan, st]);

  const startRead = (file) => {
    abortRead();
    const id = request.current.id;
    const controller = new AbortController();
    request.current.controller = controller;
    const type = cvFileType(file) === 'docx' ? 'Word' : 'PDF';
    setCvFile(file);
    setFileInfo({ name: file.name, sizeKb: Math.max(1, Math.round(file.size / 1024)), type });
    setUploadPct(0);
    setFailure(null);
    setResult(null);
    setSaveError('');
    setReading(true);
    st.update({ step: 'reading', fix: null, role: null });
    extractCv(file, { signal: controller.signal, onUploadProgress: setUploadPct })
      .then((data) => {
        if (request.current.id !== id) return;
        const r = resultFromExtraction(data, {
          name: file.name,
          sizeKb: Math.max(1, Math.round(file.size / 1024)),
          type,
        });
        setReading(false);
        if (isEmptyResult(r)) {
          log('nothing found');
          setFailure('unreadable');
          setChoice('retry');
          st.update({ step: 'failed' }, { replace: true });
          return;
        }
        setResult(r);
        st.update({ step: 'review' }, { replace: true });
      })
      .catch((err) => {
        if (request.current.id !== id || err?.code === CV_ERROR.CANCELLED) return;
        setReading(false);
        log.error('read failed', err?.code, err?.status);
        if (err?.code === CV_ERROR.TOO_LARGE || err?.code === CV_ERROR.UNSUPPORTED) {
          setUnsupported({
            name: file.name,
            reason: err.code === CV_ERROR.TOO_LARGE ? 'size' : 'type',
          });
          st.update({ step: 'unsupported' }, { replace: true });
          return;
        }
        setFailure(
          err?.code === CV_ERROR.UNREADABLE
            ? 'unreadable'
            : err?.code === CV_ERROR.RATE_LIMITED
              ? 'limited'
              : 'unavailable'
        );
        setChoice(err?.code === CV_ERROR.RATE_LIMITED ? 'chat' : 'retry');
        st.update({ step: 'failed' }, { replace: true });
      })
      .finally(() => {
        if (request.current.id === id) request.current.controller = null;
      });
  };

  // A CV dropped in Career Buddy's chat (cvHandoff.js) goes straight into the reader.
  // Started on the next tick so React's dev double-mount (StrictMode) doesn't start and abort it, then lose the file.
  useEffect(() => {
    if (!peekHandedOffCv()) return undefined;
    const t = setTimeout(() => {
      const handed = takeHandedOffCv();
      if (handed) {
        log('cv handed over from Career Buddy', { bytes: handed.size });
        onFiles([handed]);
      }
    }, 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFiles = (files) => {
    const file = Array.from(files ?? [])[0];
    const check = checkCvFile(file);
    log('file', { ok: check.ok, code: check.code });
    if (!check.ok) {
      setUnsupported({
        name: file?.name || 'This file',
        reason: check.code === CV_ERROR.TOO_LARGE ? 'size' : 'type',
      });
      st.update({ step: 'unsupported' });
      return;
    }
    setUnsupported(null);
    startRead(file);
  };

  const cancel = () => {
    abortRead();
    st.update({ step: null, fix: null, role: null });
  };

  const toggle = (group, id) =>
    setResult((r) => ({
      ...r,
      [group]: r[group].map((x) => (x.id === id ? { ...x, checked: !x.checked } : x)),
    }));

  const addToProfile = async () => {
    if (!result || saving) return;
    setSaving(true);
    setSaveError('');
    let profile;
    try {
      profile = await fetchMyProfile();
      if (!profile) throw new Error('No profile');
    } catch (err) {
      log.error('profile load failed; nothing saved', err?.response?.status || err?.message);
      setSaveError('We couldn’t load your profile, so nothing was added. Please try again.');
      setSaving(false);
      return;
    }
    const merged = mergeCvIntoProfile(profile, result);
    log('merge', { fields: Object.keys(merged.fields), added: merged.added });
    if (Object.keys(merged.fields).length) {
      try {
        await saveProfileFields(merged.fields);
      } catch (err) {
        log.error('save failed', err?.response?.status || err?.message);
        setSaveError(
          'We couldn’t save these to your profile. Nothing was added. Please try again.'
        );
        setSaving(false);
        return;
      }
    }
    setSaving(false);
    setSummary({
      roles: merged.added.roles,
      education: merged.added.education,
      skills: merged.added.skills,
      certs: merged.added.certs,
      certsLeftOut: merged.leftOut,
      duplicates: merged.duplicates,
    });
    st.update({ step: 'done', fix: null, role: null });
  };

  if (orphan) return <JourneyHub defaults={{}} />;

  const fixRole =
    st.step === 'review' && st.fix && result
      ? (result.roles.find((r) => r.id === st.role) ?? null)
      : null;
  const editing =
    st.step === 'review' && editItem && result
      ? (result[editItem.group].find((x) => x.id === editItem.id) ?? null)
      : null;
  const addedTotal = summary
    ? summary.roles + summary.education + summary.skills + summary.certs
    : 0;

  return (
    <JourneyHub defaults={{}}>
      {st.step === 'choose' || st.step === 'unsupported' ? (
        <CvChooseDialog
          live
          unsupportedName={st.step === 'unsupported' ? (unsupported?.name ?? null) : null}
          unsupportedReason={unsupported?.reason}
          onFiles={onFiles}
          onBack={toPicker}
          onClose={toJourney}
        />
      ) : null}
      {st.step === 'reading' && fileInfo ? (
        <CvLiveReadingDialog
          file={fileInfo}
          uploadPercent={uploadPct}
          onCancel={cancel}
          onClose={toJourney}
        />
      ) : null}
      {st.step === 'failed' && failure ? (
        <CvFailedDialog
          variant={failure}
          choice={choice}
          onChoice={setChoice}
          onBack={cancel}
          onContinue={() => {
            log('failed: continue', choice);
            if (choice === 'chat') navigate('/profile/filling/career-buddy');
            else if (choice === 'manual') navigate('/profile/filling/work?modal=add');
            else if (failure === 'unavailable' && cvFile) startRead(cvFile);
            else cancel();
          }}
          onClose={toJourney}
        />
      ) : null}
      {st.step === 'review' && result && !fixRole && !editing ? (
        <CvReviewDialog
          live
          file={result.file}
          result={result}
          busy={saving}
          error={saveError}
          onToggle={toggle}
          onEdit={(id) => st.update({ fix: 1, role: id })}
          onEditItem={(group, id) => setEditItem({ group, id })}
          onStartOver={() => {
            setResult(null);
            cancel();
          }}
          onAdd={addToProfile}
          onClose={toJourney}
        />
      ) : null}
      {fixRole ? (
        <CvFixRoleDialog
          live
          role={fixRole}
          initial={{
            title: fixRole.data.position,
            employer: fixRole.data.company,
            start: fixRole.start === '?' ? '' : fixRole.start,
            end: fixRole.data.isCurrent ? '' : fixRole.end,
            current: fixRole.data.isCurrent,
            nationalService: false,
          }}
          onSave={(d) => {
            const data = {
              ...fixRole.data,
              position: d.title.trim(),
              company: d.employer.trim(),
              startDate: parseMonth(d.start),
              endDate: d.current ? null : parseMonth(d.end),
              isCurrent: Boolean(d.current),
            };
            setResult((r) => ({
              ...r,
              roles: r.roles.map((x) => (x.id === fixRole.id ? roleRow(x.id, data, true) : x)),
            }));
            st.update({ fix: null, role: null });
          }}
          onCancel={() => st.update({ fix: null, role: null })}
        />
      ) : null}
      {editing ? (
        <CvEditItemDialog
          kind={editItem.group}
          data={editing.data}
          onSave={(data) => {
            const row = editItem.group === 'education' ? educationRow : certRow;
            setResult((r) => ({
              ...r,
              [editItem.group]: r[editItem.group].map((x) =>
                x.id === editing.id ? row(x.id, data, true) : x
              ),
            }));
            setEditItem(null);
          }}
          onCancel={() => setEditItem(null)}
        />
      ) : null}
      {st.step === 'done' && summary ? (
        <>
          <CvLiveDoneDialog
            summary={summary}
            onBack={toJourney}
            onReview={() => navigate('/profile/filling/work')}
            onClose={toJourney}
          />
          {addedTotal > 0 ? <CvToast count={addedTotal} xp={false} /> : null}
        </>
      ) : null}
    </JourneyHub>
  );
};

/* Signed-out demo: the drawn frames, simulated upload / read, mock result. */
const DemoUploadCv = () => {
  const navigate = useNavigate();
  const st = useCvState();
  const [file, setFile] = useState(MOCK_FILE);
  const [unsupported, setUnsupported] = useState(null);
  const [result, setResult] = useState(createMockParseResult);
  const [choice, setChoice] = useState('photo');
  const [shareCv, setShareCv] = useState(false);
  const [added, setAdded] = useState(0);
  // true once a real file was picked: the bars then move by themselves; direct URLs show the drawn percentages.
  const [live, setLive] = useState(false);
  const [upPct, setUpPct] = useState(FRAME_UPLOAD_PERCENT);
  const [readPct, setReadPct] = useState(FRAME_READ_PERCENT);
  const [readStep, setReadStep] = useState(2);
  const timer = useRef(null);

  const toJourney = () => navigate('/profile/engagement');
  const toPicker = () => navigate('/profile/engagement?modal=add-work');

  useEffect(() => {
    if (!live) return undefined;
    clearInterval(timer.current);
    if (st.step === 'uploading') {
      timer.current = setInterval(() => {
        setUpPct((p) => {
          if (p >= 100) {
            clearInterval(timer.current);
            st.update({ step: 'reading' });
            return 100;
          }
          return Math.min(100, p + 12);
        });
      }, 220);
    }
    if (st.step === 'reading') {
      setReadPct(0);
      setReadStep(0);
      timer.current = setInterval(() => {
        setReadPct((p) => {
          const next = Math.min(100, p + 10);
          setReadStep(Math.min(3, Math.floor(next / 26)));
          if (next >= 100) {
            clearInterval(timer.current);
            st.update({ step: 'review' });
          }
          return next;
        });
      }, 300);
    }
    return () => clearInterval(timer.current);
    // the step is the trigger; st.update is re-created per render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live, st.step]);

  const onFiles = (files) => {
    const v = validateFiles(files);
    log('files', { ok: v.ok, bad: v.badName });
    if (!v.ok) {
      setUnsupported(v.badName || MOCK_UNSUPPORTED_NAME);
      st.update({ step: 'unsupported' });
      return;
    }
    setUnsupported(null);
    setFile({ ...MOCK_FILE, ...describeFile(v.files) });
    setLive(true);
    setUpPct(0);
    st.update({ step: 'uploading' });
  };

  const cancel = () => {
    setLive(false);
    st.update({ step: null });
  };

  const toggle = (group, id) =>
    setResult((r) => ({
      ...r,
      [group]: r[group].map((x) => (x.id === id ? { ...x, checked: !x.checked } : x)),
    }));

  const fixRole =
    st.step === 'review' && st.fix
      ? (result.roles.find((r) => r.id === st.role) ??
        result.roles.find((r) => r.flagged) ??
        result.roles[result.roles.length - 1])
      : null;
  const fixDraft = fixRole
    ? {
        title: fixRole.title,
        employer: fixRole.employer,
        start: fixRole.start,
        end: fixRole.end || (st.role ? '' : FIX_DEEPLINK_END),
        current: false,
        nationalService: fixRole.employmentType === 'National service',
      }
    : null;

  const summary = {
    roles: result.roles.filter((r) => r.checked).length,
    skills: result.skills.filter((x) => x.checked).length,
    certs: result.certificates.filter((c) => c.checked).length,
    certsLeftOut: result.certificates.filter((c) => !c.checked).length,
  };

  return (
    <JourneyHub defaults={{}}>
      {st.step === 'choose' || st.step === 'unsupported' ? (
        <CvChooseDialog
          unsupportedName={
            st.step === 'unsupported' ? (unsupported ?? MOCK_UNSUPPORTED_NAME) : null
          }
          onFiles={onFiles}
          onBack={toPicker}
          onClose={toJourney}
        />
      ) : null}
      {st.step === 'uploading' ? (
        <CvUploadingDialog
          file={file}
          percent={live ? upPct : FRAME_UPLOAD_PERCENT}
          onCancel={cancel}
          onRead={() => {
            setLive(true);
            st.update({ step: 'reading' });
          }}
          onClose={toJourney}
        />
      ) : null}
      {st.step === 'reading' ? (
        <CvReadingDialog
          file={file}
          percent={live ? readPct : FRAME_READ_PERCENT}
          active={live ? readStep : 2}
          secondsLeft={live ? Math.max(1, Math.round((100 - readPct) / 6)) : 9}
          onCancel={cancel}
          onClose={toJourney}
        />
      ) : null}
      {st.step === 'failed' ? (
        <CvFailedDialog
          choice={choice}
          onChoice={setChoice}
          onBack={cancel}
          onContinue={() => {
            if (choice === 'chat') navigate('/profile/filling/career-buddy');
            else if (choice === 'manual') navigate('/profile/filling/work?modal=add');
            else cancel();
          }}
          onClose={toJourney}
        />
      ) : null}
      {st.step === 'review' && !fixRole ? (
        <CvReviewDialog
          file={file}
          result={result}
          onToggle={toggle}
          onEdit={(id) => st.update({ fix: 1, role: id })}
          onStartOver={() => {
            setResult(createMockParseResult());
            cancel();
          }}
          onAdd={() => {
            setAdded(countChecked(result));
            st.update({ step: 'done', fix: null, role: null });
          }}
          onClose={toJourney}
        />
      ) : null}
      {fixRole ? (
        <CvFixRoleDialog
          role={fixRole}
          initial={fixDraft}
          onSave={(d) => {
            setResult((r) => ({
              ...r,
              roles: r.roles.map((x) =>
                x.id === fixRole.id
                  ? {
                      ...x,
                      title: d.title,
                      employer: d.employer,
                      start: d.start,
                      end: d.current ? 'now' : d.end,
                      flagged: false,
                      checked: true,
                    }
                  : x
              ),
            }));
            st.update({ fix: null, role: null });
          }}
          onCancel={() => st.update({ fix: null, role: null })}
        />
      ) : null}
      {st.step === 'done' ? (
        <>
          <CvDoneDialog
            summary={summary}
            shareCv={shareCv}
            onShareCv={setShareCv}
            onBack={toJourney}
            onReview={() => navigate('/profile/filling/work?state=list')}
            onClose={toJourney}
          />
          <CvToast
            count={added || countChecked(result)}
            onUndo={() => st.update({ step: 'review' })}
          />
        </>
      ) : null}
    </JourneyHub>
  );
};

export default UploadCvPage;
