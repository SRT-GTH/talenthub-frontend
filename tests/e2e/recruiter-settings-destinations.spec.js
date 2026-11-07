import { test, expect } from '@playwright/test';

/*
 * Recruiter Settings: buttons whose destination is drawn elsewhere in the recruiter Figma file.
 *  - Compare plans / Upgrade / Change payment method -> the recruiter onboarding Plan (R05) and Payment (R06) screens.
 *  - Ask Hiring Assistant (Help pop-over) -> the recruiter AI chat ("Recruiter - AI Chat").
 * The Settings frames wire no prototype links (their reactions have no target), so these hand-offs are ⚠️ ASSUMPTION in the wiki.
 */
const NOISE = /\/api\/|401|500|UNAVAILABLE|favicon|net::ERR/i;

test.describe('recruiter settings: destinations drawn in other canvases', () => {
  test.beforeEach(async ({ page }) => {
    page.on('pageerror', (e) => {
      if (!NOISE.test(String(e))) throw e;
    });
  });

  test('Plan and billing: Compare plans, Upgrade and Change reach the onboarding plan / payment screens', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });

    await page.goto('/recruiter/settings?tab=billing');
    await page.getByRole('button', { name: 'Compare plans' }).click();
    await expect(page).toHaveURL(/\/onboarding\/recruiter\/plan\?state=professional/);
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();

    await page.goto('/recruiter/settings?tab=billing');
    // the workspace rail has its own "Upgrade" button: scope to the page content
    await page.getByRole('main').getByRole('button', { name: 'Upgrade', exact: true }).click();
    await expect(page).toHaveURL(/\/onboarding\/recruiter\/plan\?state=enterprise/);
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();

    await page.goto('/recruiter/settings?tab=billing');
    await page.getByRole('button', { name: 'Change' }).first().click();
    await expect(page).toHaveURL(/\/onboarding\/recruiter\/payment/);
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
  });

  test('Help pop-over: Ask Hiring Assistant opens the recruiter AI chat', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/recruiter/settings?help=page');
    await page
      .getByRole('button', { name: /Ask Hiring Assistant/ })
      .first()
      .click();
    await expect(page).toHaveURL(/\/profile\/filling\/career-buddy\?role=recruiter/);
    await expect(page.getByPlaceholder('Write a message…')).toBeVisible({ timeout: 15000 });
  });

  test('Workspace rail: the plan card Upgrade opens Plan and billing', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/recruiter/job-postings');
    await page.getByRole('link', { name: 'Upgrade', exact: true }).click();
    await expect(page).toHaveURL(/\/recruiter\/settings\?tab=billing/);
    await expect(page.getByRole('link', { name: /Plan and billing/ })).toHaveAttribute(
      'aria-current',
      'page'
    );
  });
});
