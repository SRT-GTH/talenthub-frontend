import { useEffect, useRef } from 'react';
import { debug } from '../../../../../utils/debug.js';
import FieldButton from './FieldButton.jsx';

const log = debug('ResetPhotoPopover');

/*
 * ResetPhotoPopover — "Go back to the original photo?" (Figma 7.8.10h): a 340 px card under the field's "Reset to default" button (white, r20, 1 px ink 10 %,
 * 18 padding, soft shadow) with the design's photo (304 x 150), "The design’s photo comes back. “Career fair 2026” stays in the library." and the buttons
 * "Keep new photo" and "Reset". A non-modal dialog: Esc and a click outside close it, focus starts on the card.
 * Props: original (asset), current (asset), onKeep(), onReset(). The parent positions it (relative wrapper; it sits at top: 100% - 14 px).
 */
const ResetPhotoPopover = ({ original, current, onKeep, onReset }) => {
  const ref = useRef(null);

  useEffect(() => {
    log('open', { original: original.id, current: current.id });
    const root = ref.current;
    root?.focus({ preventScroll: true });
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onKeep();
      }
    };
    const onDown = (e) => {
      if (root && !root.contains(e.target) && !e.target.closest?.('[data-reset-trigger]')) onKeep();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={ref}
      role="dialog"
      tabIndex={-1}
      aria-label="Go back to the original photo?"
      className="absolute top-[calc(100%-14px)] right-0 outline-none z-20 flex w-[340px] max-w-[calc(100vw-48px)] flex-col gap-[10px] rounded-[20px] border border-solid border-[#1c2a21]/10 bg-white p-[18px] shadow-[0_10px_28px_rgba(0,0,0,0.14)] max-sm:w-full"
    >
      <h3 className="m-0 font-sans text-[16px] leading-[19px] font-semibold text-[#1c2a21]">
        Go back to the original photo?
      </h3>
      <img
        src={original.src}
        alt={`The design’s photo: ${original.title}`}
        className="aspect-[304/150] w-full rounded-[10px] object-cover"
      />
      <p className="m-0 font-sans text-[13.5px] leading-[19px] text-[#575755]">
        The design’s photo comes back. “{current.title}” stays in the library.
      </p>
      <div className="flex flex-wrap gap-[10px]">
        <FieldButton onClick={onKeep}>Keep new photo</FieldButton>
        <FieldButton tone="primary" onClick={onReset}>
          Reset
        </FieldButton>
      </div>
    </div>
  );
};

export default ResetPhotoPopover;
