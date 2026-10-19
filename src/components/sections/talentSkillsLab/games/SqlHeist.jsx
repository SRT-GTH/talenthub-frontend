import { useEffect, useMemo, useReducer, useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { FOCUS_RING } from '../labPlayStyles.js';
import { GameKeyIcon, GameUsersIcon, GameViewTableIcon } from '../skillGames/GameIcons.jsx';
import { GameFrame, GameHead } from '../skillGames/gameKit.jsx';
import { INK, MONO, buildGameResult, topicRowsFor } from '../skillGames/gameKitUtils.js';
import { SQL_CLUES, SQL_FRAMES, SQL_HEIST } from '../skillGames/sqlHeistData.js';

const log = debug('SqlHeist');

/*
 * SQL Heist (`/skills-lab/games/sql-heist`) — Figma SL-GS04 "Clue 3" (Playful 7943:7270 / Focused 8110:495932). ?f=GS04 boots it.
 * Loop per clue: pick a clause from "Drag in:" (click it, or drag it) → drop it in the empty slot of the query → "Run query"
 * previews the rows → when the preview is the answer, "Lock in suspect" cracks the clue → next clue … clue 5 → results
 * (pass 4 of 5 = Verified). "Peek at the schema" highlights the Tables row. Data + assumptions: sqlHeistData.js.
 */

const KEY = { k: 'text-[#ffd86b]' };

/* ---------- query ---------- */
const FilledChip = ({ children, onClick, removable }) => {
  const className = classNames(
    'inline-flex items-center rounded-[8px] bg-[#387440] px-[10px] py-[3px] text-[15px] leading-[20px] text-white max-lg:text-[14px]',
    INK
  );
  if (!removable) {
    return (
      <span className={className} style={{ fontFamily: MONO }}>
        {children}
      </span>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      title="Remove this clause"
      className={classNames(className, 'cursor-pointer', FOCUS_RING)}
      style={{ fontFamily: MONO }}
    >
      {children}
    </button>
  );
};

const QueryLine = ({ n, children }) => (
  <div className="flex items-center gap-[10px]">
    <span
      aria-hidden="true"
      className="w-[9px] shrink-0 text-[14px] leading-[18px] text-[#595959] max-lg:text-[12px]"
      style={{ fontFamily: MONO }}
    >
      {n}
    </span>
    <div
      className="min-w-0 flex-1 text-[16px] leading-[21px] whitespace-pre-wrap text-white max-lg:text-[14px]"
      style={{ fontFamily: MONO }}
    >
      {children}
    </div>
  </div>
);

const Slot = (props) => {
  const { token, held, onDrop, onClear } = props;
  const [over, setOver] = useState(false);
  if (token !== null) {
    return (
      <FilledChip removable onClick={onClear}>
        {token}
      </FilledChip>
    );
  }
  return (
    <button
      type="button"
      onClick={onDrop}
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        onDrop(Number(e.dataTransfer.getData('text/plain')));
      }}
      aria-label={held ? 'Drop the clause here' : 'Empty slot: pick a clause first'}
      className={classNames(
        'inline-flex cursor-pointer items-center rounded-[8px] border-[1.5px] border-dashed border-[#84cc16] bg-[#2a5730] px-[14px] py-[5px] font-sans text-[13px] leading-[16px] font-semibold text-[#c1d4c4]',
        over && 'bg-[#387440]',
        FOCUS_RING
      )}
    >
      drop a clause here
    </button>
  );
};

const QueryEditor = ({ clue, slot, held, onDrop, onClear }) => (
  <div
    className="flex flex-col gap-[6px] rounded-[24px] border border-solid border-[rgba(28,42,33,0.12)] bg-[#142916] p-[20px]"
    role="group"
    aria-label="Query"
  >
    {clue.lines.map((line, i) => (
      <QueryLine key={i} n={i + 1}>
        {line.map(([text, tone], k) =>
          tone === 'fill' ? (
            <FilledChip key={k}>{text}</FilledChip>
          ) : (
            <span key={k} className={tone ? KEY[tone] : undefined}>
              {text}
            </span>
          )
        )}
      </QueryLine>
    ))}
    <QueryLine n={clue.lines.length + 1}>
      <Slot
        token={slot === null ? null : clue.tokens[slot].label}
        held={held !== null}
        onDrop={onDrop}
        onClear={onClear}
      />
    </QueryLine>
  </div>
);

