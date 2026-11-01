import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { FOCUS_RING } from '../labPlayStyles.js';
import { useGameV2Params } from './gamesV2State.js';
import {
  GAME_V2_DRAWN_PLAY_STYLE,
  GAME_V2_DRAWN_RESULT,
  GAME_V2_NAMES,
  GAME_V2_PERSONAL_BEST,
  GAME_V2_PREVIOUS_BEST,
  GAME_V2_RESULT_COPY as COPY,
  GAME_V2_TILE_ICONS,
  VERIFY_SCORE,
  isMinorFlag,
  levelLabel,
  percentileFor,
  xpFor,
} from './gamesV2ResultData.js';
import {
  GameV2InfoIcon,
  GameV2ShieldIcon,
  GameV2StarChipIcon,
  GameV2TrendChipIcon,
  GameV2TrophyChipIcon,
  GameV2WarningIcon,
} from './GameV2PlatformIcons.jsx';
import { MEMORY_ICONS } from './memoryMatch/memoryMatchIconMap.js';

const log = debug('GameV2Result');

/*
 * GameV2Result — GV-10 Result · Ranked, GV-11 Result · Ranked · under 18, GV-12 Result · Makola Haggle (play style).
 * Rendered by GameV2Page for `?view=result` INSIDE <GameV2Shell> (header + progress strip stay), body = the result card. Generic for all
 * 13 games:
 *   <GameV2Result gameId mode level frame result onBack onAgain />
 *     frame   '' | 'GV-10' | 'GV-11' | 'GV-12'    a frame code shows the drawn Figma numbers; null derives: Makola → GV-12, minor → GV-11, else GV-10
 *     result  the `finish()` payload { score, skills:[{label,value}], summary, verifies } — or null (the drawn Figma numbers)
 *             Makola Haggle (no score) reads `summary` as the "How you played" paragraph and `tags: string[]` as the chips
 *             (fallback: the skills' labels)
 *     onBack  → Games tab      onAgain → a fresh run of the same mode (ranked: "Practise again" starts a PRACTICE run, ranked is weekly)
 * Card (560 wide, 28 pad, gap 20): tile + kicker + title · score + chips · skill bars · summary · evidence · comparison · buttons.
 * Playful: r28, 1.5px ink@.55 + 4px hard shelf + soft lift, Bricolage 20 / 56. Focused: r20, 1px #dee5e0 + 0 4 16 shadow, SF 18 / 54.
 * Practice: no percentile / XP / evidence / comparison (ranked-only, ⚠️ ASSUMPTION — only the ranked result is drawn).
 */
const CARD =
  'relative mx-auto flex w-[min(560px,100%)] flex-col gap-[20px] rounded-[20px] bg-white p-[28px] font-sans max-sm:p-[20px] ' +
  'border border-solid border-[#dee5e0] shadow-[0_4px_16px_rgba(31,51,36,0.06)] ' +
  'playful:rounded-[28px] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]';
const BTN =
  'inline-flex min-h-[24px] cursor-pointer items-center justify-center rounded-[12px] px-[20px] py-[12px] font-sans text-[15px] leading-[18px] font-semibold playful:rounded-[14px] max-sm:text-[14px]';
const BTN_BACK = classNames(
  BTN,
  'border border-solid border-[#dee5e0] bg-white text-[#1c2a21] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[0_3px_0_rgba(28,42,33,0.45)]',
  FOCUS_RING
);
const BTN_PRIMARY = classNames(
  BTN,
  'min-w-0 flex-1 border-0 bg-[#387440] text-white playful:border-[1.5px] playful:border-solid playful:border-[#27522e] playful:shadow-[0_3px_0_#27522e]',
  FOCUS_RING
);
const CHIP =
  'inline-flex w-fit items-center gap-[5px] rounded-full px-[10px] py-[4px] font-sans text-[12px] leading-[14px] font-semibold';

/* the card's tile: #fef3d6, a 52px square with the game's glyph and a kente stripe at its foot */
const TileIcon = ({ gameId }) => {
  const key = GAME_V2_TILE_ICONS[gameId] ?? 'grid';
  const Glyph = key === 'warning' ? GameV2WarningIcon : MEMORY_ICONS[key];
  return (
    <span
      aria-hidden="true"
      className="relative inline-flex size-[52px] shrink-0 items-center justify-center overflow-hidden rounded-[14.56px] bg-[#fef3d6] playful:border playful:border-solid playful:border-[rgba(28,42,33,0.2)]"
    >
      <Glyph className="size-[26px] text-[#9e6e05]" />
      <span
        className="absolute inset-x-0 bottom-0 h-[8px] opacity-85"
        style={{
          background: 'linear-gradient(90deg,#d93326 0 33%,#facc40 33% 66%,#387440 66% 100%)',
        }}
      />
    </span>
  );
};

