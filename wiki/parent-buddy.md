# Parent · Ask Buddy (`?buddy=` on any `/parent/*` page)

> Figma: file `SCXc457vwiq6o7d9g4jVbh`, canvas "Parent · 13 Ask Buddy" `10089:2105` (persona Emma Mensah). Built 2026-10-28, **Focused only**, frontend only (no backend, scripted sample answer).
> The panel is the parent's own chat drawer; the five reply-in-progress rows are the shared `ui/BuddyThinking` (Figma "Buddy thinking states") with the parent's sample copy.

## Frame → URL (✅ VERIFIED by `framecmp.mjs`, Focused, 2026-10-28)

| Frame                                      | Figma id     | URL                      | Diff % |
| ------------------------------------------ | ------------ | ------------------------ | ------ |
| PB-01 Ask Buddy · Thinking                 | `10089:2648` | `/parent?buddy=thinking` | 1.8    |
| PB-02 Ask Buddy · Working on a longer task | `10089:3427` | `/parent?buddy=working`  | 2.0    |
| PB-03 Ask Buddy · Writing the answer       | `10089:4212` | `/parent?buddy=writing`  | 1.9    |
| PB-04 Ask Buddy · Slow answer (over 10 s)  | `10089:4966` | `/parent?buddy=slow`     | 1.9    |
| PB-05 Ask Buddy · Answer stopped           | `10089:5735` | `/parent?buddy=stopped`  | 1.9    |

Diff % = whole-frame pixel difference vs the Figma 0.5x export (home behind the scrim included). `?buddy=open` is the panel with the greeting alone (no frame; see assumptions).

## Behaviour (real browser: 8 Playwright tests in `tests/e2e/parent-buddy.spec.js`, errscan clean)

- The **Ask Buddy** button (the FAB on every parent page) opens the panel (`?buddy=open`); the X, a click on the scrim and Esc close it.
- **Stop generating** (working / writing / slow) or **Esc** → stopped (PB-05); **Continue** → writing; **Try again** → thinking. The three suggestion chips are drawn only in the stopped state (their row keeps its space in the others, as Figma does).
- Sending a question shows it as the parent's bubble and walks thinking → working → writing on a timer; frames opened by URL stay where they are.

## Code map

`parent/buddy/`: `buddyData.js` (copy and the five phases as `BuddyThinking` props), `ParentBuddyPanel.jsx`. `ParentFrame.jsx` (add-only) reads `buddy` and opens the panel from the Ask Buddy button. Reused unchanged: `ui/BuddyThinking` (+ `StopGeneratingPill`), `shared/assets` mic and arrow icons, `talent-home/flows/career-buddy-avatar-*.png`.

## Known gaps / assumptions

- ⚠️ ASSUMPTION: the Ask Buddy button opening the panel, `?buddy=open`, the timed thinking → working → writing sequence after a sent question and the sample answer for any question are ours (Figma draws only the five states of one question). History and Expand only log (no screen drawn).
- Header icons (history clock, expand, close) are drawn inline in #387440 on the mint tiles; the Figma icon colours were not read off the vectors.
- Not verified: Playful (none exists for this file); a screen-reader pass; `test:e2e` as a whole.
