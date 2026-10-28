// @ts-check
import { test, expect } from '@playwright/test';

/*
 * Parent dashboard accessibility — the parts a screen-reader or keyboard user depends on that a rule engine cannot judge
 * (wiki/parent-opt-out.md "Accessibility"): the accessibility tree Chromium hands to assistive tech (page.ariaSnapshot), names that
 * contain their visible text, dialog semantics + keyboard trap, form wiring, live regions, and where focus lands after an action.
 * Colour contrast is NOT covered here: text sits over the page's grid image, so it is measured by hand; see the wiki for the open list.
 *
 *   npx playwright test parent-a11y
 */
test.describe.configure({ timeout: 120_000 });

/** @param {import('@playwright/test').Page} page @param {string} route */
const open = async (page, route) => {
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 60_000 });
};

const PAGES = [
  ['ward overview', '/parent/wards/abena'],
  ['profile tab', '/parent/wards/abena?tab=profile'],
  ['flags tab', '/parent/wards/abena?tab=flags'],
  ['paused ward', '/parent/wards/abena?state=opted-out'],
  ['help', '/parent/help'],
];

test.describe('page structure', () => {
  for (const [name, route] of PAGES) {
    test(`${name}: one h1, a main landmark, no skipped heading levels, no nameless controls`, async ({
      page,
    }) => {
      await open(page, route);
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
      await expect(page.getByRole('main')).toHaveCount(1);

      const levels = await page.evaluate(() =>
        [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')]
          .filter((h) => h.getClientRects().length > 0)
          .map((h) => Number(h.tagName[1]))
      );
      levels.forEach((lvl, i) => {
        if (i > 0)
          expect(lvl - levels[i - 1], `heading order ${levels.join('→')}`).toBeLessThanOrEqual(1);
      });

      // Chromium's accessibility tree: a control with no name prints as a bare "- button" / "- link" / "- textbox".
      const tree = await page.locator('body').ariaSnapshot();
      const nameless = tree
        .split('\n')
        .filter((l) =>
          /^\s*- (button|link|textbox|checkbox|radio|combobox)(\s*\[[^\]]*\])*\s*:?\s*$/.test(l)
        );
      expect(nameless, `controls without an accessible name:\n${nameless.join('\n')}`).toEqual([]);
    });
  }

  test('every page sets its own title', async ({ page }) => {
    const expected = [
      ['/parent/wards/abena', /^My wards|^Abena Mensah · My wards · Ghana Talent Hub$/],
      ['/parent/wards/abena?tab=flags', /^Flags · Abena Mensah · My wards · Ghana Talent Hub$/],
      [
        '/parent/wards/abena?state=opted-out',
        /^Abena Mensah \(opted out\) · My wards · Ghana Talent Hub$/,
      ],
      ['/parent/help', /^Help and guides · Ghana Talent Hub$/],
    ];
    for (const [route, pattern] of expected) {
      await open(page, String(route));
      await expect(page).toHaveTitle(/** @type {RegExp} */ (pattern));
    }
  });
});

