import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { debug } from '../../../utils/debug.js';
import { usePlayfulDialogA11y } from '../../ui/PlayfulDialogA11y.js';
import {
  GAMES,
  GAME_CATEGORIES,
  PLAYFUL_DIFFICULTY_COLORS,
  filterGames,
  splitTraitColumns,
} from './gameStoreData.js';
import { GameStoreDiceIcon, GameStoreCloseIcon, GameStoreInfoIcon } from '../../shared/assets.jsx';
import searchIconUrl from '../../../assets/games/game-store/search-icon.svg';
import playArrowIconUrl from '../../../assets/games/game-store/play-arrow.svg';
import playTutorialIconUrl from '../../../assets/games/game-store/play-tutorial-icon.svg';
import howToPlayPreviewBg from '../../../assets/games/game-store/how-to-play-preview-bg.webp';
import letsPlayArrowUrl from '../../../assets/games/game-store/lets-play-arrow-icon.svg';
import backArrowUrl from '../../../assets/playful/games/back-arrow-left.svg';

const log = debug('PlayfulGameStoreModal');

/*
 * PlayfulGameStoreModal — Playful look of the Game Store (Figma "Playful · All Games"
 * 7873:68025 / "Games Filter – Strategy" 7873:70496, dialog 7873:68356 / 70827, 750x749) and
 * "Game details" (7873:68514, dialog 7873:68845, 600x749). Rendered by GameStoreModal when
 * uiStyle === 'playful'; same props (open, onClose, onPlayGame).
 *
 * Overlay rgba(28,42,33,0.7) (no blur), dialog: 1.5px ink border (28,42,33,.55), radius 24,
 * soft shadow + 5px offset "shelf". Own dialog shell (instead of ui/Modal) so it can carry
 * aria-labelledby, a focus trap, focus restore and an inert backdrop.
 *
 * ⚠️ ASSUMPTIONS (no Figma frame): card/chip hover (1px lift), phone layout (full-screen sheet,
 * sticky header + footer, horizontally scrolling chips), result-count live region copy.
 */

const UI = 'font-[family-name:var(--pf-font-ui)]';
const BADGE = 'font-[family-name:var(--pf-font-badge)]';
const INK_BORDER = 'border-[1.5px] border-[rgba(28,42,33,0.55)]';
const SHELF = 'shadow-[var(--pf-games-card-shadow)]';
const FOCUS =
  'focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#1c2a21]';

const CategoryBadge = ({ children }) => (
  <span
    className={`inline-flex w-fit items-center justify-center rounded-[30px] border border-[#c1d4c4] bg-[#ebf1ec] px-[8px] py-[2px] ${BADGE} text-[11px] font-semibold leading-[1.25] tracking-[-0.11px] text-[#142916]`}
  >
    {children}
  </span>
);

const Difficulty = ({ level }) => (
  <span className="font-sans text-[12px] text-[#70706e]">
    {'Difficulty: '}
    <span style={{ color: PLAYFUL_DIFFICULTY_COLORS[level] }}>{level}</span>
  </span>
);

const SectionHeading = ({ children }) => (
  <h3 className="flex items-center gap-[4px] py-px">
    <span className={`${UI} text-[12px] font-medium text-[#224626]`}>{children}</span>
    <span aria-hidden="true" className="h-[1.25px] w-[30px] shrink-0 bg-[#c1d4c4]" />
  </h3>
);

const Dot = () => (
  <span aria-hidden="true" className="size-[3px] shrink-0 rounded-full bg-[#737373]" />
);

