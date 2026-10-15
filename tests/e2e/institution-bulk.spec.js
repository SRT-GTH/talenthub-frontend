/**
 * Institution bulk upload against staging. Registers a new institution, then:
 * downloads the template, uploads a CSV with 3 good rows and 4 bad ones,
 * checks the validate report, submits, and waits for the accounts.
 *
 *   npx playwright test tests/e2e/institution-bulk.spec.js --project=chromium --headed
 */
import { test, expect } from '@playwright/test';
import { watchApi, uniquePhone } from './helpers/onboarding.js';
import { registerInstitution, downloadText } from './helpers/institution.js';

test.use({
  viewport: { width: 1440, height: 900 },
  launchOptions: { slowMo: 250 },
  video: 'on',
  actionTimeout: 45_000,
});

// Admin of an earlier e2e institution (institution-register.spec.js run on 2026-10-14).
const OTHER_INSTITUTION_EMAIL = 'e2e.institution.6053491@example.com';

const HEADER =
  'First Name,Last Name,Date of Birth,Gender,Email,Phone,Level,Grade,Student ID,Parent Name,Parent Email,Parent Phone';

test('institution uploads students: template, validate, submit, report', async ({ page }) => {
  test.setTimeout(8 * 60_000);
  watchApi(page);
  const { id } = await registerInstitution(page);
  const mail = (who) => `e2e.bulk.${who}.${id}@example.com`;

  // Template guide: the download link saves the CSV template.
  let download = page.waitForEvent('download');
  await page.getByRole('link', { name: /download gth_student_upload_template\.csv/i }).click();
  let text = await downloadText(await download);
  expect(text.split(/\r?\n/)[0]).toBe(HEADER);

  await page.getByRole('button', { name: /i'm ready to fill the template/i }).click();
  await page.waitForURL('**/onboarding/institution/template');
  download = page.waitForEvent('download');
  await page.getByTestId('download-template').click();
  expect((await download).suggestedFilename()).toBe('GTH_Student_Upload_Template.csv');
  await page.getByRole('button', { name: /i have my file ready/i }).click();
  await page.waitForURL('**/onboarding/institution/upload');

  // 3 valid rows (one minor with a parent), 4 invalid ones.
  const csv = [
    HEADER,
    `Ama,Owusu,10/05/2004,Female,${mail('ama')},0${uniquePhone('24')},University,Level 200,CU-${id}-1,,,`,
    `Kofi,Mensah,15/03/2010,Male,${mail('kofi')},0${uniquePhone('20')},SHS,SHS 2,CU-${id}-2,Yaw Mensah,${mail('yaw')},0${uniquePhone('55')}`,
    `Yaw,Darko,2003-01-20,Male,${mail('darko')},${uniquePhone('27')},University,Level 300,CU-${id}-3,,,`,
    `Esi,Minor,01/02/2011,Female,${mail('esi')},0${uniquePhone('24')},JHS,JHS 3,CU-${id}-4,,,`,
    `Bad,Phone,01/01/2000,Male,${mail('badphone')},12345,University,Level 100,CU-${id}-5,,,`,
    `Dup,Email,02/02/2001,Female,${mail('ama')},0${uniquePhone('24')},University,Level 100,CU-${id}-6,,,`,
    `No,Email,03/03/2002,Male,,0${uniquePhone('24')},University,Level 100,CU-${id}-7,,,`,
  ].join('\r\n');
  await page.locator('input[type="file"]').setInputFiles({
    name: 'students.csv',
    mimeType: 'text/csv',
    buffer: Buffer.from(csv, 'utf8'),
  });
  await expect(page.getByText('students.csv').first()).toBeVisible();
  await page.getByRole('button', { name: /run pre-flight check/i }).click();
  await page.waitForURL('**/onboarding/institution/validate', { timeout: 90_000 });

  // Validate: 4 problem rows, 3 valid, each check names its row.
  await expect(page.getByText('4 rows with issues.')).toBeVisible();
  await expect(page.getByRole('button', { name: /proceed with 3 valid rows/i })).toBeEnabled();
  for (const title of [
    /required fields · 1 row/i,
    /phone format · 1 row/i,
    /in-file duplicates · 1 row/i,
    /minors without parent email · 1 row/i,
  ]) {
    await expect(page.getByText(title).first()).toBeVisible();
  }
  await page.getByRole('button', { name: /4 failed rows/i }).click();
  download = page.waitForEvent('download');
  await page.getByTestId('download-failed-rows').click();
  text = await downloadText(await download);
  const failedLines = text.trim().split(/\r?\n/);
  expect(failedLines[0]).toContain('Problems');
  expect(failedLines).toHaveLength(5); // header + 4 rows
  expect(text).toContain('Under 18: no parent email');
  expect(text).toContain('Invalid phone: 12345');

  // Confirm: 3 accounts; submit creates them.
  await page.getByRole('button', { name: /proceed with 3 valid rows/i }).click();
  await page.waitForURL('**/onboarding/institution/confirm');
  await expect(page.getByTestId('submit-bulk')).toHaveText(/submit and create 3 accounts/i);
  const submitted = page.waitForResponse(
    (r) =>
      r.url().includes('/users/upload-bulk-csv-with-grouping') && r.request().method() === 'POST',
    { timeout: 120_000 }
  );
  await page.getByTestId('submit-bulk').click();
  const res = await submitted;
  const body = await res.json().catch(() => ({}));
  expect(res.status(), JSON.stringify(body).slice(0, 300)).toBeLessThan(300);
  expect(body.bulkOperationId || body.data?.bulkOperationId, 'bulk operation id').toBeTruthy();
  await page.waitForURL('**/onboarding/institution/report');

  // Report: wait for the job, then the summary.
  const viewReport = page.getByRole('button', { name: /view upload report/i });
  await expect(viewReport).toBeEnabled({ timeout: 180_000 });
  await expect(page.getByText(/finished: 3 accounts created/i)).toBeVisible();
  await viewReport.click();
  await expect(page.getByText(/3 students are/i)).toBeVisible();
  await expect(page.getByText('Download 4 failed rows')).toBeVisible();

  const state = await page.evaluate(() =>
    JSON.parse(sessionStorage.getItem('th:institution-bulk') || 'null')
  );
  console.log(`BULK_OPERATION_ID=${state?.bulkOperationId} ORG=${id}`);

  // Another institution's admin opens the same report: the backend refuses
  // (org check) and the page says so instead of showing the rows.
  const other = OTHER_INSTITUTION_EMAIL;
  const login = await page.request.post('/api/auth/login', {
    data: { email: other, password: 'Inst@12345!' },
  });
  expect(login.status(), 'other institution login').toBeLessThan(300);
  const otp = await page.request.post('/api/auth/verify-otp', {
    data: { email: other, otp: '123456' },
  });
  const otpBody = await otp.json();
  const otherToken = (otpBody.data || otpBody).accessToken;
  expect(otherToken, 'other institution token').toBeTruthy();

  const refused = page.waitForResponse(
    (r) => r.url().includes(`/users/bulk-operation-status/${state.bulkOperationId}`),
    { timeout: 60_000 }
  );
  await page.evaluate((t) => localStorage.setItem('th:auth-token', t), otherToken);
  await page.reload();
  const res403 = await refused;
  expect(res403.status()).toBe(403);
  expect((await res403.json()).type).toBe('NOT_ORGANIZATION_MEMBER');
  await expect(page.getByTestId('api-error')).toHaveText(
    'This upload belongs to another institution.'
  );
  await expect(page.getByText(/finished: 3 accounts created/i)).toHaveCount(0);
  await expect(page.getByRole('button', { name: /view upload report/i })).toBeDisabled();
});
