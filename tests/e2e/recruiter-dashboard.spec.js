import { test, expect as baseExpect } from '@playwright/test';

// The dev server is shared and the first load of a lazy route is slow: give every check room.
const expect = baseExpect.configure({ timeout: 30_000 });
test.beforeEach(() => test.slow());

/*
 * Recruiter dashboard (/recruiter/home, Figma canvas "Recruiter - Dashboard" 10005:38660): every Figma state is reachable by URL, and the main interactions work.
 * See wiki/recruiter-dashboard.md for the frame → URL table.
 */

test('landing: greeting, the six widgets and the workspace rail', async ({ page }) => {
  await page.setViewportSize({ width: 1728, height: 1100 });
  await page.goto('/recruiter/home');
  await expect(page.getByRole('heading', { level: 1, name: /Good evening, Kwame/ })).toBeVisible();
  for (const name of [
    'Active job postings',
    'Verification',
    'Recruitment pipeline',
    'Feedback',
    'Recommended talents',
    'In-demand skills',
  ]) {
    await expect(page.getByRole('heading', { name, level: 2 })).toBeVisible();
  }
  await expect(page.getByRole('navigation', { name: 'Recruiter' })).toBeVisible();
  await expect(page.getByText('Professional plan')).toBeVisible();
});

test('the earlier "get you ready" home stays reachable', async ({ page }) => {
  await page.goto('/recruiter/home?view=setup');
  await expect(page.getByText("Let's Get You Ready")).toBeVisible();
});

test('org switcher: opens, switches to Hubtel with a loading state and an Undo toast', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1728, height: 1100 });
  await page.goto('/recruiter/home?panel=org');
  await expect(page.getByRole('menu', { name: 'Your organisations' })).toBeVisible();
  await page.getByRole('menuitemradio', { name: /Hubtel Ltd/ }).click();
  await expect(page).toHaveURL(/org=hubtel/);
  await expect(page.getByText(/Switched to Hubtel Ltd/).first()).toBeVisible();
  await page.getByRole('button', { name: 'Undo' }).click();
  await expect(page).toHaveURL(/org=mtn/);
});

test('single affiliation has no switcher; pending is read-only; no affiliation shows the link card', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1728, height: 1100 });
  await page.goto('/recruiter/home?org=single');
  await expect(page.getByRole('banner').getByTestId('org-switcher-single')).toBeVisible();
  await page.goto('/recruiter/home?org=pending');
  await expect(page.getByText('Affiliation pending — read-only')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Upload missing documents' })).toBeDisabled();
  await page.goto('/recruiter/home?org=none');
  await expect(page.getByText('Link your profile to an organisation')).toBeVisible();
  await expect(page.getByText('No organisation linked')).toBeVisible();
});

test('jobs: the row menu leads to the pause dialog, which pauses the job with an Undo toast', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1728, height: 1100 });
  await page.goto('/recruiter/home');
  await page.getByRole('button', { name: 'More actions for Marketing Intern' }).click();
  await page.getByRole('menuitem', { name: /Pause/ }).click();
  await expect(page.getByRole('dialog', { name: 'Pause Marketing Intern?' })).toBeVisible();
  await page.getByRole('button', { name: 'Pause job' }).click();
  await expect(
    page.getByText('Marketing intern is paused. Hidden from talents. 45 applicants kept').first()
  ).toBeVisible();
  await expect(page.getByText('Paused', { exact: true })).toBeVisible();
});

test('jobs: close dialog needs a reason (Position filled preselected)', async ({ page }) => {
  await page.setViewportSize({ width: 1728, height: 1100 });
  await page.goto('/recruiter/home?dialog=close&job=marketing-intern');
  const dialog = page.getByRole('dialog', { name: 'Close Marketing Intern?' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('radio', { name: 'Position filled' })).toBeChecked();
});

test('jobs empty, suspended and error states replace the table', async ({ page }) => {
  await page.setViewportSize({ width: 1728, height: 1100 });
  for (const [state, title] of [
    ['empty', 'No active jobs — post your first opportunity'],
    ['suspended', 'This organisation is currently suspended'],
    ['error', "We couldn't load your jobs"],
  ]) {
    await page.goto(`/recruiter/home?jobs=${state}`);
    await expect(page.getByRole('heading', { name: title })).toBeVisible();
    await expect(page.getByRole('table', { name: 'Active job postings' })).toHaveCount(0);
  }
});

test('talents: invite dialog sends, the anonymised card explains itself, empty and loading states', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1728, height: 1100 });
  await page.goto('/recruiter/home?dialog=invite&talent=akua');
  const dialog = page.getByRole('dialog', { name: 'Invite Akua Mensah to apply' });
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: 'Send invite' }).click();
  await expect(page.getByText('Success - Invite sent to Akua Mensah').first()).toBeVisible();

  await page.goto('/recruiter/home');
  await page.getByRole('button', { name: 'Why is this identity hidden?' }).click();
  await expect(page.getByText('Identity hidden', { exact: true })).toBeVisible();

  await page.goto('/recruiter/home?talents=empty');
  await expect(
    page.getByText('Refine your job descriptions to unlock better matches')
  ).toBeVisible();
  await page.goto('/recruiter/home?talents=loading');
  await expect(page.getByText('Loading recommended talents…')).toBeAttached();
});

