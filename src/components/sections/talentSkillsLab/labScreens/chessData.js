/*
 * Strategic thinking — chess puzzles (Figma SL-L18a … L18h). Only puzzle 3 (back-rank mate) is drawn; its board, texts and the
 * e-file legal-move dots are verbatim. ⚠️ ASSUMPTION: puzzles 1, 2, 4 and 5 are invented to fill the 5-puzzle flow (topics match the
 * SL-L18g breakdown: Forks, Pins, Back-rank mates, Sacrifices, Endgames). Every position uses only king / rook / pawn (the only art
 * drawn) and was checked with python-chess (unique best first move). `targets` = the squares tapped pieces can go to (the dots);
 * Figma draws just the e-file for the rook, so each puzzle lists a few plausible moves for one or two pieces instead of every legal move.
 * Piece = { sq, c: 'w'|'b', t: 'k'|'r'|'p' }.  Moves are 'from-to' strings, e.g. 'e1-e8'.
 */
export const CHESS_RULES_TAIL = [
  'Two wrong moves and the puzzle counts as missed.',
  'The computer doesn’t move until you play.',
];
export const CHESS_WHY = {
  title: 'What this shows recruiters',
  body: 'Spotting the weak point in a situation and committing to one decisive move. No chess history needed.',
};

export const PIECE_NAME = { k: 'King', r: 'Rook', p: 'Pawn' };

/* Move a piece (captures whatever stands on the target). */
export const applyMove = (pieces, from, to) =>
  pieces.filter((p) => p.sq !== to).map((p) => (p.sq === from ? { ...p, sq: to } : p));

export const encodeMove = (from, to) => `${from}-${to}`;
