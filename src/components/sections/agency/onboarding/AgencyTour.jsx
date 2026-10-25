import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { debug } from '../../../../utils/debug.js';
import { AgArrowRight } from '../home/agencyHomeIcons.jsx';
import { TOUR_STEPS } from './data/agencyOnboardingData.js';

const log = debug('AgencyTour');

const RAIL_LABELS = ['Home', 'Districts', 'Programmes', 'Queries', 'Data requests', 'Applicants'];
const PAD = 8;
const TIP_W = 460;

/* Resolve a tour target to a viewport rect: the quick-action card, the primary rail items (union) or the checklist card. */
const measure = (target) => {
  let rect = null;
  if (target === 'quick-query') {
    rect = document.querySelector('[data-tour-target="query"]')?.getBoundingClientRect() ?? null;
  } else if (target === 'checklist') {
    rect =
      document.querySelector('[data-tour-target="checklist"]')?.getBoundingClientRect() ?? null;
  } else if (target === 'rail-nav') {
    const links = [...document.querySelectorAll('aside nav a')].filter(
      (a) => a.offsetParent !== null && RAIL_LABELS.includes(a.textContent.trim())
    );
    if (links.length) {
      const rects = links.map((a) => a.getBoundingClientRect());
      const left = Math.min(...rects.map((r) => r.left));
      const top = Math.min(...rects.map((r) => r.top));
      const right = Math.max(...rects.map((r) => r.right));
      const bottom = Math.max(...rects.map((r) => r.bottom));
      rect = { left, top, right, bottom, width: right - left, height: bottom - top };
    }
  }
  return rect && rect.width > 0 ? rect : null;
};

/*
 * AgencyTour — the 3-step spotlight tour over the first-login home (Figma 11.4.1f/g/h 8607:4253 / 4771 / 5326).
 * Each step cuts a hole in the #0b1a0f 60 % scrim around its target (the "Spotlight ring": 3px #ffd86b, r32, 8px outside the target; the scrim is the ring's
 * 9999px box-shadow) and draws the "Tour tooltip" (460 x 238, white, 1px ink@.10, r22, p 20/22, gap 12): Career Buddy tile + "TOUR · n OF 3" (12/14 700, +1.2, #387440),
 * title 21/26 600, text 14/21 #595959, three step dots (the current one is a 22 x 8 pill), "Skip tour" and the green "Next →" ("Finish tour" on the last step).
 * Step 1 = the "Run a query" card (tooltip below), step 2 = the primary rail items (tooltip to the right), step 3 = the checklist (tooltip below).
 * Keyboard: Esc ends the tour, Tab is kept inside the tooltip, focus starts on Next and returns to where it was on close.
 * ⚠️ ASSUMPTION: when a target is not on screen (phone: the rail is a drawer) the tooltip is centred without a spotlight.
 * Props: step (1-3), onStep(n), onClose.
 */

