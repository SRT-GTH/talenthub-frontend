import { classNames } from '../../../../utils/classNames.js';
import { MAP_BINS, MAP_SUPPRESSED_BIN } from './mapBins.js';

/*
 * MapLegend — Figma "T8 · Map legend" (8487:346081, 151x206; mobile 8507:125): V gap 16; title "Talents per region" 12/14 600 #595959;
 * six rows (swatch 20x12 r3 + label 13/16 500 #1c2a21, gap 10): Under 6,000 · 6,000 – 9,999 · 10,000 – 14,999 · 15,000 – 29,999 · 30,000+ ·
 * "Fewer than 5 · hidden" (grey swatch #e4e4df, label #595959).
 * Props: title (default "Talents per region"), className. The bins come from mapBins.js (one source for fills and legend).
 * a11y: a list; the swatches are decorative, each row's text names the bin.
 */

const MapLegend = ({ title = 'Talents per region', className }) => (
  <div className={classNames('flex flex-col gap-[16px] font-sans', className)}>
    <p className="m-0 text-[12px] leading-[14px] font-semibold text-[#595959]">{title}</p>
    <ul className="m-0 flex list-none flex-col gap-[16px] p-0">
      {[...MAP_BINS, MAP_SUPPRESSED_BIN].map((bin) => (
        <li key={bin.id} className="flex h-[16px] items-center gap-[10px]">
          <span
            aria-hidden="true"
            className="h-[12px] w-[20px] shrink-0 rounded-[3px]"
            style={{ background: bin.fill }}
          />
          <span
            className={classNames(
              'text-[13px] leading-[16px] font-medium',
              bin.id === 'suppressed' ? 'text-[#595959]' : 'text-[#1c2a21]'
            )}
          >
            {bin.label}
          </span>
        </li>
      ))}
    </ul>
  </div>
);

export default MapLegend;
