# Recruiter Talent Search — `/recruiter/talent-search`

> Figma file `OHG2xsfCCskT8xEn356njv`, page "Recruiter - Talent Search" (`10102:34349`), section `10102:35181`, 19 frames TS-01 … TS-19 at 1728 wide. Built 2026-11-06 (two parallel builders: list TS-01…10, profile TS-11…19; the lead measured and verified). `🔗 EXTERNAL`
> Extends the Talent Search frame of the older "Job - Prospecting screens" page ([recruiter-job-prospecting.md](recruiter-job-prospecting.md)). TS-01 differs from that older frame (workspace rail, Sort control, "Invite to apply"), so the existing page was updated, not only extended.

## Frame → URL → diff

Diff % = our screenshot vs the Figma export (`recmp`, whole frame, 2026-11-06). `✅ VERIFIED` (measured). The 1.8–3.5 % floor is the Ask Buddy button (Figma pins it at y=1000, the shell pins it to the viewport bottom) plus font and anti-aliasing differences. TS-12 and TS-17 sit at 7–8 % because Figma centres the dialog in a 1117 px frame while the measurement viewport is taller, so the dialog is about 24 px lower than drawn; at a 1065 px viewport the builder measured size, spacing and content as matching (not re-measured by the lead).

| Frame | Figma node    | Content                                      | URL                                                                                        | Diff |
| ----- | ------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------ | ---- |
| TS-01 | `10102:35182` | Search results · Senior Product Engineer     | `/recruiter/talent-search`                                                                 | 3.4% |
| TS-02 | `10102:35928` | Typing with suggestions                      | `/recruiter/talent-search?typed=react%20nat&menu=search`                                   | 3.3% |
| TS-03 | `10102:36711` | Skills dropdown open                         | `/recruiter/talent-search?menu=skills`                                                     | 3.4% |
| TS-04 | `10102:37497` | Experience dropdown open                     | `/recruiter/talent-search?menu=experience`                                                 | 3.4% |
| TS-05 | `10102:38259` | Location dropdown open                       | `/recruiter/talent-search?menu=location`                                                   | 3.5% |
| TS-06 | `10102:39808` | More filters drawer                          | `/recruiter/talent-search?menu=more-filters`                                               | 3.6% |
| TS-07 | `10102:39044` | Sort dropdown open                           | `/recruiter/talent-search?menu=sort`                                                       | 3.4% |
| TS-08 | `10102:40600` | Results loading                              | `/recruiter/talent-search?state=loading`                                                   | 1.3% |
| TS-09 | `10102:40895` | No results · suggestions                     | `/recruiter/talent-search?state=empty&exp=10-plus&remote=0`                                | 1.9% |
| TS-10 | `10102:41213` | First visit, no search yet                   | `/recruiter/talent-search?state=first-visit`                                               | 2.9% |
| TS-11 | `10102:41537` | Candidate profile · Kofi Amankwah            | `/recruiter/talent-search/kofi-amankwah`                                                   | 1.8% |
| TS-12 | `10102:41967` | Invite to apply · choose job and message     | `/recruiter/talent-search/kofi-amankwah?modal=invite`                                      | 7.9% |
| TS-13 | `10102:42428` | Invite sent · profile updated                | `/recruiter/talent-search/kofi-amankwah?invited=senior-product-engineer&toast=invite-sent` | 3.3% |
| TS-14 | `10102:42870` | Save · choose a list                         | `/recruiter/talent-search/kofi-amankwah?menu=save`                                         | 1.8% |
| TS-15 | `10102:43324` | Saved · toast                                | `/recruiter/talent-search/kofi-amankwah?saved=job-shortlist&toast=saved`                   | 3.3% |
| TS-16 | `10102:43766` | Profile overflow menu                        | `/recruiter/talent-search/kofi-amankwah?menu=more`                                         | 1.8% |
| TS-17 | `10102:44219` | Add to a job pipeline · choose job and stage | `/recruiter/talent-search/kofi-amankwah?modal=pipeline`                                    | 7.3% |
| TS-18 | `10102:44676` | Added to pipeline · toast                    | `/recruiter/talent-search/kofi-amankwah?pipeline=shortlisted&toast=pipeline-added`         | 3.3% |
| TS-19 | `10102:45118` | Applicant profile · Ama Boateng              | `/recruiter/talent-search/ama-boateng`                                                     | 1.8% |

## URL keys (state in the URL, mock data, no route guards)

- List (`/recruiter/talent-search`): `tab`, `q`, `typed` (pins the typed-suggestion state), `menu=skills|experience|location|sort|more-filters|search` (`filters=open` is an alias of `more-filters`), `state=loading|empty|first-visit`, `job`, `skills`, `exp`, `location`, `remote=0`, `radius=1`, `sort`, `availability`, `setup`, `education`, `score`, `pay`, `verified=0`, `adult=0`, `hidePipeline=1`. Documented in the header of `TalentSearchSection.jsx` and `useTalentSearchState.js`.
- Profile (`/recruiter/talent-search/:candidateId`, ids `kofi-amankwah`, `ama-boateng`): `job`, `modal=invite|pipeline`, `menu=save|more`, `invited=<jobId>`, `saved=<listId>`, `pipeline=<stageId>`, `toast=invite-sent|saved|pipeline-added`. Documented in the header of `TalentCandidateProfileSection.jsx`.
- No hover-pin key: no frame of this page draws a hover state.
- Navigation wired: View profile goes to `/recruiter/talent-search/<id>?job=…`; Invite to apply on a card goes to `…/<id>?modal=invite&job=…` (`⚠️ ASSUMPTION`, no frame draws it from the list); profile Back goes to the list (Ama: `/recruiter/messages`, as TS-19 draws "Back to Messages"); Message and Open Conversation go to `/recruiter/messages`; View in Pipeline goes to `/recruiter/application-pipeline`.

