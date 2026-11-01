import { useEffect, useId } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { FOCUS_RING, HEADING } from '../skillsLabDialogUtils.js';
import GameV2Button from './GameV2Button.jsx';
import GameV2CategoryChip from './GameV2CategoryChip.jsx';
import GameV2DialogShell from './GameV2DialogShell.jsx';
import GameV2LevelPicker from './GameV2LevelPicker.jsx';
import GameV2ModePicker from './GameV2ModePicker.jsx';
import GameV2Tile from './GameV2Tile.jsx';
import GameV2VerifiesChip from './GameV2VerifiesChip.jsx';
import {
  GvArrowIcon,
  GvClockIcon,
  GvCloseIcon,
  GvLockIcon,
  GvShieldIcon,
} from './GamesV2Icons.jsx';
import {
  GAME_V2_DETAILS_COPY as COPY,
  GAMES_V2_COPY,
  SKILL_BLURBS,
  verifiableSkills,
} from './gamesV2Data.js';

const log = debug('GameV2DetailsDialog');

/*
 * GameV2DetailsDialog — GV-02 "Game details · Memory Match" (Playful 9599:36707 / Focused 9599:45338) and GV-03 "Ranked on
 * cooldown" (9599:38594 / 9599:47164): 640px panel over the hub with the game's header (tile, title, category · minutes ·
 * "Verifies skills" chips, close), HOW TO PLAY, WHAT IT MEASURES + SKILLS IT CAN VERIFY, CHOOSE A LEVEL, HOW DO YOU WANT TO PLAY?
 * (Ranked / Practice), the fair-play note and the footer (Back to games · Start ranked game / Start practice game).
 * Controlled by the URL (the layer owns `mode` / `level`); `cooldown` disables Ranked and the CTA starts a practice game.
 * Games with no ranked score (Makola Haggle, a play style game) and one-level games drop the pieces that do not apply.
 */
const LABEL =
  'm-0 font-sans text-[12px] font-bold uppercase leading-[14px] tracking-[0.06em] text-[#6b706e]';

const Section = ({ label, children }) => (
  <div className="flex min-w-0 flex-col gap-[10px]">
    <h3 className={LABEL}>{label}</h3>
    {children}
  </div>
);

const GameV2DetailsDialog = ({
  game,
  mode,
  level,
  cooldown,
  opensAt,
  onMode,
  onLevel,
  onClose,
  onStart,
}) => {
  const titleId = useId();
  const playStyle = game.kind === 'playstyle';
  const verifiable = verifiableSkills(game);
  useEffect(() => {
    log('mount', { game: game.id, mode, level, cooldown, playStyle });
  }, [game.id, mode, level, cooldown, playStyle]);

  const cta = playStyle
    ? COPY.startPlayStyle
    : mode === 'ranked'
      ? COPY.startRanked
      : COPY.startPractice;

  return (
    <GameV2DialogShell variant="panel" width={640} labelId={titleId} onClose={onClose}>
      <div className="flex items-start gap-[16px]">
        <GameV2Tile game={game} size={72} />
        <div className="flex min-w-0 flex-1 flex-col gap-[8px] pt-[2px]">
          <h2
            id={titleId}
            className={classNames(
              HEADING,
              'm-0 text-[clamp(22px,5.5vw,26px)] font-semibold leading-[1.2] text-[#1c2a21] playful:text-[clamp(24px,6vw,28px)]'
            )}
          >
            {game.title}
          </h2>
          <div className="flex flex-wrap items-center gap-[8px]">
            <GameV2CategoryChip category={game.category} />
            <span className="inline-flex items-center gap-[5px] rounded-full bg-[#f2f5f4] px-[10px] py-[4px] font-sans text-[12px] font-semibold leading-[14px] text-[#6b6b6b]">
              <GvClockIcon className="size-[13px] shrink-0" />
              {game.minutes}
            </span>
            <GameV2VerifiesChip
              label={playStyle ? GAMES_V2_COPY.playStyleChip : GAMES_V2_COPY.verifies}
              playStyle={playStyle}
            />
          </div>
        </div>
        <button
          type="button"
          aria-label={COPY.close}
          onClick={onClose}
          className={classNames(
            'flex size-[34px] shrink-0 cursor-pointer self-center items-center justify-center rounded-full border border-solid border-[#dee5e0] bg-white p-0 text-[#1c2a21] playful:size-[35px] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)]',
            FOCUS_RING
          )}
        >
          <GvCloseIcon className="size-[16px]" />
        </button>
      </div>

      <Section label={COPY.howToPlay}>
        <ol className="m-0 flex list-none flex-col gap-[10px] p-0">
          {game.howToPlay.map((step, i) => (
            <li key={step} className="flex items-start gap-[12px]">
              <span
                aria-hidden="true"
                className="flex size-[24px] shrink-0 items-center justify-center rounded-full bg-[#e2f1e4] font-sans text-[12px] font-bold leading-[14px] text-[#27522e]"
              >
                {i + 1}
              </span>
              <span className="min-w-0 pt-[1.5px] font-sans text-[14px] leading-[21px] text-[#1c2a21]">
                {step}
              </span>
            </li>
          ))}
        </ol>
      </Section>

      {game.measures.length > 0 && (
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2">
          <Section label={COPY.measures}>
            <ul className="m-0 flex list-none flex-col gap-[10px] p-0">
              {game.measures.map((skill) => (
                <li key={skill} className="flex flex-col gap-[2px]">
                  <span className="font-sans text-[14px] font-semibold leading-[17px] text-[#1c2a21]">
                    {skill}
                  </span>
                  <span className="font-sans text-[12.5px] leading-[17px] text-[#6b6b6b]">
                    {SKILL_BLURBS[skill]}
                  </span>
                </li>
              ))}
            </ul>
          </Section>
          {verifiable.length > 0 && (
            <Section label={COPY.verify}>
              <div className="flex flex-wrap gap-[8px]">
                {verifiable.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-[5px] rounded-full bg-[#e2f1e4] px-[10px] py-[4px] font-sans text-[12px] font-semibold leading-[14px] text-[#27522e]"
                  >
                    <GvShieldIcon className="size-[13px] shrink-0" />
                    {skill}
                  </span>
                ))}
              </div>
              <p className="m-0 font-sans text-[12.5px] leading-[17px] text-[#6b6b6b]">
                {COPY.verifyNote}
              </p>
            </Section>
          )}
        </div>
      )}

      {game.levels.length > 0 && (
        <Section label={COPY.level}>
          <GameV2LevelPicker levels={game.levels} value={level} onChange={onLevel} />
        </Section>
      )}

      {!playStyle && (
        <Section label={COPY.mode}>
          <GameV2ModePicker mode={mode} onChange={onMode} cooldown={cooldown} opensAt={opensAt} />
        </Section>
      )}

      {!playStyle && (
        <div className="flex items-start gap-[10px] rounded-[12px] bg-[#f2f5f4] p-[12px]">
          <GvLockIcon className="mt-[2px] size-[16px] shrink-0 text-[#6b706e]" />
          <p className="m-0 min-w-0 font-sans text-[12.5px] leading-[18px] text-[#6b6b6b]">
            {COPY.fair}
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-[12px] max-sm:flex-col-reverse max-sm:items-stretch">
        <GameV2Button variant="secondary" onClick={onClose}>
          {COPY.back}
        </GameV2Button>
        <GameV2Button
          grow
          trailing={<GvArrowIcon className="size-[18px] shrink-0" />}
          onClick={onStart}
        >
          {cta}
        </GameV2Button>
      </div>
    </GameV2DialogShell>
  );
};

export default GameV2DetailsDialog;
