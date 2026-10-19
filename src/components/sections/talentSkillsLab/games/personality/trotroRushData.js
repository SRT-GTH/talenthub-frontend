/*
 * Trotro Rush mock content (Figma SL-GP07 Plan your route, Playful 7943:10219 / Focused 8110:497519).
 * Copy, stop positions, block / road geometry and the default errand order are verbatim from the frame (map coordinates
 * are the offsets inside the 1040x603 map).
 *
 * ⚠️ ASSUMPTION (Figma draws one static route): the travel model below — minutes and fares per road, errand durations,
 * Dijkstra shortest path between errands — is invented, but tuned so the DRAWN order reproduces the drawn numbers
 * exactly (7:20 · 7:55 · 8:00 · 8:25 · 8:56, "Arrive 8:56", "Fare GH₵ 25", green route = home–circle–kaneshie–osu–office).
 * The traffic delay (+15 min) sits on the dotted red road mall–office. Morning 2 and the completion dialog are also assumed.
 */
export const START_MINUTES = 6 * 60 + 45; // 6:45 AM
export const DEADLINE_MINUTES = 9 * 60;

export const MAP = { w: 1040, h: 603, seaTop: 528 };

/* id -> { name, x, y (stop centre), label:[x,y] top-left of the pill, tone } */
export const PLACES = {
  home: { short: 'Madina', name: 'Madina · Home', x: 113, y: 103, label: [130, 70], start: true },
  legon: { short: 'Legon', name: 'Legon', x: 339, y: 75, label: [356, 41] },
  mall: { short: 'Accra Mall', name: 'Accra Mall', x: 650, y: 179, label: [667, 145] },
  circle: { short: 'Circle', name: 'Kwame Nkrumah Circle', x: 358, y: 339, label: [375, 305] },
  kaneshie: { short: 'Kaneshie', name: 'Kaneshie', x: 160, y: 443, label: [177, 409] },
  osu: { short: 'Osu', name: 'Osu', x: 678, y: 443, label: [695, 409] },
  office: {
    short: 'Airport City',
    name: 'Airport City · Office',
    x: 885,
    y: 282,
    label: [875, 249],
    end: true,
  },
};

/* [a, b, minutes, fare] — ⚠️ ASSUMPTION values */
export const ROADS = [
  ['home', 'legon', 12, 2],
  ['legon', 'mall', 18, 3],
  ['home', 'circle', 20, 4],
  ['circle', 'kaneshie', 15, 3],
  ['circle', 'mall', 17, 3],
  ['mall', 'office', 20, 4],
  ['circle', 'osu', 30, 5],
  ['osu', 'office', 31, 9],
  ['kaneshie', 'osu', 10, 3],
];
export const TRAFFIC = { road: ['mall', 'office'], minutes: 15 };

export const BLOCKS = [
  [19, 28, 75, 47],
  [182, 120, 110, 69],
  [345, 211, 145, 90],
  [508, 302, 95, 56],
  [671, 394, 130, 77],
  [834, 485, 80, 99],
  [55, 49, 115, 64],
  [218, 140, 150, 86],
  [381, 232, 100, 51],
  [544, 323, 135, 73],
  [707, 414, 85, 94],
  [869, 506, 120, 59],
  [90, 70, 154, 81],
  [253, 161, 105, 103],
];

export const edgeKey = (a, b) => [a, b].sort().join('-');
const ROAD_INDEX = new Map(
  ROADS.map(([a, b, min, fare]) => [
    edgeKey(a, b),
    { a, b, min: min + (edgeKey(...TRAFFIC.road) === edgeKey(a, b) ? TRAFFIC.minutes : 0), fare },
  ])
);

const neighbours = (id) =>
  [...ROAD_INDEX.values()]
    .filter((r) => r.a === id || r.b === id)
    .map((r) => [r.a === id ? r.b : r.a, r]);

/* Dijkstra on minutes. Returns { minutes, fare, edges:[edgeKey] } */
export const shortestPath = (from, to) => {
  if (from === to) return { minutes: 0, fare: 0, edges: [] };
  const best = { [from]: { minutes: 0, fare: 0, edges: [] } };
  const todo = new Set(Object.keys(PLACES));
  while (todo.size) {
    let cur = null;
    todo.forEach((id) => {
      if (best[id] && (cur === null || best[id].minutes < best[cur].minutes)) cur = id;
    });
    if (cur === null || cur === to) break;
    todo.delete(cur);
    neighbours(cur).forEach(([next, road]) => {
      const cand = {
        minutes: best[cur].minutes + road.min,
        fare: best[cur].fare + road.fare,
        edges: [...best[cur].edges, edgeKey(cur, next)],
      };
      if (!best[next] || cand.minutes < best[next].minutes) best[next] = cand;
    });
  }
  return best[to];
};

