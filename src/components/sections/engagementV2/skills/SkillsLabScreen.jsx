import { useEffect } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import Button from '../../../ui/Button.jsx';
import { HubButton } from '../../talentSkillsLab/HubParts.jsx';
import { ARCADE_GAMES } from '../../talentSkillsLab/skillsLabGamesData.js';
import { GAMES_HEAD, LAB_GAME_IDS, LAB_HERO, LAB_ROWS, LAB_STATUS_LABEL } from './skillsData.js';
import {
  SkillsArrowRightIcon,
  SkillsCheckCircleFillIcon,
  SkillsClockIcon,
  SkillsTargetIcon,
} from './skillsIcons.jsx';
import { SkChip, Sticker, Star, Tile, MiniChip } from './SkillsParts.jsx';
import { CARD, GUTTER } from './skillsStyles.js';

const log = debug('SkillsLabScreen');

/*
 * SK-04 · Skills Lab — Figma Playful 7665:483 / Focused 8285:23511. The Skills Lab hub as drawn INSIDE the engagement flow
 * (stage bar kept, dark-green "Lab hero" with stat chips, "FROM YOUR SKILLS" / "EXPLORE MORE LABS" lab cards, "PLAY IT
 * INSTEAD" game cards, own footer). It is a different layout from the standalone /skills-lab hub, so it is built here and
 * only reuses that hub's game catalogue (copy + cover art) and HubButton.
 * Props: onStartLab(labId) (play route), onPlayGame(gameId).
 */
const StickerChip = ({ children, ready }) => (
  <span
    className={classNames(
      'inline-flex shrink-0 items-center rounded-full border border-solid px-[10px] py-[4px] font-sans text-[11px] font-bold leading-[13px] text-[#1c2a21] max-lg:text-[12px]',
      'border-[rgba(28,42,33,0.12)] bg-[#ffd86b] playful:border-[1.2px] playful:border-[#1c2a21] playful:py-[5px] playful:shadow-[2px_2px_0_#1c2a21]',
      ready && '-rotate-3'
    )}
  >
    {children}
  </span>
);

const LabCard = ({ lab, onStartLab }) => {
  const tone = lab.status === 'ready' ? 'cream' : lab.status === 'verified' ? 'green' : 'mint';
  return (
    <article
      data-lab={lab.id}
      data-status={lab.status}
      className={classNames('flex min-w-0 flex-col gap-[12px] p-[20px]', CARD)}
    >
      <div className="flex items-center justify-between gap-[8px]">
        <Tile glyph={lab.icon} tone={tone} />
        {lab.status === 'ready' ? (
          <StickerChip ready>{LAB_STATUS_LABEL.ready}</StickerChip>
        ) : lab.status === 'verified' ? (
          <SkChip>{`Verified · ${lab.score}`}</SkChip>
        ) : (
          <MiniChip strong>{LAB_STATUS_LABEL.explore}</MiniChip>
        )}
      </div>
      <h3 className="m-0 font-sans text-[19px] font-semibold leading-[23px] text-[#1c2a21]">
        {lab.title}
      </h3>
      <p className="m-0 flex items-center gap-[6px] font-sans text-[13px] font-medium leading-[16px] text-[#595959]">
        <SkillsClockIcon className="size-[13px] shrink-0" />
        {lab.meta}
      </p>
      <p className="m-0 font-sans text-[13px] leading-[19px] min-h-[38px] text-[#595959]">
        {lab.text}
      </p>
      {lab.status === 'ready' ? (
        <Button
          size="sm"
          className="w-full"
          onClick={() => onStartLab(lab.id)}
          rightIcon={<SkillsArrowRightIcon className="size-[20px]" />}
        >
          Start lab
        </Button>
      ) : (
        <Button
          variant="tertiary-subtle"
          size="sm"
          className="w-full"
          onClick={() => onStartLab(lab.id)}
        >
          {lab.status === 'verified' ? 'Retake' : 'Try it'}
        </Button>
      )}
    </article>
  );
};

const GameCard = ({ game, onPlayGame }) => {
  const played = game.status === 'played';
  return (
    <article
      data-game={game.id}
      data-status={game.status}
      className={classNames(
        'flex min-w-0 flex-col gap-[12px] p-[20px]',
        played
          ? 'rounded-[24px] border border-solid border-[#e7e7e7] bg-white shadow-[0_5px_17px_rgba(18,38,20,0.06)]'
          : CARD
      )}
    >
      <div className="flex items-center gap-[10px]">
        <img
          src={game.cover}
          alt=""
          width={56}
          height={56}
          className="size-[56px] shrink-0 rounded-[14px] border border-solid border-[rgba(28,42,33,0.12)] object-cover"
        />
        <span className="inline-flex min-w-0 items-center rounded-full bg-[#f7f8f6] px-[10px] py-[4px] font-sans text-[11px] font-semibold leading-[13px] text-[#595959] max-lg:text-[12px]">
          <span className="whitespace-nowrap">{game.category}</span>
        </span>
        <span className="min-w-0 flex-1" />
        {game.status === 'new' ? (
          <span className="inline-flex shrink-0 items-center rounded-full border border-solid border-[rgba(28,42,33,0.12)] bg-[#c1d4c4] px-[10px] py-[4px] font-sans text-[11px] font-bold leading-[13px] text-[#1c2a21] playful:border-[1.2px] playful:border-[#1c2a21] playful:shadow-[2px_2px_0_#1c2a21] max-lg:text-[12px]">
            New game
          </span>
        ) : played ? (
          <span className="inline-flex shrink-0 items-center gap-[5px] rounded-full border border-solid border-[rgba(28,42,33,0.12)] bg-[#ebf1ec] py-[5px] pl-[10px] pr-[8px] font-sans text-[11px] font-semibold leading-[13px] text-[#1c2a21] max-lg:text-[12px]">
            <SkillsCheckCircleFillIcon className="size-[13px] shrink-0 text-[#387440]" />
            {`Played · +${game.xp} XP`}
          </span>
        ) : (
          <StickerChip ready>Ready to play</StickerChip>
        )}
      </div>
      <div className="flex flex-col gap-[10px]">
        <h3 className="m-0 font-sans text-[19px] font-semibold leading-[23px] text-[#1c2a21]">
          {game.title}
        </h3>
        <p className="m-0 flex items-center gap-[6px] font-sans text-[13px] font-medium leading-[16px] text-[#595959]">
          <SkillsClockIcon className="size-[14px] shrink-0" />
          {game.meta}
        </p>
        <p className="m-0 font-sans text-[13px] leading-[19px] text-[#595959]">
          {game.description}
        </p>
        <p className="m-0 flex items-center gap-[6px] font-sans text-[12.5px] font-semibold leading-[15px] text-[#2a5730]">
          <SkillsTargetIcon className="size-[14px] shrink-0 text-[#387440]" />
          <span className="min-w-0">{game.measures}</span>
        </p>
      </div>
      {played ? (
        <Button
          variant="tertiary-subtle"
          size="sm"
          className="w-full"
          aria-label={`Replay: ${game.title}`}
          onClick={() => onPlayGame(game.id)}
        >
          Replay
        </Button>
      ) : (
        <HubButton
          tone="cardPrimary"
          size="sm"
          className="w-full"
          aria-label={`Play game: ${game.title}`}
          onClick={() => onPlayGame(game.id)}
          rightIcon={<SkillsArrowRightIcon />}
        >
          Play game
        </HubButton>
      )}
    </article>
  );
};

