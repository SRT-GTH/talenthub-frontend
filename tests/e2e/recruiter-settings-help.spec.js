import { test, expect as baseExpect } from '@playwright/test';

// The dev server is shared and the first load of a lazy route is slow: give every check room.
const expect = baseExpect.configure({ timeout: 30_000 });
test.beforeEach(() => test.slow());
test.describe.configure({ retries: 1 });
// Desktop frames (1728 wide): the pop-over footer needs a viewport tall enough to show it (at 720px high it sits in the card's scroll area and Playwright cannot settle a click).
test.use({ viewport: { width: 1440, height: 900 } });

/*
 * Recruiter - Settings & Account, the Help set (Figma canvas 10161:75722): R-FB-01, R-IV-01, R-HS-01, R-HP-01 ... R-HP-08.
 * The pop-over, shortcuts and the feedback / invite dialogs open over /recruiter/job-postings (where Figma draws them) and /recruiter/settings;
 * the Help centre pages live on /recruiter/help (HELP_PATH; set HELP_PATH=/_tmp_help.html to run them against a harness while the route is not registered).
 * Wiki: recruiter-settings-help.md.
 */
const JOBS = '/recruiter/job-postings';
const SETTINGS = '/recruiter/settings';
const HELP_PATH = process.env.HELP_PATH ?? '/recruiter/help';
const helpPage = (search = '') => `${HELP_PATH}${search}`;
// Row titles are generated content (`after:content-[attr(data-count)]`), so a row is found by its button name, any other text by text.
const has = (scope, t) =>
  scope
    .getByText(t, { exact: true })
    .or(scope.getByRole('button', { name: t }))
    .first();
// The pop-over search keeps the caret at the end on focus (talent behaviour), so replace the text with select-all + type.
const typeOver = async (input, text) => {
  await input.click();
  await input.press('Control+A');
  await (text ? input.pressSequentially(text) : input.press('Backspace'));
};
const POP = (page) => page.getByRole('dialog', { name: 'Help' });

test('R-HP-01: Help pop-over "For this page" on Job Postings, "?" button toggles it', async ({
  page,
}) => {
  await page.goto(`${JOBS}?help=page`);
  const pop = POP(page);
  await expect(pop.getByRole('heading', { name: 'Help' })).toBeVisible();
  await expect(pop.getByText('Quick answers for the page you are on')).toBeVisible();
  await expect(pop.getByPlaceholder('Search help, e.g. screening')).toBeVisible();
  await expect(pop.getByText('FOR THIS PAGE · JOB POSTINGS')).toBeVisible();
  for (const t of [
    'How do I close or pause a posting?',
    'How does Apply & Filter Pool work?',
    'How do I add a teammate to a job?',
    'POPULAR',
    'A candidate asked me to pay or sent a strange link. What do I do?',
    'How do invites and InMails work?',
    'How do I save screening criteria as a template?',
    'Ask Hiring Assistant',
    'WhatsApp us',
    'Replay the recruiter tour',
    'Help centre',
  ]) {
    await expect(has(pop, t)).toBeVisible();
  }
  await expect(pop.getByText('Shortcuts', { exact: false }).first()).toBeVisible();
  // the page still works behind it (existing behaviour kept)
  await expect(page.getByRole('heading', { name: /Job\s*Postings/ }).first()).toBeVisible();
  await pop.getByRole('button', { name: 'Close help' }).click();
  await expect(pop).toHaveCount(0);
  expect(page.url()).not.toContain('help=');
  await page.getByRole('button', { name: 'Help', exact: true }).click();
  await expect(page).toHaveURL(/help=page/);
  await expect(POP(page)).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(POP(page)).toHaveCount(0);
});

test('R-HP-02 / 03: searching and no results, typing rewrites help + q', async ({ page }) => {
  await page.goto(`${JOBS}?help=searching&q=fee`);
  const pop = POP(page);
  await expect(pop.getByText('Search every help article')).toBeVisible();
  await expect(pop.getByText('3 RESULTS FOR “FEE”')).toBeVisible();
  await expect(
    pop.getByText('Never pay. Report the chat and we review it within 24 hours.')
  ).toBeVisible();
  await expect(pop.getByText('How does recruiter billing work?')).toBeVisible();
  await expect(pop.getByText('Plans, invites and job post limits')).toBeVisible();
  await expect(pop.getByText('Not what you need?')).toBeVisible();
  const input = pop.getByRole('searchbox', { name: 'Search help' });
  await typeOver(input, 'bulk reject');
  await expect(page).toHaveURL(/help=none/);
  await expect(page).toHaveURL(/q=bulk(%20|\+)reject/);
  await expect(pop.getByText('No answers for “bulk reject” yet')).toBeVisible();
  await expect(
    pop.getByText(
      'Try fewer words, or ask a person. Hiring Assistant can usually help straight away.'
    )
  ).toBeVisible();
  await expect(pop.getByRole('button', { name: 'Contact support' })).toBeVisible();
  await expect(pop.getByRole('button', { name: 'Suggest a help article' })).toBeVisible();
  await typeOver(input, 'screening');
  await expect(page).toHaveURL(/help=searching/);
  await expect(pop.getByText('1 RESULT FOR “SCREENING”')).toBeVisible();
  await typeOver(input, '');
  await expect(page).toHaveURL(/help=page/);
  await expect(pop.getByText('FOR THIS PAGE · JOB POSTINGS')).toBeVisible();
  await page.goto(`${JOBS}?help=none&q=bulk%20reject`);
  await expect(POP(page).getByText('No answers for “bulk reject” yet')).toBeVisible();
});

