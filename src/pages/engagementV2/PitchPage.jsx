import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { debug } from '../../utils/debug.js';
import { useUiStyle } from '../../hooks/useUiStyle.js';
import {
  fetchMyProfile,
  isLiveProfile,
  saveProfileFields,
} from '../../services/profileStages.api.js';
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
const clock = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

/*
 * PitchPage — stage 9 "Pitch" (route /profile/filling/pitch, Figma PI-01 … PI-08, both styles). URL state: see pitchState.js.
 * Live (signed in): the Write text loads from / saves to `professionalBio` (saved on Publish; Delete on a written pitch clears
 * it), and the published dialog shows only after that save succeeds. Record / Upload stay demo: there is no video upload yet,
 * so a video pitch saves nothing (only its text, if the talent also wrote one) and is never shown as published on its own.
 * Demo (signed out): the Write box starts with the sample pitch, Publish just flips the URL to the published step.
 * The pitch file is mock data until one is recorded / chosen in this session (then its real name and size show).
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
  const [text, setText] = useState(live ? '' : PITCH_WRITTEN_SAMPLE);
  const [source, setSource] = useState(null); // 'write' | 'video': what Review and publish was opened from
  const [savedBio, setSavedBio] = useState(false); // live: professionalBio is saved (loaded or published here)
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null);
  /* live: 'loading' | 'ready' | 'error'. Publish / delete only save once the profile loaded. */
  const [load, setLoad] = useState(live ? 'loading' : 'ready');

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

  const shownFile = {
    name: file?.name ?? PITCH_FILE.name,
    meta: file
      ? `${mb(file.size)}${file.seconds ? ` · ${clock(file.seconds)}` : ''}`
      : PITCH_FILE.meta,
  };

  const stopRecording = useCallback(async () => {
    const rec = await capture.stop();
    log('stopped', Boolean(rec));
    if (rec) setFile(rec);
    update({ mode: 'upload', step: 'ready' });
  }, [capture, update]);

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
    update({ mode: 'record', step: 'recording' });
  };

  const onFile = (f) => {
    log('file chosen', f?.name);
    if (!f) return;
    setFile({ name: f.name, size: f.size, url: URL.createObjectURL(f) });
    update({ mode: 'upload', step: 'ready' });
  };

  const tabs = (active) => <MethodTabs tabs={PITCH_TABS} active={active} onPick={pickMode} />;

  const isReview = screen === 'review';
  /* Live: a review opened without a known source (reload / deep link) reviews the written text when there is no video. */
  const kind = source ?? (live && !file && text.trim() ? 'write' : 'video');
  const reviewWritten = live && kind === 'write';

  const publish = async () => {
    if (!live) {
      update({ step: 'published', modal: null });
      return;
    }
    if (load !== 'ready') {
      log.error('publish blocked: profile not loaded', load);
      return;
    }
    const bio = text.trim();
    if (!bio) {
      if (kind === 'write') {
        log('publish: empty written pitch, nothing saved');
        setNotice('Write your pitch before you publish it.');
      } else {
        log('publish: video pitch without text, nothing saved (video upload is not wired yet)');
        setNotice('Video pitches can’t be saved yet. Write your pitch to publish it.');
      }
      return;
    }
    if (kind === 'video')
      log('publish: video upload is not wired yet, saving only the written text');
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
        ready={screen === 'uploadReady'}
        file={shownFile}
        onBrowse={() => fileInput.current?.click()}
        onDropFile={onFile}
        onReplace={replace}
      />
    );
  else if (screen === 'write')
    body = <WriteBody tabs={tabs('write')} text={text} onText={setText} />;
  else
    body = (
      <ReviewBody
        file={shownFile}
        written={reviewWritten ? text : undefined}
        onReplace={reviewWritten ? () => pickMode('write') : replace}
      />
    );

  let footer;
  if (isReview) {
    footer = {
      backLabel: PITCH_FOOTER.backEdit,
      onBack: () =>
        reviewWritten ? pickMode('write') : update({ mode: 'upload', step: 'ready', modal: null }),
      continueLabel: PITCH_FOOTER.publish,
      disabled: saving || load !== 'ready',
      onContinue: publish,
    };
  } else {
    footer = {
      backLabel: PITCH_FOOTER.back,
      onBack: () => navigate(GOALS_ROUTE),
      skipLabel: PITCH_FOOTER.skip,
      onSkip: () => navigate(nextStageRoute('pitch')),
      continueLabel: PITCH_FOOTER.review,
      disabled: !(screen === 'uploadReady' || screen === 'write'),
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
        onChange={(e) => onFile(e.target.files?.[0])}
      />
      <PitchHero hero={hero} sticker={PITCH_STICKERS[stickerKey]} card={PITCH_HERO_CARD} />
      <main className="grid flex-1 items-start gap-[clamp(24px,3.7vw,64px)] px-4 pt-10 pb-10 md:px-[clamp(20px,3.7vw,64px)] lg:grid-cols-[minmax(0,1072fr)_minmax(0,464fr)] lg:pb-[100px]">
        <div className="min-w-0">
          {load === 'error' ? (
            <p
              role="status"
              className="m-0 mb-5 rounded-[12px] border border-solid border-[#f3c7c2] bg-[#fdf1f0] px-4 py-3 font-sans text-[14px] leading-[20px] text-[#b42318]"
            >
              We couldn’t load your profile. Refresh to try again.
            </p>
          ) : null}
          {notice ? (
            <p
              role="status"
              className="m-0 mb-5 rounded-[12px] border border-solid border-[#f3c7c2] bg-[#fdf1f0] px-4 py-3 font-sans text-[14px] leading-[20px] text-[#b42318]"
            >
              {notice}
            </p>
          ) : null}
          {body}
        </div>
        <aside className="flex min-w-0 flex-col gap-5" aria-label="Pitch tips">
          <PitchRail screen={screen} />
        </aside>
      </main>
      <PitchFooter {...footer} />
      {st.published && (!live || savedBio) ? (
        <CompleteDialog
          uiStyle={uiStyle}
          onClose={() => update({ step: 'review' })}
          onWatch={() => log('watch my pitch (not drawn in Figma: no destination)')}
          onMilestone={() => navigate(MILESTONE_ROUTE)}
        />
      ) : null}
      {st.modal === 'delete' ? (
        <DeleteDialog
          file={shownFile}
          onClose={() => update({ modal: null, step: 'review' })}
          onReplace={replace}
          onConfirm={deletePitch}
        />
      ) : null}
    </EngagementStageFrame>
  );
};

export default PitchPage;
