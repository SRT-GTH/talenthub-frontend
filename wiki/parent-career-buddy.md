# Parent Career Buddy — the AI chat for a parent (Figma "AI CHAT parent screens")

> Figma: file `SCXc457vwiq6o7d9g4jVbh`, canvas "AI CHAT parent screens" `7958:183942`. Checked and aligned 2026-10-28, **Focused only**, frontend only (scripted demo, no agent).
> **This flow already existed** (built 2026-08 from the older talent file, see `figma-node-map.md` "Career Buddy — Parent …"): `/profile/filling/career-buddy` with the parent role (`CareerBuddyRoleProvider`, script `parentBuddyScript.js`). This canvas re-draws those screens, so this pass compared every frame with the build and fixed the differences.

## Frame → URL (✅ VERIFIED by `framecmp.mjs` + a Figma-text check, 2026-10-28)

All URLs are `/profile/filling/career-buddy?role=parent&live=0&cb=<state>`; `?role=parent` (new) sets the role from the URL, so a frame reproduces from a fresh load.

| Frame (Figma id)                                        | `cb=`                                                                                     | Diff % | Status                                                                            |
| ------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------ | --------------------------------------------------------------------------------- |
| NOT STARTED, welcome (`7958:183953`)                    | `ward-uninitiated`                                                                        | 4.7    | ✅ (shows the Welcome Back toast too, see gaps)                                   |
| PARENT - WELCOME TOAST (`7958:184187`)                  | `welcome`                                                                                 | 3.9    | ✅                                                                                |
| BUILDS THEIR OWN PROFILE (`7958:184429`, `…:184665`)    | — (chip hover; the second frame is a "TALENT FLOW (parent is also a talent)" placeholder) | —      | the talent flow, nothing parent-specific to build                                 |
| GUIDES WARD'S PROFILE (`7958:184669` hover, `…:184903`) | `parent-guide`                                                                            | 4.6    | ✅                                                                                |
| GUIDES · IN PROGRESS (`7958:185198`)                    | `parent-guide-progress`                                                                   | 4.4    | ✅                                                                                |
| GUIDES · COMPLETED (`7958:185493`)                      | `parent-guide-done`                                                                       | 4.3    | ✅ (Education confirmed, 100 %; `parent-guide-review` is the step before Confirm) |
| UPLOADS RESUME (`7958:185789` hover, `…:186023`)        | `parent-resume-filled`                                                                    | 4.2    | ✅                                                                                |
| WARD'S ACCOUNT NOT INITIATED · details (`7958:186400`)  | `ward-setup`                                                                              | 6.2    | ✅                                                                                |
| … · password (`7958:186755`)                            | `ward-password`                                                                           | 7.3    | ✅                                                                                |
| … · account created (`7958:187028`)                     | `ward-success`                                                                            | 4.1    | ✅ (Elliot tab, Personal Info open with the sheet)                                |

(The first load of this lazy route is slow; a 40-character reading in `framecmp` means the loader was still up, a re-run gives the numbers above.)

## What changed (all parent-only, defaults unchanged)

- `providers/CareerBuddyRoleProvider.jsx`: `?role=parent|recruiter|talent` picks the role from the URL (and stores it).
- `CareerBuddySection.jsx` (parent branch only): the gold **Switch Modes** button on every screen, the stage trail starts with the done **Avatar** step, the persona label under the parent's bubbles is **Emma** (`PARENT_PERSONA_LABEL`), the composer placeholder is **Write a message…**.
- `ui/ChatThread.jsx`: optional `placeholder` prop; the file chip uses `displayName` / `sizeLabel` when given ("Resume... .pdf", "6MB").
- `TalentProfilePanel.jsx`: optional per-stage `showPct` (an in-progress section that draws "Completion: 80%" instead of the amber "In Progress"); used by parent Personal Info (80 %) and Skills (48 %).
- `TalentProfilePanel.jsx` also got `photo` and `bio` field rows for the ward's Personal Info sheet; `parentBuddyScript.js`: `WARD_PERSONAL_INFO_FIELDS`, inert level `options` on the seeded guide opening, a `parent-guide-done` seed; the welcome line is the drawn "✅ We noticed that you already initialized your wards account" in both welcome variants; the Guide chip posts an **[Auto]** bubble; the education Q&A is the drawn conversation (level → school → program → electives → years → WASSCE → closing line), and the three guide URLs seed that whole transcript; the ward's e-mail is `ellwhitmore@gmail.com`; the Elliot tab shows 80 % / 48 % at guide start.

## Known gaps / assumptions

- Figma inconsistencies kept as drawn: the welcome says "already initialized" behind the ward set-up dialogs (E1–E3), although the dialog exists because it is not; the nav says "Kofi A." and the trail "Step 1 of 9" while 11 stages are drawn (the build counts 11, an earlier decision); the user label is "Emma" while Buddy and the toast say Mr. Whitmore; the Figma bot lines end with a stray `"` that earlier sessions strip by product decision (still stripped).
- Figma stray closing `"` on three Buddy lines stays stripped (earlier product decision): the only text a frame check still reports.
- The inert level options are on the seeded URLs only; in the live click-through the choices are the chips under the input and vanish once answered.
- Not verified: the live (signed-in) Career Buddy for a parent; Playful (talent only); a screen-reader pass; the whole `test:e2e` suite.
