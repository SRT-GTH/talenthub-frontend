import { debug } from '../../../../../utils/debug.js';
import PatternBead from './PatternBead.jsx';
import PatternJumpMark from './PatternJumpMark.jsx';

const log = debug('PatternPulseBoard');

/*
 * PatternPulseBoard — the bead string (Figma "bead string" 944x180, thread #8a6a3b 3px with a 14px knot at each end; 988px when
 * seven beads share it). Bead size `--s` = the Figma size (104 / 96) shrunk to fit the column:
 *   s = min(smax, min(100cqw, 988px) / (n + .4(n-1) + .96))      (n beads incl. the "?" bead; gap .4s, 0.48s of thread each side)
 * so the board never overflows a phone. Props:
 *   beads   shown beads [{ value, color }]            slot  the "?" bead's state: { timer } while asking, or null
 *   answer  { value, color, mark } once revealed      jumps [{ from, to, label, pattern }] drawn when the rule is revealed
 */
const PatternPulseBoard = ({ beads, slot, answer, jumps, twoPatterns }) => {
  const total = beads.length + 1;
  const smax = total >= 7 ? '96px' : '104px';
  const showJumps = Boolean(jumps?.length);
  log('render', {
    beads: beads.length,
    asking: Boolean(slot),
    revealed: Boolean(answer),
    jumps: jumps?.length ?? 0,
    smax,
  });
  return (
    <div className="@container w-full">
      <div
        className={`relative mx-auto w-full max-w-[var(--wmax)] ${
          total >= 7 ? 'pt-[max(calc(var(--s)*0.625),38px)]' : 'pt-[max(calc(var(--s)*0.54),34px)]'
        } ${
          showJumps && twoPatterns
            ? 'pb-[max(calc(var(--s)*0.54),34px)]'
            : total >= 7
              ? 'pb-[calc(var(--s)*0.208)]'
              : 'pb-[calc(var(--s)*0.19)]'
        }`}
        style={{
          '--n': total,
          '--smax': smax,
          '--g': total >= 7 ? 0.375 : 0.423,
          '--pad': total >= 7 ? 0.52 : 0.48,
          '--s':
            'min(var(--smax), calc(min(100cqw, var(--wmax)) / (var(--n) + var(--g) * (var(--n) - 1) + 2 * var(--pad))))',
          '--wmax': total >= 7 ? '988px' : '944px',
        }}
      >
        <div className="relative flex items-center justify-center">
          <span
            aria-hidden="true"
            className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 rounded-[2px] bg-[#8a6a3b]"
          />
          <span
            aria-hidden="true"
            className="absolute top-1/2 left-0 size-[14px] -translate-y-1/2 rounded-full bg-[#8a6a3b]"
          />
          <span
            aria-hidden="true"
            className="absolute top-1/2 right-0 size-[14px] -translate-y-1/2 rounded-full bg-[#8a6a3b]"
          />
          <div className="relative">
            <ol
              className="m-0 flex list-none items-center p-0"
              style={{ gap: 'calc(var(--s) * var(--g))' }}
              aria-label={`Pattern: ${beads.map((b) => b.value).join(', ')}, then what comes next?`}
            >
              {beads.map((bead) => (
                <li key={bead.position} className="flex">
                  <PatternBead value={bead.value} color={bead.color} />
                </li>
              ))}
              <li
                className="flex"
                aria-label={answer ? `Answer ${answer.value}` : 'Your answer goes here'}
              >
                {answer ? (
                  <PatternBead value={answer.value} color={answer.color} mark={answer.mark} />
                ) : (
                  <PatternBead slot timer={slot?.timer} />
                )}
              </li>
            </ol>
            {showJumps ? (
              <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                {jumps.map((j) => (
                  <PatternJumpMark
                    key={`${j.from}-${j.to}`}
                    from={j.from}
                    to={j.to}
                    label={j.label}
                    below={twoPatterns && j.pattern === 'b'}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatternPulseBoard;
