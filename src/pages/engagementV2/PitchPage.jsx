import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { debug } from '../../utils/debug.js';
import { useUiStyle } from '../../hooks/useUiStyle.js';
import {
  fetchMyProfile,
  isLiveProfile,
  saveProfileFields,
} from '../../services/profileStages.api.js';
import { cachedJourney, onJourney, refreshJourney } from '../../services/journey.api.js';
import {
  deleteVideoPitch,
  fetchVideoPitch,
  pitchDurationProblem,
  pitchFileProblem,
  submitVideoPitch,
  uploadPitchVideo,
} from '../../services/videoPitch.api.js';
import EngagementStageFrame from '../../components/sections/engagementShell/EngagementStageFrame.jsx';
import {
  ENGAGEMENT_STAGES,
  nextStageRoute,
} from '../../components/sections/engagementShell/engagementShellData.js';
import {
  CompleteDialog,
  DeleteDialog,
} from '../../components/sections/engagementV2/pitch/PitchDialogs.jsx';
import {
  PITCH_FILE,
  PITCH_FOOTER,
  PITCH_HERO,
  PITCH_HERO_CARD,
  PITCH_STICKERS,
  PITCH_TABS,
  PITCH_WRITTEN_SAMPLE,
} from '../../components/sections/engagementV2/pitch/pitchData.js';
import {
  MAX_PITCH_SECONDS,
  readVideoDuration,
  usePitchCapture,
} from '../../components/sections/engagementV2/pitch/pitchCapture.js';
import { usePitchState } from '../../components/sections/engagementV2/pitch/pitchState.js';
import {
  MethodTabs,
  PitchFooter,
  PitchHero,
} from '../../components/sections/engagementV2/pitch/PitchParts.jsx';
import {
  ChooseBody,
  PitchRail,
  RecordBody,
  ReviewBody,
  UploadBody,
  WriteBody,
} from '../../components/sections/engagementV2/pitch/PitchScreens.jsx';

const log = debug('PitchPage');

