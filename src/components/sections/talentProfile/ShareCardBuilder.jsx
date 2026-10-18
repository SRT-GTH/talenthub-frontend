import { useCallback, useEffect, useRef, useState } from 'react';
import { debug } from '../../../utils/debug.js';
import { usePlayfulDialogA11y } from '../../ui/PlayfulDialogA11y.js';
import { ShareCardTrophyIcon } from '../../shared/assets.jsx';
import FlowPortal from '../talentHome/FlowPortal.jsx';
import { CardHeader, CardStepper } from './ShareCardParts.jsx';
import {
  CustomiseStep,
  ErrorStep,
  MakingStep,
  PickStep,
  ReadyStep,
  TextStep,
} from './ShareCardSteps.jsx';
import {
  CARD_PROFILE,
  CARD_SIZES,
  DEFAULT_SHOW,
  SIZE_BY_ROUTE,
  STEP_COPY,
  TOAST_COPY,
} from './talentProfileCardData.js';
import { usePlayfulScope } from '../../ui/PlayfulScope.js';

const log = debug('ShareCardBuilder');

/*
 * ShareCardBuilder — SC-01..SC-08 (Figma Playful 7608:6178.. / Focused 8110:398249..). Multi-step share-card
 * flow mounted over the profile page whenever `?card=` is set. Step = `profile.card`
 * (pick | customise | text | post | banner | making | ready | error). Look / size / show / caption / text edits
 * live in local state so the card preview reflects them and they survive step changes.
 * No backend: "making" is a timed mock, share targets are local no-ops (WhatsApp Status hands off to
 * `?share=whatsapp`), and the offline case (`navigator.onLine === false`) lands on SC-08.
 */

const MAKING_TICKS = [
  [300, 20],
  [700, 45],
  [1100, 70],
  [2400, 90],
  [3000, 100],
];
const MAKING_DONE_MS = 3500;

const SIZE_ROUTES = ['customise', 'post', 'banner'];

const stepperFor = (card) => {
  if (card === 'pick') return { done: 0, active: 0 };
  if (card === 'ready') return { done: 3, active: -1 };
  if (card === 'making' || card === 'error') return { done: 2, active: 2 };
  return { done: 1, active: 1 };
};

