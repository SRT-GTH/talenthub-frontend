# Recruiter job prospecting (V2.0) — `/recruiter/*`

> Figma file `OHG2xsfCCskT8xEn356njv`, page "Job - Prospecting screens" (`5566:50658`), the 29 frames of the sections Home, Talent Search, Job Templates, Job Postings, Job Screening, Application Pipeline, Messages. Built 2026-11-04 on top of the pages first built 3 Oct from an older version of the same frames. `🔗 EXTERNAL`
> The other recruiter pages of the Figma file (newer, more states) were not part of this flow and are **not built**: see [recruiter-figma-pages-map.md](recruiter-figma-pages-map.md).

## Frame → URL → diff

Diff % = our screenshot vs the Figma export (`recmp`, viewport 1728 wide, whole frame; 2026-11-04). `✅ VERIFIED` (measured, not eyeballed). Residual 2–8 % is `🔶 LIKELY` mostly the SF Pro Rounded font not being loaded, anti-aliasing and the browser-toolbar strip; Messages talent view (M4/M5) and the filled schedule steps (AP5/8/9) are the highest, see "Known gaps".

| Code | Frame                       | Figma node   | URL                                                                                                        | Diff % (2026-11-22)                                                                |
| ---- | --------------------------- | ------------ | ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| H1   | New user                    | `7249:73882` | `/recruiter/home?view=setup`                                                                               | 2.7                                                                                |
| H2   | Existing a                  | `8063:45341` | `/recruiter/home?view=setup&user=existing&actionsMenu=elena-sterling&hoveredAction=mark-as-accepted`       | 3.9                                                                                |
| H3   | Existing b                  | `8193:78567` | `/recruiter/home?view=setup&user=existing&actionsMenu=marcus-jensen`                                       | 3.8                                                                                |
| H4   | Existing c                  | `8193:79434` | `/recruiter/home?view=setup&user=existing&actionsMenu=leila-wong`                                          | 3.8                                                                                |
| H5   | Existing d                  | `8193:80078` | `/recruiter/home?view=setup&user=existing&actionsMenu=arthur-blair`                                        | 3.8                                                                                |
| TS   | Talent search               | `7249:74283` | `/recruiter/talent-search`                                                                                 | 3.8                                                                                |
| JT1  | Templates All               | `7249:75046` | `/recruiter/job-templates`                                                                                 | 3.7                                                                                |
| JT2  | Templates filter pill       | `7249:75464` | `/recruiter/job-templates?category=design`                                                                 | 2.6                                                                                |
| JP1  | Postings All                | `7249:75818` | `/recruiter/job-postings`                                                                                  | 2.3                                                                                |
| JP2  | Postings Draft              | `7249:76277` | `/recruiter/job-postings?status=draft`                                                                     | 1.9                                                                                |
| JP3  | Postings card menu          | `7249:76638` | `/recruiter/job-postings?menu=senior-ux-designer`                                                          | 2.4                                                                                |
| JP4  | Postings menu hover         | `7249:77110` | `/recruiter/job-postings?menu=senior-ux-designer&menuItem=duplicate`                                       | 2.4                                                                                |
| JP5  | Closing confirmation        | `7249:77582` | `/recruiter/job-postings?modal=close-posting&posting=senior-ux-designer`                                   | 17.4 (superseded: lighter scrim and old sidebar; the current dialog is JM-10, 3.5) |
| JS1  | Screening criteria          | `7249:78066` | `/recruiter/job-screening`                                                                                 | 3.2                                                                                |
| JS2  | Screening dropdown hover    | `7249:78533` | `/recruiter/job-screening?dropdown=experience&dropdownItem=2-5`                                            | 3.3                                                                                |
| AP1  | Pipeline                    | `7249:79017` | `/recruiter/application-pipeline`                                                                          | 4.8                                                                                |
| AP2  | Pipeline job dropdown hover | `7249:79474` | `/recruiter/application-pipeline?sidebar=collapsed&dropdown=job-posting&forceHover=senior-ux-designer`     | 2.7                                                                                |
| AP3  | Schedule empty 1            | `7249:79940` | `/recruiter/application-pipeline?sidebar=collapsed&modal=schedule-interview`                               | 3.9                                                                                |
| AP4  | Schedule empty 2            | `7249:80546` | `/recruiter/application-pipeline?sidebar=collapsed&modal=schedule-interview&interviewers=open`             | 3.8                                                                                |
| AP5  | Schedule filled 1           | `7249:81163` | `/recruiter/application-pipeline?sidebar=collapsed&modal=schedule-interview&state=filled&format=online`    | 5.5                                                                                |
| AP6  | Cancel interview confirm    | `7249:81797` | `/recruiter/application-pipeline?sidebar=collapsed&modal=cancel-interview`                                 | 2.7                                                                                |
| AP7  | Schedule confirm            | `7249:82258` | `/recruiter/application-pipeline?sidebar=collapsed&modal=schedule-confirmation`                            | 3.0                                                                                |
| AP8  | Schedule filled 2           | `7249:82719` | `/recruiter/application-pipeline?sidebar=collapsed&modal=schedule-interview&state=filled&format=in-person` | 5.5                                                                                |
| AP9  | Schedule filled 3           | `7249:83356` | `/recruiter/application-pipeline?sidebar=collapsed&modal=schedule-interview&state=filled&format=phone`     | 5.4                                                                                |
| M1   | Recruiter dropdown          | `7249:83993` | `/recruiter/messages`                                                                                      | 12.5 (superseded by the R-MSG inbox)                                               |
| M2   | Message dropdown a          | `7249:84379` | `/recruiter/messages?rail=collapsed&menu=thread&compareMenu=talent-side&forceHover=mute`                   | 13.0 (superseded by the R-MSG inbox)                                               |
| M3   | Message dropdown b          | `7249:84775` | `/recruiter/messages?rail=collapsed&tab=unread&menu=thread&forceHover=mute`                                | 5.5                                                                                |
| M4   | Talents messages a          | `7249:85147` | `/recruiter/messages?view=talent`                                                                          | 6.4                                                                                |
| M5   | Talents messages b          | `7249:85536` | `/recruiter/messages?view=talent&menu=thread&forceHover=mute`                                              | 6.7                                                                                |

