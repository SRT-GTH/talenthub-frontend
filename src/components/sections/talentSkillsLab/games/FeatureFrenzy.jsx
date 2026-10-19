import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { FOCUS_RING } from '../labPlayStyles.js';
import {
  GameCheckCircleFillIcon,
  GameCheckCircleIcon,
  GameCheckXlIcon,
  GameCloseIcon,
  GameCloseXlIcon,
  GameWalletIcon,
  GameWifiOffIcon,
} from '../skillGames/GameIcons.jsx';
import { GameFrame, GameHead } from '../skillGames/gameKit.jsx';
import { HAIR, buildGameResult, topicRowsFor } from '../skillGames/gameKitUtils.js';
import { CARDS, FEATURE_FRENZY, FRENZY_FRAMES } from '../skillGames/featureFrenzyData.js';

const log = debug('FeatureFrenzy');

/*
 * Feature Frenzy (`/skills-lab/games/feature-frenzy`) — Figma SL-GS08 "Card 6" (Playful 7943:8072 / Focused 8110:496325).
 * ?f=GS08 boots it. Loop: swipe the top card right (Keep, spends its build coins) or left (Kill) — drag it, press the round
 * buttons or use ← / → — 10 cards → "Ship the roadmap" → results (score 70+: 10 points per right call). "Undo last swipe"
 * takes the last decision back. Data + assumptions: featureFrenzyData.js.
 */

const PILL_BORDER =
  'border border-solid border-[rgba(28,42,33,0.12)] playful:border-[1.13px] playful:border-[#1c2a21]';

const Meter = ({ label, value, pct, tone }) => (
  <div className="flex flex-col gap-[5.65px]">
    <div className="flex items-center justify-between font-sans">
      <span className="text-[13.2px] leading-[16px] font-semibold text-[#1c2a21] max-lg:text-[13px]">
        {label}
      </span>
      <span
        aria-hidden="true"
        data-count={value}
        className="text-[12.25px] leading-[15px] font-semibold text-[#595959] after:content-[attr(data-count)] max-lg:text-[12px]"
      />
    </div>
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct)}
      className="h-[8px] overflow-hidden rounded-full bg-[#ebebe3]"
    >
      <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: tone }} />
    </div>
  </div>
);

const FrontCard = ({ cardData, style, dragHandlers, className }) => (
  <div
    {...dragHandlers}
    className={classNames(
      'flex touch-pan-y flex-col overflow-hidden rounded-[26.4px] bg-white select-none',
      HAIR,
      className
    )}
    style={style}
  >
    <div className="flex flex-col gap-[9.4px] bg-[#ffd86b] p-[22.6px]">
      <span className="inline-flex size-[55px] items-center justify-center rounded-[16px] bg-white font-sans text-[26px] font-semibold text-[#1c2a21]">
        {cardData.icon === 'wifi-off' ? (
          <GameWifiOffIcon className="size-[26px] text-[#1c2a21]" />
        ) : (
          <span aria-hidden="true">{cardData.title[0]}</span>
        )}
      </span>
      <h3 className="m-0 font-sans text-[30px] leading-[36px] font-semibold tracking-[-0.01em] text-[#1c2a21] playful:font-heading">
        {cardData.title}
      </h3>
      <p className="m-0 font-sans text-[14.13px] leading-[20px] font-medium text-[#1c2a21] max-lg:text-[14px]">
        {cardData.desc}
      </p>
    </div>
    <div className="flex flex-col gap-[11.3px] px-[22.6px] pt-[5.65px] pb-[22.6px] lg:min-h-[227px]">
      <Meter
        label="Users asking for it"
        value={`${cardData.users}%`}
        pct={cardData.users}
        tone="#387440"
      />
      <Meter
        label="Build cost"
        value={`${cardData.cost} coins`}
        pct={(cardData.cost / FEATURE_FRENZY.coins) * 100}
        tone="#c8951a"
      />
      <div className="flex flex-wrap gap-[7.5px]">
        {cardData.chips.map((chip) => (
          <span
            key={chip}
            className="inline-flex rounded-full bg-[#f8f8f4] px-[9.4px] py-[4.7px] font-sans text-[11.3px] leading-[13px] font-semibold text-[#1c2a21] max-lg:text-[12px]"
          >
            {chip}
          </span>
        ))}
      </div>
    </div>
  </div>
);

