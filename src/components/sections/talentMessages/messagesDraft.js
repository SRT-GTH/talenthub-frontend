import { useSyncExternalStore } from 'react';

/*
 * Talent Messages — the composer's draft text, shared between the composer (package A) and "Help me reply" (package C).
 * Module-level store so both can read/write it without prop drilling or URL params (Figma H-04 "Draft placed in message box").
 * Lead-owned. API: useMessagesDraft() -> { draft, setDraft(text), clearDraft() }.
 */
let draft = '';
const listeners = new Set();
const subscribe = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};
const emit = () => listeners.forEach((fn) => fn());
export const setMessagesDraft = (text) => {
  draft = String(text ?? '');
  emit();
};

export const useMessagesDraft = () => {
  const value = useSyncExternalStore(
    subscribe,
    () => draft,
    () => ''
  );
  return { draft: value, setDraft: setMessagesDraft, clearDraft: () => setMessagesDraft('') };
};
