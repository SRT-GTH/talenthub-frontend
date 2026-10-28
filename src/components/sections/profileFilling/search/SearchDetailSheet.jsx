import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useDialogBehaviour } from '../../publicData/share/useDialogBehaviour.js';
import { fetchSearchDetail } from '../../../../services/careerBuddy.api.js';
import { debug } from '../../../../utils/debug.js';
import SearchResultCards from './SearchResultCards.jsx';

const log = debug('SearchDetailSheet');

/*
 * SearchDetailSheet - Iteration 9 sec. 5: the full view of a search result that has no page of its own (career,
 * SHS programme, tertiary programme), over the chat - a bottom sheet on phones, a centred panel from md up. Loads
 * GET /api/guidance/search/detail (talent-scoped like search). Shows the description, headed sections (what they
 * do, skills, subjects, entry requirements, ...) and, for careers, related GTH posts / jobs / courses as cards.
 * The chat never navigates away: "Ask Career Buddy" sends the card's question and closes the sheet.
 * Props: card (the search card: type, code, title, ask), onAsk(card), onOpen(card) (a related card's page),
 * onClose, disabled (a turn is running), returnFocusTo (the "View details" button - Safari doesn't focus a
 * clicked button, so the opener is passed, not read from document.activeElement).
 */
const SearchDetailSheet = ({
  card,
  onAsk,
  onOpen,
  onClose,
  disabled = false,
  returnFocusTo = null,
}) => {
  const ref = useRef(null);
  const titleId = useId();
  const [state, setState] = useState({ loading: true, detail: null, error: null });
  useDialogBehaviour(ref, onClose);

  // Focus goes back to whatever opened the sheet ("View details") when it closes. Read during the first render:
  // by the time effects run, useDialogBehaviour has already moved focus into the sheet.
  const opener = useRef(
    returnFocusTo || (typeof document !== 'undefined' ? document.activeElement : null)
  );
  useEffect(() => {
    const el = opener.current;
    return () => {
      if (el && typeof el.focus === 'function' && document.contains(el)) el.focus();
    };
  }, []);

  useEffect(() => {
    let live = true;
    setState({ loading: true, detail: null, error: null });
    fetchSearchDetail(card.type, card.code)
      .then((detail) => live && setState({ loading: false, detail, error: null }))
      .catch((err) => {
        log.error('detail failed', err?.message);
        if (live)
          setState({
            loading: false,
            detail: null,
            error: err?.status === 404 ? 'gone' : 'failed',
          });
      });
    return () => {
      live = false;
    };
  }, [card.type, card.code]);

  const d = state.detail;
  const ask = d?.ask || card.ask;
  const onScrim = (event) => {
    if (event.target === event.currentTarget) onClose?.();
  };

  return createPortal(
    <div
      data-share-dialog=""
      onMouseDown={onScrim}
      className="fixed inset-0 z-[60] flex items-end justify-center bg-[#0b1a0f]/55 font-sans md:items-center md:p-[24px]"
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="relative flex max-h-[88vh] w-full max-w-[640px] flex-col overflow-hidden rounded-t-[24px] bg-white text-[#1c2a21] shadow-[0_8px_30px_rgba(15,15,10,0.18)] outline-none md:rounded-[24px]"
      >
        <header className="flex items-start gap-[12px] border-b border-solid border-[#1c2a21]/10 px-[20px] pt-[18px] pb-[14px] md:px-[28px]">
          <div className="flex min-w-0 flex-1 flex-col gap-[4px]">
            <span className="font-sans text-[12px] font-medium tracking-[0.2px] text-[#387440]">
              {d?.subtitle ||
                (card.type === 'career'
                  ? 'Career'
                  : card.type === 'elective'
                    ? 'SHS programme'
                    : 'Programme')}
            </span>
            <h2
              id={titleId}
              className="m-0 font-sans text-[20px] font-semibold leading-[26px] playful:font-heading"
            >
              {d?.title || card.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close details"
            className="flex size-[36px] shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-[#f3f3ef] text-[18px] leading-none text-[#1c2a21] hover:bg-[#e9e9e4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            <span aria-hidden="true">×</span>
          </button>
        </header>

        <div className="flex min-h-0 flex-1 flex-col gap-[18px] overflow-y-auto px-[20px] py-[18px] md:px-[28px]">
          {state.loading ? (
            <p role="status" className="m-0 text-[14px] text-[#1c2a21]/70">
              Loading details…
            </p>
          ) : state.error ? (
            <p role="alert" className="m-0 text-[14px] text-[#1c2a21]/80">
              {state.error === 'gone'
                ? "These details aren't available any more."
                : "I couldn't load the details just now. Please try again in a moment."}
            </p>
          ) : (
            <>
              {d?.about ? <p className="m-0 text-[15px] leading-[22px]">{d.about}</p> : null}
              {(d?.sections || []).map((s) => (
                <section key={s.heading} className="flex flex-col gap-[8px]">
                  <h3 className="m-0 text-[14px] font-semibold tracking-[0.2px] text-[#1f4526]">
                    {s.heading}
                  </h3>
                  {s.items.length === 1 ? (
                    <p className="m-0 text-[14px] leading-[21px]">{s.items[0]}</p>
                  ) : (
                    <ul className="m-0 flex flex-col gap-[4px] pl-[18px] text-[14px] leading-[21px]">
                      {s.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
              {d?.related?.length ? (
                <section className="flex flex-col gap-[4px] rounded-[16px] bg-[#f3f7f1] p-[12px]">
                  <h3 className="m-0 px-[4px] text-[14px] font-semibold tracking-[0.2px] text-[#1f4526]">
                    On GTH
                  </h3>
                  <SearchResultCards
                    results={d.related}
                    compact
                    disabled={disabled}
                    onOpen={onOpen}
                    onAsk={onAsk}
                  />
                </section>
              ) : null}
            </>
          )}
        </div>

        <footer className="flex flex-col gap-[8px] border-t border-solid border-[#1c2a21]/10 px-[20px] pt-[12px] pb-[16px] sm:flex-row-reverse md:px-[28px]">
          {ask ? (
            <button
              type="button"
              disabled={disabled}
              onClick={() => onAsk?.({ ...card, ask })}
              className="min-h-[44px] flex-1 cursor-pointer rounded-[12px] border-0 bg-[#387440] px-[16px] font-sans text-[15px] font-medium text-white hover:bg-[#2f6236] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f3c84b]"
            >
              Ask Career Buddy
            </button>
          ) : null}
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] flex-1 cursor-pointer rounded-[12px] border-2 border-solid border-[#1c2a21]/20 bg-white px-[16px] font-sans text-[15px] font-medium text-[#1c2a21] hover:bg-[#f7f7f3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            Back to chat
          </button>
        </footer>
      </div>
    </div>,
    document.body
  );
};

export default SearchDetailSheet;
