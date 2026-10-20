import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { useUiStyle } from '../../../hooks/useUiStyle.js';
import Button from '../../ui/Button.jsx';
import {
  SkillsLabArrowGlyph,
  SkillsLabCheckCircleFillGlyph,
  SkillsLabClockGlyph,
  SkillsLabTargetGlyph,
} from './SkillsLabDialogIcons.jsx';
import { ARCADE_GAMES, GAMES_ARCADE } from './skillsLabGamesData.js';
import { useHubData } from './skillsLabHubData.js';
import { fetchGames } from '../../../services/skillsLab.api.js';
import { FOCUS_RING, HEADING, fill, unitFor } from './skillsLabDialogUtils.js';

const log = debug('SkillsLabGamesTab');

/*
 * SkillsLabGamesTab — the "Games" tab content of the Skills Lab hub (Figma SL-G01 "Games tab (Arcade)", Playful 7943:13442 /
 * Focused 8110:498108, the `arcade` frame 1329 wide: featured banner, "Skill games" grid, "Personality games" grid).
 * The hub page renders it for `?tab=games` UNDER its own header + tab row (title / sticker / chips / "How verification works",
 * and the tab row with the Games tab selected, gold count chip and NEW sticker — those are hub chrome, not drawn here).
 *
 * Props: skills (useSkillsLabState()) — unused for now (the catalogue is mock data in skillsLabGamesData.js).
 * Every playable card links to `/skills-lab/games/<gameId>`; `soon` games are inert.
 */

// Status chip per Figma `status chip` (Playful: 1.2px ink border + 2px hard shadow, Focused: 1px ink@.12 hairline).
const STICKER =
  'border border-solid border-[rgba(28,42,33,0.12)] playful:border-[1.2px] playful:border-[#1c2a21] playful:shadow-[2px_2px_0_#1c2a21]';

const StatusChip = ({ game, unit }) => {
  const labels = GAMES_ARCADE.statusLabels;
  if (game.status === 'new') {
    return (
      <span
        className={classNames(
          'inline-flex shrink-0 items-center rounded-full bg-[#c1d4c4] px-[10px] py-[4px] font-sans text-[11px] font-bold leading-[13px] text-[#1c2a21] max-lg:text-[12px]',
          STICKER
        )}
      >
        {labels.new}
      </span>
    );
  }
  if (game.status === 'ready') {
    return (
      <span
        className={classNames(
          'inline-flex shrink-0 -rotate-3 items-center rounded-full bg-[#ffd86b] px-[10px] py-[4px] font-sans text-[11px] font-bold leading-[17px] text-[#1c2a21] max-lg:text-[12px]',
          STICKER
        )}
      >
        {labels.ready}
      </span>
    );
  }
  if (game.status === 'played') {
    return (
      <span
        className={classNames(
          'inline-flex shrink-0 items-center gap-[5px] rounded-full bg-[#387440] py-[5px] pl-[10px] pr-[8px] font-sans text-[11px] font-semibold leading-[13px] text-[#1c2a21] max-lg:text-[12px]',
          'border border-solid border-[rgba(28,42,33,0.12)] playful:border-[1.5px] playful:border-[#1c2a21] playful:bg-[#ebf1ec]'
        )}
      >
        <SkillsLabCheckCircleFillGlyph className="size-[13px] shrink-0" />
        {fill(labels.played, { xp: game.xp, unit })}
      </span>
    );
  }
  return (
    <span className="inline-flex shrink-0 items-center rounded-full bg-[#f7f8f4] px-[10px] py-[4px] font-sans text-[11px] font-semibold leading-[13px] text-[#595959] max-lg:text-[12px]">
      {labels.soon}
    </span>
  );
};

const GameCard = ({ game, unit, onOpen }) => {
  const soon = game.status === 'soon';
  const played = game.status === 'played';
  const flat = soon || played;
  const actions = GAMES_ARCADE.actions;
  return (
    <article
      data-game={game.id}
      data-status={game.status}
      className={classNames(
        'flex min-w-0 flex-col gap-[12px] rounded-[24px] bg-white p-[20px]',
        flat
          ? 'border border-solid border-[#e7e7e7] shadow-[0_8px_24px_rgba(18,38,20,0.06)]'
          : classNames(
              'border border-solid border-[rgba(28,42,33,0.1)] shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)]',
              'playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]'
            )
      )}
    >
      <div className="flex items-center gap-[10px]">
        <img
          src={game.cover}
          alt=""
          width={56}
          height={56}
          className={classNames(
            'size-[56px] shrink-0 rounded-[14px] border border-solid border-[rgba(28,42,33,0.12)] object-cover',
            soon && 'opacity-50'
          )}
        />
        <span className="inline-flex min-w-0 items-center rounded-full bg-[#f7f8f6] px-[10px] py-[4px] font-sans text-[11px] font-semibold leading-[13px] text-[#595959] max-lg:text-[12px]">
          <span className="truncate">{game.category}</span>
        </span>
        <span className="min-w-0 flex-1" />
        <StatusChip game={game} unit={unit} />
      </div>
      <div className="flex flex-col gap-[10px]">
        <h3
          className={classNames(
            'm-0 font-sans text-[19px] font-semibold leading-[23px]',
            soon ? 'text-[#595959]' : 'text-[#1c2a21]'
          )}
        >
          {game.title}
        </h3>
        <div className="flex items-center gap-[6px] font-sans text-[13px] font-medium leading-[16px] text-[#595959]">
          <SkillsLabClockGlyph className="size-[14px] shrink-0" />
          {game.meta}
        </div>
        <p className="m-0 font-sans text-[13px] leading-[19px] text-[#595959]">
          {game.description}
        </p>
        <div className="flex items-center gap-[6px] font-sans text-[12.5px] font-semibold leading-[15px] text-[#2a5730]">
          <SkillsLabTargetGlyph className="size-[14px] shrink-0 text-[#387440]" />
          <span className="min-w-0">{game.measures}</span>
        </div>
      </div>
      {game.status === 'ready' || game.status === 'new' ? (
        <Button
          variant="primary"
          size="sm"
          rightIcon={<SkillsLabArrowGlyph className="size-[20px]" />}
          aria-label={`${actions.play}: ${game.title}`}
          onClick={() => onOpen(game)}
          className="w-full"
        >
          {actions.play}
        </Button>
      ) : (
        <button
          type="button"
          disabled={soon}
          aria-label={soon ? undefined : `${actions.replay}: ${game.title}`}
          onClick={soon ? undefined : () => onOpen(game)}
          className={classNames(
            'w-full rounded-[10px] border-2 border-solid border-[#c1d4c4] bg-[#e1eae2] px-[18px] py-[12px] font-sans text-[16px] font-bold leading-[24px] tracking-[0.1px] text-[#165d3a] shadow-[0_1px_2px_rgba(28,42,33,0.12)]',
            soon ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
            FOCUS_RING
          )}
        >
          {soon ? actions.soon : actions.replay}
        </button>
      )}
    </article>
  );
};