const ShareCardBuilder = ({ profile }) => {
  const card = profile?.card;
  const step = STEP_COPY[card] ? card : 'pick';
  const playful = usePlayfulScope();
  const dialogRef = useRef(null);
  const titleRef = useRef(null);
  const mounted = useRef(false);
  log('mount', { card, step });

  const [look, setLook] = useState('forest');
  const [size, setSize] = useState(SIZE_BY_ROUTE[card]?.id ?? 'story');
  const [show, setShow] = useState(DEFAULT_SHOW);
  const [caption, setCaption] = useState(CARD_PROFILE.caption);
  const [text, setText] = useState({
    headline: CARD_PROFILE.headline,
    highlight: CARD_PROFILE.highlight,
    headlineEdited: false,
    highlightEdited: false,
  });
  const [draft, setDraft] = useState({ headline: text.headline, highlight: text.highlight });
  const [progress, setProgress] = useState(0);
  const [toastOn, setToastOn] = useState(false);

  const go = useCallback(
    (next) => {
      log('step ->', next);
      profile.update({ card: next });
    },
    [profile]
  );
  const close = useCallback(() => {
    log('close');
    profile.update({ card: null });
  }, [profile]);
  const sizeRoute = CARD_SIZES.find((s) => s.id === size)?.route ?? 'customise';

  // Deep links to customise / post / banner pick the matching size.
  useEffect(() => {
    const s = SIZE_BY_ROUTE[card];
    if (s && s.id !== size) {
      log('size from route', s.id);
      setSize(s.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card]);

  // Entering the text step seeds the draft from the committed text.
  useEffect(() => {
    if (step === 'text') setDraft({ headline: text.headline, highlight: text.highlight });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  // SC-06: mock export — progress ticks, then ready (or the offline error).
  useEffect(() => {
    if (step !== 'making') return undefined;
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    setProgress(reduce ? 70 : 0);
    const timers = MAKING_TICKS.map(([ms, value]) =>
      setTimeout(() => {
        log('progress', value);
        setProgress(value);
      }, ms)
    );
    timers.push(
      setTimeout(() => {
        const offline = typeof navigator !== 'undefined' && navigator.onLine === false;
        log('branch', { making: 'done', offline });
        go(offline ? 'error' : 'ready');
      }, MAKING_DONE_MS)
    );
    return () => timers.forEach(clearTimeout);
  }, [step, go]);

  // XP toast under the ready step (Figma `toast · xp`).
  useEffect(() => {
    if (step !== 'ready') {
      setToastOn(false);
      return undefined;
    }
    setToastOn(true);
    const t = setTimeout(() => setToastOn(false), 6000);
    return () => clearTimeout(t);
  }, [step]);

  usePlayfulDialogA11y({
    open: true,
    dialogRef,
    onEscape: close,
    initialFocus: () => dialogRef.current?.querySelector('[role="radio"][aria-checked="true"]'),
    lockScroll: true,
  });

  // After the first render, move focus to the heading on every step change (screen-reader context).
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (step === 'text') return;
    titleRef.current?.focus({ preventScroll: true });
  }, [step]);

  const onBack = () => {
    if (step === 'pick') return close();
    if (step === 'text' || step === 'making' || step === 'error' || step === 'ready') {
      return go(sizeRoute);
    }
    return go('pick');
  };

  const onSize = (s) => {
    setSize(s.id);
    go(s.route);
  };

  const saveText = () => {
    setText({
      headline: draft.headline,
      highlight: draft.highlight,
      headlineEdited: draft.headline !== CARD_PROFILE.headline,
      highlightEdited: draft.highlight !== CARD_PROFILE.highlight,
    });
    go(sizeRoute);
  };

  const resetText = () =>
    setDraft({ headline: CARD_PROFILE.headline, highlight: CARD_PROFILE.highlight });

  const sizeInfo = CARD_SIZES.find((s) => s.id === size);
  const dimsOnly = sizeInfo.dims.split(' · ')[1];
  const exportLabel = `Exporting a ${dimsOnly.replace(' px', '')} PNG`;
  const fileInfo = `${dimsOnly.replace(' px', '')} · 420 KB`;

  const onTarget = (id) => {
    log('share target', id);
    if (id === 'whatsapp') {
      profile.update({ card: null, share: 'whatsapp' });
      return;
    }
    if (id === 'copy') {
      navigator.clipboard?.writeText?.(caption).catch((e) => log.error('copy failed', e));
    }
  };

  const copy = STEP_COPY[step];
  const { done, active } = stepperFor(step);
  const common = { size, look, show, text };

  let body;
  if (step === 'pick') {
    body = (
      <PickStep look={look} setLook={setLook} onCancel={close} onNext={() => go('customise')} />
    );
  } else if (SIZE_ROUTES.includes(step)) {
    body = (
      <CustomiseStep
        {...common}
        setLook={setLook}
        onSize={onSize}
        setShow={setShow}
        caption={caption}
        setCaption={setCaption}
        onEditText={() => go('text')}
        onBack={() => go('pick')}
        onNext={() => go('making')}
      />
    );
  } else if (step === 'text') {
    body = (
      <TextStep
        {...common}
        draft={draft}
        setDraft={setDraft}
        onReset={resetText}
        onCancel={() => go(sizeRoute)}
        onSave={saveText}
      />
    );
  } else if (step === 'making') {
    body = (
      <MakingStep
        {...common}
        progress={progress}
        exportLabel={exportLabel}
        onCancel={() => go(sizeRoute)}
      />
    );
  } else if (step === 'ready') {
    body = (
      <ReadyStep
        {...common}
        sizeDims={sizeInfo.dims}
        fileInfo={fileInfo}
        onTarget={onTarget}
        onAnother={() => go('pick')}
        onDone={close}
      />
    );
  } else {
    body = (
      <ErrorStep
        {...common}
        sizeDims={sizeInfo.dims}
        onRetry={() => go('making')}
        onDownload={() => log('download lower-quality copy')}
        onClose={close}
      />
    );
  }

  return (
    <FlowPortal
      className="flex items-start justify-center overflow-y-auto bg-[rgba(28,42,33,0.52)] px-[clamp(8px,2vw,24px)] py-[clamp(8px,3vh,32px)] lg:items-center"
      onScrimMouseDown={close}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-card-title"
        aria-describedby="share-card-sub"
        tabIndex={-1}
        data-share-card-step={step}
        className="relative w-full max-w-[1060px] rounded-[28px] border border-[rgba(28,42,33,0.1)] bg-white p-[clamp(16px,1.68vw,29px)] leading-[normal] outline-none [filter:drop-shadow(0_2px_4px_rgba(28,42,33,0.04))_drop-shadow(0_1px_1px_rgba(28,42,33,0.04))] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:[filter:drop-shadow(0_10px_12px_rgba(28,42,33,0.06))_drop-shadow(5px_5px_0_rgba(28,42,33,0.55))]"
      >
        <CardHeader
          titleId="share-card-title"
          descId="share-card-sub"
          title={copy.title}
          sub={copy.sub}
          onBack={onBack}
          onClose={close}
          titleRef={titleRef}
        />
        <div className={step === 'pick' ? 'mt-[24px]' : 'mt-[20px]'}>
          <CardStepper done={done} active={active} />
        </div>
        <div aria-live="polite">{body}</div>
      </div>
      {toastOn && (
        <div
          role="status"
          className="fixed bottom-[clamp(12px,3vh,32px)] left-1/2 z-[70] flex max-w-[calc(100vw-24px)] -translate-x-1/2 items-center gap-[10px] rounded-[14px] bg-[#1c2a21] px-[12px] py-[12px] text-[14px] leading-[17px] font-semibold whitespace-nowrap text-white playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[3px_3px_0_rgba(28,42,33,0.55)]"
        >
          <ShareCardTrophyIcon className="shrink-0" />
          {playful ? TOAST_COPY.playful : TOAST_COPY.focused}
        </div>
      )}
    </FlowPortal>
  );
};

export default ShareCardBuilder;
