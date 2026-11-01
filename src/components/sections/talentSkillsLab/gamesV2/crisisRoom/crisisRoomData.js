import { callServer } from '../serverGame/mockServer.js';

/*
 * Crisis Room (Games v2) mock content + mock server. Shaped like `GET /skills-lab/games/crisis-room` (alarms) and
 * `POST /skills-lab/games/crisis-room/alarms/:n/answer` ("server" game: every plan is checked server-side, the client only
 * sends { alarm, order, message }).
 *
 * DRAWN (Figma CR-01 / CR-02, alarm 2): eyebrow, title "Payments are failing. Who do you call first?", prompt, the four people
 * (names, roles, avatar colours), messages A–C, the order Kwabena · Efua · Mr. Boateng with Nana left out, message A, "Your order
 * works. Efua first is right.", the "Why this order" paragraph, "Handled well.", the pass mark 3 of 4, the Measures chips.
 * ⚠️ ASSUMPTION: alarms 1, 3, 4 (copy adapted from the legacy Arcade Crisis Room), which orders count as "works" / "best",
 * the other feedback lines, "Not this time.", 5:00 per alarm (level changes it: beginner 6:00 · advanced 4:00 · expert 3:00),
 * handled = acceptable order AND the right first message, the mock endpoint + its delay, "Checking…", "See my result",
 * the "How it's scored" note, the score / skills formula in `summarise`.
 */
export const CRISIS_ROOM = {
  gameId: 'crisis-room',
  name: 'Crisis Room',
  subtitle: 'Team leadership · 4 alarms · Pass 3 of 4 to verify the skill',
  skill: 'Team leadership',
  total: 4,
  passMark: 3,
  checks: ['Team leadership', 'Strategic thinking'],
  // ⚠️ ASSUMPTION: seconds per alarm by level.
  seconds: { beginner: 360, intermediate: 300, advanced: 240, expert: 180 },
  scoredNote:
    'A plan is handled when the right people are called in a sound order and your first message keeps the team calm. Pass 3 of 4 to verify the skill.',
};

const P = (id, name, role, color, initial) => ({
  id,
  name,
  role,
  color,
  initial: initial ?? name[0],
  // The legacy Arcade version draws "M" in ink on Mr. Boateng's gold; keep the glyph colour with the person.
  ink: id === 'boateng',
});

const KWABENA = P('kwabena', 'Kwabena', 'On-call engineer', '#387440');
const EFUA = P('efua', 'Efua', 'Support lead', '#3062d4');
const BOATENG = P('boateng', 'Mr. Boateng', 'Client CEO', '#c8951a');
const NANA = P('nana', 'Nana', 'Your manager', '#6d28d9');

/*
 * Each alarm: people (display order), calls (how many get a number), best (best order), works (other acceptable orders),
 * messages, answer (index of the right first message), pills {best, works, off, wrongMessage}, explain.
 */
