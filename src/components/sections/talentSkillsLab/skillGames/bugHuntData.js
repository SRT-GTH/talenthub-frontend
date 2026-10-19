/*
 * Bug Hunt mock data — Figma SL-GS02 (Playful 7943:6875 / Focused 8110:495726), SL-GS03 (7943:7074 / 8110:495830),
 * SL-GS12 (7943:9038 / 8110:496727). Shaped like `GET /skills-lab/games/bug-hunt` (run config + rounds) and
 * `POST /skills-lab/games/bug-hunt/runs/:id/rounds/:n` (answer). Copy is verbatim from the frames where drawn.
 *
 * DRAWN: round 4 (momo_payouts.py), the header/progress copy, the topics of the results modal (Off-by-one loops = rounds 1 and 4,
 * Dictionaries = rounds 2 and 6, String formatting = rounds 3, 7 and 8, Mutable default arguments = round 5) and the stats.
 * ⚠️ ASSUMPTION: rounds 1, 2, 3, 5, 6, 7, 8 (snippet, bug report, fixes, explanation, tip) are written to fit the drawn topic
 * list, because Figma only draws round 4's code. Also assumed: 60 s per round, 3 lives, +15 XP per squashed bug, +15 XP pass
 * bonus (7 × 15 + 15 = the drawn +120 XP), wrong tap / wrong fix = lose a life and the combo.
 */
export const BUG_HUNT = {
  gameId: 'bug-hunt',
  title: 'Skills Lab · Bug Hunt',
  label: 'Bug Hunt',
  sticker: 'FIND THE BUG',
  subtitle: 'Python · 8 rounds · Pass 6 to earn Verified',
  skill: 'Python',
  total: 8,
  passMark: 6,
  lives: 3,
  roundSeconds: 60,
  squashXp: 15,
  passBonusXp: 15,
  baseXp: 240,
  streakDays: 7,
  hintCost: 5,
  checks: ['Loops', 'Off-by-one errors'],
};

const fixes = (a, b, c) => [a, b, c];

