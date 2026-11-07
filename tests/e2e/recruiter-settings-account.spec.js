import { test, expect as baseExpect } from '@playwright/test';

// The dev server is shared and the first load of a lazy route is slow: give every check room.
const expect = baseExpect.configure({ timeout: 30_000 });
test.beforeEach(() => test.slow());

/*
 * Recruiter Settings - Account, Organisation, Team and roles (Figma "Recruiter - Settings & Account" 10161:75722):
 * SR-01 / SR-20 Account, SR-02 Organisation, SR-03 Team and roles, SR-04 / SR-05 Invite teammate, SR-06 Invite sent toast, SR-07 Remove teammate.
 * Every frame opens by URL with mock data (see wiki/recruiter-settings-account.md).
 */
const BASE = '/recruiter/settings';

test('SR-01: Account tab shows the personal details, account type and a disabled Save', async ({
  page,
}) => {
  await page.goto(BASE);
  await expect(page.getByRole('heading', { name: 'Settings', level: 1 })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Personal details' })).toBeVisible();
  await expect(page.getByText('Profile Photo')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Upload new logo' })).toBeVisible();
  await expect(page.getByLabel('Full name')).toHaveValue('Joel Adade Kofie');
  await expect(page.getByLabel('Job title')).toHaveValue('HR Lead');
  await expect(page.getByLabel('Work email')).toHaveValue('joel.kofie@silverrock.tech');
  await expect(page.getByLabel('Phone')).toHaveValue('+233 24 412 3456');
  await expect(page.getByText('Recruiter · Silver Rock Technology')).toBeVisible();
  await expect(
    page.getByText('Dedicated recruiter for one organisation. Role: Admin')
  ).toBeVisible();
  await expect(page.getByText('gth.com/recruiter/joel-adade-kofie')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Preview as talent' }).first()).toBeVisible();
  await expect(page.getByRole('button', { name: 'Save changes' })).toBeDisabled();
});

test('SR-01: editing enables Save, Cancel restores, Save keeps the new value', async ({ page }) => {
  await page.goto(BASE);
  const title = page.getByLabel('Job title');
  await title.fill('Head of Talent');
  await expect(page.getByRole('button', { name: 'Save changes' })).toBeEnabled();
  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(title).toHaveValue('HR Lead');
  await expect(page.getByRole('button', { name: 'Save changes' })).toBeDisabled();
  await title.fill('Head of Talent');
  await page.getByRole('button', { name: 'Save changes' }).click();
  await expect(page.getByRole('button', { name: 'Save changes' })).toBeDisabled();
  await expect(title).toHaveValue('Head of Talent');
});

test('SR-20: a non-work email shows the hint, the URL state and a disabled Save', async ({
  page,
}) => {
  await page.goto(`${BASE}?tab=account&state=email-error`);
  await expect(page.getByLabel('Work email')).toHaveValue('joel.kofie@gmail.com');
  await expect(
    page.getByText(
      'Use your work email at silverrock.tech so candidates know you’re a real recruiter.'
    )
  ).toBeVisible();
  await expect(page.getByText('Profile photo', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Change photo' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Save changes' })).toBeDisabled();
  // Fixing the address clears the error and the URL state.
  await page.getByLabel('Work email').fill('joel.k@silverrock.tech');
  await expect(page).not.toHaveURL(/state=email-error/);
  await expect(page.getByText('Use your work email at silverrock.tech')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Save changes' })).toBeEnabled();
});

test('SR-01: typing a gmail address flips the URL to email-error without moving the photo', async ({
  page,
}) => {
  await page.goto(BASE);
  await page.getByLabel('Work email').fill('joel.kofie@gmail.com');
  await expect(page).toHaveURL(/state=email-error/);
  await expect(page.getByText('Use your work email at silverrock.tech')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Upload new logo' })).toBeVisible();
});

test('SR-02: Organisation tab shows company details, verification and organisations', async ({
  page,
}) => {
  await page.goto(`${BASE}?tab=organisation`);
  await expect(page.getByRole('heading', { name: 'Company details' })).toBeVisible();
  await expect(page.getByText('PNG or SVG, at least 256 × 256')).toBeVisible();
  await expect(page.getByLabel('Company name')).toHaveValue('Silver Rock Technology');
  await expect(page.getByRole('combobox', { name: /Industry/ })).toContainText(
    'Technology · Fintech'
  );
  await expect(page.getByRole('combobox', { name: /Company size/ })).toContainText('50–200 people');
  await expect(page.getByLabel('Website')).toHaveValue('silverrock.tech');
  await expect(page.getByLabel('Head office')).toHaveValue('Airport City, Accra');
  await expect(page.getByText('76 / 500')).toBeVisible();
  await expect(page.getByText('KYB · Business registration')).toBeVisible();
  await expect(page.getByText('Verified on 2 Oct 2026')).toBeVisible();
  await expect(page.getByText('KYC · Your identity')).toBeVisible();
  await expect(page.getByText('Verified on 1 Oct 2026')).toBeVisible();
  await expect(page.getByText('Hubtel Ltd')).toBeVisible();
  await expect(page.getByText('Recruiter · membership pending approval')).toBeVisible();
  await expect(page.getByText('Pending', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Save changes' })).toBeDisabled();
});

test('SR-02: changing the industry and the about text enables Save; the counter follows', async ({
  page,
}) => {
  await page.goto(`${BASE}?tab=organisation`);
  await page.getByRole('combobox', { name: /Industry/ }).click();
  await page.getByRole('option', { name: 'Education' }).click();
  await expect(page.getByRole('combobox', { name: /Industry/ })).toContainText('Education');
  await page.getByLabel('About the company').fill('Short.');
  await expect(page.getByText('6 / 500')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Save changes' })).toBeEnabled();
  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(page.getByText('76 / 500')).toBeVisible();
});

test('SR-03: Team and roles lists the members, pending invite and the role guide', async ({
  page,
}) => {
  await page.goto(`${BASE}?tab=team`);
  await expect(page.getByRole('heading', { name: 'Team members' })).toBeVisible();
  await expect(page.getByText('5 of 10 seats used on the Professional plan.')).toBeVisible();
  await expect(
    page.getByText('People who can post jobs and manage candidates at Silver Rock Technology.')
  ).toBeVisible();
  await expect(page.getByText('Joel Adade Kofie (you)')).toBeVisible();
  await expect(page.getByText('kwabena@silverrock.tech')).toBeVisible();
  await expect(page.getByText('Invite pending')).toBeVisible();
  await expect(page.getByRole('button', { name: /^Resend/ })).toBeVisible();
  await expect(page.getByRole('combobox', { name: 'Role for Joel Adade Kofie' })).toBeDisabled();
  await expect(page.getByRole('combobox', { name: 'Role for Akua Mensah' })).toContainText(
    'Recruiter'
  );
  await expect(page.getByRole('heading', { name: 'What each role can do' })).toBeVisible();
  await expect(page.getByText('Read-only access to jobs and pipelines')).toBeVisible();
});

test('SR-03: a role change updates the row', async ({ page }) => {
  await page.goto(`${BASE}?tab=team`);
  const akua = page.getByRole('combobox', { name: 'Role for Akua Mensah' });
  await akua.click();
  await page.getByRole('option', { name: /Hiring manager/ }).click();
  await expect(akua).toContainText('Hiring manager');
});

test('SR-04 / SR-05: the invite dialog opens by URL and with the role menu open', async ({
  page,
}) => {
  await page.goto(`${BASE}?tab=team&modal=invite-teammate&email=ama.k%40silverrock.tech`);
  const dialog = page.getByRole('dialog', { name: 'Invite a teammate' });
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByText('They’ll get an email to join Silver Rock Technology on GTH.')
  ).toBeVisible();
  await expect(dialog.getByLabel('Work email')).toHaveValue('ama.k@silverrock.tech');
  await expect(dialog.getByRole('combobox')).toContainText('Recruiter');
  await expect(dialog.getByText('Access to jobs')).toBeVisible();
  await expect(dialog.getByText('Good for hiring managers')).toBeVisible();
  await expect(dialog.getByText('Uses 1 of 5 free seats')).toBeVisible();
  await expect(dialog.getByRole('radio', { name: 'All current and future jobs' })).toBeChecked();

  await page.goto(`${BASE}?tab=team&modal=invite-teammate&email=ama.k%40silverrock.tech&role=open`);
  await expect(page.getByRole('listbox')).toBeVisible();
  for (const hint of [
    'Everything, including billing and team',
    'Post jobs, search talent, move candidates',
    'Review candidates and give feedback',
    'Read-only',
  ]) {
    await expect(page.getByRole('listbox').getByText(hint, { exact: true })).toBeVisible();
  }
  await page.keyboard.press('Escape');
  await expect(page.getByRole('listbox')).toHaveCount(0);
  await expect(page.getByRole('dialog', { name: 'Invite a teammate' })).toBeVisible();
});

test('SR-04: Cancel and Escape close the invite dialog and clear the URL', async ({ page }) => {
  await page.goto(`${BASE}?tab=team`);
  await page.getByRole('button', { name: 'Invite teammate' }).click();
  await expect(page).toHaveURL(/modal=invite-teammate/);
  const dialog = page.getByRole('dialog', { name: 'Invite a teammate' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Send invite' })).toBeDisabled();
  await dialog.getByRole('button', { name: 'Cancel' }).click();
  await expect(dialog).toHaveCount(0);
  await expect(page).not.toHaveURL(/modal=/);
});

test('SR-04 / SR-06: sending an invite adds a pending row, a seat and the success toast', async ({
  page,
}) => {
  await page.goto(`${BASE}?tab=team&modal=invite-teammate`);
  const dialog = page.getByRole('dialog', { name: 'Invite a teammate' });
  await dialog.getByLabel('Work email').fill('ama.k@silverrock.tech');
  await dialog.getByRole('combobox').click();
  await page.getByRole('option', { name: /Hiring manager/ }).click();
  await dialog.getByRole('radio', { name: /Only selected jobs/ }).check();
  await dialog.getByRole('button', { name: 'Send invite' }).click();
  await expect(dialog).toHaveCount(0);
  await expect(
    page.getByText('Success - Invite sent to ama.k@silverrock.tech').first()
  ).toBeVisible();
  await expect(page.getByText('They’ll appear as pending until they join').first()).toBeVisible();
  await expect(page.getByText('6 of 10 seats used on the Professional plan.')).toBeVisible();
  await expect(page.getByText('ama.k@silverrock.tech', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('Invite pending')).toHaveCount(2);
  await page.getByRole('button', { name: 'Dismiss' }).click();
  await expect(page.getByText('They’ll appear as pending until they join')).toHaveCount(0);
  await expect(page).not.toHaveURL(/toast=/);
});

test('SR-04: a duplicate address is refused', async ({ page }) => {
  await page.goto(`${BASE}?tab=team&modal=invite-teammate&email=nii%40silverrock.tech`);
  const dialog = page.getByRole('dialog', { name: 'Invite a teammate' });
  await expect(dialog.getByText('This person is already on your team.')).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Send invite' })).toBeDisabled();
});

test('SR-06: the Invite sent toast opens by URL', async ({ page }) => {
  await page.goto(`${BASE}?tab=team&toast=invite-sent`);
  await expect(
    page.getByText('Success - Invite sent to ama.k@silverrock.tech').first()
  ).toBeVisible();
  await expect(page.getByText('5 of 10 seats used on the Professional plan.')).toBeVisible();
});

test('SR-07: the remove confirm opens by URL and removes the teammate', async ({ page }) => {
  await page.goto(`${BASE}?tab=team&modal=remove-teammate&member=efua`);
  const dialog = page.getByRole('dialog', { name: 'Remove Efua Arthur?' });
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByText(
      'Efua will lose access to Silver Rock Technology right away. Their notes and feedback stay with your team.'
    )
  ).toBeVisible();
  await expect(dialog.getByText('Reassign Efua’s 2 open conversations to me')).toBeVisible();
  await expect(dialog.getByRole('checkbox')).toBeChecked();
  await dialog.getByRole('button', { name: 'Remove teammate' }).click();
  await expect(dialog).toHaveCount(0);
  await expect(page.getByText('efua@silverrock.tech')).toHaveCount(0);
  await expect(page.getByText('4 of 10 seats used on the Professional plan.')).toBeVisible();
  await expect(page.getByText('Success - Efua Arthur removed').first()).toBeVisible();
});

test('SR-07: the "…" row menu leads to the confirm; Cancel keeps the teammate', async ({
  page,
}) => {
  await page.goto(`${BASE}?tab=team`);
  await page.getByRole('button', { name: 'More actions for Efua Arthur' }).click();
  await page.getByRole('menuitem', { name: 'Remove from team' }).click();
  const dialog = page.getByRole('dialog', { name: 'Remove Efua Arthur?' });
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: 'Cancel' }).click();
  await expect(dialog).toHaveCount(0);
  await expect(page.getByText('efua@silverrock.tech')).toBeVisible();
});

test('Team: Resend shows the resent toast; Cancel invite removes the pending row', async ({
  page,
}) => {
  await page.goto(`${BASE}?tab=team`);
  await page.getByRole('button', { name: /^Resend/ }).click();
  await expect(
    page.getByText('Success - Invite resent to nii@silverrock.tech').first()
  ).toBeVisible();
  await page.getByRole('button', { name: 'More actions for Nii Okai' }).click();
  await page.getByRole('menuitem', { name: 'Cancel invite' }).click();
  await expect(page.getByText('nii@silverrock.tech', { exact: true })).toHaveCount(0);
  await expect(page.getByText('4 of 10 seats used on the Professional plan.')).toBeVisible();
});

test('Tabs: Account, Organisation and Team and roles switch by URL', async ({ page }) => {
  await page.goto(BASE);
  await page.getByRole('link', { name: 'Organisation' }).first().click();
  await expect(page).toHaveURL(/tab=organisation/);
  await expect(page.getByRole('heading', { name: 'Company details' })).toBeVisible();
  await page.getByRole('link', { name: 'Team and roles' }).first().click();
  await expect(page).toHaveURL(/tab=team/);
  await expect(page.getByRole('heading', { name: 'Team members' })).toBeVisible();
});