/* Stages 1-8 are done in the mock journey (Figma stage bar: "8 of 9 done · 89%"). */
const DONE_IDS = ENGAGEMENT_STAGES.filter((s) => s.id !== 'pitch').map((s) => s.id);
const GOALS_ROUTE = '/profile/filling/goals';
const MILESTONE_ROUTE = '/profile/engagement/milestone/top-talent';
const mb = (bytes) => `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
const clock = (sec) => {
  const s = Math.round(sec);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};
const formatOf = (f) =>
  (f.name?.split('.').pop() || f.type?.split('/')[1] || 'webm')
    .toLowerCase()
    .replace('quicktime', 'mov');
const STATUS_CLASS =
  'm-0 mb-5 rounded-[12px] border border-solid border-[#f3c7c2] bg-[#fdf1f0] px-4 py-3 font-sans text-[14px] leading-[20px] text-[#b42318]';

/*
 * PitchPage — stage 9 "Pitch" (route /profile/filling/pitch, Figma PI-01 … PI-08, both styles). URL state: see pitchState.js.
 * Live (signed in):
 *   Write   the text loads from / saves to `professionalBio` (saved on Publish; Delete on a written pitch clears it).
 *   Record  MediaRecorder capture (pitchCapture.js) → a WebM blob; Upload: a picked file (type / ≤100 MB checked, length
 *           read from the file). Both must be 15–120 s (videoPitch.api.js). Publish uploads the file (progress bar), then
 *           records it as the engagement's video pitch; the published dialog shows only after both calls succeed, and a
 *           failed submit keeps the uploaded url so a retry skips the upload.
 *   On load an existing video pitch is fetched and shown (real player) on the review screen, with Replace / Delete;
 *   "Watch my pitch" plays it. Every publish / delete refreshes the journey.
 * Demo (signed out): the Write box starts with the sample pitch, Publish just flips the URL to the published step, and the
 * pitch file is mock data until one is recorded / chosen in this session (then its real name and size show).
 */
const PitchPage = () => {
  const navigate = useNavigate();
  const { uiStyle } = useUiStyle();
  const st = usePitchState();
  const { screen, update } = st;
  const capture = usePitchCapture();
  const fileInput = useRef(null);
  const [file, setFile] = useState(null);
  const live = isLiveProfile();
  // The real journey for the complete dialog (refreshed after publish).
  const [journey, setJourney] = useState(() => (live ? cachedJourney() : null));
  useEffect(() => (live ? onJourney(setJourney) : undefined), [live]);
  const [text, setText] = useState(live ? '' : PITCH_WRITTEN_SAMPLE);
  const [source, setSource] = useState(null); // 'write' | 'video': what Review and publish was opened from
  const [savedBio, setSavedBio] = useState(false); // live: professionalBio is saved (loaded or published here)
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null);
  /* live: 'loading' | 'ready' | 'error'. Publish / delete only save once the profile loaded. */
  const [load, setLoad] = useState(live ? 'loading' : 'ready');
  const [pitchVideo, setPitchVideo] = useState(null); // live: the published video pitch { url, duration, … }
  const [videoLoad, setVideoLoad] = useState(live ? 'loading' : 'ready');
  const [progress, setProgress] = useState(null); // upload % while publishing a video, else null
  const [playSignal, setPlaySignal] = useState(0);
  const [checking, setChecking] = useState(false); // reading a picked file's length
  const latest = useRef({ screen, update });
  latest.current = { screen, update };

  useEffect(() => {
    if (!live) return undefined;
    let cancelled = false;
    fetchVideoPitch()
      .then((video) => {
        if (cancelled) return;
        log('loaded video pitch', { found: Boolean(video) });
        setPitchVideo(video);
        setVideoLoad('ready');
        /* An existing pitch opens on its review screen (unless the talent is already somewhere else in the flow). */
        if (video && latest.current.screen === 'choose') {
          setSource('video');
          latest.current.update({ step: 'review' });
        }
      })
      .catch((err) => {
        if (cancelled) return;
        log.error('load video pitch failed:', err?.response?.status || err?.message);
        setVideoLoad('error');
      });
    return () => {
      cancelled = true;
    };
  }, [live]);

  /* Free the previous preview whenever the chosen / recorded file changes. */
  const fileUrl = file?.url;
  useEffect(
    () => () => {
      if (fileUrl?.startsWith('blob:')) URL.revokeObjectURL(fileUrl);
    },
    [fileUrl]
  );

  useEffect(() => {
    if (!live) return undefined;
    let cancelled = false;
    fetchMyProfile()
      .then((profile) => {
        if (cancelled) return;
        const bio = typeof profile?.professionalBio === 'string' ? profile.professionalBio : '';
        log('loaded live bio', { words: bio.trim() ? bio.trim().split(/\s+/).length : 0 });
        if (bio.trim()) {
          setText((prev) => (prev.trim() ? prev : bio)); // never overwrite what the talent already typed
          setSavedBio(true);
        }
        setLoad('ready');
      })
      .catch((err) => {
        if (cancelled) return;
        log.error('load pitch failed:', err?.response?.status || err?.message);
        setLoad('error');
      });
    return () => {
      cancelled = true;
    };
  }, [live]);

  useEffect(() => {
    log('mount / screen', { screen });
  }, [screen]);

  let shownFile;
  if (live && file)
    shownFile = {
      name: file.name,
      meta: `${mb(file.size)} · ${clock(file.seconds)}`,
      url: file.url,
      chips: ['15 s to 2 min', 'Under 100 MB'],
    };
  else if (live && pitchVideo)
    shownFile = {
      name: pitchVideo.title || 'Your video pitch',
      meta: [
        pitchVideo.duration ? clock(pitchVideo.duration) : null,
        pitchVideo.fileSizeMB ? `${pitchVideo.fileSizeMB.toFixed(1)} MB` : null,
        'Published',
      ]
        .filter(Boolean)
        .join(' · '),
      url: pitchVideo.url,
      chips: ['Published'],
      deleteMeta: `Video${pitchVideo.duration ? ` · ${clock(pitchVideo.duration)}` : ''} · published`,
    };
  else
    shownFile = {
      name: file?.name ?? PITCH_FILE.name,
      meta: file
        ? `${mb(file.size)}${file.seconds ? ` · ${clock(file.seconds)}` : ''}`
        : PITCH_FILE.meta,
    };

  const stopRecording = useCallback(async () => {
    const rec = await capture.stop();
    log('stopped', Boolean(rec));
    if (!live) {
      if (rec) setFile(rec);
      update({ mode: 'upload', step: 'ready' });
      return;
    }
    if (!rec || !rec.size) {
      log('record: nothing captured');
      setNotice(
        'Nothing was recorded. Your browser may not support recording here, so upload a video instead.'
      );
      update({ mode: 'upload', step: null });
      return;
    }
    const problem = pitchDurationProblem(rec.seconds);
    if (problem) {
      log('record: rejected length', rec.seconds);
      URL.revokeObjectURL(rec.url);
      setNotice(problem);
      update({ mode: 'record', step: 'camera' });
      return;
    }
    setNotice(null);
    setFile(rec);
    update({ mode: 'upload', step: 'ready' });
  }, [capture, update, live]);

  useEffect(() => {
    if (capture.stream && capture.elapsed >= MAX_PITCH_SECONDS) stopRecording();
  }, [capture.stream, capture.elapsed, stopRecording]);

  const pickMode = (mode) => {
    log('pick mode', mode);
    update({ mode, step: mode === 'record' ? 'camera' : null, modal: null });
  };

  const allowCamera = async () => {
    const ok = await capture.request();
    log('allow camera', ok);
    if (live && !ok) {
      setNotice(
        'We couldn’t use your camera. Allow camera and microphone access in your browser, or upload a video instead.'
      );
      return;
    }
    setNotice(null);
    update({ mode: 'record', step: 'recording' });
  };

  const onFile = async (f) => {
    log('file chosen', f?.name);
    if (!f) return;
    if (!live) {
      setFile({ name: f.name, size: f.size, url: URL.createObjectURL(f) });
      update({ mode: 'upload', step: 'ready' });
      return;
    }
    const problem = pitchFileProblem(f);
    if (problem) {
      log('file rejected', { type: f.type, size: f.size });
      setNotice(problem);
      return;
    }
    const url = URL.createObjectURL(f);
    setChecking(true);
    const seconds = await readVideoDuration(url);
    setChecking(false);
    const tooLong = pitchDurationProblem(seconds);
    if (tooLong) {
      log('file rejected: length', seconds);
      URL.revokeObjectURL(url);
      setNotice(tooLong);
      return;
    }
    setNotice(null);
    setFile({ name: f.name, size: f.size, url, seconds, blob: f, type: f.type });
    update({ mode: 'upload', step: 'ready' });
  };

  const tabs = (active) => <MethodTabs tabs={PITCH_TABS} active={active} onPick={pickMode} />;

  const isReview = screen === 'review';
  /* Live: a review opened without a known source (reload / deep link) reviews the written text when there is no video. */
  const kind = source ?? (live && !file && !pitchVideo && text.trim() ? 'write' : 'video');
  const busy = saving || progress !== null;
  /* Live video review with nothing pending: the published pitch is what's shown (nothing new to publish). */
  const showingPublished = live && kind === 'video' && !file && Boolean(pitchVideo);
  const reviewWritten = live && kind === 'write';

  const publishVideo = async () => {
    if (!file) {
      if (pitchVideo) {
        update({ step: 'published', modal: null });
        return;
      }
      log('publish: no video chosen');
      setNotice('Record or upload a video before you publish it.');
      return;
    }
    const problem = pitchDurationProblem(file.seconds);
    if (problem) {
      setNotice(problem);
      return;
    }
    setNotice(null);
    let uploaded = file.uploaded;
    if (!uploaded) {
      setProgress(0);
      try {
        uploaded = await uploadPitchVideo(file.blob, { name: file.name, onProgress: setProgress });
        setFile((f) => (f && f.url === file.url ? { ...f, uploaded } : f));
      } catch (err) {
        log.error('upload pitch video failed:', err?.response?.status || err?.message);
        setProgress(null);
        setNotice(
          err?.response?.status === 413
            ? 'That video is too big to upload. Pitch videos can be up to 100 MB.'
            : 'We couldn’t upload your video. Your video is still here, check your connection and try again.'
        );
        return;
      }
    }
    setProgress(100);
    try {
      const saved = await submitVideoPitch({
        videoUrl: uploaded.url,
        duration: Math.round(file.seconds),
        format: uploaded.format || formatOf(file),
        fileSizeMB: Number(((file.size || uploaded.size) / (1024 * 1024)).toFixed(2)),
        title: file.name,
      });
      log('publish: video pitch saved');
      setPitchVideo(saved);
      setFile(null);
      setProgress(null);
      refreshJourney();
      update({ step: 'published', modal: null });
    } catch (err) {
      log.error('submit video pitch failed:', err?.response?.status || err?.message);
      setProgress(null);
      setNotice('Your video uploaded, but we couldn’t publish it. Try again in a moment.');
    }
  };

  const publish = async () => {
    if (!live) {
      update({ step: 'published', modal: null });
      return;
    }
    if (busy) return;
    if (kind === 'video') {
      await publishVideo();
      return;
    }
    if (load !== 'ready') {
      log.error('publish blocked: profile not loaded', load);
      return;
    }
    const bio = text.trim();
    if (!bio) {
      log('publish: empty written pitch, nothing saved');
      setNotice('Write your pitch before you publish it.');
      return;
    }
    setSaving(true);
    setNotice(null);
    try {
      await saveProfileFields({ professionalBio: bio });
      log('publish: professionalBio saved');
      setSavedBio(true);
      update({ step: 'published', modal: null });
    } catch (err) {
      log.error('save pitch failed:', err?.response?.status || err?.message);
      setNotice('We couldn’t publish your pitch. Your text is kept here, try again in a moment.');
    } finally {
      setSaving(false);
    }
  };

  const deletePitch = async () => {
    log('delete pitch', { kind });
    if (live && kind === 'video' && pitchVideo && !file) {
      setSaving(true);
      try {
        await deleteVideoPitch();
        log('delete: video pitch removed');
        setPitchVideo(null);
        setSource(null);
        refreshJourney();
        update({ mode: null, step: null, modal: null });
      } catch (err) {
        log.error('delete video pitch failed:', err?.response?.status || err?.message);
        setNotice(
          'We couldn’t delete your video pitch. It’s still published, try again in a moment.'
        );
        update({ modal: null, step: 'review' });
      } finally {
        setSaving(false);
      }
      return;
    }
    setFile(null);
    update({ mode: null, step: null, modal: null });
    if (!live || kind !== 'write') return;
    if (load !== 'ready') {
      log.error('delete blocked: profile not loaded', load);
      return;
    }
    setText('');
    setSource(null);
    try {
      await saveProfileFields({ professionalBio: '' });
      setSavedBio(false);
    } catch (err) {
      log.error('delete pitch failed:', err?.response?.status || err?.message);
      setNotice('We couldn’t delete your pitch. Try again in a moment.');
    }
  };
  const hero = isReview ? PITCH_HERO.review : PITCH_HERO.default;
  const stickerKey = { camera: 'record', recording: 'record' }[screen] ?? screen;

  const replace = () => {
    setFile(null);
    update({ mode: 'upload', step: null, modal: null });
  };

  let body;
  if (screen === 'choose') body = <ChooseBody onPick={pickMode} />;
  else if (screen === 'camera' || screen === 'recording')
    body = (
      <RecordBody
        tabs={tabs('record')}
        recording={screen === 'recording'}
        stream={capture.stream}
        elapsed={capture.elapsed}
        onAllow={allowCamera}
        onStop={stopRecording}
        onUploadInstead={() => pickMode('upload')}
      />
    );
  else if (screen === 'upload' || screen === 'uploadReady')
    body = (
      <UploadBody
        tabs={tabs('upload')}
        ready={screen === 'uploadReady' && (!live || Boolean(file))}
        file={shownFile}
        onBrowse={() => fileInput.current?.click()}
        onDropFile={onFile}
        onReplace={replace}
        live={live}
      />
    );
  else if (screen === 'write')
    body = <WriteBody tabs={tabs('write')} text={text} onText={setText} />;
  else if (live && !reviewWritten && !file && !pitchVideo)
    /* Live review with no video to show (deep link / reload): never the drawn mock file. */
    body =
      videoLoad === 'loading' ? (
        <p role="status" className="m-0 font-sans text-[15px] leading-[22px] text-[#595959]">
          Loading your pitch…
        </p>
      ) : (
        <ChooseBody onPick={pickMode} />
      );
  else
    body = (
      <ReviewBody
        file={shownFile}
        written={reviewWritten ? text : undefined}
        onReplace={reviewWritten ? () => pickMode('write') : replace}
        onDelete={
          (reviewWritten && savedBio) || showingPublished
            ? () => update({ modal: 'delete' })
            : undefined
        }
        progress={progress ?? undefined}
        playSignal={playSignal}
        busy={busy}
        live={live}
        lengthRow={
          live && !reviewWritten && (file?.seconds || pitchVideo?.duration)
            ? {
                title: 'Pitch is between 15 seconds and 2 minutes',
                sub: clock(file?.seconds || pitchVideo.duration),
              }
            : undefined
        }
      />
    );

  let footer;
  if (isReview) {
    footer = {
      backLabel: PITCH_FOOTER.backEdit,
      onBack: () =>
        reviewWritten ? pickMode('write') : update({ mode: 'upload', step: 'ready', modal: null }),
      continueLabel: showingPublished ? 'Continue' : PITCH_FOOTER.publish,
      disabled: busy || (reviewWritten && load !== 'ready'),
      onContinue: publish,
    };
  } else {
    footer = {
      backLabel: PITCH_FOOTER.back,
      onBack: () => navigate(GOALS_ROUTE),
      skipLabel: PITCH_FOOTER.skip,
      onSkip: () => navigate(nextStageRoute('pitch')),
      continueLabel: PITCH_FOOTER.review,
      disabled: checking || !((screen === 'uploadReady' && (!live || file)) || screen === 'write'),
      onContinue: () => {
        setSource(screen === 'write' ? 'write' : 'video');
        setNotice(null);
        update({ mode: null, step: 'review' });
      },
    };
  }

  return (
    <EngagementStageFrame stageId="pitch" doneIds={DONE_IDS} footer={false}>
      <input
        ref={fileInput}
        type="file"
        accept="video/mp4,video/quicktime,video/webm"
        className="hidden"
        aria-label="Choose a pitch video"
        onChange={(e) => {
          onFile(e.target.files?.[0]);
          e.target.value = ''; // picking the same file again still fires
        }}
      />
      <PitchHero hero={hero} sticker={PITCH_STICKERS[stickerKey]} card={PITCH_HERO_CARD} />
      <main className="grid flex-1 items-start gap-[clamp(24px,3.7vw,64px)] px-4 pt-10 pb-10 md:px-[clamp(20px,3.7vw,64px)] lg:grid-cols-[minmax(0,1072fr)_minmax(0,464fr)] lg:pb-[100px]">
        <div className="min-w-0">
          {load === 'error' ? (
            <p role="status" className={STATUS_CLASS}>
              We couldn’t load your profile. Refresh to try again.
            </p>
          ) : null}
          {videoLoad === 'error' ? (
            <p role="status" className={STATUS_CLASS}>
              We couldn’t check for a video pitch you published before. Refresh to try again.
            </p>
          ) : null}
          {notice ? (
            <p role="status" className={STATUS_CLASS}>
              {notice}
            </p>
          ) : null}
          {checking ? (
            <p
              role="status"
              className="m-0 mb-5 font-sans text-[14px] leading-[20px] text-[#595959]"
            >
              Checking your video…
            </p>
          ) : null}
          {body}
        </div>
        <aside className="flex min-w-0 flex-col gap-5" aria-label="Pitch tips">
          <PitchRail screen={screen} />
        </aside>
      </main>
      <PitchFooter {...footer} />
      {st.published && (!live || (kind === 'video' ? pitchVideo : savedBio)) ? (
        <CompleteDialog
          uiStyle={uiStyle}
          journey={live ? journey || { doneCount: 0, total: 9 } : null}
          onClose={() => update({ step: 'review' })}
          onWatch={() => {
            if (!live) {
              log('watch my pitch (demo: no video to play)');
              return;
            }
            log('watch my pitch', { kind });
            update({ step: 'review' });
            if (kind === 'video') setPlaySignal((n) => n + 1);
          }}
          onMilestone={() => navigate(MILESTONE_ROUTE)}
        />
      ) : null}
      {st.modal === 'delete' ? (
        <DeleteDialog
          file={shownFile}
          onClose={() => update({ modal: null, step: 'review' })}
          onReplace={replace}
          onConfirm={deletePitch}
          busy={busy}
        />
      ) : null}
    </EngagementStageFrame>
  );
};

export default PitchPage;
