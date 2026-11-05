# Parent dashboard: Playwright specs, visual baselines and the accessibility pass

> Covers the three flows built 2026-10-27: flags and corrections ([parent-flags.md](parent-flags.md)), opt out and restore + Help and guides ([parent-opt-out.md](parent-opt-out.md)), and the ward / link pages they sit next to.
> Written 2026-10-28. Everything below was run against a production build served by `vite preview` (see "Running them").

## What exists

| What                                     | Where                                                               | Size                                                                                                                                                                           |
| ---------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Functional flows                         | `tests/e2e/parent-flows.spec.js`                                    | 20 tests: flag / Undo / Esc / Check → Approve / Flag again, opt out → paused → restore, Elliot's wording, frame-URL seeds, Help search, report flow and the opt-out hand-off   |
| Accessibility semantics                  | `tests/e2e/parent-a11y.spec.js`                                     | 19 tests: titles, headings, nameless controls, top-bar names, dialog semantics + keyboard trap, forms, live regions, focus after actions, keyboard-only flow, focus indicators |
| Responsive gate (existing spec)          | `tests/e2e/responsive.spec.js` via `helpers/responsive.js` `ROUTES` | 20 parent routes × 320 / 375 / 768 / 1024 / 1440 = 100 runs: no horizontal scroll, no text under 12 px, no control under 24 px                                                 |
| Desktop visual baselines (existing spec) | `tests/e2e/desktop-visual.spec.js`, same `ROUTES`                   | 20 routes × 1024 / 1440 = 40 baselines in `tests/e2e/.visual-baseline/` (git-ignored by design)                                                                                |

Result on 2026-10-28: flows 20/20, accessibility 19/19, responsive gate 100/100, visual baselines 40/40 on two consecutive compares.

## Running them

```bash
# one-off production build into a private folder (a shared dist/ is wiped by anyone else's build) and serve it
npx vite build --outDir _tmp_dist --emptyOutDir        # _tmp_* is git-ignored
npx vite preview --outDir _tmp_dist --port 5190 --strictPort --host 127.0.0.1

# in another terminal (Git Bash: export MSYS_NO_PATHCONV=1 so '/parent/' filters are not rewritten)
E2E_PORT=5190 npx playwright test parent-flows parent-a11y
E2E_PORT=5190 RESPONSIVE_GREP='parent/' npx playwright test responsive.spec
E2E_PORT=5190 RESPONSIVE_GREP='parent/' npx playwright test desktop-visual                      # compare
E2E_PORT=5190 RESPONSIVE_GREP='parent/' npx playwright test desktop-visual --update-snapshots   # (re)create baselines
```

`E2E_PORT` makes Playwright reuse the preview server instead of starting the dev server on 5199. The dev server works too (the default), but a cold start compiles hundreds of modules, so a few `page.goto` calls can pass the 30 s default; the specs set a 120 s timeout. The baselines are machine- and build-specific and git-ignored: regenerate them after a design change (`--update-snapshots`), on a known-good build.

## Accessibility pass: method

A real screen reader (NVDA, JAWS, VoiceOver, TalkBack) was **not** run. What was done instead, and what each can and cannot show:

1. **axe-core 4.14.0** (WCAG 2.0 / 2.1 / 2.2 A + AA and best-practice rules) over 20 parent states × desktop 1440 and phone 390. Installed in a scratch folder, not added to the project (no new dependency was added).
2. **Chromium's accessibility tree** (`page.locator('body').ariaSnapshot()`): what assistive tech is actually given; used to catch controls with no name.
3. **Keyboard probes**: where focus lands after every action, dialog focus trap and Esc, focus indicators, a keyboard-only opt-out / restore.
4. **Hand-computed contrast** for the colours the new pages use, because axe cannot judge text over the page's grid background image (it reports those as "incomplete", not as failures).

## Found and fixed

