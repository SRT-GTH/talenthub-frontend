import { LpBIcon } from '../home/LpBIcons.jsx';
import { FaqPlusIcon } from '../faq/FaqIcons.jsx';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';

const log = debug('LandingFaqItem');

/*
 * LandingFaqItem — the "LP · FAQ item" accordion card, shared by the home FAQ section (S9) and the FAQ page (P-06 answers).
 * r22 card, 1.4px ink border, pad 22/22/22/26; row = question + 40px round toggle; the answer expands with a height + fade (400ms).
 * Open = white card, closed = #fffdf7. The two frames draw it slightly differently, kept as variants:
 *   variant="home": open card has the green hard shadow, toggle turns green and swaps + for ×, question 20px.
 *   variant="page": open and closed share the grey hard shadow, the + rotates 45° into ×, question scales 17–20px, answer has 24px right padding.
 * The whole card toggles (product owner, 2026-11-14); the button inside stays the accessible control (aria-expanded, keyboard) and its
 * click bubbles to the card, so the card's handler is the only one. A click that ends a text selection does not toggle.
 */
const GREY_SHADOW = 'shadow-[5px_5px_0_rgba(28,42,33,0.2),0_10px_24px_rgba(28,42,33,0.06)]';
const EASE = 'duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none';

const LandingFaqItem = ({ id, question, answer, open, onToggle, variant = 'page' }) => {
  const home = variant === 'home';
  return (
    <div
      onClick={() => {
        if (String(window.getSelection?.() || '').trim()) {
          log('card click ignored: text selected', id);
          return;
        }
        onToggle();
      }}
      className={classNames(
        'flex cursor-pointer flex-col rounded-[22px] border-[1.4px] border-solid border-[#1c2a21]/[.32] py-[22px] pl-[26px] pr-[22px]',
        home
          ? `transition-[background-color,box-shadow] ${EASE}`
          : `transition-colors ${EASE} ${GREY_SHADOW}`,
        open ? 'bg-white' : 'bg-[#fffdf7]',
        home && (open ? 'shadow-[0_6px_0_#387440,0_10px_24px_rgba(28,42,33,.06)]' : GREY_SHADOW)
      )}
    >
      <h3 className="m-0">
        <button
          type="button"
          id={`faq-q-${id}`}
          aria-expanded={open}
          aria-controls={`faq-a-${id}`}
          className="flex w-full cursor-pointer items-center gap-4 border-0 bg-transparent p-0 text-left"
        >
          <span
            className={classNames(
              'min-w-0 flex-1 font-sans font-semibold text-[#1c2a21]',
              home
                ? 'text-[20px] leading-[23.9px] max-md:text-[17px] max-md:leading-[1.2]'
                : 'text-[clamp(17px,calc(14px+0.35vw),20px)] leading-[1.2]'
            )}
          >
            {question}
          </span>
          <span
            className={classNames(
              'flex size-10 shrink-0 items-center justify-center rounded-full border-[1.5px] border-solid border-[#1c2a21]',
              home
                ? `transition-[background-color,color,rotate] ${EASE}`
                : 'transition-colors duration-[400ms]',
              open ? 'bg-[#387440] text-white' : 'bg-white text-[#1c2a21]',
              home && open && 'rotate-90'
            )}
          >
            {home ? (
              <LpBIcon name={open ? 'close' : 'plus'} size={16} strokeWidth={2.2} />
            ) : (
              <FaqPlusIcon
                size={16}
                className={classNames('transition-transform', open && 'rotate-45')}
              />
            )}
          </span>
        </button>
      </h3>
      <div
        className={classNames(
          `grid transition-[grid-template-rows,opacity] ${EASE}`,
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        )}
      >
        <div className="overflow-hidden">
          <p
            id={`faq-a-${id}`}
            role="region"
            aria-labelledby={`faq-q-${id}`}
            aria-hidden={!open}
            className={classNames(
              'm-0 pt-3 font-sans text-[16px] leading-[25px] text-[#595959]',
              !home && 'pr-6'
            )}
          >
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingFaqItem;
