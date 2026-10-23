import { classNames } from '../../../../utils/classNames.js';
import LiveCaptionsCard from './LiveCaptionsCard.jsx';
import CaptionWords from './CaptionWords.jsx';
import CaptionsToggle from './CaptionsToggle.jsx';
import InterruptChip from './InterruptChip.jsx';
import InterruptNote from './InterruptNote.jsx';
import YourTurnSticker from './YourTurnSticker.jsx';
import { VOICE_COPY } from './voiceCaptionData.js';

/*
 * What sits above the avatars during a call, by scene (see useCaptionScene):
 *   you       VC-01  You card, "Listening", grey-words note             9149:83054
 *   buddy     VC-02  Tali · Buddy card, "Speaking", words revealed      9149:83511
 *   off       VC-05  "Captions off · tap to show" pill                  9149:84847
 *   interrupt VC-06  "Tali paused" chip + You card + YOUR TURN sticker   9151:2
 *   pause     VC-06b dark tooltip + paused Buddy card + You card         9152:2
 * Gaps from the frames: card -> avatars 40, pill -> avatars 24, tooltip -> card 10, card -> card 14, chip -> card 12.
 */
const YouCard = ({ you, note, onToggleCaptions, withSticker = false }) => (
  <div className="relative flex w-full justify-center">
    {withSticker ? <YourTurnSticker /> : null}
    <LiveCaptionsCard
      speaker="you"
      state="listening"
      note={note}
      onToggleCaptions={onToggleCaptions}
    >
      <CaptionWords solid={you.solid} grey={you.grey} tone="you" />
    </LiveCaptionsCard>
  </div>
);

const VoiceCaptionsStack = ({ scene, onToggleCaptions, onResume }) => {
  if (!scene) return null;
  const { kind } = scene;
  let body = null;
  if (kind === 'you') {
    body = (
      <YouCard you={scene.you} note={VOICE_COPY.greyNote} onToggleCaptions={onToggleCaptions} />
    );
  } else if (kind === 'buddy') {
    body = (
      <LiveCaptionsCard speaker="buddy" state="speaking" onToggleCaptions={onToggleCaptions}>
        <CaptionWords
          solid={scene.buddy.solid}
          current={scene.buddy.current}
          grey={scene.buddy.grey}
          tone="buddy"
        />
      </LiveCaptionsCard>
    );
  } else if (kind === 'off') {
    body = <CaptionsToggle onClick={onToggleCaptions} />;
  } else if (kind === 'interrupt') {
    body = (
      <>
        <InterruptChip quote={scene.quote} onResume={onResume} />
        <YouCard
          you={scene.you}
          note={VOICE_COPY.interruptNote}
          onToggleCaptions={onToggleCaptions}
          withSticker
        />
      </>
    );
  } else if (kind === 'pause') {
    body = (
      <>
        <InterruptNote />
        <LiveCaptionsCard speaker="buddy" state="paused" dimmed onToggleCaptions={onToggleCaptions}>
          <CaptionWords solid={scene.buddyLine} small />
        </LiveCaptionsCard>
        <YouCard you={scene.you} onToggleCaptions={onToggleCaptions} />
      </>
    );
  }
  if (!body) return null;
  return (
    <div
      data-voice-scene={kind}
      className={classNames(
        'flex w-full flex-col items-center',
        kind === 'interrupt' ? 'gap-[12px]' : 'gap-[10px]',
        kind === 'pause' && '[&>section:nth-of-type(1)]:mb-[4px]',
        kind === 'off' ? 'mb-[24px]' : 'mb-[40px]'
      )}
    >
      {body}
    </div>
  );
};

export default VoiceCaptionsStack;
