import { useCallback, useEffect, useRef, useState } from 'react';
import Button from '../../ui/Button.jsx';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import {
  ProfilePitchPlayLargeIcon,
  TalentSidebarProfileAvatarIllustration,
} from '../../shared/assets.jsx';
import { PITCH_AX } from './ProfilePitchAccessibilityData.js';
import {
  PitchAiIcon,
  PitchArrowLeftIcon,
  PitchFullscreenIcon,
  PitchPauseIcon,
} from './PitchAccessibilityIcons.jsx';
import { EditButton, HeadLink, ProfileChip } from './ProfileTabsUi.jsx';
import { CARD_PLAIN, PAD, TITLE } from './profileTabsStyles.js';

const log = debug('ProfilePitchAccessibility');

const FOCUS =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';
const TICK_MS = 250;
// ⚠️ ASSUMPTION: Figma draws only "1×"; the cycle values are ours.
const SPEEDS = [1, 1.25, 1.5, 2];
const SKIP = 5;

const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
const lineAt = (t) => {
  let idx = 0;
  PITCH_AX.lines.forEach((l, i) => {
    if (t >= l.at) idx = i;
  });
  return idx;
};

/* One 44px control of the dark bar (Figma "control · *"): ink face, green when on. */
const Ctl = ({ on, className, children, ...rest }) => (
  <button
    type="button"
    className={classNames(
      'flex h-[44px] min-w-[44px] shrink-0 cursor-pointer items-center justify-center rounded-[10px] px-[12px] text-[13px] leading-[normal] font-semibold transition-opacity hover:opacity-90',
      on ? 'bg-[#387440] text-white' : 'bg-[#1c2a21] text-[#e6e6e6]',
      FOCUS,
      className
    )}
    {...rest}
  >
    {children}
  </button>
);

const Kbd = ({ children }) => (
  <kbd className="inline-flex h-[21px] items-center gap-[5px] rounded-[6px] border border-[#bfbfbf] bg-white px-[7px] font-[inherit] text-[11px] leading-[normal] font-semibold text-[#1c2a21] max-lg:text-[12px]">
    {children}
  </kbd>
);

const KeyHint = () => (
  <ul className="flex flex-wrap items-center gap-x-[14px] gap-y-[8px]">
    {PITCH_AX.hint.map((h) => (
      <li key={h.label} className="flex items-center gap-[6px]">
        <Kbd>
          {h.keys[0] === 'arrows' ? (
            <>
              <PitchArrowLeftIcon className="size-[13px]" />
              <span aria-hidden="true">→</span>
            </>
          ) : (
            h.keys[0]
          )}
        </Kbd>
        <span className="text-[12px] leading-[normal] text-[#595959]">{h.label}</span>
      </li>
    ))}
  </ul>
);

const lineRowClass = (active) =>
  classNames(
    'flex w-full cursor-pointer items-start gap-[14px] rounded-[10px] px-[10px] py-[8px] text-left',
    active ? 'border-l-[3px] border-[#c8951a] bg-[#faf4e8]' : 'hover:bg-[#f8f8f4]',
    FOCUS
  );

