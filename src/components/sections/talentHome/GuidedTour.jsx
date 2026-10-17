import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { debug } from '../../../utils/debug.js';
import { usePlayfulDialogA11y } from '../../ui/PlayfulDialogA11y.js';
import Button from '../../ui/Button.jsx';
import { TourTooltipArrowIcon, WhiteArrowRightIcon } from '../../shared/assets.jsx';
import FlowPortal from './FlowPortal.jsx';
import buddy from '../../../assets/talent-home/flows/career-buddy-avatar-38.png';

const log = debug('GuidedTour');

/*
 * GuidedTour — NU-02 coach-mark tour. Figma: Focused 8097:4191, Playful 7745:181414.
 * Only STEP 1 OF 4 is drawn in Figma ("This is your journey", spotlight on the "Your profile
 * journey" card). Steps 2-4 are NOT in the file, so no copy is invented for them: TOUR_STEPS holds
 * step 1 only and "Next" on the last drawn step ends the tour. When Figma adds steps, append to
 * TOUR_STEPS ({ target, title, body }) — the step dots, counter and Next/Skip already follow it.
 *
 * Spotlight: 4 scrim rectangles around the target rect (inflated 10px) + a 3px #ffd86b ring
 * (r32). The target is `[data-tour-target="journey"]` (JourneyCard should carry it); fallback is
 * the card that contains the "Your profile journey" heading.
 */

const TOUR_TOTAL = 4;
const TOUR_STEPS = [
  {
    id: 'journey',
    target: 'journey',
    title: 'This is your journey',
    body: 'Nine stages, three milestones. Each stage takes a few minutes and saves on its own. Interests is next.',
  },
];

const RING_PAD = 10;
const SCRIM = 'bg-[rgba(11,26,15,0.62)]';

const findJourneyTarget = () => {
  const tagged = document.querySelector('[data-tour-target="journey"]');
  if (tagged) return tagged;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    if (node.textContent.trim() === 'Your profile journey' && node.parentElement) {
      let el = node.parentElement;
      while (el && el !== document.body) {
        const cs = getComputedStyle(el);
        if (parseFloat(cs.borderTopLeftRadius) >= 12 && el.offsetHeight > 120) return el;
        el = el.parentElement;
      }
      return node.parentElement;
    }
    node = walker.nextNode();
  }
  return null;
};

