# Career Buddy chat: history, thinking states, settings (21 Oct 2026 Figma update)

Figma file `Bin8roWL8sloyc36IgFMuT`, canvas `3641:6671`. Sections: **Buddy thinking states** `8988:509558` (10 frames), **Playful / Focused · CHAT HISTORY & NEW CHAT** `9086:71498` / `9086:77035` (CH-01…08, NC-01/02), **BUDDY SETTINGS** `9098:524060` (CS-01…03). Read through the Figma REST API on 2026-10-21. ✅ VERIFIED (values read from node JSON); 🔶 LIKELY for pixel parity: the new screens were checked by eye against Figma exports, not by the numeric diff used for the Wallet.

## Update 2026-10-23 (re-check against the current Figma)

All 36 frames of the thinking / history / new-chat / settings sections were compared with the Figma node text and a pixel diff (Focused 3.7–5.0 %, Playful 3–12 % — the Playful excess is the page behind the chat: demo data in the right panel). Fixed:

- **Ask Buddy pop-up panel** (`talentHome/CareerBuddyFirstChat.jsx`, the floating panel on every talent page) now shows the same reply-in-progress row as the full screen (`ui/BuddyThinking.jsx`: thinking, working, writing, slow, stopped) with the "Stop generating" pill above the input; Esc stops the answer first and closes the panel only when nothing is being generated. ⚠️ ASSUMPTION: Figma draws these states on the full Career Buddy screen only; the panel reuses the component. Demo: `/home?state=day1&new=chat&buddy=thinking|working|writing|slow|stopped` (Stop / Continue / Try again work locally); a plain `/home?state=day1&new=chat` keeps the drawn typing dots.
- **Nav button label** on the Career Buddy page is "Change input mode" (every current Figma frame says so; it was "Switch Modes"), and the gold button now also shows on the demo frames in both styles.
- **Demo URLs now reproduce drawn states:** "Stop generating" + Esc at `?chat=working|writing|slow` (clicking Stop goes to `?chat=stopped`, Continue → writing, Try again → thinking); the chat actions menu opens at `?chat=history-menu` (an effect toggled it closed twice under React StrictMode); the "You’re already in a new chat" tooltip is forced visible at `?chat=new-hover` (`ChatThread` prop `showNewChatTip`).
- `buddyDemoFrames.js` gained `buddyDemoThinking(phase)`; `demoFrameMessages(frame, { onContinue, onTryAgain })`.

## Voice · live captions (Figma section `9149:83053`, 7 frames × 2 styles; built 2026-10-23)

Demo URLs `/profile/filling/career-buddy?chat=<name>`: `voice-speaking` (VC-01), `voice-buddy` (VC-02), `voice-saved` (VC-03), `voice-fix` (VC-04), `voice-off` (VC-05), `voice-interrupt` (VC-06), `voice-pause` (VC-06b). framecmp vs the Figma 0.5x exports (re-run by the lead): Playful 3.5–4.0 %, Focused 4.3–5.1 %. Code: `profileFilling/voiceCaptions/` (21 files: components, four hooks, data), `VoiceCallOverlay.jsx` (live calls and the demo scenes use the captions layout; the plain demo call is unchanged), `ChatThread.jsx` (optional props `voiceTurns`, `afterMessages`, `alignTop`), the "Live captions" row in Buddy settings (`careerBuddy.settings.liveCaptions`, persists).

⚠️ ASSUMPTIONS: Buddy's words are revealed at about 2.7 words/s (speech synthesis gives no word timings); a caption word is "settled" after 800 ms unchanged (`useVoiceCapture` has no isFinal); barge-in = a mic-level monitor while Buddy speaks, then `speechSynthesis.pause()`, 2.6 s tooltip layout (VC-06b) then the chip layout (VC-06), "Let Tali finish" resumes, a talent turn cancels Buddy's speech and is sent as a normal turn, 6 s of silence auto-resumes; the hide control is the LIVE CAPTIONS sticker (Focused: "Live captions" label) because Figma draws none; Edit (editor with Resend/Cancel) and Play again are invented; doubtful words come from a small local list of company names; corrected words stay in `careerBuddy.learnedWords` (not sent to the agent); the "type a word" field has no drawn state; the mobile layout is our own.

Figma inconsistencies kept: "Ama" in copy but "Emma" on the avatar; VC-06 label "Listening…" vs VC-06b "TALI" with a red mic; the composer is drawn hidden (we keep it).

NOT verified: barge-in, the live reveal pacing, Play again and the saved-as-text toast on a real call with a real mic / speech engine / agent. The talent profile panel has no "My Profile / Elliot’s Profile" tab strip (drawn in these frames; the panel is shared, not changed). `speak` in `useCareerBuddyLive` is private (Play again repeats its voice tuning).

## Opportunity Matching (Figma `9053:80188`, Focused only; built 2026-10-23)