/*
 * planRoute(errands) — errands in the player's order. Each errand: { place|null, minutes } (null = done wherever you are).
 * Returns { done:[minutes of day each errand finishes], arrive, fare, edges:Set, firstIndex:{placeId:errandIndex} }.
 */
export const planRoute = (errands) => {
  let clock = START_MINUTES;
  let at = 'home';
  let fare = 0;
  const edges = new Set();
  const firstIndex = {};
  const done = errands.map((errand, i) => {
    if (errand.place && errand.place !== at) {
      const leg = shortestPath(at, errand.place);
      clock += leg.minutes;
      fare += leg.fare;
      leg.edges.forEach((e) => edges.add(e));
      at = errand.place;
    }
    if (errand.place && firstIndex[errand.place] === undefined) firstIndex[errand.place] = i;
    clock += errand.minutes;
    return clock;
  });
  return { done, arrive: clock, fare, edges, firstIndex };
};

export const clockLabel = (minutes) => {
  const h = Math.floor(minutes / 60);
  return `${h > 12 ? h - 12 : h}:${String(minutes % 60).padStart(2, '0')}`;
};

export const TROTRO = {
  gameId: 'trotro-rush',
  title: 'Personality game · Trotro Rush',
  subtitle: '2 mornings · No wrong routes · About 4 min left',
  xp: '+20 {xp}',
  doneXp: '+50 {xp}',
  doneSubtitle: '2 mornings · Game done',
  sticker: 'BEAT 9 AM',
  progressNote: 'Saved as you go',
  doneNote: 'Saved',
  info: 'Drag errands to change the order. The map updates live.',
  doneInfo: 'Your traits update after every game. Recruiters only see traits.',
  reads: ['Conscientiousness', 'Planning ahead'],
  mornings: [
    {
      /* DRAWN: GP07 */
      eyebrow: 'MORNING 1 · PLANNING',
      title: ['Five errands. Be at the office ', 'by 9.'],
      body: 'Drag the errands to change the order. The route on the map updates as you go.',
      errands: [
        { id: 'id', title: 'ID card', place: 'kaneshie', minutes: 0 },
        { id: 'cv', title: 'Print CV', place: 'circle', minutes: 20 },
        { id: 'airtime', title: 'Airtime', place: null, minutes: 5 },
        { id: 'coffee', title: 'Coffee with Kwame', place: 'osu', minutes: 0 },
        { id: 'office', title: 'Office', place: 'office', minutes: 0 },
      ],
    },
    {
      /* ⚠️ ASSUMPTION: morning 2 — same map, a different set of errands. */
      eyebrow: 'MORNING 2 · PLANNING',
      title: ['Five more errands. Be at the office ', 'by 9.'],
      body: 'Drag the errands to change the order. The route on the map updates as you go.',
      errands: [
        { id: 'parcel', title: 'Drop a parcel', place: 'mall', minutes: 5 },
        { id: 'books', title: 'Return books', place: 'legon', minutes: 10 },
        { id: 'mobile', title: 'Mobile money', place: null, minutes: 5 },
        { id: 'lunch', title: 'Buy lunch', place: 'osu', minutes: 5 },
        { id: 'office', title: 'Office', place: 'office', minutes: 0 },
      ],
    },
  ],
  complete: {
    sticker: 'ON TIME',
    eyebrow: 'YOUR PLAY STYLE',
    title: 'The Early Planner.',
    body: 'You thought about the whole morning before you moved and kept the office as your last stop.',
    stats: [
      { value: '2 of 2', label: 'MORNINGS', tone: 'green' },
      { value: '+50 {xp}', label: 'EARNED', tone: 'gold' },
      { value: '2', label: 'TRAITS READ', tone: 'green' },
    ],
    traits: [
      {
        label: 'Conscientiousness',
        note: 'Ordered errands before starting',
        chip: '+7',
        strong: true,
      },
      { label: 'Planning ahead', note: 'Checked the traffic first', chip: '+5', strong: true },
    ],
    next: { title: 'Up next: Group Chat Drama', sub: '~3 min · Social · +50 {xp}', cta: 'Play' },
    actions: { secondary: 'Back to games', primary: 'Play next game' },
  },
};
