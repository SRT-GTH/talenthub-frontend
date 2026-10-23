import { useEffect, useRef } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import cameraStill from '../../../../assets/engagement-v2/pitch/pitch-camera-still.png';
import {
  PITCH_CAMERA,
  PITCH_CHECKLIST,
  PITCH_EXAMPLE,
  PITCH_FILE,
  PITCH_FORMULA,
  PITCH_METHODS,
  PITCH_NO_PRESSURE,
  PITCH_PICK_LABEL,
  PITCH_READY,
  PITCH_RECRUITERS,
  PITCH_SELF_CHECK,
  PITCH_TRIM,
  PITCH_UPLOAD,
  PITCH_WRITE,
} from './pitchData.js';
import {
  PitchCheckIcon,
  PitchInfoCircleIcon,
  PitchPlayIcon,
  PitchTrophyIcon,
  PitchUploadIcon,
  PitchVideoCameraIcon,
} from './pitchIcons.jsx';
import {
  CARD_SHADOW,
  Card,
  Chip,
  Eyebrow,
  HEAD_FONT,
  PitchGlyph,
  PitchPrimary,
  PitchSecondary,
  RailCard,
  Sticker,
} from './PitchParts.jsx';
import { MAX_PITCH_SECONDS } from './pitchCapture.js';

const log = debug('PitchScreens');

/* ---------- rails ---------- */
const FormulaRail = () => <RailCard title={PITCH_FORMULA.title} rows={PITCH_FORMULA.rows} />;

export const PitchRail = ({ screen }) => {
  if (screen === 'review') return <RailCard {...PITCH_RECRUITERS} />;
  if (screen === 'uploadReady' || screen === 'write') return <FormulaRail />;
  return (
    <>
      {screen === 'upload' ? <RailCard {...PITCH_TRIM} /> : null}
      <FormulaRail />
      {screen === 'choose' ||
      screen === 'camera' ||
      screen === 'recording' ||
      screen === 'upload' ? (
        <RailCard {...PITCH_NO_PRESSURE} />
      ) : null}
    </>
  );
};

/* ---------- PI-01 choose ---------- */
const METHOD_TILE = {
  record: 'bg-[#387440] text-white',
  upload: 'bg-[#ebf1ec] text-[#387440]',
  write: 'bg-[#ebf1ec] text-[#387440]',
};

export const ChooseBody = ({ onPick }) => (
  <div className="flex flex-col gap-5">
    <Eyebrow className="text-[#595959]">{PITCH_PICK_LABEL}</Eyebrow>
    <div className="grid gap-4 md:grid-cols-3">
      {PITCH_METHODS.map((m) => (
        <Card key={m.id} className="relative flex flex-col gap-3 rounded-[24px] p-[22px]">
          {m.sticker ? (
            <Sticker className="absolute -top-[23px] right-[36px] z-10 py-[5px]">
              {m.sticker}
            </Sticker>
          ) : null}
          <span
            className={classNames(
              'flex size-[52px] items-center justify-center rounded-[16px]',
              METHOD_TILE[m.id]
            )}
          >
            <PitchGlyph name={m.icon} className="size-[26px]" />
          </span>
          <h2 className="m-0 font-sans text-[19px] leading-[23px] font-semibold text-[#1c2a21]">
            {m.title}
          </h2>
          <p className="m-0 font-sans text-[14px] leading-[21px] text-[#595959]">{m.body}</p>
          <Chip className="self-start">{m.chip}</Chip>
          {m.id === 'record' ? (
            <PitchPrimary size="sm" className="w-full" onClick={() => onPick(m.id)}>
              {m.cta}
            </PitchPrimary>
          ) : (
            <PitchSecondary className="w-full" onClick={() => onPick(m.id)}>
              {m.cta}
            </PitchSecondary>
          )}
        </Card>
      ))}
    </div>
    <Card className="flex flex-col gap-[10px] rounded-[24px] px-[22px] py-5">
      <div className="flex items-center gap-2">
        <span className="inline-flex min-h-[23px] items-center rounded-full border border-[rgba(28,42,33,0.12)] bg-[#ffd86b] px-[10px] py-1 font-sans text-[11px] leading-[13px] font-semibold text-[#1c2a21] max-lg:text-[12px] playful:border-[#1c2a21]">
          {PITCH_EXAMPLE.chip}
        </span>
        <h2 className="m-0 font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
          {PITCH_EXAMPLE.title}
        </h2>
      </div>
      <p className="m-0 font-sans text-[15px] leading-[24px] text-[#1c2a21]">
        {PITCH_EXAMPLE.text}
      </p>
    </Card>
  </div>
);