test('R-HP-08: keyboard shortcuts modal, "?" opens it, the button closes it', async ({ page }) => {
  await page.goto(`${JOBS}?help=shortcuts`);
  const dlg = page.getByRole('dialog', { name: 'Keyboard shortcuts' });
  await expect(dlg).toBeVisible();
  await expect(
    dlg.getByText('Move around GTH without the mouse. Press ? any time to see this.')
  ).toBeVisible();
  for (const t of [
    'EVERYWHERE',
    'Open help',
    'Search GTH',
    'Open notifications',
    'Close pop-ups and modals',
    'GO TO',
    'Talent Search',
    'Job Postings',
    'IN THE PIPELINE',
    'Move to next candidate',
    'Move candidate to next stage',
    'J / K',
  ]) {
    await expect(has(dlg, t)).toBeVisible();
  }
  await dlg.getByRole('button', { name: 'Open candidate' }).click();
  await expect(dlg).toHaveCount(0);
  expect(page.url()).not.toContain('help=');
  await page.goto(JOBS);
  await expect(page.getByRole('heading', { name: /Job\s*Postings/ }).first()).toBeVisible();
  await page.keyboard.press('?');
  await expect(page).toHaveURL(/help=shortcuts/);
  await expect(page.getByRole('dialog', { name: 'Keyboard shortcuts' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog', { name: 'Keyboard shortcuts' })).toHaveCount(0);
});

test('R-FB-01: Send feedback dialog (rating, text, screenshot, send, Esc)', async ({ page }) => {
  await page.goto(`${JOBS}?modal=feedback`);
  const dlg = page.getByRole('dialog', { name: 'Send feedback' });
  await expect(dlg).toBeVisible();
  await expect(dlg.getByText('How is GTH working for you?')).toBeVisible();
  await expect(dlg.getByRole('radio', { name: 'Love it' })).toHaveAttribute('aria-checked', 'true');
  await expect(dlg.getByRole('textbox')).toHaveValue(
    'Screening is great. Please let me reuse criteria across organisations!'
  );
  await expect(dlg.getByText('Include a screenshot of this page')).toBeVisible();
  await dlg.getByRole('radio', { name: 'Okay' }).click();
  await expect(dlg.getByRole('radio', { name: 'Okay' })).toHaveAttribute('aria-checked', 'true');
  await dlg.getByRole('textbox').fill('');
  await expect(dlg.getByRole('button', { name: 'Send feedback' })).toHaveAttribute(
    'aria-disabled',
    'true'
  );
  await dlg.getByRole('textbox').fill('Great');
  await dlg.getByRole('button', { name: 'Send feedback' }).click();
  await expect(dlg).toHaveCount(0);
  expect(page.url()).not.toContain('modal=feedback');
  await page.goto(`${SETTINGS}?modal=feedback`);
  await expect(page.getByRole('dialog', { name: 'Send feedback' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog', { name: 'Send feedback' })).toHaveCount(0);
});

test('R-IV-01: Invite a teammate dialog (copy, share tiles, close)', async ({ page }) => {
  await page.goto(`${JOBS}?modal=invite`);
  const dlg = page.getByRole('dialog', { name: 'Invite a teammate' });
  await expect(dlg).toBeVisible();
  await expect(
    dlg.getByText(
      'They’ll join Silver Rock Technology as a Recruiter. You can change their role in Settings.'
    )
  ).toBeVisible();
  await expect(dlg.getByText('gth.com/recruit/joel-k7')).toBeVisible();
  for (const t of ['WhatsApp', 'Email', 'SMS', 'More', '2 teammates joined with your link']) {
    await expect(dlg.getByText(t, { exact: true })).toBeVisible();
  }
  await dlg.getByRole('button', { name: 'Copy link' }).click();
  await expect(dlg.getByRole('status')).toHaveText('Link copied');
  await dlg.getByRole('button', { name: 'Close' }).click();
  await expect(dlg).toHaveCount(0);
  expect(page.url()).not.toContain('modal=invite');
  await page.goto(`${SETTINGS}?modal=invite`);
  await expect(page.getByRole('dialog', { name: 'Invite a teammate' })).toBeVisible();
});

test('the pop-over works on /recruiter/settings and a Help-centre value redirects to /recruiter/help', async ({
  page,
}) => {
  await page.goto(`${SETTINGS}?help=page`);
  const pop = POP(page);
  await expect(pop.getByText('FOR THIS PAGE · SETTINGS')).toBeVisible();
  await expect(has(pop, 'How do I close or pause a posting?')).toBeVisible();
  await page.goto(`${SETTINGS}?help=searching&q=fee`);
  await expect(POP(page).getByText('3 RESULTS FOR “FEE”')).toBeVisible();
  await page.goto(`${SETTINGS}?tab=team&help=article`);
  await expect(page).toHaveURL(/\/recruiter\/help\?help=article/);
});

test('pop-over rows and footer lead into the Help centre', async ({ page }) => {
  await page.goto(`${JOBS}?help=page`);
  await POP(page)
    .getByRole('button', {
      name: 'A candidate asked me to pay or sent a strange link. What do I do?',
    })
    .click();
  await expect(page).toHaveURL(/\/recruiter\/help\?help=article/);
  await page.goto(`${JOBS}?help=none&q=bulk%20reject`);
  await POP(page).getByRole('button', { name: 'Contact support' }).click();
  await expect(page).toHaveURL(/\/recruiter\/help\?help=contact/);
  await page.goto(`${JOBS}?help=page`);
  await POP(page).getByRole('button', { name: 'Help centre' }).click();
  await expect(page).toHaveURL(/\/recruiter\/help$/);
});

test('R-HS-01: Help and support page (topics, FAQ, contacts, requests, safety card)', async ({
  page,
}) => {
  await page.goto(helpPage());
  await expect(page.getByRole('heading', { name: 'Help and support', level: 1 })).toBeVisible();
  await expect(
    page.getByText('Answers in plain language, and real people when you need them.')
  ).toBeVisible();
  await expect(
    page.getByPlaceholder('Search help, for example “screening criteria”')
  ).toBeVisible();
  for (const t of [
    'Your recruiter profile',
    'Photo, title, company page',
    'Pipeline and candidates',
    'Stages, interviews, offers',
    'Hiring under-18s and NSS',
    'Parent consent, internship rules',
    'Account and security',
    'Popular questions',
    'Why can’t I see a candidate’s match score?',
    'Talk to us',
    'Ask Hiring Assistant',
    'Instant answers, any time',
    'WhatsApp support',
    'Weekdays 8 am to 6 pm',
    'Email us',
    'Reply within 1 working day',
    'Call us',
    '030 222 0000 · toll free',
    'Your requests',
    'KYB documents still in review',
    '#GTH-2291 · 2 days ago',
    'Answered',
    'GTH never asks recruiters to pay outside Billing',
    'If anyone asks for money, a fee or your MoMo PIN, report them from the chat.',
  ]) {
    await expect(has(page, t)).toBeVisible();
  }
  await expect(
    page.getByText('Fit scores show once your profile reaches Discoverable (3 of 9 stages).', {
      exact: false,
    })
  ).toBeVisible();
  // FAQ accordion: the answered question toggles closed
  await page.getByRole('button', { name: 'Why can’t I see a candidate’s match score?' }).click();
  await expect(page.getByText('Fit scores show once your profile', { exact: false })).toHaveCount(
    0
  );
  // typing in the page search opens the pop-over (it takes the focus), where the query is finished
  await page.getByRole('searchbox', { name: 'Search help' }).first().click();
  await page.keyboard.press('f');
  await expect(page).toHaveURL(/help=searching/);
  await typeOver(POP(page).getByRole('searchbox', { name: 'Search help' }), 'fee');
  await expect(POP(page).getByText('3 RESULTS FOR “FEE”')).toBeVisible();
  await page.keyboard.press('Escape');
  await page
    .getByRole('button', {
      name: 'A candidate asked me to pay or sent a strange link. What do I do?',
    })
    .click();
  await expect(page).toHaveURL(/help=article/);
});

test('R-HP-04 / 07: article and the Report a problem modal', async ({ page }) => {
  await page.goto(helpPage('?help=article'));
  await expect(page.getByRole('heading', { name: 'Help centre', level: 1 })).toBeVisible();
  await expect(page.getByText('Safety  ·  A candidate asked for payment').first()).toBeVisible();
  await expect(
    page.getByRole('heading', {
      name: 'A candidate asked me to pay or sent a strange link. What do I do?',
    })
  ).toBeVisible();
  for (const t of [
    'Fees and scams',
    'Updated 12 Oct 2026  ·  2 min read',
    'GTH never asks recruiters to pay outside Billing',
    'Candidates never need to pay, and you never need to pay to see a CV. If anyone asks for money or your MoMo PIN, it is a scam.',
    'What to do',
    'Don’t pay or share your MoMo PIN',
    'Report the chat',
    'Block them',
    'We review within 24 hours',
    'Already paid? Call your mobile money provider straight away, then report the profile so we can stop it happening to other recruiters.',
    'Was this helpful?',
    'RELATED',
    'How to spot a fake candidate profile',
    'Still stuck?',
    'Talk to the Hiring Assistant or our recruiter support team.',
    'Did this happen to you?',
    'Report the profile. It takes 30 seconds and protects other recruiters.',
  ]) {
    await expect(has(page, t)).toBeVisible();
  }
  await page.getByRole('button', { name: 'Report a problem' }).first().click();
  await expect(page).toHaveURL(/help=report/);
  const dlg = page.getByRole('dialog', { name: 'Report a problem' });
  await expect(dlg).toBeVisible();
  await expect(dlg.getByText('“Kwame A.” · applicant · Senior UX Designer')).toBeVisible();
  await expect(dlg.getByRole('radio', { name: 'Asked me to pay money' })).toHaveAttribute(
    'aria-checked',
    'true'
  );
  await expect(dlg.getByRole('radio', { name: 'Fake profile or documents' })).toBeVisible();
  await expect(dlg.getByRole('textbox')).toHaveValue(
    'He said I must pay GHS 200 to “unlock” his CV before the interview.'
  );
  await expect(dlg.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  await dlg.getByRole('radio', { name: 'Something else' }).click();
  await expect(dlg.getByRole('radio', { name: 'Something else' })).toHaveAttribute(
    'aria-checked',
    'true'
  );
  await dlg.getByRole('switch').click();
  await expect(dlg.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
  await dlg.getByRole('button', { name: 'Cancel' }).click();
  await expect(dlg).toHaveCount(0);
  await expect(page).toHaveURL(/help=article/);
  await page.goto(helpPage('?help=report'));
  await expect(page.getByRole('dialog', { name: 'Report a problem' })).toBeVisible();
});

test('R-HP-05 / 06: Contact support and Request sent', async ({ page }) => {
  await page.goto(helpPage('?help=contact'));
  await expect(page.getByRole('heading', { name: 'Contact support', level: 1 })).toBeVisible();
  await expect(
    page.getByText(
      'A real person from our Accra team replies within 1 working day. Usually faster on WhatsApp.'
    )
  ).toBeVisible();
  for (const t of [
    'What is it about?',
    'Account',
    'Pipeline and candidates',
    'Payments or fees',
    'Safety',
    'Something else',
    'Add screenshots (optional)',
    'PNG or JPG, up to 5 MB each. Screenshots of the chat help us act faster.',
    'chat-screenshot.png',
    '240 KB',
    'How should we reply?',
    'In the app',
    'WhatsApp',
    'Email',
    'Include my device and browser info (helps us fix bugs)',
    'Before you send',
    'These might answer it straight away:',
    'KYB documents still in review',
  ]) {
    await expect(has(page, t)).toBeVisible();
  }
  await expect(page.getByLabel('Subject')).toHaveValue('Candidate asked for a “processing fee”');
  await expect(page.getByLabel('Tell us what happened')).toHaveValue(
    'Someone claiming to be a candidate asked me to pay GHS 200 to “unlock” their CV before the interview.'
  );
  await page.getByRole('button', { name: 'Safety', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Safety', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true'
  );
  await page.getByRole('button', { name: 'Send to support' }).click();
  await expect(page).toHaveURL(/help=sent/);
  const dlg = page.getByRole('dialog');
  await expect(dlg.getByText('Sent. We’re on it.')).toBeVisible();
  await expect(
    dlg.getByText(
      'Request #GTH-2318. A person from our Accra team will reply in the app, usually within a few hours.'
    )
  ).toBeVisible();
  for (const t of ['Sent', 'Reviewing', 'Answered']) {
    await expect(dlg.getByText(t, { exact: true })).toBeVisible();
  }
  await dlg.getByRole('button', { name: 'Back to Help centre' }).click();
  await expect(page).toHaveURL(/\/recruiter\/help$/);
  await page.goto(helpPage('?help=sent'));
  await expect(page.getByRole('button', { name: 'View my requests' })).toBeVisible();
});
