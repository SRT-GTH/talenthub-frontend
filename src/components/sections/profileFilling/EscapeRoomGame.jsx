import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Button from '../../ui/Button.jsx';
import { debug } from '../../../utils/debug.js';
import {
  PersonalityGamesIcon,
  ClockIcon,
  SaveIcon,
  SuccessCheckIcon,
} from '../../shared/assets.jsx';
import stage1Bg from '../../../assets/games/escape-room/stage-1-the-room.png';
import stage2Bg from '../../../assets/games/escape-room/stage-2-investigating.png';
import stage3Bg from '../../../assets/games/escape-room/stage-3-getting-warmer.png';
import stage4Bg from '../../../assets/games/escape-room/stage-4-final-door.png';

const log = debug('EscapeRoomGame');

/*
 * EscapeRoomGame — the actual playable 4-stage branching-narrative
 * interaction (Figma 5132:61730 → 62092 → 62454 → 62816), reached from
 * GameStoreModal's "Let's Play →". This is the piece explicitly deferred
 * in the earlier Store+Details pass; built once the user supplied the
 * real illustrated background art (5 PNGs, copied into
 * src/assets/games/escape-room/) and its exact copy was confirmed via
 * get_screenshot(contentsOnly: true) per stage — get_metadata on these
 * specific nodes returned an unrelated cached frame, so the screenshot
 * was the only reliable source here.
 *
 * Narrator line, stage label, and all choice text are verbatim from
 * Figma. Choice BUBBLE POSITIONS are eyeballed percentages from each
 * stage's screenshot (Figma scatters them to sit near relevant objects
 * in that stage's illustration) — decorative placement, not sacred text,
 * so an approximate match is acceptable where exact px wasn't available.
 *
 * Any choice advances to the next stage — Figma's own copy is explicit
 * that "there are no wrong answers... your decisions are tracked not
 * your score" (Game Details, 5132:61301), so this doesn't branch the
 * narrative differently per choice or grade anything.
 */

const ESCAPE_ROOM_STAGES = [
  {
    label: 'Stage 1 — The room',
    background: stage1Bg,
    narrator: 'You just entered the room. What do you do first?',
    choices: [
      { letter: 'A', text: 'Go straight to the cabinet', position: { left: '84%', top: '28%' } },
      { letter: 'B', text: 'Examine the desk first', position: { left: '57%', top: '66%' } },
      { letter: 'C', text: 'Check the door behind you', position: { left: '19%', top: '53%' } },
      {
        letter: 'D',
        text: 'Stand still and take it all in',
        position: { left: '32%', top: '94%' },
      },
    ],
  },
  {
    label: 'Stage 2 — Investigating',
    background: stage2Bg,
    narrator: 'Drawer B is open. What do you do next?',
    choices: [
      { letter: 'A', text: 'Reach inside Drawer B', position: { left: '87%', top: '62%' } },
      { letter: 'B', text: 'Pick up the key on the floor', position: { left: '62%', top: '79%' } },
      { letter: 'C', text: 'Read the logbook first', position: { left: '51%', top: '63%' } },
      { letter: 'D', text: 'Check the note on the wall', position: { left: '86%', top: '28%' } },
    ],
  },
  {
    label: 'Stage 3 — Getting warmer',
    background: stage3Bg,
    narrator: 'You have the key. What do you tackle next?',
    choices: [
      { letter: 'A', text: 'Try the key on the door now', position: { left: '19%', top: '58%' } },
      { letter: 'B', text: 'Study the logbook diagram', position: { left: '52%', top: '63%' } },
      { letter: 'C', text: 'Figure out the combo lock', position: { left: '67%', top: '41%' } },
      { letter: 'D', text: 'Re-read the note on the wall', position: { left: '86%', top: '28%' } },
    ],
  },
  {
    label: 'Stage 4 — Final door',
    background: stage4Bg,
    narrator: 'The door is unlocked. What do you do?',
    // Only 3 choices — Figma's stage 4 doesn't have a 4th bubble.
    choices: [
      { letter: 'A', text: 'Push it open immediately', position: { left: '20%', top: '66%' } },
      { letter: 'B', text: 'Listen at the door first', position: { left: '22%', top: '33%' } },
      { letter: 'C', text: 'Look back one more time', position: { left: '67%', top: '41%' } },
    ],
  },
];

const GAME_DURATION_SECONDS = 5 * 60;

const formatTime = (totalSeconds) => {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
};

