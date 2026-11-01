import { useCallback, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import GameV2DetailsDialog from './GameV2DetailsDialog.jsx';
import GameV2ExpiredDialog from './GameV2ExpiredDialog.jsx';
import GameV2ResumeDialog from './GameV2ResumeDialog.jsx';
import { GAME_V2_LEVELS, gameV2ById } from './gamesV2Data.js';
import { gamePlayUrl } from './gamesV2State.js';
import { closeDialogUrl, openGameUrl } from './gamesV2Urls.js';

const log = debug('GameV2DialogLayer');

/*
 * GameV2DialogLayer — mounted by SkillsLabHubPage next to <SkillsLabDialogs/>. Reads the URL (contract: gamesV2State.js) and
 * draws over the hub, only on the Games tab:
 *   ?tab=games&game=<id>[&level=][&mode=ranked|practice][&gstate=cooldown]   GV-02 / GV-03 details dialog
 *   ?tab=games&dialog=resume&game=<id>                                      GV-09 "Pick up where you left off?"
 *   ?tab=games&dialog=expired&game=<id>                                     GV-13 "This game has ended" (default game: pattern-pulse)
 * Opening a dialog pushes history (Back closes it); picking a level / mode and closing replace it.
 * Start ranked game / Start practice game → /skills-lab/play/<id>?mode=…&level=… ; Resume game → …?mode=ranked&resume=1 ;
 * Start again → a fresh ranked run ; View result → …?mode=ranked&view=result (⚠️ ASSUMPTION: the ended game's result card).
 */
const GameV2DialogLayer = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const onGames = params.get('tab') === 'games';
  const dialog = params.get('dialog');
  const gameId = params.get('game');
  const game = useMemo(() => {
    if (!onGames) return null;
    if (dialog === 'expired') return gameV2ById(gameId) || gameV2ById('pattern-pulse');
    return gameV2ById(gameId);
  }, [onGames, dialog, gameId]);

  const levelParam = params.get('level');
  const level = GAME_V2_LEVELS.some((l) => l.id === levelParam) ? levelParam : 'intermediate';
  const cooldown = params.get('gstate') === 'cooldown' || game?.status.kind === 'cooldown';
  // Cooldown disables Ranked, so Practice is the picked mode there.
  const mode = cooldown || params.get('mode') === 'practice' ? 'practice' : 'ranked';
  const opensAt =
    (game?.status.kind === 'cooldown' ? game.status : null)?.opensAt || 'Thu 6 Nov, 09:40';

  useEffect(() => {
    if (!game) return;
    log('open', { dialog: dialog || 'details', game: game.id, mode, level, cooldown });
  }, [game, dialog, mode, level, cooldown]);

  const close = useCallback(() => {
    log('close');
    navigate(closeDialogUrl(params), { replace: true });
  }, [navigate, params]);

  const pick = useCallback(
    (patch) => {
      const next = {
        mode: patch.mode ?? mode,
        level: patch.level ?? level,
        ...(params.get('gstate') ? { gstate: params.get('gstate') } : {}),
      };
      log('pick', patch);
      navigate(openGameUrl(params, game.id, next), { replace: true });
    },
    [navigate, params, game, mode, level]
  );

  const start = useCallback(() => {
    const url =
      game.kind === 'playstyle'
        ? gamePlayUrl(game.id, { mode: 'ranked' })
        : gamePlayUrl(game.id, { mode, level: game.levels.length ? level : undefined });
    log('start', url);
    navigate(url);
  }, [navigate, game, mode, level]);

  if (!game) return null;

  if (dialog === 'resume') {
    return (
      <GameV2ResumeDialog
        game={game}
        onClose={close}
        onResume={() => {
          const url = gamePlayUrl(game.id, { mode: 'ranked', level, resume: 1 });
          log('resume game', url);
          navigate(url);
        }}
        onStartAgain={() => {
          const url = gamePlayUrl(game.id, { mode: 'ranked', level });
          log('start again', url);
          navigate(url);
        }}
      />
    );
  }
  if (dialog === 'expired') {
    return (
      <GameV2ExpiredDialog
        game={game}
        onClose={close}
        onViewResult={() => {
          const url = gamePlayUrl(game.id, { mode: 'ranked', view: 'result' });
          log('view result', url);
          navigate(url);
        }}
      />
    );
  }
  return (
    <GameV2DetailsDialog
      game={game}
      mode={mode}
      level={level}
      cooldown={cooldown}
      opensAt={opensAt}
      onMode={(m) => pick({ mode: m })}
      onLevel={(l) => pick({ level: l })}
      onClose={close}
      onStart={start}
    />
  );
};

export default GameV2DialogLayer;
