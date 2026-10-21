# Career Buddy chat: history, thinking states, settings (21 Oct 2026 Figma update)

Figma file `Bin8roWL8sloyc36IgFMuT`, canvas `3641:6671`. Sections: **Buddy thinking states** `8988:509558` (10 frames), **Playful / Focused · CHAT HISTORY & NEW CHAT** `9086:71498` / `9086:77035` (CH-01…08, NC-01/02), **BUDDY SETTINGS** `9098:524060` (CS-01…03). Read through the Figma REST API on 2026-10-21. ✅ VERIFIED (values read from node JSON); 🔶 LIKELY for pixel parity: the new screens were checked by eye against Figma exports, not by the numeric diff used for the Wallet.

## What changed

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
