/*
 * Games v2 page id (URL `/skills-lab/play/<id>`) ↔ backend engine key (services/games.service.js, utils/gameEngines/registry.js).
 */
export const GAME_KEY_BY_ID = {
  'memory-match': 'memory_match',
  'pattern-pulse': 'number_sequence',
  'word-shuffle': 'word_scramble',
  'switch-sort': 'rule_switch',
  'three-in-a-row': 'tic_tac_toe',
  'grid-logic': 'sudoku',
  'sum-grid': 'number_grid',
  'tower-shift': 'tower_of_hanoi',
  'errand-run': 'route_planner',
  'chess-tactics': 'chess_tactics',
  'chess-match': 'chess_match',
  'crisis-room': 'crisis_room',
  'makola-haggle': 'makola_haggle',
};

export const GAME_ID_BY_KEY = Object.fromEntries(
  Object.entries(GAME_KEY_BY_ID).map(([id, key]) => [key, id])
);

export const gameKeyFor = (id) => GAME_KEY_BY_ID[id] ?? null;
export const gameIdFor = (key) => GAME_ID_BY_KEY[key] ?? null;

/** Live by default; the Figma frames (`?f=`) and `?demo=1` keep the local mock so design QA still works. */
export const isLiveGames = (
  search = typeof window !== 'undefined' ? window.location.search : ''
) => {
  const p = new URLSearchParams(search);
  return !p.get('f') && p.get('demo') !== '1';
};
