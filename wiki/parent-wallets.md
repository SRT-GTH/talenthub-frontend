# Parent · Ward wallets (`/parent/wallets`)

Figma file `SCXc457vwiq6o7d9g4jVbh`, canvas **Parent · 08 Ward wallets** `10057:66889` (Focused style only, 16 frames). Built on 2026-10-28.

## What it is

The Ward wallets page (sidebar "Ward wallets") plus six dialogs and five toasts. The same dialogs open from the ward page's Wallet tab (PW-12, `?tab=wallet` on `/parent/wards/abena`) over one shared store, so approving on one screen shows on the other.

## Files

| File                                                         | Job                                                                                                  |
| ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| `src/pages/parent/ParentWalletsPage.jsx`                     | the route; title; wires the page buttons to `?modal=`                                                |
| `src/components/sections/parent/wallets/WalletsOverview.jsx` | page body: Abena card + request row, history rows, Elliot card, Limits card                          |
| `wallets/WalletsLayer.jsx`                                   | dialogs, toasts, frame-URL seeds (mounted by the wallets page and by `ParentWardPage`)               |
| `wallets/walletsStore.js`                                    | module store (`useSyncExternalStore`): balance, Cycles, spent, limits, request status, Elliot opened |
| `wallets/dialogs/ApproveDialog.jsx`                          | PWa-02, PWa-02c                                                                                      |
| `wallets/dialogs/DeclineDialog.jsx`                          | PWa-04                                                                                               |
| `wallets/dialogs/LimitsDialog.jsx`                           | PWa-05                                                                                               |
| `wallets/dialogs/TopUpDialogs.jsx`                           | PWa-06, PWa-06b, PWa-06d                                                                             |
| `wallets/dialogs/OpenWalletDialog.jsx`                       | PWa-08                                                                                               |
| `wallets/data/walletsData.js`                                | all copy and money helpers                                                                           |
| `wards/tabs/WalletTab.jsx`                                   | now live for Abena (store) and opens the dialogs                                                     |
| `tests/e2e/parent-wallets.spec.js`                           | 15 frame-copy checks + 6 interaction checks                                                          |

Assets added (`src/assets/parent/`): `wallets-icon-wallet`, `wallets-arrow-in`, `wallets-arrow-out`, `wallets-check`, `wallets-hourglass`, `wallets-spot-phone`, `wallets-spot-failed`. Reused: `help-spot-salary` (the coins art), `link-shield-red`, `abena.webp`, `elliot.webp`.

## Frame → URL

Diff = `cmp.mjs` overall % at viewport 1728 × 1065 (frame height − 52). Dialog frames are dominated by the page behind the scrim.

| Frame                         | Figma id       | URL (`/parent/wallets` +)               | Diff   |
| ----------------------------- | -------------- | --------------------------------------- | ------ |
| PWa-01 page                   | `10034:151435` | —                                       | 2.31 % |
| PWa-02 approve                | `10034:152108` | `?modal=approve`                        | 2.30 % |
| PWa-02c approval error        | `10077:19347`  | `?modal=approve-error`                  | 2.54 % |
| PWa-03 approved               | `10042:530`    | `?toast=approved`                       | 2.33 % |
| PWa-04 decline                | `10042:973`    | `?modal=decline[&wreason=talk&wnote=…]` | 3.04 % |
| PWa-04b declined              | `10056:3754`   | `?toast=declined`                       | 2.29 % |
| PWa-07 expired                | `10053:2607`   | `?view=expired`                         | 2.27 % |
| PWa-05 limits                 | `10042:2958`   | `?modal=limits`                         | 2.16 % |
| PWa-05b limits saved          | `10056:4078`   | `?toast=limits-saved`                   | 2.10 % |
| PWa-06 top up                 | `10053:530`    | `?modal=topup[&wamount=50&wnote=…]`     | 3.08 % |
| PWa-06b approve on phone      | `10056:155603` | `?modal=topup-phone[&wamount=50]`       | 3.43 % |
| PWa-06c top-up done           | `10056:155946` | `?toast=topup-done`                     | 2.25 % |
| PWa-06d top-up failed         | `10077:19695`  | `?modal=topup-error[&wamount=50]`       | 3.28 % |
| PWa-08 Elliot asks            | `10053:2986`   | `?modal=open-wallet`                    | 3.77 % |
| PWa-08b Elliot's wallet open  | `10056:156342` | `?toast=elliot-open`                    | 2.22 % |
| PW-12 Wallet tab (regression) | `10057:66907`  | `/parent/wards/abena?tab=wallet`        | 3.03 % |

The `wallets` params are `modal`, `view`, `toast` (own values only) and `w…` drafts, so the ward page keeps its own `modal` values (visibility, unlink, opt-out…).

## Flow

- **Approve**: pays the cash balance first, the rest in Cycles (10 Cycles = GHS 1). GHS 90 from GHS 85 + 50 Cycles leaves GHS 0.00 and 130 Cycles, as PWa-03 draws. Toast "Payment approved".
- **Decline** (from the row or from the approve dialog): reason chips fill an editable note; toast has **Undo**, which restores the request.
- **Limits**: Save updates the Limits card and the Wallet tab's "of GHS … limit".
- **Top up**: Send → "Approve on your phone" → "I've approved it" → balance rises + toast. "Cancel top up" / X closes.
- **Elliot**: his card opens PWa-08; "Open Elliot's wallet" turns the card into "Elliot's Starter wallet" + toast.

## ⚠️ Assumptions (not drawn in Figma)

- The approval error (PWa-02c) and top-up failure (PWa-06d) are reachable only from their frame URLs; the mock never fails. "Try again" approves / returns to "Approve on your phone".
- Elliot's card is a button (no control is drawn there). Top-up is started from the ward page's Wallet tab, as PW-12 draws it; the wallets page has no top-up button.
- Reason chips on the decline dialog fill the note with a line the parent can edit (only the first is drawn).
- Limits and amount fields show a message for 0 / empty / monthly below ask-above; Figma draws no field errors.
- "Pay from" is a read-only field (one saved MoMo number).
- Elliot's Wallet tab keeps wardsData rows (store is Abena-only); his opened wallet shows only on the wallets page.

## Figma inconsistencies (reproduced as drawn)

- Toast PWa-03 says "paid GHS 65 from her balances and 50 Cycles" while the wallet held GHS 85.00 (the approve dialog says GHS 85.00 + 50 Cycles). Toast copy kept as drawn; the arithmetic follows the dialog.
- PWa-08b toast says "GHS 6" (a text read said "GHS 6!" from the render; the text node is "GHS 6").
- Row card gap is 14 in PWa-03 / 04b and 16 in PWa-01 / 07; both reproduced.

## Verification (2026-10-28)

- 15 frames pixel-diffed (table above, all 2.1–3.8 %, font metrics); behaviour script 61/61 (flows, frame texts, no overflow or text < 11.5px at 320 / 390 / 768 / 1100); `parent-wallets.spec.js` + `parent-flows` + `parent-review` 57/57 on a private build; eslint + prettier + build clean.
- axe: 0 violations at 390; at 1440 only the shell's four known contrast items (search placeholder, "EN", sidebar greys), which match Figma.

## Consolidation candidates

- The red callout (`#fcece9`, 1px `#c0392b` at 25 %, shield + title + body) is now in `ApproveDialog`, `TopUpFailedDialog` and `link/LinkCodeDialog`: one `ui/Callout`.
- The dialog top row (80px spot art + close) is repeated in `TopUpDialogs`, `OpenWalletDialog` and the ward dialogs.
- The request row and `wards/tabs/TabRow` / `WalletTab` payment rows are lookalikes.
