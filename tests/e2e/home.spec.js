import { test, expect } from '@playwright/test';

test('landing page renders hero headline', async ({ page }) => {
  await page.goto('/');
  // Hero headline is split across spans inside an <h1>; assert the H1
  // contains the expected words.
  const heading = page.getByRole('heading', { level: 1 });
  await expect(heading).toBeVisible();
  // LP-01 v2 hero copy (landing rebuild, wiki/log.md 2026-10-22; HERO_HEADING in landing/home/HeroData.js).
  await expect(heading).toContainText('Stop being overlooked.');
  await expect(heading).toContainText('Start getting found.');
});

test('design-system playground is reachable at /components', async ({ page }) => {
  await page.goto('/components');
  await expect(page.getByRole('heading', { name: 'TalentHub' })).toBeVisible();
});