const Lane = ({ title, icon, items, tone }) => (
  <div className="flex w-full flex-col gap-[7.5px] lg:w-[217px]">
    <h4 className="m-0 flex items-center gap-[5.65px] font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
      {icon}
      {title}
    </h4>
    <ul className="m-0 flex list-none flex-col gap-[7.5px] p-0">
      {items.map((name) => (
        <li
          key={name}
          className={classNames(
            'rounded-[11.3px] px-[11.3px] py-[8.5px] font-sans text-[12.7px] leading-[15px] font-semibold max-lg:text-[13px]',
            PILL_BORDER,
            tone === 'keep' ? 'bg-[#387440] text-white' : 'bg-[#f9ebea] text-[#1c2a21]'
          )}
        >
          {name}
        </li>
      ))}
    </ul>
  </div>
);

const RoundButton = ({ label, caption, tone, onClick, disabled, children }) => (
  <div className="flex flex-col items-center gap-[7.5px]">
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={classNames(
        'inline-flex size-[72px] items-center justify-center rounded-full border-2 border-solid border-[rgba(28,42,33,0.12)] text-[#1c2a21] disabled:opacity-50 playful:border-[#1c2a21]',
        tone === 'keep' ? 'bg-[#387440] text-white' : 'bg-[#f9ebea]',
        FOCUS_RING
      )}
    >
      {children}
    </button>
    <span
      aria-hidden="true"
      data-count={caption}
      className="font-sans text-[13.2px] leading-[16px] font-bold text-[#1c2a21] after:content-[attr(data-count)]"
    />
  </div>
);

const fresh = (runKey = 0) => ({ decisions: [], nudge: null, shipped: false, runKey });
const fromFrame = (code) => {
  const seed = code ? FRENZY_FRAMES[code] : null;
  return seed ? { ...fresh(), decisions: seed.decisions } : fresh();
};

const coinsSpent = (decisions) =>
  decisions.reduce((sum, d, i) => (d === 'keep' ? sum + CARDS[i].cost : sum), 0);

const reducer = (state, action) => {
  switch (action.type) {
    case 'swipe': {
      if (state.shipped || state.decisions.length >= CARDS.length) return state;
      const card = CARDS[state.decisions.length];
      if (action.dir === 'keep' && coinsSpent(state.decisions) + card.cost > FEATURE_FRENZY.coins)
        return { ...state, nudge: 'coins' };
      return { ...state, decisions: [...state.decisions, action.dir], nudge: null };
    }
    case 'undo':
      return state.shipped || !state.decisions.length
        ? state
        : { ...state, decisions: state.decisions.slice(0, -1), nudge: null };
    case 'ship':
      return state.decisions.length === CARDS.length ? { ...state, shipped: true } : state;
    case 'restart':
      return fresh(state.runKey + 1);
    default:
      return state;
  }
};