// Hover state (Figma 5132:62077, "hover state" annotation): the bubble's
// dark solid fill turns into a frosted, semi-transparent white/green
// glass look with a blurred backdrop, and the text darkens from white to
// the brand-green-darker ink. Figma's actual asset is a rotated speech-
// bubble shape with a directional tail (pointing toward whichever side
// of the illustration the bubble sits closest to) — reproducing that
// exact tail geometry per bubble was out of scope here; this keeps the
// existing simplified pill shape but matches the real color/blur shift.
const ChoiceBubble = ({ choice, onSelect }) => (
  <button
    type="button"
    onClick={() => onSelect(choice)}
    style={{
      left: choice.position.left,
      top: choice.position.top,
      transform: 'translate(-50%, -50%)',
    }}
    className="group absolute max-w-[260px] rounded-full bg-black/70 px-[16px] py-[8px] text-left shadow-lg backdrop-blur-none transition-all duration-150 hover:bg-white/60 hover:backdrop-blur-[5px]"
  >
    <span className="font-sans text-[14px] text-white transition-colors group-hover:text-[#142916]">
      {choice.letter}. {choice.text}
    </span>
  </button>
);

const EscapeRoomGame = ({ open, onExit }) => {
  const [stageIndex, setStageIndex] = useState(0);
  const [complete, setComplete] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(GAME_DURATION_SECONDS);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    log('open');
    setStageIndex(0);
    setComplete(false);
    setSecondsLeft(GAME_DURATION_SECONDS);

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    // No body-scroll lock of its own: this game only ever opens while
    // GameStoreModal (which already owns that lock via ui/Modal.jsx) is
    // still open underneath it. A second independent save/restore here
    // raced with Modal's own — closing both at once, whichever cleanup
    // ran last won, and could leave body.style.overflow stuck on
    // 'hidden' even after everything closed (each one's "previous value"
    // was captured while the OTHER had already mutated it).

    return () => {
      clearInterval(intervalRef.current);
      log('close');
    };
  }, [open]);

  if (!open) return null;

  const handleSelectChoice = (choice) => {
    log('branch', { stage: stageIndex + 1, choiceSelected: choice.letter });
    if (stageIndex < ESCAPE_ROOM_STAGES.length - 1) {
      setStageIndex((i) => i + 1);
    } else {
      clearInterval(intervalRef.current);
      setComplete(true);
    }
  };

  const stage = ESCAPE_ROOM_STAGES[stageIndex];

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="The Escape Room"
      className="fixed inset-0 z-[60] bg-black"
    >
      {complete ? (
        <div className="flex size-full flex-col items-center justify-center gap-[16px] bg-[#142916] px-6 text-center">
          <SuccessCheckIcon />
          <h2 className="font-display text-[28px] text-white">You made it out ✅</h2>
          <p className="max-w-[420px] font-sans text-[15px] text-[#ebf1ec]">
            Nice work — your choices in there have been noted. Head back to your Talent Profile
            Panel and confirm your Personality section whenever you're ready.
          </p>
          <button
            type="button"
            onClick={onExit}
            className="mt-[8px] rounded-[100px] bg-white px-[24px] py-[10px] font-sans text-[14px] font-medium text-[#142916] hover:bg-[#ebf1ec]"
          >
            Close
          </button>
        </div>
      ) : (
        <div
          className="relative size-full bg-cover bg-center"
          style={{ backgroundImage: `url(${stage.background})` }}
        >
          <div className="absolute left-[24px] top-[24px] flex items-center gap-[8px] rounded-[10px] bg-black/60 px-[12px] py-[8px]">
            <PersonalityGamesIcon className="size-[20px]" />
            <span className="font-sans text-[14px] font-semibold text-white">The Escape Room</span>
          </div>

          <div className="absolute left-1/2 top-[24px] flex -translate-x-1/2 items-center gap-[6px] rounded-full bg-black/70 px-[16px] py-[8px] text-white">
            <ClockIcon className="size-[16px]" />
            <span className="font-sans text-[14px] font-medium tabular-nums">
              {formatTime(secondsLeft)}
            </span>
          </div>

          {/* Shared Button `gold` variant (Figma 5132:62062) — a brighter
              amber than the `secondary` variant's muted accent token, so
              it's its own variant rather than reusing (and misrepresenting)
              `secondary`. */}
          <Button
            variant="gold"
            size="sm"
            className="!absolute !right-[24px] !top-[24px] !py-[10px]"
            leftIcon={<SaveIcon className="size-full" />}
            onClick={onExit}
          >
            Save & Exit
          </Button>

          <div className="absolute left-1/2 top-[16%] w-[min(90%,560px)] -translate-x-1/2 rounded-full bg-black/70 px-[20px] py-[10px] text-center font-sans text-[16px] text-white">
            {stage.narrator}
          </div>

          {stage.choices.map((choice) => (
            <ChoiceBubble key={choice.letter} choice={choice} onSelect={handleSelectChoice} />
          ))}

          <div className="absolute bottom-[24px] right-[24px] rounded-[10px] bg-black/60 px-[12px] py-[6px] font-sans text-[13px] text-white">
            {stage.label}
          </div>
        </div>
      )}
    </div>,
    document.body
  );
};

export default EscapeRoomGame;