/* ---------- PI-02 / PI-03 record ---------- */
const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

export const RecordBody = ({
  recording,
  stream,
  elapsed,
  onAllow,
  onStop,
  onUploadInstead,
  tabs,
}) => {
  const videoRef = useRef(null);
  useEffect(() => {
    if (videoRef.current) videoRef.current.srcObject = stream ?? null;
  }, [stream, recording]);
  /* Frame state: PI-03 shows 0:42 (70% of 60 s); a live capture counts for real up to MAX_PITCH_SECONDS. */
  const seconds = stream ? elapsed : 42;
  log('render', { recording, live: Boolean(stream), seconds });
  return (
    <div className="flex flex-col gap-5">
      {tabs}
      {recording ? (
        <>
          <div
            className={classNames(
              'relative h-[clamp(380px,32.4vw,560px)] overflow-hidden rounded-[24px] bg-[#0b1a0f] bg-cover bg-center',
              CARD_SHADOW
            )}
            style={stream ? undefined : { backgroundImage: `url(${cameraStill})` }}
          >
            {stream ? (
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="absolute inset-0 size-full -scale-x-100 object-cover"
              />
            ) : null}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] border border-[rgba(28,42,33,0.1)] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)]"
            />
            <div className="absolute top-5 left-5 z-10 flex flex-wrap items-center gap-[10px]">
              <span className="inline-flex min-h-[30px] items-center gap-[6px] rounded-full border border-[rgba(28,42,33,0.35)] bg-[#c0392b] py-[6px] pr-3 pl-[10px] font-sans text-[13px] leading-[16px] font-bold text-white">
                <span aria-hidden="true" className="size-2 rounded-full bg-white" />
                {stream ? `REC ${fmt(seconds)}` : PITCH_CAMERA.rec}
              </span>
              <Chip>
                {stream
                  ? `${Math.max(MAX_PITCH_SECONDS - seconds, 0)} seconds left`
                  : PITCH_CAMERA.left}
              </Chip>
            </div>
            <div className="absolute bottom-[84px] left-5 z-10 flex max-w-[calc(100%-40px)] flex-col gap-1 rounded-[14px] bg-[#0b1a0f]/75 px-4 py-3">
              <span className="font-sans text-[11px] leading-[13px] font-bold text-[#ffd86b] max-lg:text-[12px]">
                {PITCH_CAMERA.cueLabel}
              </span>
              <span className="font-sans text-[15px] leading-[18px] font-medium text-white">
                {PITCH_CAMERA.cue}
              </span>
            </div>
            <div className="absolute right-5 bottom-[54px] left-5 z-10 h-[6px] rounded-[3px] bg-white/30">
              <div
                className="h-full rounded-[3px] bg-[#387440]"
                style={{ width: `${Math.min(seconds / MAX_PITCH_SECONDS, 1) * 100}%` }}
              />
            </div>
            <button
              type="button"
              aria-label="Stop recording"
              onClick={onStop}
              className="absolute bottom-[6px] left-1/2 z-10 flex size-12 -translate-x-1/2 cursor-pointer items-center justify-center rounded-full border-[3px] border-white bg-[#c0392b] p-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <span aria-hidden="true" className="size-4 rounded-[3px] bg-white" />
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-[10px] rounded-[14px] bg-[#f7f8f4] px-4 py-3">
            {PITCH_CHECKLIST.map((c) => (
              <Chip key={c.label} tone={c.done ? 'green' : 'neutral'}>
                {c.label}
              </Chip>
            ))}
          </div>
        </>
      ) : (
        <div
          className={classNames(
            'relative flex min-h-[clamp(380px,32.4vw,560px)] items-center justify-center overflow-hidden rounded-[24px] bg-[#0b1a0f] px-6 py-10',
            CARD_SHADOW
          )}
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[inherit] border border-[rgba(28,42,33,0.1)] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)]"
          />
          <div className="relative flex w-full max-w-[460px] flex-col items-center gap-[14px] text-center text-white">
            <span className="flex size-[72px] items-center justify-center rounded-full bg-white/10">
              <PitchVideoCameraIcon className="size-8" />
            </span>
            <h2
              className={classNames(
                'm-0 font-sans text-[22px] leading-[28px] font-semibold text-white',
                HEAD_FONT
              )}
            >
              {PITCH_CAMERA.permissionTitle}
            </h2>
            <p className="m-0 font-sans text-[15px] leading-[22px] text-white/80">
              {PITCH_CAMERA.permissionBody}
            </p>
            <PitchPrimary onClick={onAllow}>{PITCH_CAMERA.allow}</PitchPrimary>
            <button
              type="button"
              onClick={onUploadInstead}
              className="min-h-[24px] cursor-pointer border-0 bg-transparent p-0 font-sans text-[14px] leading-[17px] font-semibold text-white/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {PITCH_CAMERA.trouble}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ---------- shared: file card ---------- */