test.describe('top bar names start with their visible text (WCAG 2.5.3)', () => {
  test('notification / message counts, language and account', async ({ page }) => {
    await open(page, '/parent/wards/abena');
    await expect(page.getByRole('button', { name: '5 notifications' })).toBeVisible();
    await expect(page.getByRole('button', { name: '4 messages' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'EN, language: English' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Account menu, Emma M.' })).toBeVisible();
    await expect(
      page.getByRole('button', { name: /Search opportunities, skills, communities/ })
    ).toBeVisible();
  });

  test('the account button keeps its name on a phone, where its text is hidden', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await open(page, '/parent/wards/abena');
    await expect(page.getByRole('button', { name: 'Account menu, Emma M.' })).toBeVisible();
  });
});

const DIALOGS = [
  [
    'flag a field',
    '/parent/wards/abena?tab=profile&modal=flag&field=volunteering',
    'Flag “Volunteering”',
  ],
  [
    'flag again',
    '/parent/wards/abena?tab=flags&modal=flag-again&flag=dob',
    'Flag “Date of birth” again',
  ],
  ['re-review', '/parent/wards/abena?tab=flags&modal=recheck&flag=dob', /Abena fixed/],
  ['opt out', '/parent/wards/abena?modal=opt-out', 'Opt Abena out of GTH?'],
  ['restore', '/parent/wards/abena?state=opted-out&modal=restore', 'Restore Abena’s access?'],
  ['report', '/parent/help?modal=report', 'Report a safety concern'],
  ['report sent', '/parent/help?modal=report-sent&about=abena', 'Thank you, Emma. We’re on it.'],
];

test.describe('dialogs', () => {
  for (const [name, route, title] of DIALOGS) {
    test(`${name}: named modal dialog, focus starts inside and is trapped, Esc closes it`, async ({
      page,
    }) => {
      await open(page, String(route));
      const dialog = page.getByRole('dialog', { name: title });
      await expect(dialog).toBeVisible();
      await expect(dialog).toHaveAttribute('aria-modal', 'true');
      await expect
        .poll(() => dialog.evaluate((d) => d.contains(document.activeElement)))
        .toBe(true);

      for (let i = 0; i < 10; i++) {
        await page.keyboard.press(i % 2 ? 'Shift+Tab' : 'Tab');
        expect(
          await dialog.evaluate((d) => d.contains(document.activeElement)),
          `focus escaped the dialog at Tab ${i}`
        ).toBe(true);
      }
      // the whole dialog is reachable and closable by keyboard
      await page.keyboard.press('Escape');
      await expect(dialog).toBeHidden();
    });
  }

  test('the close button has a name and the dialog returns focus to the button that opened it', async ({
    page,
  }) => {
    await open(page, '/parent/wards/abena?tab=profile');
    const trigger = page.getByRole('button', { name: 'Flag Region' });
    await trigger.focus();
    await page.keyboard.press('Enter');
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByRole('button', { name: 'Close' })).toBeVisible();
    await dialog.getByRole('button', { name: 'Close' }).click();
    await expect(trigger).toBeFocused();
  });
});

test.describe('forms', () => {
  test('opt-out: grouped reasons, a labelled checkbox, a described note, a disabled action', async ({
    page,
  }) => {
    await open(page, '/parent/wards/abena?modal=opt-out');
    const dialog = page.getByRole('dialog');
    const group = dialog.getByRole('radiogroup', { name: 'Why are you opting her out?' });
    await expect(group.getByRole('radio')).toHaveCount(4);
    await group.getByRole('radio', { name: 'Safety concerns' }).click();
    await expect(group.getByRole('radio', { name: 'Safety concerns' })).toBeChecked();
    await expect(group.getByRole('radio', { name: 'Privacy concerns' })).not.toBeChecked();

    const ack = dialog.getByRole('checkbox', {
      name: 'I understand Abena will be told her access is paused.',
    });
    await expect(ack).not.toBeChecked();
    const confirm = dialog.getByRole('button', { name: 'Opt out Abena' });
    await expect(confirm).toBeDisabled();
    await ack.focus();
    await page.keyboard.press('Space');
    await expect(ack).toBeChecked();
    await expect(confirm).toBeEnabled();

    const note = dialog.getByRole('textbox', { name: /Anything else/ });
    await expect(note).toHaveAccessibleDescription(
      'Up to 500 characters. Only GTH safety staff see this.'
    );
  });

  test('flag note: the error is announced and tied to the field', async ({ page }) => {
    await open(
      page,
      '/parent/wards/abena?tab=profile&modal=flag&field=volunteering&note=wrong&check=1'
    );
    const dialog = page.getByRole('dialog');
    const note = dialog.getByRole('textbox', { name: /What’s wrong/ });
    await expect(note).toHaveAttribute('aria-invalid', 'true');
    await expect(dialog.getByRole('alert')).toContainText(
      'Add a little more so Abena knows what to fix'
    );
    await expect(note).toHaveAccessibleDescription(/Add a little more so Abena knows what to fix/);
  });

  test('help search is a labelled field and results are discoverable as a list', async ({
    page,
  }) => {
    await open(page, '/parent/help');
    await expect(page.getByRole('textbox', { name: 'Search help' })).toBeVisible();
    await expect(
      page.getByRole('complementary', { name: 'Talk to the GTH parent team' })
    ).toBeVisible();
  });
});

test.describe('announcements', () => {
  test('a confirmation toast is a status live region', async ({ page }) => {
    await open(page, '/parent/wards/abena?tab=flags&toast=fix-approved');
    const toast = page.getByRole('status').filter({ hasText: 'Fix approved' });
    await expect(toast).toBeVisible();
    await expect(toast).toContainText('Abena’s date of birth shows to recruiters again.');
  });

  test('the paused banner is a status', async ({ page }) => {
    await open(page, '/parent/wards/abena?state=opted-out');
    await expect(
      page.getByRole('status').filter({ hasText: 'Abena’s access is paused' })
    ).toBeVisible();
  });
});

test.describe('focus after an action removes the control the user used', () => {
  test('Approve fix keeps focus in the flags list, not on <body>', async ({ page }) => {
    await open(page, '/parent/wards/abena?tab=flags');
    await page.getByRole('button', { name: 'Review fix' }).click();
    await page.getByRole('dialog').getByRole('button', { name: 'Approve fix' }).click();
    await expect(page.getByRole('region', { name: 'Flags' })).toBeFocused();
  });

  test('Flag again keeps focus in the flags list', async ({ page }) => {
    await open(page, '/parent/wards/abena?tab=flags&modal=flag-again&flag=dob');
    const dialog = page.getByRole('dialog');
    await dialog
      .getByRole('textbox', { name: /still wrong/ })
      .fill('The month should be May, not March.');
    await dialog.getByRole('button', { name: 'Send flag again' }).click();
    await expect(page.getByRole('region', { name: 'Flags' })).toBeFocused();
  });

  test('Opt out lands on the paused banner, Restore lands on the page heading', async ({
    page,
  }) => {
    await open(page, '/parent/wards/abena');
    await page.getByRole('button', { name: 'Opt out', exact: true }).click();
    await page
      .getByRole('dialog')
      .getByText(/I understand Abena/)
      .click();
    await page.getByRole('dialog').getByRole('button', { name: 'Opt out Abena' }).click();
    await expect(
      page.getByRole('status').filter({ hasText: 'Abena’s access is paused' })
    ).toBeFocused();

    await page.getByRole('button', { name: 'Restore access' }).click();
    await page.getByRole('dialog').getByRole('button', { name: 'Restore access' }).click();
    await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  });

  test('sending a flag returns focus to the Flag button that opened the dialog', async ({
    page,
  }) => {
    await open(page, '/parent/wards/abena?tab=profile');
    await page.getByRole('button', { name: 'Flag Region' }).click();
    await page.getByRole('dialog').getByRole('textbox').fill('Region should be Ashanti.');
    await page.getByRole('dialog').getByRole('button', { name: 'Send flag to Abena' }).click();
    await expect(page.getByRole('button', { name: 'Flag Region' })).toBeFocused();
  });
});

test.describe('keyboard only', () => {
  test('opt out and restore without a mouse', async ({ page }) => {
    await open(page, '/parent/wards/abena');
    await page.getByRole('button', { name: 'Opt out', exact: true }).focus();
    await page.keyboard.press('Enter');
    const dialog = page.getByRole('dialog', { name: 'Opt Abena out of GTH?' });
    await expect(dialog).toBeVisible();
    await dialog.getByRole('checkbox').focus();
    await page.keyboard.press('Space');
    await dialog.getByRole('button', { name: 'Opt out Abena' }).focus();
    await page.keyboard.press('Enter');
    await expect(page.getByText('Abena’s access is paused')).toBeVisible();

    await page.getByRole('button', { name: 'Restore access' }).focus();
    await page.keyboard.press('Enter');
    await page.getByRole('dialog').getByRole('button', { name: 'Restore access' }).focus();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('button', { name: 'Evaluate Abena' })).toBeVisible();
  });

  test('every control that takes focus shows a focus indicator', async ({ page }) => {
    await open(page, '/parent/wards/abena?tab=flags');
    const missing = [];
    for (let i = 0; i < 40; i++) {
      await page.keyboard.press('Tab');
      const r = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return null;
        const cs = getComputedStyle(el);
        const outline = cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0;
        const ring =
          cs.boxShadow !== 'none' && /rgb/.test(cs.boxShadow) && /inset|0px 0px/.test(cs.boxShadow);
        const name = el.getAttribute('aria-label') || (el.textContent || '').trim().slice(0, 30);
        return { ok: outline || ring, name: `${el.tagName.toLowerCase()} "${name}"` };
      });
      if (r && !r.ok) missing.push(r.name);
    }
    expect([...new Set(missing)], 'focused controls with no visible focus indicator').toEqual([]);
  });
});