const AgencyTour = ({ step, onStep, onClose }) => {
  const def = TOUR_STEPS[step - 1];
  const tipRef = useRef(null);
  const [rect, setRect] = useState(null);
  const [pos, setPos] = useState({ left: 16, top: 120 });
  const isLast = step === TOUR_STEPS.length;

  const place = useCallback(() => {
    const r = measure(def.target);
    setRect(r);
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const w = Math.min(TIP_W, vw - 32);
    const h = tipRef.current?.offsetHeight ?? 238;
    if (!r) {
      setPos({ left: Math.max(16, (vw - w) / 2), top: Math.max(16, (vh - h) / 2), side: 'center' });
      return;
    }
    if (def.target === 'rail-nav') {
      setPos({
        left: Math.min(r.right + PAD + 12, vw - w - 16),
        top: Math.min(Math.max(16, r.top + (r.height - h) / 2), vh - h - 16),
        side: 'right',
      });
    } else {
      setPos({
        left: Math.min(Math.max(16, r.left + 20), vw - w - 16),
        top: Math.min(r.bottom + PAD + 16, Math.max(16, vh - h - 16)),
        side: 'below',
      });
    }
  }, [def.target]);

  useLayoutEffect(() => {
    document
      .querySelector(def.target === 'checklist' ? '[data-tour-target="checklist"]' : 'main')
      ?.scrollIntoView?.({ block: 'nearest' });
    place();
  }, [def.target, place]);

  useEffect(() => {
    log('step', { step });
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => {
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
    };
  }, [step, place]);

  useEffect(() => {
    const previous = document.activeElement;
    return () => {
      if (previous && typeof previous.focus === 'function') previous.focus();
    };
  }, []);

  useEffect(() => {
    tipRef.current?.querySelector('[data-autofocus]')?.focus();
  }, [step]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !tipRef.current) return;
      const items = [...tipRef.current.querySelectorAll('button')];
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const next = () => {
    if (isLast) onClose();
    else onStep(step + 1);
  };

  return createPortal(
    <div className="fixed inset-0 z-[70]">
      {rect ? (
        <div
          aria-hidden="true"
          style={{
            left: rect.left - PAD,
            top: rect.top - PAD,
            width: rect.width + PAD * 2,
            height: rect.height + PAD * 2,
          }}
          className="pointer-events-none absolute rounded-[32px] border-[3px] border-solid border-[#ffd86b] shadow-[0_0_0_9999px_rgba(11,26,15,0.6)]"
        />
      ) : (
        <div aria-hidden="true" className="absolute inset-0 bg-[#0b1a0f]/60" />
      )}
      <div
        ref={tipRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Tour, step ${step} of ${TOUR_STEPS.length}: ${def.title}`}
        style={{ left: pos.left, top: pos.top, width: `min(${TIP_W}px, calc(100vw - 32px))` }}
        className="absolute flex flex-col gap-[12px] rounded-[22px] border border-solid border-[#1c2a21]/10 bg-white px-[22px] py-[20px] shadow-[0_1px_2px_rgba(15,15,10,0.05),0_2px_8px_rgba(15,15,10,0.08)]"
      >
        {pos.side === 'below' ? (
          <span
            aria-hidden="true"
            className="absolute -top-[7px] left-[40px] size-[14px] rotate-45 bg-white"
          />
        ) : null}
        {pos.side === 'right' ? (
          <span
            aria-hidden="true"
            className="absolute top-1/2 -left-[7px] size-[14px] -translate-y-1/2 rotate-45 bg-white"
          />
        ) : null}
        <div className="flex items-center gap-[10px]">
          <span
            aria-hidden="true"
            className="grid size-[40px] place-items-center rounded-full bg-[#ebf1ec] font-sans text-[12px] font-bold text-[#387440]"
          >
            GTH
          </span>
          <p className="m-0 font-sans text-[12px] leading-[14px] font-bold tracking-[1.2px] text-[#387440]">
            TOUR · {step} OF {TOUR_STEPS.length}
          </p>
        </div>
        <h2 className="m-0 font-sans text-[21px] leading-[26px] font-semibold text-[#1c2a21]">
          {def.title}
        </h2>
        <p className="m-0 font-sans text-[14px] leading-[21px] text-[#595959]">{def.text}</p>
        <div className="flex items-center gap-[10px] pt-[4px]">
          <span
            role="img"
            aria-label={`Step ${step} of ${TOUR_STEPS.length}`}
            className="flex items-center gap-[6px]"
          >
            {TOUR_STEPS.map((s) => (
              <span
                key={s.id}
                className={`h-[8px] rounded-[4px] ${s.id === step ? 'w-[22px] bg-[#387440]' : 'w-[8px] bg-[#d9dcd3]'}`}
              />
            ))}
          </span>
          <span className="flex-1" />
          <button
            type="button"
            onClick={onClose}
            className="min-h-[24px] font-sans text-[14px] leading-[17px] font-semibold text-[#595959] underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            Skip tour
          </button>
          <button
            type="button"
            data-autofocus
            onClick={next}
            className="inline-flex min-h-[48px] items-center gap-[8px] rounded-[10px] border-2 border-solid border-[#2a5730] bg-[#387440] px-[18px] py-[12px] font-sans text-[16px] leading-[24px] font-bold tracking-[0.1px] text-white shadow-[0_4px_0_#2a5730] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            {def.next}
            <AgArrowRight className="size-[20px]" />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AgencyTour;
