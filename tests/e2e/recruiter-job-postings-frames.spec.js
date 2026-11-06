import { test, expect as baseExpect } from '@playwright/test';

// The dev server is shared and the first load of a lazy route is slow: give every check room.
const expect = baseExpect.configure({ timeout: 30_000 });
test.beforeEach(() => test.slow());

/*
 * Recruiter - Job Postings (Figma file OHG2xsfCCskT8xEn356njv, canvas 10103:59491): create from a template (JT-01…JT-11), build a template (CT-01…CT-08),
 * manage a posting (JM-01…JM-13) and the Templates › Screening criteria tab (JS-15). Every frame opens by URL with mock data (see wiki/recruiter-job-postings.md).
 */
const NEW = '/recruiter/job-postings/new?template=product-designer';

test('JT-01 / JT-02: template details dialog and the talent-side preview', async ({ page }) => {
  await page.goto('/recruiter/job-templates?modal=details&template=product-designer');
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByText('Included in this template')).toBeVisible();
  await dialog.getByRole('button', { name: 'Use template' }).click();
  await expect(page.getByRole('heading', { name: /Create job/ })).toBeVisible();
  await page.goto('/recruiter/job-templates/product-designer/preview');
  await expect(page.getByText('Preview — this is exactly what talent will see')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Apply with my GTH profile' })).toBeDisabled();
});

test('JT-03…JT-07: pre-filled form, three dropdowns, validation errors', async ({ page }) => {
  await page.goto(NEW);
  await expect(page.getByLabel('Job title')).toHaveValue('Product Designer');
  await page.goto(`${NEW}&menu=employment`);
  await expect(page.getByText('Opens to students and recent graduates')).toBeVisible();
  await page.goto(`${NEW}&menu=location&q=Acc`);
  await expect(page.getByText('City · 1,240 talents nearby')).toBeVisible();
  await page.goto(`${NEW}&menu=screening`);
  await expect(page.getByText('SAVED BY YOUR TEAM')).toBeVisible();
  await page.goto(`${NEW}&state=errors`);
  await expect(page.getByText('2 things need fixing before you can publish')).toBeVisible();
  await expect(
    page.getByText('Add a deadline. It must be at least 3 days from today.')
  ).toBeVisible();
});

test('JT-08…JT-11: preview, publishing, live dialog, toast on the postings page', async ({
  page,
}) => {
  await page.goto('/recruiter/job-postings/new/preview');
  await expect(page.getByText('Preview · not published yet')).toBeVisible();
  await page.goto(`${NEW}&state=publishing`);
  await expect(page.getByRole('dialog').getByText('Publishing your job…')).toBeVisible();
  await page.goto('/recruiter/job-postings?modal=published');
  await expect(page.getByRole('dialog').getByText('Your job is live!')).toBeVisible();
  await page.goto('/recruiter/job-postings?toast=published');
  await expect(
    page.getByText('Product Designer is live.Talent can now find it in Opportunities')
  ).toBeVisible();
});

