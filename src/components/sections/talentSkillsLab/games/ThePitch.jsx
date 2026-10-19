import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import GameCompleteDialog from './personality/PersonalityDialog.jsx';
import GameShell from './personality/PersonalityChrome.jsx';
import {
  PgChatIcon,
  PgCheckCircleIcon,
  PgMicIcon,
  PgPauseIcon,
} from './personality/PersonalityIcons.jsx';
import { GameIntro } from './personality/PersonalityParts.jsx';
import { PLAY_ORDER } from './personality/personalityData.js';
import { BARS, PITCH } from './personality/thePitchData.js';
import { useCountdown } from './personality/useCountdown.js';

const log = debug('ThePitch');

/*
 * The Pitch — personality game "Creativity" (Figma SL-GP11 Recording, Playful 7943:11118 / Focused 8110:497911).
 * Route `/skills-lab/games/the-pitch?f=GP11`. Props `{ frame }`: GP11 = recording at 0:42 of 1:00 (frozen until the first press
 * of the mic button); none = a fresh pitch that starts at 0:00 and runs.
 * Loop: the clock, waveform, live captions, filler count and checklist count advance while recording; the round mic
 * button pauses / resumes; "Redo" restarts once; "Switch to typing" swaps in a text box; "Finish pitch" opens the
 * play-style dialog. ⚠️ ASSUMPTION: no real speech capture — everything above is simulated (see thePitchData.js).
 * `pitch-in-60` (skill game) shares the artwork in the catalogue but has no frame; it is NOT registered here.
 */
const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