Home frames sit at `?view=setup` because bare `/recruiter/home` now renders the Recruiter dashboard (built by another session from the "Recruiter - Dashboard" page, see [recruiter-dashboard.md](recruiter-dashboard.md)).

## URL keys (state is in the URL, no route guards, mock data)

- Home: `view=setup`, `user=existing`, `actionsMenu=<applicantId>`, `hoveredAction=<action>`.
- Talent search: `tab=top-matches|available-now`, `q=`, `filters=open`.
- Job templates: `category=<design|healthcare|…>`.
- Job postings: `status=active|draft|closed`, `menu=<postingId>`, `menuItem=<action>`, `modal=close-posting&posting=<postingId>`.
- Job screening: `dropdown=experience`, `dropdownItem=<value>`.
- Pipeline: `sidebar=collapsed`, `dropdown=job-posting`, `forceHover=<postingId>`, `modal=schedule-interview|cancel-interview|schedule-confirmation`, `state=empty|filled`, `format=online|in-person|phone`, `interviewers=open`.
- Messages: `rail=collapsed`, `tab=unread`, `conversation=<id>`, `thread=open`, `menu=thread`, `compareMenu=talent-side`, `forceHover=mute`, `view=talent`.
- Pinned-hover keys (`forceHover`, `hoveredAction`, `menuItem`, `dropdownItem`) reproduce the Figma hover frames and sit alongside real `:hover`. Each section file lists its keys in a header comment (`pipelineUrlState.js`, `recruiterHomeState.js`, `useRecruiterMessagesUrlState.js`).

## What changed

- Shell (`sections/dashboard/*`): recruiter rail 303 px, 87 px top bar, grey content canvas, public-profile card, Job Postings badge; recruiter-only gating so Talent pages keep their look (Talent `/job-postings` and `/community` rendered normally after the change, no pixel baseline from before the change, `🔶 LIKELY` unchanged).
- Sans-serif page titles via `RecruiterPageHeading` (`titleStyle="sans"`, `"sans-accent"`), optional `actionIcon` on `RecruiterListToolbar`, `NavBadge` `solid`, `DashboardPageBackground variant="recruiter"`.
- New: `recruiterHome/` (hiring overview, applicants table with row-action menus), `recruiterMessages/` (inbox, thread, options menu, job-proposal card, talent-view shell), `applicationPipeline/pipelineUrlState.js` and board icons; exported icons live in each section's own `*Icons.jsx`, avatars under `src/assets/recruiter/{talent-search,application-pipeline,messages}/` with descriptive names.

## Verification (2026-11-04)

- `eslint` 0 problems and `prettier --check` clean on all recruiter / dashboard section folders; `npm run build` passes.
- Responsive audit (320 / 390 / 1024 / 1440) on 39 URLs: no horizontal overflow, no text under 12 px, no blank page on any recruiter route. Found and fixed: row checkboxes under 24 px on the existing-user home table at phone width (now 24 px below `lg`, 16 px from `lg`). Still failing, **not fixed, not ours**: bare `/recruiter/home` (the other session's dashboard) has 5 button labels that wrap at 320 and 390 ("Recruiting on behalf of MTN Ghana", "45 Applied submitted", …).
- Console: no errors on `/recruiter/messages` and `?conversation=…&thread=open`. `?view=talent` logs 401s from the talent home data calls (`talentHome.api`, e.g. `/api/notifications`, `/api/streak`) because the talent shell is mounted without a signed-in session; Talent `/home` logs the same 401s, so it is the talent shell's live-data behaviour, not a recruiter bug (`🔶 LIKELY`, not traced into the shell code).

## Known gaps and assumptions

- Phone layouts: Figma draws 1728 px frames only. The phone/tablet behaviour is our own dense layout `⚠️ ASSUMPTION`.
- The existing recruiter pages have no `playful:` variants, and this Figma draws one style only, so nothing Playful was added.
- Playfair Display 400 (Insight banner title) was added to the Google Fonts link in `index.html` on 2026-11-04; not yet re-measured after the change.
- Recruiter persona colour (Forest Green `#1F4A2B`): only the new-user hero gradient uses it; no `--color-persona-recruiter` token was added to `src/index.css`.
- Messages talent view (`?view=talent`) reuses the talent shell; its sidebar differences from the Figma frame (Wallet item, badges, style toggle) are not reconciled.
- "Reshedule interview" is spelled as drawn in Figma (typo kept).
- A live signed-in pipeline (real data, drag, API) was not tested; everything is mock.
- Frame contents were compared by diff % plus a look at worst cells, not every string re-checked after the final edits.

## Figma compare (2026-11-22)

Diff column re-measured. Method: 0.5x Figma exports vs a Playwright screenshot at the frame's size (viewport = frame height − 52 for the Safari toolbar on recruiter frames; no toolbar on /data), compared at the export's resolution, whole frame. 2–4 % = font metrics; dialogs read higher because Figma centres them in the taller frame. `✅ VERIFIED` (measured 2026-11-22). Superseded frames read high: JP5 17.4 % (lighter scrim and the old Joel sidebar; the current close dialog is JM-10, 3.5 %), M1 / M2 12–13 % (`/recruiter/messages` now renders the newer R-MSG inbox). Not changed.