const FeatureFrenzy = ({ frame }) => {
  const [state, dispatch] = useReducer(reducer, frame, fromFrame);
  const [resultOpen, setResultOpen] = useState(true);
  const [drag, setDrag] = useState(0);
  const startX = useRef(null);
  const index = state.decisions.length;
  const done = index >= CARDS.length;
  const cardData = CARDS[Math.min(index, CARDS.length - 1)];
  const spent = coinsSpent(state.decisions);
  const coinsLeft = FEATURE_FRENZY.coins - spent;
  const kept = state.decisions.filter((d) => d === 'keep').length;
  const killed = state.decisions.length - kept;
  const rights = state.decisions.filter((d, i) => (d === 'keep') === CARDS[i].keep).length;
  const score = rights * FEATURE_FRENZY.pointsPerCall;
  const passed = score >= FEATURE_FRENZY.passScore;

  useEffect(() => {
    log('mount', { frame });
  }, [frame]);

  const swipe = (dir) => dispatch({ type: 'swipe', dir });

  useEffect(() => {
    const onKey = (event) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(event.target?.tagName)) return;
      if (event.key === 'ArrowRight') swipe('keep');
      else if (event.key === 'ArrowLeft') swipe('kill');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const result = useMemo(() => {
    if (!state.shipped) return null;
    const res = state.decisions.map((d, i) => ((d === 'keep') === CARDS[i].keep ? 'ok' : 'bad'));
    return buildGameResult({
      skill: FEATURE_FRENZY.skill,
      gameName: FEATURE_FRENZY.label,
      verb: 'made',
      noun: 'right calls',
      statLabel: 'RIGHT CALLS',
      correct: rights,
      total: CARDS.length,
      passMark: '7 of 10',
      neededLabel: 'Score 70+',
      passed,
      earned: rights * FEATURE_FRENZY.callXp,
      dots: res,
      topics: topicRowsFor(CARDS, res, 'Card'),
    });
  }, [state.shipped, state.decisions, rights, passed]);

  const dots = Array.from({ length: CARDS.length }, (_, i) => {
    if (i < index) return { state: 'ok', label: String(i + 1) };
    if (!state.shipped && i === index) return { state: 'now', label: String(i + 1) };
    return { state: 'todo', label: String(i + 1) };
  });

  const names = (dir) =>
    state.decisions.map((d, i) => (d === dir ? CARDS[i].title : null)).filter(Boolean);
  const dragHandlers = {
    onPointerDown: (e) => {
      startX.current = e.clientX;
      e.currentTarget.setPointerCapture?.(e.pointerId);
    },
    onPointerMove: (e) => {
      if (startX.current !== null) setDrag(e.clientX - startX.current);
    },
    onPointerUp: () => {
      if (startX.current === null) return;
      const dx = drag;
      startX.current = null;
      setDrag(0);
      if (dx > 90) swipe('keep');
      else if (dx < -90) swipe('kill');
    },
    onPointerCancel: () => {
      startX.current = null;
      setDrag(0);
    },
  };

  const footer = {
    link: {
      label: 'Undo last swipe',
      onClick: () => dispatch({ type: 'undo' }),
      disabled: !index || state.shipped,
    },
    primary: {
      label: 'Ship the roadmap',
      disabled: !done,
      onClick: () => dispatch({ type: 'ship' }),
    },
  };

  return (
    <GameFrame
      game={{
        title: FEATURE_FRENZY.title,
        label: FEATURE_FRENZY.label,
        subtitle: FEATURE_FRENZY.subtitle,
        sticker: `${coinsLeft} COINS LEFT`,
      }}
      xp={FEATURE_FRENZY.baseXp}
      streakDays={FEATURE_FRENZY.streakDays}
      progress={{
        countLabel: done ? 'All cards decided' : `Card ${index + 1} of ${CARDS.length}`,
        summary: `${kept} kept · ${killed} killed`,
        dots,
        passMark: `Pass mark: score ${FEATURE_FRENZY.passScore}+`,
      }}
      footer={footer}
      result={result}
      resultOpen={resultOpen}
      onResultsClose={() => setResultOpen(false)}
      onReopenResults={() => setResultOpen(true)}
      current={Math.min(index + 1, CARDS.length)}
      total={CARDS.length}
      correct={rights}
      onRestart={() => {
        dispatch({ type: 'restart' });
        setResultOpen(true);
      }}
    >
      <div className="flex flex-col gap-[22px]">
        <GameHead
          eyebrow={`CARD ${Math.min(index + 1, CARDS.length)} · PRODUCT MANAGEMENT`}
          title={[
            ['Keep or kill: ', false],
            [`${cardData.title}?`, true],
          ]}
          prompt={FEATURE_FRENZY.prompt.replace('{coins}', String(coinsLeft))}
          stats={[
            { Icon: GameWalletIcon, label: `${coinsLeft} of ${FEATURE_FRENZY.coins} coins left` },
            { Icon: GameCheckCircleIcon, label: `${kept} kept · ${killed} killed` },
          ]}
          checks={FEATURE_FRENZY.checks}
        />
        <div
          className={classNames(
            'relative flex flex-col items-center gap-[24px] overflow-hidden rounded-[22.6px] bg-[#fffefc] p-[30px] lg:block lg:h-[651px] lg:p-0',
            HAIR
          )}
        >
          <div className="grid w-full grid-cols-2 gap-[16px] lg:contents">
            <div className="lg:absolute lg:top-[30px] lg:left-[30px]">
              <Lane
                title="Kept"
                tone="keep"
                items={names('keep')}
                icon={<GameCheckCircleFillIcon className="size-[17px]" />}
              />
            </div>
            <div className="lg:absolute lg:top-[30px] lg:left-[793px]">
              <Lane
                title="Killed"
                tone="kill"
                items={names('kill')}
                icon={<GameCloseIcon className="size-[17px]" />}
              />
            </div>
          </div>
          <div className="relative w-full max-w-[411px] lg:absolute lg:top-[11px] lg:left-[244px] lg:h-[493px] lg:w-[533px] lg:max-w-none">
            {!done ? (
              <>
                <span
                  aria-hidden="true"
                  className={classNames(
                    'absolute top-[62px] left-[25px] hidden h-[438px] w-[395px] rotate-[7deg] rounded-[26.4px] bg-white lg:block',
                    HAIR
                  )}
                />
                <span
                  aria-hidden="true"
                  className={classNames(
                    'absolute top-[16px] left-[119px] hidden h-[438px] w-[395px] -rotate-[5deg] rounded-[26.4px] bg-white lg:block',
                    HAIR
                  )}
                />
                <FrontCard
                  key={cardData.id}
                  cardData={cardData}
                  dragHandlers={dragHandlers}
                  className="relative w-full lg:absolute lg:top-[34px] lg:left-[71px] lg:w-[395px]"
                  style={{ transform: `translateX(${drag}px) rotate(${2 + drag / 40}deg)` }}
                />
              </>
            ) : (
              <p className="m-0 mt-[160px] text-center font-sans text-[16px] leading-[22px] font-semibold text-[#595959]">
                {`All ${CARDS.length} cards decided. Ship the roadmap when you are ready.`}
              </p>
            )}
          </div>
          <div className="flex items-start justify-center gap-[113px] lg:absolute lg:top-[508px] lg:left-[392px] lg:w-[257px]">
            <RoundButton
              label={`Kill ${cardData.title}`}
              caption="Kill"
              tone="kill"
              disabled={done}
              onClick={() => swipe('kill')}
            >
              <GameCloseXlIcon className="size-[30px]" />
            </RoundButton>
            <RoundButton
              label={`Keep ${cardData.title}`}
              caption="Keep"
              tone="keep"
              disabled={done}
              onClick={() => swipe('keep')}
            >
              <GameCheckXlIcon className="size-[30px] text-white" />
            </RoundButton>
          </div>
          <p
            className="m-0 flex items-center justify-center gap-[5.65px] font-sans text-[11.8px] leading-[14px] font-medium text-[#595959] lg:absolute lg:top-[610px] lg:left-0 lg:w-full max-lg:text-[12px]"
            aria-live="polite"
          >
            {state.nudge === 'coins' ? (
              <span className="font-semibold text-[#902b20]">
                Not enough coins for this one. Kill it or undo a keep.
              </span>
            ) : (
              <>
                <span>Swipe, or press</span>
                {['←', '→'].map((key) => (
                  <span
                    key={key}
                    aria-hidden="true"
                    className={classNames(
                      'inline-flex rounded-full bg-white px-[7.5px] py-[1.9px] font-sans text-[11.3px] leading-[13px] font-semibold text-[#1c2a21] max-lg:text-[12px]',
                      PILL_BORDER
                    )}
                  >
                    {key}
                  </span>
                ))}
              </>
            )}
          </p>
        </div>
      </div>
    </GameFrame>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const GAMES = { 'feature-frenzy': FeatureFrenzy };
export default FeatureFrenzy;