/*
 * The pitch video. `file` = { name, meta, url?, chips? }: with a url (live talent: the chosen / recorded file, or the
 * published video) the thumbnail is a real player; otherwise the drawn still. `progress` (0–100, optional) shows the
 * upload bar; `playSignal` (number) plays the player and scrolls to it whenever it changes ("Watch my pitch").
 */
const FileCard = ({ file, onReplace, onDelete, progress, playSignal, busy }) => {
  const videoRef = useRef(null);
  useEffect(() => {
    const v = videoRef.current;
    if (!playSignal || !v) return;
    log('play pitch', playSignal);
    v.scrollIntoView?.({ block: 'center', behavior: 'smooth' });
    v.play?.()?.catch?.((err) => log.error('play failed', err?.name));
  }, [playSignal]);
  return (
    <Card className="flex flex-col gap-3 rounded-[20px] py-[14px] pr-4 pl-[14px]">
      <div className="flex flex-wrap items-center gap-4 sm:flex-nowrap">
        {file.url ? (
          <video
            ref={videoRef}
            src={file.url}
            controls
            playsInline
            preload="metadata"
            aria-label={`Pitch video: ${file.name}`}
            className="h-[160px] w-[260px] max-w-full shrink-0 rounded-[14px] bg-[#0b1a0f] object-contain"
          />
        ) : (
          <div
            className="relative flex h-[100px] w-[160px] max-w-full shrink-0 items-center justify-center rounded-[14px] bg-[#0b1a0f] bg-cover bg-center"
            style={{ backgroundImage: `url(${cameraStill})` }}
          >
            <span className="flex size-9 items-center justify-center rounded-full bg-white text-[#387440]">
              <PitchPlayIcon className="size-4" />
            </span>
          </div>
        )}
        <div className="flex min-w-0 flex-[1_1_100%] flex-col gap-[6px] sm:flex-1">
          <span className="truncate font-sans text-[17px] leading-[20px] font-semibold text-[#1c2a21]">
            {file.name}
          </span>
          <span className="font-sans text-[14px] leading-[17px] text-[#595959]">{file.meta}</span>
          <div className="flex flex-wrap gap-[6px]">
            {(file.chips ?? PITCH_FILE.chips).map((c) => (
              <Chip key={c} tone="green">
                {c}
              </Chip>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <PitchSecondary onClick={onReplace} disabled={busy}>
            {PITCH_FILE.replace}
          </PitchSecondary>
          {onDelete ? (
            <PitchSecondary onClick={onDelete} disabled={busy}>
              Delete
            </PitchSecondary>
          ) : null}
        </div>
      </div>
      {typeof progress === 'number' ? (
        <div className="flex items-center gap-3">
          <div
            role="progressbar"
            aria-label="Uploading your pitch video"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
            className="h-2 min-w-[80px] flex-1 rounded-[4px] bg-[#ebf1ec]"
          >
            <span
              className="block h-full rounded-[4px] bg-[#387440] transition-[width]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="font-sans text-[13px] leading-[16px] font-semibold text-[#387440]">
            {progress < 100 ? `Uploading ${progress}%` : 'Saving…'}
          </span>
        </div>
      ) : null}
    </Card>
  );
};

const CheckRow = ({ done, title, sub }) => (
  <div className="flex items-start gap-3">
    <span
      className={classNames(
        'flex size-7 shrink-0 items-center justify-center rounded-full',
        done ? 'bg-[#387440] text-white' : 'border border-[#e7e7e7] bg-[#f7f8f4] text-[#595959]'
      )}
    >
      {done ? (
        <PitchCheckIcon className="size-[14px]" />
      ) : (
        <PitchInfoCircleIcon className="size-[14px]" />
      )}
    </span>
    <span className="flex min-w-0 flex-col gap-px">
      <span className="font-sans text-[14px] leading-[17px] font-semibold text-[#1c2a21]">
        {title}
      </span>
      {sub ? (
        <span className="font-sans text-[13px] leading-[16px] text-[#595959]">{sub}</span>
      ) : null}
    </span>
  </div>
);

/* ---------- PI-04 / PI-04b upload ---------- */
export const UploadBody = ({ ready, file, tabs, onBrowse, onDropFile, onReplace }) => (
  <div className="flex flex-col gap-5">
    {tabs}
    {ready ? (
      <>
        <FileCard file={file} onReplace={onReplace} />
        <Card className="flex flex-col gap-[10px] rounded-[24px] px-[22px] py-5">
          <h2 className="m-0 font-sans text-[16px] leading-[19px] font-semibold text-[#1c2a21]">
            {PITCH_SELF_CHECK.title}
          </h2>
          <div className="flex flex-col gap-[10px]">
            {PITCH_SELF_CHECK.rows.map((r) => (
              <CheckRow key={r.title} {...r} />
            ))}
          </div>
        </Card>
      </>
    ) : (
      <>
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            onDropFile(e.dataTransfer.files?.[0]);
          }}
          className="relative flex flex-col items-center gap-3 rounded-[24px] bg-[#ebf1ec] px-6 py-12 text-center"
        >
          <svg aria-hidden="true" className="pointer-events-none absolute inset-0 size-full">
            <rect
              x="1"
              y="1"
              rx="23"
              ry="23"
              fill="none"
              stroke="#387440"
              strokeWidth="2"
              strokeDasharray="8 6"
              style={{ width: 'calc(100% - 2px)', height: 'calc(100% - 2px)' }}
            />
          </svg>
          <span
            className={classNames(
              'relative flex size-[72px] items-center justify-center rounded-[22px] bg-white text-[#387440]',
              CARD_SHADOW
            )}
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-[inherit] border border-[rgba(28,42,33,0.1)] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)]"
            />
            <PitchUploadIcon className="size-8" />
          </span>
          <h2
            className={classNames(
              'm-0 font-sans text-[clamp(20px,1.56vw,27px)] leading-[1.2] font-semibold text-[#1c2a21]',
              HEAD_FONT,
              'playful:text-[#111111]'
            )}
          >
            {PITCH_UPLOAD.dropTitle}
          </h2>
          <p className="m-0 font-sans text-[15px] leading-[18px] text-[#595959]">
            {PITCH_UPLOAD.dropSub}
          </p>
          <div className="flex flex-wrap justify-center gap-[6px]">
            {PITCH_UPLOAD.formats.map((f) => (
              <Chip key={f}>{f}</Chip>
            ))}
          </div>
          <PitchPrimary size="sm" onClick={onBrowse}>
            {PITCH_UPLOAD.browse}
          </PitchPrimary>
        </div>
        <Eyebrow className="mt-1 text-[#595959]">{PITCH_UPLOAD.waysLabel}</Eyebrow>
        <div className="grid gap-3 md:grid-cols-2">
          {PITCH_UPLOAD.ways.map((w) => (
            <Card key={w.title} className="rounded-[16px] py-[14px] pr-[14px] pl-4">
              <div className="flex items-start gap-3">
                <span className="flex size-[34px] shrink-0 items-center justify-center rounded-[10px] bg-[#ebf1ec] text-[#387440]">
                  <PitchGlyph name={w.icon} className="size-[17px]" />
                </span>
                <span className="flex min-w-0 flex-col gap-[2px]">
                  <span className="font-sans text-[14px] leading-[17px] font-semibold text-[#1c2a21]">
                    {w.title}
                  </span>
                  <span className="font-sans text-[13px] leading-[19px] text-[#595959]">
                    {w.sub}
                  </span>
                </span>
              </div>
            </Card>
          ))}
        </div>
      </>
    )}
  </div>
);

