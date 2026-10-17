import { createPortal } from 'react-dom';

/*
 * FlowPortal — shared host for the four new-user overlays (welcome / tour / chat / gate).
 * Portals into <body> as a direct child tagged `data-pf-portal`, which is what
 * usePlayfulDialogA11y looks for so the rest of <body> (the app root) goes inert while the
 * overlay is open. Each overlay supplies its own scrim + role="dialog" element.
 */
const FlowPortal = ({ className = '', onScrimMouseDown, children }) =>
  createPortal(
    <div
      data-pf-portal=""
      className={`fixed inset-0 z-[60] ${className}`}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onScrimMouseDown?.();
      }}
    >
      {children}
    </div>,
    document.body
  );

export default FlowPortal;
