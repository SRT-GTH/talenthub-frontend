/*
 * Crisis Room mock data — Figma SL-GS09 "Alarm 2" (Playful 7943:8272 / Focused 8110:496433). Shaped like
 * `GET /skills-lab/games/crisis-room` (alarms) + `POST …/alarms/:n/answer`.
 *
 * DRAWN: alarm 2 (title, prompt, the four people with their roles and avatar colours, the three first messages A–C, "4:12 to CEO
 * call", "Team calm: holding", the order 1 Kwabena · 2 Efua · 3 Mr. Boateng with Nana left un-numbered, message A picked, "Ask for
 * advice", "Alarm 1 handled well", header copy).
 * ⚠️ ASSUMPTION: which order / message is right (alarm 2: Kwabena, Efua, Mr. Boateng + message A — what the frame shows);
 * alarms 1, 3, 4 (copy, people, messages, right answers); a 5:00 countdown per alarm (0:00 = alarm lost); the "Team calm" word
 * (holding > 2:00, wobbling > 0:30, rattled below); "Ask for advice" shows a one-line tip; scoring (handled = right order AND
 * right message), +25 XP per alarm, +20 pass bonus; feedback copy. Only the top `calls` people get numbered, the rest stay dashed.
 */
export const CRISIS_ROOM = {
  gameId: 'crisis-room',
  title: 'Skills Lab · Crisis Room',
  label: 'Crisis Room',
  subtitle: 'Team leadership · 4 alarms · Pass 3 to earn Verified',
  skill: 'Team leadership',
  total: 4,
  passMark: 3,
  baseXp: 240,
  streakDays: 7,
  alarmXp: 25,
  passBonusXp: 20,
  checks: ['Prioritising people', 'Calm communication'],
  seconds: 300,
};

const P = (id, name, role, color, initial) => ({
  id,
  name,
  role,
  color,
  initial: initial ?? name[0],
});

const KWABENA = P('kwabena', 'Kwabena', 'On-call engineer', '#387440');
const EFUA = P('efua', 'Efua', 'Support lead', '#3062d4');
const BOATENG = P('boateng', 'Mr. Boateng', 'Client CEO', '#c8951a', 'M');
const NANA = P('nana', 'Nana', 'Your manager', '#6d28d9');

export const ALARMS = [
  {
    // ⚠️ ASSUMPTION (alarm 1)
    title: [
      ['The balance screen is wrong. Who do you ', false],
      ['call first?', true],
    ],
    prompt:
      'Customers are posting screenshots of wrong balances and the client CEO calls in 8 minutes. Order your calls, then pick your first message to the team.',
    people: [BOATENG, KWABENA, NANA, EFUA],
    calls: 3,
    order: ['kwabena', 'efua', 'boateng'],
    messages: [
      '"Balances look wrong for some users. Kwabena, can you check now? Efua, please prepare a holding reply."',
      '"WHO PUSHED THIS? Fix it before the CEO calls."',
      '"Let us wait ten minutes and see if it settles."',
    ],
    answer: 0,
    advice: 'Fix first, inform second, escalate last.',
    explain:
      'The engineer has to start fixing now, support needs a holding reply, and the CEO hears from you once you know more.',
  },
  {
    // DRAWN (alarm 2, Figma SL-GS09)
    title: [
      ['Payments are failing. Who do you ', false],
      ['call first?', true],
    ],
    prompt:
      '30% of users cannot pay and the client CEO calls in 5 minutes. Order your calls, then pick your first message to the team.',
    people: [KWABENA, EFUA, BOATENG, NANA],
    calls: 3,
    order: ['kwabena', 'efua', 'boateng'],
    messages: [
      '"Payments down for some users. Kwabena, can you look now? Efua, please pause the promo emails."',
      '"URGENT!!! Who broke payments? Everyone on a call now."',
      '"I will handle it myself. Enjoy your weekend."',
    ],
    answer: 0,
    advice: 'Fix first, inform second, escalate last.',
    explain:
      'Kwabena can fix it, Efua can stop more users hitting the problem, and the CEO call goes better once you have news. The calm, specific message keeps the team steady.',
  },
  {
    // ⚠️ ASSUMPTION (alarm 3)
    title: [
      ['A key teammate quit today. Who do you ', false],
      ['talk to first?', true],
    ],
    prompt:
      'Your best backend developer just resigned and the release is Friday. Order your calls, then pick your first message to the team.',
    people: [EFUA, NANA, KWABENA, BOATENG],
    calls: 2,
    order: ['nana', 'kwabena'],
    messages: [
      '"Heads up, Kwabena is taking over the payments work. Let us plan it together at 2pm."',
      '"Nobody tell the client yet. We will just work harder."',
      '"This is a disaster. Everyone stay late this week."',
    ],
    answer: 0,
    advice: 'Tell your manager first, then the person who inherits the work.',
    explain:
      'Your manager needs to know before anyone else, and Kwabena has to pick up the work. The client can hear once you have a plan.',
  },
  {
    // ⚠️ ASSUMPTION (alarm 4)
    title: [
      ['Two teammates are in a fight. Who do you ', false],
      ['speak to first?', true],
    ],
    prompt:
      'Efua and Kwabena disagree loudly in the team chat and the demo is tomorrow. Order your calls, then pick your first message to the team.',
    people: [BOATENG, KWABENA, NANA, EFUA],
    calls: 2,
    order: ['kwabena', 'efua'],
    messages: [
      '"Let us take this off the chat. Kwabena, Efua, I will speak to you one by one in ten minutes."',
      '"Stop arguing in public. Both of you, apologise now."',
      '"Ignore it. They will sort it out."',
    ],
    answer: 0,
    advice: 'Listen to each person on their own before you say anything to the group.',
    explain:
      'Hear each side in private before the demo. A public telling-off or ignoring it both make the tension worse.',
  },
];

export const CRISIS_FRAMES = {
  GS09: {
    alarm: 1,
    results: [{ order: true, msg: true }],
    order: ['kwabena', 'efua', 'boateng', 'nana'],
    message: 0,
    seconds: 252,
  },
};
