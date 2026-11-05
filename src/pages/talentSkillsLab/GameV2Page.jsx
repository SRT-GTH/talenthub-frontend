import { useEffect } from 'react';
import HelpPopover from '../../components/sections/notifications/HelpPopover.jsx';
import GameV2Result from '../../components/sections/talentSkillsLab/gamesV2/GameV2Result.jsx';
import GameV2Shell from '../../components/sections/talentSkillsLab/gamesV2/GameV2Shell.jsx';
import { useGameV2Params } from '../../components/sections/talentSkillsLab/gamesV2/gamesV2State.js';
import UiStyleScope from '../../components/shared/UiStyleScope.jsx';
import '../../styles/talentA11y.css';
import { debug } from '../../utils/debug.js';
import { ensurePlayfulFont } from '../../utils/ensurePlayfulFont.js';

const log = debug('GameV2Page');

/*
 * GameV2Page — `/skills-lab/play/:gameId` (Figma "Games v2", wiki/talent-games-v2.md). Own chrome (no talent shell), like GamePage.
 * Games are discovered automatically: every file in `talentSkillsLab/gamesV2/games/*.jsx` exports
 *   GAMES_V2      = { '<gameId>': Component }            Component gets `{ frame }` (the `?f=` code) and renders <GameV2Shell>
 *   GAMES_V2_META = { '<gameId>': { name, subtitleLead, resultProgress } }
 *                   name           "Memory Match"          (header "Skills Lab · Memory Match")
 *                   subtitleLead   "Working memory · 4×4 cards"
 *                   resultProgress LabProgressStrip props shown above the result card (all dots 'ok')
 *                   resultSubtitle / resultSticker (optional) header overrides of the result view (Makola Haggle: GV-12)
 * `?view=result` is drawn here for EVERY game (GameV2Result inside GameV2Shell); a game only renders its own play screen.
 */
const FOUND = import.meta.glob('../../components/sections/talentSkillsLab/gamesV2/games/*.jsx', {
  eager: true,
});
const GAMES = Object.assign({}, ...Object.values(FOUND).map((m) => m.GAMES_V2 ?? {}));
const META = Object.assign({}, ...Object.values(FOUND).map((m) => m.GAMES_V2_META ?? {}));

const GameV2Page = () => {
  const g = useGameV2Params();
  const Game = GAMES[g.gameId];
  const meta = META[g.gameId];
  const helpHome = {
    helpOpen: new URLSearchParams(window.location.search).get('help') === '1',
    helpPage: 'skills-lab',
    update: (patch) => g.update(patch),
  };

  useEffect(() => {
    ensurePlayfulFont();
    log('mount', { gameId: g.gameId, mode: g.mode, level: g.level, view: g.view, frame: g.frame });
  }, [g.gameId, g.mode, g.level, g.view, g.frame]);

  useEffect(() => {
    document.documentElement.setAttribute('data-talent-home', '');
    return () => document.documentElement.removeAttribute('data-talent-home');
  }, []);

  let body;
  if (!Game) {
    body = <div className="p-[24px]">Game “{g.gameId}” is not built yet.</div>;
  } else if (g.view === 'result') {
    body = (
      <GameV2Shell
        name={meta?.name ?? g.gameId}
        subtitleLead={meta?.subtitleLead ?? ''}
        subtitle={meta?.resultSubtitle}
        sticker={meta?.resultSticker}
        progress={meta?.resultProgress ?? null}
        footer={{ note: '' }}
      >
        <GameV2Result
          gameId={g.gameId}
          mode={g.mode}
          level={g.level}
          frame={g.frame}
          result={g.readResult()}
          onBack={g.exit}
          onAgain={() => g.again()}
        />
      </GameV2Shell>
    );
  } else {
    body = <Game frame={g.frame} />;
  }

  return (
    <>
      <UiStyleScope enabled />
      <HelpPopover home={helpHome} />
      {body}
    </>
  );
};

export default GameV2Page;
