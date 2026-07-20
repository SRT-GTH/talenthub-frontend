import {
  SkillIconPython,
  ChessCrownIcon,
  SkillIconDataAnalysis,
  SkillIconCreativeDesign,
  SkillIconProjectMgmt,
  SkillIconPublicSpeaking,
} from '../components/shared/assets.jsx';

export const SKILL_LAB_QUIZZES = {
  'team-leadership': {
    skill: 'Team Leadership',
    engagementType: 'chess-puzzle',
    icon: '♟️',
    IconComponent: ChessCrownIcon,
    iconBg: 'bg-[#ebf1ec]',
    title: 'Skills Lab : Team Leadership',
    subtitle: '6 challenges · Pass 4+ to earn the ✓ badge · Retakeable',
    passThreshold: 4,
    initialLives: 5,
    challenges: [
      {
        id: 'chess-1',
        topic: 'Strategic Sacrifice',
        title: 'Back Rank',
        titleEmphasis: 'Mate.',
        question: 'Find the winning move.',
        description:
          "White to play and deliver checkmate in 1 move. Black's king is trapped behind its own pawns on the back rank. Find the rook move that ends the game.",
        fen: '6k1/5ppp/8/8/8/8/5PPP/R3K3 w - - 0 1',
        turnToPlay: 'w',
        solutionMove: { from: 'a1', to: 'a8' },
        leadershipInsight:
          'Centralize your pieces early: control of the centre equals board presence. The side with more active pieces usually wins.',
        hint: {
          heading: 'The rook wants to move.',
          description:
            "Look at the back rank. Black's king has no escape squares. What piece can deliver check on the 8th rank?",
          steps: [
            {
              title: 'The back rank is weak',
              body: "Black's king on g8 is boxed in by its own pawns on f7, g7, h7. No escape squares.",
            },
            {
              title: 'Ra8# delivers checkmate',
              body: 'The rook slides to a8, giving check. The king cannot move — pawns block every escape.',
            },
            {
              title: 'The leadership parallel',
              body: 'When your opponent is boxed in by their own structure, a single decisive move wins. Timing beats force.',
            },
          ],
          highlightedSquares: { a1: '#1E4D2B', a8: '#ff6b6b', g8: '#1E4D2B' },
          keyInsight:
            'Back rank mates exploit a king trapped by its own pawns. One rook on an open file is enough.',
        },
      },
      {
        id: 'chess-2',
        topic: 'Tactical Vision',
        title: 'Fork the',
        titleEmphasis: 'King.',
        question: 'Find the winning move.',
        description:
          'White to play. Use a knight fork to win material. The knight can attack two pieces at once.',
        fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p2N/2B1P3/8/PPPP1PPP/RNBQK2R w KQkq - 4 4',
        turnToPlay: 'w',
        solutionMove: { from: 'h5', to: 'f6' },
        leadershipInsight:
          'A knight fork attacks two targets at once. In leadership, the best moves solve multiple problems simultaneously.',
        hint: {
          heading: 'The knight on h5 wants to move.',
          description:
            'Look at the green squares. Now look at the target squares highlighted in red. What piece can reach it in one move?',
          steps: [
            {
              title: 'Knights move in an L-shape',
              body: 'From h5: 2 squares forward + 1 right = g3. OR 2 forward + 1 left = f6. The knight on h5 can reach f6 via the L-pattern.',
            },
            {
              title: 'Nxf6+: the discovered attack',
              body: "The knight captures on f6 with check. Black's king on e8 is attacked, and the queen on d8 is also in danger.",
            },
            {
              title: 'The leadership parallel',
              body: 'Sacrifice a resource now (the knight = a team member, a budget, your time) to create an unstoppable position 3 moves later. Commit when you see the line.',
            },
          ],
          highlightedSquares: { h5: '#1E4D2B', f6: '#ff6b6b', e8: '#1E4D2B' },
          keyInsight:
            'Knight forks are devastating because the opponent can only save one piece. Always look for double attacks.',
        },
      },
      {
        id: 'chess-3',
        topic: 'Defensive Consolidation',
        title: 'Save the',
        titleEmphasis: 'Queen.',
        question: 'Find the best defensive move.',
        description:
          'Black to play. Your queen is under attack. Find the move that saves it while improving your position.',
        fen: 'rnb1kbnr/pppp1ppp/8/8/4P2q/3P4/PPP2PPP/RNBQKBNR b KQkq - 0 3',
        turnToPlay: 'b',
        solutionMove: { from: 'h4', to: 'e7' },
        leadershipInsight:
          "Retreating isn't weakness — it's repositioning. The queen moves to a safe square while staying active.",
        hint: {
          heading: 'The queen needs safety.',
          description:
            "The queen on h4 is exposed. Where can it go that's safe and still controls important squares?",
          steps: [
            {
              title: 'The queen is under pressure',
              body: 'On h4, the queen is exposed and White may attack it with g3 next move.',
            },
            {
              title: 'Qe7 is safe and central',
              body: 'The queen retreats to e7, defending the king side and maintaining flexibility.',
            },
            {
              title: 'The leadership parallel',
              body: 'A strategic retreat preserves your most valuable asset. Great leaders know when to pull back and regroup.',
            },
          ],
          highlightedSquares: { h4: '#ff6b6b', e7: '#1E4D2B' },
          keyInsight:
            'Saving your queen is almost always the priority. A safe, central queen is worth more than an aggressive, exposed one.',
        },
      },
      {
        id: 'chess-4',
        topic: 'Endgame Planning',
        title: 'Promote the',
        titleEmphasis: 'Pawn.',
        question: 'Find the winning move.',
        description:
          'White to play. You have a passed pawn on the 7th rank. Push it to promote and win the game.',
        fen: '8/P7/8/8/8/8/6k1/4K3 w - - 0 1',
        turnToPlay: 'w',
        solutionMove: { from: 'a7', to: 'a8' },
        leadershipInsight:
          'In the endgame, a single pawn can become the most powerful piece. Nurture your long-term investments.',
        hint: {
          heading: 'The pawn is one step away.',
          description:
            'Your pawn on a7 is one square from the promotion rank. Nothing can stop it.',
          steps: [
            {
              title: 'The pawn on a7 can promote',
              body: "One more step and this pawn becomes a queen. Black's king on g2 is too far away to stop it.",
            },
            {
              title: 'a8=Q wins immediately',
              body: 'The new queen gives White overwhelming material advantage. The game is decided.',
            },
            {
              title: 'The leadership parallel',
              body: 'Patient development of a resource through its full lifecycle creates disproportionate returns. See plans through.',
            },
          ],
          highlightedSquares: { a7: '#1E4D2B', a8: '#ff6b6b' },
          keyInsight:
            'Passed pawns must be pushed. In the endgame, a supported passed pawn is worth more than a piece.',
        },
      },
      {
        id: 'chess-5',
        topic: 'Set Operations & Comprehensions',
        title: 'Pin and',
        titleEmphasis: 'Win.',
        question: 'Find the winning move.',
        description:
          'White to play. Use a pin to win material. The bishop can create an absolute pin against the king.',
        fen: 'r2qkbnr/ppp2ppp/2np4/4p3/2B1P1b1/5N2/PPPP1PPP/RNBQ1RK1 w kq - 2 5',
        turnToPlay: 'w',
        solutionMove: { from: 'f1', to: 'e1' },
        leadershipInsight:
          "Pins restrict movement. In leadership, positioning your resources to limit opponents' options is more powerful than direct confrontation.",
        hint: {
          heading: 'Create pressure on the e-file.',
          description:
            'The black queen and king are on the same file. How can you exploit this alignment?',
          steps: [
            {
              title: 'The e-file is semi-open',
              body: "White's e-pawn has been exchanged. The rook can use this file.",
            },
            {
              title: 'Re1 pins the queen',
              body: 'The rook on e1 creates pressure down the e-file toward the black king.',
            },
            {
              title: 'The leadership parallel',
              body: 'Align your resources to create maximum pressure. Indirect threats are often more effective than direct ones.',
            },
          ],
          highlightedSquares: { f1: '#1E4D2B', e1: '#ff6b6b', e8: '#1E4D2B' },
          keyInsight:
            "Rooks belong on open files. When the opponent's king and queen share a file, look for pins.",
        },
      },
      {
        id: 'chess-6',
        topic: 'Strategic Sacrifice',
        title: 'Queen',
        titleEmphasis: 'Sacrifice.',
        question: 'Find the winning move.',
        description:
          'White to play. Sometimes you must give up your strongest piece to win. Find the queen sacrifice that leads to checkmate.',
        fen: 'r1bqr1k1/pppp1ppp/2n2n2/2b1p2Q/2B1P3/3P1N2/PPP2PPP/RNB1K2R w KQ - 6 6',
        turnToPlay: 'w',
        solutionMove: { from: 'h5', to: 'f7' },
        leadershipInsight:
          'The greatest leaders know when to sacrifice their strongest asset for the greater victory. Bold moves require clear vision.',
        hint: {
          heading: 'The queen eyes f7.',
          description:
            'The f7 pawn is only defended by the king. What happens if the queen takes it?',
          steps: [
            {
              title: 'f7 is a weak square',
              body: 'The pawn on f7 is only protected by the king. This makes it a prime target.',
            },
            {
              title: 'Qxf7+ forces the king',
              body: 'The queen captures on f7 with check. The king must respond, and White has a strong attack.',
            },
            {
              title: 'The leadership parallel',
              body: 'Target the weakest point in any system. One precise strike at the right spot unravels the whole defense.',
            },
          ],
          highlightedSquares: { h5: '#1E4D2B', f7: '#ff6b6b', g8: '#1E4D2B' },
          keyInsight:
            'f7 (and f2 for White) is the weakest square in the opening because only the king defends it.',
        },
      },
    ],
  },
  python: {
    skill: 'Python',
    icon: '🐍',
    IconComponent: SkillIconPython,
    iconBg: 'bg-[#f7fee7]',
    title: 'Skills Lab : Python Verification',
    subtitle: '8 challenges · Pass 6+ to earn the ✓ badge · Retakeable',
    passThreshold: 6,
    initialLives: 5,
    challenges: [
      {
        id: 'py-1',
        topic: 'List Comprehension',
        question: 'What does this code',
        questionEmphasis: 'print?',
        subtitle: 'Read the snippet carefully. Select the exact output when this code runs.',
        code: [
          { text: 'nums', color: 'variable' },
          { text: ' = [1, 2, 3, 4, 5] ', color: 'value' },
          { text: 'result', color: 'variable' },
          { text: ' = ', color: 'value' },
          { text: '[x**2 ', color: 'value' },
          { text: 'for', color: 'function' },
          { text: ' x ', color: 'value' },
          { text: 'in', color: 'function' },
          { text: ' nums ', color: 'value' },
          { text: 'if', color: 'function' },
          { text: ' x % 2 == 0] ', color: 'value' },
          { text: 'print', color: 'function' },
          { text: '(result)', color: 'value' },
        ],
        options: ['[1, 4, 9, 16, 25]', '[4, 16]', '[2, 4]', '[1, 9, 25]'],
        correctIndex: 1,
        hint: {
          heading: 'Break it into two parts.',
          steps: [
            { title: 'Filter: x % 2 == 0', body: 'Only even numbers pass: 2 and 4.' },
            { title: 'Transform: x**2', body: '2² = 4, 4² = 16. Result: [4, 16].' },
          ],
          keyInsight:
            'The filter runs first, then the transform. Only 2 and 4 are even, so only their squares appear.',
        },
      },
      {
        id: 'py-2',
        topic: 'Dictionary Methods',
        question: 'What does this code',
        questionEmphasis: 'print?',
        subtitle: 'Read the snippet carefully. Select the exact output when this code runs.',
        code: [
          { text: 'd', color: 'variable' },
          { text: " = {'a': 1, 'b': 2, 'c': 3} ", color: 'value' },
          { text: 'result', color: 'variable' },
          { text: ' = ', color: 'value' },
          { text: 'list', color: 'function' },
          { text: '(d.', color: 'value' },
          { text: 'values', color: 'function' },
          { text: '()) ', color: 'value' },
          { text: 'print', color: 'function' },
          { text: '(result)', color: 'value' },
        ],
        options: [
          "['a', 'b', 'c']",
          '[1, 2, 3]',
          "[('a', 1), ('b', 2), ('c', 3)]",
          "{'a': 1, 'b': 2, 'c': 3}",
        ],
        correctIndex: 1,
        hint: {
          heading: 'Know your dict methods.',
          steps: [
            { title: '.keys() → keys only', body: "Returns dict_keys(['a', 'b', 'c'])." },
            { title: '.values() → values only', body: 'Returns dict_values([1, 2, 3]).' },
            { title: 'list() wraps it', body: 'Converts the view object into a plain list.' },
          ],
          keyInsight:
            '.values() returns only the values, not the keys. Wrapping in list() gives [1, 2, 3].',
        },
      },
      {
        id: 'py-3',
        topic: 'String Slicing',
        question: 'What does this code',
        questionEmphasis: 'print?',
        subtitle: 'Read the snippet carefully. Select the exact output when this code runs.',
        code: [
          { text: 's', color: 'variable' },
          { text: ' = "GhanaTalentHub" ', color: 'value' },
          { text: 'print', color: 'function' },
          { text: '(s[', color: 'value' },
          { text: '5', color: 'number' },
          { text: ':', color: 'value' },
          { text: '11', color: 'number' },
          { text: '])', color: 'value' },
        ],
        options: ['Ghana', 'Talent', 'alentH', 'TalentHub'],
        correctIndex: 1,
        hint: {
          heading: 'Count the indices.',
          steps: [
            { title: 'Index 0–4 = "Ghana"', body: 'G=0, h=1, a=2, n=3, a=4.' },
            { title: 'Index 5–10 = "Talent"', body: 'T=5, a=6, l=7, e=8, n=9, t=10.' },
            {
              title: 's[5:11] → indices 5 through 10',
              body: 'End index is exclusive, so 5 to 10 inclusive.',
            },
          ],
          keyInsight:
            'Python slicing is [start:stop) — stop is exclusive. s[5:11] captures exactly "Talent".',
        },
      },
      {
        id: 'py-4',
        topic: 'Type Conversion',
        question: 'What does this code',
        questionEmphasis: 'print?',
        subtitle: 'Read the snippet carefully. Select the exact output when this code runs.',
        code: [
          { text: 'x', color: 'variable' },
          { text: ' = ', color: 'value' },
          { text: 'int', color: 'function' },
          { text: '(', color: 'value' },
          { text: '3.9', color: 'number' },
          { text: ') + ', color: 'value' },
          { text: 'int', color: 'function' },
          { text: '("', color: 'value' },
          { text: '2', color: 'number' },
          { text: '") ', color: 'value' },
          { text: 'print', color: 'function' },
          { text: '(x)', color: 'value' },
        ],
        options: ['5.9', '5', '6', 'Error'],
        correctIndex: 1,
        hint: {
          heading: 'Two conversions happening.',
          steps: [
            { title: 'int(3.9) truncates', body: 'Floats are truncated, not rounded. Result: 3.' },
            { title: 'int("2") parses', body: 'String "2" becomes integer 2.' },
            { title: '3 + 2 = 5', body: 'Simple integer addition.' },
          ],
          keyInsight:
            'int() truncates floats (drops decimal) and parses numeric strings. 3 + 2 = 5, not 5.9 or 6.',
        },
      },
      {
        id: 'py-5',
        topic: 'Set Operations',
        question: 'What does this code',
        questionEmphasis: 'print?',
        subtitle: 'Read the snippet carefully. Select the exact output when this code runs.',
        code: [
          { text: 'data', color: 'variable' },
          { text: ' = [3, 1, 4, 1, 5, 9, 2, 6] ', color: 'value' },
          { text: 'result', color: 'variable' },
          { text: ' = ', color: 'value' },
          { text: 'sorted', color: 'function' },
          { text: '(', color: 'value' },
          { text: 'set', color: 'function' },
          { text: '(data))[:', color: 'value' },
          { text: '3', color: 'number' },
          { text: '] ', color: 'value' },
          { text: 'print', color: 'function' },
          { text: '(result) ', color: 'value' },
          { text: '# ← what prints?', color: 'comment' },
        ],
        options: ['[3, 1, 4]', '[1, 2, 3]', '[1, 1, 2]', '[3, 1, 4, 1]'],
        correctIndex: 1,
        hint: {
          heading: 'Break it into three steps.',
          steps: [
            {
              title: 'set(data) — removes duplicates',
              body: 'Result: {1, 2, 3, 4, 5, 6, 9} — the duplicate 1 disappears.',
            },
            {
              title: 'sorted(...) — orders ascending',
              body: 'The set {1, 2, 3, 4, 5, 6, 9} gets sorted smallest to largest.',
            },
            {
              title: '[:3] — take the first 3 elements',
              body: 'From [1, 2, 3, 4, 5, 6, 9], slice [:3] gives you the first three.',
            },
          ],
          keyInsight:
            'Option A ([3, 1, 4]) is the original order — wrong. Option C ([1, 1, 2]) keeps the duplicate — wrong. Option D is too long. Only B reflects all three operations.',
        },
      },
      {
        id: 'py-6',
        topic: 'Boolean Logic',
        question: 'What does this code',
        questionEmphasis: 'print?',
        subtitle: 'Read the snippet carefully. Select the exact output when this code runs.',
        code: [
          { text: 'print', color: 'function' },
          { text: '(', color: 'value' },
          { text: 'bool', color: 'function' },
          { text: '(0), ', color: 'value' },
          { text: 'bool', color: 'function' },
          { text: '(""), ', color: 'value' },
          { text: 'bool', color: 'function' },
          { text: '([]), ', color: 'value' },
          { text: 'bool', color: 'function' },
          { text: '("0"))', color: 'value' },
        ],
        options: [
          'False False False False',
          'False False False True',
          'True True True True',
          'False True False True',
        ],
        correctIndex: 1,
        hint: {
          heading: 'Falsy vs truthy in Python.',
          steps: [
            {
              title: '0, "", [] are falsy',
              body: 'Zero, empty string, and empty list are all False.',
            },
            {
              title: '"0" is truthy',
              body: 'A non-empty string — even "0" — is True. Only "" is falsy.',
            },
          ],
          keyInsight: 'The string "0" is not the integer 0. It has length 1, so bool("0") is True.',
        },
      },
      {
        id: 'py-7',
        topic: 'Lambda Functions',
        question: 'What does this code',
        questionEmphasis: 'print?',
        subtitle: 'Read the snippet carefully. Select the exact output when this code runs.',
        code: [
          { text: 'f', color: 'variable' },
          { text: ' = ', color: 'value' },
          { text: 'lambda', color: 'function' },
          { text: ' x, y: x * y + ', color: 'value' },
          { text: '1', color: 'number' },
          { text: ' ', color: 'value' },
          { text: 'print', color: 'function' },
          { text: '(f(', color: 'value' },
          { text: '3', color: 'number' },
          { text: ', ', color: 'value' },
          { text: '4', color: 'number' },
          { text: '))', color: 'value' },
        ],
        options: ['7', '12', '13', '34'],
        correctIndex: 2,
        hint: {
          heading: 'Substitute and compute.',
          steps: [
            { title: 'f(3, 4) → 3 * 4 + 1', body: 'Replace x with 3 and y with 4.' },
            { title: '3 * 4 = 12, then + 1 = 13', body: 'Multiplication before addition.' },
          ],
          keyInsight: 'Operator precedence: * before +. So 3*4+1 = 13, not 3*(4+1) = 15.',
        },
      },
      {
        id: 'py-8',
        topic: 'Exception Handling',
        question: 'What does this code',
        questionEmphasis: 'print?',
        subtitle: 'Read the snippet carefully. Select the exact output when this code runs.',
        code: [
          { text: 'try', color: 'function' },
          { text: ': ', color: 'value' },
          { text: 'x', color: 'variable' },
          { text: ' = ', color: 'value' },
          { text: '1', color: 'number' },
          { text: ' / ', color: 'value' },
          { text: '0', color: 'number' },
          { text: ' ⏎ ', color: 'value' },
          { text: 'except', color: 'function' },
          { text: ': x = ', color: 'value' },
          { text: '0', color: 'number' },
          { text: ' ⏎ ', color: 'value' },
          { text: 'finally', color: 'function' },
          { text: ': x += ', color: 'value' },
          { text: '1', color: 'number' },
          { text: ' ⏎ ', color: 'value' },
          { text: 'print', color: 'function' },
          { text: '(x)', color: 'value' },
        ],
        options: ['0', '1', 'Error', '2'],
        correctIndex: 1,
        hint: {
          heading: 'Follow the flow.',
          steps: [
            { title: 'try: 1/0 raises ZeroDivisionError', body: 'Division by zero always throws.' },
            { title: 'except: x = 0', body: 'The error is caught, x becomes 0.' },
            { title: 'finally: x += 1', body: 'Finally always runs. 0 + 1 = 1.' },
          ],
          keyInsight:
            'The finally block always executes, whether an exception occurred or not. x goes 1/0 → error → 0 → 0+1 = 1.',
        },
      },
    ],
  },

  'data-analysis': {
    skill: 'Data Analysis',
    engagementType: 'visual-mcq',
    icon: '📊',
    IconComponent: SkillIconDataAnalysis,
    iconBg: 'bg-[#e8f5e9]',
    title: 'Skills Lab : Data Analysis',
    subtitle: '5 challenges · Pass 4+ to earn the ✓ badge · Retakeable',
    passThreshold: 4,
    initialLives: 5,
    challenges: [
      {
        id: 'da-1',
        topic: 'Anomaly Detection',
        question: 'One week is',
        questionEmphasis: 'anomalous.',
        subtitle:
          'A retailer tracks weekly sales. Identify which week breaks the trend and select the most likely cause: signal vs noise.',
        visual: {
          type: 'bar-chart',
          title: 'Weekly Revenue',
          subtitle: 'GHS (thousands) · Jan 6 – Feb 24, 2025 · 8 weeks',
          badges: ['Pattern Recognition', '⚠ 1 anomaly'],
          xAxis: [
            'Wk 1\nJan 6',
            'Wk 2\nJan 13',
            'Wk 3\nJan 20',
            'Wk 4\nJan 27',
            'Wk 5\nFeb 3',
            'Wk 6\nFeb 10',
            'Wk 7\nFeb 17',
            'Wk 8\nFeb 24',
          ],
          values: [48, 52, 50, 54, 76, 53, 56, 51],
          mean: 55,
          anomalyIndices: [4],
          anomalyLabel: '⚠ ANOMALY DETECTED\n+2.5σ above mean\n76k vs avg 55k',
          legend: [
            { color: '#387440', label: 'Normal week' },
            { color: '#c0392b', label: 'Anomalous week' },
          ],
          statsLine: 'Median: 53k · σ = 8.4k · Wk 5 = +2.5σ',
        },
        contextBar: null,
        options: [
          'A public holiday increased foot traffic: a real demand signal worth updating the forecast.',
          'A one-time bulk corporate purchase inflated the total. Not a trend shift: exclude from forecasting.',
          'A data entry error duplicated Tuesday figures: a data quality issue, not real sales.',
          'A competitor closed permanently, driving customers here: a structural baseline shift.',
        ],
        correctIndex: 1,
        hint: {
          heading: 'Big spike ≠ trend change.',
          description:
            'The key question isn\'t "is it anomalous?" — it clearly is. The question is what kind of anomaly it is.',
          steps: [
            {
              title: 'Ask: does the baseline continue after?',
              body: "Weeks 6, 7, 8 return to the normal ~50–55k range. If this were a structural shift (new customers, competitor closed), weeks after would also be elevated. They're not.",
            },
            {
              title: 'Structural shift (Option D)',
              body: "Weeks 6, 7, 8 return to the normal ~50–55k range. If this were a structural shift (new customers, competitor closed), weeks after would also be elevated. They're not.",
            },
            {
              title: 'Holiday effect (Option A)',
              body: 'Public holidays cause broad category lift — multiple weeks elevated, not a single isolated spike. Also usually predictable from the calendar.',
            },
            {
              title: 'One-time event (Option B) — the answer',
              body: "A bulk corporate purchase is one transaction. It inflates that week's total but doesn't change the underlying demand. Exclude from forecasting. This is noise, not signal.",
            },
          ],
          keyInsight: 'Mean: 55k · Std dev: 8.4k · Wk 5 = +2.5σ above mean',
        },
      },
      {
        id: 'da-2',
        topic: 'Anomaly Detection',
        question: 'One month',
        questionEmphasis: 'collapsed.',
        subtitle:
          'A product line shows steady growth, except May, which dropped to 22k from an average of 66k. What caused this sudden trough?',
        visual: {
          type: 'line-chart',
          title: 'Monthly Product Revenue',
          subtitle: 'GHS (thousands) · Jan – Sep 2025 · 9 months',
          badges: ['Pattern Recognition', '⚠ 1 anomaly'],
          xAxis: [
            'Q1 Wk1\nJan',
            'Q1 Wk2\nFeb',
            'Q1 Wk3\nMar',
            'Q2 Wk1\nApr',
            'Q2 Wk2\nMay',
            'Q2 Wk3\nJun',
            'Q3 Wk1\nJul',
            'Q3 Wk2\nAug',
            'Q3 Wk3\nSep',
          ],
          values: [62, 65, 61, 68, 22, 68, 70, 73, 69],
          mean: 66,
          anomalyIndices: [4],
          anomalyLabel: 'May ↓ −44k vs avg · −2.8σ',
          legend: [
            { color: '#387440', label: 'Normal month' },
            { color: '#c0392b', label: 'Anomalous month' },
          ],
          statsLine: 'May ↓ −44k vs avg · −2.8σ',
        },
        contextBar: null,
        options: [
          'A major shift in customer preferences: this product category is declining permanently.',
          'Supply chain disruption caused a stock-out for 3 weeks. Revenue collapsed because shelves were empty, not demand.',
          'A pricing error undercharged all May orders. Revenue looks low but volume was actually at record highs.',
          'The sales team changed CRM systems in May and failed to log all transactions — a data capture issue.',
        ],
        correctIndex: 1,
        hint: {
          heading: 'One month collapsed.',
          description:
            'The trough is isolated — June bounces right back. That rules out permanent decline.',
          steps: [
            {
              title: 'Recovery is immediate',
              body: 'June returns to 68k. If demand truly shifted, recovery would be gradual or absent.',
            },
            {
              title: 'Supply-side, not demand-side',
              body: "A stock-out perfectly explains a sharp drop followed by instant recovery. The demand was there; the product wasn't.",
            },
          ],
          keyInsight:
            'When a dip is sharp and recovery is instant, look at supply constraints before blaming demand.',
        },
      },
      {
        id: 'da-3',
        topic: 'Anomaly Detection',
        question: 'One store defies the',
        questionEmphasis: 'trend.',
        subtitle:
          'Nine stores show a clear relationship between ad spend and revenue. One store spent 40k but earned only 17k — far below the trend line. What is the most likely explanation?',
        visual: {
          type: 'scatter-plot',
          title: 'Ad Spend vs Revenue by Store',
          subtitle: 'GHS (thousands) · Q2 2025 · 10 stores · scatter plot',
          badges: ['Pattern Recognition', '⚠ 1 anomaly'],
          xAxisLabel: 'Ad Spend (GHS thousands)',
          yAxisLabel: 'Revenue (GHS thousands)',
          points: [
            { x: 20, y: 32, label: 'Store A' },
            { x: 30, y: 45, label: 'Store B' },
            { x: 40, y: 58, label: 'Store C' },
            { x: 50, y: 65, label: 'Store D' },
            { x: 55, y: 68, label: 'Store E' },
            { x: 60, y: 72, label: 'Store F' },
            { x: 80, y: 85, label: 'Store H' },
            { x: 90, y: 92, label: 'Store I' },
            { x: 100, y: 95, label: 'Store J' },
          ],
          outlier: { x: 40, y: 17, label: 'Store G' },
          trendLine: true,
          legend: [
            { color: '#387440', label: 'Normal store' },
            { color: '#c0392b', label: 'Outlier store' },
          ],
          statsLine: 'r²',
        },
        contextBar: null,
        options: [
          'Store G operates in a lower-income catchment area — their demographic simply responds less to advertising.',
          'Store G ran ads in the wrong channel — their spend was real but ads reached audiences outside their catchment area.',
          "Store G's 40k was misclassified — it includes regional overhead costs, not just advertising spend. A data labelling error.",
          'Store G had 3 weeks of staff shortages during the campaign — they could not convert footfall driven by ads into sales.',
        ],
        correctIndex: 1,
        hint: {
          heading: 'One store defies the trend.',
          description:
            'Store G spent 40k but earned only 17k. Every other store at 40k earns ~58k. The money was spent — but where?',
          steps: [
            {
              title: 'The spend is real',
              body: "Store G's 40k isn't a data error — it's verified spend. The issue is what the spend achieved.",
            },
            {
              title: 'Wrong channel = wasted reach',
              body: "If ads reached audiences outside Store G's delivery area, the spend generates awareness but not revenue.",
            },
          ],
          keyInsight:
            'When spend is real but returns are near-zero, the issue is targeting — not budget size.',
        },
      },
      {
        id: 'da-4',
        topic: 'Anomaly Detection',
        question: 'Two months spike.',
        questionEmphasis: 'Different reasons.',
        subtitle:
          'This retailer shows two anomalous months in the year — July and December. They look similar on the chart, but have completely different causes. Which statement correctly distinguishes them?',
        visual: {
          type: 'bar-chart',
          title: 'Weekly Revenue',
          subtitle: 'GHS (thousands) · Jan 6 – Feb 24, 2025 · 8 weeks',
          badges: ['Pattern Recognition', '⚠ 2 anomalies'],
          xAxis: [
            'Jan\nweek 1',
            'Feb\nweek 2',
            'Mar\nweek 3',
            'Apr\nweek 4',
            'May\nweek 5',
            'Jun\nweek 6',
            'Jul\nweek 7',
            'Aug\nweek 8',
            'Sep\nweek 9',
            'Oct\nweek 10',
            'Nov\nweek 11',
            'Dec\nweek 12',
          ],
          values: [55, 58, 57, 60, 62, 61, 95, 63, 64, 60, 63, 76],
          mean: 55,
          anomalyIndices: [6, 11],
          anomalyLabel: '⚠ 2 ANOMALY DETECTED',
          legend: [
            { color: '#387440', label: 'Normal week' },
            { color: '#c0392b', label: 'Anomalous week' },
          ],
          statsLine: 'Jul +34k · Dec +27k vs mean',
        },
        contextBar: null,
        options: [
          'Both July and December are seasonal — they should both be excluded from the baseline model as predictable annual events.',
          'July is seasonal (school holidays drive predictable annual demand). December is structural — a competitor closure permanently expanded the customer base. July gets excluded; December updates the baseline.',
          'Both are structural changes: both indicate the business has genuinely grown and forecasts should be updated upwards permanently.',
          'July is a data entry error (two months merged). December is seasonal (Christmas shopping). July gets investigated; December gets excluded.',
        ],
        correctIndex: 1,
        hint: {
          heading: 'Same chart. Different signals.',
          description:
            "Both months spike — but the pattern after each spike tells you whether it's seasonal or structural.",
          steps: [
            {
              title: 'After July: baseline returns',
              body: 'August drops back to 63k. The spike was temporary — school holidays drove demand, then it passed.',
            },
            {
              title: 'After December: baseline elevated',
              body: 'If January stays elevated (vs prior January), the December spike reflects a permanent change. A competitor closed.',
            },
          ],
          keyInsight:
            'Seasonal anomalies repeat annually and revert. Structural anomalies shift the baseline permanently. Treatment is different.',
        },
      },
      {
        id: 'da-5',
        topic: 'Anomaly Detection',
        question: 'The average',
        questionEmphasis: 'lies.',
        subtitle:
          'Two datasets both have a mean of 50. But they tell very different stories. Which description correctly distinguishes them?',
        visual: {
          type: 'bar-chart',
          title: 'Weekly Revenue',
          subtitle: 'GHS (thousands) · Comparison',
          badges: ['Pattern Recognition'],
          xAxis: ['A', 'B', 'C', 'D', 'E'],
          values: [50, 50, 50, 50, 50],
          mean: 50,
          anomalyIndices: [],
          legend: [],
          statsLine: 'Both datasets: mean = 50',
        },
        contextBar: null,
        options: [
          'Both datasets are identical — same mean means same distribution.',
          'Dataset A is tightly clustered (low variance). Dataset B is widely spread (high variance). Same center, different risk profiles.',
          "Dataset A has outliers. Dataset B doesn't. The means are coincidentally equal.",
          'Neither dataset is useful without knowing the median.',
        ],
        correctIndex: 1,
        hint: {
          heading: 'Mean hides spread.',
          description:
            'Two datasets can share an average but have completely different distributions.',
          steps: [
            {
              title: 'Mean = center point',
              body: 'The mean tells you where the center is, not how data is distributed around it.',
            },
            {
              title: 'Variance = spread',
              body: 'Low variance = predictable. High variance = risky. Both have mean 50, but the story is different.',
            },
          ],
          keyInsight: 'Always report mean AND standard deviation. Mean alone is misleading.',
        },
      },
    ],
  },

  'creative-design': {
    skill: 'Creative Design',
    engagementType: 'visual-mcq',
    icon: '🎨',
    IconComponent: SkillIconCreativeDesign,
    iconBg: 'bg-[#fff3e0]',
    title: 'Skills Lab : Creative Design',
    subtitle: '5 challenges · Pass 4+ to earn the ✓ badge · Retakeable',
    passThreshold: 4,
    initialLives: 5,
    challenges: [
      {
        id: 'cd-1',
        topic: 'Palette Completion',
        question: 'Complete the',
        questionEmphasis: 'palette.',
        subtitle:
          '4 colours are fixed. Pick the accent that best completes this Ghanaian fintech brand palette. Click a colour to preview it in the slot.',
        visual: {
          type: 'color-palette',
          fixedColors: [
            { hex: '#002147', label: 'Navy' },
            { hex: '#12170B', label: null },
            { hex: '#f1f1f1', label: '#f1f1' },
            { hex: '#d1d1d1', label: '#f3f3' },
          ],
          emptySlotIndex: 2,
          accentSlotIndex: 4,
        },
        contextBar:
          'Brief: Trustworthy + modern fintech for young Ghanaians. Anchor = deep navy. The accent should signal credibility, innovation, and accessibility.',
        options: [
          { hex: '#E8530E', label: 'Burnt orange' },
          { hex: '#00A86B', label: 'Emerald' },
          { hex: '#E8960E', label: 'Amber' },
          { hex: '#7B68EE', label: 'Violet' },
          { hex: '#C0392B', label: 'Red' },
          { hex: '#00CED1', label: 'Cyan' },
        ],
        correctIndex: 2,
        hint: {
          heading: 'Warm accent on cool anchor.',
          description:
            'Navy is a cool, credible, formal colour. The brief needs "credibility AND accessibility." Which temperature of accent bridges that gap?',
          steps: [
            {
              title: 'Burnt orange — energetic but aggressive',
              body: 'Warm + high-saturation. Reads as "urgent" in fintech — associated with alerts. Not trust-building on first impression.',
            },
            {
              title: 'Emerald green — money/success but monotone',
              body: 'Signals wealth and go/success. But paired with navy, the two cool tones make the palette feel cold and corporate — missing "accessible."',
            },
            {
              title: 'Amber ✓ — warm trust against cool navy',
              body: 'Warm but not aggressive. Creates credible-yet-approachable contrast. In Ghana, amber/gold connects to Kente heritage and cultural associations with value, reliability, and prosperity.',
            },
            {
              title: 'Violet — premium but cold',
              body: 'Reads as innovative but also distant. Works for luxury/tech brands. For a fintech targeting broad accessibility, can feel exclusive rather than welcoming.',
            },
          ],
          keyInsight:
            'The rule: Navy + warm accent = trust + energy + approachability. That\'s exactly what "credibility AND accessibility" needs.',
        },
      },
      {
        id: 'cd-2',
        topic: 'Colour Temperature',
        question: 'Match the',
        questionEmphasis: 'mood.',
        subtitle:
          'A health & wellness app targets women 25–40. The palette should feel calm, nurturing, and premium. Pick the accent for a sage green base.',
        visual: {
          type: 'color-palette',
          fixedColors: [
            { hex: '#8FBC8F', label: 'Sage' },
            { hex: '#F5F5DC', label: 'Cream' },
            { hex: '#f1f1f1', label: null },
            { hex: '#2F4F4F', label: 'Dark slate' },
          ],
          emptySlotIndex: 2,
          accentSlotIndex: 4,
        },
        contextBar:
          'Brief: Calm, nurturing, premium. Base = sage green. Accent should elevate without energizing.',
        options: [
          { hex: '#FF6347', label: 'Tomato' },
          { hex: '#DEB887', label: 'Warm sand' },
          { hex: '#D4A574', label: 'Dusty rose' },
          { hex: '#FFD700', label: 'Gold' },
          { hex: '#4169E1', label: 'Royal blue' },
          { hex: '#E6E6FA', label: 'Lavender' },
        ],
        correctIndex: 2,
        hint: {
          heading: 'Calm needs muted warmth.',
          description:
            'The brief says calm + premium. High-saturation accents energize — the opposite of what you want.',
          steps: [
            {
              title: 'Dusty rose = soft warmth',
              body: 'Low saturation, warm undertone. Feels nurturing without being loud.',
            },
            {
              title: 'Gold and tomato are too energetic',
              body: 'High saturation breaks the calm. These belong in active/exciting brand contexts.',
            },
          ],
          keyInsight:
            'For calm palettes, keep saturation low and temperature warm. Dusty/muted tones read as premium.',
        },
      },
      {
        id: 'cd-3',
        topic: 'Contrast & Accessibility',
        question: 'Spot the',
        questionEmphasis: 'failure.',
        subtitle:
          'Two buttons use the same background. One passes WCAG AA contrast; the other fails. Which button has the accessibility issue?',
        visual: {
          type: 'color-palette',
          fixedColors: [
            { hex: '#387440', label: 'Button A bg' },
            { hex: '#FFFFFF', label: 'Button A text' },
            { hex: '#8EF264', label: 'Button B bg' },
            { hex: '#84CC16', label: 'Button B text' },
          ],
          emptySlotIndex: null,
          accentSlotIndex: null,
        },
        contextBar:
          'WCAG AA requires 4.5:1 contrast ratio for normal text. Check which button fails.',
        options: [
          { hex: '#387440', label: 'Button A fails' },
          { hex: '#8EF264', label: 'Button B fails' },
          { hex: '#FFFFFF', label: 'Both fail' },
          { hex: '#000000', label: 'Both pass' },
        ],
        correctIndex: 1,
        hint: {
          heading: 'Green on green is risky.',
          description: 'Button B uses #84CC16 text on #8EF264 background — both are light greens.',
          steps: [
            {
              title: 'Button A: white on dark green',
              body: '#FFFFFF on #387440 = ~5.2:1 contrast ratio. Passes AA.',
            },
            {
              title: 'Button B: light green on light green',
              body: '#84CC16 on #8EF264 = ~1.4:1 contrast ratio. Fails badly.',
            },
          ],
          keyInsight:
            'Same-hue pairings with similar lightness always fail contrast. Use a contrast checker before shipping.',
        },
      },
      {
        id: 'cd-4',
        topic: 'Typography Hierarchy',
        question: 'Fix the',
        questionEmphasis: 'hierarchy.',
        subtitle:
          'A landing page has three text levels that all look the same weight. Pick the correction that establishes proper visual hierarchy.',
        visual: {
          type: 'color-palette',
          fixedColors: [
            { hex: '#333333', label: 'Heading' },
            { hex: '#555555', label: 'Subhead' },
            { hex: '#777777', label: 'Body' },
            { hex: '#BBBBBB', label: 'Caption' },
          ],
          emptySlotIndex: null,
          accentSlotIndex: null,
        },
        contextBar:
          'Visual hierarchy: size → weight → colour, in that order. Each level should be clearly distinct.',
        options: [
          { hex: '#333333', label: 'Make all bold' },
          { hex: '#555555', label: 'Add more sizes' },
          { hex: '#111111', label: 'Size + weight + color' },
          { hex: '#777777', label: 'Use all caps' },
        ],
        correctIndex: 2,
        hint: {
          heading: 'Three levers, not one.',
          description: 'Hierarchy needs size, weight, AND colour contrast working together.',
          steps: [
            {
              title: "Size alone isn't enough",
              body: 'Without weight and colour differences, large and small text blur together.',
            },
            {
              title: 'All three levers create clear levels',
              body: 'Heading: large + bold + dark. Subhead: medium + semi-bold + gray. Body: small + regular + lighter.',
            },
          ],
          keyInsight:
            'Effective hierarchy uses at least 2 of the 3 levers (size, weight, colour) at each level.',
        },
      },
      {
        id: 'cd-5',
        topic: 'Brand Consistency',
        question: 'Which logo',
        questionEmphasis: 'works?',
        subtitle:
          'A brand uses dark green as primary. The logo must work on both white and dark backgrounds. Which version is correctly adapted?',
        visual: {
          type: 'color-palette',
          fixedColors: [
            { hex: '#387440', label: 'Primary green' },
            { hex: '#FFFFFF', label: 'Light bg' },
            { hex: '#1a1a1a', label: 'Dark bg' },
            { hex: '#E8F2ED', label: 'Tint' },
          ],
          emptySlotIndex: null,
          accentSlotIndex: null,
        },
        contextBar:
          'Logo must be legible on both light and dark backgrounds without changing the brand colour.',
        options: [
          { hex: '#387440', label: 'Same on both' },
          { hex: '#FFFFFF', label: 'White on dark' },
          { hex: '#E8F2ED', label: 'Tint on dark' },
          { hex: '#000000', label: 'Black on light' },
        ],
        correctIndex: 2,
        hint: {
          heading: "Adapt, don't change.",
          description:
            'The brand green works on white but disappears on dark. You need a lighter version — a tint.',
          steps: [
            {
              title: 'Same green on dark = invisible',
              body: '#387440 on #1a1a1a has poor contrast. The logo disappears.',
            },
            {
              title: 'Brand tint preserves identity',
              body: '#E8F2ED is a lighter tint of the brand green. Readable on dark, still recognizably on-brand.',
            },
          ],
          keyInsight:
            'Use tints (lighter versions) of brand colours for dark mode. Never switch to an unrelated colour.',
        },
      },
    ],
  },

  'project-management': {
    skill: 'Project Management',
    engagementType: 'visual-mcq',
    icon: '📋',
    IconComponent: SkillIconProjectMgmt,
    iconBg: 'bg-[#e3f2fd]',
    title: 'Skills Lab : Project Management',
    subtitle: '6 challenges · Pass 4+ to earn the ✓ badge · Retakeable',
    passThreshold: 4,
    initialLives: 5,
    challenges: [
      {
        id: 'pm-1',
        topic: 'Task Scheduling',
        question: 'Schedule the',
        questionEmphasis: 'QA test.',
        subtitle:
          '4 colours are fixed. Pick the accent that best completes this Ghanaian fintech brand palette. Click a colour to preview it in the slot.',
        visual: {
          type: 'gantt-chart',
          days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
          tasks: [
            { name: 'User Research', start: 0, duration: 2, label: 'Days 1–2', color: '#387440' },
            { name: 'Design', start: 0, duration: 2, label: 'Days 1–2', color: '#c0392b' },
            { name: 'Development', start: 2, duration: 2, label: 'Days 3–4', color: '#c8951a' },
            {
              name: 'QA Testing',
              start: null,
              duration: 1,
              label: 'Where?',
              color: '#e8e8e4',
              placeholder: true,
            },
          ],
        },
        contextBar: 'Constraint: Development finishes end of Day 4 → QA can only start Day 5.',
        options: [
          'Day 2 — QA can run in parallel with Design to save time.',
          'Day 5 — QA starts immediately after Development ends on Day 4.',
          'Day 3 — QA can begin while Development is still running.',
          'Day 1 — QA is independent and can start any time.',
        ],
        correctIndex: 1,
        hint: {
          heading: 'Follow the dependency chain.',
          description:
            'The critical path is fixed: Design → Dev → QA → Deploy. QA and Deployment can only go where the chain allows.',
          steps: [
            {
              title: 'The critical path',
              body: "Design (D1–2) → Dev (D3–4) → QA (D5) → Deploy (D5). This chain is fixed. Each step must wait for the previous one to finish. That's 4 days minimum.",
            },
            {
              title: 'Parallel tasks (free to move)',
              body: 'User Research and Copywriting have no dependencies on the critical path. They can run any time during the sprint without affecting the deadline.',
            },
            {
              title: 'QA goes on Day 5 — Deploy end of Day 5',
              body: 'Dev finishes Thursday. QA can only start Friday (Day 5). Deploy happens at the end of Friday, after QA signs off. Both land on Day 5.',
            },
          ],
          keyInsight: "QA can't start until Dev is done. Dev finishes Day 4. QA goes on Day 5.",
        },
      },
      {
        id: 'pm-2',
        topic: 'Task Scheduling',
        question: 'Schedule the',
        questionEmphasis: 'full sprint.',
        subtitle:
          'A 5-day sprint with 6 tasks and dependencies. Place the unplaced tasks correctly.',
        visual: {
          type: 'gantt-chart',
          days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
          tasks: [
            { name: 'User Research', start: 0, duration: 2, label: 'Days 1–2', color: '#387440' },
            { name: 'Design', start: 0, duration: 2, label: 'Days 1–2', color: '#c0392b' },
            { name: 'Copywriting', start: 1, duration: 2, label: 'Days 2–3', color: '#c8951a' },
            { name: 'Development', start: 2, duration: 2, label: 'Days 3–4', color: '#c8951a' },
            {
              name: 'QA Testing',
              start: null,
              duration: 1,
              label: 'Day 5?',
              color: '#e8e8e4',
              placeholder: true,
            },
            {
              name: 'Deployment',
              start: null,
              duration: 1,
              label: 'After QA',
              color: '#e8e8e4',
              placeholder: true,
            },
          ],
          unplacedTasks: [
            { name: 'Deployment', constraint: 'After QA' },
            { name: 'QA Testing', constraint: 'Day 5' },
          ],
        },
        contextBar: 'Constraint: Development finishes end of Day 4 → QA can only start Day 5.',
        options: [
          'Day 4 afternoon — Deployment can overlap with QA if the team is confident.',
          'End of Day 5 — QA completes Day 5, Deployment ships same day in the final hours.',
          'Day 6 — A buffer day is always needed between QA and Deployment to handle any last-minute fixes.',
          'Day 3 — If Development is finished and QA is in progress, Deployment can be prepared in parallel.',
        ],
        correctIndex: 1,
        hint: {
          heading: 'Follow the chain.',
          description:
            'Dev ends Day 4 → QA Day 5 → Deploy end of Day 5. No gaps needed if QA passes.',
          steps: [
            {
              title: 'QA on Day 5',
              body: 'Development finishes Thursday. QA starts and completes Friday.',
            },
            {
              title: 'Deploy same day',
              body: 'If QA passes, deployment happens end-of-day Friday. No buffer day needed.',
            },
          ],
          keyInsight:
            'In agile sprints, QA and deploy can happen same day if the pipeline is automated.',
        },
      },
      {
        id: 'pm-3',
        topic: 'Task Scheduling',
        question: 'Spot the',
        questionEmphasis: 'conflict.',
        subtitle:
          'Two developers, two tracks. One resource is double-booked. Which task must move?',
        visual: {
          type: 'gantt-chart',
          days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
          tasks: [
            { name: 'User Research', start: 0, duration: 3, label: 'Days 1–2', color: '#387440' },
            { name: 'Design', start: 0, duration: 2, label: 'Days 1–2', color: '#c0392b' },
            { name: 'Development', start: 2, duration: 2, label: 'Days 3–4', color: '#c8951a' },
            {
              name: 'QA Testing',
              start: null,
              duration: 1,
              label: 'When?',
              color: '#e8e8e4',
              placeholder: true,
            },
            {
              name: 'QA Testing',
              start: null,
              duration: 1,
              label: 'When?',
              color: '#e8e8e4',
              placeholder: true,
            },
            {
              name: 'QA Testing',
              start: 2,
              duration: 2,
              label: 'Days 3–4 ⚠',
              color: '#c0392b',
              conflict: true,
            },
          ],
          conflictMessage:
            '⚠ Conflict detected: Dev A is scheduled on Development Days 3–4 AND Documentation Days 3–4 simultaneously.',
        },
        contextBar:
          'Team: Dev A handles Research + Design + Dev. Dev B handles Copywriting + Dev. Both are on Development Days 3–4. Documentation is assigned to Dev A but overlaps.',
        options: [
          'Move Development to Days 5–6 to free Dev A for Documentation on Days 3–4.',
          'Move Documentation to Day 5, after Development ends. It has no dependencies that block from moving.',
          'Assign Documentation to Dev B, who is free after Copywriting ends Day 3.',
          "Split Dev A's Development task across two days and run Documentation in the gaps.",
        ],
        correctIndex: 1,
        hint: {
          heading: 'Resolve by moving the flexible task.',
          description:
            "Development is on the critical path — it can't move. Documentation is not. Move the flexible one.",
          steps: [
            {
              title: 'Development is critical-path',
              body: 'Dev → QA → Deploy. Moving Development delays everything.',
            },
            {
              title: 'Documentation has no dependents',
              body: 'Nothing downstream waits for Documentation. It can slide to Day 5 without impact.',
            },
          ],
          keyInsight: 'When resolving conflicts, move the task that is NOT on the critical path.',
        },
      },
      {
        id: 'pm-4',
        topic: 'Task Scheduling',
        question: 'Find the',
        questionEmphasis: 'critical path.',
        subtitle:
          'A 5-task project. Tasks have fixed durations and dependencies. The critical path is the sequence that determines the minimum project duration. Which is it?',
        visual: {
          type: 'network-diagram',
          nodes: [
            { id: 'A', label: 'A (2d)', x: 80, y: 280 },
            { id: 'B', label: 'B (3d)', x: 280, y: 140 },
            { id: 'C', label: 'C (2d)', x: 280, y: 420 },
            { id: 'D', label: 'D (1d)', x: 480, y: 280 },
            { id: 'E', label: 'E (2d)', x: 680, y: 280 },
          ],
          edges: [
            { from: 'A', to: 'B', label: 'A→B' },
            { from: 'A', to: 'C', label: 'A→C' },
            { from: 'B', to: 'D' },
            { from: 'C', to: 'D' },
            { from: 'D', to: 'E' },
          ],
        },
        contextBar:
          'Tasks: A(2d) → B(3d) → D(1d). Also: A(2d) → C(2d) → D(1d). D → E(2d). Which path takes longest?',
        options: [
          'A → C → D → E · 2+2+1+2 = 7 days — shortest path.',
          'A → B → D → E · 2+3+1+2 = 8 days — this is the critical path.',
          'A → B → E · B and E are not directly connected — D is a required gate task.',
          'All paths share E, so the critical path is whichever reaches D last — but both paths tie at 8 days.',
        ],
        correctIndex: 1,
        hint: {
          heading: 'Add up each path.',
          description:
            'The critical path is the LONGEST path through the network. It determines minimum project duration.',
          steps: [
            {
              title: 'Path 1: A→B→D→E',
              body: '2 + 3 + 1 + 2 = 8 days.',
            },
            {
              title: 'Path 2: A→C→D→E',
              body: '2 + 2 + 1 + 2 = 7 days.',
            },
            {
              title: 'Critical path = longest',
              body: 'Path 1 at 8 days is longer. Any delay on A, B, D, or E delays the whole project.',
            },
          ],
          keyInsight:
            'The critical path is the LONGEST sequence through the network — not the shortest. Delay any task on it and the project is late.',
        },
      },
      {
        id: 'pm-5',
        topic: 'Resource Allocation',
        question: 'Who is',
        questionEmphasis: 'overloaded?',
        subtitle:
          'Three team members, five tasks, one sprint. One person has more work than capacity. Who needs help?',
        visual: {
          type: 'gantt-chart',
          days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
          tasks: [
            {
              name: 'API Design (Alex)',
              start: 0,
              duration: 3,
              label: 'Days 1–3',
              color: '#387440',
            },
            { name: 'Frontend (Beth)', start: 0, duration: 2, label: 'Days 1–2', color: '#3062d4' },
            { name: 'Database (Alex)', start: 2, duration: 2, label: 'Days 3–4', color: '#387440' },
            { name: 'Testing (Chris)', start: 3, duration: 2, label: 'Days 4–5', color: '#c8951a' },
            { name: 'Docs (Beth)', start: 2, duration: 3, label: 'Days 3–5', color: '#3062d4' },
          ],
        },
        contextBar: 'Each person has 5 days capacity. Check total assigned days per person.',
        options: [
          'Alex: API (3d) + Database (2d) = 5 days. Exactly at capacity but manageable.',
          'Beth: Frontend (2d) + Docs (3d) = 5 days. Exactly at capacity but manageable.',
          "Chris: Testing (2d) = 2 days. Under-utilized — reassign some of Beth's work.",
          "Alex is overloaded: API (3d) overlaps Database (Days 3–4). He's double-booked on Days 3–4.",
        ],
        correctIndex: 3,
        hint: {
          heading: 'Check for overlaps, not just totals.',
          description:
            "Total capacity isn't the only constraint. Two tasks on the same days = conflict.",
          steps: [
            {
              title: 'Alex: Days 1–3 (API) + Days 3–4 (Database)',
              body: "Day 3 has both tasks. Alex can't do two things at once.",
            },
            {
              title: 'Solution: slide Database to Day 4',
              body: 'Or reassign the overlap day to Chris, who has spare capacity.',
            },
          ],
          keyInsight:
            'Resource conflicts are about schedule overlap, not just total hours. Always check the timeline view.',
        },
      },
      {
        id: 'pm-6',
        topic: 'Risk Assessment',
        question: 'Which risk',
        questionEmphasis: 'matters most?',
        subtitle:
          'Four risks identified. Each has a probability and impact score. Which one should the PM address first?',
        visual: {
          type: 'gantt-chart',
          days: ['Low', 'Med', 'High', 'Critical'],
          tasks: [
            {
              name: 'Server crash',
              start: 2,
              duration: 1,
              label: 'P:Low I:Critical',
              color: '#c0392b',
            },
            {
              name: 'Scope creep',
              start: 1,
              duration: 2,
              label: 'P:High I:High',
              color: '#c8951a',
            },
            { name: 'Dev leaves', start: 0, duration: 1, label: 'P:Low I:Med', color: '#387440' },
            { name: 'API delay', start: 2, duration: 1, label: 'P:Med I:High', color: '#c8951a' },
          ],
        },
        contextBar: 'Risk priority = Probability × Impact. Highest product gets addressed first.',
        options: [
          'Server crash — Critical impact demands immediate attention regardless of probability.',
          'Scope creep — High probability × High impact = highest risk score. Address first.',
          'API delay — Medium probability × High impact. Second priority after scope creep.',
          "Dev leaving — Low everything. Monitor but don't act.",
        ],
        correctIndex: 1,
        hint: {
          heading: "Multiply, don't cherry-pick.",
          description:
            'Risk management uses P × I to prioritize. A high-impact event with low probability scores lower than moderate-impact with high probability.',
          steps: [
            {
              title: 'Scope creep: High × High',
              body: "It's both likely AND damaging. Top priority.",
            },
            {
              title: 'Server crash: Low × Critical',
              body: 'Devastating if it happens, but unlikely. Mitigate with backups, not active management.',
            },
          ],
          keyInsight:
            'P × I beats gut feel. Scope creep is the silent killer of projects — address it first.',
        },
      },
    ],
  },

  'public-speaking': {
    skill: 'Public Speaking',
    engagementType: 'sentence-builder',
    icon: '🎤',
    IconComponent: SkillIconPublicSpeaking,
    iconBg: 'bg-[#fff8e1]',
    title: 'Skills Lab : Public Speaking',
    subtitle: '6 challenges · Pass 4+ to earn the ✓ badge · Retakeable',
    passThreshold: 4,
    initialLives: 5,
    challenges: [
      {
        id: 'ps-1',
        topic: 'Persuasive Opening Structure',
        question: 'Build the',
        questionEmphasis: 'perfect opening.',
        subtitle:
          'Arrange these words into the single most persuasive opening line for a senior leadership presentation. Click words to place, click placed words to return.',
        contextBar:
          "Context: You're presenting a new product roadmap. One sentence: credibility + problem + solution + outcome. What order?",
        correctOrder: [
          'After six months of research,',
          "we've identified",
          'the root cause',
          'and a clear solution',
          'that will save us',
          '40% of overhead costs',
        ],
        wordBank: [
          'After six months of research,',
          'that will save us',
          "we've identified",
          '40% of overhead costs',
          'the root cause',
          'and a clear solution',
          'starting next quarter',
        ],
        structureHint:
          'Persuasive structure: Credibility → Problem → Solution → Outcome (still missing ✦)',
        hint: {
          heading: 'Four parts. One order.',
          description:
            'Persuasive opening lines always follow the same 4-part structure. You have parts 1–6 — you just need to sequence them correctly and add the missing outcome.',
          steps: [
            {
              title: '1. Credibility signal',
              body: '"After six months of research..." establishes you\'ve done the work.',
            },
            {
              title: '2. Problem named',
              body: '"...we\'ve identified the root cause..." signals you understand the issue.',
            },
            {
              title: '3. Solution teased',
              body: '"...and a clear solution..." signals you have an answer, creates forward tension.',
            },
            {
              title: '4. Outcome quantified ✦ — this is missing',
              body: '"...that will save us 40% of overhead costs." gives leadership a concrete reason to listen.',
            },
          ],
          keyInsight:
            '"After six months of research, we\'ve identified the root cause and a clear solution that will save us 40% of overhead costs."',
        },
      },
      {
        id: 'ps-2',
        topic: 'Persuasive Opening Structure',
        question: 'Open with',
        questionEmphasis: 'authority.',
        subtitle:
          'Build the opening line for a quarterly board update. Credibility first, then the insight.',
        contextBar:
          "Context: Board meeting. You're reporting on customer churn. One sentence: data → finding → implication.",
        correctOrder: [
          'After analyzing',
          '12 months of churn data,',
          'we found that',
          'onboarding quality',
          'predicts retention',
          'more than price.',
        ],
        wordBank: [
          'we found that',
          'After analyzing',
          'more than price.',
          'predicts retention',
          '12 months of churn data,',
          'onboarding quality',
          'across all segments',
        ],
        structureHint: 'Data → Finding → Implication',
        hint: {
          heading: 'Data leads. Insight follows.',
          description:
            'Board members trust data-first framing. Lead with the evidence, then the conclusion.',
          steps: [
            {
              title: '1. Data credential',
              body: '"After analyzing 12 months of churn data" — establishes the evidence base.',
            },
            {
              title: '2. Finding',
              body: '"we found that onboarding quality predicts retention" — the core insight.',
            },
            {
              title: '3. Implication',
              body: '"more than price" — the surprise that makes it actionable.',
            },
          ],
          keyInsight:
            'Board audiences want evidence → insight → "so what." Never lead with the conclusion.',
        },
      },
      {
        id: 'ps-3',
        topic: 'Persuasive Opening Structure',
        question: 'Frame the',
        questionEmphasis: 'problem.',
        subtitle: 'Build a problem statement for a team standup. Simple, direct, no fluff.',
        contextBar:
          "Context: Daily standup. You're flagging a blocker. One sentence: what → why → impact.",
        correctOrder: [
          'The payment API',
          'is returning timeouts',
          "since yesterday's deploy,",
          'blocking all',
          'checkout flows.',
        ],
        wordBank: [
          'blocking all',
          'The payment API',
          "since yesterday's deploy,",
          'checkout flows.',
          'is returning timeouts',
          'across the platform',
        ],
        structureHint: 'What → Why → Impact',
        hint: {
          heading: 'What. Why. Impact.',
          description: 'Problem statements in standups need to be fast and actionable.',
          steps: [
            {
              title: "1. What's broken",
              body: '"The payment API is returning timeouts" — specific, not vague.',
            },
            {
              title: '2. Since when / why',
              body: '"since yesterday\'s deploy" — gives the team a starting point for debugging.',
            },
            {
              title: '3. Impact',
              body: '"blocking all checkout flows" — makes urgency clear.',
            },
          ],
          keyInsight:
            "In standups, say what's broken, when it broke, and what it affects. Under 15 seconds.",
        },
      },
      {
        id: 'ps-4',
        topic: 'Outcome-First Framing',
        question: 'Lead with the',
        questionEmphasis: 'result.',
        subtitle: 'Restructure this update to lead with the outcome, not the process.',
        contextBar: 'Context: Email to stakeholders. One sentence: result → how → next step.',
        correctOrder: [
          'We reduced page load time',
          'by 40%',
          'by migrating to edge caching,',
          'and expect',
          'a 15% conversion lift',
          'this quarter.',
        ],
        wordBank: [
          'by migrating to edge caching,',
          'a 15% conversion lift',
          'We reduced page load time',
          'this quarter.',
          'and expect',
          'by 40%',
          'after extensive testing',
        ],
        structureHint: 'Result → Method → Projection',
        hint: {
          heading: 'Outcome first. Process second.',
          description:
            'Stakeholders care about results. Lead with what changed, not how you did it.',
          steps: [
            {
              title: '1. Result',
              body: '"We reduced page load time by 40%" — immediate value.',
            },
            {
              title: '2. Method (briefly)',
              body: '"by migrating to edge caching" — how, in 5 words.',
            },
            {
              title: '3. Projection',
              body: '"expect a 15% conversion lift this quarter" — forward-looking impact.',
            },
          ],
          keyInsight:
            'Executive communication: outcome → method → projection. Never bury the lead.',
        },
      },
      {
        id: 'ps-5',
        topic: 'Persuasive Word Sequencing',
        question: 'Close the',
        questionEmphasis: 'deal.',
        subtitle:
          'Build a closing line for a client pitch. End with confidence and a clear next step.',
        contextBar:
          'Context: Final slide of a client pitch. One sentence: summary → confidence → CTA.',
        correctOrder: [
          'Based on these results,',
          "we're confident",
          'this approach will',
          'deliver ROI',
          'within 90 days.',
        ],
        wordBank: [
          'this approach will',
          'within 90 days.',
          'Based on these results,',
          'deliver ROI',
          "we're confident",
          'if approved today',
        ],
        structureHint: 'Evidence → Confidence → Specific CTA',
        hint: {
          heading: 'End strong. End specific.',
          description: 'Pitch closings need evidence, confidence, and a concrete timeline.',
          steps: [
            {
              title: '1. Evidence anchor',
              body: '"Based on these results" — grounds the close in what you\'ve shown.',
            },
            {
              title: '2. Confidence statement',
              body: '"we\'re confident this approach will deliver ROI" — direct, no hedging.',
            },
            {
              title: '3. Specific timeline',
              body: '"within 90 days" — concrete, not vague. Clients buy timelines.',
            },
          ],
          keyInsight: 'Great closings have a number. "Within 90 days" beats "soon" every time.',
        },
      },
      {
        id: 'ps-6',
        topic: 'Audience Adaptation',
        question: 'Translate for the',
        questionEmphasis: 'audience.',
        subtitle:
          'The same update, rewritten for a non-technical board. Build the simplified version.',
        contextBar:
          'Context: Board update. Technical team fixed a security vulnerability. Translate for non-technical board.',
        correctOrder: [
          'We identified',
          'a security gap',
          'in our login system',
          'and patched it',
          'before any data was exposed.',
        ],
        wordBank: [
          'and patched it',
          'a security gap',
          'We identified',
          'before any data was exposed.',
          'in our login system',
          'using zero-day mitigation',
        ],
        structureHint: 'Simple: Found it → Fixed it → No damage',
        hint: {
          heading: "Translate, don't simplify.",
          description:
            'Non-technical audiences need the same information in different words, not less information.',
          steps: [
            {
              title: '1. What happened (no jargon)',
              body: '"We identified a security gap in our login system" — clear, no acronyms.',
            },
            {
              title: '2. What you did',
              body: '"and patched it" — action taken, one word.',
            },
            {
              title: '3. Reassurance',
              body: '"before any data was exposed" — the thing the board actually cares about.',
            },
          ],
          keyInsight:
            'Technical → Board translation: replace jargon with outcomes. "Zero-day mitigation" → "patched it before any damage."',
        },
      },
    ],
  },
};
