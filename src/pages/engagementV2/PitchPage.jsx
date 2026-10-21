import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { debug } from '../../utils/debug.js';
import { useUiStyle } from '../../hooks/useUiStyle.js';
import EngagementStageFrame from '../../components/sections/engagementShell/EngagementStageFrame.jsx';
import { ENGAGEMENT_STAGES } from '../../components/sections/engagementShell/engagementShellData.js';
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
  const [text, setText] = useState(PITCH_WRITTEN_SAMPLE);

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
  else body = <ReviewBody file={shownFile} onReplace={replace} />;

  let footer;
  if (isReview) {
    footer = {
      backLabel: PITCH_FOOTER.backEdit,
      onBack: () => update({ mode: 'upload', step: 'ready', modal: null }),
      continueLabel: PITCH_FOOTER.publish,
      onContinue: () => update({ step: 'published', modal: null }),
    };
  } else {
    footer = {
      backLabel: PITCH_FOOTER.back,
      onBack: () => navigate(GOALS_ROUTE),
      skipLabel: PITCH_FOOTER.skip,
      onSkip: () => log('skip for now (not drawn in Figma: no destination)'),
      continueLabel: PITCH_FOOTER.review,
      disabled: !(screen === 'uploadReady' || screen === 'write'),
      onContinue: () => update({ mode: null, step: 'review' }),
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
        <div className="min-w-0">{body}</div>
        <aside className="flex min-w-0 flex-col gap-5" aria-label="Pitch tips">
          <PitchRail screen={screen} />
        </aside>
      </main>
      <PitchFooter {...footer} />
      {st.published ? (
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
          onConfirm={() => {
            log('delete pitch');
            setFile(null);
            update({ mode: null, step: null, modal: null });
          }}
        />
      ) : null}
    </EngagementStageFrame>
  );
};

export default PitchPage;