/* line = text; tapping the broken line (1-based `bug`) reveals the three fixes; `fixed` is the corrected line. */
export const BUG_ROUNDS = [
  {
    // ⚠️ ASSUMPTION (round 1)
    topic: 'Off-by-one loops',
    check: ['Loops', 'Off-by-one errors'],
    file: 'sales_total.py',
    report:
      'Bug report from Cape Coast: "The daily total is always missing the first sale." Tap the broken line, then pick the fix.',
    code: [
      'def total_sales(prices):',
      '    total = 0',
      '    for i in range(1, len(prices)):',
      '        total += prices[i]',
      '    return total',
      '',
      'print(total_sales([12, 8, 20]))',
    ],
    bug: 3,
    fixes: fixes('range(len(prices))', 'range(len(prices) - 1)', 'range(1, len(prices) + 1)'),
    answer: 0,
    fixed: '    for i in range(len(prices)):',
    explain:
      'range(1, len(prices)) starts at index 1, so prices[0] is never added. range(len(prices)) visits every sale.',
    tip: 'Pro tip: loop over the list itself, "for price in prices:", and you can never be off by one.',
  },
  {
    // ⚠️ ASSUMPTION (round 2)
    topic: 'Dictionaries',
    check: ['Loops', 'Dictionaries'],
    file: 'order_counter.py',
    report:
      'Bug report from Takoradi: "The order counter crashes the first time it sees a new dish." Tap the broken line, then pick the fix.',
    code: [
      'def count_orders(orders):',
      '    counts = {}',
      '    for dish in orders:',
      '        counts[dish] += 1',
      '    return counts',
      '',
      'print(count_orders(["kenkey", "waakye", "kenkey"]))',
    ],
    bug: 4,
    fixes: fixes(
      'counts[dish] = counts.get(dish, 0) + 1',
      'counts.add(dish)',
      'counts[dish] = counts[dish] + 0'
    ),
    answer: 0,
    fixed: '        counts[dish] = counts.get(dish, 0) + 1',
    explain:
      'counts[dish] fails with a KeyError the first time a dish appears. counts.get(dish, 0) falls back to 0, so the first order counts as 1.',
    tip: 'Pro tip: collections.Counter does this whole loop for you.',
  },
  {
    // ⚠️ ASSUMPTION (round 3)
    topic: 'String formatting',
    check: ['Strings', 'Types'],
    file: 'receipt.py',
    report:
      'Bug report from Ho: "The receipt crashes when we print the amount." Tap the broken line, then pick the fix.',
    code: [
      'def receipt(name, amount):',
      '    line = "Paid GH₵" + amount',
      '    return name + ": " + line',
      '',
      'print(receipt("Esi", 250))',
    ],
    bug: 2,
    fixes: fixes(
      'line = f"Paid GH₵{amount}"',
      'line = "Paid GH₵" - amount',
      'line = "Paid GH₵" * amount'
    ),
    answer: 0,
    fixed: '    line = f"Paid GH₵{amount}"',
    explain:
      'You cannot add a number to a string with +. An f-string turns amount into text for you.',
    tip: 'Pro tip: reach for f-strings first. They read left to right, like the sentence they print.',
  },
  {
    // DRAWN (round 4, Figma SL-GS02 / SL-GS03)
    topic: 'Off-by-one loops',
    check: ['Loops', 'Off-by-one errors'],
    file: 'momo_payouts.py',
    report:
      'Bug report from Kumasi: "We split MoMo payouts between 4 sellers, but Yaw never gets paid." Tap the broken line, then pick the fix.',
    code: [
      'def split_payouts(total, sellers):',
      '    share = round(total / len(sellers), 2)',
      '    payouts = {}',
      '    for i in range(len(sellers) - 1):',
      '        name = sellers[i]',
      '        payouts[name] = share',
      '    return payouts',
      '',
      'sellers = ["Ama", "Kojo", "Esi", "Yaw"]',
      'print(split_payouts(400, sellers))',
    ],
    bug: 4,
    fixes: fixes('range(len(sellers))', 'range(1, len(sellers))', 'range(len(sellers) + 1)'),
    answer: 0,
    fixed: '    for i in range(len(sellers)):',
    explain:
      'range(len(sellers) - 1) stops one early, so the last seller (Yaw) was skipped. range(len(sellers)) pays all four.',
    tip: 'Pro tip: loop over the list itself, "for name in sellers:", and you can never be off by one.',
  },
  {
    // ⚠️ ASSUMPTION (round 5)
    topic: 'Mutable default arguments',
    check: ['Functions', 'Mutable defaults'],
    file: 'cart.py',
    report:
      'Bug report from Koforidua: "Every customer\'s cart already has the last customer\'s items in it." Tap the broken line, then pick the fix.',
    code: [
      'def add_item(item, cart=[]):',
      '    cart.append(item)',
      '    return cart',
      '',
      'print(add_item("shea butter"))',
      'print(add_item("kente"))',
    ],
    bug: 1,
    fixes: fixes(
      'def add_item(item, cart=None):',
      'def add_item(item, cart=list):',
      'def add_item(item, cart=()):'
    ),
    answer: 0,
    fixed: 'def add_item(item, cart=None):',
    explain:
      'A default list is created once and shared by every call. Default to None and build a fresh list inside the function.',
    tip: 'Pro tip: never use [] or {} as a default value. Use None and create it inside.',
  },
  {
    // ⚠️ ASSUMPTION (round 6)
    topic: 'Dictionaries',
    check: ['Dictionaries', 'Errors'],
    file: 'menu_prices.py',
    report:
      'Bug report from Sunyani: "Asking for a dish that is not on the menu crashes the till." Tap the broken line, then pick the fix.',
    code: [
      'prices = {"kenkey": 5, "waakye": 15}',
      '',
      'def price_of(dish):',
      '    return prices[dish]',
      '',
      'print(price_of("fufu"))',
    ],
    bug: 4,
    fixes: fixes('return prices.get(dish, 0)', 'return prices.dish', 'return prices(dish)'),
    answer: 0,
    fixed: '    return prices.get(dish, 0)',
    explain:
      'prices[dish] raises a KeyError for a missing dish. .get(dish, 0) returns 0 instead of crashing.',
    tip: 'Pro tip: use .get() whenever a key might be missing.',
  },
  {
    // ⚠️ ASSUMPTION (round 7)
    topic: 'String formatting',
    check: ['Strings', 'Formatting'],
    file: 'greeting.py',
    report:
      'Bug report from Tamale: "The welcome message prints the curly braces instead of the names." Tap the broken line, then pick the fix.',
    code: [
      'def greet(name, city):',
      '    msg = "Hello {name}, welcome to {city}!"',
      '    return msg',
      '',
      'print(greet("Kofi", "Tamale"))',
    ],
    bug: 2,
    fixes: fixes(
      'msg = f"Hello {name}, welcome to {city}!"',
      'msg = "Hello %name, welcome to %city!"',
      'msg = "Hello {}, welcome to {}!"'
    ),
    answer: 0,
    fixed: '    msg = f"Hello {name}, welcome to {city}!"',
    explain:
      'Without the f in front of the quote, Python prints {name} as plain text. f"…" fills the braces with the variables.',
    tip: 'Pro tip: if you can see curly braces in the output, you probably forgot the f.',
  },
  {
    // ⚠️ ASSUMPTION (round 8)
    topic: 'String formatting',
    check: ['Strings', 'Formatting'],
    file: 'price_label.py',
    report:
      'Bug report from Wa: "A price of 12.5 shows up as GH₵12, not GH₵12.50." Tap the broken line, then pick the fix.',
    code: ['def show_price(price):', '    return f"GH₵{price:.2}"', '', 'print(show_price(12.5))'],
    bug: 2,
    fixes: fixes('return f"GH₵{price:.2f}"', 'return f"GH₵{price:2}"', 'return f"GH₵{price:.f2}"'),
    answer: 0,
    fixed: '    return f"GH₵{price:.2f}"',
    explain:
      '.2 keeps two significant digits, so 12.5 becomes 12. .2f keeps two decimals, so you get 12.50.',
    tip: 'Pro tip: .2f means "two digits after the point". Memorise it for money.',
  },
];