const ThePitch = ({ frame }) => {
  const navigate = useNavigate();
  const seeded = frame === 'GP11';
  const start = seeded ? PITCH.startSeconds : 0;
  const [recording, setRecording] = useState(true);
  const [frozen, setFrozen] = useState(seeded); // the Figma frame is a still: the clock waits for the first press
  const [redoLeft, setRedoLeft] = useState(1);
  const [typing, setTyping] = useState(false);
  const [text, setText] = useState('');
  const [finished, setFinished] = useState(false);
  const [seconds, setSeconds] = useCountdown({
    from: start,
    to: PITCH.limit,
    running: recording && !frozen && !typing && !finished,
    onEnd: useCallback(() => setRecording(false), []),
  });

  useEffect(() => {
    log('mount', { frame });
  }, [frame]);

  const words = PITCH.captions.split(' ');
  const shown = Math.max(1, Math.ceil(words.length * Math.min(1, seconds / PITCH.startSeconds)));
  const captions = seconds === 0 ? '' : words.slice(0, shown).join(' ');
  const fillers = Math.floor(seconds / 21);
  const checklist = Math.min(4, Math.floor(seconds / 14));
  const played = Math.round((seconds / PITCH.limit) * BARS.length);

  const redo = () => {
    if (redoLeft < 1) return;
    log('redo');
    setRedoLeft(redoLeft - 1);
    setSeconds(0);
    setText('');
    setRecording(true);
    setFrozen(false);
  };
  const restart = () => {
    setFinished(false);
    setSeconds(0);
    setRedoLeft(1);
    setFrozen(false);
    setRecording(true);
    setTyping(false);
  };
  const next = () =>
    navigate(
      `/skills-lab/games/${PLAY_ORDER[(PLAY_ORDER.indexOf(PITCH.gameId) + 1) % PLAY_ORDER.length]}`
    );
  const arcade = () => navigate('/skills-lab?tab=games');
  const done = finished;

  return (
    <GameShell
      title={PITCH.title}
      subtitle={done ? PITCH.doneSubtitle : PITCH.subtitle}
      sticker={done ? PITCH.complete.sticker : recording ? PITCH.sticker : 'PAUSED'}
      xp={done ? PITCH.doneXp : PITCH.xp}
      progress={{
        label: 'Pitch 1 of 1',
        segments: [done ? 'done' : 'now'],
        note: done ? PITCH.doneNote : PITCH.progressNote,
      }}
      footer={
        done
          ? {
              info: PITCH.doneInfo,
              link: { label: 'Replay', onClick: restart },
              secondary: { label: 'Back to Arcade', onClick: arcade },
              action: { label: 'Play next game', onClick: next },
            }
          : {
              info: PITCH.info,
              link: {
                label: typing ? PITCH.typing.switchBack : 'Switch to typing',
                onClick: () => setTyping((t) => !t),
              },
              secondary: { label: 'Redo', onClick: redo, disabled: redoLeft < 1 },
              action: { label: 'Finish pitch', onClick: () => setFinished(true) },
            }
      }
      overlay={
        done ? (
          <GameCompleteDialog
            result={{
              ...PITCH.complete,
              stats: PITCH.complete.stats.map((s) =>
                s.label === 'PITCH LENGTH' ? { ...s, value: fmt(seconds) } : s
              ),
            }}
            onClose={arcade}
            onSecondary={arcade}
            onPrimary={next}
            onNext={next}
          />
        ) : null
      }
    >
      <GameIntro
        eyebrow={PITCH.eyebrow}
        title={PITCH.title2}
        body={PITCH.body}
        stats={[
          { icon: PgMicIcon, label: `${fmt(seconds)} of 1:00` },
          { icon: PgChatIcon, label: `Filler words: ${fillers}` },
          { icon: PgCheckCircleIcon, label: `${checklist} of 4 checklist` },
        ]}
        reads={PITCH.reads}
      />
      <section
        aria-label="Recorder"
        className="flex flex-col gap-[20px] rounded-[24px] border border-solid border-[rgba(28,42,33,0.12)] bg-white p-[clamp(16px,2.7vw,28px)]"
      >
        {typing ? (
          <label className="flex flex-col gap-[8px] font-sans">
            <span className="text-[11px] leading-[13px] font-bold text-[#595959] max-lg:text-[12px]">
              {PITCH.typing.label}
            </span>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={PITCH.typing.placeholder}
              rows={6}
              className="w-full resize-y rounded-[14px] border border-solid border-[rgba(28,42,33,0.12)] bg-[#f8f8f4] px-[18px] py-[14px] font-sans text-[16px] leading-[24px] text-[#1c2a21] outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
            />
          </label>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-x-[24px] gap-y-[16px]">
              <button
                type="button"
                onClick={() => {
                  if (frozen) {
                    setFrozen(false);
                    setRecording(false);
                  } else setRecording((r) => !r);
                }}
                aria-label={recording ? 'Pause recording' : 'Resume recording'}
                className="inline-flex size-[88px] shrink-0 cursor-pointer items-center justify-center rounded-full border border-solid border-[rgba(28,42,33,0.12)] bg-[#c0392b] text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
              >
                {recording ? (
                  <PgPauseIcon className="size-[30px]" />
                ) : (
                  <PgMicIcon className="size-[30px]" />
                )}
              </button>
              <div
                aria-hidden="true"
                className="order-last flex h-[88px] w-full min-w-0 items-center gap-[4px] overflow-hidden md:order-none md:w-auto md:flex-1"
              >
                {BARS.map((h, i) => (
                  <span
                    key={i}
                    className={classNames(
                      'w-[6px] shrink-0 rounded-[3px]',
                      i < played ? 'bg-[#387440]' : 'bg-[#d9d9d1]'
                    )}
                    style={{ height: h }}
                  />
                ))}
              </div>
              <div className="ml-auto flex flex-col items-end font-sans">
                <span className="font-sans text-[34px] leading-[41px] font-semibold tracking-[-0.01em] text-[#1c2a21] playful:font-heading">
                  {fmt(seconds)}
                </span>
                <span className="text-[13px] leading-[16px] font-semibold text-[#595959] max-lg:text-[13px]">
                  of 1:00
                </span>
              </div>
            </div>
            <div className="flex min-h-[95px] flex-col gap-[6px] rounded-[14px] bg-[#f8f8f4] px-[18px] py-[14px] font-sans">
              <span className="text-[11px] leading-[13px] font-bold text-[#595959] max-lg:text-[12px]">
                {PITCH.captionsLabel}
              </span>
              <p
                className="m-0 text-[16px] leading-[24px] font-normal text-[#1c2a21]"
                aria-live="off"
              >
                {captions}
              </p>
            </div>
          </>
        )}
      </section>
    </GameShell>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const GAMES = { 'the-pitch': ThePitch };

export default ThePitch;