const GameCard = ({ game, onSelect, stretch }) => (
  <button
    type="button"
    data-game-id={game.id}
    onClick={() => onSelect(game.id)}
    className={`group flex min-h-[160px] items-start justify-between gap-[18px] ${stretch ? 'self-stretch' : 'self-start'} rounded-[16px] ${INK_BORDER} bg-white px-[16px] py-[14px] text-left ${SHELF} motion-safe:transition-transform hover:-translate-x-px hover:-translate-y-px focus-visible:outline focus-visible:outline-[3px] focus-visible:-outline-offset-[3px] focus-visible:outline-[#1c2a21] max-sm:gap-3 max-sm:px-3 forced-colors:border-[CanvasText]`}
  >
    <img
      src={game.thumb}
      alt=""
      aria-hidden="true"
      className="size-[53px] shrink-0 rounded-full object-cover shadow-[0px_4px_20.1px_4px_rgba(56,116,64,0.23)]"
    />
    <span className="flex min-w-0 flex-1 flex-col gap-[6px] self-center">
      <CategoryBadge>{game.category}</CategoryBadge>
      <span className="flex flex-col gap-[8px]">
        <span className="flex flex-col gap-[4px]">
          <span className={`${UI} text-[14px] font-semibold leading-[16px] text-[#1c2a21]`}>
            {game.title}
          </span>
          <span className="font-sans text-[12px] leading-[1.3] text-[#70706e]">
            {game.description}
          </span>
        </span>
        <Difficulty level={game.difficulty} />
      </span>
      <span className="flex items-start justify-between border-t border-[#f1f5f9] pt-[10px]">
        <span className="font-sans text-[12px] font-medium text-[#387440]">{game.duration}</span>
        <span className="inline-flex items-center gap-[4px] font-sans text-[12px] font-medium text-[#387440]">
          Play
          <img src={playArrowIconUrl} alt="" aria-hidden="true" className="size-[16px]" />
        </span>
      </span>
    </span>
  </button>
);

