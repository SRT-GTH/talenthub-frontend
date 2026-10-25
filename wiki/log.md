## [2026-10-25] update | Career Buddy: "Buddy brain" mascot in the reply-in-progress row

Figma `Bin8roWL8sloyc36IgFMuT` (canvas `3641:6671`) replaced the robot avatar + spinner ring + orbit sparkles with a "Buddy brain" mascot (components `9325:546246` Playful / `9325:546762` Focused, instance 56x47 of a 60x50 component). Found by diffing node trees against file version `2413530732846276985` (23 Oct 12:18): no other frame in the canvas changed; the loading frames (CH-08, skeleton rows) are unchanged. `ui/BuddyThinking.jsx` `BuddyThinkingAvatar` now draws glow + brain SVG (`assets/career-buddy/buddy-brain-{playful,focused}.svg`): glow while thinking / working / slow, none while writing / stopped, mascot at 70 % when stopped. Placement checked against Figma PNG exports (< 1 px). Not changed: the penguin `CareerBuddyAvatar` in chat messages / header / FAB (not redrawn). ❓ The J-02 frame sidebar says "Clubs" and the search placeholder "...clubs..."; the code still says "Community" — not renamed (only one frame shows it).

## [2026-10-24] build | Agency portal (Theme 11): foundation

Figma canvas `8605:395409`. Chrome (top bar, rail 303 / icon rail 80 / phone-tablet bar + drawer, persona card, "Your agency page" card, Ask Buddy), shared hero / banner / button, `/agency/*` router with 20 stub pages, URL state hook, mock session (`?mou=`, `?quota=`), formatters, Figma icon exports, frame manifest `tests/agency/frames.json` (114 entries, 2 superseded), responsive-audit URLs. Plan, URL contract, packages and checklist: [agency.md](agency.md). Verified: eslint + prettier clean; chrome checked at 1728 / 1024 / 834 / 390, collapsed rail and drawer, no horizontal scroll. Not built: any page body.

## [2026-10-23] build | Public data dashboards (Theme 8): foundation

Figma canvas `8477:209484`. Chrome (sidebar 288 / rail 80 / mobile drawer, top bar, footer), `/data/*` router with 13 stub pages, URL state hook, suppression + number helpers, region list, Figma icon exports, frame manifest `tests/public-data/frames.json` (107 entries), responsive-audit URLs. Plan, URL contract, work packages and checklist: [public-data.md](public-data.md). Verified: eslint clean; chrome renders at 1728 / 1024 / 390 and the drawer, no horizontal scroll. Not built: any page body.

## [2026-10-23] build | Career Buddy re-check + panel states, voice live captions, opportunity matching, create-a-community, My circle

Career Buddy chat re-checked against the current Figma (36 frames): the Ask Buddy pop-up now shows the thinking / working / writing / slow / stopped rows + Stop generating; nav label "Change input mode"; demo URLs reproduce the Stop pill, actions menu and new-chat tooltip; voice live captions (VC-01..06 × 2 styles + settings row); Career Buddy Opportunity Matching (`?chat=opp-areas|opp-matches|opp-why`, J-02 IPMC page, Focused only). New talent screens: [talent-community-create.md](talent-community-create.md) (19 frames × 2) and [talent-my-circle.md](talent-my-circle.md) (12 frames × 2). Details and gaps: [career-buddy-chat-history.md](career-buddy-chat-history.md). Verified: build, eslint src; framecmp by the section agents (Playful 3–9 %, Focused 1.5–7 %), voice re-run by the lead 3.5–5.1 %; responsive audit + leak check see the build report. Not verified: real mic / speech engine for voice captions, errscan of every new URL, Focused phone widths on the later create-wizard steps, a clean re-run of the My circle NW-01..03/10/11 diffs.

## [2026-10-23] build | Parent emails PE-01..PE-07 (static HTML, Focused only)

From Figma canvas `3:3` of the comms file. 7 files in `emails/parent/focused/`; identical images across all emails were deduplicated into `emails/assets/shared/` (82 image files in total). Details and per-frame diff table: [parent-emails.md](parent-emails.md). Verified: same-size pixel diff 4.6–8.0%, every pair viewed, copy check 0 missing, 390px no horizontal scroll, talent email renders pixel-identical after the dedupe. Not verified: real email clients, dark mode; links are `#`.

## [2026-10-22] build | Talent emails TE-02..TE-12 (static HTML, both styles)

From Figma comms file `GwL8cVTsz2wI4H3jnqL8IH`, canvas `3:2`. 22 new files in `emails/talent/{playful,focused}/` (TE-01 came from an earlier session and is unchanged), ~200 PNG exports in `emails/assets/`. Details, per-frame diff table and known gaps: [talent-emails.md](talent-emails.md). Verified: same-size pixel diff vs Figma 0.5x exports (3.8–8.4%), every pair viewed, copy check 0 missing in TE-02..TE-12, 390px no horizontal scroll except TE-01. Not verified: real email clients, dark mode; links are `#`; mobile layout is our own.

