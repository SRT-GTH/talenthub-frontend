import { debug } from '../../../../../utils/debug.js';
import WordTile from './WordTile.jsx';

const log = debug('WordAnswerRow');

/*
 * WordAnswerRow — Figma "answer row" (n tiles of 80px, gap 10) + "answer line" (3px, ink@.12, radius 2, 8px below).
 * Tile size `--t` = min(80px, columns that fit) with a 40px floor; below that the row wraps (phones, 12-letter titles).
 *   slots  [{ letter, tone, onClick?, label? }] — one per letter of the word
 */
const WordAnswerRow = ({ slots }) => {
  const n = slots.length;
  log('render', { n, filled: slots.filter((s) => s.letter).length });
  return (
    <div className="@container w-full">
      <div
        className="mx-auto w-fit max-w-full"
        style={{
          '--n': n,
          '--t':
            'min(80px, max(40px, calc(min(100cqw, 1040px) / (var(--n) + 0.125 * (var(--n) - 1)))))',
        }}
      >
        <ol
          className="m-0 flex list-none flex-wrap justify-center p-0"
          style={{ gap: 'calc(var(--t) * 0.125)' }}
          aria-label="Your word"
        >
          {slots.map((slot, i) => (
            <li key={i} className="flex">
              <WordTile
                letter={slot.letter}
                tone={slot.tone}
                onClick={slot.onClick}
                label={slot.label}
              />
            </li>
          ))}
        </ol>
        <div
          aria-hidden="true"
          className="mt-[8px] h-[3px] w-full rounded-[2px] bg-[rgba(28,42,33,0.12)]"
        />
      </div>
    </div>
  );
};

export default WordAnswerRow;