const GridView = ({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  games,
  onSelectGame,
  searchRef,
}) => (
  <div className="flex min-h-0 flex-1 flex-col gap-[20px] overflow-hidden px-[36px] py-[18px] max-sm:px-4">
    <div className="flex shrink-0 flex-col gap-[20px]">
      <label
        className={`flex items-center gap-[8px] rounded-[14px] ${INK_BORDER} bg-white px-[18px] py-[12px] ${SHELF} focus-within:outline focus-within:outline-[3px] focus-within:outline-offset-2 focus-within:outline-[#1c2a21] max-sm:min-h-11`}
      >
        <img
          src={searchIconUrl}
          alt=""
          aria-hidden="true"
          className="size-[16px] shrink-0 object-contain"
        />
        <span className="sr-only">Find a game</span>
        <input
          ref={searchRef}
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Find a game..."
          autoComplete="off"
          className="w-full border-none bg-transparent font-sans text-[14px] leading-[20px] tracking-[0.2px] text-[#595959] outline-none placeholder:text-[#595959]"
        />
      </label>
      <div
        role="group"
        aria-label="Filter games by category"
        className="flex flex-wrap items-center gap-[8px] max-sm:-mx-4 max-sm:flex-nowrap max-sm:overflow-x-auto max-sm:px-4 max-sm:pb-1 max-sm:[scrollbar-width:none] max-sm:[&::-webkit-scrollbar]:hidden"
      >
        {GAME_CATEGORIES.map((cat) => {
          const active = category === cat;
          return (
            <button
              key={cat}
              type="button"
              aria-pressed={active}
              onClick={() => onCategoryChange(cat)}
              className={`shrink-0 overflow-clip rounded-[16px] px-[16px] py-[6px] font-sans text-[14px] leading-[normal] ${FOCUS} max-sm:min-h-11 max-sm:px-4 ${
                active
                  ? 'bg-[linear-gradient(150deg,rgba(20,41,22,0.9)_0%,rgba(42,87,48,0.9)_100%)] text-[#ebf1ec] forced-colors:border forced-colors:border-[CanvasText]'
                  : 'border-[0.8px] border-[#e5e7eb] bg-white text-[#575755] forced-colors:border-[CanvasText]'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>

    {/* Result count for assistive tech (Figma shows it only visually as the "showing results" label). */}
    <p role="status" aria-live="polite" className="sr-only">
      {games.length === 0
        ? 'No games found'
        : `${games.length} ${games.length === 1 ? 'game' : 'games'}`}
    </p>

    <div className="flex min-h-0 flex-1 flex-col gap-[16px] overflow-y-auto overflow-x-clip no-scrollbar max-sm:pb-[5px] max-sm:pr-[5px]">
      {category !== 'All' && (
        <p className="shrink-0 font-sans text-[12px] uppercase leading-[13px] tracking-[1.2px] text-[#babab7]">
          Showing results for{' '}
          <span className="font-semibold text-[#387440]">{`‘${category}’`}</span>
        </p>
      )}
      <div className="grid shrink-0 grid-cols-2 content-start gap-[10px] max-sm:grid-cols-1">
        {games.map((game) => (
          <GameCard
            key={game.id}
            game={game}
            onSelect={onSelectGame}
            stretch={category === 'All'}
          />
        ))}
      </div>
      {games.length === 0 && (
        <p className="py-8 text-center font-sans text-[14px] text-[#70706e]">
          No games match “{search}”.
        </p>
      )}
    </div>
  </div>
);

const VideoPreview = ({ title }) => (
  <div
    role="img"
    aria-label={`${title} gameplay preview, 3 minutes 12 seconds — coming soon`}
    className="relative h-[257px] w-full shrink-0 overflow-clip rounded-[16px]"
  >
    <img
      src={howToPlayPreviewBg}
      alt=""
      aria-hidden="true"
      className="absolute inset-0 size-full object-cover"
    />
    <div
      aria-hidden="true"
      className="absolute inset-0 bg-[radial-gradient(ellipse_343px_141px_at_211px_103px,rgba(56,116,64,0.25)_0%,rgba(56,116,64,0)_60%)]"
    />
    <div
      aria-hidden="true"
      className="absolute left-1/2 top-0 h-[257px] w-[488px] max-w-full -translate-x-1/2 overflow-clip bg-[rgba(28,42,33,0.2)] backdrop-blur-[1.4px]"
    >
      <div className="absolute left-1/2 top-[calc(50%+0.5px)] size-[56px] -translate-x-1/2 -translate-y-1/2 rounded-[30px] border border-[rgba(255,255,255,0.25)] bg-[rgba(255,255,255,0.29)] opacity-[0.56] backdrop-blur-[4px]">
        <img
          src={playTutorialIconUrl}
          alt=""
          className="absolute left-1/2 top-1/2 size-[22px] -translate-x-1/2 -translate-y-1/2"
        />
      </div>
    </div>
    <div
      aria-hidden="true"
      className="absolute bottom-[10.25px] right-[12px] flex h-[20px] items-center rounded-[4px] bg-[rgba(28,42,33,0.3)] px-[8px]"
    >
      <span className="font-sans text-[10px] font-bold tracking-[0.3px] text-white max-sm:text-[12px]">
        3:12
      </span>
    </div>
    <div
      aria-hidden="true"
      className="absolute left-1/2 top-[188px] flex w-[234px] -translate-x-1/2 flex-col items-center gap-[8px] text-center"
    >
      <span
        className={`${BADGE} text-[19px] font-semibold leading-[1.25] tracking-[-0.5px] text-white/90`}
      >
        {title}
      </span>
      <span className="font-sans text-[10px] font-semibold uppercase tracking-[1.2px] text-white/[0.64] max-sm:text-[12px]">
        Gameplay preview · Coming soon
      </span>
    </div>
  </div>
);

const DetailsView = ({ game, onBack, backRef }) => {
  const [colA, colB] = game.details?.traits ? splitTraitColumns(game.details.traits) : [[], []];
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-[16px] overflow-clip px-[36px] py-[18px] max-sm:px-4">
      <button
        ref={backRef}
        type="button"
        onClick={onBack}
        className={`inline-flex w-fit shrink-0 items-center justify-center gap-[4px] rounded-[4px] font-sans text-[14px] font-medium text-[#387440] ${FOCUS} max-sm:min-h-11`}
      >
        <img src={backArrowUrl} alt="" aria-hidden="true" className="size-[16px]" />
        Back to Game Store
      </button>

      <div className="flex min-h-0 flex-1 flex-col gap-[32px] overflow-y-auto overflow-x-clip py-[16px] no-scrollbar">
        <div className="flex shrink-0 items-center gap-[18px] max-sm:gap-3">
          <img
            src={game.thumb}
            alt=""
            aria-hidden="true"
            className="size-[80px] shrink-0 rounded-full object-cover shadow-[0px_4px_20.1px_4px_rgba(56,116,64,0.23)]"
          />
          <div className="flex min-w-0 flex-col gap-[12px]">
            <h3 className={`${UI} text-[20px] font-semibold leading-[1.2] text-[#1c2a21]`}>
              {game.title}
            </h3>
            <div className="flex flex-wrap items-center gap-x-[12px] gap-y-1">
              <CategoryBadge>{game.category}</CategoryBadge>
              <Dot />
              <span className="font-sans text-[12px] text-[#70706e]">{game.duration}</span>
              <Dot />
              <Difficulty level={game.difficulty} />
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-[18px] pb-[20px]">
          <section className="flex flex-col gap-[12px]">
            <SectionHeading>About this game</SectionHeading>
            <p className="font-sans text-[13.5px] leading-[1.45] text-[#70706e]">
              {game.details?.about ?? game.description}
            </p>
          </section>

          {game.details?.traits && (
            <section className="flex flex-col gap-[12px]">
              <SectionHeading>What we measure</SectionHeading>
              <div className="flex gap-[12px] font-sans text-[13.5px] leading-[1.65] text-[#70706e] max-sm:flex-col max-sm:gap-0">
                {[colA, colB].map((col, i) => (
                  <p key={i} className="min-w-0 flex-1 whitespace-pre-line">
                    {col.map((trait) => `• ${trait}`).join('\n')}
                  </p>
                ))}
              </div>
            </section>
          )}

          {game.details?.howToPlayTips && (
            <section className="flex flex-col gap-[12px]">
              <SectionHeading>How to play</SectionHeading>
              <div className="flex flex-col gap-[22px]">
                <VideoPreview title={game.title} />
                <ol className="flex flex-col gap-[16px]">
                  {game.details.howToPlayTips.map((tip, i) => (
                    <li key={tip.title} className="flex items-center gap-[16px]">
                      <span
                        aria-hidden="true"
                        className={`flex size-[28px] shrink-0 items-center justify-center rounded-[30px] border border-[#c1d4c4] bg-[#ebf1ec] ${BADGE} text-[15px] font-semibold leading-[1.25] tracking-[-0.15px] text-[#142916]`}
                      >
                        {i + 1}
                      </span>
                      <span className="flex min-w-0 flex-col gap-[4px]">
                        <span className={`${UI} text-[13.5px] font-semibold text-[#1c2a21]`}>
                          {tip.title}
                        </span>
                        <span className="font-sans text-[12px] text-[#70706e]">{tip.subtitle}</span>
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

const PlayfulGameStoreModal = ({ open, onClose, onPlayGame }) => {
  const [view, setView] = useState('grid');
  const [selectedGameId, setSelectedGameId] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const dialogRef = useRef(null);
  const searchRef = useRef(null);
  const backRef = useRef(null);
  const lastGameRef = useRef(null);

  useEffect(() => {
    if (open) {
      log('open');
      setView('grid');
      setSelectedGameId(null);
      setSearch('');
      setCategory('All');
    }
  }, [open]);

  usePlayfulDialogA11y({
    open,
    dialogRef,
    onEscape: onClose,
    initialFocus: () => searchRef.current,
    lockScroll: true,
  });

  const filteredGames = useMemo(() => filterGames(GAMES, { search, category }), [search, category]);
  const selectedGame = GAMES.find((g) => g.id === selectedGameId);

  // Move focus with the view: details -> Back button; back to grid -> the card we came from.
  useEffect(() => {
    if (!open) return;
    if (view === 'details') {
      backRef.current?.focus({ preventScroll: true });
    } else if (lastGameRef.current) {
      dialogRef.current
        ?.querySelector(`[data-game-id="${lastGameRef.current}"]`)
        ?.focus({ preventScroll: true });
    }
  }, [view, open]);

  if (!open) return null;

  const handleSelectGame = (id) => {
    log('branch', { gameSelected: id });
    lastGameRef.current = id;
    setSelectedGameId(id);
    setView('details');
  };

  const handleCategory = (cat) => {
    log('branch', { category: cat, results: filterGames(GAMES, { search, category: cat }).length });
    setCategory(cat);
  };

  const details = view === 'details' && selectedGame;

  return createPortal(
    <div
      data-pf-portal
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--pf-games-overlay)] sm:p-[clamp(12px,2vw,32px)]"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pf-game-store-title"
        tabIndex={-1}
        className={`relative flex h-[100dvh] w-full flex-col overflow-hidden bg-white pb-[env(safe-area-inset-bottom)] outline-none sm:h-[min(749px,calc(100dvh-24px))] sm:rounded-[24px] sm:pb-0 ${INK_BORDER} ${SHELF} max-sm:border-0 max-sm:shadow-none forced-colors:border-[CanvasText] ${
          details ? 'sm:w-[600px]' : 'sm:w-[750px]'
        }`}
      >
        <header className="flex shrink-0 items-center justify-between gap-3 border border-[#e6e6e6] bg-[#fefdfa] px-[36px] py-[18px] max-sm:px-4 max-sm:pt-[max(18px,env(safe-area-inset-top))]">
          <div className="flex min-w-0 items-center gap-[8px]">
            <GameStoreDiceIcon className="h-[38px] w-[35px] shrink-0" />
            <div className="flex min-w-0 flex-col gap-[4px]">
              <h2
                id="pf-game-store-title"
                className="font-sans text-[16px] font-bold leading-[normal] text-[#387440]"
              >
                Game Store
              </h2>
              <p className="font-sans text-[12px] leading-[normal] text-[#70706e]">
                {"Pick a game — we'll figure out your personality from how you play"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Game Store"
            className={`relative flex size-[28px] shrink-0 items-center justify-center rounded-[20px] bg-[#ebf1ec] hover:bg-[#dbe9dd] ${FOCUS} before:absolute before:-inset-[8px] before:content-[''] max-sm:size-11 forced-colors:border forced-colors:border-[CanvasText]`}
          >
            <GameStoreCloseIcon className="size-[8px]" />
          </button>
        </header>

        {details ? (
          <DetailsView game={selectedGame} backRef={backRef} onBack={() => setView('grid')} />
        ) : (
          <GridView
            search={search}
            onSearchChange={setSearch}
            category={category}
            onCategoryChange={handleCategory}
            games={filteredGames}
            onSelectGame={handleSelectGame}
            searchRef={searchRef}
          />
        )}

        {details && (
          <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-[#e6e6e6] bg-[#fefdfa] px-[34px] py-[16px] max-sm:flex-col max-sm:items-stretch max-sm:px-4">
            <span className="flex items-center gap-[6px]">
              <GameStoreInfoIcon className="size-[14px] shrink-0" />
              <span className="font-sans text-[12px] text-[#70706e]">
                Use arrow keys to navigate through the game
              </span>
            </span>
            <button
              type="button"
              onClick={() => {
                log('dispatch', { playGame: selectedGame.id });
                onPlayGame(selectedGame);
              }}
              className={`flex items-center justify-center gap-[8px] rounded-[10px] border-x-2 border-b-2 border-t border-[#2a5730] bg-[#387440] px-[18px] py-[10px] [filter:drop-shadow(0_10px_12px_rgba(28,42,33,0.06))_drop-shadow(5px_5px_0_rgba(28,42,33,0.55))] ${FOCUS} focus-visible:outline-offset-4 max-sm:min-h-12 max-sm:[filter:none] forced-colors:border-[CanvasText]`}
            >
              <span className="pf-gradtext font-sans text-[14px] font-bold leading-[24px] tracking-[0.1px]">
                Let’s Play
              </span>
              <img src={letsPlayArrowUrl} alt="" aria-hidden="true" className="h-[10px] w-[14px]" />
            </button>
          </footer>
        )}
      </div>
    </div>,
    document.body
  );
};

export default PlayfulGameStoreModal;
