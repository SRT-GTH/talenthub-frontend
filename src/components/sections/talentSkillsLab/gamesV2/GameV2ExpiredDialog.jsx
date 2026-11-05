import { useEffect, useId } from 'react';
import { debug } from '../../../../utils/debug.js';
import {
  ButtonRow,
  DialogHeader,
  PrimaryButton,
  SecondaryButton,
} from '../SkillsLabDialogParts.jsx';
import GameV2DialogShell from './GameV2DialogShell.jsx';
import { GvClockIcon } from './GamesV2Icons.jsx';
import { GAME_V2_EXPIRED_COPY as COPY } from './gamesV2Data.js';

const log = debug('GameV2ExpiredDialog');

/*
 * GameV2ExpiredDialog — GV-13 "Game expired (24 h)" (Playful 9599:43542 / Focused 9599:51990): "This game has ended" 500px
 * modal — gold clock tile, one paragraph, View result (secondary) / Back to games (primary).
 */
const GameV2ExpiredDialog = ({ game, onClose, onViewResult }) => {
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
        icon={<GvClockIcon className="size-[20px]" />}
        onClose={onClose}
      />
      <p className="m-0 font-sans text-[15px] leading-[22px] text-[#1c2a21]">{COPY.body}</p>
      <ButtonRow a={230} b={198}>
        <SecondaryButton onClick={onViewResult}>{COPY.result}</SecondaryButton>
        <PrimaryButton onClick={onClose}>{COPY.back}</PrimaryButton>
      </ButtonRow>
    </GameV2DialogShell>
  );
};

export default GameV2ExpiredDialog;