/*
 * Figma frame seeds (?f=GS02 / GS03 / GS12). `round` is the 0-based index; `results` are the finished rounds; `seconds` the
 * drawn clock; `frozen` keeps the clock still until the player acts.
 */
export const BUG_FRAMES = {
  GS02: {
    round: 3,
    results: ['ok', 'ok', 'ok'],
    lives: 2,
    combo: 3,
    tapped: 4,
    picked: 0,
    phase: 'playing',
    seconds: 38,
  },
  GS03: {
    round: 3,
    results: ['ok', 'ok', 'ok', 'ok'],
    lives: 2,
    combo: 4,
    tapped: 4,
    picked: 0,
    phase: 'squashed',
    seconds: 38,
    squashedIn: 19,
    gain: 15,
  },
  GS12: {
    round: 3,
    results: ['ok', 'ok', 'ok', 'ok', 'ok', 'bad', 'ok', 'ok'],
    lives: 2,
    combo: 4,
    tapped: 4,
    picked: 0,
    phase: 'finished',
    seconds: 38,
    squashedIn: 19,
    gain: 15,
    // Drawn results modal (SL-GS12): the dots there differ from the strip (Figma inconsistency, kept as drawn).
    modal: {
      dots: ['ok', 'ok', 'bad', 'ok', 'ok', 'ok', 'ok', 'ok'],
      earned: 120,
      topics: [
        { label: 'Off-by-one loops', qs: 'Rounds 1, 4', strong: true },
        { label: 'Dictionaries', qs: 'Rounds 2, 6', strong: true },
        { label: 'String formatting', qs: 'Rounds 3, 7, 8', strong: true },
        { label: 'Mutable default arguments', qs: 'Round 5', strong: false },
      ],
    },
  },
};
