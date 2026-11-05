/*
 * ghostOut — plays an exit animation for an element that React is unmounting.
 * Call it from a layout-effect cleanup: the node (attached or just detached) is cloned and the static clone is appended to <body>, made inert (aria-hidden, no pointer events, no ids)
 * and animated out with the given class names, then removed. Works for every way a dialog / toast closes (Esc, scrim, buttons, route change) with no change to the callers.
 * Props: root (the element to clone: the scrim / fixed wrapper), classes ([[selector or null for the root, className], ...]), duration (ms, default 160).
 */
export const ghostOut = (root, classes, duration = 160) => {
  if (!root || typeof document === 'undefined') return;
  const ghost = root.cloneNode(true);
  ghost.setAttribute('aria-hidden', 'true');
  ghost.setAttribute('inert', '');
  ghost.style.pointerEvents = 'none';
  for (const el of [ghost, ...ghost.querySelectorAll('*')]) {
    el.removeAttribute('id');
    el.removeAttribute('role');
    el.removeAttribute('aria-modal');
    el.removeAttribute('aria-label');
    el.removeAttribute('data-autofocus');
    el.setAttribute('tabindex', '-1');
    el.classList.remove('gth-scrim-in', 'gth-card-in', 'gth-toast-in');
  }
  for (const [selector, className] of classes) {
    const target = !selector || ghost.matches(selector) ? ghost : ghost.querySelector(selector);
    target?.classList.add(className);
  }
  document.body.appendChild(ghost);
  setTimeout(() => ghost.remove(), duration);
};
