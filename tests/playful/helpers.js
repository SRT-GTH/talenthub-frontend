// Shared helpers for Playful state setups (Career Buddy, talent role, 1728x1117).
export const BASE = process.env.AUDIT_BASE ?? 'http://127.0.0.1:5199';
export const CB = '/profile/filling/career-buddy';

/** Freeze motion so geometry/screenshots are deterministic. */
export async function settle(page, ms = 600) {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page
    .addStyleTag({
      content: `*,*::before,*::after{animation-duration:0s!important;animation-delay:0s!important;transition-duration:0s!important;transition-delay:0s!important;caret-color:transparent!important}`,
    })
    .catch(() => {});
  await page.evaluate(() => document.fonts && document.fonts.ready).catch(() => {});
  await page.waitForTimeout(ms);
}

export async function open(page, query = '') {
  await page.goto(`${BASE}${CB}${query}`, { waitUntil: 'load' });
  await page
    .waitForSelector('[data-route-fallback]', { state: 'detached', timeout: 20000 })
    .catch(() => {});
  await page.waitForTimeout(1500);
}

/** Click a visible button/chip whose text contains `text`. */
export async function clickText(page, text, { last = false, wait = 1500 } = {}) {
  const loc = page.locator('button, [role=button]', { hasText: text });
  await loc
    .first()
    .waitFor({ state: 'visible', timeout: 12000 })
    .catch(() => {});
  const n = await loc.count();
  if (!n) throw new Error(`clickText: no button "${text}"`);
  let target = last ? loc.last() : loc.first();
  for (let i = n - 1; i >= 0 && last; i--)
    if (await loc.nth(i).isVisible()) {
      target = loc.nth(i);
      break;
    }
  await target.click();
  await quiet(page, 700);
  await page.waitForTimeout(wait / 3);
}

/** Wait until body text/button count stops changing (scripted bot replies are async). */
export async function quiet(page, ms = 900, max = 9000) {
  const start = Date.now();
  let last = '';
  let since = Date.now();
  while (Date.now() - start < max) {
    const cur = await page.evaluate(
      () => document.body.innerText.length + ':' + document.querySelectorAll('button').length
    );
    if (cur !== last) {
      last = cur;
      since = Date.now();
    } else if (Date.now() - since >= ms) return;
    await page.waitForTimeout(150);
  }
}

/** Type a free-text reply into the composer and send. */
export async function say(page, text, wait = 1800) {
  const box = page.getByPlaceholder('Write a message…');
  await box.waitFor({ state: 'visible', timeout: 12000 });
  await box.click();
  await box.fill(text);
  await page.keyboard.press('Enter');
  await quiet(page, 900);
  await page.waitForTimeout(wait / 4);
}

/** Welcome -> FAQ chip -> ready -> Education Q&A (5 answers) up to the confirm panel. */
export async function toEducationReview(page) {
  await open(page);
  await clickText(page, 'Tell me more about GTH', { last: true });
  await clickText(page, "I think I'm ready now");
  await clickText(page, 'Sounds great');
  for (const a of [
    'University of Cape Coast',
    'Software engineering',
    '2018 to 2022',
    'Second Class Upper',
    'Yes, attached',
  ])
    await say(page, a);
}

/** Click the panel Confirm twice (1st save errors by design -> error toast; 2nd succeeds -> success toast + milestone dialog). */
export async function confirmPanel(page, { stopAfterError = false, keepMilestone = false } = {}) {
  await clickText(page, 'Confirm', { wait: 1800 });
  if (stopAfterError) return;
  await clickText(page, 'Confirm', { wait: 1800 });
  if (!keepMilestone) {
    const keep = page.getByText('No, keep this private');
    if (await keep.count()) await keep.first().click();
    await page.waitForTimeout(500);
  }
}

/** Education confirmed -> Interests Q&A -> up to the interests review panel. */
export async function toInterestsReview(page) {
  await toEducationReview(page);
  await confirmPanel(page);
  await clickText(page, "I'd love to talk about that");
  for (const a of ['Technology and programming', 'Coding and chess', 'Software development'])
    await say(page, a);
}

/** Interests confirmed -> personality chip -> mode picker (Games / MCQs / Open Chat cards). */
export async function toModePicker(page) {
  await toInterestsReview(page);
  await confirmPanel(page);
  await clickText(page, "I'd love to talk about that"); // personality-prompt chip -> picker
}

/** Pick a mode card by its title. */
export async function pickMode(page, title) {
  await clickText(page, title, { last: true });
}

/** Click the first option of the current MCQ question, n times. */
export async function answerMcq(page, n = 1) {
  for (let i = 0; i < n; i++) {
    const opts = page.locator('button', { hasText: /^[A-D]\) / });
    const c = await opts.count();
    // last 2-4 visible options belong to the newest question; click the first of the last group
    await opts.nth(Math.max(0, c - (i === 3 ? 2 : i === 2 ? 3 : 4))).click();
    await page.waitForTimeout(1500);
  }
}

export async function toMcqAwaiting(page) {
  await toModePicker(page);
  await pickMode(page, 'MCQs (Assessment)');
  await answerMcq(page, 4);
}

export async function toOpenChatAwaiting(page) {
  await toModePicker(page);
  await pickMode(page, 'Open Chat');
  for (const a of [
    'I break it into smaller tasks',
    'Independent but collaborative',
    'A bit of both',
  ])
    await say(page, a);
}

export async function toGamesIntro(page) {
  await toModePicker(page);
  await pickMode(page, 'Games');
}

export async function openGameStore(page) {
  await toGamesIntro(page);
  await clickText(page, 'Open Game Store', { wait: 1200 });
}

/** Open Game Store -> details -> Let's Play, then advance with the first choice until stage n (2..4). */
export async function toEscapeStage(page, n) {
  await openGameStore(page);
  await page.getByRole('dialog').getByText('The Escape Room', { exact: true }).first().click();
  await page.waitForTimeout(700);
  await page.getByRole('button', { name: /Let.s Play/ }).click();
  await page.waitForTimeout(1500);
  for (let s = 1; s < n; s++) {
    await page.getByRole('group', { name: 'Choices' }).getByRole('button').first().click();
    await page.waitForTimeout(1800);
  }
  await page.mouse.move(2, 2); // un-hover the last-clicked bubble
  await page.waitForTimeout(300);
}

/** Headless Chromium has no mic: stub getUserMedia with a silent WebAudio stream so voice UIs render their live state. Call BEFORE open(). */
export async function fakeMic(page) {
  await page.addInitScript(() => {
    const md = (navigator.mediaDevices ||= {});
    md.getUserMedia = async () => {
      const ac = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ac.createOscillator();
      const g = ac.createGain();
      g.gain.value = 0.0001;
      const dest = ac.createMediaStreamDestination();
      osc.connect(g).connect(dest);
      osc.start();
      return dest.stream;
    };
  });
}

/** Scroll the right-hand profile panel back to its top (Figma frames show it unscrolled). */
export async function panelTop(page) {
  await page.evaluate(() => {
    const h = [...document.querySelectorAll('h1,h2,h3,p,span,div')].find(
      (e) => e.children.length === 0 && /Your profile, live/.test(e.textContent || '')
    );
    for (let n = h; n; n = n.parentElement) {
      const o = getComputedStyle(n).overflowY;
      if ((o === 'auto' || o === 'scroll') && n.scrollHeight > n.clientHeight) n.scrollTop = 0;
    }
  });
  await page.waitForTimeout(200);
}
