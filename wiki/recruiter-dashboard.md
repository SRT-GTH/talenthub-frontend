# Recruiter dashboard — `/recruiter/home` (Figma "Recruiter - Dashboard")

> Source: file `OHG2xsfCCskT8xEn356njv` ("Gh Design system · Recruiter"), canvas `10005:38660`, 8 sections (D01–D74). Built 2026-11-04, **one visual style** (the frames are not Playful / Focused pairs), frontend-only mock data, no route guards. `🔗 EXTERNAL`
> The canvas is **one dashboard page drawn about 50 times**: every frame is the same 1728×2415 page in a different state. So it is one route, `RecruiterDashboardSection`, with every state in the URL.

## Frame → URL table (`✅ VERIFIED` by `framecmp.mjs`, 2026-11-04)

Diff % is the whole-frame pixel difference against the Figma export at 0.5× (viewport = frame height − 52). SF Pro Rounded is not installed, so 2–4 % is font metrics; dialogs read higher because Figma centres them in a ~1100px viewport and the test viewport is 2360px tall. Hot spots are the top bar and rail edges.

| D01 `10049:58645` | ``| 4.0 | Landing: hero, stats, six widgets, workspace rail. |
| D02`10049:59816`|`?panel=org` | 4.1 | Org switcher open (`panel=org`). |
| D03 `10050:61097`|`?org=hubtel&loading=1` | 2.9 | Skeleton while switching (`org=hubtel&loading=1`). |
| D04 `10057:63699`|`?org=hubtel&toast=switched`| 5.4 | Switched toast with Undo. |
| D05`10057:64965`|`?org=single`| 4.0 | One affiliation: switcher without chevron or menu. |
| D06`10064:36501`|`?org=pending`| 4.6 | Read-only banner, "Read-only" pills, upload / invite / row actions disabled. |
| D07`10066:38322`|`?org=none`| 2.2 | No affiliation: link card replaces the widgets. |
| D08`10067:39673`|`?org=hubtel&toast=revoked`| 5.7 | Revoked toast (warning tone), switched to Hubtel. |
| D10`10075:46753`|`?panel=notifications`| 4.6 | Notifications pop-up, 5 new. |
| D11`10078:59484`|`?panel=notifications-empty`| 4.3 | All caught up. |
| D12`10078:60996`|`?toast=offline`| 5.4 | Offline warning toast only; the "5+" bell badge is not drawn in the build (bell stays "5"). |
| D13`10078:62351`|`?panel=search`| 4.0 | Search focused: recent searches and quick filters. |
| D14`10078:63760`|`?panel=search&q=Akua`| 4.1 | Search results for "Akua" (mock; any text starting with akua). |
| D15`10083:66139`|`?panel=search&q=Zxqy`| 3.9 | No results (any other text). |
| D16`10083:74812`|`?panel=language`| 4.1 | Language list. |
| D17`10084:76398`|`?panel=a11y`| 4.2 | Shared`TalentA11yMenu`. |
| D20 `10084:77697`|`?menu=sort`| 4.0 | Sort menu open (two identical D20 frames exist;`10084:77697`compared). |
| D22`10084:80121`|`?jobMenu=marketing-intern&dialog=pause&job=marketing-intern`| 5.1 | Pause dialog over the open row menu. Diff includes the dialog being centred in the tall test viewport. |
| D23`10084:81365`|`?jobMenu=marketing-intern&dialog=close&job=marketing-intern`| 7.6 | Close dialog. Same centring effect. |
| D24`10084:82807`|`?paused=marketing-intern&toast=paused`| 5.4 | Paused toast + "Paused" status. |
| D25`10084:84047`|`?jobs=empty`| 4.5 | Jobs empty. |
| D26`10084:85289`|`?jobs=suspended`| 4.2 | Organisation suspended. |
| D28`10084:86395`|`?jobs=error`| 4.2 | Load error with Retry. |
| D30`10182:49587`|`?menu=talents`| 4.0 | Talents job filter menu. |
| D31`10182:50839`|`?menu=talents&dialog=invite&talent=akua`| 8.8 | Invite dialog; Figma also leaves the filter menu open behind it. Centring effect. |
| D32`10183:59849`|`?menu=talents&toast=invited`| 5.4 | Invite sent toast (filter menu open as drawn). |
| D33`10183:61167`|`?menu=talents&saved=kofi&toast=saved`| 5.4 | Saved to pool toast with Undo (filter menu open as drawn). |
| D34`10194:85325`|`?hint=hidden`| 4.1 | Anonymised card highlighted with the "Identity hidden" note. |
| D35`10194:86559`|`?talents=empty`| 3.9 | No matches. |
| D36`10194:87990`|`?talents=loading`| 3.7 | Skeleton cards. |
| D40`10194:90079`|`?menu=pipeline`| 4.1 | Pipeline job filter menu. |
| D41`10194:91343`|`?window=7d`| 4.9 | 7-day numbers (14 / 9 / 5 / 3 / 1 / 0). |
| D42`10195:92692`|`?stage=interview`| 13.3 | Drill-in drawer. Figma draws a second, 7-day funnel under the 30-day one; not copied. Centring effect. |
| D43`10195:94029`|`?pipeline=empty`| 4.8 | Too few candidates. |
| D44`10195:95267`|`?pipeline=loading`| 4.0 | Funnel skeleton. |
| D50`10195:96482`|`?verify=verified`| 3.4 | Both verified + "Verified recruiter" banner. |
| D51`10195:97739`|`?dialog=upload&step=choose`| 7.8 | Upload dialog, choose step. Centring effect. |
| D52`10195:99049`|`?dialog=upload&step=uploading`| 6.3 | Uploading (64 % / queued). |
| D53`10195:100340`|`?menu=talents&toast=uploaded`| 5.4 | Uploaded toast (filter menu open as drawn). |
| D54`10195:101559`|`?verify=rejected`| 4.0 | TIN rejected, reason, cooldown, disabled re-upload. |
| D55`10195:104281`|`?verify=owner`| 5.0 | Not an owner (403), "Notify Ama Owusu". |
| D60`10195:105586`|`?menu=region`| 4.0 | Region menu. |
| D61`10195:106816`|`?menu=industry`| 4.1 | Industry menu. |
| D62`10195:109061`|`?region=national`| 4.0 | Ghana · National rows (the second "D61" frame`10195:109061`). |
| D63 `10195:110455`|`?region=upper-west`| 3.9 | Upper West: not enough activity. |
| D64`10195:111681`|`?region=tamale&industry=agriculture`| 3.7 | Tamale · Agriculture: no signal. |
| D70`10197:115334`|`?feedback=mine`| 4.5 | My feedback tab. |
| D71`10197:118025`|`?feedback=mine&dialog=feedback&candidate=elena`| 8.9 | Feedback form. Centring effect. |
| D72`10197:119299`|`?feedback=mine&dialog=feedback&candidate=elena&draft=short`| 9.1 | Too-short validation (4 stars drawn). |
| D73`10198:120711`|`?feedback=mine&toast=sent`| 5.8 | Feedback sent toast. |
| D74`10198:122028`|`?withdrew=marcus` | 4.0 | Candidate withdrew: dimmed row, "Closed". |