const TranscriptCard = ({ active, onSeek }) => {
  const p = PITCH_AX;
  const download = () => {
    log('download transcript');
    try {
      const body = p.lines.map((l) => `${fmt(l.at)} ${l.text}`).join('\n');
      const url = URL.createObjectURL(new Blob([body], { type: 'text/plain' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'transcript.txt';
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      log.error('download failed', e);
    }
  };
  return (
    <section
      id="pitch-transcript"
      aria-label={p.transcriptTitle}
      className={classNames(CARD_PLAIN, 'flex min-w-0 flex-col gap-[10px] overflow-hidden', PAD)}
    >
      <header className="flex flex-wrap items-center gap-x-[10px] gap-y-[8px]">
        <h2 className={TITLE}>{p.transcriptTitle}</h2>
        <span aria-hidden="true" className="h-px min-w-px flex-1" />
        <ProfileChip>{p.transcriptChip}</ProfileChip>
        <HeadLink onClick={download}>{p.download}</HeadLink>
      </header>
      <ol className="flex flex-col gap-[10px]">
        {p.lines.map((l, i) => {
          const isActive = i === active;
          return (
            <li key={l.at}>
              <button
                type="button"
                aria-current={isActive ? 'true' : undefined}
                onClick={() => onSeek(l.at)}
                className={lineRowClass(isActive)}
              >
                <span
                  className={classNames(
                    'w-[34px] shrink-0 pt-px text-[12px] leading-[14px] font-semibold',
                    isActive ? 'text-[#785910]' : 'text-[#387440]'
                  )}
                >
                  {fmt(l.at)}
                </span>
                <span
                  className={classNames(
                    'min-w-0 flex-1 text-[14px] leading-[17px] max-lg:text-[14px]',
                    isActive ? 'font-semibold text-[#1c2a21]' : 'text-[#595959]'
                  )}
                >
                  {l.text}
                </span>
                {l.twi ? (
                  <ProfileChip tone="green" className="-my-[8px] self-center">
                    {p.twiTag}
                  </ProfileChip>
                ) : null}
              </button>
            </li>
          );
        })}
      </ol>
    </section>
  );
};

/*
 * ProfilePitchAccessibility — AX-05 (Figma Playful 7591:3047 / Focused 8110:392527, `?ax=pitch`).
 * Replaces the About tab's pitch poster card with the captioned player card + a transcript card.
 * The player is a mock (no video file): a setInterval timeline drives time, captions and the active
 * transcript line. Props: none. Transcript stacks under the player at every width (own layout, narrow).
 */
const ProfilePitchAccessibility = () => {
  const p = PITCH_AX;
  const [t, setT] = useState(p.startAt);
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(0);
  const [cc, setCc] = useState(true);
  const [ad, setAd] = useState(false);
  const [showTranscript, setShowTranscript] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    log('mount', { startAt: p.startAt, duration: p.duration });
  }, [p.startAt, p.duration]);

  useEffect(() => {
    if (!playing) return undefined;
    const id = setInterval(() => {
      setT((prev) => {
        const next = prev + (TICK_MS / 1000) * SPEEDS[speed];
        if (next >= p.duration) {
          log('ended');
          setPlaying(false);
          return p.duration;
        }
        return next;
      });
    }, TICK_MS);
    return () => clearInterval(id);
  }, [playing, speed, p.duration]);

  const seek = useCallback(
    (to) => {
      const v = Math.max(0, Math.min(p.duration, to));
      log('seek', v);
      setT(v);
    },
    [p.duration]
  );
  const toggle = () => {
    log('play/pause ->', !playing);
    if (!playing && t >= p.duration) setT(0);
    setPlaying((v) => !v);
  };
  const cycleSpeed = () => {
    const n = (speed + 1) % SPEEDS.length;
    log('speed', SPEEDS[n]);
    setSpeed(n);
  };
  const toggleCc = () => {
    log('captions ->', !cc);
    setCc((v) => !v);
  };
  const toggleTranscript = () => {
    log('transcript ->', !showTranscript);
    setShowTranscript((v) => !v);
  };
  const toggleAd = () => {
    log('audio description ->', !ad, '(no track in mock)');
    setAd((v) => !v);
  };
  const fullscreen = () => {
    log('fullscreen');
    try {
      const el = videoRef.current;
      if (document.fullscreenElement) document.exitFullscreen?.();
      else el?.requestFullscreen?.();
    } catch (e) {
      log.error('fullscreen failed', e);
    }
  };

  const onKey = (e) => {
    if (e.target !== e.currentTarget || e.altKey || e.ctrlKey || e.metaKey) return;
    const k = e.key.toLowerCase();
    const map = {
      ' ': toggle,
      c: toggleCc,
      t: toggleTranscript,
      d: toggleAd,
      arrowleft: () => seek(t - SKIP),
      arrowright: () => seek(t + SKIP),
    };
    if (map[k]) {
      e.preventDefault();
      map[k]();
    }
  };
  const onScrub = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    seek(((e.clientX - r.left) / r.width) * p.duration);
  };
  const onScrubKey = (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      e.stopPropagation();
      seek(t + (e.key === 'ArrowRight' ? SKIP : -SKIP));
    }
  };

  const active = lineAt(t);
  const pct = (t / p.duration) * 100;
  const caption = `“${p.lines[active].text}”`;
  const speedLabel = `${SPEEDS[speed]}×`;

  return (
    <>
      <section
        aria-label={p.title}
        className={classNames(CARD_PLAIN, 'flex min-w-0 flex-col gap-[16px] overflow-hidden', PAD)}
      >
        <header className="flex items-center gap-[10px]">
          <h2 className={classNames(TITLE, 'min-w-0 truncate')}>{p.title}</h2>
          <span aria-hidden="true" className="h-px min-w-px flex-1" />
          <HeadLink onClick={() => log('re-record pitch (no backend)')}>{p.link}</HeadLink>
          <EditButton label="Edit pitch" onClick={() => log('edit pitch (no backend)')} />
        </header>

        <div
          ref={videoRef}
          tabIndex={0}
          role="group"
          aria-label={p.title}
          onKeyDown={onKey}
          className={classNames(
            'relative flex min-h-[200px] w-full flex-col items-center gap-[12px] overflow-hidden rounded-[16px] border border-[rgba(28,42,33,0.1)] bg-[#2d5d33] px-[12px] pt-[20px] pb-[12px] @2xl:block @2xl:h-[clamp(240px,17.4vw,300px)] @2xl:p-0',
            FOCUS
          )}
        >
          <div className="relative size-[clamp(130px,13.9vw,240px)] shrink-0 @2xl:absolute @2xl:top-[13%] @2xl:left-1/2 @2xl:-translate-x-1/2">
            <span className="absolute inset-0 block overflow-hidden rounded-full bg-[#387440] playful:bg-[linear-gradient(135deg,#387440_14.6%,#7aa870_85.3%)]">
              <TalentSidebarProfileAvatarIllustration className="absolute -top-[6.45%] -left-[5.6%] block h-auto w-[111.3%] max-w-none" />
            </span>
          </div>
          {!playing ? (
            <button
              type="button"
              aria-label="Play pitch"
              onClick={toggle}
              className={classNames(
                'absolute top-[8%] left-1/2 block size-[clamp(48px,4.2vw,72px)] -translate-x-1/2 cursor-pointer rounded-full @2xl:top-[26%]',
                FOCUS
              )}
            >
              <ProfilePitchPlayLargeIcon className="pointer-events-none absolute top-[-19.44%] left-[-33.33%] block size-[166.7%] max-w-none" />
            </button>
          ) : null}
          {cc ? (
            <p className="rounded-[10px] bg-[#1c2a21] px-[16px] py-[10px] text-center text-[clamp(14px,1.04vw,18px)] leading-[normal] font-medium text-white @2xl:absolute @2xl:bottom-[20px] @2xl:left-1/2 @2xl:w-max @2xl:max-w-[calc(100%-24px)] @2xl:-translate-x-1/2">
              {caption}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-[10px] rounded-[14px] bg-[#1c2a21] px-[10px] py-[8px]">
          <Ctl
            onClick={toggle}
            aria-label={playing ? 'Pause' : 'Play pitch'}
            aria-pressed={playing}
            className="w-[44px] px-0"
          >
            {playing ? (
              <PitchPauseIcon className="size-[14px]" />
            ) : (
              <span aria-hidden="true" className="text-[14px]">
                ▶
              </span>
            )}
          </Ctl>
          <span
            role="timer"
            className="shrink-0 text-[13px] leading-[16px] font-medium whitespace-nowrap text-[#e6e6e6] max-lg:text-[12px]"
          >
            {fmt(t)} / {fmt(p.duration)}
          </span>
          <div
            role="slider"
            tabIndex={0}
            aria-label={`${fmt(t)} / ${fmt(p.duration)}`}
            aria-valuemin={0}
            aria-valuemax={p.duration}
            aria-valuenow={Math.floor(t)}
            aria-valuetext={`${fmt(t)} / ${fmt(p.duration)}`}
            onClick={onScrub}
            onKeyDown={onScrubKey}
            className={classNames(
              'relative order-last flex h-[24px] min-w-[120px] basis-full cursor-pointer items-center @2xl:order-none @2xl:basis-0 @2xl:flex-1',
              FOCUS
            )}
          >
            <span className="relative block h-[6px] w-full rounded-full bg-[#595959]">
              <span
                className="absolute inset-y-0 left-0 block rounded-full bg-[#387440]"
                style={{ width: `${pct}%` }}
              />
              <span
                className="absolute top-1/2 block size-[16px] -translate-y-1/2 rounded-full bg-white"
                style={{ left: `calc((100% - 16px) * ${pct / 100})` }}
              />
            </span>
          </div>
          <Ctl onClick={cycleSpeed} aria-label={speedLabel}>
            {speedLabel}
          </Ctl>
          <Ctl onClick={toggleCc} on={cc} aria-pressed={cc} aria-label="CC On">
            {cc ? 'CC On' : 'CC'}
          </Ctl>
          <Ctl onClick={toggleAd} on={ad} aria-pressed={ad} aria-label="AD">
            AD
          </Ctl>
          <Ctl
            onClick={toggleTranscript}
            on={showTranscript}
            aria-pressed={showTranscript}
            aria-controls="pitch-transcript"
            aria-label="Transcript"
          >
            Transcript
          </Ctl>
          <Ctl onClick={fullscreen} aria-label="Fullscreen" className="w-[44px] px-0">
            <PitchFullscreenIcon className="size-[14px]" />
          </Ctl>
        </div>

        <KeyHint />

        <div className="flex flex-wrap items-center gap-[12px] rounded-[14px] border border-[#c8951a] bg-[#faf4e8] px-[14px] py-[12px]">
          <PitchAiIcon className="size-[17px] shrink-0" />
          <div className="flex min-w-[200px] flex-1 flex-col gap-[2px]">
            <p className="text-[14px] leading-[17px] font-semibold text-[#1c2a21]">
              {p.notice.title}
            </p>
            <p className="text-[12px] leading-[14px] text-[#463409]">{p.notice.body}</p>
          </div>
          <Button variant="tertiary" size="sm" onClick={() => log('review captions (no backend)')}>
            {p.notice.action}
          </Button>
        </div>
      </section>

      {showTranscript ? <TranscriptCard active={active} onSeek={seek} /> : null}
    </>
  );
};

export default ProfilePitchAccessibility;
