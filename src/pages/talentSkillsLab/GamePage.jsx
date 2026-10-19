import { useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import HelpPopover from '../../components/sections/notifications/HelpPopover.jsx';
import '../../styles/talentA11y.css';
import { debug } from '../../utils/debug.js';
import { ensurePlayfulFont } from '../../utils/ensurePlayfulFont.js';
import UiStyleScope from '../../components/shared/UiStyleScope.jsx';

const log = debug('GamePage');

/*
 * GamePage — `/skills-lab/games/:gameId?f=<frame code>`. Focused chrome (each game renders its own <LabPlayChrome/>),
 * no talent shell. Games are discovered automatically: every file in
 * `src/components/sections/talentSkillsLab/games/*.jsx` exports `GAMES = { '<gameId>': Component }`; the component
 * gets `{ frame }` (the `?f=` code, e.g. 'GS02') and reads the rest of the URL itself.
 */
const FOUND = import.meta.glob('../../components/sections/talentSkillsLab/games/*.jsx', {
  eager: true,
});
const GAMES = Object.assign({}, ...Object.values(FOUND).map((m) => m.GAMES ?? {}));

const GamePage = () => {
  const { gameId } = useParams();
  const [params, setParams] = useSearchParams();
  const frame = params.get('f');
  const helpHome = {
    helpOpen: params.get('help') === '1',
    helpPage: 'skills-lab',
    update: (patch) => {
      const next = new URLSearchParams(params);
      Object.entries(patch).forEach(([k, v]) => (v ? next.set(k, String(v)) : next.delete(k)));
      setParams(next, { replace: true });
    },
  };
  const Game = GAMES[gameId];

  useEffect(() => {
    ensurePlayfulFont();
    log('mount', { gameId, frame, found: Boolean(Game) });
  }, [gameId, frame, Game]);

  useEffect(() => {
    document.documentElement.setAttribute('data-talent-home', '');
    return () => document.documentElement.removeAttribute('data-talent-home');
  }, []);

  return (
    <>
      <UiStyleScope enabled />
      <HelpPopover home={helpHome} />
      {Game ? (
        <Game frame={frame} />
      ) : (
        <div className="p-[24px]">Game “{gameId}” is not built yet.</div>
      )}
    </>
  );
};

export default GamePage;
