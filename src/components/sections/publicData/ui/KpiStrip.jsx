import { Children } from 'react';
import { classNames } from '../../../../utils/classNames.js';

/*
 * KpiStrip — the "KPI row" container of Figma 8487:346010 (1360x286: white, 1px #e7e7e7, r24, shadow; HeroMetric 440 | 1px divider (120 high) |
 * three KpiTile 305 each); region page "Hero row" 8493:1733; outcomes KPI row 8496:105 (four tiles, no hero, 168 high).
 *   >= xl : one row — hero 440 + tiles share the rest, 1px dividers 120px high between cells
 *   md..xl: ⚠️ ASSUMPTION — hero full width on top, the tiles in a 3-column row below (the tablet frame 8508:350960 draws the tiles 296px wide
 *           but wrapped 2 + 1 inside an 888x618 frame, which looks like an auto-layout accident; reported to the lead)
 *   < md  : no container (the mobile frame): hero as its own r20 card, tiles as a 2x2 grid of separate white cards, gap 10
 * Props: hero (node, a <HeroMetric/>), children (the <KpiTile/>s), columns (tiles per row at >= md, default = number of tiles, max 4), className
 */

const KpiStrip = ({ hero, children, columns, className }) => {
  const tiles = Children.toArray(children);
  const cols = Math.min(4, columns ?? tiles.length ?? 3);
  const grid = cols >= 4 ? 'md:grid-cols-4' : cols === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3';
  return (
    <div
      className={classNames(
        'flex min-w-0 flex-col gap-[16px] font-sans',
        'md:gap-0 md:overflow-hidden md:rounded-[24px] md:border md:border-solid md:border-[#e7e7e7] md:bg-white md:shadow-[0_5px_17px_rgba(0,0,0,0.04)]',
        hero && 'xl:flex-row',
        className
      )}
    >
      {hero && <div className="min-w-0 xl:w-[440px] xl:shrink-0">{hero}</div>}
      <div className={classNames('grid min-w-0 grid-cols-2 gap-[10px] md:gap-0 xl:flex-1', grid)}>
        {tiles.map((tile, i) => (
          <div
            key={tile.key ?? i}
            className={classNames(
              'relative min-w-0 md:flex md:items-center',
              'md:before:absolute md:before:top-1/2 md:before:left-0 md:before:h-[120px] md:before:w-px md:before:-translate-y-1/2 md:before:bg-[#e7e7e7] md:before:content-[""]',
              i % cols === 0 && 'md:before:hidden',
              hero && i === 0 && 'xl:before:block'
            )}
          >
            <div className="w-full">{tile}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KpiStrip;
