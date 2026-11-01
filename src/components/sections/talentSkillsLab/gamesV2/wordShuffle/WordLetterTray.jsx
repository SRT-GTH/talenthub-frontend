import { debug } from '../../../../../utils/debug.js';
import WordTile from './WordTile.jsx';

const log = debug('WordLetterTray');

/*
 * WordLetterTray — Figma "letter tray": 64px tiles, gap 12, padding 18/22, radius 24, fill #f3e7cf + 1px ink@.20 (Playful);
 * Focused fill #f2f5f4, radius 18, no border. A tile that moved to the answer row leaves a grey "used" slot behind.
 *   slots  [{ id, letter, used, onClick }] in the current tray order
 */
const WordLetterTray = ({ slots, disabled }) => {
  const n = slots.length;
  log('render', { n, used: slots.filter((s) => s.used).length });
  return (
    <div className="@container w-full">
      <div
        className="mx-auto w-fit max-w-full rounded-[18px] bg-[#f2f5f4] px-[22px] py-[18px] max-sm:px-[12px] max-sm:py-[12px] playful:rounded-[24px] playful:border playful:border-solid playful:border-[rgba(28,42,33,0.2)] playful:bg-[#f3e7cf]"
        style={{
          '--n': n,
          '--t':
            'min(64px, max(40px, calc((min(100cqw, 1040px) - 44px) / (var(--n) + 0.1875 * (var(--n) - 1)))))',
        }}
      >
        <ul
          className="m-0 flex list-none flex-wrap justify-center p-0"
          style={{ gap: 'calc(var(--t) * 0.1875)' }}
          aria-label="Letters"
        >
          {slots.map((slot) => (
            <li key={slot.id} className="flex">
              <WordTile
                letter={slot.used ? '' : slot.letter}
                tone={slot.used ? 'used' : 'normal'}
                onClick={slot.used ? undefined : slot.onClick}
                label={`Letter ${slot.letter}`}
                disabled={disabled}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WordLetterTray;
