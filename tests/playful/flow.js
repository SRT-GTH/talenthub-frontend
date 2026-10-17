// Reusable drivers for the scripted talent Career Buddy chat (Playful ON, 1728 wide).
// Every step waits for the chat to go quiet (no text change for `ms`) instead of fixed sleeps.
import { open } from './helpers.js';

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

/** Click a button by visible text (prefers the LAST match = the live chat chip, not the hidden hero duplicate). */
export async function chip(page, text, { first = false, wait = true } = {}) {
  const loc = page.locator('button, [role=button]', { hasText: text });
  await loc.first().waitFor({ state: 'visible', timeout: 10000 });
  const n = await loc.count();
  let target = first ? loc.first() : loc.last();
  for (let i = n - 1; i >= 0 && !first; i--) {
    if (await loc.nth(i).isVisible()) {
      target = loc.nth(i);
      break;
    }
  }
  await target.click();
  if (wait) await quiet(page);
}

export async function type(page, text, { send = true, wait = true } = {}) {
  const box = page.getByPlaceholder('Write a message…');
  await box.click();
  await box.fill(text);
  if (send) {
    await page.keyboard.press('Enter');
    if (wait) await quiet(page);
  }
}

export const welcome = (page) => open(page);

export async function toFaq(page, which = 'Tell me more about GTH') {
  await open(page);
  await chip(page, which);
}
export async function toReady(page, which) {
  await toFaq(page, which);
  await chip(page, "I think I'm ready now");
}
export async function toEduStart(page) {
  await toReady(page);
  await chip(page, 'Sounds great');
}
const EDU = [
  'University of Cape Coast',
  'Bachelor of Science in Computer Science',
  'Software engineering',
  '2018 to 2022',
  'Second Class Upper',
];
export async function eduAnswers(page, n = 5) {
  for (const a of EDU.slice(0, n)) await type(page, a);
}
export async function toEduReview(page) {
  await toEduStart(page);
  await eduAnswers(page, 5);
  await type(page, 'Yes, I have a PDF copy');
}
export const panelBtn = async (page, name) => {
  const b = page.getByRole('button', { name, exact: true });
  await b.first().click();
  await quiet(page);
};
/** First Confirm always shows the scripted 'No internet connection' error toast; the second succeeds. */
export async function confirmStage(page, { failOnly = false } = {}) {
  const b = page.getByRole('button', { name: 'Confirm', exact: true });
  await b.first().click();
  await page.waitForTimeout(2600);
  if (failOnly) return;
  if (
    await b
      .first()
      .isVisible()
      .catch(() => false)
  ) {
    await b.first().click();
    await page.waitForTimeout(2600);
  }
  await quiet(page, 1200);
  await dismissMilestone(page);
}
/** 'Milestone unlocked!' share modal appears after each successful section save (not a Playful frame). */
export async function dismissMilestone(page) {
  const k = page.getByText('No, keep this private');
  if (
    await k
      .first()
      .isVisible()
      .catch(() => false)
  ) {
    await k.first().click();
    await quiet(page, 1000);
  }
}
export async function toInterestsStart(page) {
  await toEduReview(page);
  await confirmStage(page);
  await quiet(page, 1500);
  await chip(page, "I'd love to talk about that");
}
const INT = ['technology and programming', 'coding and chess', 'software development'];
export async function toInterestsReview(page) {
  await toInterestsStart(page);
  for (const a of INT) await type(page, a);
}
export async function toPersonality(page) {
  await toInterestsReview(page);
  await confirmStage(page);
  await quiet(page, 1500);
  await chip(page, "I'd love to talk about that");
}
export async function toPersonalityReview(page) {
  await toPersonality(page);
  await chip(page, 'Open Chat');
  for (const a of ['I pause and think', 'independent', 'bit of both']) await type(page, a);
}
export async function toPostPersonality(page) {
  await toPersonalityReview(page);
  await confirmStage(page);
  await quiet(page, 1500);
}
export async function toSectionPicker(page) {
  await toPostPersonality(page);
  await chip(page, 'Continue populating profile');
}
export async function toWorkStart(page) {
  await toSectionPicker(page);
  await chip(page, 'Work Experience', { first: false });
}
const WORK = [
  'Yeah, an internship at CodeBase Ghana',
  'software development intern',
  'an internal dashboard',
  'about 3 months or so',
  'June 2024 to August 2024',
  'teamwork and debugging',
];
export async function workAnswers(page, n = 6) {
  for (const a of WORK.slice(0, n)) await type(page, a);
}
export async function toWorkReview(page) {
  await toWorkStart(page);
  await workAnswers(page, 6);
  await type(page, 'Mr. Kwame Agyapong');
}
export async function toGuidanceAreas(page) {
  await toPostPersonality(page);
  await chip(page, 'I think I need some guidance');
}
export async function toExposureStart(page) {
  await toGuidanceAreas(page);
  await chip(page, 'Career exposure', { first: false });
}
const EXP = [
  'Yes, I volunteered at a coding club',
  'Mentoring more',
  'Yes, that would be great',
  'EdTech sounds interesting',
  'What skills do I need',
  'Of course',
];
export async function exposureAnswers(page, n = 6) {
  for (const a of EXP.slice(0, n)) await type(page, a);
}
export async function toExposureWrap(page) {
  await toExposureStart(page);
  await exposureAnswers(page, 6);
}
export async function toGuidanceReturn(page) {
  await toExposureWrap(page);
  await chip(page, 'Return to your profile setup');
}
export async function modify(page) {
  await page.getByRole('button', { name: 'Modify', exact: true }).first().click();
  await quiet(page, 700);
}
/** Second Confirm succeeds; stop right after the save (panel shows 100%), before the follow-up bot turn. */
export async function confirmSavedOnly(page) {
  const b = page.getByRole('button', { name: 'Confirm', exact: true });
  await b.first().click();
  await page.waitForTimeout(2600);
  await b.first().click();
  await page.waitForTimeout(1300);
  await dismissMilestone(page);
}
export async function chooseVibeFocused(page) {
  await page
    .getByRole('radio', { name: /Focused/ })
    .first()
    .click()
    .catch(async () => page.getByText('Focused', { exact: true }).last().click());
  await page.waitForTimeout(400);
}
