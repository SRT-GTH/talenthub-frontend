import { useEffect, useId } from 'react';
import { debug } from '../../../../utils/debug.js';
import { SkillsLabCheckCircleGlyph } from '../SkillsLabDialogIcons.jsx';
import {
  ButtonRow,
  DialogHeader,
  PrimaryButton,
  SecondaryButton,
} from '../SkillsLabDialogParts.jsx';
import GameV2DialogShell from './GameV2DialogShell.jsx';
import { GvPlayIcon } from './GamesV2Icons.jsx';
import { GAME_V2_RESUME_COPY as COPY, resumeSentence } from './gamesV2Data.js';

const log = debug('GameV2ResumeDialog');

/*
 * GameV2ResumeDialog — GV-09 "Resume a saved game" (Playful 9599:41513 / Focused 9599:50022): "Pick up where you left off?"
 * 500px modal — gold play tile, body (ranked game in progress, saved N hours ago, kept for M more hours), a green note
 * ("Starting again ends this game with the rounds you’ve done.") and Resume game (secondary) / Start again (primary).
 */
const GameV2ResumeDialog = ({ game, onClose, onResume, onStartAgain }) => {
  const titleId = useId();
  useEffect(() => {
    log('mount', game.id);
  }, [game.id]);
  return (
    <GameV2DialogShell width={500} labelId={titleId} onClose={onClose}>
      <DialogHeader
        id={titleId}
        title={COPY.title}
        tileClass="bg-[#ffd86b]"
        icon={<GvPlayIcon className="size-[20px]" />}
        onClose={onClose}
      />
      <p className="m-0 font-sans text-[15px] leading-[22px] text-[#1c2a21]">
        {resumeSentence(game)}
      </p>
      <div className="flex items-start gap-[10px] rounded-[12px] bg-[#ebf1ec] p-[12px]">
        <SkillsLabCheckCircleGlyph className="mt-[-1px] size-[18px] shrink-0 text-[#387440]" />
        <span className="min-w-0 font-sans text-[13.5px] font-medium leading-[16px] text-[#2a5730]">
          {COPY.note}
        </span>
      </div>
      <ButtonRow a={230} b={198}>
        <SecondaryButton onClick={onResume}>{COPY.resume}</SecondaryButton>
        <PrimaryButton onClick={onStartAgain}>{COPY.again}</PrimaryButton>
      </ButtonRow>
    </GameV2DialogShell>
  );
};

export default GameV2ResumeDialog;