Not a recruiter job-post flow: it is the TALENT "I think I need some guidance" → "Opportunity Matching" branch. The three frames (`NOT STARTED` `9053:80189`, `IN PROGRESS` `9053:80615`, `AWAITING REVIEW AND CONFIRMATION` `9053:81141`) are one long chat at three scroll offsets with three right-panel states; no Playful twin exists anywhere (Playful is derived with `playful:` variants, unverified against a design). Demo URLs `/profile/filling/career-buddy?chat=opp-areas|opp-matches|opp-why` (diff 4.7 % / 12.4 % / 13.0 % — the 12–13 % is the scroll offset and panel scroll of Figma's long chat; the cards, chips and replies match). Real path on the scripted chat: New Chat → "Give me career guidance" → "Opportunity Matching" → any open-to chip → 3 cards → "Why this match?" → "Apply with my GTH profile" → `/opportunity-guidance/job?job=ipmc-junior-python-instructor` (J-02 detail built on the finished `JobDetailScreen`, diff 3.7 %; the frame is named Accra Tech but draws IPMC Ghana / Junior Python Instructor; its breadcrumb still says "Data Analyst"). Code: `profileFilling/opportunityGuidance/`, `pages/opportunityGuidance/OpportunityJobPage.jsx`, nodes override the old "coming soon" stub (`careerBuddyScript.js`, which still contains the dead stub text), assets `src/assets/opportunity-guidance/`. Shared edits: `App.jsx` (1 import + 1 route), `careerBuddyScript.js` (1 import + `Object.assign`), `buddyDemoFrames.js`, `CareerBuddySection.jsx` (chip bridge + panel effects; plus `setFreshStart(false)` in `submit()`, which fixes a pre-existing bug: a footer chip after "New Chat" left its reply hidden behind the "Hi there" empty state).

⚠️ ASSUMPTIONS: replies for "Why these 3?", "Show more matches", "Add skill", cards 2 / 3 "Why this match?" and the "Apply" reply are not drawn (placeholder lines from on-screen facts); card 2's "View opportunity" opens the Matched list; any open-to chip or typed text advances to the cards. Figma inconsistencies kept: card 1 is Accra Tech 80 % but its reply says "86% match for IPMC Ghana Intern"; card 3 shows 44 % while the detail says 82 %. Requests: the Jobs shell labels the nav item / breadcrumb "Job Postings" where Figma J-02 says "Opportunities"; "Closes Tomorrow" tag is not red as drawn; list dots for `message.bullets` in `ChatThread`. The live (backend) chat has no opportunity flow.

## Buddy settings popover height (2026-10-23)

The Buddy settings popover (`BuddySettingsPopover`, `CareerBuddyChatParts.jsx`) was positioned `top-[66px]` with no height cap, so on windows shorter than its content (the new "Live captions" row made it ~745 px) it ran past the bottom of the screen. It now has `max-h-[calc(100%-78px)]` and scrolls inside itself (`overflow-y-auto`, no visible scrollbar). Checked at 1280x808, 1440x700, 1280x560, 1728x1065 and 390x700 in both styles: the popover bottom stays inside the window.

## What changed (21 Oct build)

- **Toolbar** (`ChatThread.jsx`): History button is now first (44x40), then "New Chat" (disabled at 45 % on a fresh chat, tooltip "You’re already in a new chat"), Settings on the right (opens Buddy settings, no longer the voice overlay). Active = pale green + green outline.
- **Thinking states** (`ui/BuddyThinking.jsx`, `useCareerBuddyLive.jsx`): thinking → working → writing → slow (>10 s) → stopped; "Stop generating" pill (Esc too) aborts the stream (`sendTurnStream({ signal })`); stopped row offers Continue / Try again. Copy of the "working"/"slow" rows is the agent's own status; the fixed strings ("Looking at", the three steps, "Step 2 of 3") are Figma copy.
- **History drawer** (`CareerBuddyHistoryDrawer.jsx`, model in `chatHistoryModel.js`): left side, 340 px: search, filter chips, grouped list (Pinned / Today / Yesterday / Previous 7 days / Older), "…" menu (Rename / Pin to top / Delete), in-place rename, delete confirmation, search results with highlight, no-results ("Ask Buddy about …"), empty and loading states.
- **New chat**: start screen (`NewChatStart`) with four starter cards + "saved to History · View" toast; the greeting turn is no longer sent for a new chat.
- **Buddy settings** (`CareerBuddyChatParts.jsx`): voice, read answers aloud, language (only English (Ghana) selectable; the rest "Coming soon"), answer length, what Buddy can use, Clear all chats (confirm), Privacy & data.

## URLs (scripted talent chat): `/profile/filling/career-buddy?chat=<frame>`

thinking · working · writing · slow · stopped · history · history-menu · history-rename · history-delete · history-search · history-nomatch · history-empty · history-loading · new · new-hover · settings · settings-language · settings-clear (`buddyDemoFrames.js`).

## Not connected to the agent ⚠️ (needs backend work)

- **Pin, rename, delete, Clear all chats:** kept in this browser (`careerBuddy.chatMeta.<id>`). The agent has no endpoint, so a deleted server chat is only hidden, and the delete dialog's "Buddy will also forget what you discussed in it" is not true on the server yet.
- **Answer length, "What Buddy can use", "Remember past chats", chat language:** stored in `careerBuddy.settings`, never sent to the agent. Only "Read answers aloud" has an effect (it speaks replies).
- **Privacy & data:** goes to `/settings` (Figma draws no destination).
- **Thinking rows:** the sub line and the active step carry the agent's own status text; the fixed strings ("Looking at", "Your profile", "Discoverable rules", the three steps, "Step 2 of 3") are Figma sample copy shown for every reply.

## Not drawn in Figma ❓ (decisions we made, confirm with the designer)

- No "Unpin" label: the menu always says "Pin to top" and toggles.
- No helper text for the Short and Detailed answer lengths (only Balanced has one).
- No singular wording for "N chats match" (we use "1 chat matches").
- No topic for each chat: filter chips use keywords on real chats; the mock chats are tagged by hand.
- No "Esc" behaviour, hover growth or mobile layout for the drawer: the row "…" button appears on hover without growing the row (Figma grows it 6 px); below `lg` the drawer is a full-width sheet.
- Focused scrim stops 148 px short of the pane edge, copied as drawn.
- The first-visit greeting turn still runs once; a new chat no longer sends one (the start screen replaces it).
