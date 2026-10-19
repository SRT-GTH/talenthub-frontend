/*
 * Strategic thinking — chess puzzles (Figma SL-L18a … L18h). Only puzzle 3 (back-rank mate) is drawn; its board, texts and the
 * e-file legal-move dots are verbatim. ⚠️ ASSUMPTION: puzzles 1, 2, 4 and 5 are invented to fill the 5-puzzle flow (topics match the
 * SL-L18g breakdown: Forks, Pins, Back-rank mates, Sacrifices, Endgames). Every position uses only king / rook / pawn (the only art
 * drawn) and was checked with python-chess (unique best first move). `targets` = the squares tapped pieces can go to (the dots);
 * Figma draws just the e-file for the rook, so each puzzle lists a few plausible moves for one or two pieces instead of every legal move.
 * Piece = { sq, c: 'w'|'b', t: 'k'|'r'|'p' }.  Moves are 'from-to' strings, e.g. 'e1-e8'.
 */
const P = (list) => list.map((s) => ({ c: s[0], t: s[1], sq: s.slice(2) }));

const RULES_MATE = ['Mate in one move. Only one move wins.'];

export const CHESS_RULES_TAIL = [
  'Two wrong moves and the puzzle counts as missed.',
  'The computer doesn’t move until you play.',
];
export const CHESS_WHY = {
  title: 'What this shows recruiters',
  body: 'Spotting the weak point in a situation and committing to one decisive move. No chess history needed.',
};

