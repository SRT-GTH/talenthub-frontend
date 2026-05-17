import { classNames } from '../../../utils/classNames.js';
import ChatBubble from '../../ui/ChatBubble.jsx';

/*
 * CareerBuddyPromoCard — green AI-buddy promo card (right rail).
 * Source: Figma frame 3384:82005 ("week card").
 *
 *   ├─ header: 48×48 avatar tile + "Career Buddy / Your AI guide"
 *   ├─ chat bubble: short intro line from the buddy
 *   └─ CTA: "Start with Career Buddy →" pill button
 *
 * The background is brand-green with two decorative ellipses (deeper green
 * and accent-tinted) to suggest depth. The penguin mascot from Figma is
 * approximated with a placeholder ring/medal; swap in the real asset
 * when art lands.
 */

const ArrowRight = ({ className }) => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M4 10h12" />
    <path d="M10 4l6 6-6 6" />
  </svg>
);

const CareerBuddyPromoCard = ({ onStart, className }) => (
  <article
    className={classNames(
      'relative overflow-hidden rounded-2xl bg-brand-green text-white',
      'shadow-bottom-300',
      'p-5 min-h-[248px]',
      className
    )}
  >
    {/* Decorative ellipses (Figma 3384:82006, 3384:82007) */}
    <span
      aria-hidden="true"
      className="absolute -right-16 -top-14 size-[180px] rounded-full bg-brand-green-hover/60"
    />
    <span
      aria-hidden="true"
      className="absolute left-10 top-32 size-[250px] rounded-full bg-accent/15 blur-[2px]"
    />

    <header className="relative flex items-center gap-3">
      <span
        aria-hidden="true"
        className="inline-flex size-12 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/40"
      >
        <span className="inline-flex size-8 items-center justify-center rounded-full bg-accent text-brand-green-dark font-semibold">
          CB
        </span>
      </span>
      <div className="leading-tight">
        <p className="font-display text-[18px] tracking-[-0.2px]">Career Buddy</p>
        <p className="font-sans text-[12px] text-white/80">Your AI guide</p>
      </div>
    </header>

    <div className="relative mt-6 max-w-[240px]">
      <ChatBubble tail="bottom-right">
        <span className="block font-semibold text-content-primary">
          Don’t Want To Fill It Manually?
        </span>
        <span className="mt-1 block text-neutral-darker">
          Don’t worry, Our Ai Career Buddy has you covered.
        </span>
      </ChatBubble>
    </div>

    <div className="relative mt-6 flex justify-center">
      {/* Figma uses a pure white pill (not the design-system shelf button)
        — full-width, brand-green text, soft 1px shadow, large radius. */}
      <button
        type="button"
        onClick={onStart}
        className={classNames(
          'inline-flex w-full max-w-[300px] items-center justify-center gap-2',
          'rounded-pill bg-white py-3 px-5',
          'font-sans font-semibold text-[15px] leading-6 tracking-[0.1px] text-content-primary',
          'shadow-[0_1px_2px_rgba(0,0,0,0.05),0_4px_12px_rgba(0,0,0,0.08)]',
          'hover:bg-yellow-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'
        )}
      >
        Start with Career Buddy
        <ArrowRight className="size-4 text-content-primary" />
      </button>
    </div>
  </article>
);

export default CareerBuddyPromoCard;