Summary: min 2.2 %, max 13.3 %, median 4.2 % over 51 compared frames. All 51 distinct frames are built; the "5+" bell badge drawn in D12 is the one detail that is not (see inconsistencies).

## URL state

All keys are optional; an empty value removes the key. Set through `useRecruiterDashboardState.set()` (reads the live URL, so timers cannot overwrite it).

| Key                                                        | Values                                                                                                                                        | Frames                                   |
| ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- | --------------------------------- |
| `org`                                                      | `mtn` (default) · `hubtel` · `single` · `pending` · `none`                                                                                    | D03–D08                                  |
| `panel` (+ `q`)                                            | `org` · `org-inline` (the copy shown below `lg`) · `notifications` · `notifications-empty` · `language` · `a11y` · `search` (`q` = the query) | D02, D10, D11, D13–D17                   |
| `loading`                                                  | `1`                                                                                                                                           | D03                                      |
| `toast`                                                    | `switched` · `revoked` · `paused` · `invited` · `saved` · `uploaded` · `sent` · `offline`                                                     | D04, D08, D12, D24, D32, D33, D53, D73   |
| `sort`, `menu`, `jobMenu`                                  | `urgent` / `recent` / `applicants`; `sort` · `talents` · `pipeline` · `region` · `industry`; a job id                                         | D20, D22, D23, D30, D40, D60, D61        |
| `dialog` (+ `job`, `talent`, `candidate`, `step`, `draft`) | `pause` · `close` · `invite` · `upload` (`step=choose                                                                                         | uploading`) · `feedback` (`draft=short`) | D22, D23, D31, D51, D52, D71, D72 |
| `paused`, `saved`, `withdrew`                              | comma list of ids / one id                                                                                                                    | D24, D33, D74                            |
| `jobs`, `talents`, `pipeline`                              | `empty` · `suspended` · `error`; `empty` · `loading`; `empty` · `loading`                                                                     | D25–D28, D35, D36, D43, D44              |
| `hint`                                                     | `hidden`                                                                                                                                      | D34                                      |
| `window`, `stage`, `pipelineJob`                           | `7d` · `90d`; a stage id; a job id                                                                                                            | D41, D42                                 |
| `verify`                                                   | `verified` · `rejected` · `owner`                                                                                                             | D50, D54, D55                            |
| `region`, `industry`                                       | `national` · `upper-west` · `tamale` …; `agriculture` …                                                                                       | D60–D64                                  |
| `feedback`                                                 | `mine`                                                                                                                                        | D70–D73                                  |
| `view`                                                     | `setup` = the earlier "Let's get you ready" home                                                                                              | —                                        |

## Files

