/**
 * Institution registration against staging: institution details, contact,
 * emailed code (staging bypass 123456), review + agreements, activation.
 * Ends logged in as the new institution admin on the template guide.
 * The steps live in helpers/institution.js (shared with institution-bulk.spec.js).
 *
 *   npx playwright test tests/e2e/institution-register.spec.js --project=chromium --headed
 */
import { test } from '@playwright/test';
import { watchApi } from './helpers/onboarding.js';
import { registerInstitution } from './helpers/institution.js';

test.use({
  viewport: { width: 1440, height: 900 },
  launchOptions: { slowMo: 300 },
  video: 'on',
  actionTimeout: 45_000,
});

test('institution registers, verifies the contact email and activates', async ({ page }) => {
  test.setTimeout(5 * 60_000);
  watchApi(page);
  await registerInstitution(page);
});
