import { classNames } from '../../../utils/classNames.js';
import ChatBubble from '../../ui/ChatBubble.jsx';
import Button from '../../ui/Button.jsx';

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

    <div className="relative mt-6 max-w-[220px]">
      <ChatBubble tail="bottom-right">
        Don’t want to fill it manually? Don’t worry, Our Ai Career Buddy has you covered.
      </ChatBubble>
    </div>

    <div className="relative mt-6 flex justify-center">
      <Button
        variant="tertiary"
        size="md"
        onClick={onStart}
        rightIcon={<ArrowRight className="size-4" />}
      >
        Start with Career Buddy
      </Button>
    </div>
  </article>
);

export default CareerBuddyPromoCard;