const CardHead = ({ gameId, kicker, title }) => (
  <div className="flex items-center gap-[14px]">
    <TileIcon gameId={gameId} />
    <div className="flex min-w-0 flex-col gap-[4px]">
      <p className="m-0 font-sans text-[12px] leading-[14px] font-bold tracking-[0.06em] text-[#27522e]">
        {kicker}
      </p>
      <h2 className="m-0 font-sans text-[18px] leading-[21px] font-semibold text-[#1c2a21] playful:font-heading playful:text-[20px] playful:leading-[24px]">
        {title}
      </h2>
    </div>
  </div>
);

const SkillBar = ({ label, value, shown }) => (
  <li className="flex flex-col gap-[6px]">
    <div className="flex items-center justify-between gap-[8px] font-sans text-[13.5px] leading-[16px]">
      <span className="font-semibold text-[#1c2a21]">{label}</span>
      <span className="font-bold text-[#1c2a21]">{value}</span>
    </div>
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      className="h-[8px] w-full overflow-hidden rounded-full bg-[#f2f5f4]"
    >
      <div
        className="h-full rounded-full bg-[#387440] motion-safe:transition-[width] motion-safe:duration-700"
        style={{ width: `${shown ? value : 0}%` }}
      />
    </div>
  </li>
);

/* ---------- GV-12 play-style card ---------- */
const PlayStyleCard = ({ gameId, level, read, tags, onBack, onAskBuddy }) => (
  <section aria-label="Play style result" className={CARD}>
    <CardHead
      gameId={gameId}
      kicker={COPY.playStyleKicker}
      title={`${GAME_V2_NAMES[gameId] ?? gameId} · ${levelLabel(level)}`}
    />
    <div className="flex flex-col gap-[10px] rounded-[16px] bg-[#f2f5f4] p-[16px]">
      <h2 className="m-0 font-sans text-[15px] leading-[18px] font-bold text-[#1c2a21]">
        {COPY.readTitle}
      </h2>
      <p className="m-0 font-sans text-[14px] leading-[21px] font-normal text-[#1c2a21]">{read}</p>
      <ul className="m-0 flex list-none flex-wrap gap-[8px] p-0">
        {tags.map((tag) => (
          <li key={tag} className={classNames(CHIP, 'bg-white text-[#27522e]')}>
            {tag}
          </li>
        ))}
      </ul>
    </div>
    <p className="m-0 flex items-start gap-[10px] rounded-[12px] bg-[#fef8ec] p-[12px] font-sans text-[13px] leading-[19px] font-medium text-[#8a6100]">
      <GameV2InfoIcon className="mt-[0px] size-[16px] shrink-0 text-[#8a6100]" />
      <span className="min-w-0">{COPY.playStyleNote}</span>
    </p>
    <div className="flex flex-wrap items-center gap-[12px]">
      <button type="button" onClick={onBack} className={BTN_BACK}>
        {COPY.back}
      </button>
      <button
        type="button"
        onClick={onAskBuddy}
        className={classNames(BTN_PRIMARY, 'basis-[200px]')}
      >
        {COPY.askBuddy}
      </button>
    </div>
  </section>
);

