import { useRef } from 'react';
import BannerToast from '../../../ui/BannerToast.jsx';

/*
 * PipelineToast — the two-line success toast of the pipeline actions (Figma "Component 33" in PL-05 10173:14896, PL-09, PL-11, PL-16): `ui/BannerToast` (success tone) hugging its content,
 * centred 22px below the viewport top (it sits over the top bar, as drawn), on a page tint of #1c2a21 at 3 % with a 1.3 background blur (about 0.65px as CSS) (Figma "Frame 14574"). The tint ignores pointer events.
 * Props: title, message, actionLabel, onAction, onClose, duration (ms; 0 keeps it up, the default so a frame URL is a stable screenshot).
 */
const PipelineToast = ({ title, message, actionLabel, onAction, onClose, duration = 0 }) => {
  // `BannerToast` calls onAction and then onClose; when the action already wrote the URL (Undo, View details) or navigated away, that close must not overwrite it.
  const actedRef = useRef(false);
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[60] bg-[#1c2a21]/[0.03] backdrop-blur-[0.65px]"
      />
      <BannerToast
        tone="success"
        title={title}
        message={message}
        actionLabel={actionLabel}
        onAction={() => {
          actedRef.current = true;
          onAction?.();
        }}
        onClose={() => {
          if (!actedRef.current) onClose?.();
        }}
        duration={duration}
        placement="fixed top-[22px] left-1/2 z-[70] w-max max-w-[calc(100vw-32px)] -translate-x-1/2"
      />
    </>
  );
};

export default PipelineToast;
