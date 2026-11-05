import { classNames } from '../../../../utils/classNames.js';
import { GAME_V2_CATEGORIES } from './gamesV2Data.js';
import {
  GvBoltIcon,
  GvBookIcon,
  GvBuildingIcon,
  GvCashIcon,
  GvChartIcon,
  GvGridIcon,
  GvPinIcon,
  GvRepeatIcon,
  GvTargetIcon,
  GvTrendIcon,
  GvTrophyIcon,
  GvWarningIcon,
} from './GamesV2Icons.jsx';

const ICONS = {
  grid: GvGridIcon,
  book: GvBookIcon,
  target: GvTargetIcon,
  trend: GvTrendIcon,
  repeat: GvRepeatIcon,
  bolt: GvBoltIcon,
  building: GvBuildingIcon,
  pin: GvPinIcon,
  chart: GvChartIcon,
  trophy: GvTrophyIcon,
  warning: GvWarningIcon,
  cash: GvCashIcon,
};

/*
 * GameV2Tile — the game's icon tile: category-coloured square (card 56px r15.68, dialog header 72px r20.16 = 0.28 × size), the
 * game icon (28 / 36px, category text colour) and the kente stripe along the bottom edge (Figma `kente stripe`: 56×9 / 72×12,
 * red #d93326 · gold #facc40 · green #387440 in thirds, 85 % opacity). Playful draws a 1px ink@.20 hairline.
 */
const GameV2Tile = ({ game, size = 56 }) => {
  const category = GAME_V2_CATEGORIES[game.category];
  const Glyph = ICONS[game.icon];
  const big = size > 60;
  return (
    <span
      aria-hidden="true"
      data-tile={game.id}
      className={classNames(
        'relative flex shrink-0 items-center justify-center overflow-hidden playful:border playful:border-solid playful:border-[rgba(28,42,33,0.2)]',
        big ? 'size-[72px] rounded-[20.16px]' : 'size-[56px] rounded-[15.68px]'
      )}
      style={{ backgroundColor: category.bg, color: category.fg }}
    >
      {Glyph ? <Glyph className={big ? 'size-[36px]' : 'size-[28px]'} /> : null}
      <span
        className={classNames(
          'absolute inset-x-0 bottom-0 opacity-[0.85] playful:-bottom-px playful:-inset-x-px',
          big ? 'h-[12px]' : 'h-[9px]'
        )}
        style={{
          background: 'linear-gradient(90deg,#d93326 0 33%,#facc40 33% 66%,#387440 66% 100%)',
        }}
      />
    </span>
  );
};

export default GameV2Tile;