const GRID = 'grid grid-cols-1 items-start gap-[16px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
const EYEBROW =
  'm-0 font-sans text-[11px] font-bold uppercase leading-[13px] tracking-[0.109em] text-[#595959] max-lg:text-[12px]';

const SkillsLabScreen = ({ onStartLab, onPlayGame }) => {
  const games = LAB_GAME_IDS.map((id) => ARCADE_GAMES.find((g) => g.id === id)).filter(Boolean);
  useEffect(() => {
    log('mount', { labs: LAB_ROWS.reduce((n, r) => n + r.labs.length, 0), games: games.length });
  }, [games.length]);

  return (
    <>
      <section
        className={classNames(
          'relative bg-[#2a5730] pb-[clamp(24px,2.3vw,40px)] pt-[clamp(24px,2.1vw,36px)]',
          GUTTER
        )}
      >
        <div className="flex flex-col gap-[20px] lg:flex-row lg:items-start lg:justify-between">
          <div className="relative flex max-w-[785px] flex-col gap-[10px]">
            <span className="font-sans text-[11px] font-bold uppercase leading-[13px] tracking-[0.109em] text-white/80 max-lg:text-[12px]">
              {LAB_HERO.eyebrow}
            </span>
            <div className="relative w-fit max-w-full">
              <h1 className="m-0 font-sans text-[clamp(32px,3vw,52px)] font-semibold leading-[1.1] text-white playful:font-heading">
                Prove it. <span className="text-[#ffd86b]">Earn the badge</span>.
              </h1>
              <Sticker className="absolute left-[calc(100%+27px)] top-[-15px] max-lg:hidden">
                {LAB_HERO.sticker}
              </Sticker>
              <Star size={26} color="#ffd86b" className="left-[calc(100%+289px)] top-[-19px]" />
              <Star size={14} color="#387440" className="left-[calc(100%+329px)] top-[33px]" />
              <Star
                size={10}
                color="rgba(255,255,255,0.5)"
                className="left-[calc(100%+259px)] top-[61px]"
              />
            </div>

            <p className="m-0 font-sans text-[16px] leading-[19px] text-white/85 max-lg:text-[14px] max-lg:leading-[22px]">
              {LAB_HERO.body}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-[10px] lg:mr-[clamp(0px,4vw,69px)] lg:mt-[46px]">
            {LAB_HERO.stats.map((s) => (
              <SkChip key={s}>{s}</SkChip>
            ))}
          </div>
        </div>
      </section>

      <div
        className={classNames(
          'flex flex-col gap-[20px] pb-[clamp(24px,3vw,48px)] pt-[clamp(20px,2.3vw,40px)]',
          GUTTER
        )}
      >
        {LAB_ROWS.map((row) => (
          <section key={row.heading} className="flex flex-col gap-[20px]">
            <h2 className={EYEBROW}>{row.heading}</h2>
            <div className={GRID}>
              {row.labs.map((lab) => (
                <LabCard key={lab.id} lab={lab} onStartLab={onStartLab} />
              ))}
            </div>
          </section>
        ))}
        <section className="flex flex-col gap-[20px]">
          <div className="flex flex-wrap items-center gap-x-[10px] gap-y-[6px]">
            <h2 className={EYEBROW}>{GAMES_HEAD.heading}</h2>
            <span className="inline-flex items-center rounded-full border border-solid border-[rgba(28,42,33,0.1)] bg-[#c1d4c4] px-[8px] py-[3px] font-sans text-[10.5px] font-bold leading-[13px] text-[#1c2a21] playful:border-[rgba(28,42,33,0.35)] max-lg:text-[12px]">
              {GAMES_HEAD.chip}
            </span>
            <p className="m-0 font-sans text-[13px] leading-[16px] text-[#595959] max-lg:text-[13px]">
              {GAMES_HEAD.text}
            </p>
          </div>
          <div className={GRID}>
            {games.map((game) => (
              <GameCard key={game.id} game={game} onPlayGame={onPlayGame} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default SkillsLabScreen;
