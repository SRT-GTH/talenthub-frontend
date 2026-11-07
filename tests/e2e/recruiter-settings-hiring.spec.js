import { test, expect as baseExpect } from '@playwright/test';

// The dev server is shared and the first load of a lazy route is slow: give every check room.
const expect = baseExpect.configure({ timeout: 30_000 });
test.beforeEach(() => test.slow());

/*
 * Recruiter - Settings & Account (Figma file OHG2xsfCCskT8xEn356njv, canvas 10161:75722), the hiring side: Hiring preferences SR-08 / SR-09 / SR-15, hiring paused SR-19,
 * Notifications SR-10 / SR-21, Plan and billing SR-11, Accessibility SR-12 / SR-22. Every frame opens by URL with mock data (see wiki/recruiter-settings-hiring.md).
 */
const BASE = '/recruiter/settings';
const open = async (page, query) => {
  await page.goto(`${BASE}?${query}`);
  await expect(page.getByRole('heading', { name: 'Settings', level: 1 })).toBeVisible();
};

test('SR-08 Hiring preferences: cards, rows, unsaved hint and the switches', async ({ page }) => {
  await open(page, 'tab=hiring');
  await expect(page.getByRole('heading', { name: 'Defaults for new jobs' })).toBeVisible();
  await expect(
    page.getByText('Pre-filled every time you create a job. You can change them per job.')
  ).toBeVisible();
  await expect(
    page.getByText('Recommended. You can still choose “Unpaid” or “Stipend”.')
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Automatic messages' })).toBeVisible();
  await expect(
    page.getByText('“Thanks for applying to {job} at Silver Rock Technology…”')
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Response goal' })).toBeVisible();
  await expect(page.getByText('Your average this month: 6 hours')).toBeVisible();
  await expect(page.getByText('You have unsaved changes')).toBeVisible();
  // the drawn switches: pay / profile / NSS on, the role-closes message off
  await expect(page.getByRole('switch', { name: 'Always show pay on postings' })).toHaveAttribute(
    'aria-checked',
    'true'
  );
  await expect(page.getByRole('switch', { name: 'When a role closes' })).toHaveAttribute(
    'aria-checked',
    'false'
  );
  await page.getByRole('switch', { name: 'Hire NSS graduates and interns' }).click();
  await expect(
    page.getByRole('switch', { name: 'Hire NSS graduates and interns' })
  ).toHaveAttribute('aria-checked', 'false');
  // a dropdown can be operated
  await page.getByRole('combobox', { name: /Default location/ }).click();
  await page.getByRole('option', { name: 'Kumasi, Ashanti' }).click();
  await expect(page.getByRole('combobox', { name: /Default location/ })).toContainText(
    'Kumasi, Ashanti'
  );
});

test('SR-09 editor: opens by URL, inserts a token, previews, saves into the row, Cancel / Esc close it', async ({
  page,
}) => {
  await open(page, 'tab=hiring&modal=auto-message');
  const dialog = page.getByRole('dialog', { name: 'When someone applies' });
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByText('Sent automatically, right after a candidate applies.')
  ).toBeVisible();
  await expect(dialog.getByText('PREVIEW · AS AMA SEES IT')).toBeVisible();
  await expect(
    dialog.getByText('Hi Ama, thanks for applying to Senior UX Designer at Silver Rock Technology.')
  ).toBeVisible();
  const area = dialog.getByRole('textbox', { name: /Message/ });
  await area.fill('Hello {first name}');
  await dialog.getByRole('button', { name: 'Insert {company}' }).click();
  await expect(area).toHaveValue(/\{company\}$/);
  await expect(dialog.getByText('Hello Ama').first()).toBeVisible();
  await dialog.getByRole('button', { name: 'Reset to default' }).click();
  await expect(area).toHaveValue(/^Hi \{first name\}, thanks for applying/);
  await area.fill('Hi {first name}, we got your application.');
  await dialog.getByRole('button', { name: 'Save message' }).click();
  await expect(page).not.toHaveURL(/modal=/);
  await expect(page.getByText('“Hi {first name}, we got your application.”')).toBeVisible();
  await expect(page.getByText('You have unsaved changes')).toBeVisible();
  // Edit buttons reopen the dialog, Cancel and Esc close it
  await page.getByRole('button', { name: 'Edit “When someone applies”' }).click();
  await expect(page).toHaveURL(/modal=auto-message/);
  await page.getByRole('dialog').getByRole('button', { name: 'Cancel' }).click();
  await expect(page).not.toHaveURL(/modal=/);
  await page.getByRole('button', { name: 'Edit “When you move someone forward”' }).click();
  await expect(page.getByRole('dialog', { name: 'When you move someone forward' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('SR-15 saved: Save changes shows the toast and clears the hint, Cancel restores', async ({
  page,
}) => {
  await open(page, 'tab=hiring');
  await page.getByRole('switch', { name: 'Always show pay on postings' }).click();
  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(page.getByRole('switch', { name: 'Always show pay on postings' })).toHaveAttribute(
    'aria-checked',
    'true'
  );
  await expect(page.getByRole('switch', { name: 'When a role closes' })).toHaveAttribute(
    'aria-checked',
    'true'
  );
  await expect(page.getByText('You have unsaved changes')).toHaveCount(0);
  await page.getByRole('button', { name: 'Save changes' }).click();
  await expect(page).toHaveURL(/toast=saved/);
  await expect(page.getByText('Success - Hiring preferences saved').first()).toBeVisible();
  await expect(page.getByText('New jobs will use these defaults').first()).toBeVisible();
  await page.getByRole('button', { name: 'Dismiss' }).click();
  await expect(page).not.toHaveURL(/toast=/);
  // the frame URL itself: everything already saved, "When a role closes" off, no hint
  await open(page, 'tab=hiring&toast=saved');
  await expect(page.getByText('Success - Hiring preferences saved').first()).toBeVisible();
  await expect(page.getByText('You have unsaved changes')).toHaveCount(0);
  await expect(page.getByRole('switch', { name: 'When a role closes' })).toHaveAttribute(
    'aria-checked',
    'false'
  );
});

test('SR-19 hiring paused: the banner on any tab, the toast, Resume hiring and Undo', async ({
  page,
}) => {
  await open(page, 'tab=language&hiring=paused&toast=hiring-paused');
  await expect(page.getByText('Hiring is paused at Silver Rock Technology')).toBeVisible();
  await expect(
    page.getByText(
      'Your 2 live jobs are hidden from Opportunities. Pipelines and messages keep working.'
    )
  ).toBeVisible();
  await expect(page.getByText('Success - Hiring paused').first()).toBeVisible();
  await expect(page.getByText('2 jobs hidden from talent').first()).toBeVisible();
  await page.getByRole('button', { name: 'Undo' }).click();
  await expect(page).not.toHaveURL(/hiring=paused/);
  await expect(page.getByText('Hiring is paused at Silver Rock Technology')).toHaveCount(0);
  await open(page, 'tab=hiring&hiring=paused');
  await expect(page.getByRole('heading', { name: 'Defaults for new jobs' })).toBeVisible();
  await page.getByRole('button', { name: 'Resume hiring' }).click();
  await expect(page).not.toHaveURL(/hiring=paused/);
  await expect(page.getByText('Hiring is paused at Silver Rock Technology')).toHaveCount(0);
});

test('SR-10 / SR-21 Notifications: the matrix, the draft, pausing and resuming', async ({
  page,
}) => {
  await open(page, 'tab=notifications');
  await expect(page.getByRole('heading', { name: 'What we tell you about' })).toBeVisible();
  for (const text of [
    'New applicants',
    'Messages from candidates',
    'Interview reminders',
    'Offer responses',
    'Jobs closing soon',
    'Daily hiring digest',
    'Hiring streak reminders',
  ]) {
    await expect(page.getByText(text, { exact: true }).first()).toBeVisible();
  }
  await expect(page.getByText('9:00 PM – 7:00 AM')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Save changes' })).toBeDisabled();
  await expect(page.getByRole('switch', { name: 'New applicants, SMS' })).toHaveAttribute(
    'aria-checked',
    'false'
  );
  await page.getByRole('switch', { name: 'New applicants, SMS' }).click();
  await expect(page.getByRole('switch', { name: 'New applicants, SMS' })).toHaveAttribute(
    'aria-checked',
    'true'
  );
  await expect(page.getByText('You have unsaved changes')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Save changes' })).toBeEnabled();
  await page.getByRole('button', { name: 'Save changes' }).click();
  await expect(page.getByText('Saved', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Save changes' })).toBeDisabled();
  await page.getByRole('switch', { name: 'Quiet hours' }).click();
  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(page.getByRole('switch', { name: 'Quiet hours' })).toHaveAttribute(
    'aria-checked',
    'true'
  );
  // pause by clicking, resume by the banner link; the frame URL itself shows the banner
  await page.getByRole('button', { name: 'Pause for 24 hours' }).click();
  await expect(page).toHaveURL(/state=paused/);
  await expect(page.getByText('Notifications paused until tomorrow, 9:00 AM')).toBeVisible();
  await expect(page.getByText('Interview reminders still come through.')).toBeVisible();
  await page.getByRole('button', { name: 'Resume now' }).click();
  await expect(page).not.toHaveURL(/state=paused/);
  await open(page, 'tab=notifications&state=paused');
  await expect(page.getByText('Notifications paused until tomorrow, 9:00 AM')).toBeVisible();
});

test('SR-11 Plan and billing: plan, usage bars, payment method and invoices', async ({ page }) => {
  await open(page, 'tab=billing');
  await expect(page.getByRole('heading', { name: 'Your plan' })).toBeVisible();
  await expect(page.getByText('Professional', { exact: true })).toBeVisible();
  await expect(page.getByText('Renews 1 Nov 2026')).toBeVisible();
  await expect(page.getByText('GHS 450 / month · billed monthly')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Compare plans' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Upgrade', exact: true }).first()).toBeVisible();
  await expect(page.getByRole('progressbar', { name: 'Job posts used' })).toHaveAttribute(
    'aria-valuenow',
    '3'
  );
  await expect(page.getByRole('progressbar', { name: 'Invites (InMails) used' })).toHaveAttribute(
    'aria-valuenow',
    '33'
  );
  await expect(page.getByRole('progressbar', { name: 'Team seats used' })).toHaveAttribute(
    'aria-valuemax',
    '10'
  );
  await expect(page.getByText('Resets on 1 Nov')).toBeVisible();
  await expect(page.getByText('MTN Mobile Money · •••• 4521')).toBeVisible();
  await expect(page.getByText('Default', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Change' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Invoices' })).toBeVisible();
  for (const date of ['1 Oct 2026', '1 Sep 2026', '1 Aug 2026']) {
    await expect(page.getByText(date, { exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: `Download invoice ${date}` })).toBeVisible();
  }
  await expect(page.getByText('GHS 450.00')).toHaveCount(3);
});

test('SR-12 / SR-22 Accessibility: Focused-mode banner, text size, switches, unsaved bar', async ({
  page,
}) => {
  await open(page, 'tab=accessibility');
  await expect(page.getByText('Recruiter accounts always use Focused mode')).toBeVisible();
  await expect(page.getByText('Playful mode is only available to talent.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Reading and display' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Reading support' })).toBeVisible();
  await expect(page.getByRole('radio', { name: 'Default' })).toHaveAttribute(
    'aria-checked',
    'true'
  );
  await expect(page.getByRole('button', { name: 'Save changes' })).toBeDisabled();
  await expect(page.getByRole('switch', { name: 'High contrast' })).toHaveAttribute(
    'aria-checked',
    'false'
  );
  await expect(page.getByRole('switch', { name: 'Keyboard shortcuts' })).toHaveAttribute(
    'aria-checked',
    'true'
  );
  // changing a setting is an unsaved change; the URL follows; Cancel undoes it
  await page.getByRole('switch', { name: 'High contrast' }).click();
  await expect(page).toHaveURL(/state=unsaved/);
  await expect(page.getByText('You have unsaved changes')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Save changes' })).toBeEnabled();
  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(page).not.toHaveURL(/state=unsaved/);
  await expect(page.getByRole('switch', { name: 'High contrast' })).toHaveAttribute(
    'aria-checked',
    'false'
  );
  await page.getByRole('radio', { name: 'Large', exact: true }).click();
  await expect(page.getByRole('radio', { name: 'Large', exact: true })).toHaveAttribute(
    'aria-checked',
    'true'
  );
  await page.getByRole('button', { name: 'Save changes' }).click();
  await expect(page.getByText('Saved', { exact: true })).toBeVisible();
  // the frame URL: High contrast already on, the unsaved bar showing
  await open(page, 'tab=accessibility&state=unsaved');
  await expect(page.getByRole('switch', { name: 'High contrast' })).toHaveAttribute(
    'aria-checked',
    'true'
  );
  await expect(page.getByText('You have unsaved changes')).toBeVisible();
});
