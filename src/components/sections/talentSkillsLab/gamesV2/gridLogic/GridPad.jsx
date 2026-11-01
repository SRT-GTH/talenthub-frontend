import { classNames } from '../../../../../utils/classNames.js';
import { debug } from '../../../../../utils/debug.js';
import { FOCUS_RING } from '../../labPlayStyles.js';
import { GridEraseIcon, GridNotesIcon } from './GridGlyphs.jsx';

const log = debug('GridPad');

/*
 * GridPad — "PICK A NUMBER" + the digit keys + Notes / Erase + the rule line (Figma "number pad").
 * From lg up it is drawn exactly as the frames are: the white "PICK A NUMBER" bar is the 300 / 280 / 260px card (43px high, Focused
 * 42), and the keys, tools and rule line follow it 6px below on the page (in Figma the card is clipped to the label's height and the
 * rest overflows it — kept as drawn). Below lg everything sits inside one card so the pad stays a single tidy block.
 *   layout { cols, keyW, keyH, padW, mobileKeyH }
 *   GL 6x6  76x64, 3 per row, pad 300     GL 9x9  64x64, 3 per row, pad 280     SG 4x4  96x96, 2 per row, pad 260
 *   Playful key: 1.5px ink@.55 border, r16, 0/4 hard shadow, Bricolage 26;  Focused key: 1px #dee5e0, r12, no shadow, 24px.
 */
const KEY =
  'm-0 flex cursor-pointer items-center justify-center rounded-[12px] border border-solid border-[#dee5e0] bg-white p-0 font-sans text-[24px] leading-[29px] font-semibold text-[#1c2a21] transition-transform duration-100 select-none disabled:cursor-default disabled:opacity-60 motion-reduce:transition-none max-lg:h-[var(--key-mh)] lg:shrink-0 lg:[height:var(--key-h)] lg:[width:var(--key-w)] playful:rounded-[16px] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:font-heading playful:text-[26px] playful:leading-[31px] playful:shadow-[0_4px_0_rgba(28,42,33,0.45)] playful:active:translate-y-[3px] playful:active:shadow-[0_1px_0_rgba(28,42,33,0.45)]';
const TOOL =
  'm-0 inline-flex min-h-[34px] min-w-0 flex-1 cursor-pointer items-center justify-center gap-[6px] rounded-full border-0 px-[12px] py-[9px] font-sans text-[13.5px] leading-[16px] font-semibold disabled:cursor-default max-lg:text-[12px]';

const GridPad = ({
  size,
  layout,
  notesOn,
  disabled = false,
  onDigit,
  onErase,
  onToggleNotes,
  hint,
}) => {
  const { cols, keyW, keyH, padW, mobileKeyH } = layout;
  log('render', { size, notesOn, disabled, cols, keyW, keyH });
  const digits = Array.from({ length: size }, (_, i) => i + 1);
  const rows = [];
  for (let i = 0; i < digits.length; i += cols) rows.push(digits.slice(i, i + cols));
  const NotesGlyph = GridNotesIcon;
  const EraseGlyph = GridEraseIcon;

  return (
    <div
      role="group"
      aria-label="Number pad"
      className={classNames(
        'flex w-full max-w-[428px] flex-col lg:max-w-none lg:[width:var(--pad-w)]',
        'max-lg:rounded-[18px] max-lg:border max-lg:border-solid max-lg:border-[#dee5e0] max-lg:bg-white max-lg:px-[16px] max-lg:pt-[14px] max-lg:pb-[16px]',
        'playful:max-lg:rounded-[24px] playful:max-lg:border-[1.5px] playful:max-lg:border-[rgba(28,42,33,0.55)] playful:max-lg:shadow-[0_4px_0_rgba(28,42,33,0.45)]'
      )}
      style={{
        '--pad-w': `${padW}px`,
        '--key-w': `${keyW}px`,
        '--key-h': `${keyH}px`,
        '--key-mh': `${mobileKeyH}px`,
      }}
    >
      <p
        className={classNames(
          'm-0 font-sans text-[12px] leading-[14px] font-bold tracking-[0.06em] text-[#6b706e] uppercase',
          'lg:h-[42px] lg:rounded-[18px] lg:border lg:border-solid lg:border-[#dee5e0] lg:bg-white lg:px-[20px] lg:pt-[20px]',
          'playful:lg:h-[43px] playful:lg:rounded-[24px] playful:lg:border-[1.5px] playful:lg:border-[rgba(28,42,33,0.55)] playful:lg:shadow-[0_4px_0_rgba(28,42,33,0.45)]'
        )}
      >
        Pick a number
      </p>
      <div className="mt-[14px] flex flex-col gap-[14px] lg:mt-[6px] lg:px-[20px]">
        <div className="flex flex-col gap-[10px] lg:gap-[14px]">
          {rows.map((row) => (
            <div
              key={row[0]}
              className="grid gap-[10px] lg:flex"
              style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
            >
              {row.map((d) => (
                <button
                  key={d}
                  type="button"
                  disabled={disabled}
                  aria-label={`Number ${d}`}
                  onClick={() => onDigit(d)}
                  className={classNames(KEY, FOCUS_RING)}
                >
                  {d}
                </button>
              ))}
            </div>
          ))}
        </div>
        <div className="flex gap-[10px]">
          <button
            type="button"
            disabled={disabled}
            aria-pressed={notesOn}
            onClick={onToggleNotes}
            className={classNames(
              TOOL,
              notesOn
                ? 'border-[1.5px] border-solid border-[#387440] bg-[#e2f1e4] text-[#27522e]'
                : 'bg-[#f2f5f4] text-[#1c2a21]',
              FOCUS_RING
            )}
          >
            <NotesGlyph className="size-[16px] shrink-0" />
            {notesOn ? 'Notes on' : 'Notes'}
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={onErase}
            className={classNames(TOOL, 'bg-[#f2f5f4] text-[#1c2a21]', FOCUS_RING)}
          >
            <EraseGlyph className="size-[16px] shrink-0" />
            Erase
          </button>
        </div>
        <p className="m-0 font-sans text-[12.5px] leading-[18px] font-normal text-[#6b6b6b] max-lg:text-[12px]">
          {hint}
        </p>
      </div>
    </div>
  );
};

export default GridPad;