const SectionHead = ({ title, subtitle }) => (
  <div className="flex flex-wrap items-center gap-x-[12px] gap-y-[4px]">
    <h2
      className={classNames(
        HEADING,
        'm-0 text-[24px] font-semibold leading-[29px] tracking-[-0.01em] text-[#1c2a21]'
      )}
    >
      {title}
    </h2>
    <p className="m-0 font-sans text-[15px] leading-[18px] text-[#595959]">{subtitle}</p>
  </div>
);

const GRID =
  'grid grid-cols-[repeat(auto-fill,minmax(min(100%,340px),1fr))] items-start gap-[24px]';

const SkillsLabGamesTab = () => {
  const navigate = useNavigate();
  const { uiStyle } = useUiStyle();
  const unit = unitFor(uiStyle);
  const featured = GAMES_ARCADE.featured;

  const hub = useHubData();
  // Live: each game's status for this talent (GET /skills-lab/games); `?demo=1` keeps the drawn statuses.
  const [mine, setMine] = useState(null);
  useEffect(() => {
    log('mount', { games: ARCADE_GAMES.length, live: hub.live });
    if (!hub.live) return undefined;
    let alive = true;
    fetchGames()
      .then((rows) => alive && setMine(new Map(rows.map((r) => [r.id, r]))))
      .catch((err) => log('games failed', err?.response?.status));
    return () => {
      alive = false;
    };
  }, [hub.live]);
  const games = useMemo(
    () =>
      ARCADE_GAMES.map((g) => {
        const row = mine?.get(g.id);
        return row ? { ...g, status: row.status, passed: row.passed, xp: row.xp || g.xp } : g;
      }),
    [mine]
  );
  const skillSubtitle = useMemo(() => {
    if (!hub.live || !mine) return GAMES_ARCADE.skillSection.subtitle;
    const skill = games.filter((g) => g.skill && g.status !== 'soon');
    const passed = skill.filter((g) => g.passed).length;
    return `Pass to verify a skill. ${passed} of ${skill.length} skill games passed.`;
  }, [hub.live, mine, games]);

  const open = (game) => {
    log('open game', game.id);
    navigate(`/skills-lab/games/${game.id}`);
  };
  const skillGames = games.filter((g) => g.skill);
  const personalityGames = games.filter((g) => !g.skill);

  return (
    <div className="flex flex-col gap-[28px]">
      <section
        aria-label={featured.title}
        className="flex flex-col overflow-hidden rounded-[24px] border border-solid border-[rgba(28,42,33,0.12)] bg-[#ebf1ec] md:flex-row"
      >
        <img
          src={featured.cover}
          alt=""
          className="aspect-[2/1] w-full object-cover md:aspect-auto md:w-[42.1%] md:shrink-0"
        />
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-[12px] px-[clamp(20px,3vw,36px)] py-[clamp(20px,2.5vw,28px)]">
          <span className="font-sans text-[11.5px] font-bold leading-[14px] tracking-[0.06em] text-[#387440] max-lg:text-[12px]">
            {featured.eyebrow}
          </span>
          <h2
            className={classNames(
              HEADING,
              'm-0 text-[clamp(26px,3.2vw,36px)] font-semibold leading-[1.2] tracking-[-0.01em] text-[#1c2a21]'
            )}
          >
            {featured.title}
          </h2>
          <p className="m-0 max-w-[695px] font-sans text-[16px] leading-[19px] text-[#595959] max-lg:leading-[22px]">
            {featured.body}
          </p>
          <div>
            <Button
              variant="primary"
              size="lg"
              rightIcon={<SkillsLabArrowGlyph className="size-[20px]" />}
              onClick={() => open({ id: featured.gameId })}
            >
              {featured.cta}
            </Button>
          </div>
        </div>
      </section>

      <SectionHead
        title={GAMES_ARCADE.skillSection.title}
        subtitle={skillSubtitle}
      />
      <div className={GRID}>
        {skillGames.map((game) => (
          <GameCard key={game.id} game={game} unit={unit} onOpen={open} />
        ))}
      </div>

      <SectionHead
        title={GAMES_ARCADE.personalitySection.title}
        subtitle={GAMES_ARCADE.personalitySection.subtitle}
      />
      <div className={GRID}>
        {personalityGames.map((game) => (
          <GameCard key={game.id} game={game} unit={unit} onOpen={open} />
        ))}
      </div>
    </div>
  );
};

export default SkillsLabGamesTab;
