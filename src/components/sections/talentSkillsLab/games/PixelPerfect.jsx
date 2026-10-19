import { useEffect, useMemo, useReducer, useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { useLabText } from '../labFormat.js';
import { FOCUS_RING } from '../labPlayStyles.js';
import { GameBatteryIcon, GameBulbIcon, GameTargetIcon } from '../skillGames/GameIcons.jsx';
import { Gen, GameFrame, GameHead, SectionLabel } from '../skillGames/gameKit.jsx';
import { DASH_BORDER, HAIR, INK, buildGameResult } from '../skillGames/gameKitUtils.js';
import { DEFECTS, PIXEL_FRAMES, PIXEL_PERFECT, SCREENS } from '../skillGames/pixelPerfectData.js';

const log = debug('PixelPerfect');

/*
 * Pixel Perfect (`/skills-lab/games/pixel-perfect`) — Figma SL-GS06 "Screen 2" (Playful 7943:7681 / Focused 8110:496131).
 * ?f=GS06 boots it. Loop: tap anything on the phone that looks off (a hit draws the dashed lime ring + numbered marker and
 * fills the "Issues you found" card) → 3 of 3 unlocks "Submit screen" → next screen … screen 6 → results (find 14 of 18).
 * One hint per run (−5 XP) pulses an unfound defect. Data + assumptions: pixelPerfectData.js.
 */

const Marker = ({ n, className, style }) => (
  <span
    aria-hidden="true"
    data-count={n}
    className={classNames(
      'absolute inline-flex size-[34px] items-center justify-center rounded-full bg-[#387440] font-sans text-[14px] leading-[17px] font-bold text-white after:content-[attr(data-count)]',
      'border-2 border-solid border-[rgba(28,42,33,0.12)] playful:border-[#1c2a21]',
      className
    )}
    style={style}
  />
);

/* One tappable phone element. `ring` = found, `pulse` = hinted. */
const Spot = (props) => {
  const {
    label,
    onTap,
    found,
    pulse,
    number,
    className,
    markerClass,
    children,
    ringClass,
    ringStyle,
    markerStyle,
  } = props;
  return (
    <div className={classNames('relative', className)}>
      <button
        type="button"
        aria-label={label}
        onClick={onTap}
        className={classNames(
          'block w-full cursor-pointer rounded-[inherit] text-left',
          FOCUS_RING
        )}
      >
        {children}
      </button>
      {found || pulse ? (
        <span
          aria-hidden="true"
          className={classNames(
            'pointer-events-none absolute -inset-[8px] rounded-[999px] border-[3px] border-dashed border-[#84cc16]',
            pulse && !found && 'animate-pulse',
            ringClass
          )}
          style={ringStyle}
        />
      ) : null}
      {found ? (
        <Marker
          n={number}
          className={markerClass ?? '-top-[22px] -right-[22px]'}
          style={markerStyle}
        />
      ) : null}
    </div>
  );
};

const Phone = ({ screen, view, onTap }) => {
  const has = (key) => screen.defects.includes(key);
  const num = (key) => screen.defects.indexOf(key) + 1;
  const spot = (key) => ({
    found: view.found.includes(key),
    pulse: view.hintArea === key,
    number: num(key),
  });
  const faintTitle = has('title');
  const tinyAmount = has('amount');
  const tightChips = has('chips');
  const faintNote = has('note');
  const smallSend = has('send');
  const loudSchedule = has('schedule');
  return (
    <div
      className={classNames(
        'flex w-full max-w-[476px] shrink-0 flex-col gap-[clamp(12px,1.13vw,19.6px)] rounded-[clamp(32px,2.9vw,50.4px)] bg-white px-[clamp(16px,1.6vw,28px)] py-[clamp(18px,1.78vw,30.8px)]',
        HAIR
      )}
    >
      <div className="flex items-center justify-between font-sans text-[16.8px] leading-[20px] font-semibold text-[#1c2a21]">
        <span>9:41</span>
        <GameBatteryIcon className="size-[20px]" />
      </div>
      <Spot
        label="Screen title"
        onTap={() => onTap('title')}
        {...spot('title')}
        ringStyle={{ left: -10, top: -15, width: 170, height: 56, inset: 'auto' }}
        markerStyle={{ left: 150, top: -4 }}
        markerClass=""
        className="w-fit max-w-full"
      >
        <span
          aria-hidden="true"
          data-count={screen.heading}
          className="after:content-[attr(data-count)] block font-sans text-[clamp(18px,1.22vw,21px)] leading-[25px] font-medium"
          style={{ color: faintTitle ? '#c7c7c2' : '#1c2a21' }}
        />
      </Spot>
      <Spot
        label="Amount"
        onTap={() => onTap('amount')}
        {...spot('amount')}
        ringClass="rounded-[24px]!"
        className="rounded-[clamp(14px,1.13vw,19.6px)]"
      >
        <span className="flex flex-col gap-[5.6px] rounded-[inherit] bg-[#f8f8f4] px-[clamp(16px,1.3vw,22.4px)] py-[clamp(12px,1.13vw,19.6px)]">
          <Gen
            text="Amount"
            className="font-sans text-[16.8px] leading-[20px] font-medium text-[#595959]"
          />
          <span
            aria-hidden="true"
            data-count={screen.amount}
            className="after:content-[attr(data-count)] font-sans font-semibold tracking-[-0.01em] text-[#1c2a21] playful:font-heading"
            style={{
              fontSize: tinyAmount ? 18 : 'clamp(30px,2.43vw,42px)',
              lineHeight: tinyAmount ? '22px' : '1.19',
            }}
          />
        </span>
      </Spot>
      <div className="flex flex-col gap-[11.2px]">
        <span className="font-sans text-[16.8px] leading-[20px] font-medium text-[#595959]">
          To
        </span>
        <Spot
          label="Recipients"
          onTap={() => onTap('chips')}
          {...spot('chips')}
          ringClass="rounded-[24px]!"
          className="w-fit max-w-full"
        >
          <span className="flex flex-wrap gap-[8.4px]">
            {screen.recipients.map((name) => (
              <span
                aria-hidden="true"
                data-count={name}
                key={name}
                className={classNames(
                  'after:content-[attr(data-count)] inline-flex items-center rounded-full bg-[#ebf1ec] px-[14px] font-sans font-semibold text-[#2a5730]',
                  tightChips
                    ? 'py-[1px] text-[13px] leading-[20px]'
                    : 'py-[7px] text-[16.8px] leading-[20px]'
                )}
              />
            ))}
          </span>
        </Spot>
      </div>
      <Spot
        label="Note field"
        onTap={() => onTap('note')}
        {...spot('note')}
        ringClass="rounded-[28px]!"
        className="rounded-[clamp(14px,1.13vw,19.6px)]"
      >
        <span
          aria-hidden="true"
          data-count={screen.note}
          className="after:content-[attr(data-count)] block rounded-[inherit] bg-[#f8f8f4] px-[clamp(14px,1.13vw,19.6px)] py-[clamp(12px,0.97vw,16.8px)] font-sans text-[clamp(15px,1.05vw,18.2px)] leading-[22px]"
          style={{ color: faintNote ? '#c7c7c2' : '#595959' }}
        />
      </Spot>
      <div className="flex items-center gap-[11.2px]">
        <Spot
          label="Send button"
          onTap={() => onTap('send')}
          {...spot('send')}
          ringStyle={{ left: -10, top: -18, width: 90, height: 70, inset: 'auto' }}
          markerStyle={{ left: 18, top: -42 }}
          markerClass=""
          className={classNames('shrink-0 rounded-[11.2px]', !smallSend && 'rounded-[16.8px]')}
        >
          <span
            aria-hidden="true"
            data-count="Send"
            className={classNames(
              'after:content-[attr(data-count)] flex items-center justify-center rounded-[inherit] bg-[#387440] font-sans font-semibold text-white',
              smallSend
                ? 'px-[16.8px] py-[8.4px] text-[15.4px] leading-[18px]'
                : 'px-[clamp(20px,1.78vw,30.8px)] py-[clamp(14px,1.13vw,19.6px)] text-[clamp(16px,1.13vw,19.6px)] leading-[23px]'
            )}
          />
        </Spot>
        <Spot
          label="Schedule button"
          onTap={() => onTap('schedule')}
          {...spot('schedule')}
          className="min-w-0 flex-1 rounded-[16.8px]"
        >
          <span
            aria-hidden="true"
            data-count="Schedule for later"
            className={classNames(
              'after:content-[attr(data-count)] flex items-center justify-center rounded-[inherit] px-[clamp(14px,1.78vw,30.8px)] py-[clamp(14px,1.13vw,19.6px)] font-sans text-[clamp(16px,1.13vw,19.6px)] leading-[23px] font-semibold',
              loudSchedule ? 'bg-[#387440] text-white' : 'bg-[#ebf1ec] text-[#2a5730]'
            )}
          />
        </Spot>
      </div>
    </div>
  );
};

const IssueCard = ({ n, defect, found, remaining, group }) => {
  if (found) {
    return (
      <li
        className={classNames(
          'flex items-center gap-[12px] rounded-[16px] bg-white px-[16px] py-[14px]',
          HAIR
        )}
      >
        <span
          aria-hidden="true"
          data-count={n}
          className={classNames(
            'inline-flex size-[30px] shrink-0 items-center justify-center rounded-full bg-[#387440] font-sans text-[13px] leading-[16px] font-bold text-white after:content-[attr(data-count)]',
            INK
          )}
        />
        <span className="flex min-w-0 flex-col gap-[2px]">
          <span className="font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
            {defect.title}
          </span>
          <span className="font-sans text-[13px] leading-[18px] text-[#595959] max-lg:text-[12px]">
            {defect.body}
          </span>
        </span>
      </li>
    );
  }
  return (
    <li
      className={classNames(
        'flex items-center gap-[12px] rounded-[16px] bg-[#f8f8f4] px-[16px] py-[14px]',
        DASH_BORDER
      )}
    >
      <span
        aria-hidden="true"
        className={classNames(
          'inline-flex size-[30px] shrink-0 items-center justify-center rounded-full bg-white font-sans text-[13px] leading-[16px] font-bold text-[#1c2a21]',
          INK
        )}
      >
        ?
      </span>
      <span className="flex min-w-0 flex-col gap-[2px]">
        <span className="font-sans text-[15px] leading-[18px] font-semibold text-[#595959]">
          ???
        </span>
        <span className="font-sans text-[13px] leading-[18px] text-[#595959] max-lg:text-[12px]">
          {remaining === 1
            ? `One more to go. Look at the ${group.toLowerCase()}.`
            : `${remaining} more to go. Keep tapping.`}
        </span>
      </span>
    </li>
  );
};

const fresh = (runKey = 0) => ({
  screen: 0,
  scores: [],
  found: [],
  hints: PIXEL_PERFECT.hints,
  hintsUsed: 0,
  hintArea: null,
  strays: 0,
  phase: 'playing',
  runKey,
});
const fromFrame = (code) => {
  const seed = code ? PIXEL_FRAMES[code] : null;
  return seed ? { ...fresh(), ...seed } : fresh();
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'tap': {
      if (state.phase !== 'playing') return state;
      const screen = SCREENS[state.screen];
      if (!screen.defects.includes(action.key)) return { ...state, strays: state.strays + 1 };
      if (state.found.includes(action.key)) return state;
      return {
        ...state,
        found: [...state.found, action.key],
        hintArea: state.hintArea === action.key ? null : state.hintArea,
      };
    }
    case 'hint': {
      if (state.phase !== 'playing' || state.hints <= 0) return state;
      const screen = SCREENS[state.screen];
      const left = screen.defects.filter((d) => !state.found.includes(d));
      if (!left.length) return state;
      return {
        ...state,
        hints: state.hints - 1,
        hintsUsed: state.hintsUsed + 1,
        hintArea: left[0],
      };
    }
    case 'submit': {
      const screen = SCREENS[state.screen];
      const ready =
        state.found.length >= screen.defects.length || state.strays >= PIXEL_PERFECT.strayLimit;
      if (state.phase !== 'playing' || !ready) return state;
      const scores = [...state.scores];
      scores[state.screen] = state.found.length;
      if (state.screen + 1 >= PIXEL_PERFECT.total) return { ...state, scores, phase: 'finished' };
      return { ...state, scores, screen: state.screen + 1, found: [], hintArea: null, strays: 0 };
    }
    case 'restart':
      return fresh(state.runKey + 1);
    default:
      return state;
  }
};