## Files

- List: `sections/talentSearch/*` (Section, FilterBar, Header, CandidateCard, Menus, Suggestions, MoreFilters, States, `useTalentSearchState.js`, `talentSearchFilterData.js`, icons). The old `TalentSearchFilterSheet.jsx` was replaced by the More filters drawer.
- Profile: `sections/talentCandidateProfile/*`, the route in `src/App.jsx`, the page `pages/talentSearch/TalentCandidateProfilePage.jsx`.
- Shared, new: `ui/MenuPanel.jsx`, `ui/TogglePill.jsx`, `ui/IconTileDialog.jsx`, `hooks/useDismissableLayer.js`. Add-only props on existing shared files: `ui/Modal` `initialFocus`, `ui/form/Textarea` `counterInside`, `RecruiterPageHeading` `accentClassName`.
- Chrome: both pages use the workspace rail (`recruiterDashboard/WorkspaceSidebar.jsx`) through `DashboardShell renderSidebar`, with SF Pro Rounded via `useScopedRoundedFont('data-recruiter-ui')`.
- Assets: `src/assets/recruiter/talent-search/` (candidate avatars and photos, `hiring-assistant-mark.webp`). Figma draws the same stock photo for Kofi and Ama, so the two profile photos are identical files.

## Verification (2026-11-06)

- `eslint` 0 problems on the talent-search, candidate-profile and touched shared files; `npm run build` passes; prettier clean on the builders' files. `src/App.jsx` fails `prettier --check` on line endings after other sessions' edits; the route block itself is formatted.
- Responsive audit on the production build (`vite preview`), 22 URLs at 320 / 390 / 1024 / 1440: no horizontal overflow, nothing under 12 px below 1024, no console errors. The remaining flags were false positives: the 16 px items are visually hidden native checkboxes whose wrapping label is 350×48–70 px; the suggestion rows are two-line list rows; the desktop "targets under 24 px" are the shared rail's public link and Upgrade link and the "More Filters" link, which my script wrongly checked at desktop widths. Dialogs at 320 and 390 were checked for overflow only, not looked at.
- Interactions run by the builders at 1440: menus, dropdowns, filters, sort, More filters drawer, invite / save / add-to-pipeline flows, toast dismissal, back navigation. Not run by anyone: chip × clear, typing + Enter, no-results actions, first-visit buttons, View profile and Invite navigation from the cards.
- Smoke render of the other recruiter pages and Talent `/job-postings` after the shared-component edits: they render, no overflow, no errors. There is no pixel baseline from before the edits.
- The dev server dropped module fetches (`net::ERR_NETWORK_CHANGED`) during measuring, so some first loads were blank; those frames were re-run until they rendered.

- Fixed 2026-11-07 (found while wiring the pipeline): the profile toasts "Open Conversation" and "View in Pipeline" navigated away and then the toast's close rewrote the profile URL, so the user stayed on the page; now guarded by a `leavingRef` in `TalentCandidateProfileSection.jsx`. Before that fix the click-through listed above for those two toast buttons had not been run.

## Known gaps, assumptions, Figma inconsistencies

- Filters (skills, location, More filters) are stored in the URL and shown on the chips but do not change which of the three mock candidates show; only the tab, the search text and `exp=10-plus` with remote off do. Sort reorders using invented ranking fields. Suggestion text other than "react nat", the city names, the education / score / pay option lists, what each Apply does and the first-visit controls are `⚠️ ASSUMPTION` (tagged in `talentSearchFilterData.js`).
- Profile: the job and stage dropdowns list only what is drawn; the Save popover opens with the first list preselected because TS-14 draws it checked; a "Profile not available" state for `godfred-ansah` and unknown ids is invented; the dense phone layout is invented. Not drawn, so only logged: the applicant "⋯" menu actions, "New list…", the "2 of 12" next chevron, "View list".
- Figma inconsistencies: TS-12's counter reads "168 / 500" but the text is 149 characters (ours computes 149); TS-19 says "Meets all 5 screening rules", "Meets 4 of 5" and Skills "4 of 5"; Ama is a Senior Product Engineer match in the list but an applicant to Senior UX Designer in TS-19 (the profile follows TS-19); TS-01 wraps "Godfred Ansah" in a box too short, so "Ansah" overlaps the role (not reproduced); the top-bar name reads "Joel K." in Figma and "Kofi A." in the shell; the drawer's Select draws a green arrowhead, ours (shared Select) a thin grey chevron; the "Open Conversation" toast action is underlined in Figma, ours is not.
- The More filters popover appears only at 1280 × 960 px or larger (otherwise a sheet), because the Ask Buddy button covered "Show 9 talents" at 1440 × 900; the phone sheet was never opened by anyone.
