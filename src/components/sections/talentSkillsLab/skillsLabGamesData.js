/*
 * Skills Lab games catalogue — Figma SL-G01 "Games tab (Arcade)" (Playful 7943:13442, Focused 8110:498108). Shaped like
 * `GET /skills-lab/games` (the player's `status` is merged in by the API: new | ready | played | soon). Copy is verbatim.
 * Status labels: 'New game' / 'Ready to play' / 'Played · +50 XP' (Focused: "+50 pts") / 'Coming soon'.
 * `skill: true` rows are the skill games that verify a skill; the rest are personality games.
 * Link: `/skills-lab/games/<id>`; `soon` games are not playable and carry no link.
 * Art: exported from Figma (src/assets/talent-skills-lab/games/*.png, 2x of the 56px cover). Pitch in 60 and The Pitch
 * share one illustration in Figma.
 */

import coverBugHunt from '../../../assets/talent-skills-lab/games/bug-hunt.png';
import coverSqlHeist from '../../../assets/talent-skills-lab/games/sql-heist.png';
import coverFormulaRush from '../../../assets/talent-skills-lab/games/formula-rush.png';
import coverChartDetective from '../../../assets/talent-skills-lab/games/chart-detective.png';
import coverPixelPerfect from '../../../assets/talent-skills-lab/games/pixel-perfect.png';
import coverSprintStack from '../../../assets/talent-skills-lab/games/sprint-stack.png';
import coverFeatureFrenzy from '../../../assets/talent-skills-lab/games/feature-frenzy.png';
import coverPitchIn60 from '../../../assets/talent-skills-lab/games/the-pitch.png';
import coverCrisisRoom from '../../../assets/talent-skills-lab/games/crisis-room.png';
import coverChessBlitz from '../../../assets/talent-skills-lab/games/chess-blitz.png';
import coverEscapeRoom from '../../../assets/talent-skills-lab/games/escape-room.png';
import coverMakolaHaggle from '../../../assets/talent-skills-lab/games/makola-haggle.png';
import coverDesertIsland from '../../../assets/talent-skills-lab/games/desert-island.png';
import coverTrotroRush from '../../../assets/talent-skills-lab/games/trotro-rush.png';
import coverGroupChatDrama from '../../../assets/talent-skills-lab/games/group-chat-drama.png';
import coverSpeedSort from '../../../assets/talent-skills-lab/games/speed-sort.png';
import coverTowerBuilder from '../../../assets/talent-skills-lab/games/tower-builder.png';
import coverThePitch from '../../../assets/talent-skills-lab/games/the-pitch.png';
import coverLudoRisk from '../../../assets/talent-skills-lab/games/ludo-risk.png';
import coverFestivalPlanner from '../../../assets/talent-skills-lab/games/festival-planner.png';
import featuredCover from '../../../assets/talent-skills-lab/games/featured-bug-hunt.png';

export const GAMES_ARCADE = {
  featured: {
    gameId: 'bug-hunt',
    eyebrow: 'NEW IN SKILLS LAB · ARCADE',
    title: 'Verify skills by playing',
    body: 'Bug Hunt, SQL Heist, Chart Detective and 7 more. Each game checks one skill. Pass it and the Verified badge lands on your recruiter card, same as a lab.',
    cta: 'Start hunting',
    cover: featuredCover,
  },
  skillSection: {
    title: 'Skill games',
    subtitle: 'Pass to verify a skill. 2 of 6 of your skills verified.',
  },
  personalitySection: {
    title: 'Personality games',
    subtitle: 'Already have your archetype? Replay any game to sharpen your trait scores.',
  },
  statusLabels: {
    new: 'New game',
    ready: 'Ready to play',
    played: 'Played · +{xp} {unit}',
    soon: 'Coming soon',
  },
  actions: { play: 'Play game', replay: 'Replay', soon: 'Coming soon' },
};

