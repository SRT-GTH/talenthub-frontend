import escapeRoomThumb from '../../../assets/games/game-store/escape-room-thumb.png';
import desertIslandThumb from '../../../assets/games/game-store/desert-island-thumb.png';
import towerBuilderThumb from '../../../assets/games/game-store/tower-builder-thumb.png';
import theNegotiationThumb from '../../../assets/games/game-store/the-negotiation-thumb.png';
import speedSortThumb from '../../../assets/games/game-store/speed-sort-thumb.png';
import monopolyThumb from '../../../assets/games/game-store/monopoly-thumb.png';
import thePitchThumb from '../../../assets/games/game-store/the-pitch-thumb.png';

/*
 * Game Store data — Figma 5132:60815 ("All Games"), card grid re-extracted
 * verbatim via get_design_context on 5132:61155 (node ids 61175-61299).
 * Plain data (no React components) so it can be shared between the Game
 * Store grid and the Game Details view without either owning it.
 *
 * `category` is the exact badge text shown on each card. Figma's filter
 * chip row (5132:61165) only has 6 categories — All/Strategy/Creativity/
 * Social/Logic/Speed — but Desert Island's own badge reads "Decision
 * Making", which isn't one of the 6 chips. This is a genuine inconsistency
 * in the source design, not a transcription error here (confirmed via
 * get_screenshot) — reproduced as-is rather than "fixed" by inventing a
 * 7th chip or silently reassigning Desert Island to a chip it doesn't
 * actually say. It simply won't match any category filter except "All".
 *
 * `difficultyColor` keys map to the exact per-difficulty text colours
 * Figma uses: Medium #c8951a (amber), Easy #387440 (brand green),
 * Hard #c0392b (red).
 *
 * `thumb` images are the REAL per-game illustrations from Figma's own
 * card fills (imgFrame14602-14608), downloaded from the Figma Dev Mode
 * MCP server's local asset proxy while it was reachable — not
 * placeholders. NOTE: Monopoly's asset is genuine Hasbro board-game
 * photography (not original art) — flagged for the team; a licensing
 * call, not an engineering one, so reproduced as-is per this exact
 * instruction to match Figma with no deviation.
 */

export const GAME_CATEGORIES = ['All', 'Strategy', 'Creativity', 'Social', 'Logic', 'Speed'];

export const DIFFICULTY_COLORS = {
  Easy: '#387440',
  Medium: '#c8951a',
  Hard: '#c0392b',
};

export const GAMES = [
  {
    id: 'escape-room',
    title: 'The Escape Room',
    category: 'Strategy',
    description:
      'Solve a series of puzzles under time pressure — reveals how you think under pressure.',
    difficulty: 'Medium',
    duration: '~4 min',
    thumb: escapeRoomThumb,
    // Only game with a real extracted "Game Details" screen (Figma
    // 5473:48185-48285, re-verified via get_design_context once the Figma
    // Dev Mode server became responsive again — supersedes an earlier,
    // incomplete pass at node 5132:61301 that mistakenly omitted the "How
    // to play" tip rows after a screenshot crop didn't show them). The
    // other 6 games only have card-level fields; no fabricated traits/tips
    // for them.
    details: {
      about:
        'Solve a series of puzzles under time pressure. Every decision you make is tracked to build your personality profile.',
      // Row-major order so a 2-col grid renders Figma's actual column-major
      // grouping (5473:48225-48227 — col 1: Problem solving/Stress
      // tolerance, col 2: Decision speed/Planning vs. improvising).
      traits: [
        'Problem solving approach',
        'Decision speed',
        'Stress tolerance',
        'Planning vs. improvising',
      ],
      howToPlayTips: [
        {
          title: 'You have 5 minutes',
          subtitle: "Don't overthink it — quick decisions reveal more than careful ones",
        },
        {
          title: 'Solve each puzzle in order',
          subtitle: 'Work through each challenge one at a time — no skipping ahead',
        },
        {
          title: 'No right answers — just make your choice',
          subtitle: "Every option is valid — we're watching how you decide, not what you pick",
        },
        {
          title: 'Your decisions are tracked not your score',
          subtitle:
            "Winning doesn't matter here — your choices are what build your personality profile",
        },
      ],
    },
  },
  {
    id: 'desert-island',
    title: 'Desert Island',
    category: 'Decision Making',
    description: "You're stranded — what do you take, who do you save?",
    difficulty: 'Medium',
    duration: '~4 min',
    thumb: desertIslandThumb,
  },
  {
    id: 'tower-builder',
    title: 'Tower Builder',
    category: 'Logic',
    description: 'Stack blocks under constraints — shows your planning style and patience level.',
    difficulty: 'Easy',
    duration: '~4 min',
    thumb: towerBuilderThumb,
  },
  {
    id: 'the-negotiation',
    title: 'The Negotiation',
    category: 'Social',
    description: 'Two sides, one deal — how you handle conflict and compromise tells us a lot.',
    difficulty: 'Hard',
    duration: '~4 min',
    thumb: theNegotiationThumb,
  },
  {
    id: 'speed-sort',
    title: 'Speed Sort',
    category: 'Speed',
    description:
      'Sort items into categories as fast as you can — reveals how you process under pressure.',
    difficulty: 'Hard',
    duration: '~4 min',
    thumb: speedSortThumb,
  },
  {
    id: 'monopoly',
    title: 'Monopoly',
    category: 'Strategy',
    description:
      'A classic property game that shows how you think about wealth, strategy and interactions.',
    difficulty: 'Medium',
    duration: '~4 min',
    thumb: monopolyThumb,
  },
  {
    id: 'the-pitch',
    title: 'The Pitch',
    category: 'Creativity',
    description:
      'Sell an unusual idea in 60 seconds — shows bravery, communication and persuasion style',
    difficulty: 'Hard',
    duration: '~4 min',
    thumb: thePitchThumb,
  },
];