## [2026-10-22] build | New landing pages (LP-01 v2, P-01..P-06, Coming Soon)

From canvas `7797:4614`, desktop + tablet 834 + mobile 430. Details, URL table and known gaps: [landing-site.md](landing-site.md). Verified: eslint, build, overflow/page-error sweep on 10 routes × 6 widths. Not verified: pixel diff; icons are hand-redrawn; PageHero heights differ from Figma.

## [2026-10-21] fix | Engagement layout: journey rail, personality intro + path chooser, certs stage label

Measured against Figma REST data (text tops, 1728 frames). Journey rail cards now within 1px (Career Buddy card was 16px short, Continue button 3px tall). PE-01 hero was up to 58px low; now within about 5px (leftover differences are font-metric / chip-padding artefacts). PA-00: heading block fixed to 148px; the first path card's chip row sits about 20px low (description wraps to an extra line with the fallback font, not verified with SF Pro Round). Stage bar for Certs reads "Certifications". Not re-measured: Focused, IN-04, other personality frames.

## [2026-10-21] build | Engagement revamp: Personality Arcade, CV upload, clamp fixes

Arcade hub + details + archetype modals, arcade-aware `usePersonalityRun`, `:gameId` route to `GamePage`; CV upload page; bulk hero/dialog clamp fixes. Status, URLs and open diffs: [talent-engagement-revamp.md](talent-engagement-revamp.md). Verified: eslint, build, Playful screenshots by eye. Not verified: Focused, pixel diff, skills labs mounting.

## [2026-10-21] build | Career Buddy chat: left history button, thinking states, new history drawer, new chat, Buddy settings

From the 21 Oct Figma update (canvas `3641:6671`). Details, URLs (`?chat=`) and what is not backed by the agent: [career-buddy-chat-history.md](career-buddy-chat-history.md). New: `BuddyThinking`, `CareerBuddyChatParts`, `chatHistoryModel`, `buddyDemoFrames`, `buddySettings`, `Buddy*Icon` set in `assets.jsx`, two spot SVGs in `src/assets/career-buddy/`. Changed: `ChatThread`, `CareerBuddyHistoryDrawer` (rewritten), `CareerBuddySection`, `useCareerBuddyLive`, `careerBuddy.api.js` (abort signal), `index.css` (animations). Verified: eslint/build clean, screenshots compared by eye; not pixel-diffed.

## [2026-10-21] plan | Engagement revamp (manual profile filling): inventoried, blocked on Figma access

Canvas `3125:10352` ("Engagement 1 - gamified"): 12 refreshed sections, 155 screens x Playful + Focused. Only the depth-2 inventory could be fetched (both REST tokens and the Figma MCP are rate-limited for about 4-5 days). Wrote [talent-engagement-revamp.md](talent-engagement-revamp.md) and `tests/engagement/frames.json` (ids, pairing, proposed URLs, resume plan). No screen built. Needs: a Dev/Full-seat token or exported PNGs.

## [2026-10-21] build | Talent Wallet `/wallet` — all five phases (33 screens, W-01 … W-27b)

Built every screen of Figma canvas `8817:693` (33 screens × Playful + Focused × expanded + collapsed sidebar = 132 frames): Home, Transactions, Top up, Withdraw, receipt drawer (phase 1), set-up and KYC (2),
Cycles, savings, redeem, under-18 (3), tuition financing (4), credit score and payouts (5). Phases 4, 5 and under-18 were first built from the node tree while the Dev Mode MCP quota was out; the
REST API then worked again and **every screen in both styles was re-verified against the REST node data** (positions, sizes, colours, copy, per-style spacing, prototype flows) and corrected
([talent-wallet.md](talent-wallet.md)); the four spot illustrations are placed and no assumption remains.
State hook `talentWalletState.js` (every frame is a URL), `WalletFrame`, mock data `walletData.js`. Shell wiring add-only: `activeNav="wallet"` in sidebar / mobile
nav / shell, `WALLET_PAGE` rail data with the opt-in `navGap` flag (card→nav gap 24, divider gap 6 — measured off Figma), `chrome.railHome` makes
`rail=collapsed` use the newer icon rail (with the Wallet tile) like Home. Wallet icons `Wallet*Icon` appended to `assets.jsx`; spot illustrations in
`src/assets/talent-wallet/`. Verified: framecmp 1.2–5.8 % on 106 of the frames, errscan clean on every URL, responsive audit 185/185, leak check clean, build + eslint + prettier clean.
Figma was read through the Dev Mode MCP first, then verified through the REST API.

## [2026-10-20] feat | Talent Messages `/messages` (foundation + four packages; Figma REST blocked)

