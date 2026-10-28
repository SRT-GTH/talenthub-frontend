import { useEffect, useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { classNames } from '../../utils/classNames.js';
import { ghostOut } from '../../utils/ghostOut.js';

/*
 * StatusToast — the ONE engine behind every plain status toast of the app (the dark "Link copied" / "Saved" / "Course saved" pills and the white "Saved" card). A toast is a variant of it:
 * the engine owns the polite live region (role="status"), the auto-dismiss timer, the optional <body> portal, and the swift enter / exit motion (styles/parent.css `.gth-toast-*`; on close a clone
 * plays the exit, utils/ghostOut.js). A variant only supplies WHERE it sits, WHAT its face looks like and its content.
 * Props: open (default true; false removes the face but keeps the live region mounted, for variants whose page keeps the toast element), duration (ms until `onClose`, 0 = stay),
 *        onClose, resetKey (a new value restarts the timer, e.g. the message), portal (render into <body>), wrapperClassName (the fixed live region: position, z-index, width),
 *        faceClassName (the card / pill; omit when the wrapper itself is the face, as in the one-element pills), style (on the wrapper), children.
 * Variants: ui/ActionToast (parent), publicData ShareToast, ui/SavedToast (settings), agency QueryToast / BriefingToast, institution roster / credentials, talent community / learning / messages / wallet.
 * ui/Toast stays the separate banner system (Figma 2900: scrim, queue, Playful skin) for the auth and profile flows.
 */
const StatusToast = ({
  open = true,
  duration = 0,
  onClose,
  resetKey,
  portal = false,
  wrapperClassName,
  faceClassName,
  style,
  children,
}) => {
  const wrapRef = useRef(null);
  const faceRef = useRef(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  const hasFace = faceClassName !== undefined;

  useEffect(() => {
    if (!open || !duration) return undefined;
    const t = window.setTimeout(() => closeRef.current?.(), duration);
    return () => window.clearTimeout(t);
  }, [open, duration, resetKey]);

  // On close (the face goes away, or the whole toast unmounts) a clone plays the exit; the nodes are still in memory when this runs.
  useLayoutEffect(() => {
    if (!open) return undefined;
    const wrap = wrapRef.current;
    const face = faceRef.current;
    return () => {
      if (!wrap) return;
      let root = wrap;
      if (face) {
        root = wrap.cloneNode(false);
        root.appendChild(face.cloneNode(true));
      }
      ghostOut(root, [['[data-toast-face]', 'gth-toast-out']]);
    };
  }, [open]);

  const body = (
    <div
      ref={wrapRef}
      role="status"
      aria-live="polite"
      className={classNames(wrapperClassName, !hasFace && open && 'gth-toast-in')}
      data-toast-face={!hasFace ? '' : undefined}
      style={style}
    >
      {open ? (
        hasFace ? (
          <div
            ref={faceRef}
            data-toast-face=""
            className={classNames('gth-toast-in', faceClassName)}
          >
            {children}
          </div>
        ) : (
          children
        )
      ) : null}
    </div>
  );
  return portal ? createPortal(body, document.body) : body;
};

export default StatusToast;
