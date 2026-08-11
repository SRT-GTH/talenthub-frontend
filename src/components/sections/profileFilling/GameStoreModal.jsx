import { useEffect, useMemo, useState } from 'react';
import Modal from '../../ui/Modal.jsx';
import Button from '../../ui/Button.jsx';
import { debug } from '../../../utils/debug.js';
import { GAMES, GAME_CATEGORIES, DIFFICULTY_COLORS } from './gameStoreData.js';
import {
  GameStoreDiceIcon,
  GameStoreCloseIcon,
  GameStoreInfoIcon,
  GameStoreArrowIcon,
  ArrowLeftIcon,
} from '../../shared/assets.jsx';
import searchIconUrl from '../../../assets/games/game-store/search-icon.svg';
import playArrowIconUrl from '../../../assets/games/game-store/play-arrow.svg';
import playTutorialIconUrl from '../../../assets/games/game-store/play-tutorial-icon.svg';
import howToPlayPreviewBg from '../../../assets/games/game-store/how-to-play-preview-bg.png';

const log = debug('GameStoreModal');

/*
 * GameStoreModal — Figma 5132:60815 ("All Games" / Game Store) and
 * 5473:48185-48285 ("Game details" — Escape Room's detail screen).
 * A browsable catalog (search + category filter + 7-card grid) that
 * drills into a per-game details view via internal `view` state, reusing
 * the generic `Modal` primitive for the backdrop/portal/ESC-close/
 * scroll-lock plumbing rather than duplicating it (see ui/Modal.jsx).
 *
 * The modal's OUTER box is a FIXED height (`!h-[648px]` on Modal's
 * contentClassName) — not Modal's default auto-height-up-to-90vh. Both
 * views render inside ONE `flex h-full flex-col` wrapper with three
 * regions: a pinned top (Header, plus the "← Back to Game Store" row in
 * details view), a `flex-1 min-h-0 overflow-y-auto` MIDDLE that's the
 * only thing that ever scrolls, and — details view only — a pinned
 * bottom footer with the "Let's Play →" CTA. An earlier pass let each
 * view size itself from its own content, which (a) made the modal grow
 * taller on the details view than the grid view, (b) let the back
 * button and footer scroll away with the rest of the content, and (c)
 * caused Modal's own generic "scroll down" chevron affordance to kick in
 * (and render badly) once content occasionally exceeded the old 90vh
 * cap — none of that happens now since the wrapper exactly fills the
 * fixed height and Modal's own scroll container never itself overflows.
 *
 * Every image/icon here is the REAL Figma asset, downloaded from the
 * Figma Dev Mode MCP server's local asset proxy immediately after each
 * successful call (the proxy URLs are short-lived per-call, not stable,
 * so assets get pulled into the repo right away rather than referenced
 * live): 7 per-game thumbnails (gameStoreData.js), the header dice icon,
 * the header/detail-header close icon, the search icon, the card/CTA
 * arrow icon, the "how to play" video-preview background + play glyph,
 * and the footer info + arrow icons. Nothing in this component is
 * hand-crafted anymore.
 *
 * The Header (dice icon + "Game Store" + subtitle + close) is IDENTICAL
 * in both `view` states per Figma (5473:48186 appears unchanged on the
 * Game Details screen too) — it does NOT switch to show the selected
 * game's name.
 *
 * Gameplay itself is real for The Escape Room only (see
 * EscapeRoomGame.jsx) — the other 6 games' "Let's Play →" still surfaces
 * a "coming soon" toast via `onPlayGame`, since no gameplay exists for
 * them in Figma at all.
 *
 * Only "The Escape Room" has real extracted Figma copy for the deeper
 * detail sections (About/What we measure/How to play) — the other 6
 * games only have card-level fields (title/description/category/
 * difficulty/duration). Those sections are omitted entirely for games
 * without `details`, rather than fabricating content Figma never
 * specified for them.
 */

// Figma's section headings (5473:48217-48219 etc.) all pair a 12px label
// with a FIXED 30px underline, not a full-width divider.
const SectionHeading = ({ children }) => (
  <span className="flex items-center gap-[4px]">
    <span className="font-sans text-[12px] font-medium text-[#224626]">{children}</span>
    <span className="h-[1.25px] w-[30px] shrink-0 bg-[#c1d4c4]" />
  </span>
);

