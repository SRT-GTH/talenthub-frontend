# Talent Wallet (`/wallet`)

Figma file `Bin8roWL8sloyc36IgFMuT`, canvas **Talent Wallet** `8817:693`. Mock data only (nothing is stored, sent, uploaded or charged), shaped for an API swap
(`wallet*Data.js`). One build serves Playful + Focused through `UiStyleScope`. The sidebar opens **expanded** (Figma default); `?rail=collapsed` = the
"collapsed sidebar" twins. Sidebar item "Wallet" (`activeNav="wallet"`, route `/wallet`) was a dead item before this build. ✅ VERIFIED

## Canvas inventory ✅ VERIFIED (read with the Figma MCP, 2026-10-21)

5 sections × (Playful + "· Focused") × (expanded + "· COLLAPSED SIDEBAR") = **132 frames, 33 screens**. No unpaired frame. There is no W-19 (numbering gap).
Sections: Home, money in and out `8817:694` (collapsed `8891:471947`) · Set up and KYC `8819:11130` (`8892:98`) · Cycles, savings, under-18s `8822:98` (`8892:7946`) ·
Tuition financing `8824:98` (`8892:482890`) · Credit score and payouts `8825:98` (`8892:488899`).

## URL → Figma and measured difference (`framecmp.mjs`: whole-frame pixel diff vs the Figma export; 2–4 % = font metrics, 4–7 % = look closer)

State is the URL (`talentWalletState.js` documents every key). `P` = Playful, `F` = Focused, expanded sidebar; add `&rail=collapsed` for the collapsed twin.