export const ALARMS = [
  {
    // ⚠️ ASSUMPTION (alarm 1)
    eyebrow: 'ALARM 1 · TEAM LEADERSHIP',
    title: 'The balance screen is wrong. Who do you call first?',
    prompt:
      'Customers are posting screenshots of wrong balances. Put the people in order, then pick your first message.',
    people: [BOATENG, KWABENA, NANA, EFUA],
    calls: 3,
    best: ['kwabena', 'efua', 'boateng'],
    works: [['efua', 'kwabena', 'boateng']],
    messages: [
      '"Balances look wrong for some users. Kwabena, can you check now? Efua, please prepare a holding reply."',
      '"WHO PUSHED THIS? Fix it before the CEO calls."',
      '"Let us wait ten minutes and see if it settles."',
    ],
    answer: 0,
    pills: {
      best: 'Best order. Fix first, inform second, escalate last.',
      works: 'Your order works. Kwabena fixing first is best.',
      off: 'Not quite. The engineer should hear it first.',
    },
    explain:
      'Kwabena has to start fixing now, Efua needs to prepare a holding reply, and Mr. Boateng hears it from you once you know more.',
  },
  {
    // DRAWN (alarm 2, Figma CR-01 / CR-02)
    eyebrow: 'ALARM 2 · TEAM LEADERSHIP',
    title: 'Payments are failing. Who do you call first?',
    prompt: '30% of users cannot pay. Put the people in order, then pick your first message.',
    people: [KWABENA, EFUA, BOATENG, NANA],
    calls: 3,
    // ⚠️ ASSUMPTION: the frame says "Efua first is right" yet draws the order Kwabena · Efua · Mr. Boateng as "works".
    best: ['efua', 'kwabena', 'boateng'],
    works: [['kwabena', 'efua', 'boateng']],
    messages: [
      '"Payments down for some users. Kwabena, can you look now? Efua, please pause the promo emails."',
      '"URGENT!!! Who broke payments? Everyone on a call now."',
      '"I will handle it myself. Enjoy your weekend."',
    ],
    answer: 0,
    pills: {
      best: 'Best order. Efua first is right.', // ⚠️ ASSUMPTION (the drawn line is the "works" one)
      works: 'Your order works. Efua first is right.', // DRAWN
      off: 'Not quite. Efua first is right.', // ⚠️ ASSUMPTION
    },
    explain:
      'Efua owns payments, so she can stop the damage fastest. Kwabena handles customers next, and Mr. Boateng hears it from you before the CEO call.',
  },
  {
    // ⚠️ ASSUMPTION (alarm 3)
    eyebrow: 'ALARM 3 · TEAM LEADERSHIP',
    title: 'A key teammate quit today. Who do you talk to first?',
    prompt:
      'Your best backend developer just resigned and the release is Friday. Put the people in order, then pick your first message.',
    people: [EFUA, NANA, KWABENA, BOATENG],
    calls: 2,
    best: ['nana', 'kwabena'],
    works: [],
    messages: [
      '"Heads up, Kwabena is taking over the payments work. Let us plan it together at 2pm."',
      '"Nobody tell the client yet. We will just work harder."',
      '"This is a disaster. Everyone stay late this week."',
    ],
    answer: 0,
    pills: {
      best: 'Best order. Your manager hears it first.',
      works: 'Your order works. Your manager hears it first.',
      off: 'Not quite. Tell your manager first.',
    },
    explain:
      'Nana needs to know before anyone else, and Kwabena has to pick up the work. The client can hear once you have a plan.',
  },
  {
    // ⚠️ ASSUMPTION (alarm 4)
    eyebrow: 'ALARM 4 · TEAM LEADERSHIP',
    title: 'Two teammates are in a fight. Who do you speak to first?',
    prompt:
      'Efua and Kwabena disagree loudly in the team chat and the demo is tomorrow. Put the people in order, then pick your first message.',
    people: [BOATENG, KWABENA, NANA, EFUA],
    calls: 2,
    best: ['kwabena', 'efua'],
    works: [['efua', 'kwabena']],
    messages: [
      '"Let us take this off the chat. Kwabena, Efua, I will speak to you one by one in ten minutes."',
      '"Stop arguing in public. Both of you, apologise now."',
      '"Ignore it. They will sort it out."',
    ],
    answer: 0,
    pills: {
      best: 'Best order. Hear each side in private.',
      works: 'Your order works. Hear each side in private.',
      off: 'Not quite. Speak to the two of them, one by one.',
    },
    explain:
      'Hear each side in private before the demo. A public telling-off or ignoring it both make the tension worse.',
  },
];

// ⚠️ ASSUMPTION: shown when the order works but the first message was the wrong one.
const WRONG_MESSAGE_PILL = 'Your order works, but the first message sets the tone.';

const sameOrder = (a, b) => a.length === b.length && a.every((id, i) => id === b[i]);

/* "POST …/alarms/:n/answer" — the server's verdict for one plan. */
const judge = ({ alarm, order, message }) => {
  const data = ALARMS[alarm];
  const picked = order.slice(0, data.calls);
  const isBest = sameOrder(picked, data.best);
  const orderOk = isBest || data.works.some((w) => sameOrder(picked, w));
  const messageOk = message === data.answer;
  const handled = orderOk && messageOk;
  let pill = data.pills.off;
  if (orderOk)
    pill = messageOk ? (isBest ? data.pills.best : data.pills.works) : WRONG_MESSAGE_PILL;
  return {
    alarm,
    handled,
    orderOk,
    messageOk,
    isBest,
    bestOrder: data.best,
    title: handled ? 'Handled well.' : 'Not this time.',
    pill,
    explain: data.explain,
  };
};

export const judgeAlarm = judge;

export const submitAlarm = (payload) =>
  callServer(`crisis-room alarm ${payload.alarm + 1}`, () => judge(payload));

/* Everything the result card needs from a finished run (`g.finish(...)`). `results` = one verdict per alarm played. */
export const summarise = (results) => {
  const total = CRISIS_ROOM.total;
  const handled = results.filter((r) => r.handled).length;
  const orders = results.filter((r) => r.orderOk).length;
  const messages = results.filter((r) => r.messageOk).length;
  const pct = (n) => Math.round((n / total) * 100);
  return {
    score: pct(handled),
    skills: [
      { label: 'Team leadership', value: pct(orders) },
      { label: 'Strategic thinking', value: pct(messages) },
    ],
    summary: `You handled ${handled} of ${total} alarms well.`,
    verifies: 'Team leadership',
  };
};
