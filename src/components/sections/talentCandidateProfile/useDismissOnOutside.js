import { useEffect } from 'react';

/*
 * useDismissOnOutside — closes a popover on Escape or on a mouse-down outside the element in `ref` (the anchor wrapper, so the trigger button toggling it does not count as "outside").
 * Props: ref, active (only listens while the popover is open), onDismiss.
 */
const useDismissOnOutside = (ref, active, onDismiss) => {
  useEffect(() => {
    if (!active) return undefined;
    const handleMouseDown = (event) => {
      if (ref.current && !ref.current.contains(event.target)) onDismiss();
    };
    const handleKey = (event) => {
      if (event.key === 'Escape') onDismiss();
    };
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('keydown', handleKey);
    };
  }, [ref, active, onDismiss]);
};

export default useDismissOnOutside;