test('CT-01…CT-05: template builder, save dialog, category dropdown, name taken', async ({
  page,
}) => {
  await page.goto('/recruiter/job-templates/new');
  await expect(page.getByText('Templates don’t publish anything')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Save template' })).toBeDisabled();
  await page.goto('/recruiter/job-templates/new?modal=save');
  await expect(
    page.getByRole('dialog').getByText('Saved to My templates. You can edit it any time.')
  ).toBeVisible();
  await page.goto('/recruiter/job-templates/new?modal=save&menu=category');
  await expect(page.getByRole('option', { name: 'Finance and accounting' })).toBeVisible();
  await page.goto('/recruiter/job-templates/new?modal=save&state=name-taken');
  await expect(page.getByText(/You already have a template with this name/)).toBeVisible();
});

test('CT-06…CT-08 and JM-07: My templates, card menu, toasts', async ({ page }) => {
  await page.goto('/recruiter/job-templates?mine=1&toast=saved');
  await expect(page.getByText('Junior Frontend Developer').first()).toBeVisible();
  await expect(
    page
      .getByText('Template saved to My templates. Everyone at Silver Rock Technology can use it.')
      .first()
  ).toBeVisible();
  await page.goto('/recruiter/job-templates?mine=1&menu=junior-frontend-developer');
  await expect(page.getByRole('menuitem', { name: 'Delete template' })).toBeVisible();
  await page.goto('/recruiter/job-templates?mine=1&toast=copied');
  await expect(
    page.getByText('Senior UX Designer (copy) is in My templates').first()
  ).toBeVisible();
});

test('JM-01 / JM-03 / JM-04 / JM-05: posting detail, edit, confirm, saved', async ({ page }) => {
  await page.goto('/recruiter/job-postings/senior-ux-designer');
  await expect(page.getByRole('heading', { name: 'Senior UX Designer', level: 1 })).toBeVisible();
  await page.goto('/recruiter/job-postings/senior-ux-designer/edit');
  await expect(page.getByText('128 people have already applied')).toBeVisible();
  await page.goto('/recruiter/job-postings/senior-ux-designer/edit?modal=confirm');
  await expect(page.getByRole('dialog').getByText('Save changes to a live posting?')).toBeVisible();
  await page.goto('/recruiter/job-postings/senior-ux-designer?saved=1');
  await expect(page.getByText('Updated just now').first()).toBeVisible();
});

test('JM-02 / JM-06 / JM-08 / JM-10 / JM-12: manage menu and the posting dialogs', async ({
  page,
}) => {
  await page.goto('/recruiter/job-postings?menu=senior-ux-designer&menuKind=manage');
  await expect(page.getByRole('menuitem', { name: 'Pause applications' })).toBeVisible();
  await page.goto('/recruiter/job-postings?modal=save-template&posting=senior-ux-designer');
  await expect(page.getByRole('dialog').getByText('Save as a template')).toBeVisible();
  await page.goto('/recruiter/job-postings?modal=pause&posting=senior-ux-designer');
  await expect(page.getByRole('dialog').getByText('Pause applications?')).toBeVisible();
  await page.goto('/recruiter/job-postings?modal=close-applicants&posting=senior-ux-designer');
  await expect(page.getByText('72 applicants haven’t heard back yet')).toBeVisible();
  await page.goto('/recruiter/job-postings?modal=delete-draft&posting=devops-engineer');
  await expect(page.getByRole('dialog').getByText('Delete this draft?')).toBeVisible();
});

test('JM-09 / JM-11 / JM-13: paused, closed and deleted toasts apply the change', async ({
  page,
}) => {
  await page.goto('/recruiter/job-postings?toast=paused&posting=senior-ux-designer');
  await expect(page.getByText('Your pipeline is unchanged').first()).toBeVisible();
  await expect(page.getByText('Resume applications')).toBeVisible();
  await page.goto('/recruiter/job-postings?toast=closed&posting=senior-ux-designer');
  await expect(
    page.getByText('72 applicants were sent a “role closed” message').first()
  ).toBeVisible();
  await page.goto('/recruiter/job-postings?toast=deleted&posting=devops-engineer');
  await expect(page.getByText('DevOps Engineer').first()).toBeVisible();
  await expect(page.getByRole('heading', { name: 'DevOps Engineer' })).toHaveCount(0);
});

test('JS-15: Templates › Screening criteria lists the saved criteria', async ({ page }) => {
  await page.goto('/recruiter/job-templates?view=screening');
  await expect(page.getByRole('heading', { name: 'Senior design screening' })).toBeVisible();
  await expect(page.getByText('Used on 6 jobs')).toBeVisible();
});

test('responsive: no horizontal scroll at 320 and 390 on the new pages', async ({ page }) => {
  const urls = [
    NEW,
    '/recruiter/job-templates/new',
    '/recruiter/job-postings/senior-ux-designer',
    '/recruiter/job-postings/new/preview',
    '/recruiter/job-templates?view=screening',
  ];
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 800 });
    for (const url of urls) {
      await page.goto(url);
      await expect(page.locator('h1').first()).toBeVisible();
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
      );
      expect(overflow, `${url} at ${width}px`).toBeLessThanOrEqual(1);
    }
  }
});