| Phase | URL                                | Frame                              | Playful id / Focused id   | P % | F % |
| ----- | ---------------------------------- | ---------------------------------- | ------------------------- | --- | --- |
| 1     | `/wallet`                          | W-06 Home (Overview)               | 8817:695 / 8820:464667    | 4.7 | 4.1 |
| 1     | `?view=topup`                      | W-07 Top up · method               | 8820:98 / 8820:465584     | 3.8 | 3.2 |
| 1     | `?view=topup&step=approve`         | W-08 Approve on your phone         | 8820:1564 / 8820:466982   | 3.6 | 2.9 |
| 1     | `?view=topup&step=success`         | W-09 Top up · success              | 8820:2921 / 8820:468329   | 3.3 | 2.7 |
| 1     | `?view=withdraw`                   | W-10 Withdraw · amount             | 8820:4273 / 8820:469671   | 3.7 | 3.2 |
| 1     | `?view=withdraw&step=pin`          | W-11 Confirm with PIN              | 8820:5666 / 8820:471054   | 3.5 | 2.9 |
| 1     | `?tab=transactions`                | W-12 Transactions · All            | 8820:7035 / 8820:472413   | 3.7 | 2.6 |
| 1     | `?tab=transactions&tx=stipend-sep` | W-13 Receipt drawer                | 8820:7855 / 8820:473223   | 3.6 | 3.2 |
| 2     | `?state=new`                       | W-01 Not set up yet                | 8819:460112 / 8819:465553 | 3.8 | 1.9 |
| 2     | `?view=kyc`                        | W-02 KYC step 1 · Ghana Card       | 8819:460851 / 8819:466282 | 3.5 | 1.8 |
| 2     | `?view=kyc&step=address`           | W-03 KYC step 2 · proof of address | 8819:461601 / 8819:467022 | 3.7 | 2.0 |
| 2     | `?view=kyc&step=selfie`            | W-04 KYC step 3 · selfie           | 8819:462350 / 8819:467761 | 4.1 | 2.7 |
| 2     | `?state=checking`                  | W-05 Checking                      | 8819:463073 / 8819:468474 | 3.4 | 1.5 |
| 2     | `?state=retake`                    | W-05b Needs a new photo            | 8819:463777 / 8819:469168 | 3.7 | 1.8 |
| 2     | `?state=activated`                 | W-05c Wallet activated (modal)     | 8819:464479 / 8819:469860 | 2.6 | 1.8 |
| 3     | `?tab=cycles`                      | W-14 Cycles · earned and spent     | 8822:99 / 8823:149        | 5.1 | 3.9 |
| 3     | `?tab=cycles&toast=cycles`         | W-14b Cycles earned (toast)        | 8822:1028 / 8823:1063     | 5.4 | 4.0 |
| 3     | `?tab=cycles&modal=redeem`         | W-15 Redeem Cycles                 | 8822:1914 / 8823:1939     | 3.9 | 3.2 |
| 3     | `?tab=cycles&modal=redeem-short`   | W-15b Almost there                 | 8822:3258 / 8823:3273     | 3.9 | 3.1 |
| 3     | `?view=savings`                    | W-16 Savings pot · Laptop fund     | 8822:4564 / 8823:4569     | 4.5 | 2.9 |
| 3     | `?state=under18`                   | W-17 Under 18 · Starter wallet     | 8822:5399 / 8823:5394     | 3.9 | 2.2 |
| 3     | `?state=under18&modal=parent`      | W-18 Sent to Mrs Agyekum           | 8822:6185 / 8823:6170     | 2.9 | 2.4 |
| 4     | `?tab=financing`                   | W-20 Fund your training            | 8824:99 / 8824:467370     | 5.8 | 3.9 |
| 4     | `?tab=financing&stage=apply`       | W-21 Application                   | 8824:980 / 8824:468189    | 4.3 | 2.6 |
| 4     | `?tab=financing&stage=received`    | W-22 Application received          | 8824:1835 / 8824:469029   | 3.8 | 1.8 |
| 4     | `?tab=financing&stage=offer`       | W-23 Loan offer                    | 8824:2572 / 8824:469756   | 4.2 | 2.2 |
| 4     | `?tab=financing&stage=declined`    | W-23b Not approved yet             | 8824:3324 / 8824:470498   | 4.1 | 2.1 |
| 4     | `?tab=financing&stage=loan`        | W-24 My loan                       | 8824:4086 / 8824:471250   | 4.5 | 2.8 |
| 5     | `?tab=credit`                      | W-25 Credit score · Overview       | 8825:99 / 8826:149        | 5.6 | 3.6 |
| 5     | `?tab=credit&modal=score`          | W-25b How your score works         | 8825:998 / 8826:1035      | 5.2 | 4.6 |
| 5     | `?view=escrow`                     | W-26 Payout · Gig in escrow        | 8825:2137 / 8826:2162     | 5.6 | 3.7 |
| 5     | `?view=salary`                     | W-27 Get paid to your wallet       | 8825:2934 / 8826:2949     | 5.3 | 3.5 |
| 5     | `?toast=salary`                    | W-27b Salary received (toast)      | 8826:470355 / 8826:470666 | 5.0 | 3.4 |

Collapsed-sidebar twins (`&rail=collapsed`): the 40 measured frames of phases 2–4 are 1.2–5.7 % (highest W-20c 5.7 % P — the missing illustration) and the 16 phase-1 twins 2.2–4.9 %
(measured earlier in the session, before later layout fixes). The collapsed twins of W-25, W-25b, W-26, W-27, W-27b were never pixel-diffed (exports not fetched); they share the expanded layout code. Phase-1 numbers above are from the last full run of that phase; phases 2–5 are from one final run of all 90 frames (mean 3.8 %, one dev-server blank re-run clean).

Page behind a dialog: W-07 … W-11 sit over **Home**, W-13 over **Transactions**, W-14b/W-15/W-15b over **Cycles**, W-18 over **Under 18**, W-25b over **Credit score**, W-27b is **Home** after payday.

## Provenance (every screen verified against the Figma REST node data) ✅ VERIFIED (2026-10-21)

