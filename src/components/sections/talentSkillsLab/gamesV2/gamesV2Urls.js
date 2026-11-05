/*
 * Games v2 — URL builders for the Games tab dialogs (contract in gamesV2State.js). Each builder returns a `?query` string that
 * keeps every other key (`tab`, `demo`, …) and swaps only the dialog keys, so `navigate(url)` stays on /skills-lab.
 *   openGameUrl(params, id, { mode, level, gstate })  → ?tab=games&game=<id>[&mode=practice][&level=…][&gstate=cooldown]   GV-02 / GV-03
 *   openDialogUrl(params, 'resume' | 'expired', id)   → ?tab=games&dialog=<kind>&game=<id>                                   GV-09 / GV-13
 *   closeDialogUrl(params)                            → the same page without any dialog key
 */
const DIALOG_KEYS = ['game', 'mode', 'level', 'gstate', 'dialog'];

const base = (params) => {
  const next = new URLSearchParams(params);
  DIALOG_KEYS.forEach((k) => next.delete(k));
  next.set('tab', 'games');
  return next;
};

export const openGameUrl = (params, id, extra = {}) => {
  const next = base(params);
  next.set('game', id);
  Object.entries(extra).forEach(([k, v]) => v && next.set(k, v));
  return `?${next.toString()}`;
};

export const openDialogUrl = (params, kind, id) => {
  const next = base(params);
  next.set('dialog', kind);
  next.set('game', id);
  return `?${next.toString()}`;
};

export const closeDialogUrl = (params) => `?${base(params).toString()}`;