const PixelPerfect = ({ frame }) => {
  const [state, dispatch] = useReducer(reducer, frame, fromFrame);
  const [resultOpen, setResultOpen] = useState(true);
  const { t } = useLabText();
  const screen = SCREENS[state.screen];
  const finished = state.phase === 'finished';
  const found = state.found.length;
  const totalFound = state.scores.reduce((a, b) => a + b, 0);
  const passed = totalFound >= PIXEL_PERFECT.passMark;
  const ready = found >= screen.defects.length || state.strays >= PIXEL_PERFECT.strayLimit;
  const prevScore = state.scores[state.screen - 1];

  useEffect(() => {
    log('mount', { frame });
  }, [frame]);

  const result = useMemo(() => {
    if (!finished) return null;
    const rows = {};
    SCREENS.forEach((s, i) => {
      s.defects.forEach((key) => {
        const group = DEFECTS[key].group;
        rows[group] ??= { label: group, nums: new Set(), strong: true };
        rows[group].nums.add(i + 1);
        if (state.scores[i] < PIXEL_PERFECT.perScreen) rows[group].strong = false;
      });
    });
    const topics = Object.values(rows).map((r) => ({
      label: r.label,
      strong: r.strong,
      qs: `Screen${r.nums.size > 1 ? 's' : ''} ${[...r.nums].join(', ')}`,
    }));
    return buildGameResult({
      skill: PIXEL_PERFECT.skill,
      gameName: PIXEL_PERFECT.label,
      verb: 'found',
      noun: 'issues',
      statLabel: 'ISSUES FOUND',
      correct: totalFound,
      total: PIXEL_PERFECT.total * PIXEL_PERFECT.perScreen,
      passMark: `${PIXEL_PERFECT.passMark} of ${PIXEL_PERFECT.total * PIXEL_PERFECT.perScreen}`,
      passed,
      earned:
        state.scores.length * PIXEL_PERFECT.screenXp + (passed ? PIXEL_PERFECT.passBonusXp : 0),
      dots: state.scores.map((s) => (s >= PIXEL_PERFECT.perScreen ? 'ok' : 'bad')),
      topics: [...topics.filter((t) => t.strong), ...topics.filter((t) => !t.strong)],
    });
  }, [finished, totalFound, passed, state.scores]);

  const dots = Array.from({ length: PIXEL_PERFECT.total }, (_, i) => {
    if (state.scores[i] !== undefined)
      return {
        state: state.scores[i] >= PIXEL_PERFECT.perScreen ? 'ok' : 'bad',
        label: String(i + 1),
      };
    if (!finished && i === state.screen) return { state: 'now', label: String(i + 1) };
    return { state: 'todo', label: String(i + 1) };
  });

  const isLast = state.screen + 1 >= PIXEL_PERFECT.total;
  const footer = {
    link: {
      label: t('Hint (-{cost} {xp})', { cost: PIXEL_PERFECT.hintCost }),
      onClick: () => dispatch({ type: 'hint' }),
      disabled: state.hints <= 0,
    },
    primary: {
      label: isLast ? 'See results' : 'Submit screen',
      disabled: !ready,
      onClick: () => dispatch({ type: 'submit' }),
    },
  };

  return (
    <GameFrame
      game={{
        title: PIXEL_PERFECT.title,
        label: PIXEL_PERFECT.label,
        subtitle: PIXEL_PERFECT.subtitle,
        sticker: finished ? 'ALL SCREENS DONE' : `${found} OF ${screen.defects.length} FOUND`,
      }}
      xp={PIXEL_PERFECT.baseXp - state.hintsUsed * PIXEL_PERFECT.hintCost}
      streakDays={PIXEL_PERFECT.streakDays}
      progress={{
        countLabel: finished
          ? 'All screens done'
          : `Screen ${state.screen + 1} of ${PIXEL_PERFECT.total}`,
        summary:
          prevScore === undefined
            ? `${totalFound} found so far`
            : `Screen ${state.screen}: ${prevScore} of ${PIXEL_PERFECT.perScreen} found`,
        dots,
        passMark: `Pass mark: ${PIXEL_PERFECT.passMark} of ${PIXEL_PERFECT.total * PIXEL_PERFECT.perScreen} issues`,
      }}
      footer={footer}
      result={result}
      resultOpen={resultOpen}
      onResultsClose={() => setResultOpen(false)}
      onReopenResults={() => setResultOpen(true)}
      current={state.screen + 1}
      total={PIXEL_PERFECT.total}
      correct={state.scores.filter((s) => s >= PIXEL_PERFECT.perScreen).length}
      onRestart={() => {
        dispatch({ type: 'restart' });
        setResultOpen(true);
      }}
    >
      <div className="flex flex-col gap-[22px]">
        <GameHead
          eyebrow={`SCREEN ${state.screen + 1} · UI/UX DESIGN`}
          title={[
            ['Find 3 things wrong with ', false],
            ['this screen.', true],
          ]}
          prompt={screen.blurb}
          stats={[
            { Icon: GameTargetIcon, label: `${found} of ${screen.defects.length} found` },
            {
              Icon: GameBulbIcon,
              label: `${state.hints} hint${state.hints === 1 ? '' : 's'} left`,
            },
          ]}
          checks={PIXEL_PERFECT.checks}
        />
        <div
          className={classNames(
            'flex items-center gap-[40px] rounded-[24px] bg-[#fffefc] px-[clamp(16px,1.85vw,32px)] py-[clamp(12px,0.98vw,17px)] max-lg:flex-col max-lg:items-stretch',
            HAIR
          )}
        >
          <Phone
            screen={screen}
            view={{ found: state.found, hintArea: state.hintArea }}
            onTap={(key) => dispatch({ type: 'tap', key })}
          />
          <div className="flex min-w-0 flex-1 flex-col gap-[12px]">
            <SectionLabel>ISSUES YOU FOUND</SectionLabel>
            <ul className="m-0 flex list-none flex-col gap-[12px] p-0" aria-live="polite">
              {screen.defects.map((key, i) => (
                <IssueCard
                  key={key}
                  n={i + 1}
                  defect={DEFECTS[key]}
                  found={state.found.includes(key)}
                  remaining={screen.defects.length - found}
                  group={DEFECTS[screen.defects.find((d) => !state.found.includes(d)) ?? key].group}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </GameFrame>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const GAMES = { 'pixel-perfect': PixelPerfect };
export default PixelPerfect;
