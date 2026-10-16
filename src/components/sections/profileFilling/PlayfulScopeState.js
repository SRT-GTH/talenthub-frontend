import { useSyncExternalStore } from 'react';

/*
 * usePlayfulScopeActive — true only while a screen that renders <UiStyleScope>
 * (talent Career Buddy) has put data-ui-style="playful" on <html>.
 *
 * Why not just useUiStyle()? The saved preference defaults to "playful" app
 * wide, but TalentProfilePanel is ALSO rendered by the recruiter / parent
 * Career Buddy, which are not in scope and must stay Focused. The attribute
 * on <html> is the single source of truth for "Playful is live here"
 * (wiki/playful-mode.md), so JS branches read it the same way CSS does.
 */
const subscribe = (notify) => {
  if (typeof MutationObserver === 'undefined') return () => {};
  const observer = new MutationObserver(notify);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-ui-style'],
  });
  return () => observer.disconnect();
};

const getSnapshot = () => document.documentElement.getAttribute('data-ui-style') === 'playful';
const getServerSnapshot = () => false;

export const usePlayfulScopeActive = () =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
