import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CvChooseDialog,
  CvDoneDialog,
  CvFailedDialog,
  CvReadingDialog,
  CvUploadingDialog,
} from '../../components/sections/engagementV2/cv/CvSteps.jsx';
import {
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
  countChecked,
  createMockParseResult,
  describeFile,
  validateFiles,
} from '../../components/sections/engagementV2/cv/cvData.js';
import { useCvState } from '../../components/sections/engagementV2/cv/cvState.js';
import JourneyHub from '../../components/sections/engagementV2/journey/JourneyHub.jsx';
import { debug } from '../../utils/debug.js';

const log = debug('UploadCvPage');

/*
 * UploadCvPage (Figma "Upload my CV (new)", CV-01 ... CV-05): the dialogs sit over the journey map. URL state in cvState.js, so every
 * frame opens by URL; choosing a real file runs the same screens by interaction (upload and read are simulated, the result is mock).
 * Mock only: the file never leaves the browser.
 */
const UploadCvPage = () => {
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
