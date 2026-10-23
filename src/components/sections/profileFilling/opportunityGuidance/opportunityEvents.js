/*
 * Tiny bridge between chat content rendered from the script (match cards, in-thread chips) and the chat's own submit():
 * the scripted nodes build their JSX once, so a click cannot close over the live `submit`. CareerBuddySection listens
 * for this event and runs `submit(text)` (the same path a footer chip takes).
 */
export const BUDDY_CHIP_EVENT = 'career-buddy:chip';

export const sendBuddyChip = (text) => {
  window.dispatchEvent(new CustomEvent(BUDDY_CHIP_EVENT, { detail: text }));
};