| Finding                                                                                                                                                                                                | Fix                                                                                                                                               |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Critical, button-name**: the profile menu button had no name on phones (its "Emma M." is hidden below 640 px)                                                                                        | `aria-label="Account menu, Emma M."` (`ParentTopBar`)                                                                                             |
| Label in Name (WCAG 2.5.3): the notification / message badges ("5", "4") and the "EN" pill were not in the buttons' names; the search button's name omitted its "⌘K"                                   | Names start with what is on screen: "5 notifications", "4 messages", "EN, language: English"; the search button's name now comes from its content |
| Text under 12 px on phones: the 10 px red count badges (54 of the 60 failures of the shared responsive gate)                                                                                           | `max-lg:text-[12px]` on the badge                                                                                                                 |
| **Focus lost to `<body>`** after Approve fix, Flag again, Opt out, Restore (the button that opened the flow is replaced), so a keyboard user restarts from the top and a screen reader loses its place | `focusAfterRender()` moves focus to the flags list, the paused banner (a `role="status"`, so it is read out) or the page heading                  |
| Every parent page was titled just "TalentHub" (WCAG 2.4.2)                                                                                                                                             | `useDocumentTitle` (same format as `PublicStatusPage`): "Flags · Abena Mensah · My wards · Ghana Talent Hub", "Help and guides · …"               |
| The dark **"Parent view" chip overlapped the Help icon** from 1280 to about 1500 px (found while reviewing a baseline)                                                                                 | Hidden below 1536 px; measured: −84 px at 1280, −22 px at 1440, +15 px at 1536; Figma's 1728 px design is unchanged                               |
| The flag dialog's close icon was green; Figma draws it grey on PW-04 / PW-06                                                                                                                           | (fixed earlier, see parent-flags.md)                                                                                                              |

Verified as correct (no change needed): dialogs are `role="dialog" aria-modal="true"` with an accessible name, focus starts inside, Tab / Shift+Tab never leave it, Esc closes, focus returns to the opener; the radio chips are a labelled `radiogroup`; the opt-out checkbox's name is its sentence and it works with Space; the note fields have `aria-describedby` helper text, and an error is `role="alert"` with `aria-invalid`; toasts are `role="status"`; one `h1` per page and no skipped heading levels; landmarks (`main`, named `nav`, named `aside`); every control that takes focus shows an indicator; tap targets are all ≥ 24 px.

After the fixes axe reports **one rule on every page: colour contrast**, below.

## Open: colour contrast (Figma's own values, not changed)

The project rule is that Figma colours are exact and are not recoloured for contrast without a decision. Ratios (WCAG AA needs 4.5:1 for text under 18.66 px bold / 24 px):

| Where                                                            | Colours                | Ratio |
| ---------------------------------------------------------------- | ---------------------- | ----- |
| Top bar search hint "Search opportunities, skills, communities…" | `#bfbfbf` on white     | 1.83  |
| Top bar "EN"                                                     | `#babab7` on `#f8fafc` | 1.85  |
| Sidebar "Mother · 2 wards linked", "2 of 3 done"                 | `#babab7` on white     | 1.94  |
| Help and guides / To review subtitle (16 px)                     | `#999999` on `#f8f8f4` | 2.68  |
| Amber count chip on To review ("Corrections 1", white on gold)   | `#ffffff` on `#c8951a` | 2.70  |
| Inactive tab labels on the page background (15 px / 500)         | `#737373` on `#f8f8f4` | 4.45  |

Everything else the new pages use passes (body grey `#575755` 6.3–7.2, chip grey `#595959` 7.0, green `#387440` 4.9–5.6, red `#c0392b` 4.7–5.4, toast text 10+, cream label on the green button 5.1). The first four are shared chrome the dashboard builder owns; the last two are on the flags / To review screens. Darker equivalents (for example `#757570` for the pale greys, `#8a6410` for the gold) would pass; that is a design decision.

## Open: other findings

- **Toasts auto-dismiss after 4 s, and "Undo" lives in them** (`ui/ActionToast`, shared). WCAG 2.2.1 (Timing Adjustable): a keyboard or screen-reader user may not reach Undo in time. Suggested: pause the timer while the toast has focus or hover, or keep it until dismissed when it carries an action.
- **The To review page and the top bar belong to other sessions**: the To review page was rewritten after the tests above were first written, so `parent-flows.spec.js` asserts only what is stable there (the correction row and the "waiting" count); it has no page title yet.
- `/parent/link-ward`, `/parent/wards` and the home pages are in the responsive / visual gates and axe, but their behaviour is not covered by the functional specs.

## Not verified

A real screen reader; zoom to 200–400 % and text-spacing overrides (WCAG 1.4.4 / 1.4.10 / 1.4.12); `prefers-reduced-motion`; Windows high-contrast mode; touch / TalkBack gestures; Safari and Firefox (all runs are Chromium); a cross-build check of the baselines on the dev server. To put axe into CI, add `@axe-core/playwright` as a devDependency (a dependency decision, so it was not added here) and call it from `parent-a11y.spec.js`.