export const ARCADE_GAMES = [
  {
    id: 'bug-hunt',
    skill: true,
    title: 'Bug Hunt',
    category: 'Python',
    status: 'new',
    meta: '~4 min · 8 rounds',
    description: 'A bug is hiding in every snippet. Tap the broken line before the timer runs out.',
    measures: 'Verifies Python · Intermediate',
    cover: coverBugHunt,
  },
  {
    id: 'sql-heist',
    skill: true,
    title: 'SQL Heist',
    category: 'SQL',
    status: 'new',
    meta: '~6 min · 5 clues',
    description: 'Someone stole the jollof. Query the restaurant database to find out who.',
    measures: 'Verifies SQL · Intermediate',
    cover: coverSqlHeist,
  },
  {
    id: 'formula-rush',
    skill: true,
    title: 'Formula Rush',
    category: 'Excel',
    status: 'ready',
    meta: '~4 min · 6 rounds',
    description: 'Race across a sales sheet. Build the right formula before the cell turns red.',
    measures: 'Verifies Excel · Beginner to Pro',
    cover: coverFormulaRush,
  },
  {
    id: 'chart-detective',
    skill: true,
    title: 'Chart Detective',
    category: 'Data analysis',
    status: 'ready',
    meta: '~4 min · 6 cases',
    description: 'One chart in each pair is lying. Spot the trick: cut axes, cherry-picked dates.',
    measures: 'Verifies Data analysis',
    cover: coverChartDetective,
  },
  {
    id: 'pixel-perfect',
    skill: true,
    title: 'Pixel Perfect',
    category: 'UI/UX design',
    status: 'ready',
    meta: '~5 min · 6 screens',
    description: 'Find the three things wrong with each screen. Contrast, spacing, hierarchy.',
    measures: 'Verifies UI/UX · Intermediate',
    cover: coverPixelPerfect,
  },
  {
    id: 'sprint-stack',
    skill: true,
    title: 'Sprint Stack',
    category: 'Engineering',
    status: 'ready',
    meta: '~5 min · 3 sprints',
    description: 'Fit tasks into a 20-point sprint without breaking dependencies.',
    measures: 'Verifies Engineering planning',
    cover: coverSprintStack,
  },
  {
    id: 'feature-frenzy',
    skill: true,
    title: 'Feature Frenzy',
    category: 'Product',
    status: 'ready',
    meta: '~4 min · 10 cards',
    description: 'Swipe to keep or kill features with a fixed budget and real user data.',
    measures: 'Verifies Product management',
    cover: coverFeatureFrenzy,
  },
  {
    id: 'pitch-in-60',
    skill: true,
    title: 'Pitch in 60',
    category: 'Public speaking',
    status: 'ready',
    meta: '~3 min · 2 pitches',
    description: 'Sixty seconds, one idea, a live audience meter. Open strong, close with an ask.',
    measures: 'Verifies Public speaking',
    cover: coverPitchIn60,
  },
  {
    id: 'crisis-room',
    skill: true,
    title: 'Crisis Room',
    category: 'Leadership',
    status: 'ready',
    meta: '~5 min · 4 alarms',
    description: 'The app is down, the client is calling. Who do you call first?',
    measures: 'Verifies Team leadership',
    cover: coverCrisisRoom,
  },
  {
    id: 'chess-blitz',
    skill: true,
    title: 'Chess Blitz',
    category: 'Strategic thinking',
    status: 'played',
    xp: 50,
    meta: '~4 min · 5 puzzles',
    description: 'Mate-in-two puzzles against the clock. Spot the weak square and commit.',
    measures: 'Verifies Strategic thinking',
    cover: coverChessBlitz,
  },
  {
    id: 'escape-room',
    skill: false,
    title: 'The Escape Room',
    category: 'Strategy',
    status: 'ready',
    meta: '~5 min · Medium',
    description:
      'Four rooms, one clock. Every clue you chase shows how you think when time is tight.',
    measures: 'Problem solving · Calm under pressure',
    cover: coverEscapeRoom,
  },
  {
    id: 'makola-haggle',
    skill: false,
    title: 'Makola Haggle',
    category: 'Social',
    status: 'new',
    meta: '~4 min · Medium',
    description: 'Bargain with a market queen. Shows how you handle give and take.',
    measures: 'Agreeableness · Decisiveness',
    cover: coverMakolaHaggle,
  },
  {
    id: 'desert-island',
    skill: false,
    title: 'Desert Island',
    category: 'Decisions',
    status: 'ready',
    meta: '~4 min · Medium',
    description: 'Your ship sank. Pick 5 of 12 items to keep. Then pick who to save.',
    measures: 'Decisiveness · Openness',
    cover: coverDesertIsland,
  },
  {
    id: 'trotro-rush',
    skill: false,
    title: 'Trotro Rush',
    category: 'Planning',
    status: 'new',
    meta: '~4 min · Easy',
    description: 'Five errands across Accra before 9am. Plan the route, beat the traffic.',
    measures: 'Conscientiousness · Planning',
    cover: coverTrotroRush,
  },
  {
    id: 'group-chat-drama',
    skill: false,
    title: 'Group Chat Drama',
    category: 'Social',
    status: 'new',
    meta: '~3 min · Easy',
    description: 'Your final-year project group chat is on fire. What do you send?',
    measures: 'Agreeableness · Emotional stability',
    cover: coverGroupChatDrama,
  },
  {
    id: 'speed-sort',
    skill: false,
    title: 'Speed Sort',
    category: 'Speed',
    status: 'ready',
    meta: '~2 min · Hard',
    description: 'Cards fly in fast. Sort them into the right basket before the timer ends.',
    measures: 'Focus · Decisiveness',
    cover: coverSpeedSort,
  },
  {
    id: 'tower-builder',
    skill: false,
    title: 'Tower Builder',
    category: 'Logic',
    status: 'ready',
    meta: '~4 min · Easy',
    description: 'Stack blocks under rules that keep changing. Plan or improvise?',
    measures: 'Conscientiousness · Patience',
    cover: coverTowerBuilder,
  },
  {
    id: 'the-pitch',
    skill: false,
    title: 'The Pitch',
    category: 'Creativity',
    status: 'ready',
    meta: '~3 min · Hard',
    description:
      'Sell a random idea in 60 seconds, by voice or text. Bravery counts more than polish.',
    measures: 'Extraversion · Openness',
    cover: coverThePitch,
  },
  {
    id: 'ludo-risk',
    skill: false,
    title: 'Ludo Risk',
    category: 'Strategy',
    status: 'ready',
    meta: '~3 min · Medium',
    description: 'Play it safe or chase the big move? Every roll tells us something.',
    measures: 'Risk appetite · Emotional stability',
    cover: coverLudoRisk,
  },
  {
    id: 'festival-planner',
    skill: false,
    title: 'Festival Planner',
    category: 'Creativity',
    status: 'soon',
    meta: '~5 min · Medium',
    description: 'Set up a stall at a street art festival with a tight budget and a big crowd.',
    measures: 'Openness · Organisation',
    cover: coverFestivalPlanner,
  },
];

export const gameById = (id) => ARCADE_GAMES.find((g) => g.id === id);