export const CHESS_PUZZLES = [
  {
    // ⚠️ ASSUMPTION (whole puzzle)
    id: 'chess-1',
    topic: 'Forks',
    eyebrow: 'FORKS',
    prompt:
      'White to play and win material in one move. Black’s two rooks stand where a single pawn can attack both. Tap a piece, then the square you want to move it to.',
    pieces: P([
      'bkg7',
      'bpf7',
      'bpg6',
      'bph7',
      'brc6',
      'bre6',
      'wkg1',
      'wrf1',
      'wpd4',
      'wpf2',
      'wpg2',
      'wph2',
    ]),
    targets: { d4: ['d5'], f1: ['e1', 'd1', 'c1', 'b1', 'a1'] },
    answer: 'd4-d5',
    mateSq: null,
    word: 'Winning move',
    san: 'd5',
    rules: ['One move wins a rook. Only one move wins.'],
    hint: 'A pawn attacks diagonally. Is there a square where one pawn touches both black rooks?',
    explain:
      'd5. The pawn attacks both rooks at once. Black can only save one, so White wins a rook for a pawn.',
    wrong: {
      default: {
        title: 'Not quite. That doesn’t win material.',
        body: 'Nothing is attacked twice after that move, so Black simply carries on. Look at the pawn on d4. The move resets, and you have 1 try left.',
      },
    },
  },
  {
    // ⚠️ ASSUMPTION (whole puzzle)
    id: 'chess-2',
    topic: 'Pins',
    eyebrow: 'PINS',
    prompt:
      'White to play and win material in one move. Black’s rook on e5 is pinned to its king. Tap a piece, then the square you want to move it to.',
    pieces: P(['bke8', 'bpf6', 'bre5', 'wkg1', 'wre1', 'wpd4', 'wpg2', 'wph2']),
    targets: { d4: ['d5', 'e5'], e1: ['e2', 'e3', 'e4', 'e5', 'd1', 'c1', 'b1', 'a1', 'f1'] },
    answer: 'd4-e5',
    mateSq: null,
    word: 'Winning move',
    san: 'dxe5',
    rules: ['One move wins a rook. Only one move wins.'],
    hint: 'The rook on e5 is protected by a pawn, so taking it with your rook is only a trade. What else attacks e5?',
    explain:
      'dxe5. A pawn takes the pinned rook. Black recaptures with the f-pawn, but White has won a rook for a pawn.',
    wrong: {
      'e1-e5': {
        title: 'Not quite. That’s only a trade.',
        body: 'Rxe5+ is met by fxe5, so rook is swapped for rook. Use a cheaper piece to take it. The move resets, and you have 1 try left.',
      },
      default: {
        title: 'Not quite. The pin is still there.',
        body: 'That move leaves the pinned rook alone. Use a piece that wins it for less. The move resets, and you have 1 try left.',
      },
    },
  },
  {
    id: 'chess-3',
    topic: 'Back-rank mates',
    eyebrow: 'BACK-RANK MATE',
    prompt:
      'White to play and checkmate in one. Black’s king is boxed in by its own pawns. Tap a piece, then the square you want to move it to.',
    pieces: P([
      'bkg8',
      'bpa7',
      'bpf7',
      'bpg7',
      'bph7',
      'brb2',
      'wpa3',
      'wpf2',
      'wpg2',
      'wph2',
      'wkg1',
      'wre1',
    ]),
    targets: { e1: ['e2', 'e3', 'e4', 'e5', 'e6', 'e7', 'e8'] },
    answer: 'e1-e8',
    mateSq: 'g8',
    word: 'Checkmate',
    san: 'Re8#',
    rules: RULES_MATE,
    hint: 'Black’s king has no escape squares on the back rank. Which of your pieces can reach that rank in one move?',
    explain:
      'Re8#. The rook checks along the back rank, the king is boxed in by its own pawns, and nothing can block or capture. One clean, decisive move.',
    hintArrow: { from: 'e1', to: 'e8' },
    wrong: {
      'e1-e7': {
        title: 'Not quite. That’s not check.',
        body: 'Re7 doesn’t attack the king, so Black gets a free move and can hit back with Rb1+. Look one rank higher. The move resets, and you have 1 try left.',
      },
      default: {
        title: 'Not quite. That’s not check.',
        body: 'That move doesn’t attack the king, so Black gets a free move. Look one rank higher. The move resets, and you have 1 try left.',
      },
    },
  },
  {
    // ⚠️ ASSUMPTION (whole puzzle)
    id: 'chess-4',
    topic: 'Sacrifices',
    eyebrow: 'SACRIFICES',
    prompt:
      'White to play. Give up a rook to force checkmate on the next move. Tap a piece, then the square you want to move it to.',
    pieces: P([
      'bra8',
      'bkg8',
      'bpf7',
      'bpg7',
      'bph7',
      'wrb2',
      'wrb1',
      'wkg1',
      'wpf2',
      'wpg2',
      'wph2',
    ]),
    targets: {
      b2: ['b3', 'b4', 'b5', 'b6', 'b7', 'b8', 'c2', 'd2', 'e2'],
      b1: ['a1', 'c1', 'd1', 'e1', 'f1'],
    },
    answer: 'b2-b8',
    mateSq: null,
    word: 'Winning move',
    san: 'Rb8+',
    rules: ['Find the sacrifice. Only one move wins.'],
    hint: 'Black’s king is boxed in. If the black rook must take your rook, what is left for your second rook?',
    explain:
      'Rb8+. Black has to take with the rook, and Rxb8 is checkmate. The sacrificed rook pulls the only defender away.',
    wrong: {
      default: {
        title: 'Not quite. That doesn’t force mate.',
        body: 'Black has time to answer that move. You need a check that Black must take. The move resets, and you have 1 try left.',
      },
    },
  },
  {
    // ⚠️ ASSUMPTION (whole puzzle)
    id: 'chess-5',
    topic: 'Endgames',
    eyebrow: 'ENDGAMES',
    prompt:
      'White to play and checkmate in one. Black’s lone king is cut off against the edge. Tap a piece, then the square you want to move it to.',
    pieces: P(['bkh8', 'wkg6', 'wra1']),
    targets: {
      a1: ['a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1'],
      g6: ['f5', 'g5', 'h5', 'f6', 'h6', 'f7'],
    },
    answer: 'a1-a8',
    mateSq: 'h8',
    word: 'Checkmate',
    san: 'Ra8#',
    rules: RULES_MATE,
    hint: 'Your king already covers g7 and h7. Which rank does the black king still need to cross?',
    explain:
      'Ra8#. The king on g6 covers g7 and h7, and the rook takes the whole back rank. There is nowhere left to go.',
    wrong: {
      default: {
        title: 'Not quite. Black can still move.',
        body: 'The black king still has a square. Use the rook to take away the back rank. The move resets, and you have 1 try left.',
      },
    },
  },
];

export const PIECE_NAME = { k: 'King', r: 'Rook', p: 'Pawn' };

/* Move a piece (captures whatever stands on the target). */
export const applyMove = (pieces, from, to) =>
  pieces.filter((p) => p.sq !== to).map((p) => (p.sq === from ? { ...p, sq: to } : p));

export const encodeMove = (from, to) => `${from}-${to}`;