- `src/components/sections/recruiterDashboard/`: `RecruiterDashboardSection.jsx` (page), `useRecruiterDashboardState.js`, `recruiterDashboardData.js` (all copy), `recruiterDashboardIcons.js`, widgets `DashHero` / `ActiveJobsWidget` / `VerificationWidget` / `PipelineWidget` / `FeedbackWidget` / `TalentsWidget` / `SkillsWidget` / `OrgLinkCard`, `OrgSwitcher`, `WorkspaceSidebar`, `DashboardSkeleton`, dialogs `JobDialogs` / `TalentDialogs` / `UploadDialog` / `StageDrawer` / `FeedbackParts`, `TopBarPanels`, `SearchPanel`.
- New shared `src/components/ui/`: `Chip`, `WidgetCard`, `FilterSelect`, `Callout`, `BannerToast`, `InlineState`, `SkeletonBlock` (see [components.md](components.md)). Add-only props: `form/Textarea` (`counterSuffix`, `counterErrorTone`), `dashboard/DashboardShell` (`orgSlot`, `panels`, `renderSidebar`), `dashboard/DashboardTopNav` (`orgSlot`, `panels`).
- Assets: `src/assets/recruiter-dashboard/` (≈ 100 files, purpose-named; exported from Figma, not redrawn), `src/assets/ui/banner-toast-*.svg`.
- Page: `src/pages/recruiterHome/RecruiterHomePage.jsx` (`?view=setup` → the earlier home). Tests: `tests/e2e/recruiter-dashboard.spec.js` (15).

## Decisions and ⚠️ assumptions

- Font: SF Pro Rounded (bundled as `GTH Parent Rounded`) is switched on for the dashboard with `useScopedRoundedFont('data-recruiter-ui')` (added 2026-11-05; the pixel table above was measured before that, so the diffs should only improve). Bricolage Grotesque and Instrument Sans were already loaded.

- ⚠️ **`/recruiter/home` now shows the dashboard**; the earlier "Let's get you ready" home (Figma `7249:73882`) moved to `?view=setup`. Another session was editing that home in the same working tree at the time; check with them.
- ⚠️ The organisation name in the copy ("Live roles for …", "KYB · …", the hero line) follows the selected organisation. Figma keeps "MTN Ghana" in every frame, including after switching to Hubtel or Zeepay (D04, D06, D08).
- ⚠️ Below `lg` the org switcher is rendered at the top of the page content (no phone frame exists); the two-column widget rows stack below `xl`.
- ⚠️ 90d window reuses the 30d numbers; picking a job in the funnel or talents filter changes the label only (no per-job frame).
- ⚠️ A saved talent shows a filled bookmark (D33 draws only the toast); a chosen Needs work / Good / Strong fills green; the invite Role is read-only; the funnel drill-in shows the five rows drawn (Figma has "+ 2 more" and a sixth row as hidden layers).
- ⚠️ Search: the results are mock data for "Akua" (text starting with akua); other text shows the no-results card; nothing opens. The key legend and the scope note are always shown as drawn.
- ⚠️ Notification rows: "Shortlist", "See pipeline", "See Details", "Search Talents", "Mark all read" only log (no destination drawn).
- Forest Green `#1F4A2B` is **not used** by any of the 51 frames; everything is Brand Green, so no persona token was added (see [recruiter-design-system-gaps.md](recruiter-design-system-gaps.md)).
- Text at 10px (funnel stage sub-labels, the cooldown line) is kept as drawn at ≥ 1280px and bumped to 12px below; the 10px "Recruiting on behalf of" caption is 12px below `lg`.

## Figma inconsistencies

- Layer names say "Solis Finance" / "Kente Labs Ghana" for the rows that read Hubtel Ltd / Zeepay Ghana Ltd; the visible text is used.
- D20 and D61 each exist twice; the second D61 (`10195:109061`) is the national view (it should be D62). D53 and D31–D33 leave the talents filter menu open behind the toast / dialog. D42 contains the 30-day and the 7-day funnel stacked.
- D12 is titled "5+ badge & offline" but draws the same "5" badge; only the warning toast is built.
- The empty-state counters read "0 / 500 · minimum 20" (D71) but the tool's other textareas read "0 / 500": handled with the add-only `counterSuffix`.

## Verification (2026-11-04)

`npx eslint src` clean · `npx prettier --check` on every changed file clean · `npm run build` passes · `tests/e2e/recruiter-dashboard.spec.js` 15 / 15 · responsive audit at 320 / 390 / 1024 / 1440 over 20 URLs: no horizontal scroll, no browser console errors, buttons on one line, text ≥ 12px except 10–11px micro-labels at ≥ 1024px (funnel stage sub-labels and the cooldown line at ≥ 1280px; the shared Textarea counter and the bell tab count at 1024–1279px follow their own components) · pixel table above.
**Not verified:** Playful (none drawn), screen-reader pass, keyboard walk-through of every dialog, the whole `npm run test:e2e` suite, Safari / Firefox.
