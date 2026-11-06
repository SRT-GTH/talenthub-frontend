import { useEffect, useRef } from 'react';
import { debug } from '../../../../../utils/debug.js';
import EditorButton from './EditorButton.jsx';

const log = debug('ResetConfirm');

/*
 * ResetConfirm — the "Go back to the original?" popover of "Reset to default" (frame 7.8.2h): 340 wide, r20, p18, gap 10, shadow 0 10 28;
 * title 16/600, body 13.5/400 #575755 "“<original>” comes back, and this field no longer counts as a change.", buttons "Keep my words" /
 * "Reset". Opens under the Reset link (right edge), Esc and a click outside close it ("Keep my words"). `?modal=reset&field=<key>`.
 * Props: original, onKeep, onReset.
 */
const ResetConfirm = ({ original, onKeep, onReset }) => {
  const ref = useRef(null);

  useEffect(() => {
    log('open', { original });
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onKeep();
      }
    };
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target) && !e.target.closest('[aria-haspopup]'))
        onKeep();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    ref.current?.querySelector('button')?.focus();
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
      aria-label="Go back to the original?"
      className="absolute top-[calc(100%+6px)] right-0 z-30 flex w-[min(340px,calc(100vw-48px))] flex-col gap-[10px] rounded-[20px] border border-solid border-[#1c2a21]/10 bg-white p-[18px] shadow-[0_10px_28px_rgba(28,42,33,0.16)]"
    >
      <h3 className="m-0 font-sans text-[16px] leading-[19px] font-semibold text-[#1c2a21]">
        Go back to the original?
      </h3>
      <p className="m-0 font-sans text-[13.5px] leading-[19px] text-[#575755] max-lg:text-[13px]">
        {`“${original}” comes back, and this field no longer counts as a change.`}
      </p>
      <div className="mt-[8px] flex flex-wrap gap-[10px]">
        <EditorButton onClick={onKeep}>Keep my words</EditorButton>
        <EditorButton variant="primary" onClick={onReset}>
          Reset
        </EditorButton>
      </div>
    </div>
  );
};

export default ResetConfirm;
