import { useEffect, useRef, useState } from 'react';
import FilterGroups from './FilterGroups.jsx';
import { RESULTS } from './OpportunitiesData.js';
import { ArrowRightGlyph } from './OpportunitiesIcons.jsx';
import { debug } from '../../../../utils/debug.js';

const log = debug('FiltersSheet');

/*
 * Mobile / tablet "Filters" bottom sheet (Figma 7815:306490): scrim #1c2a21 @55%, sheet #fffcf7 radius 28 28 0 0, handle 44x5,
 * head "Filters" (Bricolage 24/600) + "Reset", scrolling groups, sticky "Show 312 roles" CTA. Open state is ?filters=1.
 */
const FiltersSheet = ({ open, state, update }) => {
  /* Slide-up / slide-down: stays mounted for the exit (380ms). On entry the sheet is first committed off-screen, a forced reflow
   * makes the browser resolve that starting style, and only then `shown` flips — otherwise the entrance has nothing to transition from. */
  const [mounted, setMounted] = useState(open);
  const [shown, setShown] = useState(false);
  const sheetRef = useRef(null);
  useEffect(() => {
    if (open) {
      setMounted(true);
      return undefined;
    }
    setShown(false);
    const t = setTimeout(() => setMounted(false), 380);
    return () => clearTimeout(t);
  }, [open]);
  useEffect(() => {
    if (!mounted || !open || !sheetRef.current) return;
    sheetRef.current.getBoundingClientRect();
    setShown(true);
  }, [mounted, open]);

  useEffect(() => {
    if (!open) return undefined;
    log('open');
    const onKey = (e) => {
      if (e.key === 'Escape') update({ filters: null });
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      log('close');
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, update]);

  if (!mounted) return null;

  const close = () => update({ filters: null });

  return (
    <div className="fixed inset-0 z-[100] xl:hidden">
      <button
        type="button"
        aria-label="Close filters"
        onClick={close}
        className={`absolute inset-0 size-full cursor-default border-0 bg-[#1c2a21]/55 p-0 transition-opacity duration-300 ease-out motion-reduce:transition-none ${shown ? 'opacity-100' : 'opacity-0'}`}
      />
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label={RESULTS.sheetTitle}
        className={`absolute inset-x-0 bottom-0 mx-auto flex max-h-[min(770px,calc(100dvh-72px))] w-full max-w-[600px] flex-col gap-4 rounded-t-[28px] bg-[#fffcf7] px-5 pb-[34px] pt-[10px] transition-transform duration-[380ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] motion-reduce:transition-none ${shown ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <span
          aria-hidden="true"
          className="mx-auto h-[5px] w-11 shrink-0 rounded-[3px] bg-[#1c2a21]/20"
        />
        <div className="flex shrink-0 items-center gap-2">
          <h2 className="m-0 flex-1 font-heading text-[24px] font-semibold leading-[28.8px] text-[#1c2a21]">
            {RESULTS.sheetTitle}
          </h2>
          <button
            type="button"
            onClick={() => update({ level: [], style: [], region: [] })}
            className="lp-ul cursor-pointer border-0 bg-transparent p-0 font-sans text-[15px] font-semibold leading-[17.9px] text-[#2e6336]"
          >
            {RESULTS.reset}
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto pb-[22px] pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <FilterGroups state={state} update={update} />
        </div>
        <button
          type="button"
          onClick={close}
          className="inline-flex h-14 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-[14px] border-2 border-[#2a5730] bg-[#387440] px-[34px] font-sans text-[16px] font-bold tracking-[0.1px] text-[#fef1e7] shadow-[0_4px_0_#224626]"
        >
          {`${RESULTS.showPrefix} ${RESULTS.count} ${RESULTS.showSuffix}`}
          <span className="size-5 text-white">
            <ArrowRightGlyph />
          </span>
        </button>
      </div>
    </div>
  );
};

export default FiltersSheet;