// Small round dot separator between badge-row items (5473:48211/48213).
const BadgeDot = () => <span className="size-[3px] shrink-0 rounded-full bg-[#737373]" />;

const GameCard = ({ game, onSelect }) => (
  <button
    type="button"
    onClick={() => onSelect(game.id)}
    className="flex items-start justify-between gap-[16px] rounded-[10px] border border-[#e5e5e5] px-[16px] py-[14px] text-left hover:border-brand-green"
  >
    <img
      src={game.thumb}
      alt=""
      aria-hidden="true"
      className="size-[53px] shrink-0 rounded-full object-cover shadow-[0px_4px_20.1px_4px_rgba(56,116,64,0.23)]"
    />
    <span className="flex w-[228px] flex-col gap-[6px]">
      <span className="inline-flex w-fit items-center rounded-[30px] border border-[#c1d4c4] bg-[#ebf1ec] px-[8px] py-[2px] font-display italic text-[12px] tracking-[-0.12px] text-[#142916]">
        {game.category}
      </span>
      <span className="flex flex-col gap-[8px]">
        <span className="flex flex-col gap-[4px]">
          <span className="font-sans text-[14px] font-semibold text-[#111]">{game.title}</span>
          <span className="font-sans text-[12px] leading-[1.3] text-[#70706e]">
            {game.description}
          </span>
        </span>
        <span className="font-sans text-[12px] text-[#70706e]">
          {'Difficulty: '}
          <span style={{ color: DIFFICULTY_COLORS[game.difficulty] }}>{game.difficulty}</span>
        </span>
      </span>
      <span className="flex items-center justify-between border-t border-[#f1f5f9] pt-[10px]">
        <span className="font-sans text-[12px] font-medium text-brand-green">{game.duration}</span>
        <span className="inline-flex items-center gap-[4px] font-sans text-[12px] font-medium text-brand-green">
          Play
          <img src={playArrowIconUrl} alt="" aria-hidden="true" className="size-[16px]" />
        </span>
      </span>
    </span>
  </button>
);

// Grid view's body — search, category chips, and the (internally
// scrolling, fixed-height) card grid. Rendered inside the shared
// scrollable middle region.
const GameGrid = ({ search, onSearchChange, category, onCategoryChange, games, onSelectGame }) => (
  <div className="flex flex-col gap-[20px] px-[36px] py-[18px]">
    <div className="flex flex-col gap-[20px]">
      <div className="flex items-center gap-[8px] rounded-[10px] border border-[#ccc] bg-white px-[18px] py-[12px] shadow-[0px_2.5px_0px_0px_rgba(191,191,191,0.8)]">
        <img src={searchIconUrl} alt="" aria-hidden="true" className="size-[16px]" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Find a game..."
          className="w-full border-none font-sans text-[14px] tracking-[0.2px] text-[#595959] outline-none placeholder:text-[#595959]"
        />
      </div>
      <div className="flex flex-wrap items-center gap-[8px]">
        {GAME_CATEGORIES.map((cat) => (
          <Button
            key={cat}
            variant="chip"
            size="sm"
            state={category === cat ? 'active' : undefined}
            onClick={() => onCategoryChange(cat)}
          >
            {cat}
          </Button>
        ))}
      </div>
    </div>

    {/* Fixed h-[441px] (not max-h) — Figma's grid area stays a constant
        size regardless of how many cards match a filter, with its own
        internal scroll (7 cards genuinely exceed 441px even unfiltered). */}
    <div className="grid h-[441px] grid-cols-2 content-start gap-[10px] overflow-y-auto no-scrollbar">
      {games.map((game) => (
        <GameCard key={game.id} game={game} onSelect={onSelectGame} />
      ))}
      {games.length === 0 && (
        <p className="col-span-2 py-8 text-center font-sans text-[14px] text-[#70706e]">
          No games match “{search}”.
        </p>
      )}
    </div>
  </div>
);