Built `/messages` (Figma canvas 7387:104275, 49 Playful/Focused pairs + A-01c + HP): state hook `messagesState.js` (every frame is a URL, see top of the file and [talent-messages.md](talent-messages.md)), `MessagesFrame` (talent shell, Messages active, Wallet, badges 142/142/4, `?rail=collapsed`), inbox/conversation/composer (A), job + interview cards and the pre-apply dialog (B), Help me reply (C), accessibility / language "Coming soon" / Messages help copy (D). Shell wiring add-only: `talentShellData.js` (`MESSAGES_PAGE`, Messages nav route), `TalentSidebar`, `TalentMobileNav`, `TalentDashboardShell`, `DashboardTopNav` (messages icon -> `/messages`, EN pill -> `?lang=menu` on Messages), `HelpPopover` (`helpPage: messages`). T-MSG-05 is NOT a dialog: the inline job card in its Passing state. Figma REST was rate-limited (429, ~9 h, plan tier pro / limit low) for most of the build; the MCP was used for the Passed card, icons and gaps. **Nothing is marked verified**: see the "Recovery list" in talent-messages.md for everything that still needs REST (diff %, pdiff, errscan, phone checks). Follow-up 2026-10-21: responsive audit 150/150, leak check clean, build + lint pass; measured 41 rows against the 0.5x exports (37 pairs at 2–7 %); fixed the language modal (art-band height, tilts, doodle positions), the read-aloud bar room, the reaction/chip overlap, T-MSG-05 (thread ends after the recruiter's last bubble, no typing), A-02…A-04 URLs (panel closed), and the headless read-aloud reset. Nothing committed.

## [2026-10-20] fix | Figma token moved out of `.mcp.json`

`.mcp.json` no longer holds the Figma token: the `figma-console` server now reads `"FIGMA_ACCESS_TOKEN": "${FIGMA_ACCESS_TOKEN}"` from a user-level environment variable (each dev sets it once on their machine). The old token is still in git history (pushed) — **revoke it in Figma and set the new value in the env var**. Scripts (`tests/playful/lib/figma.mjs` `getToken`) read `FIGMA_TOKEN`, then `FIGMA_ACCESS_TOKEN` (the `.mcp.json` server's variable).

## [2026-10-21] feat | Messages wired to the API

`/messages` shows the signed-in talent's real recruiter conversations (`services/messages.api.js`, `useLiveMessages.js`, `messagesLive.js`; backend `talentMessages.service.js`, gateway `/api/talent-messages`). Inbox, requests (accept / decline / spam), sending with retry, read receipts, mute / archive / delete / report / block, and the linked job card (pass, apply → real application) all go through the API; drawn frames stay on `demo=1`, signed out, `state=` or drawn `c=` keys. `/messages/:conversationId` (notification links) opens that conversation. Details: [talent-messages.md](talent-messages.md#live-inbox-2026-10-21).

## [2026-10-21] fix | Career Buddy interview review after reopening a chat

Reopened Career Buddy conversations lost the practice / mock interview review card and showed the agent's plain text report instead, including raw placeholders like "[experience]". Cause: the agent's history endpoint dropped `practiceReview` (backend `apps/agent/src/server/career-buddy-routes.ts` TURN_FIELDS, fixed there). Here: `careerBuddyLive.js turnToBubbles` keeps only the verdict line when a turn carries the review card (the card holds the scores and feedback), and `PracticeReviewCard` shows "[experience]"-style placeholders as highlighted "your experience" blanks with a "Fill the highlighted parts with your own details" note.

## [2026-10-24] build | Public data dashboards (Theme 8): all packages integrated

Seven work packages built and wired (see [public-data.md](public-data.md)). Verified: build, eslint, errscan 76 URLs clean, responsive audit 130/130. Lead framecmp diffs are higher than the agents' own numbers (landing ~14 %); pairs viewed, differences mostly font and hero crop. Not verified: full-text checks per frame, phone/tablet pixel parity. Nothing committed.

## [2026-10-23] perf | Career Buddy voice: speak as the reply streams; the mic stays open

- `speechQueue.js` (new): in a voice call or with read-aloud on, each sentence is spoken as soon as it has streamed in (`delta` events), instead of the whole reply after the turn finished as one long utterance (slow to start; Chrome stalls on long utterances). The final reply is authoritative: only the part not spoken yet is queued.
- `useVoiceCapture`: the mic (stream + level meter) stays open for the whole call; only speech recognition stops while Career Buddy thinks or speaks. It used to tear down and re-open the mic (getUserMedia + AudioContext + recogniser) around every reply. The recogniser now restarts itself when Chrome ends it (silence / network), which used to leave the call deaf.
- `useUtteranceSender`: when the recogniser has finalised the words, the turn is sent after 0.6 s instead of 1.5 s (interviews keep their longer pause).
- There is no WebSocket in the Career Buddy path: replies stream over Server-Sent Events (`/career-buddy/turn-stream`). Backend side of the same work: srt-backend `perf/cb-reasoning-temperature`.

## [2026-10-25] build | Agency portal (Theme 11): all packages integrated

Canvas `8605:395409` (Government bodies / agencies), 112 screens under `/agency/*` (agency chrome with a mock signed-in session). Details, URL keys, verification and gaps: [agency.md](agency.md). Verified: build, eslint, errscan 108 URLs clean, framecmp over all frames (mostly 1-5 %), responsive audit partly fixed. Not verified: print/PDF, tablet beyond drawn frames, per-frame text check by the lead. Nothing committed.