- Text, sizes, colours, gaps, paddings and positions of **all 33 screens in both styles** were checked against the REST node JSON (`/v1/files/.../nodes`): a script lists every Figma text layer with its
  position, font size, weight and colour, finds the same text in the running page and reports offsets above 4 px, size / weight / colour differences and texts missing on either side. What remains after
  the last run is font-metric only (Nunito stands in for SF Pro, so some lines wrap or measure a few px wider and the next blocks shift), generated content (tab counts, option notes, input values)
  and the Figma inconsistencies listed below. Phases 4 and 5 and Under-18 were first built from the node tree while the Dev Mode MCP quota was out; the REST pass corrected them (loan "Credit" rows,
  Focused spacing, timeline colours, the four spot illustrations are now placed).
- Flows are the Figma prototype: each screen's `interactions` give its destinations (`NAVIGATE`); a control with no destination in the prototype is **inert** (it only logs).
- Copy that differs between the styles is drawn per style: `StyleText` (Financing headline, Not-approved headline, loan activity dates, credit history Nov / Dec values); the Focused-only credit note
  sits between the first two factor rows as drawn. Focused W-06 / W-12 draw a 26 px title row (all other Focused frames and every Playful frame draw 41 px); the payday Home (W-27b) uses the credit header art.
- Per-style spacing is set with `gap={[Focused, Playful]}` (`HeroCard`, `SideCard`) or `playful:` classes; the Cycles page is tight in Focused, loose in Playful, the toast frame loose in both,
  the redeem dialog frames tight in both.

## Mock-only behaviour (owner decision 2026-10-21)

Nothing is stored, sent, uploaded or charged. Mock data lives in `wallet*Data.js`. KYC uploads, camera, downloads and sharing are inert (logged). A direct visit to `?step=pin` starts with
two PIN digits typed, as W-11 draws; the withdraw confirm closes the dialog, as the prototype does.

## Figma inconsistencies kept as drawn

- Layer named "Heading 2 → Opportunities that match you." is only a layer name; the real heading text is "Wallet".
- The receipt drawer is drawn from the top of the frame (under the Safari toolbar); the app draws it from the top of the viewport.
- W-14 / W-14b use looser spacing than W-15 / W-15b (hero 291 vs 239 px, gaps 24 vs 18): followed per frame.
- Credit history chart: the Nov and Dec bars repeat the May and Jun heights although their values (725, 740) are higher.
- Payday split etc. keep the "only you can see this" sticker on W-27b where W-06 says "paid straight to MoMo".

## Shell wiring (add-only)

`TalentSidebar`, `TalentMobileNav`, `TalentDashboardShell` (`RAIL_ID_BY_NAV`, page chrome, `chrome.railHome` → newer icon rail with the Wallet tile), `TalentRailHome` (Wallet tile route
`/wallet`, icon colour follows the tile state), `talentShellData.js` (`WALLET_PAGE`, `TALENT_NAV_WALLET.route`, opt-in `navGap` = card→nav gap 24 and 6px around the divider, measured off Figma `8820:344`).

## Files

`src/components/sections/talentWallet/` — state `talentWalletState.js`; screens: `WalletHome`, `WalletTransactions`, `WalletOnboarding` (new / checking / retake), `WalletKyc`, `WalletActivated`,
`WalletCycles`, `WalletSavings`, `WalletUnder18`, `WalletFinancing`, `WalletCredit`, `WalletPayouts` (escrow, salary); dialogs: `TopUpDialogs`, `WithdrawDialogs`, `RedeemDialog`,
`AlmostThereDialog`, `ReceiptDrawer`, `WalletActivated` (modal), `WalletToasts`, `WalletDialogs` (host); shared: `WalletFrame`, `WalletHeader`/`WalletTabs`, `walletHeaders.js` (screen resolver,
header and tabs per screen), `WalletPanels`, `WalletDialogParts`, `walletUi`; data: `walletData`, `walletKycData`, `walletCyclesData`, `walletFinancingData`, `walletCreditData`, `walletMoney`.
Page `src/pages/talentWallet/TalentWalletPage.jsx`. Assets `src/assets/talent-wallet/` (spot illustrations, receipt logo / torn edge / dashed rule, selfie photo + ring); icons `Wallet*Icon` at the end of `assets.jsx`.