/* ---------- clauses ---------- */
const TokenBank = ({ clue, held, slot, onHold }) => (
  <div className="flex flex-wrap items-center gap-[10px]">
    <span className="font-sans text-[13.5px] leading-[16px] font-semibold text-[#595959]">
      Drag in:
    </span>
    {clue.tokens.map((token, i) => {
      const isHeld = held === i;
      const used = slot === i;
      return (
        <button
          key={token.label}
          type="button"
          draggable={!used}
          onDragStart={(e) => {
            e.dataTransfer.setData('text/plain', String(i));
            onHold(i, true);
          }}
          onClick={() => onHold(i)}
          aria-pressed={isHeld}
          disabled={used}
          className={classNames(
            'rounded-[10px] px-[12px] py-[7px] text-[13.5px] leading-[18px] text-[#1c2a21] max-lg:text-[14px]',
            INK,
            isHeld ? 'rotate-[3deg] bg-[#ffd86b] py-[10px]' : 'bg-white',
            used ? 'cursor-default opacity-40' : 'cursor-pointer',
            FOCUS_RING
          )}
          style={{ fontFamily: MONO }}
        >
          {token.label}
        </button>
      );
    })}
  </div>
);

/* ---------- preview ---------- */
const Preview = ({ result }) => (
  <div
    className="overflow-hidden rounded-[24px] border border-solid border-[rgba(28,42,33,0.1)] bg-white playful:border-[1.5px] playful:border-[rgba(28,42,33,0.2)]"
    aria-live="polite"
    aria-label="Query result"
  >
    {result.error ? (
      <p className="m-0 px-[16px] py-[14px] font-sans text-[14px] leading-[18px] font-semibold text-[#902b20]">
        {result.error}
      </p>
    ) : (
      <table className="w-full table-fixed border-collapse text-left" style={{ fontFamily: MONO }}>
        <thead>
          <tr className="bg-[#f8f8f4]">
            {result.cols.map((col) => (
              <th
                key={col}
                scope="col"
                className="px-[16px] py-[10px] text-[13px] leading-[17px] font-normal text-[#595959] max-lg:text-[12px]"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {result.rows.map((row, r) => (
            <tr key={r} className="border-t border-solid border-[rgba(28,42,33,0.08)]">
              {row.map((cell, c) => (
                <td
                  key={c}
                  className="px-[16px] py-[9px] text-[14px] leading-[18px] text-[#1c2a21] max-lg:text-[14px]"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
          {result.rows.length === 0 ? (
            <tr className="border-t border-solid border-[rgba(28,42,33,0.08)]">
              <td
                colSpan={result.cols.length}
                className="px-[16px] py-[9px] text-[14px] leading-[18px] text-[#595959]"
              >
                0 rows
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    )}
  </div>
);

/* ---------- state ---------- */
const fresh = (runKey = 0) => ({
  clue: 0,
  results: [],
  held: null,
  slot: null,
  ran: null,
  misses: 0,
  phase: 'playing',
  runKey,
});

const fromFrame = (code) => {
  const seed = code ? SQL_FRAMES[code] : null;
  return seed ? { ...fresh(), ...seed } : fresh();
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'hold':
      if (state.phase !== 'playing') return state;
      if (action.force) return { ...state, held: action.index };
      return { ...state, held: state.held === action.index ? null : action.index };
    case 'drop': {
      if (state.phase !== 'playing' || state.slot !== null) return state;
      const index = action.index ?? state.held;
      if (index === null || index === undefined || Number.isNaN(index)) return state;
      return { ...state, slot: index, held: null, ran: null };
    }
    case 'clear':
      return { ...state, slot: null, ran: null };
    case 'run': {
      const clue = SQL_CLUES[state.clue];
      if (state.phase !== 'playing') return state;
      if (state.slot === null) return { ...state, ran: { token: null, result: clue.base } };
      const result = clue.tokens[state.slot].run;
      const wrong = state.slot !== clue.answer;
      return {
        ...state,
        misses: wrong ? state.misses + 1 : state.misses,
        ran: { token: state.slot, result },
      };
    }
    case 'lock': {
      const clue = SQL_CLUES[state.clue];
      if (state.phase !== 'playing' || !state.ran || state.ran.token !== clue.answer) return state;
      const results = [...state.results];
      results[state.clue] = state.misses <= SQL_HEIST.maxMisses ? 'ok' : 'bad';
      if (state.clue + 1 >= SQL_HEIST.total) return { ...state, results, phase: 'finished' };
      return {
        ...state,
        results,
        clue: state.clue + 1,
        held: null,
        slot: null,
        ran: null,
        misses: 0,
      };
    }
    case 'restart':
      return fresh(state.runKey + 1);
    default:
      return state;
  }
};

const SqlHeist = ({ frame }) => {
  const [state, dispatch] = useReducer(reducer, frame, fromFrame);
  const [resultOpen, setResultOpen] = useState(true);
  const [peek, setPeek] = useState(false);
  const clue = SQL_CLUES[state.clue];
  const finished = state.phase === 'finished';
  const cracked = state.results.filter((r) => r === 'ok').length;
  const passed = cracked >= SQL_HEIST.passMark;
  const solved = Boolean(state.ran) && state.ran.token === clue.answer;

  useEffect(() => {
    log('mount', { frame });
  }, [frame]);

  useEffect(() => {
    if (!peek) return undefined;
    const timer = setTimeout(() => setPeek(false), 1400);
    return () => clearTimeout(timer);
  }, [peek]);

  const result = useMemo(() => {
    if (!finished) return null;
    return buildGameResult({
      skill: SQL_HEIST.skill,
      gameName: SQL_HEIST.label,
      verb: 'cracked',
      noun: 'clues',
      statLabel: 'CLUES CRACKED',
      correct: cracked,
      total: SQL_HEIST.total,
      passMark: `${SQL_HEIST.passMark} of ${SQL_HEIST.total}`,
      passed,
      earned: cracked * SQL_HEIST.clueXp + (passed ? SQL_HEIST.passBonusXp : 0),
      dots: state.results.map((r) => (r === 'ok' ? 'ok' : 'bad')),
      topics: topicRowsFor(SQL_CLUES, state.results, 'Clue'),
    });
  }, [finished, cracked, passed, state.results]);

  const dots = Array.from({ length: SQL_HEIST.total }, (_, i) => {
    if (state.results[i]) return { state: state.results[i], label: String(i + 1) };
    if (!finished && i === state.results.length) return { state: 'now', label: String(i + 1) };
    return { state: 'todo', label: String(i + 1) };
  });

  const resolved = state.results.length;
  const isLast = state.clue + 1 >= SQL_HEIST.total;
  const footer = {
    link: { label: 'Peek at the schema', onClick: () => setPeek(true) },
    secondary: { label: 'Run query', onClick: () => dispatch({ type: 'run' }) },
    primary: {
      label: isLast ? 'Close the case' : 'Lock in suspect',
      disabled: !solved,
      onClick: () => dispatch({ type: 'lock' }),
    },
  };

  return (
    <GameFrame
      game={{
        title: SQL_HEIST.title,
        label: SQL_HEIST.label,
        subtitle: SQL_HEIST.subtitle,
        sticker: `CLUE ${Math.min(state.clue + 1, SQL_HEIST.total)} OF ${SQL_HEIST.total}`,
      }}
      xp={
        finished
          ? SQL_HEIST.baseXp +
            (passed
              ? cracked * SQL_HEIST.clueXp + SQL_HEIST.passBonusXp
              : cracked * SQL_HEIST.clueXp)
          : SQL_HEIST.baseXp
      }
      streakDays={SQL_HEIST.streakDays}
      progress={{
        countLabel: finished ? 'Case closed' : `Clue ${state.clue + 1} of ${SQL_HEIST.total}`,
        summary: `${cracked} ${cracked === 1 ? 'clue' : 'clues'} cracked`,
        dots,
        passMark: `Pass mark: ${SQL_HEIST.passMark} of ${SQL_HEIST.total}`,
      }}
      footer={footer}
      result={result}
      resultOpen={resultOpen}
      onResultsClose={() => setResultOpen(false)}
      onReopenResults={() => setResultOpen(true)}
      current={state.clue + 1}
      total={SQL_HEIST.total}
      correct={cracked}
      onRestart={() => {
        dispatch({ type: 'restart' });
        setResultOpen(true);
      }}
    >
      <div className="flex flex-col gap-[22px]">
        <GameHead
          eyebrow={`CLUE ${state.clue + 1} · SQL`}
          title={clue.title}
          prompt={clue.prompt}
          stats={[
            { Icon: GameUsersIcon, label: `${clue.suspects} suspects left` },
            { Icon: GameKeyIcon, label: `${resolved} of ${SQL_HEIST.total} clues` },
          ]}
          checks={clue.check}
        />
        <div className="flex flex-wrap items-center gap-[10px]">
          <span className="font-sans text-[13.5px] leading-[16px] font-semibold text-[#595959]">
            Tables:
          </span>
          {SQL_HEIST.tables.map((table) => (
            <span
              key={table}
              className={classNames(
                'inline-flex items-center gap-[6px] rounded-full bg-[#f8f8f4] px-[12px] py-[5px] font-sans text-[12.5px] leading-[15px] font-semibold text-[#1c2a21]',
                peek && 'outline-2 outline-offset-2 outline-[#387440]'
              )}
            >
              <GameViewTableIcon className="size-[14px] shrink-0" />
              {table}
            </span>
          ))}
        </div>
        <QueryEditor
          clue={clue}
          slot={state.slot}
          held={state.held}
          onDrop={(index) =>
            dispatch({ type: 'drop', index: typeof index === 'number' ? index : undefined })
          }
          onClear={() => dispatch({ type: 'clear' })}
        />
        <TokenBank
          clue={clue}
          held={state.held}
          slot={state.slot}
          onHold={(index, force) => dispatch({ type: 'hold', index, force })}
        />
        <Preview result={state.ran ? state.ran.result : clue.base} />
      </div>
    </GameFrame>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const GAMES = { 'sql-heist': SqlHeist };
export default SqlHeist;
