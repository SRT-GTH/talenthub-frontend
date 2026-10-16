# Onboarding redesign — recruiter flow + talent/entry corrections (2026-10-16)

> Source: Figma page `7356:96249` "onboarding screens - Recruiter" (10 recruiter sections, 38 frames) and the `8027:*` frames (role selection, login, tutorial, talent 18+ onboarding, personal, contact, address, education, review, success). File key `Bin8roWL8sloyc36IgFMuT`. Status: **BUILT, frontend-only mock** — nothing is wired to an API. Several items are open — see [Open items](#open-items--decisions-pending).

## Owner rules for this work `✅ VERIFIED` (owner, 2026-10-16)

1. **100% Figma match**, smallest frames included, all states. Text verbatim from `characters` (Figma typos stay unless the app had already corrected the same string — those are listed in the notes below).
2. **ALL icons and images are taken straight from Figma, nothing remade.** Export with the REST API (`/v1/images` svg/png) — never hand-draw, never initials tiles. _This supersedes the older "hand-craft small icons" rule._ Exceptions only where Figma has no exportable node (listed below).
3. **No page-level horizontal scroll at any size**; rows that overflow use `ScrollChevronRow` (no visible scrollbar, chevrons only when there is overflow in that direction).
4. The **parent flow's right panel is the responsiveness reference**; talent panels were corrected to it.
5. Headlines are **Bricolage Grotesque 600** (`font-heading`). Resolve `characterStyleOverrides` first: some nodes say `fontSize: 64` but render **54px**. Verified: at default font axes the 54px headlines match Figma to 1px.
6. Colours Figma-exact (no contrast recolouring). Frontend only: mock flows, `setSection` state, no API.

## Routes `✅ VERIFIED`

| Route                                       | Page                              | Figma                                  | Notes                                                                                           |
| ------------------------------------------- | --------------------------------- | -------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `/get-started`                              | `pages/GetStartedPage.jsx`        | `8027:200428…` / `7374:904,1147`       | per-role benefits + CTA + loader copy; radio group; recruiter → `/onboarding/recruiter/profile` |
| `/onboarding/recruiter`                     | redirect → `profile`              |                                        |                                                                                                 |
| `/onboarding/recruiter/profile`             | `RecruiterProfilePage`            | R01 `7374:1391…2251` + R02 `2524…3466` | R01 form + OTP modal + verified modal in ONE page (stage machine)                               |
| `/onboarding/recruiter/type`                | `RecruiterTypePage`               | R03 `3747/3962/4177`                   | Freelance skips organisation → plan                                                             |
| `/onboarding/recruiter/organisation`        | `RecruiterOrganisationPage`       | R04 `4393…5519`                        | combobox search, fuzzy, not found, selected, "Request sent" modal                               |
| `/onboarding/recruiter/organisation/create` | `RecruiterCreateOrganisationPage` | R04b `5818…6478`                       | "Organisation created" (Primary Admin) modal                                                    |
| `/onboarding/recruiter/plan`                | `RecruiterPlanPage`               | R05 `6764/7012/7258`                   | no panel; Free → preferences, paid → payment                                                    |
| `/onboarding/recruiter/payment`             | `RecruiterPaymentPage`            | R06 `7507…8715`                        | card + Mobile Money; UI only                                                                    |
| `/onboarding/recruiter/preferences`         | `RecruiterPreferencesPage`        | R07 `9004/9278/9556`                   |                                                                                                 |
| `/onboarding/recruiter/review`              | `RecruiterReviewPage`             | R08 `9838/10128`                       | no panel                                                                                        |
| `/onboarding/recruiter/done`                | `RecruiterDonePage`               | R09 `10419/10565/10711`                | 3 variants; `?variant=pending\|admin\|active` demo override                                     |
| `/onboarding/talent/done`                   | `OnboardingDonePage`              | `8027:213532`, `213887`                | NEW; Review's final CTA now navigates here (was `/login`)                                       |

All recruiter routes live under `TalentOnboardingLayout` inside `OnboardingProvider` + `RecruiterOnboardingProvider`. **No route guards** (DemoNavigator + deep links must open any step). `MainLayout` treats `/onboarding/recruiter` as a **fixed-shell** path (viewport-locked, only the left column scrolls) — without that the panel did not shrink on short screens.

DemoNavigator: new **recruiter** flow tab (Role → Profile+OTP → Type → Organisation → Create org → Plan → Payment → Preferences → Review → Done) and a talent **Done** step.

## Recruiter flow architecture

- Steps/percent: `components/shared/recruiterOnboardingSteps.js`. Figma fixes the percent per screen (**20 / 32 / 45 / 45 / 56 / 67 / 78 / 90**), so it is passed to `OnboardingHeader` explicitly. Verify (OTP) is a modal over Profile (header shows Verify 32% while open).
- Shell: `components/sections/recruiterOnboarding/RecruiterOnboardingShell.jsx` (`routeKey`, `panel`, `hideHeader`).
- State (mock): `providers/RecruiterOnboardingProvider.jsx` → `useRecruiterOnboarding()` → `{ data, setSection(key, patch), reset }`. Slices: `profile {fullName,email,phone,passwordSet,verified}`, `recruiterType 'dedicated'|'freelance'`, `organisation {mode:'existing'|'new', id, name, affiliation:'pending'|'admin'}`, `plan {tier,billing}`, `payment {method,status,brand,last4}`, `preferences {scope,experience,industries}`. **Passwords and full card numbers are never stored.**
- API seams (Promise-returning, swap bodies at integration): `profile/profileApi.js` (`checkEmailAvailable`, `submitProfile`, `verifyOtp`, `resendOtp`), `organisation/organisationData.js` (`searchOrganisations`, `requestAffiliation`, `createOrganisation`), `billing/paymentApi.js` (`createPayment`, `pollMomoApproval`), preferences/review/done fake timers inside the pages.
- Folders: `components/sections/recruiterOnboarding/{profile,organisation,billing,closing}/`.

### Demo triggers

| Trigger                                                     | Effect                                                                                                  |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| email `taken@example.com`                                   | "already registered" error                                                                              |
| OTP `123456`                                                | verifies; anything else = wrong code (attempts 3→0; at 0/expiry cells lock, Resend resets — assumption) |
| card number ending `0002`                                   | payment declined                                                                                        |
| Mobile Money any 9-digit number                             | awaiting dialog (2:00 countdown) auto-approves after ~5 s                                               |
| `/onboarding/recruiter/done?variant=pending\|admin\|active` | forces the Done variant                                                                                 |

## Shared right panel (responsiveness contract) `✅ VERIFIED`

`components/shared/OnboardingPanel.jsx` — extracted from the parent panel. Photo cards = **% of panel width + aspect-ratio**; overlays = **% of the panel on both axes**; the aside is a container (`cqw` units inside). Additive props: `bgColor`, `ellipseColor` / `ellipseTopRightColor` / `ellipseBottomLeftColor`, `variant 'default'|'simple'`, `photoCards`, `overlayContent`, `centerContent`, `showWatchTutorial`, `tutorialAriaLabel`, `onWatchTutorial`, plus geometry props (`refAspect`, `ellipseAlpha`, `ellipseBlur*`, `showBgLines`, `showBlElement`, `gridStyle`, `tutorialShowLabel`, `tutorialPlacement`) and `PhotoCard` (`borderWidth`, `borderRadius`, `boxShadow`, `borderOverlay`, `cornerEllipseInside`, `cornerEllipseStyle`). On short panels the cards+overlays layer scales down about its top-centre (ResizeObserver; identity when the panel is ≥ ~91% of reference height). The aside is no longer `aria-hidden` on desktop (the Watch Tutorial button was focusable inside a hidden subtree); decorative layers are wrapped in their own `aria-hidden`. Parent look verified **pixel-identical** at 1728×1117 and 1440×900.

Wrappers: `ParentLoginRightPanel` (gold `#967014`, unchanged behaviour), `talentAuth/TalentOnboardingPanel` (green `#387440`, amber TR + coral BL ellipses), `recruiterOnboarding/RecruiterOnboardingPanel` (variants below).

`RecruiterOnboardingPanel variant`: `profile` (default; OTP chip) · `affiliation` (R04 `5519`: "Fuzzy match on") · `orgCreated` (R04b `6478`: "You become Primary Admin") · `paystack` (R06 `8437`, `8715`: "Secured by Paystack"). Geometry is identical in every frame; only text differs. Pages wire it: Organisation (modal open → `affiliation`), Create (modal open → `orgCreated`), Payment (awaiting/success → `paystack`). Figma panel = frame `7991:60605` 739×916.

Talent Welcome/DOB/Personal panels use an **aspect-locked, letter-boxed stage** (`talentAuth/TalentPanelParts.jsx`: `PanelStage`, `StageCard`, …, 739×916 / welcome 739×976) with every size in `cqw` of the stage — chosen over the plain `photoCards` layer because % of a short panel still lets cards overlap. Contact/Address/Education share `TalentContactPanelContent` (`TALENT_CONTACT_PHOTO_CARDS` + `TalentContactOverlay`); Login uses `TalentLoginPanelContent`. The old `OnboardingRightPanel` is now **unused** (delete candidate; it carries the one pre-existing lint warning).

## Other shared changes

| Change                                                                                                                                        | File                                                                                                                              |
| --------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `ScrollChevronRow` (hidden scrollbar + left/right chevrons only on overflow; centres the current item)                                        | `components/ui/ScrollChevronRow.jsx`; used by `OnboardingHeader`, `ParentOnboardingBreadcrumb`, `InstitutionOnboardingBreadcrumb` |
| `font-heading` (Bricolage Grotesque) / `font-ui` (Instrument Sans) tokens; fonts loaded globally                                              | `src/index.css`, `index.html`                                                                                                     |
| `Card` prop `headlineVariant='display'\|'heading'` (heading = Bricolage 600 21/26.25); used by GetStarted + RecruiterType; HomePage unchanged | `components/ui/Card.jsx`                                                                                                          |
| `Field` message row gets `id={htmlFor}-msg` (the target of controls' `aria-describedby`); required `*` is now `font-ui` `#2E8B57`             | `components/ui/form/Field.jsx`                                                                                                    |
| `AUTH_ROUTES.recruiter`, `getAuthRole` → `'recruiter'`                                                                                        | `constants/authRoutes.js`                                                                                                         |
| Responsive gate: recruiter routes added; `--heights=560` short-screen option                                                                  | `tests/e2e/helpers/responsive.js`, `scripts/responsive-audit.mjs`                                                                 |

Responsive gate usage: `node scripts/responsive-audit.mjs --only=<route fragment>` (320/375/768/1024/1440) and `node scripts/responsive-audit.mjs --widths=1280,1024 --heights=560 --only=<fragment>` (needs the dev server on `:5199`; `PW_CHROMIUM_PATH`). It fails on any page-level horizontal scroll or element past the right edge.

## Assets (all Figma exports) `✅ VERIFIED`

Folders: `src/assets/recruiter-onboarding/{panel,profile,organisation,billing,closing}/`, `src/assets/entry/`, `src/assets/talent-onboarding/`, new panel photos `src/assets/hero/talent-*-panel-*.webp` + `talent-panel-fig-photo-*.webp`, `src/assets/recruiter-onboarding/recruiter-panel-photo-*.webp`. Each notes file lists icon → node id → file; the key ones:

- Role cards (default + selected): `entry/role-{student,parent,recruiter}-{default,selected}.svg` (Figma exports include the 62px tile; student stays grey when selected, as in Figma).
- Organisation logos (png @3x): nodes `7374:4811, 4818, 4825, 5052`. Payment logos: `7377:7172, 7173, 7175`.
- Single-colour icons are rendered as CSS masks so one Figma shape takes the state colour.
- Export helpers (not in repo): REST `GET /v1/images/{key}?ids=…&format=svg|png&scale=…`; raw bitmaps behind photo fills via `GET /v1/files/{key}/images` (imageRef).

**Not exportable / not from Figma** (no node, `visible:false`, or API returns no image): spinner (no vector node; processing = disabled CTA + `aria-busy` + sr-only text), Review checkbox tick, contact lockout modal pencil/alert, education error callout icons, login auth-error alert (node `2388:19397` → NO IMAGE; toast frame `2849:55870` not in our frames), welcome toast check/X (`8027:202240/202248` hidden — identical components reused from visible nodes), "Almost there." star (frame `8027:204256` is ONE bitmap → pixel crops). Shared-kit icons still in `assets.jsx` (user/lock/card/alert/arrow, Summary\*) belong to the form kit.

## Figma node map (frames → implementation)

**Recruiter** (`7374:*`): see the Routes table above (frame ranges per page; states are interaction states of ONE page, not separate routes).

**8027 frames**
| Frames | Implemented in |
| --- | --- |
| roles `200428/201634/201877/201147/201390/200903/200660` | `GetStartedPage` (selection states + per-role loader) |
| `202121` "toast message-3seconds" | **not a toast** — the talent Welcome screen ("Welcome. Here's what happens next.") → `OnboardingWelcomePage` (toast `visible:false` in Figma; shown 3 s) |
| `202348/202575` role flow/loader, `202802…203626` DOB, `203832/204038` loading, `204256` interstitial, `204258` minor | `OnboardingWelcomePage`, `OnboardingDobPage` (+ "Almost there." overlay for minors) |
| personal `204466…205770` | `OnboardingPersonalInfoPage` |
| contact `206090…207566` | `OnboardingContactPage` |
| address `209062,208849,208636,209325,208423` | `OnboardingAddressPage` |
| education `209541,209997,210208,209752,210419` | `OnboardingEducationPage` |
| review `210690…213119,211051,211501,211943` | `OnboardingReviewPage` (Review CTA copy now "Complete Registration") |
| success `213532,213647,213887` | `OnboardingDonePage` (`213647` is the Review frame) |
| login `214133/214479/214691/214903` | `LoginPage` (API wiring untouched) |
| tutorial `207819` (video view), `208116` (4-step walkthrough) | `talentAuth/LoginTutorialModal.jsx`; Watch Tutorial → video view, big play circle → steps view (**assumption**, Figma has no connectors) |

## Behaviour notes / assumptions (read before changing)

- **Talent flow stays API-wired.** Only presentation changed; e2e specs `onboarding-adult/minor` now expect `/onboarding/talent/done` after activation and the helper clicks "Complete Registration" (`tests/e2e/helpers/onboarding.js`). The e2e suite needs the staging API and was **not run** here.
- Talent Review keeps its Terms/Privacy **links** (they open the real student legal modals the e2e clicks through). The recruiter Review keeps them **plain text** exactly as Figma shows (owner has no recruiter legal copy).
- Header percent: talent 8027 frames show **78%** everywhere (passed as `percent={78}`); the bar fill in Figma is ~55%, the label is 78.
- Panel photos: new Figma photos (talent DOB/Personal/Welcome/Contact/Address/Education + recruiter) — recruiter ones are de-rotated 3× exports of the Figma image frames (dot pattern baked in).
- Done (recruiter): default active+Professional; admin new-org default tier Free; CTA → `/recruiter/home`; card links → job-postings / talent-search / home (no settings route exists).
- Payment: only `{method,status,brand,last4}` leave the page; PAN/CVV live in component state and are cleared on success. `createPayment` is the integration seam for a hosted provider (Figma mentions Paystack).
- Preferences: the CTA is **not** `disabled` (so it stays focusable); it uses `aria-disabled` + the pinned grey state; submitting without a scope shows Figma's error frame `9556`.
- Copy typos kept as Figma (recruiter): "Hub,Kwame." (no space), missing em dashes ("organisation you approve", Done banners), "Pending approval : post…". Em-dash versions used on plan/payment where noted in the agents' notes.

## Open items / decisions pending

1. **Education CTA** — Figma says "Your Education Level" (looks like a placeholder, not a button label); app keeps **"Continue"** (also e2e regex `/^continue/`). Confirm with the owner.
2. **Review loader** — Figma shows loader label "One Sec" on the talent Review CTA; not applied.
3. **Login tutorial steps 2–4** — Figma text layers are empty; chapter title/description reused. Watch Tutorial in the login panel is `visible:false` in Figma but kept (only trigger).
4. **talentB deferred audits** — OTP error / expired / lockout frames (`8027:207001`), address + education modals, Review page body pixel diff, OTP cell "-" placeholder + 4px gap (form kit), `*` on optional address fields, helper diamond icon (TextInput uses a circle), `Select` does not forward `helperIcon/helperTextClassName`.
5. **Org logos for unknown orgs** fall back to an initials tile; MTN Foundation / MoMo have no admin/plan in Figma (derived copy "the Primary Admin").
6. **Visual baselines** (`npm run test:visual`, desktop-visual) were **not refreshed** — talent pages and the breadcrumb changed on purpose; refresh deliberately.
7. **Cleanup**: delete `OnboardingRightPanel.jsx` (unused); two comments still mention it. `.mcp.json` in this repo contains a committed Figma token (rotate/remove — see log).
8. Mobile layouts for every new screen are **derived** from desktop (Figma has no mobile frames).
9. Figma token note: never put the PAT in a tracked file; use an env var.