test('funnel: the 7-day window changes the numbers; a stage opens the drill-in drawer', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1728, height: 1100 });
  await page.goto('/recruiter/home?window=7d');
  await expect(page.getByRole('button', { name: 'Applied: 14 candidates' })).toBeVisible();
  await page.goto('/recruiter/home');
  await page.getByRole('button', { name: 'Interview: 8 candidates' }).click();
  const drawer = page.getByRole('dialog', { name: 'Interview stage candidates' });
  await expect(drawer.getByText('Elena Sterling')).toBeVisible();
  await expect(drawer.getByRole('link', { name: /Open in Application Pipeline/ })).toBeVisible();
});

test('verification: verified, rejected (cooldown) and not-an-owner variants', async ({ page }) => {
  await page.setViewportSize({ width: 1728, height: 1100 });
  await page.goto('/recruiter/home?verify=verified');
  await expect(page.getByText('Verified recruiter')).toBeVisible();
  await page.goto('/recruiter/home?verify=rejected');
  await expect(page.getByText('Why it was rejected')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Re-upload available in 18h' })).toBeDisabled();
  await page.goto('/recruiter/home?verify=owner');
  await expect(
    page.getByText('Only org owners can upload KYB documents', { exact: true })
  ).toBeVisible();
  await page.goto('/recruiter/home');
  await page.getByRole('button', { name: 'Upload missing documents' }).click();
  await expect(page.getByRole('dialog', { name: 'Upload KYB documents' })).toBeVisible();
});

test('heat map: Upper West has too little data and Tamale · Agriculture has no signal', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1728, height: 1100 });
  await page.goto('/recruiter/home?region=upper-west');
  await expect(page.getByText('Not enough activity in this region yet')).toBeVisible();
  await page.getByRole('button', { name: 'Switch to National view' }).click();
  await expect(page).toHaveURL(/region=national/);
  await expect(page.getByText('Agronomist')).toBeVisible();
  await page.goto('/recruiter/home?region=tamale&industry=agriculture');
  await expect(page.getByText('No agriculture demand signal yet for Tamale')).toBeVisible();
});

test('feedback: the form blocks a short note and sends a good one', async ({ page }) => {
  await page.setViewportSize({ width: 1728, height: 1100 });
  await page.goto('/recruiter/home?feedback=mine');
  await expect(page.getByText('From 12 candidate ratings · raters stay anonymous')).toBeVisible();
  await page.goto('/recruiter/home?dialog=feedback&candidate=elena&draft=short');
  const dialog = page.getByRole('dialog', { name: 'Feedback for Elena Sterling' });
  await expect(dialog.getByText('Tell us more — minimum 20 characters')).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Submit feedback' })).toBeDisabled();
  await dialog
    .getByRole('textbox')
    .fill('Clear answers, great structure and thoughtful questions about the team.');
  await expect(dialog.getByRole('button', { name: 'Submit feedback' })).toBeEnabled();
  await dialog.getByRole('button', { name: 'Submit feedback' }).click();
  await expect(page.getByText('Success - Feedback sent to Elena Sterling').first()).toBeVisible();
  await page.goto('/recruiter/home?withdrew=marcus');
  await expect(page.getByText('Candidate withdrew — feedback no longer required')).toBeVisible();
});

test('top bar: notifications, language and accessibility panels open from the URL and the buttons', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1728, height: 1100 });
  await page.goto('/recruiter/home?panel=notifications');
  await expect(page.getByRole('dialog', { name: 'Notifications' })).toBeVisible();
  await expect(page.getByText('Akua Mensah applied to Junior Accountant')).toBeVisible();
  await page.goto('/recruiter/home?panel=notifications-empty');
  await expect(page.getByText('You’re all caught up')).toBeVisible();
  await page.goto('/recruiter/home?panel=language');
  await expect(page.getByRole('menu', { name: 'Language' })).toBeVisible();
  await expect(page.getByRole('menuitemradio', { name: /Dagbani/ })).toBeDisabled();
  await page.goto('/recruiter/home');
  await page.getByRole('button', { name: 'Accessibility mode' }).click();
  await expect(page.getByText('High contrast')).toBeVisible();
});

test('top bar: global search shows recents, results for "Akua" and the no-results card', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1728, height: 1100 });
  await page.goto('/recruiter/home?panel=search');
  const panel = page.getByRole('dialog', { name: 'Search' });
  await expect(panel.getByText('RECENT SEARCHES')).toBeVisible();
  await expect(panel.getByText('Data Analyst in Kumasi')).toBeVisible();
  await page.goto('/recruiter/home?panel=search&q=Akua');
  await expect(panel.getByText('PEOPLE · 2')).toBeVisible();
  await expect(panel.getByText('Akua Owusu-Ansah')).toBeVisible();
  await page.goto('/recruiter/home?panel=search&q=Zxqy');
  await expect(panel.getByText('No results for “Zxqy”')).toBeVisible();
  await page.goto('/recruiter/home');
  await page.getByPlaceholder('Search opportunities, skills, communities...').fill('Akua');
  await expect(page.getByRole('dialog', { name: 'Search' }).getByText('PEOPLE · 2')).toBeVisible();
});

test('responsive: no horizontal scroll at 320 and 390', async ({ page }) => {
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 900 });
    for (const url of [
      '/recruiter/home',
      '/recruiter/home?org=pending',
      '/recruiter/home?feedback=mine',
    ]) {
      await page.goto(url);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      const overflow = await page.evaluate(() => {
        const main = document.querySelector('main');
        return main.scrollWidth - main.clientWidth;
      });
      expect(overflow, `${url} at ${width}px`).toBeLessThanOrEqual(1);
    }
  }
});