/* ---------- GV-10 / GV-11 score card ---------- */
const ScoreCard = ({ data, ranked, minor, onBack, onAgain }) => {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const id = window.requestAnimationFrame(() => setShown(true));
    return () => window.cancelAnimationFrame(id);
  }, []);
  const { gameId, level, score, skills, summary, verifies } = data;
  const evidence = ranked && verifies && score >= VERIFY_SCORE;
  const best = score > GAME_V2_PERSONAL_BEST;
  let chip = null;
  if (ranked && minor) {
    chip = {
      Icon: GameV2TrendChipIcon,
      text:
        data.minorLine ??
        (best
          ? `Your best yet · up ${score - GAME_V2_PREVIOUS_BEST} from last time`
          : `Your best so far is ${GAME_V2_PERSONAL_BEST}`),
    };
  } else if (ranked) {
    chip = {
      Icon: GameV2TrophyChipIcon,
      text: data.percentileLine ?? `Top ${percentileFor(score)}% of talents your age`,
    };
  } else {
    chip = { Icon: GameV2ShieldIcon, text: COPY.practiceNote };
  }
  const ChipIcon = chip.Icon;
  return (
    <section aria-label="Result" className={CARD}>
      <CardHead
        gameId={gameId}
        kicker={ranked ? COPY.rankedKicker : COPY.practiceKicker}
        title={`${GAME_V2_NAMES[gameId] ?? gameId} · ${levelLabel(level)}`}
      />
      <div className="flex flex-wrap items-center gap-x-[18px] gap-y-[8px]">
        <div className="flex flex-col">
          <p
            aria-label={`${score} out of 100`}
            className="m-0 font-sans text-[54px] leading-[64px] font-semibold text-[#1c2a21] playful:font-heading playful:text-[56px] playful:leading-[67px]"
          >
            {score}
          </p>
          <p className="m-0 font-sans text-[13px] leading-[16px] font-medium text-[#6b6b6b]">
            {COPY.outOf}
          </p>
        </div>
        <div className="flex min-w-0 flex-col items-start gap-[8px]">
          <p className={classNames(CHIP, 'bg-[#e2f1e4] text-[#27522e]')}>
            <ChipIcon className="size-[13px] shrink-0" />
            {chip.text}
          </p>
          {ranked ? (
            <p className={classNames(CHIP, 'bg-[#fef8ec] text-[#8a6100]')}>
              <GameV2StarChipIcon className="size-[13px] shrink-0" />+{data.xp ?? xpFor(score)} XP
            </p>
          ) : null}
        </div>
      </div>
      <ul className="m-0 flex list-none flex-col gap-[12px] p-0">
        {skills.map((s) => (
          <SkillBar key={s.label} label={s.label} value={s.value} shown={shown} />
        ))}
      </ul>
      <p className="m-0 font-sans text-[13.5px] leading-[20px] font-normal text-[#6b6b6b]">
        {summary}
      </p>
      {evidence ? (
        <p className="m-0 flex items-start gap-[10px] rounded-[12px] bg-[#e2f1e4] p-[12px] font-sans text-[13.5px] leading-[19px] font-semibold text-[#27522e]">
          <GameV2ShieldIcon className="mt-[0.5px] size-[18px] shrink-0 text-[#27522e]" />
          <span className="min-w-0">{COPY.evidence(verifies)}</span>
        </p>
      ) : null}
      {ranked ? (
        <p className="m-0 font-sans text-[12.5px] leading-[18px] font-normal text-[#6b6b6b]">
          {minor ? COPY.comparedMinor : COPY.compared}
        </p>
      ) : null}
      <div className="flex flex-wrap items-center gap-[12px]">
        <button type="button" onClick={onBack} className={BTN_BACK}>
          {COPY.back}
        </button>
        <button
          type="button"
          onClick={onAgain}
          className={classNames(BTN_PRIMARY, 'basis-[160px]')}
        >
          {COPY.again}
        </button>
      </div>
    </section>
  );
};

const GameV2Result = ({ gameId, mode, level, frame, result, onBack, onAgain }) => {
  const g = useGameV2Params();
  const navigate = useNavigate();
  const minor = isMinorFlag(frame);
  const playStyle = frame === 'GV-12' || (!frame && gameId === 'makola-haggle');
  const drawn = Boolean(frame) || !result;
  const ranked = (mode ?? 'ranked') === 'ranked';

  useEffect(() => {
    log('mount', {
      gameId,
      mode,
      level,
      frame,
      hasResult: Boolean(result),
      minor,
      playStyle,
      drawn,
    });
  }, [gameId, mode, level, frame, result, minor, playStyle, drawn]);

  const practiceAgain = () => {
    log('practise again', { ranked });
    if (ranked) g.again({ mode: 'practice' });
    else onAgain?.();
  };
  const askBuddy = () => {
    log('ask career buddy');
    navigate('/profile/filling/career-buddy?cb=welcome'); // ⚠️ ASSUMPTION: the hand-off target is not drawn
  };

  if (playStyle) {
    const drawnStyle = drawn || !result;
    const read = drawnStyle
      ? GAME_V2_DRAWN_PLAY_STYLE.read
      : (result.summary ?? GAME_V2_DRAWN_PLAY_STYLE.read);
    const tags = drawnStyle
      ? GAME_V2_DRAWN_PLAY_STYLE.tags
      : (result.tags ?? result.skills?.map((s) => s.label) ?? GAME_V2_DRAWN_PLAY_STYLE.tags);
    return (
      <div className="flex w-full items-center justify-center lg:min-h-[655px]">
        <PlayStyleCard
          gameId={frame === 'GV-12' && gameId !== 'makola-haggle' ? 'makola-haggle' : gameId}
          level={drawnStyle ? GAME_V2_DRAWN_PLAY_STYLE.level : level}
          read={read}
          tags={tags}
          onBack={onBack}
          onAskBuddy={askBuddy}
        />
      </div>
    );
  }

  /* the drawn card is Memory Match · Intermediate whatever game URL shows it (a frame code), else the run just finished */
  const data = drawn
    ? {
        ...GAME_V2_DRAWN_RESULT,
        gameId: frame ? GAME_V2_DRAWN_RESULT.gameId : gameId,
        level: frame ? GAME_V2_DRAWN_RESULT.level : level,
      }
    : { ...result, gameId, level };
  return (
    <div className="flex w-full items-center justify-center lg:min-h-[655px]">
      <ScoreCard
        data={data}
        ranked={ranked}
        minor={minor}
        onBack={onBack}
        onAgain={practiceAgain}
      />
    </div>
  );
};

export default GameV2Result;