// Details view's body — icon/title/badges, About/What we measure/How to
// play. No back button and no footer here — those are pinned top/bottom
// by the parent, outside this scrollable region.
const GameDetailsBody = ({ game }) => (
  <div className="flex flex-col gap-[20px] px-[36px] py-[18px]">
    <div className="flex items-center gap-[18px]">
      <img
        src={game.thumb}
        alt=""
        aria-hidden="true"
        className="size-[80px] shrink-0 rounded-full object-cover shadow-[0px_4px_20.1px_4px_rgba(56,116,64,0.23)]"
      />
      <div className="flex flex-col gap-[12px]">
        <span className="font-sans text-[20px] font-semibold text-[#111]">{game.title}</span>
        <span className="flex items-center gap-[12px]">
          <span className="inline-flex items-center rounded-[30px] border border-[#c1d4c4] bg-[#ebf1ec] px-[8px] py-[2px] font-display italic text-[12px] tracking-[-0.12px] text-[#142916]">
            {game.category}
          </span>
          <BadgeDot />
          <span className="font-sans text-[12px] text-[#70706e]">{game.duration}</span>
          <BadgeDot />
          <span className="font-sans text-[12px] text-[#70706e]">
            {'Difficulty: '}
            <span style={{ color: DIFFICULTY_COLORS[game.difficulty] }}>{game.difficulty}</span>
          </span>
        </span>
      </div>
    </div>

    <div className="flex flex-col gap-[12px]">
      <SectionHeading>About this game</SectionHeading>
      <p className="font-sans text-[13.5px] leading-[1.45] text-[#70706e]">
        {game.details?.about ?? game.description}
      </p>
    </div>

    {game.details?.traits && (
      <div className="flex flex-col gap-[12px]">
        <SectionHeading>What we measure</SectionHeading>
        <div className="grid grid-cols-2 gap-x-[12px] gap-y-[6px]">
          {game.details.traits.map((trait) => (
            <span key={trait} className="font-sans text-[13.5px] leading-[1.65] text-[#70706e]">
              • {trait}
            </span>
          ))}
        </div>
      </div>
    )}

    {game.details?.howToPlayTips && (
      <div className="flex flex-col gap-[12px]">
        <SectionHeading>How to play</SectionHeading>

        {/* Video preview (Figma 5473:48228-48245): real evidence-board
            background image, a centered glassmorphism play button inside
            a horizontally-centered 488px darkened/blurred band (not full
            width — Figma's own spec), duration badge bottom-right, title
            + "Gameplay preview · Coming soon" overlay text. */}
        <div className="relative h-[257px] w-full overflow-hidden rounded-[16px]">
          <img
            src={howToPlayPreviewBg}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 size-full object-cover"
          />
          <div className="absolute left-1/2 top-0 h-full w-[488px] -translate-x-1/2 overflow-hidden bg-black/20 backdrop-blur-[1.4px]">
            <div className="absolute left-1/2 top-1/2 flex size-[56px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[30px] border border-white/25 bg-white/[0.29] opacity-[0.56] backdrop-blur-[4px]">
              <img src={playTutorialIconUrl} alt="" aria-hidden="true" className="size-[22px]" />
            </div>
          </div>
          <div className="absolute bottom-[10px] right-[12px] flex h-[20px] items-center rounded-[4px] bg-black/30 px-[8px]">
            <span className="font-sans text-[10px] font-bold tracking-[0.3px] text-white">
              3:12
            </span>
          </div>
          <div className="absolute left-1/2 top-[188px] flex w-[234px] -translate-x-1/2 flex-col items-center gap-[8px]">
            <span className="font-display italic text-[20px] tracking-[-0.5px] text-white/90">
              {game.title}
            </span>
            <span className="font-sans text-[10px] font-semibold uppercase tracking-[1.2px] text-white/[0.64]">
              Gameplay preview · Coming soon
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-[16px]">
          {game.details.howToPlayTips.map((tip, i) => (
            <div key={tip.title} className="flex items-center gap-[16px]">
              <span className="flex size-[28px] shrink-0 items-center justify-center rounded-[30px] border border-[#c1d4c4] bg-[#ebf1ec] font-display italic text-[16px] tracking-[-0.16px] text-[#142916]">
                {i + 1}
              </span>
              <span className="flex flex-col gap-[4px]">
                <span className="font-sans text-[13.5px] font-semibold text-[#111]">
                  {tip.title}
                </span>
                <span className="font-sans text-[12px] text-[#70706e]">{tip.subtitle}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

const GameStoreModal = ({ open, onClose, onPlayGame }) => {
  const [view, setView] = useState('grid');
  const [selectedGameId, setSelectedGameId] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    if (open) {
      log('open');
      setView('grid');
      setSelectedGameId(null);
      setSearch('');
      setCategory('All');
    }
  }, [open]);

  const filteredGames = useMemo(
    () =>
      GAMES.filter((game) => {
        const matchesSearch = game.title.toLowerCase().includes(search.trim().toLowerCase());
        const matchesCategory = category === 'All' || game.category === category;
        return matchesSearch && matchesCategory;
      }),
    [search, category]
  );

  const selectedGame = GAMES.find((game) => game.id === selectedGameId);

  const handleSelectGame = (gameId) => {
    log('branch', { gameSelected: gameId });
    setSelectedGameId(gameId);
    setView('details');
  };

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      showClose={false}
      ariaLabel="Game Store"
      contentClassName="!h-[648px] !max-w-[750px] !rounded-[24px] !overflow-hidden p-0"
    >
      <div className="flex h-full flex-col">
        {/* Pinned top — Header is IDENTICAL across both views (Figma
            5473:48186 shows the same "Game Store" title/subtitle on the
            Game Details screen too, it does NOT switch to the selected
            game's name), plus the "← Back to Game Store" row in details
            view. Neither ever scrolls with the middle content. */}
        <div className="shrink-0 flex items-center justify-between border border-[#e6e6e6] bg-[#fefdfa] px-[36px] py-[18px]">
          <div className="flex items-center gap-[8px]">
            <GameStoreDiceIcon className="h-[38px] w-[35px]" />
            <div className="flex flex-col gap-[4px]">
              <span className="font-sans text-[16px] font-bold text-brand-green">Game Store</span>
              <span className="font-sans text-[12px] text-[#70706e]">
                {"Pick a game — we'll figure out your personality from how you play"}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Game Store"
            className="flex size-[28px] items-center justify-center rounded-[20px] bg-[#ebf1ec] hover:bg-[#dbe9dd]"
          >
            <GameStoreCloseIcon className="size-[8px]" />
          </button>
        </div>

        {view === 'details' && (
          <div className="shrink-0 border-b border-[#e6e6e6] bg-[#fefdfa] px-[36px] py-[14px]">
            <button
              type="button"
              onClick={() => setView('grid')}
              className="inline-flex w-fit items-center gap-[6px] font-sans text-[14px] text-[#575755] hover:text-brand-green"
            >
              <ArrowLeftIcon className="size-[16px]" /> Back to Game Store
            </button>
          </div>
        )}

        {/* Scrollable middle — the ONLY region that ever scrolls. */}
        <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar">
          {view === 'grid' ? (
            <GameGrid
              search={search}
              onSearchChange={setSearch}
              category={category}
              onCategoryChange={setCategory}
              games={filteredGames}
              onSelectGame={handleSelectGame}
            />
          ) : (
            selectedGame && <GameDetailsBody game={selectedGame} />
          )}
        </div>

        {/* Pinned bottom — details view only (Figma 5473:48279-48285): real
            info icon + hint text, and the shared Button `primary` variant
            — its green/border-dark/drop-shadow colors (#387440 / #2a5730 /
            #224626) and peach→mint gradient text are an exact match for
            this CTA, so no bespoke styling or new variant was needed. */}
        {view === 'details' && selectedGame && (
          <div className="shrink-0 flex items-center justify-between border-t border-[#e6e6e6] bg-[#fefdfa] px-[34px] py-[16px]">
            <span className="flex items-center gap-[6px]">
              <GameStoreInfoIcon className="size-[14px]" />
              <span className="font-sans text-[12px] text-[#70706e]">
                Use arrow keys to navigate through the game
              </span>
            </span>
            <Button
              variant="primary"
              size="sm"
              className="!py-[10px]"
              rightIcon={<GameStoreArrowIcon className="size-full" />}
              onClick={() => onPlayGame(selectedGame)}
            >
              {"Let's Play"}
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default GameStoreModal;
