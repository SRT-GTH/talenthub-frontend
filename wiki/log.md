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
