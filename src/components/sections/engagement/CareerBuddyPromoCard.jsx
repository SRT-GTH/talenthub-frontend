import { classNames } from '../../../utils/classNames.js';
import ChatBubble from '../../ui/ChatBubble.jsx';
import careerBuddyPenguin from '../../../assets/engagement/career-buddy-penguin.png';

/*
 * CareerBuddyPromoCard — green AI-buddy promo card (right rail).
 * Source: Figma frame 3384:82005 ("week card").
 *
 *   ├─ header: small round avatar + "Career Buddy / Your AI guide"
 *   ├─ chat bubble: short intro line from the buddy
 *   ├─ penguin mascot: full-body PNG anchored to the right edge
 *   └─ CTA: white "Start with Career Buddy →" pill button
 *
 * The background is brand-green with two decorative ellipses (deeper green
 * and accent-tinted) to suggest depth. The penguin sits absolutely-positioned
 * along the right edge so the chat bubble can overlap the front of its
 * white belly — matches the Figma layering exactly.
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
      'p-5 min-h-[260px]',
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

    {/* Penguin mascot — sits in the right portion of the card with a small
      gutter so the raised hand isn't clipped by the card edge. Layered
      behind the chat bubble so the bubble can overlap his white belly
      (Figma layering). */}
    <img
      src={careerBuddyPenguin}
      alt=""
      aria-hidden="true"
      className={classNames(
        'pointer-events-none select-none',
        'absolute right-3 top-3 z-0',
        'h-[82%] w-auto object-contain object-bottom'
      )}
    />

    <header className="relative z-10 flex items-center gap-3">
      <span
        aria-hidden="true"
        className="inline-flex size-12 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/40 overflow-hidden"
      >
        <img
          src={careerBuddyPenguin}
          alt=""
          className="size-12 object-cover object-top scale-150 translate-y-1"
        />
      </span>
      <div className="leading-tight">
        <p className="font-display text-[18px] tracking-[-0.2px]">Career Buddy</p>
        <p className="font-sans text-[12px] text-white/80">Your AI guide</p>
      </div>
    </header>

    <div className="relative z-10 mt-5 max-w-[230px]">
      <ChatBubble tail="bottom-right">
        <span className="block font-semibold text-content-primary">
          Don&rsquo;t Want To Fill It Manually?
        </span>
        <span className="mt-1 block text-neutral-darker">
          Don&rsquo;t worry, Our Ai Career Buddy has you covered.
        </span>
      </ChatBubble>
    </div>

    <div className="relative z-10 mt-5 flex justify-center">
      {/* Figma uses a pure white pill (not the design-system shelf button)
        — full-width, dark text, soft 1px shadow, large radius. */}
      <button
        type="button"
        onClick={onStart}
        className={classNames(
          'inline-flex w-full max-w-[260px] items-center justify-center gap-2',
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
