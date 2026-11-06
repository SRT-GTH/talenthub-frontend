import { test, expect } from '@playwright/test';
const URLS = [
  '/recruiter/community/create',
  '/recruiter/community/agritech-innovators-ghana/manage?state=live',
  '/recruiter/community',
  '/recruiter/community?view=circle',
  '/recruiter/community/people/yaw-darko',
  '/recruiter/community/frontend-devs-ghana',
];
// A recruiter session's 401 from the talent home API must never send /recruiter/community… to /login (CommunityFrame passes enabled:false).
test.describe('recruiter community: no login bounce on 401', () => {
  for (const u of URLS) {
    test(u, async ({ page }) => {
      test.setTimeout(120000);
      await page.addInitScript(() => {
        localStorage.setItem('accessToken', 'x');
        localStorage.setItem('token', 'x');
      });
      await page.route('**/api/**', (r) =>
        r.fulfill({
          status: 401,
          contentType: 'application/json',
          body: '{"message":"unauthorized"}',
        })
      );
      for (let i = 0; i < 4; i++) {
        await page.goto(u);
        await page.waitForTimeout(2500);
        expect(new URL(page.url()).pathname, `${u} load ${i}`).not.toBe('/login');
      }
    });
  }
});
