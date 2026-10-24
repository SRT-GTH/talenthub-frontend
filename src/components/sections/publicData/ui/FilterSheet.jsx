import { useEffect, useRef, useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import Button from '../../../ui/Button.jsx';
import Modal from '../../../ui/Modal.jsx';
import { formatCount } from '../publicDataFormat.js';
import { FILTER_DEFINITIONS } from './data/uiData.js';
import { PublicIconClose } from './publicUiIcons.jsx';

const log = debug('FilterSheet');

/*
 * FilterSheet — Figma "8.9.2 · Mobile · Filters bottom sheet" (8515:322; sheet node 8515:498, 390x560): a bottom sheet over the page.
 *   handle 40x5 #d9d9d4 r3 · "Filter talents" 20/24 600 + close icon (22px) · "Results update when you tap Show." 13/19 #595959
 *   groups (label 14/17 600): Region [Greater Accra · Ashanti · Volta · Northern · +12 more] · Education level [Pre-tertiary · In-tertiary ·
 *   Post-tertiary] · Interest [Technology · Business · Health · Creative · +6] · Age range [14–17 · 18–24 · 25–29 · 30–35]
 *   option pills r100, 13/16 500, p 8/14, 1px #e7e7e7, selected = #387440 fill + white text
 *   actions: "Clear all" (white, outlined) + "Show 237 talents" (green primary)
 * Built on the shared Modal (portal, Esc, scroll lock, bottom sheet below 640px) + a focus trap and focus return added here.
 * Props
 *   isOpen      boolean
 *   onClose     fn()
 *   filters     applied filters { region, edu, interest, age, gender } — the draft starts from these each time it opens
 *   onApply     fn(draft)   "Show N talents" (the page writes the URL and closes)
 *   countFor    fn(draft) -> number | null   result count for the draft (the page owns data); when null the button reads "Show results"
 *   definitions FILTER_DEFINITIONS by default; groups with `sheet: false` are not drawn (Gender is missing from the Figma sheet)
 * Behaviour not drawn (⚠️ ASSUMPTION): tapping a selected pill clears it (single choice per group, like the URL); "+12 more" expands the
 * group in place and then reads "Show fewer"; Gender is omitted exactly as drawn (reported to the lead).
 */

const FilterSheet = ({
  isOpen,
  onClose,
  filters = {},
  onApply,
  countFor,
  definitions = FILTER_DEFINITIONS,
}) => {
  const [draft, setDraft] = useState(filters);
  const [expanded, setExpanded] = useState({});
  const panelRef = useRef(null);
  const closeRef = useRef(null);
  const returnRef = useRef(null);

  // reset the draft each time the sheet opens, remember where to return focus
  useEffect(() => {
    if (!isOpen) return undefined;
    log('open', filters);
    returnRef.current = document.activeElement;
    setDraft(filters);
    setExpanded({});
    const raf = requestAnimationFrame(() => closeRef.current?.focus());
    return () => {
      cancelAnimationFrame(raf);
      const el = returnRef.current;
      if (el && typeof el.focus === 'function') el.focus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const trap = (e) => {
    if (e.key !== 'Tab' || !panelRef.current) return;
    const focusables = panelRef.current.querySelectorAll(
      'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const count = countFor ? countFor(draft) : null;
  const showLabel =
    typeof count === 'number' ? `Show ${formatCount(count)} talents` : 'Show results';

  const pick = (key, id) => {
    setDraft((d) => {
      const next = { ...d, [key]: d[key] === id ? null : id };
      log('draft', next);
      return next;
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      showClose={false}
      ariaLabel="Filter talents"
      contentClassName="!rounded-t-[24px]"
    >
      <div
        ref={panelRef}
        onKeyDown={trap}
        className="flex flex-col gap-[14px] px-[20px] pt-[12px] pb-[28px] font-sans"
      >
        <span
          aria-hidden="true"
          className="mx-auto mb-[6px] block h-[5px] w-[40px] rounded-[3px] bg-[#d9d9d4] sm:hidden"
        />
        <div className="flex items-center justify-between gap-[8px]">
          <h2 className="m-0 text-[20px] leading-[24px] font-semibold text-[#1c2a21]">
            Filter talents
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="-mr-[6px] inline-flex size-[34px] cursor-pointer items-center justify-center rounded-full bg-transparent text-[#1c2a21] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            <PublicIconClose className="size-[22px]" />
          </button>
        </div>
        <p className="m-0 text-[13px] leading-[19px] text-[#595959]">
          Results update when you tap Show.
        </p>
        {definitions
          .filter((d) => d.sheet !== false)
          .map((d) => {
            const isOpenGroup = expanded[d.key];
            const extra = d.options.length - d.sheetVisible;
            const ordered = d.sheetFirst
              ? [
                  ...d.sheetFirst.map((id) => d.options.find((o) => o.id === id)).filter(Boolean),
                  ...d.options.filter((o) => !d.sheetFirst.includes(o.id)),
                ]
              : d.options;
            const visible = isOpenGroup ? ordered : ordered.slice(0, d.sheetVisible);
            return (
              <div
                key={d.key}
                role="group"
                aria-label={d.label}
                className="flex flex-col gap-[8px]"
              >
                <span className="text-[14px] leading-[17px] font-semibold text-[#1c2a21]">
                  {d.label}
                </span>
                <div className="flex flex-wrap gap-[8px]">
                  {visible.map((o) => {
                    const selected = draft?.[d.key] === o.id;
                    return (
                      <button
                        key={o.id}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => pick(d.key, o.id)}
                        className={classNames(
                          'min-h-[34px] cursor-pointer rounded-full border border-solid px-[14px] py-[8px] text-[13px] leading-[16px] font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
                          selected
                            ? 'border-[#387440] bg-[#387440] text-white'
                            : 'border-[#e7e7e7] bg-white text-[#1c2a21]'
                        )}
                      >
                        {o.sheetLabel ?? o.label}
                      </button>
                    );
                  })}
                  {extra > 0 && (
                    <button
                      type="button"
                      aria-expanded={Boolean(isOpenGroup)}
                      onClick={() => setExpanded((x) => ({ ...x, [d.key]: !x[d.key] }))}
                      className="min-h-[34px] cursor-pointer rounded-full border border-solid border-[#e7e7e7] bg-white px-[14px] py-[8px] text-[13px] leading-[16px] font-medium text-[#1c2a21] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
                    >
                      {isOpenGroup ? 'Show fewer' : `+${extra} more`}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        <div className="flex gap-[10px] pt-[6px]">
          <Button
            type="button"
            variant="tertiary"
            size="md"
            onClick={() => {
              log('clear all (draft)');
              setDraft({});
            }}
            className="!rounded-[14px] !px-[22px] !py-[12px]"
          >
            Clear all
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => {
              log('apply', draft);
              onApply?.(draft);
            }}
            className="min-w-0 flex-1"
          >
            {showLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default FilterSheet;