const GuidedTour = ({ home }) => {
  const dialogRef = useRef(null);
  const nextRef = useRef(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [rect, setRect] = useState(null);
  const [vp, setVp] = useState({ w: window.innerWidth, h: window.innerHeight });
  const [tipH, setTipH] = useState(238);
  const step = TOUR_STEPS[stepIndex];

  const close = useCallback(() => {
    log('close', { stepIndex });
    home?.update?.({ new: null });
  }, [home, stepIndex]);

  usePlayfulDialogA11y({
    open: true,
    dialogRef,
    onEscape: close,
    initialFocus: () => nextRef.current,
    lockScroll: false,
  });

  const measure = useCallback(() => {
    const el = findJourneyTarget();
    setVp({ w: window.innerWidth, h: window.innerHeight });
    if (!el) {
      log('branch: spotlight target not found');
      setRect(null);
      return;
    }
    const r = el.getBoundingClientRect();
    setRect({ left: r.left, top: r.top, width: r.width, height: r.height });
  }, []);

  useLayoutEffect(() => {
    const el = findJourneyTarget();
    el?.scrollIntoView?.({ block: 'center', behavior: 'instant' });
    measure();
    log('mount', { step: step.id, found: Boolean(el) });
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, true);
    // The page under the tour can still be hydrating (other sections mount after us).
    const t = setTimeout(measure, 300);
    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure, true);
      clearTimeout(t);
    };
  }, [measure, step.id]);

  useLayoutEffect(() => {
    const h = dialogRef.current?.offsetHeight;
    if (h) setTipH((prev) => (prev === h ? prev : h));
  }, [stepIndex, vp.w]);

  const ring = rect
    ? {
        left: Math.max(0, rect.left - RING_PAD),
        top: Math.max(0, rect.top - RING_PAD),
        right: Math.min(vp.w, rect.left + rect.width + RING_PAD),
        bottom: Math.min(vp.h, rect.top + rect.height + RING_PAD),
      }
    : null;

  // Tooltip placement: Figma puts it 22px below the ring, 60px in from its left edge.
  const tipW = Math.min(460, vp.w - 24);
  let tipLeft = Math.max(12, (vp.w - tipW) / 2);
  let tipTop = Math.max(12, (vp.h - tipH) / 2);
  let above = false;
  let arrowLeft = 60;
  if (ring) {
    tipLeft = Math.min(Math.max(12, ring.left + 60), vp.w - 12 - tipW);
    const below = ring.bottom + 22;
    above = below + tipH > vp.h - 8 && ring.top - 22 - tipH >= 8;
    tipTop = above ? ring.top - 22 - tipH : Math.min(below, Math.max(8, vp.h - 8 - tipH));
    arrowLeft = Math.min(Math.max(16, ring.left + 60 - tipLeft), tipW - 38);
  }

  const next = () => {
    log('next', { stepIndex });
    if (stepIndex < TOUR_STEPS.length - 1) setStepIndex(stepIndex + 1);
    else close();
  };

  return (
    <FlowPortal>
      {ring ? (
        <>
          <div className={`absolute inset-x-0 top-0 ${SCRIM}`} style={{ height: ring.top }} />
          <div
            className={`absolute left-0 ${SCRIM}`}
            style={{ top: ring.top, width: ring.left, height: ring.bottom - ring.top }}
          />
          <div
            className={`absolute right-0 ${SCRIM}`}
            style={{ top: ring.top, left: ring.right, height: ring.bottom - ring.top }}
          />
          <div className={`absolute inset-x-0 bottom-0 ${SCRIM}`} style={{ top: ring.bottom }} />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute rounded-[clamp(20px,1.85vw,32px)] border-[3px] border-solid border-[#ffd86b]"
            style={{
              left: ring.left,
              top: ring.top,
              width: ring.right - ring.left,
              height: ring.bottom - ring.top,
            }}
          />
        </>
      ) : (
        <div className={`absolute inset-0 ${SCRIM}`} />
      )}

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="nu-tour-title"
        aria-describedby="nu-tour-body"
        tabIndex={-1}
        className="leading-[normal] absolute flex flex-col items-start gap-[12px] rounded-[22px] border border-[rgba(28,42,33,0.1)] bg-white px-[clamp(16px,1.27vw,22px)] py-[clamp(16px,1.16vw,20px)] outline-none [filter:drop-shadow(0_2px_4px_rgba(28,42,33,0.04))_drop-shadow(0_1px_1px_rgba(28,42,33,0.04))] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:[filter:drop-shadow(0_10px_12px_rgba(28,42,33,0.06))_drop-shadow(5px_5px_0_rgba(28,42,33,0.55))]"
        style={{ left: tipLeft, top: tipTop, width: tipW }}
      >
        {ring && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute block h-[10.5px] w-[19.05px]"
            style={{
              left: arrowLeft + 1.5,
              [above ? 'bottom' : 'top']: -12,
              transform: above ? 'rotate(180deg)' : undefined,
            }}
          >
            <TourTooltipArrowIcon className="block size-full" />
          </span>
        )}
        <div className="flex items-center gap-[10px]">
          <span className="flex size-[40px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#ebf1ec]">
            <img src={buddy} alt="" aria-hidden="true" className="size-[38px]" />
          </span>
          <p className="m-0 text-[12px] font-bold tracking-[1.2px] whitespace-nowrap text-brand-green">
            {`TOUR · ${stepIndex + 1} OF ${TOUR_TOTAL}`}
          </p>
        </div>
        <h2
          id="nu-tour-title"
          className="m-0 text-[21px] leading-[1.25] font-semibold text-[#1c2a21] playful:font-heading"
        >
          {step.title}
        </h2>
        <p id="nu-tour-body" className="m-0 text-[14px] leading-[21px] text-[#595959]">
          {step.body}
        </p>
        <div className="flex w-full items-center gap-[10px] pt-[4px]">
          <div className="flex shrink-0 items-center gap-[6px]" aria-hidden="true">
            {Array.from({ length: TOUR_TOTAL }, (_, i) => (
              <span
                key={i}
                className={`h-[8px] rounded-[4px] ${
                  i === stepIndex ? 'w-[22px] bg-brand-green' : 'w-[8px] bg-[#d9dcd3]'
                }`}
              />
            ))}
          </div>
          <span className="min-w-0 flex-1" />
          <button
            type="button"
            onClick={close}
            className="cursor-pointer rounded-[4px] bg-transparent p-0 text-[14px] font-semibold whitespace-nowrap text-[#595959] underline decoration-solid underline-offset-[3px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
          >
            Skip tour
          </button>
          <Button
            ref={nextRef}
            variant="primary"
            size="sm"
            rightIcon={<WhiteArrowRightIcon className="size-[20px]" />}
            onClick={next}
          >
            Next
          </Button>
        </div>
      </div>
    </FlowPortal>
  );
};

export default GuidedTour;