/* ---------- PI-05 write ---------- */
export const WriteBody = ({ tabs, text, onText }) => {
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  return (
    <div className="flex flex-col gap-5">
      {tabs}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="pitch-written"
          className="font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#1c2a21]"
        >
          {PITCH_WRITE.label}
        </label>
        <textarea
          id="pitch-written"
          value={text}
          onChange={(e) => onText(e.target.value)}
          className={classNames(
            'min-h-[112px] w-full resize-y rounded-[10px] border border-[#cccccc] bg-white py-[14px] pr-4 pl-5 font-sans text-[14px] leading-[20px] tracking-[0.2px] text-[#595959] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
            CARD_SHADOW
          )}
        />
      </div>
      <div className="flex flex-wrap items-center gap-[14px] rounded-[14px] bg-[#ebf1ec] px-4 py-3">
        <span className="font-sans text-[14px] leading-[17px] font-bold text-[#387440]">
          {words} words
        </span>
        <span className="h-2 min-w-[80px] flex-1 rounded-[4px] bg-white" aria-hidden="true">
          <span
            className="block h-full rounded-[4px] bg-[#387440]"
            style={{ width: `${Math.min(words / 150, 1) * 100}%` }}
          />
        </span>
        <span className="font-sans text-[13px] leading-[16px] font-medium text-[#595959]">
          {PITCH_WRITE.sweet}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-[10px] rounded-[14px] bg-[#f7f8f4] px-4 py-3">
        <span className="font-sans text-[13px] leading-[16px] font-bold text-[#1c2a21]">
          {PITCH_WRITE.formula}
        </span>
        {PITCH_WRITE.parts.map((p) => (
          <Chip key={p}>{p}</Chip>
        ))}
        <Sticker className="ml-auto">{PITCH_WRITE.sticker}</Sticker>
      </div>
    </div>
  );
};

/* Review card of a written pitch (live talent who chose Write): the text and an Edit button instead of the video card. */
const WrittenCard = ({ text, onEdit, onDelete }) => (
  <Card className="flex flex-col gap-3 rounded-[20px] px-5 py-4">
    <span className="font-sans text-[14px] leading-[17px] font-semibold text-[#1c2a21]">
      {PITCH_WRITE.label}
    </span>
    <p className="m-0 font-sans text-[15px] leading-[24px] whitespace-pre-line text-[#1c2a21]">
      {text}
    </p>
    <div className="flex flex-wrap gap-2">
      <PitchSecondary onClick={onEdit}>Edit</PitchSecondary>
      {onDelete ? <PitchSecondary onClick={onDelete}>Delete</PitchSecondary> : null}
    </div>
  </Card>
);

/* ---------- PI-06 review ---------- */
/*
 * `written` (string, optional): review a written pitch instead of the video file; onReplace then reopens the editor.
 * `onDelete` (optional) adds a Delete button (a saved pitch); `progress` / `playSignal` / `busy` go to the video card;
 * `lengthRow` ({ title, sub }, optional) replaces the drawn "under 60 seconds · 0:54" check with the real length.
 */
export const ReviewBody = ({
  file,
  written,
  onReplace,
  onDelete,
  progress,
  playSignal,
  busy,
  lengthRow,
}) => (
  <div className="flex flex-col gap-5">
    {typeof written === 'string' ? (
      <WrittenCard text={written} onEdit={onReplace} onDelete={onDelete} />
    ) : (
      <FileCard
        file={file}
        onReplace={onReplace}
        onDelete={onDelete}
        progress={progress}
        playSignal={playSignal}
        busy={busy}
      />
    )}
    <Card className="flex flex-col gap-[10px] rounded-[24px] px-[22px] py-5">
      <h2 className="m-0 font-sans text-[16px] leading-[19px] font-semibold text-[#1c2a21]">
        {PITCH_READY.title}
      </h2>
      <div className="flex flex-col gap-[10px]">
        {PITCH_READY.rows.map((r, i) => {
          const row = i === 0 && lengthRow ? lengthRow : r;
          return <CheckRow key={row.title} done {...row} />;
        })}
      </div>
    </Card>
    <Card className="flex items-center gap-[14px] rounded-[18px] !bg-[#387440] py-4 pr-4 pl-5">
      <span className="flex size-[44px] shrink-0 items-center justify-center rounded-[14px] bg-white">
        <PitchTrophyIcon className="size-6" />
      </span>
      <span className="flex min-w-0 flex-col gap-[2px]">
        <span className="font-sans text-[16px] leading-[19px] font-bold text-white">
          {PITCH_READY.after.title}
        </span>
        <span className="font-sans text-[13px] leading-[16px] font-medium text-white">
          {PITCH_READY.after.sub}
        </span>
      </span>
    </Card>
  </div>
);
