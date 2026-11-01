import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { FOCUS_RING, HEADING } from '../skillsLabDialogUtils.js';
import GameV2Card from './GameV2Card.jsx';
import GameV2CategoryFilters from './GameV2CategoryFilters.jsx';
import GameV2VerifiesChip from './GameV2VerifiesChip.jsx';
import { GvClockIcon } from './GamesV2Icons.jsx';
import { GAMES_V2, GAMES_V2_COPY, countByCategory } from './gamesV2Data.js';
import { openDialogUrl, openGameUrl } from './gamesV2Urls.js';

const log = debug('GamesV2Section');

/*
 * GamesV2Section — the "Skill games" block of the Games tab (Figma GV-01 "Skills Lab · Games tab", Playful 9598:34402 / Focused
 * 9598:36301), rendered by SkillsLabGamesTab above the Arcade block: heading + "Verifies skills" chip + subtitle, the
 * "My games history" button, the category filter strip (really filters) and the 13 cards in the drawn order.
 * Card buttons open the dialogs by URL (gamesV2Urls.js): details (?game=<id>[&mode=practice]) / resume (?dialog=resume&game=<id>).
 * Data: gamesV2Data.js (mock shaped like `GET /skills-lab/games` v2).
 */
const HISTORY_BTN =
  'inline-flex min-h-[24px] shrink-0 cursor-pointer items-center justify-center gap-[8px] rounded-[12px] border border-solid border-[#dee5e0] bg-white px-[20px] py-[12px] font-sans text-[15px] font-semibold leading-[18px] text-[#1c2a21] ' +
  'playful:rounded-[14px] playful:py-[12.5px] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[0_3px_0_rgba(28,42,33,0.45)]';

const GamesV2Section = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [category, setCategory] = useState('all');
  const counts = useMemo(() => countByCategory(GAMES_V2), []);
  const visible = useMemo(
    () => (category === 'all' ? GAMES_V2 : GAMES_V2.filter((g) => g.category === category)),
    [category]
  );

  useEffect(() => {
    log('mount', { games: GAMES_V2.length, categories: Object.keys(counts).length });
  }, [counts]);
  useEffect(() => {
    log('filter', category, 'cards', visible.length);
  }, [category, visible.length]);

  const onPlay = useCallback(
    (game, mode) => {
      log('open details', game.id, mode);
      navigate(openGameUrl(params, game.id, mode === 'practice' ? { mode: 'practice' } : {}));
    },
    [navigate, params]
  );
  const onResume = useCallback(
    (game) => {
      log('open resume', game.id);
      navigate(openDialogUrl(params, 'resume', game.id));
    },
    [navigate, params]
  );
  // ⚠️ ASSUMPTION: "My games history" has no destination in Figma yet, so it only logs.
  const onHistory = () => log('my games history (no destination drawn yet)');

  return (
    <section
      aria-labelledby="gv2-skill-games-title"
      data-section="skill-games-v2"
      className="flex flex-col gap-[20px]"
    >
      <div className="flex flex-wrap items-end justify-between gap-x-[16px] gap-y-[12px]">
        <div className="flex min-w-0 flex-1 basis-[min(100%,420px)] flex-col gap-[6px]">
          <div className="flex flex-wrap items-center gap-x-[12px] gap-y-[6px]">
            <h2
              id="gv2-skill-games-title"
              className={classNames(
                HEADING,
                'm-0 text-[clamp(24px,3vw,26px)] font-semibold leading-[1.2] text-[#1c2a21] playful:text-[clamp(26px,3.5vw,30px)]'
              )}
            >
              {GAMES_V2_COPY.title}
            </h2>
            <GameV2VerifiesChip label={GAMES_V2_COPY.verifies} bordered={false} />
          </div>
          <p className="m-0 max-w-[760px] font-sans text-[15px] leading-[22px] text-[#6b6b6b]">
            {GAMES_V2_COPY.subtitle}
          </p>
        </div>
        <button type="button" onClick={onHistory} className={classNames(HISTORY_BTN, FOCUS_RING)}>
          {GAMES_V2_COPY.history}
          <GvClockIcon className="size-[18px] shrink-0" />
        </button>
      </div>

      <GameV2CategoryFilters
        value={category}
        onChange={setCategory}
        counts={counts}
        total={GAMES_V2.length}
      />

      <div
        aria-live="polite"
        className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,340px),1fr))] items-stretch gap-[24px]"
      >
        {visible.map((game) => (
          <GameV2Card key={game.id} game={game} onPlay={onPlay} onResume={onResume} />
        ))}
      </div>
    </section>
  );
};

export default GamesV2Section;
