/*
 * focusAfterRender — moves keyboard focus to an element once React has committed the change that removed the control the user just used (WCAG 2.4.3 Focus Order). A dialog returns focus to the element that
 * opened it, but when the action replaces that element (Approve fix removes "Review fix", Opt out swaps the whole ward view, Restore swaps it back) focus would drop to <body>: a keyboard user would start again
 * from the top of the page and a screen reader would lose its place.
 * Usage: focusAfterRender('#access-banner') or focusAfterRender('main h1'). The target gets tabindex="-1" if it has none, so headings and regions can take focus without joining the tab order.
 * Two animation frames: the first lets React commit, the second runs after the dialog's own focus-restore cleanup.
 */
export const focusAfterRender = (selector) => {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const el = document.querySelector(selector);
      if (!el) return;
      if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
      el.focus();
    });
  });
};
